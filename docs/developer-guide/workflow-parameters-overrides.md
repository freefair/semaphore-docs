# Workflow Parameters and Node Overrides

The Enhanced edition lets workflow authors declare typed run parameters and narrowly authorize task-level overrides.
Each run stores an immutable effective-input snapshot, while credential values remain outside workflow definitions, run rows, API responses, and browser state.

## Table of Contents

- [Parameter Definition Contract](#parameter-definition-contract)
- [Run Start API](#run-start-api)
- [Resolution Precedence](#resolution-precedence)
- [Node Override Policy](#node-override-policy)
- [Credential References](#credential-references)
- [Persistence and Retry Semantics](#persistence-and-retry-semantics)
- [UI and Compatibility Boundary](#ui-and-compatibility-boundary)

## Parameter Definition Contract

Workflow definitions expose parameters through the `parameters` array.
Names must match `^[A-Za-z_][A-Za-z0-9_]{0,63}$`, and a definition may contain at most 64 parameters.

```json
{
  "parameters": [
    {
      "name": "region",
      "description": "Deployment region",
      "type": "enumeration",
      "required": true,
      "default": "eu-west",
      "options": ["eu-west", "us-east"]
    },
    {
      "name": "replicas",
      "type": "integer",
      "minimum": 1,
      "maximum": 20
    },
    {
      "name": "deploy_token",
      "type": "secret_reference",
      "required": true,
      "secret_options": [
        {
          "access_key_id": 41,
          "label": "Deployment token"
        }
      ]
    }
  ]
}
```

The supported types are `string`, `integer`, `boolean`, `enumeration`, and `secret_reference`.
Strings support `min_length` and `max_length` and are capped at 4,096 bytes.
Integers support inclusive `minimum` and `maximum` bounds.
Enumerations require one to 64 unique non-empty options.
Secret references require one to 64 approved project-scoped shared string credentials and never accept plaintext.

Defaults use the parameter's normal JSON representation.
A secret-reference default, when present, contains only an approved `access_key_id` object.
Unknown fields in workflow definition and run-start payloads are rejected by the backend.

## Run Start API

`POST /api/project/{project_id}/workflows/{workflow_id}/run` accepts user parameter values and node overrides in one bounded request.
The existing project-scoped workflow-run permission remains authoritative.

```json
{
  "parameters": {
    "region": "us-east",
    "replicas": 4,
    "deploy_token": {
      "access_key_id": 41
    }
  },
  "node_overrides": {
    "17": {
      "inventory_id": 12,
      "environment_ids": [31, 32],
      "arguments": "[\"--check\"]",
      "git_branch": "release/2026-08"
    }
  }
}
```

Direct callers cannot supply internal trigger values.
Unknown parameter names, unknown request fields, unapproved resource IDs, forbidden task fields, malformed argument JSON, and invalid branch values fail before a run is created.
An `Idempotency-Key` continues to identify one run, so a retry returns or progresses the existing run without creating another snapshot.

## Resolution Precedence

Parameter resolution uses the following deterministic order, from lowest to highest precedence:

1. Definition default.
2. Trigger value supplied by an internal trigger adapter.
3. User value supplied by the authorized run caller.
4. Frozen node task parameters for a matching task environment key.

The start service validates and resolves the first three sources before inserting the run.
Node task parameters are already part of the immutable definition snapshot and win only for the task in which they are declared.
An explicit empty string is a valid user value for a string parameter when its length bounds permit it; it is not treated as an omitted value.

## Node Override Policy

Each task node stores an `override_policy` beside its frozen template reference.
The policy is an allow-list, not a set of default values.

```json
{
  "override_policy": {
    "inventory_ids": [12],
    "environment_ids": [31, 32],
    "credential_parameters": ["deploy_token"],
    "allow_arguments": true,
    "allow_branch": true
  }
}
```

Inventory overrides are available only when the referenced task template permits inventory changes.
Argument and branch overrides are available only when the template exposes the corresponding existing task-run override flag.
Environment IDs and inventory IDs must belong to the workflow project both when the definition is saved and when the run starts.
Credential parameter names must refer to declared `secret_reference` parameters.

The effective node override is frozen into the run-node row before dispatch.
Later edits to the definition, its allow-list, or its template cannot change a queued or retried node.
The backend applies the same allow-list for browser and direct API callers.

## Credential References

Workflow definitions and run inputs contain only credential IDs.
The immutable parameter snapshot stores the selected ID and a SHA-256 fingerprint derived from reference metadata, never the credential value.
The run API and audit panel expose only the reference ID, source, and fingerprint.

A task receives a secret-reference parameter only when its frozen node policy names that parameter in `credential_parameters`.
Unrelated workflow tasks do not resolve or receive the credential.
Immediately before each authorized task dispatch, the service reloads the project-scoped shared string credential, rechecks its type and ownership, decrypts it, and writes it through the existing task-secret channel.
This just-in-time lookup observes credential rotation between task dispatches without modifying the immutable run snapshot.

The resolved value is cleared from the temporary credential object after encoding and is not persisted in the task row.
Resolution fails closed when the reference is missing, moved, revoked, the wrong type, empty, or cannot be decrypted.
This behavior implements the execution-time boundary defined by [ADR 0006](adr/0006-resolve-secret-references-at-execution.md).

## Persistence and Retry Semantics

Migration `v2.20.18` adds parameter declarations to workflow definitions, node override policies to workflow nodes, effective parameter snapshots to workflow runs, and effective override snapshots to run nodes.
Legacy rows are backfilled with empty JSON objects or arrays, and rollback removes only the four additive columns.

Run creation stores parameter and override snapshots in the same workflow-run transaction.
Task creation always reads the frozen definition, parameter snapshot, and node override snapshot from the run.
Concurrent definition edits therefore affect only later runs.
An enqueue retry first looks up the task already attached to the run node and does not resolve or enqueue a duplicate task.

## UI and Compatibility Boundary

The existing workflow editor embeds compact parameter and node-policy components in its current metadata and selected-node panels.
The existing run buttons open a typed input dialog only when the workflow declares parameters or configurable overrides; workflows without inputs retain one-click start.
The existing run view adds one compact expansion panel for effective values, sources, node overrides, and redacted credential references.

These are narrow Enhanced hooks.
Project navigation, graph rendering, Community authentication, task details, and other upstream host structures remain unchanged.
The public core-to-enhanced interface change is versioned as contract `1.14.0`.
