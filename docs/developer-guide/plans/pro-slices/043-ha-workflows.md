# Slice 043 — HA Workflow Progression

A workflow continues to progress exactly once when callbacks and reconciliation occur on different server nodes.

| Field | Value |
|---|---|
| Selection | E01 |
| Depends on | 037, 040–041 |
| Primary paths | workflow ownership repository, workflow reconciler, HA coordinator, workflow run UI |
| Out of scope | Full failure-injection release gate, delivered by slice 044 |

## Implementation

- [x] Persist workflow reconciliation ownership with boot identity, renewable lease, and fencing token.
- [x] Treat task completion and approval decisions as durable facts that only wake reconciliation.
- [x] Acquire ownership before advancing a run and use conditional node-attempt creation to enforce exactly-once logical progression.
- [x] Transfer expired ownership and rebuild all readiness from SQL without relying on local event order.
- [x] Partition scanning fairly so one large project cannot starve other nonterminal runs.
- [x] Drain by stopping new ownership claims, completing bounded transitions, and releasing leases.
- [x] Expose current owner, lease age, transfer history, and reconciliation lag in run and cluster diagnostics.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: ownership/fencing, readiness replay, fairness, drain, and duplicate-event behavior |
| Integration | Required: concurrent reconcilers and node death during task completion, branch join, approval, and stop |
| API | Required: owner/lag diagnostics, recovered status, administrator retry, stale owner, and permission contracts |
| UI | Required: component tests plus browser evidence that one run remains coherent across owner transfer |

- [x] One node attempt produces at most one logical task or approval across owner changes.
- [x] Losing all live-event messages still converges from SQL state.
- [x] A draining node acquires no new workflow ownership.
