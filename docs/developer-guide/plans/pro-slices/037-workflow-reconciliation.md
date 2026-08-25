# Slice 037 — Workflow Reconciliation

An operator can stop a workflow, and interrupted workflow progression resumes safely after a process restart without duplicating tasks or approvals.

| Field | Value |
|---|---|
| Selection | P08 |
| Depends on | 031–036 |
| Primary paths | workflow reconciler, stop service/API, task cancellation integration, run UI |
| Out of scope | Cross-node HA ownership, delivered by slice 043 |

## Implementation

- [ ] Add a durable desired state separate from observed workflow state so stop requests survive process failure.
- [ ] Stop queued work, invoke real cancellation for running tasks, cancel pending approvals, and prevent new downstream nodes.
- [ ] Reconcile nonterminal runs from SQL on startup and at a bounded interval.
- [ ] Recompute readiness from immutable run state and conditional transitions rather than volatile in-memory callbacks.
- [ ] Define retryable reconciliation errors, bounded backoff, poison-run quarantine, and administrator-visible diagnostics.
- [ ] Make repeated stop and reconcile operations idempotent and safe during node completion races.
- [ ] Show stopping, stopped, recovering, and reconciliation-failed states with the affected node and next operator action.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: desired/observed state machine, readiness rebuild, stop races, retry classification, and quarantine |
| Integration | Required: process restart at every node state, real task cancellation, approval cancellation, and duplicate callback |
| API | Required: stop/status/retry-reconcile, repeated stop, terminal run, capability, and permission contracts |
| UI | Required: component tests plus browser evidence for stopping queued/running/approval runs and restart recovery |

- [ ] A stop request prevents all not-yet-created downstream tasks.
- [ ] Restarting the server can recover every nonterminal run from durable state alone.
- [ ] Recovery never creates a second task or approval for the same node attempt.
