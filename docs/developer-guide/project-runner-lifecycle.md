# Project Runner Lifecycle

Project administrators can edit, activate, deactivate, clear, re-register, and safely delete project runners through the enhanced module.
The backend owns every state transition and rejects destructive changes while unfinished tasks are assigned to the runner.

## Contents

- [Lifecycle states](#lifecycle-states)
- [HTTP contract](#http-contract)
- [Assignment conflicts](#assignment-conflicts)
- [Cache-clear acknowledgement](#cache-clear-acknowledgement)
- [Deletion and task history](#deletion-and-task-history)
- [Authorization and audit](#authorization-and-audit)
- [Verification](#verification)

## Lifecycle States

The UI derives one lifecycle state for each project runner.
The table is ordered by precedence, so an in-flight mutation remains visible even if the persisted runner has another underlying state.

| State | Condition | Operational meaning |
|---|---|---|
| `deleting` | The delete request is in flight | Actions are disabled until the request succeeds or fails |
| `cache-cleaning` | A clear request is newer than the runner's latest poll | The next runner poll must acknowledge the request |
| `pending` | The runner has no authentication token | Registration has not completed, or registration was reset |
| `inactive` | The runner is registered but disabled | Dispatch excludes the runner |
| `registered` | The runner is registered and active | The runner is eligible for dispatch according to tags and liveness |

Online and offline remain connection states and are displayed separately from the lifecycle state.
Project-runner edit forms do not expose the generic `active` field; activation uses the dedicated lifecycle endpoint so normal edits cannot bypass assignment checks.

## HTTP Contract

All routes require an authenticated project administrator, `CanManageProjectResources`, and write access to the active `project_runners` capability.
Runner middleware resolves both `project_id` and `runner_id`, so cross-project access remains a non-disclosing `404`.

| Operation | Route | Success |
|---|---|---|
| Edit mutable settings | `PUT /api/project/{project_id}/runners/{runner_id}` | `204` |
| Activate or deactivate | `POST /api/project/{project_id}/runners/{runner_id}/active` | `204` |
| Reset registration | `POST /api/project/{project_id}/runners/{runner_id}/registration-token` | `200` with one-time `registration_token` |
| Request cache clear | `DELETE /api/project/{project_id}/runners/{runner_id}/cache` | `204` |
| Delete runner | `DELETE /api/project/{project_id}/runners/{runner_id}` | `204` |

An edit accepts name, tags, default placement, webhook, and maximum parallel tasks.
It preserves project binding, authentication token, registration material, and active state from the stored runner.
Activating an unregistered runner returns `400`; the runner must complete registration first.

## Assignment Conflicts

Deactivation, registration reset, and deletion are destructive because they can make assigned work unreachable.
The SQL mutation succeeds only when no task assigned to that runner has an unfinished status.
The check and mutation run atomically, preventing a time-of-check/time-of-use gap.

An unsafe request returns `409` with every blocking task ID and status:

```json
{
  "error": "PROJECT_RUNNER_ASSIGNMENTS_ACTIVE",
  "message": "Runner has unfinished task assignments",
  "runner_id": 17,
  "assignments": [
    {
      "task_id": 481,
      "status": "running"
    }
  ]
}
```

The UI formats these assignments as actionable task references and keeps the original active, registration, and runner records unchanged.

## Cache-Clear Acknowledgement

A cache-clear request records `cleaning_requested` and is safe to repeat.
On the next authenticated runner poll, the response contains `clear_cache: true` and the project ID when the request is not older than the previous `touched` timestamp.
The poll then updates `touched`; subsequent polls return `clear_cache: false` until another clear request is recorded.
Equal request and heartbeat timestamps are treated as pending, and the acknowledgement is stored strictly later than the request so second-precision SQL dialects do not lose or repeat the clear.

This timestamp protocol makes the pending state observable in the project runner list without adding an independent acknowledgement table.
Repeated API requests remain idempotent because they only advance the request timestamp.

## Deletion and Task History

Deleting an idle runner snapshots its name and stable ID into every task that references it before removing the runner record.
The live runner foreign key is then cleared by the database, while task-list reads use the snapshots as a fallback.
Historical task rows therefore continue to show a non-secret runner identity without retaining a live runner record.

Migration `2.20.3` adds the nullable `task.runner_name` snapshot column.
Migration `2.20.4` adds and backfills `task.runner_id_snapshot`.
Reads remain compatible with historical migration-test schemas that predate either column.
Current health and paginated assignment history are described in [Project Runner Health and History](project-runner-health-history.md).

## Authorization and Audit

Every lifecycle attempt is audited with project scope and a typed action:

| Mutation | Audit action |
|---|---|
| Edit | `project_runner_update` |
| Active transition | `project_runner_set_active` |
| Registration reset | `project_runner_registration_issue` |
| Cache clear | `project_runner_cache_clear` |
| Delete | `project_runner_delete` |

Successful mutations use outcome `allowed`.
Assignment conflicts use outcome `denied` with reason `active_assignments`; validation and persistence failures use stable allowlisted reasons.
Audit records contain runner and project IDs, never registration material, task payloads, tags, or request bodies.

## Verification

Run the backend, clean-room enhanced contract, and UI checks with:

```bash
go test ./db/sql ./services/server ./api ./api/runners ./pro_interfaces -count=1
(cd test/edition-contract/enhanced && go test ./api/projects -count=1)
(cd web && node_modules/.bin/eslint \
  src/views/Runners.vue src/components/RunnerForm.vue src/lang/en.js \
  tests/unit/runner-lifecycle.spec.js tests/unit/runner-registration.spec.js)
(cd web && NODE_OPTIONS=--localstorage-file=/tmp/semaphore-web-test-localstorage \
  node_modules/.bin/vue-cli-service test:unit --runInBand)
(cd web && yarn build)
```

The UI acceptance path creates or opens a project runner, edits it, deactivates it, requests a cache clear, resets registration, and deletes it.
Use a runner with an unfinished assignment to verify that destructive actions show the `409` task details without losing or changing the runner.
