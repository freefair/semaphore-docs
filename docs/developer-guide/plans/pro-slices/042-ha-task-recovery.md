# Slice 042 — HA Task Recovery

When a server node dies, another node identifies its orphaned task control work and safely resumes reconciliation without duplicating execution.

| Field | Value |
|---|---|
| Selection | E01 |
| Depends on | 013, 040–041 |
| Primary paths | task ownership repository, runner reconciler, HA coordinator, task diagnostics UI |
| Out of scope | Guaranteeing recovery from an executor that provides no stable execution identity |

## Implementation

- [x] Persist task-control owner boot identity, lease fencing token, executor/runner execution identity, and last observed progress.
- [x] Renew ownership only while the node is ready and relinquish it before drain completes.
- [x] Let a new owner claim expired work with a higher fencing token and reject writes from the former owner.
- [x] Query the executor or runner by stable execution identity before deciding to observe, cancel, retry, or fail a task.
- [x] Never start a replacement solely because a heartbeat was missed; require evidence that the original execution is absent or terminal.
- [x] Quarantine ambiguous executions for operator action instead of risking duplicate infrastructure changes.
- [x] Display ownership transfer, recovery decision, evidence, and available safe action in task diagnostics.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: ownership/fencing state machine, evidence decisions, ambiguity, and stale-writer rejection |
| Integration | Required: two-node kill tests during queued/running/canceling/completing states with real runner control fixtures |
| API | Required: ownership/recovery diagnostics, retry-safe action, stale owner, ambiguous execution, and permission contracts |
| UI | Required: component tests plus browser evidence for automatic recovery and quarantined ambiguous execution |

- [x] Node loss does not create a second execution while the first may still be running.
- [x] A recovered task reaches the same terminal result visible from any node.
- [x] Ambiguity is explicit and actionable rather than converted into a misleading terminal state.
