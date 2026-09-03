---
sidebar_position: 24
title: Policy Guardrails
description: Versioned global and project execution policies with deterministic allow, warn, and deny findings.
---

# Policy Guardrails

- [Policy model](#policy-model)
- [Fields and operators](#fields-and-operators)
- [Evaluation and admission](#evaluation-and-admission)
- [Governance](#governance)
- [API](#api)
- [Security and bounds](#security-and-bounds)
- [Verification](#verification)

Policy guardrails are an Enhanced execution-admission layer for tasks and workflows.
Administrators publish immutable global or project policy revisions, and the shared execution planner returns the matching allow, warn, or deny findings before enqueue.

Community keeps its existing execution behavior.
When the `policy_guardrails` capability is unavailable, the governance UI is absent and the shared task paths have no Enhanced runtime dependency.

## Policy model

A policy is one bounded YAML document with schema version `1` and at most 32 rules.
Rules are normalized by ID, conditions are normalized by their typed representation, and the compiler produces a canonical content fingerprint.

```yaml
version: 1
rules:
  - id: review-manual-production
    effect: warn
    severity: high
    message: Review manual production runs before confirmation.
    remediation_url: https://docs.example.com/runbooks/manual-production
    match: all
    conditions:
      - field: task.source
        operator: equals
        string_value: manual
      - field: environment.ids
        operator: contains_any
        integer_values: [41, 42]
```

Each rule contains the following fields:

| Field | Contract |
|---|---|
| `id` | Unique lowercase ID matching `[a-z][a-z0-9-]{0,62}`. |
| `effect` | `allow`, `warn`, or `deny`. |
| `severity` | `info`, `low`, `medium`, `high`, or `critical`. |
| `message` | Required single-line message, at most 512 bytes. |
| `remediation_url` | Optional HTTPS URL without credentials or a fragment, at most 2,048 bytes. |
| `match` | `all` requires every condition; `any` requires at least one condition. |
| `conditions` | Between 1 and 32 typed predicates. |

The compiler rejects unknown or duplicate mapping keys, multiple documents, anchors, aliases, merge keys, and non-core YAML tags.
It does not accept regular expressions, CEL expressions, callbacks, or executable extensions.

## Fields and operators

The input is an explicit metadata allowlist.
It describes identity, shape, placement, executor, credential references, and the database evaluation time without including task arguments, environment values, credential material, repository credentials, or other secret values.

| Value kind | Fields |
|---|---|
| String | `task.application`, `task.source`, `inventory.type`, `workflow.node_kind`, `workflow.trigger_source`, `runner.selected_scope`, `runner.selected_executor`, `executor.type`, `image.reference_kind`, `image.digest`, `time.weekday` |
| Integer | `task.template_id`, `task.argument_key_count`, `task.input_key_count`, `inventory.id`, `inventory.runner_tag_count`, `environment.count`, `workflow.id`, `workflow.revision`, `workflow.node_id`, `runner.selected_id`, `runner.candidate_count`, `credential.count`, `time.minute_of_day` |
| Boolean | `task.inventory_override`, `task.branch_override`, `task.commit_override`, `inventory.present`, `workflow.present`, `workflow.cross_project`, `image.present` |
| String list | `runner.requested_tags`, `credential.scopes`, `credential.binding_targets` |
| Integer list | `environment.ids`, `credential.ids` |

`equals` accepts one scalar of the field's type.
`one_of` accepts a non-empty list for a string or integer scalar field.
`contains_any` and `contains_all` accept a non-empty list for a list field.
`lt`, `lte`, `gt`, and `gte` accept one integer.
`present` and `absent` accept no value and test whether the selected metadata field is available.

Exactly one typed payload key is allowed for every operator other than `present` and `absent`.
Use `string_value`, `integer_value`, `boolean_value`, `string_values`, or `integer_values` as required by the selected field and operator.

## Evaluation and admission

Active global policy is evaluated before active project policy, and matching findings inside each scope are ordered lexically by rule ID.
All matching findings are retained.
Any deny finding blocks the execution; allow and warn findings remain visible but cannot override a deny.

The repository supplies one database timestamp while reading the active revisions under its transaction boundary.
Time predicates therefore use authoritative UTC database time rather than an application-node clock.
The input fingerprint intentionally excludes that timestamp while retaining the complete value-free execution metadata.

Manual task and workflow previews include the exact policy revisions, rule IDs, effects, severities, messages, and safe remediation URLs.
Final starts claim a fresh database-timed evaluation and compare the resulting policy component with the reviewed preflight.
Headerless API clients still pass through the same admission layer and cannot bypass a deny finding.

Schedules, integrations, autorun, workflow triggers, and delayed workflow nodes use the same admission boundary.
A workflow start claims the workflow root and every task node as one bounded transaction before the run is persisted.
The immutable root and node claims are then reused for delayed and HA-fenced node dispatch instead of evaluating mutable policy again.

Every admitted task, workflow run, and workflow task carries the immutable evaluation reference that authorized it.
An evaluator or repository error fails closed before durable execution persistence.

## Governance

Project governance uses the existing Project Settings page.
Global governance uses the existing Audit Webhook administration page, whose navigation entry also serves policy-only global roles.
Both scopes reuse one compact component; no policy-specific route or navigation section is added.

The component supports draft editing, validation, fixture evaluation, bounded impact preview, revision diff and history, evaluation history, publication, and reasoned rollback.
Project fixture and impact inputs must name the project from the route.
The global endpoint may evaluate fixtures for any positive project ID but cannot select a governance scope from the body.

Administration and rollback are independent permissions:

| Scope | Manage permission | Break-glass permission |
|---|---|---|
| Project | `project.policy_guardrails.manage` | `project.policy_guardrails.rollback` |
| Global | `global.policy_guardrails.manage` | `global.policy_guardrails.rollback` |

Publishing compiles the current draft and creates an immutable active revision only when validation succeeds and the expected draft revision still matches.
Rollback requires a separate permission, a target revision, the current expected draft revision, and a non-empty single-line reason of at most 512 bytes.
Rollback creates and activates a new revision; it never mutates or deletes revision history.

Draft save, publish, rollback, invalid mutation input, and mutation failures produce typed value-free audit records.
Audit provenance contains only the derived scope and bounded revision, never policy source, fixture data, rollback reason, evaluation input, or secret-bearing values.

## API

All endpoints require authentication, the `policy_guardrails` capability access shown below, and the matching manage or rollback permission.
Replace `{base}` with `/api/policy-guardrails` for global governance or `/api/project/{project_id}/policy-guardrails` for project governance.

| Operation | Endpoint | Capability access | Result |
|---|---|---|---|
| Read draft and active revision | `GET {base}` | `read` | Draft plus optional active revision. |
| Save draft | `PUT {base}/draft` | `write` | Next draft revision. |
| Validate source | `POST {base}/validate` | `write` | Validation issues, rule count, and canonical fingerprint. |
| Test fixture | `POST {base}/test` | `execute` | One value-free evaluation. |
| Diff revisions | `GET {base}/diff?from_revision=N&to_revision=N` | `read` | Added, removed, and changed rule IDs. |
| Publish draft | `POST {base}/publish` | `write` | New immutable active revision. |
| Preview impact | `POST {base}/impact` | `execute` | Up to 100 evaluations plus allow/deny totals. |
| List revisions | `GET {base}/revisions?count=25&before=N` | `read` | Newest revisions first. |
| List evaluations | `GET {base}/evaluations?count=25&before=N` | `read` | Newest immutable evaluations first. |
| Roll back | `POST {base}/rollback` | `write` plus rollback permission | New revision copied from the selected source revision. |

Writes use optimistic concurrency:

```json
{
  "source_yaml": "version: 1\nrules: []\n",
  "expected_revision": 3
}
```

Publish uses `expected_draft_revision`.
Rollback uses `revision`, `expected_draft_revision`, and `reason`.
Revision conflicts return HTTP `409` with `POLICY_GUARDRAIL_REVISION_CONFLICT`; malformed input returns HTTP `400`, oversized requests return HTTP `413`, hidden revisions return HTTP `404`, and unexpected storage or evaluator failures return HTTP `500` without raw error details.
Community registers the same route shape and returns `404`, so protected Enhanced data is not disclosed.

## Security and bounds

| Limit | Maximum |
|---|---:|
| YAML source | 64 KiB |
| Rules | 32 |
| Conditions per rule | 32 |
| Conditions per document | 256 |
| Values in one list predicate | 32 |
| One string value | 256 bytes |
| Findings per evaluation | 64 |
| Metadata items per bounded collection | 256 |
| Impact inputs | 100 |
| History page | 100 |
| Rollback reason | 512 bytes |
| Workflow admission batch | 201 inputs |

Compiled policies are immutable typed data.
Evaluation performs no network or filesystem access and has no callback mechanism.
The compiler rejects ambiguous YAML before typed decoding, and all JSON endpoints reject unknown fields and trailing documents.
The server derives scope and actor from authenticated route context rather than accepting either field from mutation bodies.

## Verification

```bash
go test ./db ./pro_interfaces ./services/tasks ./api -count=1
(cd test/edition-contract/enhanced && go test ./db/sql ./services/server ./api -count=1)
(cd web && npm run lint)
(cd web && npm run test:unit)
(cd web && VUE_APP_BUILD_TYPE=pro_selfhosted VUE_APP_EDITION=enhanced npm run build)
```

Browser acceptance covers draft save, validation, fixture allow/warn/deny, impact preview, publish, diff and history, reasoned rollback, warning display, denied task start, and a headerless denied start.
