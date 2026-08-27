# Project Runner Health and History

Project operators can inspect the latest runner process report and completed assignment history without receiving runner authentication material.
The core owns the report protocol and persistence, while the replaceable enhanced module owns project-scoped authorization and presentation endpoints.

## Contents

- [Runner Report Protocol](#runner-report-protocol)
- [Health Semantics](#health-semantics)
- [Assignment Identity](#assignment-identity)
- [HTTP Contract](#http-contract)
- [Security](#security)
- [User Interface](#user-interface)
- [Verification](#verification)

## Runner Report Protocol

Every authenticated runner poll may include the following bounded headers:

| Header | Meaning | Bound |
|---|---|---|
| `X-Runner-Started-At` | Process start in RFC 3339 format | One timestamp |
| `X-Runner-Version` | Runner build version | 128 bytes |
| `X-Runner-Platform` | Runtime OS and architecture, for example `linux/amd64` | 128 bytes |
| `X-Runner-Current-Load` | Number of jobs held by the runner process | Integer from `0` through `100000` |

Older runners remain compatible because omitted health headers preserve the previously stored values.
An invalid bounded report returns `400` and is not persisted.
The server persists the complete valid report together with the new `touched` timestamp in one runner update.

Migration `2.20.4` adds `runner.version`, `runner.platform`, and `runner.current_load`.
These fields are operational metadata and are excluded from backup serialization.

## Health Semantics

The health projection returns the latest report plus values derived at request time.
It never stores a continuously changing uptime counter.

| Field | Derivation |
|---|---|
| `uptime_seconds` | Current server time minus the latest `started_at`, clamped to zero for clock skew |
| `heartbeat_age_seconds` | Current server time minus `last_heartbeat`, clamped to zero for clock skew |
| `heartbeat_timeout_seconds` | Effective `runners.offline_timeout_sec` configuration |
| `heartbeat_state` | `online`, `offline`, or `webhook` |
| `current_load` | Latest bounded runner report |

A poll-based runner is online through the exact configured heartbeat boundary and offline immediately after it.
A new `started_at` value replaces the prior process start, so a runner restart resets displayed uptime without deleting assignment history.
A webhook runner uses the explicit `webhook` heartbeat state because webhook delivery does not require runner polling.
The existing dispatch status remains online for webhook runners.

## Assignment Identity

Migration `2.20.4` adds nullable `task.runner_id_snapshot` and backfills it from live assignments.
Remote dispatch stores `runner_id_snapshot` and `runner_name` at the same time as the live `runner_id` foreign key.
Deleting a finished runner may clear the foreign key, but the stable ID and name snapshots remain.

Task list projections expose the stable snapshot as `used_runner_id` and `used_runner_name`.
Runner history queries use `runner_id_snapshot`, so restart and deletion do not detach completed assignments from their historical runner identity.

## HTTP Contract

Both endpoints require an authenticated project member, project access, and read access to the active `project_runners` capability.
The health endpoint additionally requires the runner to exist in the requested project.
History is resolved from project-scoped task snapshots and intentionally remains queryable after runner deletion.

| Operation | Route | Success |
|---|---|---|
| Read current health | `GET /api/project/{project_id}/runners/{runner_id}/health` | `200` with `RunnerHealth` |
| Read completed assignments | `GET /api/project/{project_id}/runners/{runner_id}/history?count=20&before={task_id}` | `200` with a cursor page |

`count` defaults to `20` and is capped at `100`.
`before` is the last returned task ID from the previous page.
The response sets `X-Has-Next` and returns the same information in `has_more` and `next_before`.

```json
{
  "items": [
    {
      "task_id": 481,
      "template_id": 17,
      "template_name": "Deploy",
      "status": "success",
      "runner_id": 9,
      "runner_name": "production-runner",
      "created": "2026-08-27T09:00:00Z",
      "start": "2026-08-27T09:00:05Z",
      "end": "2026-08-27T09:01:11Z"
    }
  ],
  "has_more": true,
  "next_before": 481
}
```

## Security

Health and history use dedicated allowlisted DTOs.
They do not serialize runner tokens, registration hashes, registration expiry, public keys, task secrets, arguments, environment payloads, or logs.
Project ID is part of every history query, so another project's runner ID returns an empty page rather than cross-project metadata.

Health and history reads use the typed audit actions `project_runner_health` and `project_runner_history`.
Audit fields contain runner and project identifiers, outcomes, and allowlisted reasons only.

## User Interface

The project runner table provides a health-and-history action for every project runner.
The dialog presents version, platform, process start, derived uptime, last heartbeat, effective boundary, current load, and completed assignments.

Offline text includes both the measured heartbeat age and configured boundary.
Webhook runners state that heartbeat polling is not required.
Task details render the retained runner ID and display name together, including after runner deletion.

## Verification

Run the contract, backend, clean-room enhanced, and frontend checks with:

```bash
GOWORK="$PWD/test/edition-contract/go.work" \
  go run /tmp/semaphore-runner-health-history-contract.go
go test ./db ./db/sql ./services/runners ./services/server ./services/tasks ./api/runners ./api ./pro_interfaces -count=1
(cd test/edition-contract/enhanced && go test ./... -count=1)
(cd web && yarn eslint \
  src/components/RunnerHealthDialog.vue src/components/TaskDetails.vue \
  src/views/Runners.vue src/lang/en.js tests/unit/runner-health-history.spec.js)
(cd web && yarn build)
```

Browser acceptance opens the health dialog for online, offline, restarted, and webhook-backed fixtures and verifies completed assignment history plus console health.
