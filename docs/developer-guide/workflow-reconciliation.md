# Workflow Reconciliation

An Enhanced workflow run has a durable desired state in addition to its observed execution status.

This separation lets a stop request survive a process restart and lets the reconciler rebuild progress from immutable run snapshots and SQL node state instead of volatile callbacks.

## Run State

| Field | Values | Owner | Purpose |
|---|---|---|---|
| `status` | `pending`, `queued`, `running`, `approval`, `stopping`, terminal statuses | Workflow progression | The current observed run state. |
| `desired_state` | `running`, `stopping`, `stopped` | Stop request and stop reconciliation | The durable operator intent. |
| `reconciliation_state` | `healthy`, `recovering`, `quarantined` | Reconciler | The operational state of automatic recovery. |

`desired_state=stopping` is written before cancellation work starts.

The reconciler turns it into `desired_state=stopped` and the terminal observed status `canceled` after it has canceled pending approval requests, stopped run tasks, and finalized every unfinished run node.

The SQL node claim includes the run's desired state as a condition.

Once a stop request is durable, a late completion callback or restart scan cannot claim a pending downstream node.

The same condition prevents opening a new approval request after the stop boundary.

## Recovery and Diagnostics

The workflow reconciler scans nonterminal runs on startup and at its bounded interval.

For each run it reloads durable node state, synchronizes task outcomes, recomputes readiness from the immutable definition snapshot, and uses the existing conditional node transitions as the at-most-once boundary.

Transient reconciliation failures use exponential backoff from the configured interval.

After three consecutive failures, the run is quarantined and omitted from automatic scans until an operator retries it.

The run row stores the attempt count, the next retry time, the quarantine time, and a bounded diagnostic message.

Diagnostics are whitespace-normalized, limited to 512 bytes without breaking UTF-8, and use the existing server-side redaction rules before they reach the API.

Reconciliation updates only these diagnostic columns.

It must never overwrite a concurrent `desired_state` or observed status transition with a stale run snapshot.

## HA Ownership and Fencing

Enhanced HA installations serialize each run's progression with one row in `cluster__workflow_reconciliation`.
The row is keyed by project and workflow run and stores the current boot owner, previous owner, fencing token, database-time lease expiry, transfer history, and last successful reconciliation time.

The reconciliation sequence is:

1. Claim or renew the run lease using database server time.
2. Reload task results, approval decisions, the desired state, and every node from SQL.
3. Apply progression writes through the fenced repository boundary.
4. Record the successful reconciliation and release the lease.

Task callbacks and approval handlers never carry authoritative planner state between processes.
They first persist the task or approval fact, then invoke the same reconciliation path as the periodic scanner.
Lost, reordered, or duplicate live events therefore affect latency only; a later scan derives the same readiness from SQL.

Every expired reclaim advances the fencing token, including a reclaim by the same boot process.
Transfer history advances only when the boot identity changes.
This distinction invalidates a paused goroutine without reporting a routine same-process reclaim as failover.

The following transitions verify the owner and fencing token in the same database transaction or conditional statement as the write:

- node claim and logical task creation;
- approval request opening and approval-node finalization;
- planner-node finalization;
- run-status finalization.

Logical task creation additionally locks and advances the ownership row's operation sequence before inserting the task.
Together with the unique workflow run/node boundary, this prevents two owners from creating distinct tasks for one node.
Approval opening uses its existing unique correlation boundary in the same way.

The active-run scanner orders candidate rows per project, then interleaves projects round-robin.
It excludes quarantined and terminal runs.
Cluster progression health uses the same nonterminal boundary so historical released leases cannot inflate lag indefinitely.

Drain is a composite operation across task recovery and workflow progression workers.
It rejects new local claims, waits for claims and active transitions to finish, releases the current leases, and then publishes the durable Draining state.
If a later worker or the SQL drain update fails, previously drained workers resume in reverse order.

## Operator API

The existing project workflow-run authorization (`Can run project tasks`) protects both routes.

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/project/{project_id}/workflows/{workflow_id}/runs/{run_id}/stop` | Persist a stop request and reconcile cancellation. Repeated requests are idempotent. |
| `POST` | `/api/project/{project_id}/workflows/{workflow_id}/runs/{run_id}/retry-reconcile` | Clear quarantine diagnostics and return the run in `recovering` state for the next scan. |

Run detail and list payloads include `desired_state`, `reconciliation_state`, attempt count, redacted last error, next retry time, and quarantine time.

They also include `reconciliation_ownership` when an ownership row exists.
This value-free object contains boot identities, fence and lease timestamps, lease age, transfer count, last reconciliation time, lag, and `recovered`.
It contains no workflow parameters, task output, approval comments, credentials, or execution environment values.

The administrator-only cluster summary includes `coordinator.workflow_progression` with current and expired ownership counts, transfer count, maximum nonterminal lag, and the database observation time.

The retry operation does not rerun a terminal workflow and does not recreate a task or approval.

## UI Boundary

The existing workflow run view displays a warning state while stopping or recovering.

For a quarantined run it shows the bounded diagnostic and offers the retry action to users with the existing run permission.

The view continues polling while the durable status is `stopping`.

No Community routes, navigation, or shared host components change.

## Storage

Migration `v2.20.21` adds `desired_state` to `project__workflow_run`.

Migration `v2.20.22` adds the reconciliation state, attempts, diagnostic, retry time, quarantine time, and the active-scan index.

Migration `v2.20.28` creates `cluster__workflow_reconciliation`, its lease index and transfer fields, and adds `progression_fencing_token` to `project__workflow_run_node`.
The rollback removes the node fence before dropping the ownership table.

All three migrations provide rollback scripts.

## Related Documents

- [Workflow Approvals](workflow-approvals.md) explains immutable approval requests and their cancellation semantics.
- [Conditional Parallel Workflows](workflow-conditional-parallel.md) explains immutable node readiness and conditional SQL claims.
- [ADR 0005: Snapshot and Reconcile Workflow Runs](adr/0005-snapshot-and-reconcile-workflows.md) defines the broader SQL-authority model.
