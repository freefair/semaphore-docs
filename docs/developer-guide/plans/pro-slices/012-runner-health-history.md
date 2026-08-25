# Slice 012 — Operators See Runner Health and Task History

An operator sees version, platform, start time, uptime, heartbeat state, current load, and completed assignments for each runner.

| Field | Value |
|---|---|
| Selection | P01b |
| Depends on | 010 |
| Primary paths | `db/Runner.go`, runner poll API, task projections, `Runners.vue`, task history views |
| Out of scope | Automated orphan recovery |

## Implementation

- [ ] Extend runner reports and persistence with version, platform, start time, and bounded load metadata.
- [ ] Derive online/offline status from a configurable heartbeat boundary and treat webhook runners explicitly.
- [ ] Persist the selected runner identity on assignment and retain the display name after deletion.
- [ ] Expose paginated assignment history without returning runner auth material.
- [ ] Add health and history panels with unambiguous stale/offline messaging.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: heartbeat, uptime, restart, and status boundary cases |
| Integration | Required: runner/task history persistence after restart and deletion |
| API | Required: scoped health/history payloads and authorization negatives |
| UI | Required: component tests plus browser online/offline/restart/history states |

- [ ] A runner restart resets uptime without losing task history.
- [ ] Offline state appears after the configured boundary.
- [ ] Finished tasks retain a non-secret runner identity.
