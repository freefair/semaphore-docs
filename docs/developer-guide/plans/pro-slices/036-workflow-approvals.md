# Slice 036 — Workflow Approvals

A workflow can pause at an approval node until an authorized user approves, rejects, or reaches a configured timeout.

| Field | Value |
|---|---|
| Selection | P08g |
| Depends on | 031 |
| Primary paths | approval model/repository/service, workflow runner, approval API, inbox and run UI |
| Out of scope | Role-specific approval policy, delivered by slice 054, and external incident notifications |

## Implementation

- [ ] Define approval-node configuration with prompt, eligible project permission, timeout, and timeout outcome.
- [ ] Persist one immutable approval request per node attempt with pending, approved, rejected, expired, and canceled states.
- [ ] Pause workflow progression before downstream task creation and resume it through one conditional state transition.
- [ ] Reject self-approval when the definition requests separation of duties.
- [ ] Record decision actor, time, optional bounded comment, source, and correlation ID without allowing edits after decision.
- [ ] Expire requests through an idempotent worker and reconcile missed deadlines after restart.
- [ ] Add an approval inbox and run-level action with clear eligibility, deadline, decided-by, and terminal states.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: eligibility, separation of duties, timeout outcomes, and approval state machine |
| Integration | Required: concurrent decisions, restart before timeout, approve/reject/expire progression, and audit persistence |
| API | Required: pending list, approve, reject, duplicate/stale decision, ineligible actor, timeout, and permission contracts |
| UI | Required: component tests plus browser evidence for inbox, approve, reject, self-approval denial, and expiry |

- [ ] Exactly one terminal decision wins when users act concurrently.
- [ ] No downstream task exists before an approval outcome permits it.
- [ ] Every decision is attributable and immutable.
