# Slice 053 — Kubernetes Executor Hardening

An administrator can enforce namespace, Pod Security, resource, network, and cleanup policy before any Kubernetes Job is admitted.

| Field | Value |
|---|---|
| Selection | E06 |
| Depends on | 052 |
| Primary paths | Kubernetes execution policy, manifest validator, Kubernetes client, executor diagnostics UI |
| Out of scope | Installing a cluster-wide admission controller or granting cluster-admin access |

## Implementation

- [ ] Define administrator-owned allow-lists for clusters, namespaces, images/digests, service accounts, runtime classes, volumes, and network profiles.
- [ ] Generate restricted Pod security settings: non-root, no privilege escalation, read-only root, dropped capabilities, seccomp, and bounded resources.
- [ ] Reject host namespaces, privileged mode, hostPath, arbitrary projected tokens, unmanaged service accounts, and policy-broadening overrides.
- [ ] Support a namespaced NetworkPolicy profile when the selected cluster provides enforcement and surface unsupported enforcement explicitly.
- [ ] Record resolved image digest, namespace, service account, resource policy, and object UIDs in task provenance.
- [ ] Reconcile labeled Jobs and Pods after runner restart and quarantine ambiguous executions rather than creating replacements.
- [ ] Garbage-collect only objects carrying valid Semaphore ownership labels and an expired terminal retention deadline.
- [ ] Export API latency, watch reconnects, quota/admission denials, cleanup failure, and orphan counts.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: manifest and policy matrix, security defaults, override denial, reconciliation, and GC ownership checks |
| Integration | Required: disposable cluster tests for restricted security context, RBAC denial, quota, network profile, restart, cancel, and GC |
| API | Required: policy read/update/test, denied task, provenance, quarantine/cleanup actions, and administrator permission contracts |
| UI | Required: component tests plus browser evidence for effective policy, admission denial, running provenance, and orphan remediation |

- [ ] Generated Pods satisfy the configured restricted security profile without trusting project-supplied YAML.
- [ ] The executor never requires cluster-admin permissions.
- [ ] Cleanup cannot delete an object that lacks valid Semaphore ownership and expiry evidence.
