# Slice 041 — Cross-Node Coordination

Any healthy server node can publish live events while cluster-wide scheduled work is claimed exactly once through durable authority.

| Field | Value |
|---|---|
| Selection | E01 |
| Depends on | 040 |
| Primary paths | HA coordinator interfaces, SQL lease repository, Redis event transport, scheduler, live UI transport |
| Out of scope | Task ownership recovery and workflow-specific reconciliation |

## Implementation

- [ ] Keep state transitions and schedule occurrence claims in conditional SQL transactions.
- [ ] Use Redis only for lossy wake-up and cross-node live-event fan-out, with SQL/API refresh as recovery after missed messages.
- [ ] Replace schedule-ID-only locking with a unique occurrence key containing schedule, intended fire instant, and relevant revision.
- [ ] Implement renewable leases with owner boot identity, fencing token, server-derived expiry, and compare-and-set release.
- [ ] Re-check the durable claim after every wake-up and before creating work.
- [ ] Bound channel names, message sizes, subscriber queues, reconnect backoff, and duplicate delivery handling.
- [ ] Expose coordinator dependency health and degraded behavior without reporting Redis as the system of record.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: occurrence keys, lease/fencing transitions, duplicate messages, reconnect, and queue overflow |
| Integration | Required: two nodes with shared SQL and Redis for concurrent claims, lease expiry, stale owner, Redis loss, and recovery |
| API | Required: coordinator health, degraded state, schedule result, and administrator authorization contracts |
| UI | Required: component tests plus browser evidence that events from either node update one session and degraded state refreshes correctly |

- [ ] One schedule occurrence creates at most one logical run across concurrent nodes.
- [ ] A stale lease holder cannot commit work after a newer fencing token is issued.
- [ ] Redis loss can delay live updates but cannot lose or corrupt authoritative state.
