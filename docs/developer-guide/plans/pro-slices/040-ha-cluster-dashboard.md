# Slice 040 — HA Cluster Dashboard

An administrator can run multiple enhanced server instances and see which nodes are alive, compatible, and able to accept work.

| Field | Value |
|---|---|
| Selection | E01, E01a |
| Depends on | 001–005 |
| Primary paths | `pro_interfaces/ha.go`, node registry repository/service, cluster API and UI |
| Out of scope | Cross-node scheduling, task recovery, and workflow coordination |

## Implementation

- [ ] Define a stable node identity independent of pod name and a boot identity unique to one process lifetime.
- [ ] Persist node version, edition, build, capability set, start time, readiness, drain state, and coarse last-seen history in SQL.
- [ ] Publish the live heartbeat with a bounded Redis TTL and derive liveness from Redis server time rather than trusting node clock claims.
- [ ] Require both a compatible SQL registration and a live heartbeat before a node becomes eligible for coordinated work.
- [ ] Mark incompatible schema, protocol, or capability versions as visible and not ready for coordinated work.
- [ ] Remove or retain stale nodes according to a documented history window without reusing boot identities.
- [ ] Add authenticated cluster summary and node-detail APIs with pagination and health aggregation.
- [ ] Render healthy, stale, incompatible, draining, and offline states with last heartbeat and version context.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: identity, server-time liveness, compatibility matrix, readiness, and stale cleanup |
| Integration | Required: multiple service instances against shared SQL for register, heartbeat, restart, drain, incompatibility, and expiry |
| API | Required: node list/detail, readiness, pagination, stale state, and administrator authorization contracts |
| UI | Required: component tests plus browser evidence for healthy, mixed-version, stale, draining, and recovered nodes |

- [ ] Two process lifetimes on one host are distinguishable.
- [ ] A stale or incompatible node cannot be presented as ready.
- [ ] The dashboard combines the SQL node registry with Redis liveness rather than using one node's local process list.
