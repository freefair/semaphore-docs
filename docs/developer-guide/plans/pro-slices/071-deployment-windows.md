# Slice 071 — Deployment Windows

A scheduled or manual deployment starts only inside an approved project window unless an authorized user records an explicit emergency override.

| Field | Value |
|---|---|
| Selection | X02 |
| Depends on | 035, 046, 064 |
| Primary paths | window/freeze repository and evaluator, enqueue service, schedule API, start and governance UI |
| Out of scope | Calendar-provider synchronization and automatic change-ticket approval |

## Implementation

- [ ] Define versioned project windows and freezes using IANA timezone, local recurrence, effective date range, and optional template/workflow scope.
- [ ] Specify deterministic precedence: active freeze denies, otherwise at least one applicable allow window permits, otherwise project default decides.
- [ ] Evaluate the same policy immediately before enqueue for manual, schedule, API, webhook, and workflow node starts.
- [ ] For a blocked schedule occurrence, persist a blocked result and next eligible instant rather than silently dropping or repeatedly duplicating it.
- [ ] Add an emergency-override permission distinct from ordinary start permission and require a bounded reason.
- [ ] Snapshot policy revision, evaluation instant, effective zone, matched rules, decision, and override actor in audit.
- [ ] Add calendar/list editing, impact preview, current status, next eligible time, blocked-run history, and override confirmation UI.
- [ ] Handle DST with the same authoritative time semantics as slice 064.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: precedence, scopes, recurrence, overlap, default, DST, next eligible time, and override permission |
| Integration | Required: scheduler/manual/API/webhook/workflow enqueue boundaries, restart, duplicate occurrence, and audit persistence |
| API | Required: rule CRUD/preview/current status, blocked start, override, invalid zone/range, and permission contracts |
| UI | Required: browser evidence for window/freeze creation, calendar status, blocked start, authorized override, and denied override |

- [ ] Every execution entry point reaches the same final window decision.
- [ ] An override records who, why, when, what policy was bypassed, and which execution resulted.
- [ ] A blocked schedule occurrence is explainable and cannot create duplicate delayed runs.
