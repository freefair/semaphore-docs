# Slice 014 — A Task Is Routed by Runner Tags with an Explanation

A template author selects runner tags, starts a task, and sees the eligible runner chosen or a precise reason why no runner qualifies.

| Field | Value |
|---|---|
| Selection | P02 |
| Depends on | 010–013 |
| Primary paths | runner tag stores, `services/tasks/RemoteJob.go`, `TemplateForm.vue`, task details |
| Out of scope | Executor image policy |

## Implementation

- [ ] Define tag normalization, match modes, project/global precedence, default runners, and deterministic tie-breaking.
- [ ] Filter by project scope, active state, registration, heartbeat, capacity, and requested tags.
- [ ] Return a redacted placement decision listing accepted and rejected criteria.
- [ ] Persist the selected runner and placement reason with the task attempt.
- [ ] Add tag selection and no-eligible-runner guidance to template and task UI.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: table-driven eligibility and tie-breaking rules |
| Integration | Required: concurrent capacity claims across project/global runners |
| API | Required: tag CRUD/list and direct task-start placement contracts |
| UI | Required: component tests plus browser tag selection, placement, and rejection flow |

- [ ] The same eligible set produces the same selection.
- [ ] Cross-project or stale runners are never selected.
- [ ] The user can act on every no-runner reason.
