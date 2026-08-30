# Kubernetes Executor

The Enhanced Kubernetes executor runs one Semaphore task as one namespaced Kubernetes Job. It uses the existing runner placement, task lifecycle, log, and result APIs; projects do not receive Kubernetes credentials or raw workload controls.

## Execution Contract

The runner selects the Kubernetes executor with `runner.executor.type: k8s`. The provider is initialized once and owns the Kubernetes API client for the runner process.

Every task must resolve to an OCI image with a full `@sha256:` digest. The configured task and helper images are immutable fallbacks; a template executor image may replace the task image only when it is also an immutable digest. Mutable tags are rejected before any Kubernetes object is created.

The runner creates these task-scoped objects in its configured namespace:

1. An immutable Secret containing the prepared task bundle, limited to 768 KiB.
2. One Job with `restartPolicy: Never`, `backoffLimit: 0`, and a bounded active deadline.
3. One Pod owned by that Job.

The Secret is mounted read-only into a fixed init container. The init container extracts it into a generated `emptyDir`; the task container mounts the extracted bundle read-only and gets a separate workspace `emptyDir`. Bundle bytes, environment values, credentials, JWTs, repository URLs, and command arguments never appear in labels or annotations.

The workload Pod uses the configured dedicated service account with `automountServiceAccountToken: false`. It therefore has no Kubernetes API credential. This account is separate from the identity used by the runner process to call the Kubernetes API.

## Configuration

```yaml
runner:
  executor:
    type: k8s
    k8s:
      kubeconfig: /etc/semaphore/runner.kubeconfig
      context: semaphore-jobs
      cluster_alias: production-jobs
      namespace: semaphore-jobs
      service_account: semaphore-task
      image: registry.example.com/semaphore/job@sha256:<64-hex-digest>
      helper_image: registry.example.com/semaphore/helper@sha256:<64-hex-digest>
      pull_secrets: registry-credentials
      poll_interval_seconds: 3
      cleanup_grace_seconds: 30
      active_deadline_seconds: 3600
```

`context` is mandatory when `kubeconfig` is set; the provider never falls back to `current-context`. Omitting `kubeconfig` selects in-cluster authentication. `cluster_alias`, `namespace`, and a non-default `service_account` remain mandatory operator-owned inputs in both modes.

`pull_secrets` accepts at most 16 comma-separated DNS-safe Secret names. Projects cannot select a context, namespace, service account, pull secret, command, volume, or Kubernetes security field.

## Lifecycle and Logs

The runner watches the exact generated Job and Pod identities. Success requires both a terminal Job condition and termination evidence from the fixed `task` container. Failure reasons are reduced to a bounded allow-listed reason; raw Kubernetes messages and workload metadata are not returned through the task API.

Container logs use the normal Semaphore task log stream. Kubernetes timestamp watermarks provide at-least-once reconnect behavior rather than a byte-offset guarantee. Reconnect overlap may therefore repeat a line, but the runner never discards identical timestamped output. It bounds each line to 64 KiB and permits five reconnect attempts per task stream.

Cancellation requests foreground Job deletion and waits for the exact Job UID and Pod UID to disappear. The task remains stopping until that evidence exists. Cleanup deletes the immutable bundle Secret only after Job and Pod deletion is confirmed. Names alone are never accepted as cleanup authority.

Interactive Terraform confirmation is not supported by this first executor slice. Kubernetes Terraform tasks must use plan-only or auto-approve mode; other supported task applications use the normal bootstrap and run stages.

## Task Diagnostics

The existing task runner-attempt panel shows only the bounded stored projection:

- selected executor;
- operator-defined cluster alias and namespace;
- Job and Pod names and UIDs;
- fixed main-container name;
- immutable requested/resolved image;
- lifecycle and bounded terminal reason.

Task logs remain in the existing log view. Kubeconfig content, Kubernetes API addresses, Secret data, labels, annotations, and raw termination messages are never exposed.

## Required RBAC

Grant the runner control-plane identity only the following verbs in the dedicated task namespace:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: semaphore-runner
  namespace: semaphore-jobs
rules:
  - apiGroups: ["batch"]
    resources: ["jobs"]
    verbs: ["create", "get", "list", "watch", "delete"]
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["pods/log"]
    verbs: ["get"]
  - apiGroups: [""]
    resources: ["secrets"]
    verbs: ["create", "get", "delete"]
```

Bind this Role to the runner process identity. Do not bind it to the `service_account` configured for task Pods. The executor needs no cluster-scoped permission, ConfigMap access, `pods/exec`, `pods/attach`, `pods/portforward`, Secret list/watch, RBAC mutation, or service-account token mutation.

## Verification

Run the deterministic package and API contracts with the repository workspace:

```bash
GOWORK="$PWD/test/edition-contract/go.work" \
  go test ./test/edition-contract/enhanced/services/tasks/k8s -count=1

go test ./db ./db/sql ./api/runners ./services/runners -count=1
```

The real-cluster integration suite is opt-in and must target a disposable namespace. It covers success, failure, reconnecting logs, foreground cancellation, and task-object cleanup.
