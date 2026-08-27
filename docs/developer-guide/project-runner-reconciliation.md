# Project Runner Reconciliation

Runner reconciliation converts lost assignments into one deterministic result and prevents an older assignment from overwriting a replacement.
SQL owns the transition: process-local state and HA coordination may reduce duplicate work, but they cannot authorize a status change by themselves.
Initial selection and capacity reservation follow the [Project Runner Tag Placement](project-runner-placement.md) contract.

## Contents

- [Assignment generations](#assignment-generations)
- [Recovery policy](#recovery-policy)
- [Cancellation and race handling](#cancellation-and-race-handling)
- [Attempt history](#attempt-history)
- [HTTP and runner protocol](#http-and-runner-protocol)
- [Configuration](#configuration)
- [Verification](#verification)

## Assignment Generations

Every successful remote-runner assignment increments `task.assignment_generation` and creates one `task__runner_attempt` row.
The assignment records the runner ID and name, the assignment timestamp, and its generation.
Requeueing closes that attempt before a later dispatch creates the next generation, even when the same runner is selected again.

Runner polls and progress reports carry the generation next to the task ID.
Every progress transition uses a conditional SQL update matching all of these values:

- project and task ID;
- current task status;
- current runner or its immutable snapshot; and
- assignment generation.

A concurrent cancellation, reconciliation, or newer assignment changes at least one predicate.
The stale update then affects zero rows, its logs are discarded, and the runner receives the task ID in `terminated_jobs` so it stops its local execution.
Runners predating this protocol may finish a first-generation assignment with an omitted generation; generation `2` and later always require an explicit match.

## Recovery Policy

The policy distinguishes work that has not begun from work whose effects may already exist.
Timeout comparisons use controlled timestamps and trigger only after the configured boundary, not exactly at it.

| Task state | Runner condition | Result | Retry safety |
|---|---|---|---|
| `waiting`, `starting` | Poll runner is offline or missing | Requeue | Execution has not been acknowledged |
| `waiting`, `starting` | Webhook runner has not started before the task-fail timeout | Requeue | The startup grace elapsed without execution acknowledgement |
| `running`, `waiting_confirmation`, `confirmed` | Runner is missing, restarted, or silent past the task-fail timeout | Fail | Effects may already exist, so automatic retry is unsafe |
| `stopping`, `rejected` | Runner is missing, restarted, or offline | Stop | Cancellation converges instead of remaining in progress forever |
| Any terminal state | Any condition | Keep | Terminal states are immutable |

A webhook runner's old heartbeat does not immediately invalidate a fresh assignment because the webhook may still be starting the process.
Once it reports the task running, the normal running-task liveness policy applies.
A poll runner that has never reported is requeued while starting; a running or canceling assignment receives the configured task-fail grace before convergence.

The recovery reason is stored on the task and displayed at the top of task details.
Requeue reasons remain visible after a replacement succeeds, while a lost running assignment uses the same clear reason as the terminal task message.

## Cancellation and Race Handling

The task transition policy makes terminal states immutable and permits a canceling task to move only to `stopped` or `error`.
Runner progress and the reconciler both use the same assignment-aware conditional update.
Exactly one actor can therefore win a cancellation-versus-success or lost-runner-versus-late-result race.

Dispatch also uses a conditional assignment update requiring an unassigned `waiting` or `starting` task.
Two concurrent dispatchers cannot create two active attempts.
Runner capacity checks skip runners at `max_parallel_tasks`; a later poll can make a recovered runner eligible again without bypassing the assignment predicate.

## Attempt History

`task__runner_attempt` is append-only by generation apart from closing the active row with its terminal metadata.
Each row contains:

- generation and stable task/project scope;
- runner ID and name snapshots;
- assignment and end timestamps;
- outcome: `active`, `requeued`, `succeeded`, `failed`, or `stopped`; and
- the recovery reason when reconciliation closed the attempt.

Task details render this history in generation order with responsive rows.
Operators can see which runner lost an assignment, why it was recovered, and which replacement produced the final result.

Migration `2.20.5` adds the task generation, assignment timestamp, recovery reason, and attempt table.
Existing runner-attributed tasks are backfilled as generation `1` using their start or creation timestamp.

## HTTP and Runner Protocol

Project members who can read a task can read its assignment history:

```text
GET /api/project/{project_id}/tasks/{task_id}/runner-attempts
```

The task middleware resolves the task through the current project before the handler reads attempts, preventing cross-project history access.
The response is a JSON array ordered by generation.

The internal runner protocol adds `generation` to:

- each task in `new_jobs` through the task payload;
- each entry in `current_jobs`; and
- each job in the runner progress request.

The server continues returning HTTP `200` with `terminated_jobs` for stale or canceled local jobs.
This is intentionally a per-job response: one stale result does not reject unrelated progress in the same runner batch.

## Configuration

The server-side fleet settings are documented in the [Configuration Reference](../admin-guide/configuration.md):

| Setting | Purpose | Default |
|---|---|---:|
| `runners.offline_timeout_sec` | Requeue boundary for unacknowledged poll-runner assignments and cancellation convergence | 120 seconds |
| `runners.task_fail_timeout_sec` | Failure/startup-grace boundary for possibly executing tasks and webhook startup | 420 seconds |
| `runners.reconcile_interval_sec` | Frequency of reconciliation scans | 30 seconds |

`task_fail_timeout_sec` is clamped to at least `offline_timeout_sec`.

## Verification

Run the focused backend and database contracts with:

```bash
go test ./db/sql ./services/tasks ./services/runners ./api/runners ./api/projects -count=1
go test -race ./services/tasks ./services/runners ./api/runners ./db/sql -count=1
go run /tmp/semaphore-runner-reconciliation-contract.go
```

Run the focused UI checks with the repository's supported Node.js version:

```bash
cd web
npm run test:unit -- tests/unit/runner-reconciliation.spec.js tests/unit/runner-health-history.spec.js
node_modules/.bin/eslint src/components/TaskDetails.vue tests/unit/runner-reconciliation.spec.js
npm run build
```

Browser acceptance opens a recovered task on desktop and mobile widths and verifies the recovery alert, every attempt outcome, the terminal task state, and the absence of layout overflow.
