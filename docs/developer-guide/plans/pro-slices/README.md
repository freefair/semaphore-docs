# Selected Enhanced Edition Slices

This directory is the implementation backlog for the checked items in [Enhanced Edition Feature Selection](../pro-feature-selection.md).
The selected delivery model is D02: an independent clean-room enhanced module behind the existing Go module seam.
Unchecked capabilities, including Terraform state, SOPS, P07 OIDC gating, external cloud secret stores, quotas, and unselected backlog ideas, are outside this backlog.

## Table of Contents

- [Delivery Rules](#delivery-rules)
- [UI Compatibility Checkpoint](#ui-compatibility-checkpoint)
- [Ordered Slice Index](#ordered-slice-index)
- [Selection Interpretation](#selection-interpretation)
- [Architecture Decisions](#architecture-decisions)
- [Release Gates](#release-gates)

## Delivery Rules

- Implement one slice at a time in the listed order, subject to explicit dependency edges.
- Begin each slice with a failing `/tmp/` reproduction or contract, then move the proven test into the repository.
- Keep Community behavior unchanged and build both Community and enhanced variants.
- Treat SQL as durable authority; Redis coordination never replaces conditional SQL transitions.
- Enforce capabilities and permissions in the backend; UI gating is explanatory only.
- Run every test layer marked Required in the slice document.
- For visible behavior, retain browser evidence in addition to frontend unit tests.
- Port intent and focused tests from old branches; never merge a stale branch wholesale.
- Keep shared Community views structurally close to their upstream baseline. Put enhanced-only
  rendering and API orchestration in focused components behind narrow host hooks.

## UI Compatibility Checkpoint

After Slice 031, the accumulated UI diff was audited against the repository-contained
`origin/develop` baseline at `071b312b8993121a2ce4a34b84c0e12b73477729`.

- Visible surfaces were retained only when a Slice 001–031 interface or acceptance contract names
  them. Runner lifecycle, health, placement, executor-image, task-summary, observability, runtime
  secret, TOTP, LDAP, audit-webhook, and workflow interfaces remain required.
- Enhanced system diagnostics, required TOTP enrollment, runner-attempt details, and secret-storage
  synchronization history were moved into focused components. Their Community host views now
  contain only props, events, and component placement needed for integration.
- The optional responsive rewrite of the existing Task Details tables was removed. Existing
  Community markup and behavior remain the baseline around the retained runner identity and image
  fields.
- The runner page retains its lifecycle and policy hooks because its mutations and observable states
  are direct acceptance requirements; splitting those handlers further would add component seams
  without reducing integration logic in the host.
- Verification includes the host-structure regression contract, 64 focused UI tests, the production
  build, the full-suite baseline comparison, and credential-free browser rendering at desktop and
  mobile widths without horizontal overflow or console errors.

## Ordered Slice Index

| Order | Slice | Selection coverage | Depends on |
|---:|---|---|---|
| 001 | [Core contract](001-core-contract.md) | D02, F01 | — |
| 002 | [Dual-build verification](002-dual-build.md) | F02 | 001 |
| 003 | [Capability lifecycle](003-capability-lifecycle.md) | F03, F04 | 001–002 |
| 004 | [Migration matrix](004-migration-matrix.md) | F05 | 001 |
| 005 | [Security and observability baseline](005-security-observability.md) | F06 | 003–004 |
| 010 | [Project runner registration](010-project-runner-registration.md) | P01, P01a | 001–005 |
| 011 | [Runner lifecycle](011-runner-lifecycle.md) | P01 | 010 |
| 012 | [Runner health and history](012-runner-health-history.md) | P01b | 010 |
| 013 | [Runner reconciliation](013-runner-reconciliation.md) | P01c | 010–012 |
| 014 | [Tag placement](014-tag-placement.md) | P02 | 010–013 |
| 015 | [Executor image](015-executor-image.md) | P02a | 014 |
| 016 | [Runner secure mode](016-runner-secure-mode.md) | P02b | 010, 014 |
| 020 | [Task summary](020-task-summary.md) | P04 | 001–005 |
| 021 | [Structured file logs](021-structured-file-logs.md) | P05 | 005 |
| 022 | [Audit webhook export](022-audit-webhook-export.md) | P05a | 021 |
| 023 | [Debug log filtering](023-debug-log-filter.md) | P05b | 021 |
| 024 | [Vault and OpenBao runtime secrets](024-vault-openbao-runtime.md) | P06 | 003, 005 |
| 025 | [Managed secret storage](025-secret-storage-management.md) | P06 | 024 |
| 026 | [TOTP capability lifecycle](026-totp-capability.md) | P07 TOTP | 003, 005 |
| 027 | [LDAP capability lifecycle](027-ldap-capability.md) | P07 LDAP | 003, 005 |
| 030 | [Workflow editor and validation](030-workflow-editor-validation.md) | P08a, P08c | 003–005 |
| 031 | [Linear workflow run](031-workflow-linear-run.md) | P08b, P08c | 030, 013 |
| 032 | [Conditional parallel workflow](032-workflow-conditional-parallel.md) | P08b | 031 |
| 033 | [Workflow artifacts](033-workflow-artifacts.md) | P08d | 032 |
| 034 | [Workflow parameters and overrides](034-workflow-parameters-overrides.md) | P08e, P08f | 031 |
| 035 | [Workflow triggers](035-workflow-triggers.md) | P08e | 031, 034 |
| 036 | [Workflow approvals](036-workflow-approvals.md) | P08g | 031 |
| 037 | [Workflow reconciliation](037-workflow-reconciliation.md) | P08 | 031–036 |
| 040 | [HA cluster dashboard](040-ha-cluster-dashboard.md) | E01, E01a | 001–005 |
| 041 | [Cross-node coordination](041-ha-cross-node-coordination.md) | E01 | 040 |
| 042 | [HA task recovery](042-ha-task-recovery.md) | E01 | 013, 040–041 |
| 043 | [HA workflow progression](043-ha-workflows.md) | E01 | 037, 040–041 |
| 044 | [HA resilience verification](044-ha-resilience.md) | E01b | 040–043 |
| 045 | [Custom project roles](045-project-roles.md) | E02 | 003, 005 |
| 046 | [Global and template roles](046-global-template-roles.md) | E02 | 045 |
| 047 | [LDAP group mapping](047-ldap-group-mapping.md) | E03 | 027, 045–046 |
| 048 | [OIDC group mapping](048-oidc-group-mapping.md) | E03 | 045–046 |
| 050 | [Docker executor](050-docker-executor.md) | E05 | 014–016 |
| 051 | [Docker executor hardening](051-docker-executor-hardening.md) | E05 | 050 |
| 052 | [Kubernetes executor](052-kubernetes-executor.md) | E06 | 014–016 |
| 053 | [Kubernetes executor hardening](053-kubernetes-executor-hardening.md) | E06 | 052 |
| 054 | [Workflow RBAC and role approvals](054-workflow-rbac-approvals.md) | E07 | 036, 045–048 |
| 055 | [Workflow versions and cross-project references](055-workflow-versions-cross-project.md) | E07 | 037, 046, 054 |
| 056 | [Notification governance](056-notification-governance.md) | E09 | 022, 046 |
| 057 | [PagerDuty delivery](057-pagerduty.md) | E09 | 056 |
| 058 | [Opsgenie delivery](058-opsgenie.md) | E09 | 056 |
| 059 | [ServiceNow delivery](059-servicenow.md) | E09 | 056 |
| 060 | [Global credential grants](060-global-credential-grants.md) | E10 | 025, 046 |
| 061 | [Credential resolution and audit](061-credential-resolution-audit.md) | E10 | 005, 060 |
| 062 | [Server-generated SSH keys](062-generated-ssh-keys.md) | B04 | 005 |
| 063 | [Template search](063-template-search.md) | B14 | 005 |
| 064 | [Per-schedule timezones](064-schedule-timezones.md) | B24 | 004 |
| 070 | [Execution preflight](070-preflight-preview.md) | X01 | 014–016, 034, 061 |
| 071 | [Deployment windows](071-deployment-windows.md) | X02 | 035, 046, 064 |
| 072 | [Policy guardrails](072-policy-guardrails.md) | X03 | 070–071 |
| 073 | [Signed webhooks](073-signed-webhooks.md) | X09 | 022, 035, 056 |
| 074 | [Artifact retention and provenance](074-artifact-retention.md) | X10 | 033, 046, 061 |

## Selection Interpretation

The checked E03 parent includes both LDAP and OIDC group mapping because its selected label explicitly names both mechanisms.
Slice 048 uses the existing OIDC login baseline but does not enable the separately unchecked P07 OIDC edition gate.
The unchecked P06b SOPS entry is not planned.
Foundation items lost their checkboxes in the edited selection but remain mandatory because D02 explicitly depends on them.

## Architecture Decisions

- [ADR 0001: Preserve the Replaceable Enhanced Module Boundary](../../adr/0001-preserve-enhanced-module-boundary.md)
- [ADR 0002: Make Capabilities Backend-Authoritative](../../adr/0002-backend-authoritative-capabilities.md)
- [ADR 0003: Keep SQL Authoritative and Use Redis for HA Coordination](../../adr/0003-sql-authority-and-redis-coordination.md)
- [ADR 0005: Snapshot and Reconcile Workflow Runs](../../adr/0005-snapshot-and-reconcile-workflows.md)
- [ADR 0006: Resolve Secret References at Execution Time](../../adr/0006-resolve-secret-references-at-execution.md)
- [ADR 0007: Generate Executor Workloads from Policy](../../adr/0007-generate-executor-workloads-from-policy.md)
- [ADR 0008: Use IANA Schedule Timezones and Backend Occurrences](../../adr/0008-use-iana-schedule-timezones.md)
- [ADR 0009: Store Initial Bounded Artifacts in SQL](../../adr/0009-store-bounded-artifacts-in-sql.md)

ADR 0004 covers the currently unchecked Terraform state feature and is not part of this selected backlog.

## Release Gates

A slice enters Ready only after its source branch, database matrix, deployment target, and capability rollout state are recorded.
A slice is Done only when its acceptance criteria and every Required test layer are green in a current run, the relevant UI path has browser evidence, documentation is updated, and a focused diff review finds no unrelated changes.
