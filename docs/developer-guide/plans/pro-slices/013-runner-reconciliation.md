# Slice 013 — Lost Runner Assignments Reach a Deterministic Result

When a runner disappears, an operator sees the assignment requeued or failed according to an explicit policy, and late reports cannot overwrite the terminal result.

| Field | Value |
|---|---|
| Selection | P01c |
| Depends on | 010–012 |
| Primary paths | `services/tasks/runner_reconciler.go`, task state transitions, runner APIs |
| Out of scope | Cross-node HA ownership, delivered in Slice 042 |

## Implementation

- [x] Define timeout policy by queued, starting, running, canceling, and webhook-runner state.
- [x] Requeue only tasks whose execution semantics permit retry; fail unsafe tasks with a clear reason.
- [x] Use conditional SQL transitions and assignment generations to reject stale completion.
- [x] Reconcile runner restart, duplicate poll, busy response, cancellation, and late result races.
- [x] Show recovery reason and attempt history in task details.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: state/action matrix with controlled time |
| Integration | Required: concurrent reconciliation and late-report database races |
| API | Required: poll, cancellation, and stale-result contracts |
| UI | Required: component tests plus browser recovery reason and terminal state |

- [x] Every lost assignment converges to one terminal state or one live replacement.
- [x] An old runner cannot complete a reassigned task.
- [x] Recovery never creates two committed executions.

Implementation details and verification commands are recorded in [Project Runner Reconciliation](../../project-runner-reconciliation.md).
