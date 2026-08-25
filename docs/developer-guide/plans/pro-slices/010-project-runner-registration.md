# Slice 010 — A Project Administrator Registers an Isolated Runner

A project administrator creates a runner, copies a one-time registration token, registers the runner, and sees it only in that project.

| Field | Value |
|---|---|
| Selection | P01, P01a |
| Depends on | 001–005 |
| Primary paths | `pro_interfaces/project_runner_ctl.go`, `pro/api/projects/runners.go`, `services/server/runner_svc.go`, `web/src/views/Runners.vue` |
| Out of scope | Tag placement, cache clearing, and failure recovery |

## Implementation

- [ ] Implement project-scoped create/list/detail and middleware authorization in the enhanced controller.
- [ ] Reuse the current high-entropy `smrs_` registration-token format, hash storage, expiry, and atomic consumption.
- [ ] Bind the registered identity permanently to the originating project.
- [ ] Return plaintext registration material once and exclude it from logs, backups, and later reads.
- [ ] Complete the project runner creation and registration UI states.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: token generation, hashing, expiry, and project binding |
| Integration | Required: concurrent token consumption permits one registration |
| API | Required: project isolation, unauthorized access, expiry, replay, and success |
| UI | Required: component tests plus browser create/copy/register/online flow |

- [ ] A token cannot register twice or into another project.
- [ ] The runner appears in its project after registration.
- [ ] No persisted or diagnostic surface contains the plaintext token.
