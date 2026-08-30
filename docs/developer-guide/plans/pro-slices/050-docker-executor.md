# Slice 050 — Docker Executor

An authorized project user can run one ordinary Semaphore task in an isolated Docker container and follow its normal logs and result.

| Field | Value |
|---|---|
| Selection | E05 |
| Depends on | 014–016 |
| Primary paths | executor interface, Docker client, runner task lifecycle, task API and UI |
| Out of scope | Advanced hardening, custom networks, recovery after daemon loss, and Kubernetes |

## Implementation

- [x] Add a typed Docker executor configuration and advertise it as a runner capability used by tag placement.
- [x] Put Docker API behavior behind an outbound client interface and avoid shelling out to the Docker CLI.
- [x] Build a read-only task bundle containing the approved playbook, inventory, environment, and credential references.
- [x] Create a uniquely labeled container from an allow-listed image, mount a writable work directory, stream stdout/stderr, and collect the exit result.
- [x] Map cancel to container stop/kill with bounded grace and always attempt labeled cleanup.
- [x] Keep Docker socket access on the runner side and never proxy its authority through an untrusted task payload.
- [x] Show selected executor, image, runner, container identity, lifecycle, logs, and terminal reason through existing task views.
- [x] Document daemon prerequisites and the explicit security limitation of direct Docker socket access.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: capability matching, create specification, labels, mount policy, result mapping, and cancel transitions |
| Integration | Required: real disposable Docker daemon/container for success, nonzero exit, log streaming, cancellation, and cleanup |
| API | Required: executor selection, task status/logs, unsupported runner, invalid image, cancellation, and permission contracts |
| UI | Required: component tests plus browser evidence for starting, observing, canceling, and completing a Docker task |

- [x] A task runs only on a runner that declared the Docker capability.
- [x] The container receives only its task-scoped bundle and approved credential material.
- [x] Normal completion and cancellation leave no unlabeled or orphaned test container.
