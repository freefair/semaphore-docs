# Slice 044 — HA Resilience Verification

An operator can perform a documented rolling upgrade and node-failure exercise while accepted work remains available and consistent.

| Field | Value |
|---|---|
| Selection | E01b |
| Depends on | 040–043 |
| Primary paths | HA test harness, deployment health/readiness, cluster diagnostics, operator guide |
| Out of scope | A new end-user capability beyond proving the selected HA behavior |

## Implementation

- [x] Create a reproducible multi-node test topology with shared SQL, Redis, runners, and controlled network/process failure injection.
- [x] Define supported rolling-upgrade version skew and block node readiness outside that matrix.
- [x] Add graceful drain hooks and readiness behavior for server, scheduler, task control, and workflow ownership.
- [x] Exercise node kill, pause, partition, Redis restart, database connection loss, runner reconnect, and rolling replacement at named state boundaries.
- [x] Verify API availability, schedule uniqueness, live-update recovery, task ownership, workflow progression, and audit continuity after each fault.
- [x] Publish operator runbooks for scale-out, drain, rolling upgrade, degraded Redis, failed node, and ambiguous execution.
- [x] Make the fault suite a required enhanced release gate with retained machine-readable results.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | N/A: this slice proves composed failure behavior; component decisions are unit-tested in slices 040–043 |
| Integration | Required: automated multi-node fault and rolling-upgrade matrix with invariants checked after recovery |
| API | Required: continuous health/read/write probes and final consistency assertions through different nodes |
| UI | Required: browser evidence that cluster, task, and workflow views recover through a node replacement without contradictory state |

- [x] The test report proves no duplicate logical schedules, tasks, workflow nodes, or approval decisions.
- [x] Supported rolling replacement maintains an available API and converges every accepted operation.
- [x] Every injected failure has a documented observable symptom and operator response.
