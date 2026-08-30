# Docker Executor

An enhanced-edition runner can execute each assigned task in a dedicated Docker container while keeping checkout, task selection, and Docker-daemon authority on the trusted runner.

- [Prerequisites](#prerequisites)
- [Runner configuration](#runner-configuration)
- [Administrator-owned execution policy](#administrator-owned-execution-policy)
- [Image selection and provenance](#image-selection-and-provenance)
- [Task boundary](#task-boundary)
- [Lifecycle and cancellation](#lifecycle-and-cancellation)
- [Restart reconciliation](#restart-reconciliation)
- [Quarantine and remediation](#quarantine-and-remediation)
- [Observability](#observability)
- [Security boundary](#security-boundary)
- [Verification](#verification)

## Prerequisites

- Docker Engine with API version 1.40 or newer.
- A runner host that can reach the daemon through a Unix socket, Windows named pipe, or authenticated TLS endpoint.
- A task image and helper image available under the configured pull policy.
- Task images that provide `/bin/sh` and the tools required by the selected Semaphore app. The task process runs as UID `65534`, GID `0`.
- Helper images that provide `/bin/sh`. The helper receives no network and only populates the task's new bundle volume.

The client negotiates the supported Docker API version. It never invokes the Docker CLI.

## Runner Configuration

Set the runner executor and, where needed, override its Docker defaults through environment variables:

```bash
export SEMAPHORE_RUNNER_EXECUTOR='{"type":"docker"}'
export SEMAPHORE_RUNNER_DOCKER_HOST=unix:///var/run/docker.sock
export SEMAPHORE_RUNNER_DOCKER_IMAGE=semaphoreui/job:latest
export SEMAPHORE_RUNNER_DOCKER_HELPER_IMAGE=semaphoreui/helper:latest
export SEMAPHORE_RUNNER_DOCKER_PULL_POLICY=if-not-present
export SEMAPHORE_RUNNER_DOCKER_NETWORK=bridge
semaphore runner start
```

For a remote daemon, enable verification and point `SEMAPHORE_RUNNER_DOCKER_CERT_PATH` at a directory containing `ca.pem`, `cert.pem`, and `key.pem`. A certificate path without TLS verification is rejected.

The complete field and environment-variable reference is in [Configuration](../admin-guide/configuration.md).

## Administrator-Owned Execution Policy

One global, revisioned Docker execution policy controls every global and project-scoped Docker runner.
Project, template, task, and runner-registration inputs cannot widen it.
The runner must acknowledge the exact policy revision and canonical SHA-256 hash before the server dispatches Docker work.

A fresh installation is fail-closed:

| Control | Default |
|---|---|
| Allowed images | Empty; an administrator must add immutable repository digests |
| Digest enforcement | Required |
| Task and helper network | `none` |
| Container identity | `65534:0` |
| CPU | 1 CPU (`1_000_000_000` NanoCPUs) |
| Memory | 512 MiB |
| PIDs | 256 |
| Pull timeout | 300 seconds |
| Maximum image size | 2 GiB |
| Seccomp | Docker `default` profile |
| AppArmor | `docker-default` |
| Privileged mode, bind mounts, devices, host namespaces | Rejected |
| Added Linux capabilities | Rejected |
| Root filesystem | Read-only |
| `no-new-privileges` | Required |

The policy API accepts the complete document, canonicalizes sets, recalculates the hash, and advances the revision only when the submitted revision is current.
A concurrent or stale update receives a conflict instead of overwriting a newer policy.

All policy and remediation routes require an authenticated built-in administrator:

| Method and path | Purpose |
|---|---|
| `GET /api/runners/docker-policy` | Read the effective policy, revision, and hash |
| `PUT /api/runners/docker-policy` | Replace the complete policy using its current revision |
| `POST /api/runners/docker-policy/test` | Evaluate one non-secret execution vector without creating a container |
| `GET /api/runners/{runner_id}/docker-reconciliation/diagnostics` | Read a bounded, cursor-paginated pending quarantine feed |
| `POST /api/runners/{runner_id}/docker-reconciliation/remediation` | Request one idempotent, server-validated safe cleanup command |

The existing global runner health dialog shows the effective policy, runner acknowledgement, bounded quarantine diagnostics, and safe remediation action.
The editor intentionally exposes only the operational image, network, identity, resource, pull, and size fields while preserving the complete strict policy document.
Security flags and fixed profiles remain fail-closed rather than becoming task-controlled Docker options.

Policy denials expose only one stable rule ID such as `DOCKER_POLICY_IMAGE_DENIED`, `DOCKER_POLICY_NETWORK_DENIED`, or `DOCKER_POLICY_RESOURCE_DENIED`.
They do not echo mount paths, daemon errors, credentials, or unrestricted request data.

## Image Selection and Provenance

The executor uses the immutable task image resolved when the task was created. If the task has no image override, it uses the runner's configured default. Both references are revalidated at the runner boundary and must satisfy the credential-free [executor image contract](project-runner-executor-images.md).

The helper image is always runner-controlled.
Both task and helper images must match an administrator-allowed immutable repository digest.
Resolution and pull operations have policy-defined time and size bounds, and container creation uses the resolved digest rather than the mutable requested tag.

Every runner attempt persists the requested image, resolved digest, policy revision and hash, applied CPU/memory/PID limits, and any denial rule.
The existing task details dialog presents these non-secret values after success, failure, cancellation, or denial.

## Task Boundary

The runner prepares one task-scoped tar archive containing:

- the approved repository checkout without any `.git` metadata;
- the selected static or repository-backed inventory;
- generated, quoted task environment data;
- task-scoped SSH, Ansible, and vault credential material; and
- a generated stage script with fixed `bootstrap`, `run`, `plan`, and `apply` entry points.

Archive creation rejects absolute or parent-traversing names, symbolic links, hard links, sockets, FIFOs, devices, and other special files. Credential files are mode `0600` below a mode `0700` directory.

The runner creates a uniquely named and labeled volume, copies the archive through the Docker API at the fixed `/semaphore/bundle` destination, and mounts it read-only in the task container. Each task receives fresh writable tmpfs mounts at `/workspace`, `/tmp`, and `/home/semaphore`. No runner host path, SSH-agent socket, or Docker socket is mounted into the task.

Docker create and exec requests contain only runner-owned settings and a fixed command vector. Task arguments and secrets remain inside the read-only bundle and are absent from container names, labels, Docker environment entries, and Docker command arguments.

## Lifecycle and Cancellation

The task container remains alive while the runner executes the generated stages through Docker exec. Stdout and stderr are demultiplexed into the normal task log stream. A nonzero stage exit becomes the normal task failure result; Terraform detailed exit code `2` continues through the existing plan and confirmation lifecycle.

Cancellation first requests a bounded container stop. If the stop request fails, the runner sends `SIGKILL`. Helper containers, task containers, and bundle volumes are removed on success, failure, and cancellation.

A Docker-backed task becomes terminal only after the runner confirms that execution stopped or the server durably records an explicit quarantine.
Normal cancellation, terminated-job cleanup, and HA recovery all use this invariant.
An unavailable or ambiguous daemon therefore cannot turn uncertainty into a false `stopped` result.

The existing task view shows the selected runner, executor, resolved image, container name and ID, attempt lifecycle, normal logs, and terminal reason. Runtime metadata updates are fenced by runner ID and assignment generation, so a stale runner cannot overwrite a replacement attempt.

## Restart Reconciliation

The server creates an authenticated reconciliation session for each runner process.
The session contains a server-issued session ID, secret fence, target boot identity, and a bounded page of exact task/helper resource tuples.
The runner cannot choose these authorities.

Docker dispatch stays blocked until the runner has inspected every required page and the server has atomically accepted exact coverage.
Missing, duplicate, forged, stale, or extra tuples fail closed.
An interrupted scan resumes from the server-owned cursor instead of trusting a boolean readiness acknowledgement.

Managed containers and volumes use only the following reserved attribution labels:

- `io.semaphore.managed=v1`
- `io.semaphore.executor=docker`
- `io.semaphore.runner-id`
- `io.semaphore.runner-boot`
- `io.semaphore.project-id`
- `io.semaphore.task-id`
- `io.semaphore.assignment-generation`
- `io.semaphore.resource` with `task` or `helper`

The runner lists only resources carrying the managed marker and its numeric runner ID, then inspects each current target page.
Running, exited, absent, unknown, duplicate, malformed, and extra resources become typed observations or bounded quarantine candidates.
Malformed and extra resources never count as successful scan coverage.

## Quarantine and Remediation

A quarantine is durable evidence that a managed resource could not be proven stopped or safely attributable.
An orphan candidate is a managed daemon object that cannot be tied to one exact server-issued task tuple.
Both remain pending until the runner proves a safe outcome.

The diagnostics response contains only safe names, typed resource/state/reason values, timestamps, and a revision-fenced remediation descriptor.
It omits daemon IDs, session fences, raw daemon messages, labels, identity material, and command internals.

Use the existing global runner diagnostics dialog to recover a pending item:

1. Restore access from that runner to its configured Docker daemon.
2. Confirm that the expected runner process has reconnected and acknowledged the current policy.
3. Select **Retry safe cleanup** on the pending diagnostic.
4. Wait for the runner to receive the current-session command and re-inspect the exact immutable Docker identity.
5. Reload diagnostics and confirm that the item is gone or remains pending with a safe reason.

The request uses a stable idempotency key so a lost HTTP response can be retried without creating a second command.
Before stop, kill, or removal, the runner rechecks the daemon ID, full managed-label tuple, and, for volumes, the creation identity.
An absent object completes successfully; a changed or ambiguous identity remains quarantined.

If the runner cannot reconnect, a trusted Docker-daemon administrator may inspect the reserved labels directly.
After resolving the daemon-side condition, reconnect the same runner and retry the server-issued cleanup action so Semaphore records the result.
Do not delete objects by name alone, and do not edit reconciliation rows manually.

## Observability

The runner emits at most 100 telemetry events per progress request and retains at most 100 pending events locally.
Overflow is coalesced into a fixed-label drop event instead of creating an unbounded queue.
The server deduplicates events by the authenticated reconciliation session and sequence.

The authenticated metrics endpoint exports only fixed, low-cardinality labels:

| Metric | Meaning |
|---|---|
| `semaphore_docker_resource_cpu_usage_nanoseconds` | Latest one-shot CPU sample by `task` or `helper` role |
| `semaphore_docker_resource_memory_bytes` | Latest one-shot memory sample by role |
| `semaphore_docker_resource_pids` | Latest one-shot PID sample by role |
| `semaphore_docker_policy_denials_total` | Denials by allow-listed stable rule ID |
| `semaphore_docker_image_pull_duration_seconds` | Resolution duration by fixed source and role |
| `semaphore_docker_cleanup_failures_total` | Cleanup failures by `task`, `helper`, or `volume` |
| `semaphore_docker_reconciliation_total` | Reconciliation observations by fixed state |
| `semaphore_docker_orphans_total` | Detected, removed, or unresolved orphan lifecycle events |
| `semaphore_docker_telemetry_dropped_events_total` | Coalesced local queue drops by fixed reason |

## Security Boundary

Access to a Docker daemon is administrator-equivalent authority over that daemon host. The runner process and Docker-daemon administrator are trusted components; a Docker container is not an isolation boundary against either of them. Protect the socket or remote TLS credentials like root credentials, restrict runner host access, and do not expose the daemon endpoint to task authors.

The executor deliberately keeps daemon access on the runner side. A task cannot use this interface to create containers, change mounts, select privileged mode, or reach the Docker socket.
The hardening policy rejects privileged mode, host mounts, devices, host namespaces, host networking, added capabilities, writable root filesystems, and arbitrary users.

This boundary does not protect against a malicious runner host administrator or Docker-daemon administrator.
Either can inspect container files, alter daemon state, or replace the runner process outside Semaphore's control.
Use a dedicated runner host or daemon for the trust domain, restrict daemon administration, and monitor policy acknowledgement and reconciliation health.

## Verification

Run the unit, API, migration, and UI contracts:

```bash
go test ./services/tasks ./services/runners ./db ./db/sql ./api ./api/runners ./pkg/metrics -count=1
GOWORK="$PWD/test/edition-contract/go.work" go test github.com/semaphoreui/semaphore/pro/services/tasks/docker -count=1

cd web
npm run test:unit -- \
  tests/unit/00-environment.spec.js \
  tests/unit/runner-health-history.spec.js \
  tests/unit/runner-reconciliation.spec.js
```

Run the disposable daemon lifecycle test only against a dedicated QA daemon with the required images already present:

```bash
SEMAPHORE_TEST_DOCKER=1 \
  GOWORK="$PWD/test/edition-contract/go.work" \
  go test github.com/semaphoreui/semaphore/pro/services/tasks/docker \
  -run 'TestDocker(ExecutorDisposableDaemonLifecycle|ReconciliationDisposableDaemonCases)' \
  -count=1 -v
```

The integration contract covers success output, nonzero exit mapping, fail-closed policy enforcement, immutable digest execution, bounded cancellation, restart reconciliation, safe remediation, and absence of managed residual resources after each case.
