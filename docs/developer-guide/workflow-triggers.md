# Workflow Triggers

The Enhanced edition can start one workflow through a manual action, a UTC schedule, an authenticated API request, or an authenticated webhook request.
Every trigger uses the same workflow-start service as a direct run, so permissions, definition validation, immutable input snapshots, and run idempotency remain consistent.

## Table of Contents

- [Trigger Resource Contract](#trigger-resource-contract)
- [Input Mappings](#input-mappings)
- [Management API](#management-api)
- [External Invocation API](#external-invocation-api)
- [Credentials and Idempotency](#credentials-and-idempotency)
- [Scheduled Occurrences](#scheduled-occurrences)
- [Authorization and Capability Gates](#authorization-and-capability-gates)
- [Persistence and Retry Semantics](#persistence-and-retry-semantics)
- [UI and Compatibility Boundary](#ui-and-compatibility-boundary)

## Trigger Resource Contract

A trigger belongs to exactly one project workflow and has an immutable type.
Names are limited to 128 bytes, each workflow may have at most 64 triggers, and each trigger may declare at most 64 input mappings.

| Type | Start boundary | Credential | Schedule |
|---|---|---|---|
| `manual` | Authenticated test action | None | None |
| `schedule` | Background UTC scheduler | None | Required five-field cron expression |
| `api` | Public API trigger route | Required opaque bearer credential | None |
| `webhook` | Public webhook trigger route | Required opaque bearer credential | None |

The resource stores its owner, enabled state, revision, input mappings, creation and update timestamps, and the last fire time and result.
Updates use optimistic revision checks and return `409 Conflict` when the submitted revision is stale.
The type and owner cannot be changed through an update request.

## Input Mappings

Mappings bind a workflow parameter either to a fixed typed value or to one explicitly named request field.
There is no implicit request-field passthrough.

```json
{
  "name": "Deploy API",
  "type": "api",
  "enabled": true,
  "input_mappings": [
    {
      "parameter": "region",
      "source": "request",
      "key": "target"
    },
    {
      "parameter": "confirmed",
      "source": "fixed",
      "value": true
    }
  ]
}
```

Fixed values use the parameter's normal JSON type and are validated against the current workflow definition.
Secret parameters accept only approved `secret_reference` objects; they never accept plaintext.
Request field names use the same bounded identifier syntax as workflow artifacts.
Schedule triggers cannot use request mappings because no request exists at the scheduled boundary.

The backend validates mappings both when the trigger is saved and immediately before it fires.
A later workflow-definition change can therefore make an old trigger temporarily invalid, but it cannot bypass the current parameter contract.

## Management API

All management routes are project-scoped and use the existing authenticated workflow middleware.

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/project/{project_id}/workflows/{workflow_id}/triggers` | List triggers. |
| `POST` | `/api/project/{project_id}/workflows/{workflow_id}/triggers` | Create a trigger and reveal a new external credential once when required. |
| `GET` | `/api/project/{project_id}/workflows/{workflow_id}/triggers/{trigger_id}` | Read one trigger. |
| `PUT` | `/api/project/{project_id}/workflows/{workflow_id}/triggers/{trigger_id}` | Update mutable trigger fields using `revision`. |
| `DELETE` | `/api/project/{project_id}/workflows/{workflow_id}/triggers/{trigger_id}` | Delete a trigger and its invocation records. |
| `PUT` | `/api/project/{project_id}/workflows/{workflow_id}/triggers/{trigger_id}/enabled` | Enable or disable a trigger using `revision`. |
| `POST` | `/api/project/{project_id}/workflows/{workflow_id}/triggers/{trigger_id}/rotate` | Revoke the current credential and reveal its replacement once. |
| `POST` | `/api/project/{project_id}/workflows/{workflow_id}/triggers/{trigger_id}/test` | Start the trigger through an authenticated test action. |
| `GET` | `/api/project/{project_id}/workflows/{workflow_id}/triggers/{trigger_id}/history` | Read paginated invocation history. |

Bodies are limited to 256 KiB and reject unknown fields or trailing JSON values.
History is ordered newest first and accepts the existing `count`, `before_id`, and `offset` retrieval parameters.

## External Invocation API

API and webhook triggers expose separate public routes so a credential cannot be used against the wrong trigger type.

```text
POST /api/workflow-triggers/{project_id}/{workflow_id}/{trigger_id}/api
POST /api/workflow-triggers/{project_id}/{workflow_id}/{trigger_id}/webhook
Authorization: Bearer swt_<opaque-value>
Idempotency-Key: <caller-controlled-key>
Content-Type: application/json
```

```json
{
  "inputs": {
    "target": "eu-west"
  }
}
```

Only fields named by request mappings are accepted under `inputs`.
The first successful request returns `201 Created`; a duplicate that resolves to the existing invocation and run returns `200 OK` with `duplicate: true`.
Missing or revoked credentials return `401 Unauthorized`, while disabled triggers and invalid mapped inputs fail before a new run is created.

Webhook signatures and replay-window policy are intentionally separate from this credential boundary and are delivered by Slice 073.

## Credentials and Idempotency

API and webhook credentials are opaque random values with the `swt_` prefix.
Only a domain-separated SHA-256 hash and a credential generation number are persisted.
The plaintext is returned only by create or rotate and is absent from later trigger, history, run, backup, and API payloads.

Rotation atomically increments the credential generation and replaces the stored hash.
The previous credential stops matching immediately.
Disabling a trigger leaves its credential material intact but prevents every direct or background start until the trigger is enabled again.

External idempotency keys are hashed before persistence and scoped to the trigger ID and credential generation.
The same caller key can therefore be reused safely after credential rotation or on another trigger.
The deduplication record expires after 24 hours; while retained, concurrent or retried delivery can create at most one invocation identity and one workflow run.

## Scheduled Occurrences

Schedule triggers use standard five-field cron expressions interpreted in UTC.
The scheduler evaluates the current UTC minute and derives a stable occurrence identity from the trigger ID, trigger revision, current workflow definition revision, and scheduled UTC instant.

Repeated scheduler passes over the same minute reuse that identity.
Changing the trigger or workflow definition creates a new identity for later occurrences without mutating an existing run.
Timezone-specific schedules remain outside this slice and are delivered by Slice 064.

## Authorization and Capability Gates

The backend requires the `workflow_triggers` capability for every management, external, test, and scheduled path.
Read access is required to list triggers and history, write access plus the existing project-resource permission is required to manage triggers, and execute access plus the current project-run permission is required to fire them.

External and scheduled starts execute as the trigger owner.
The service reloads the owner and their current project membership before every start, so removing run permission prevents future invocations without rewriting the trigger.
Administrators retain their existing project authorization behavior.

## Persistence and Retry Semantics

Migration `v2.20.19` adds project-scoped trigger and invocation tables plus a non-null trigger snapshot on workflow runs.
The invocation stores hashes or derived identities, the exact trigger and definition revisions, effective parameter metadata, status, result, actor, and optional run ID.
It never stores the raw bearer credential or caller idempotency key.

The service claims an invocation identity before calling the shared workflow-start service.
The claim atomically checks the trigger's current revision, enabled state, and credential generation in the same SQL operation that creates the invocation.
A completed credential rotation, disable, or trigger update therefore rejects any earlier in-flight request before it can create a run.
A later trigger mutation does not cancel an invocation that has already committed its durable claim.
A retry after a temporary start failure reuses the same invocation and workflow correlation ID.
The workflow service's existing correlation compare-and-set is the final authority that prevents a second run when a prior attempt committed but its response was lost.

Each started run stores the initiating trigger revision, type, owner, invocation ID, scheduled instant when applicable, trigger time, and immutable effective parameter snapshot.
Later trigger edits, rotation, deletion, or workflow-definition changes do not modify that run evidence.

## UI and Compatibility Boundary

The existing workflow view adds one capability-gated toolbar action and mounts one focused trigger dialog.
The dialog owns trigger CRUD, credential reveal, test input, history, and its responsive table/card rendering.
Project navigation, workflow routing, graph rendering, editor state, run controls, and Community host behavior remain unchanged.

The backend remains authoritative for capability and permission enforcement.
The UI gate only keeps unavailable actions out of the normal interface and does not replace server-side checks.
