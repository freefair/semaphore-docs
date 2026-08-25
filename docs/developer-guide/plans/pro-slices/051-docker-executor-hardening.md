# Slice 051 — Docker Executor Hardening

An administrator can enforce a Docker execution policy, and tasks that exceed its image, privilege, resource, or network rules are rejected before container creation.

| Field | Value |
|---|---|
| Selection | E05 |
| Depends on | 050 |
| Primary paths | Docker execution policy, pre-create validator, Docker client, runner diagnostics UI |
| Out of scope | Treating Docker isolation as a protection boundary against a malicious daemon administrator |

## Implementation

- [ ] Define an administrator-owned policy for registry/image allow-lists, digest pinning, user, capabilities, seccomp, AppArmor, mounts, devices, resources, and network mode.
- [ ] Default to non-root, no-new-privileges, dropped capabilities, read-only root filesystem, bounded CPU/memory/PIDs, and no host namespaces or devices.
- [ ] Reject task-level attempts to broaden policy and expose the exact non-sensitive rule that denied execution.
- [ ] Pull images with bounded time and size, verify an allowed immutable digest, and record the resolved digest in provenance.
- [ ] Add labeled reconciliation after runner restart for running, exited, unknown, and leaked containers.
- [ ] Handle daemon interruption and cancellation without declaring a task stopped until the container is confirmed stopped or explicitly quarantined.
- [ ] Export resource usage, policy denials, pull time, cleanup failures, and orphan counts.
- [ ] Show effective policy, resolved image digest, resource limit, and quarantine remediation in diagnostics.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: complete policy matrix, default specification, digest rules, privilege rejection, and reconciliation decisions |
| Integration | Required: real daemon tests for non-root/read-only/resource/network policy, denied mounts/devices, kill, restart, and orphan cleanup |
| API | Required: policy read/update/test, rejected task, resolved provenance, quarantine action, and administrator permission contracts |
| UI | Required: component tests plus browser evidence for policy configuration, pre-create denial, running limits, and orphan remediation |

- [ ] No project input can add privilege, mounts, devices, capabilities, or network access beyond administrator policy.
- [ ] A canceled task is terminal only after execution stop evidence or an explicit ambiguous quarantine state.
- [ ] Every container is attributable to one task and one runner boot identity.
