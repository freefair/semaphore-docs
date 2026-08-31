# Kubernetes Executor

The Enhanced Kubernetes executor runs one Semaphore task as one namespaced Kubernetes Job. It uses the existing runner placement, task lifecycle, log, and result APIs; projects do not receive Kubernetes credentials or raw workload controls.

## Execution Contract

The runner selects the Kubernetes executor with `runner.executor.type: k8s`. The provider is initialized once and owns the Kubernetes API client for the runner process.

Every task must resolve to an OCI image with a full `@sha256:` digest. The configured task and helper images are immutable fallbacks; a template executor image may replace the task image only when it is also an immutable digest. Mutable tags are rejected before any Kubernetes object is created.

After the runner acknowledges the exact administrator policy revision, it creates these task-scoped objects in its configured namespace:

1. An immutable Secret containing the prepared task bundle, limited to 768 KiB.
2. One deny-all NetworkPolicy bound to the exact task labels.
3. One Job with `restartPolicy: Never`, `backoffLimit: 0`, and a bounded active deadline.
4. One Pod owned by that Job.

The Secret is mounted read-only into a fixed init container. The init container extracts it into a generated `emptyDir`; the task container mounts the extracted bundle read-only and gets a separate workspace `emptyDir`. Bundle bytes, environment values, credentials, JWTs, repository URLs, and command arguments never appear in labels or annotations.

The workload Pod uses the configured dedicated service account with `automountServiceAccountToken: false`. It therefore has no Kubernetes API credential. This account is separate from the identity used by the runner process to call the Kubernetes API.

Both containers run with the administrator-owned restricted profile: fixed non-root UID/GID, no privilege escalation, a read-only root filesystem, all Linux capabilities dropped, and `RuntimeDefault` seccomp. CPU, memory, and ephemeral-storage requests and limits are mandatory policy values. The writable bundle and workspace `emptyDir` volumes have a policy-bounded size.

## Administrator Policy

The server stores one policy per canonical `cluster_alias`. A Kubernetes runner remains fail-closed until it receives and acknowledges the matching revision and SHA-256 policy hash. The policy contains exact allow-lists for namespaces, immutable task/helper images, service accounts, runtime classes, the executor-owned volume types, and the selected network profile.

The only built-in network profile is `deny-all`. `network_policy_enforcement` must be explicitly set to `network-policy`; the default is `unsupported`. This declaration means the administrator has verified that the cluster CNI enforces NetworkPolicy resources. Semaphore verifies object creation but does not claim to detect CNI enforcement automatically.

Global administrators manage and test policies through:

- `GET/PUT /api/runners/kubernetes-policies/{cluster_alias}`;
- `POST /api/runners/kubernetes-policies/{cluster_alias}/test`.

The test endpoint accepts only a bounded manifest summary, never raw Kubernetes YAML. Policy and Kubernetes API failures are reduced to stable denial identifiers before they cross the runner boundary.

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

Cancellation requests foreground Job deletion and wait for the exact Job UID and Pod UID to disappear. The task remains stopping until that evidence exists. Cleanup then removes the exact NetworkPolicy and immutable bundle Secret. Names alone are never accepted as cleanup authority.

Interactive Terraform confirmation is not supported by this first executor slice. Kubernetes Terraform tasks must use plan-only or auto-approve mode; other supported task applications use the normal bootstrap and run stages.

## Task Diagnostics

The existing task runner-attempt panel shows only the bounded stored projection:

- selected executor;
- operator-defined cluster alias and namespace;
- Job and Pod names and UIDs;
- fixed main-container name;
- immutable requested/resolved image;
- acknowledged policy revision/hash, service account, runtime class, resource policy, and network enforcement;
- exact task-object identities and terminal retention state;
- lifecycle, bounded terminal reason, and stable denial identifier.

Task logs remain in the existing log view. Kubeconfig content, Kubernetes API addresses, bundle data, labels, annotations, raw admission errors, and raw termination messages are never exposed.

## Restart Reconciliation and Garbage Collection

Every runner process restart opens a server-issued reconciliation session bound to the authenticated runner, cluster alias, namespace, and an opaque fence. Before accepting another Kubernetes task, the runner performs exactly four namespaced inventories: Jobs, Pods, Secrets, and NetworkPolicies carrying its bounded Semaphore labels.

An active attempt is accepted only when every persisted name/UID/label tuple matches exactly and the Pod is owned by the expected Job UID. Missing, duplicate, reused-name, ownership-conflicting, or foreign labeled objects create durable quarantine diagnostics; Semaphore never starts a replacement while execution is ambiguous.

Expired terminal objects can be garbage-collected only through the global runner diagnostics dialog. The server builds the allowed remediation descriptor. Immediately before deletion, the runner repeats the exact name, UID, complete label, terminal-state, and expiry checks and uses UID-preconditioned deletes. Job and Pod absence is confirmed before the NetworkPolicy and bundle Secret are removed. Candidate objects without persisted provenance are visible to administrators but are never actionable.

The executor exports bounded Prometheus metrics for API latency, watch/log reconnects, stable denial categories, cleanup failures, reconciliation results, orphan/quarantine counts, and telemetry drops. Metric labels use closed enums; object names, namespaces, labels, API errors, and credentials are not stored or exported.

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
    verbs: ["create", "get", "list", "delete"]
  - apiGroups: ["networking.k8s.io"]
    resources: ["networkpolicies"]
    verbs: ["create", "get", "list", "delete"]
```

Bind this Role to the runner process identity. Do not bind it to the `service_account` configured for task Pods. The executor needs no cluster-scoped permission, ConfigMap access, `pods/exec`, `pods/attach`, `pods/portforward`, Secret watch, RBAC mutation, or service-account token mutation.

## Verification

Run the deterministic package and API contracts with the repository workspace:

```bash
GOWORK="$PWD/test/edition-contract/go.work" \
  go test ./test/edition-contract/enhanced/services/tasks/k8s -count=1

go test ./db ./db/sql ./api/runners ./services/runners -count=1
```

The real-cluster integration suite is opt-in and must target a disposable namespace. It covers restricted security contexts, deny-all NetworkPolicy creation, RBAC and quota denials, success, failure, reconnecting logs, foreground cancellation, restart reconciliation, exact expired-object garbage collection, and foreign-object refusal.
