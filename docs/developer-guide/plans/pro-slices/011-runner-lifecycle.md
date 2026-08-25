# Slice 011 — A Project Administrator Manages Runner Lifecycle

A project administrator edits, activates, deactivates, clears, re-registers, and safely deletes a project runner.

| Field | Value |
|---|---|
| Selection | P01 |
| Depends on | 010 |
| Primary paths | Project runner controller, runner store/service, `RunnerForm.vue`, `Runners.vue` |
| Out of scope | Automatic recovery from a lost runner |

## Implementation

- [ ] Implement update, active-state transition, registration reset, cache-clear request, and delete endpoints.
- [ ] Reject destructive lifecycle actions while assignments are unsafe, with actionable conflict details.
- [ ] Make cache clearing observable and idempotent across repeated runner polls.
- [ ] Preserve historical runner name after deletion.
- [ ] Render pending, registered, inactive, deleting, and cache-cleaning states in the UI.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: lifecycle transition table and conflict rules |
| Integration | Required: store round trips and idempotent cache acknowledgment |
| API | Required: CRUD, permission, conflict, and repeated-request tests |
| UI | Required: component tests plus browser edit/deactivate/clear/re-register/delete flow |

- [ ] Inactive runners receive no new tasks.
- [ ] Unsafe deletion returns a conflict without losing the runner.
- [ ] Every lifecycle mutation is audited.
