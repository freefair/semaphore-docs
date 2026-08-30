# Docker Executor

An enhanced-edition runner can execute each assigned task in a dedicated Docker container while keeping checkout, task selection, and Docker-daemon authority on the trusted runner.

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

## Image Selection

The executor uses the immutable task image resolved when the task was created. If the task has no image override, it uses the runner's configured default. Both references are revalidated at the runner boundary and must satisfy the credential-free [executor image contract](project-runner-executor-images.md).

The helper image is always runner-controlled. Registry allow-lists, digest enforcement, and signature policy belong to the separate Docker hardening layer and are not silently inferred here.

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

Cancellation first requests a bounded container stop. If the stop request fails, the runner sends `SIGKILL`. Helper containers, task containers, and bundle volumes are removed on success, failure, and cancellation. Every resource carries only the executor kind, numeric project/task identity, resource kind, and a runner-boot nonce.

The existing task view shows the selected runner, executor, resolved image, container name and ID, attempt lifecycle, normal logs, and terminal reason. Runtime metadata updates are fenced by runner ID and assignment generation, so a stale runner cannot overwrite a replacement attempt.

## Security Boundary

Access to a Docker daemon is administrator-equivalent authority over that daemon host. The runner process and Docker-daemon administrator are trusted components; a Docker container is not an isolation boundary against either of them. Protect the socket or remote TLS credentials like root credentials, restrict runner host access, and do not expose the daemon endpoint to task authors.

The executor deliberately keeps daemon access on the runner side. A task cannot use this interface to create containers, change mounts, select privileged mode, or reach the Docker socket. Enabling the runner-side `privileged` option weakens container isolation for every task handled by that runner and should be limited to a separately controlled runner pool.

## Verification

Run the unit, API, migration, and UI contracts:

```bash
go test ./services/tasks ./services/runners ./db ./db/sql ./api/runners -count=1
GOWORK="$PWD/test/edition-contract/go.work" go test github.com/semaphoreui/semaphore/pro/services/tasks/docker -count=1

cd web
npm run test:unit -- tests/unit/runner-reconciliation.spec.js
```

Run the disposable daemon lifecycle test only against a dedicated QA daemon with the required images already present:

```bash
SEMAPHORE_TEST_DOCKER=1 \
  GOWORK="$PWD/test/edition-contract/go.work" \
  go test github.com/semaphoreui/semaphore/pro/services/tasks/docker \
  -run TestDockerExecutorDisposableDaemonLifecycle -count=1 -v
```

The integration contract covers success output, nonzero exit mapping, bounded cancellation, and absence of labeled containers or volumes after each case.
