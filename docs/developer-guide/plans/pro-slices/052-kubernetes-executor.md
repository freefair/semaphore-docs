# Slice 052 — Kubernetes Executor

An authorized project user can run one ordinary Semaphore task as a Kubernetes Job and follow its normal logs and result.

| Field | Value |
|---|---|
| Selection | E06 |
| Depends on | 014–016 |
| Primary paths | executor interface, Kubernetes client, runner task lifecycle, task API and UI |
| Out of scope | Advanced pod security policy, recovery, garbage collection, and multi-cluster routing |

## Implementation

- [x] Add a typed Kubernetes executor configuration and advertise it as a runner capability used by tag placement.
- [x] Put Kubernetes API behavior behind an outbound client interface using an explicitly selected context, namespace, and service account.
- [x] Create one labeled Job per task with an immutable image, task bundle, bounded deadline, and restart policy that preserves task semantics.
- [x] Watch Job and Pod state, stream bounded container logs with reconnect offsets, and map termination details to task result.
- [x] Map cancellation to foreground Job deletion and confirm Pod termination before reporting stopped.
- [x] Use task-scoped ConfigMaps or Secrets only where required, avoid secret values in labels/annotations, and clean temporary objects.
- [x] Show selected executor, cluster alias, namespace, Job/Pod identity, lifecycle, logs, and terminal reason in task views.
- [x] Document required Kubernetes RBAC verbs and namespace prerequisites.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: capability matching, Job specification, labels, state/result mapping, log offsets, and cancellation |
| Integration | Required: disposable Kubernetes cluster for success, failure, reconnecting logs, cancellation, and object cleanup |
| API | Required: executor selection, task status/logs, unsupported runner, invalid image, cancellation, and permission contracts |
| UI | Required: component tests plus browser evidence for starting, observing, canceling, and completing a Kubernetes task |

- [x] A task runs only on a runner that declared the Kubernetes capability.
- [x] All created objects are attributable to one task and contain no secret material in metadata.
- [x] Normal completion and cancellation remove temporary task objects according to the documented lifecycle.
