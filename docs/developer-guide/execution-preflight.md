---
sidebar_position: 22
title: Execution Preflight
description: Value-free task and workflow plans reviewed before enqueue.
---

# Execution Preflight

Execution preflight gives an authorized Enhanced user a short-lived view of the task or workflow plan that the server will recompute immediately before enqueue. The preview explains the definition, effective input names and sources, resource and credential references, command shape, executor image, and provisional runner placement without returning input or credential values.

## Contract

The shared contract lives in `pro_interfaces`. `ExecutionPreflightPlan` is an explicit response allowlist; persistence models are never serialized through the endpoint. `WorkflowExecutionPreflightPlanner` lets an Enhanced workflow implementation reuse the task planner without making Community depend on an Enhanced module.

The planner is read-only. It may inspect bounded database metadata, but it does not:

- create a task, workflow run, event, usage record, survey-secret record, lock, assignment, or runner reservation;
- decrypt an access key, environment secret, vault value, or global credential;
- contact a runner webhook, secret provider, Git server, image registry, or container control plane; or
- call the secret-populating task-runner path.

Placement candidates use stable reason codes such as `offline`, `capacity_exhausted`, `tag_mismatch`, and `executor_image_unsupported`. Existing human-readable placement explanations remain compatible.

## Preview and start

| Operation | Endpoint |
|---|---|
| Task preview | `POST /api/project/{project_id}/tasks/preflight` |
| Task start | `POST /api/project/{project_id}/tasks` |
| Workflow preview | `POST /api/project/{project_id}/workflows/{workflow_id}/preflight` |
| Workflow start | `POST /api/project/{project_id}/workflows/{workflow_id}/run` |

Preview accepts the same bounded input body and requires the same project, template or workflow, and start permissions as the corresponding start route. Task preview also requires template read permission because its plan contains definition and reference metadata; a run-only caller receives the same not-found response as any other hidden template. Preview additionally requires read access to the `execution_preflight` capability. Community reports that capability as unavailable and retains its existing start behavior.

The UI sends the reviewed `fingerprint` and opaque `review_token` in these headers:

```text
X-Semaphore-Preflight-Fingerprint
X-Semaphore-Preflight-Token
```

Existing API clients may omit both headers. Their start remains compatible, while the server still runs the planner before entering the existing enqueue path. Supplying only one header is invalid.

## Freshness and authority

The review token is not execution authority. Every start request passes the normal authorization middleware again and rebuilds the plan from current data. The stateless token is bound to the actor, project, intent, target definition, fingerprint, issue time, and expiry time. Its maximum lifetime is five minutes.

Private component digests cover definition, input, reference, placement, permission, capability, and policy decisions. Value-derived digests are HMAC-blinded before entering the readable token envelope. A changed dependency returns HTTP `409` with `stale_execution_preflight`, a bounded list of stable change codes, and a fresh value-free plan. The UI displays that plan and requires confirmation again.

After a reviewed task or workflow passes this check, the server persists the exact private, versioned execution snapshot that produced the accepted plan. Direct tasks hydrate from the task snapshot; workflow nodes carry their own snapshots so delayed nodes do not re-read mutable template, inventory, repository, or environment configuration. Snapshot fields are private database data and never enter API, audit, or token responses. Credential material is not copied into the snapshot: the pinned credential identities are resolved through the existing protected credential service at dispatch, preserving immediate rotation and revocation behavior.

A current denial returns HTTP `409` with `execution_preflight_denied`. Typical denial findings include a hidden reference, unavailable capability, policy denial, exceeded plan bound, or no eligible runner. Hidden references use a generic message and disclose no object name, owner, provider path, or underlying storage error.

## Bounds

The contract rejects or fails closed when a plan exceeds its fixed limits: 128 inputs, 256 references, 128 commands, 128 placements, 100 candidates per placement, 128 findings, 16 stale change codes, 2 KiB per display string, a 2 KiB review token, and a 1 KiB token payload. Preview performs no external metadata calls.

## Audit

Preview and reviewed start are distinct audit actions. Audit records contain only target identity, intent, canonical fingerprint, bounded reason/change codes, candidate count, and selected runner identity. Review tokens, request bodies, command arguments, URLs, paths, webhooks, and credential or input values are excluded.
