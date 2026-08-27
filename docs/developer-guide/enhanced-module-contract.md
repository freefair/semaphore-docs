# Enhanced Module Contract

Semaphore keeps enhanced behavior behind the Go module path `github.com/semaphoreui/semaphore/pro`.
The Community checkout contains a disabled implementation at `pro/`; an enhanced checkout replaces that module without changing imports in the core application.

## Compatibility

The executable contract is versioned independently from product releases.

| Component | Current value | Source |
|---|---|---|
| Core contract | `1.9.0` | `pro_interfaces.CoreContractVersion` |
| Community implementation | `community-1` | `pro/pkg/features.ImplementationVersion` |
| Clean-room test implementation | `clean-room-test-1` | `test/edition-contract/enhanced/pkg/features` |

An implementation is compatible only when its `CompatibilityVersion` equals the core `CoreContractVersion`.
Changing an interface, constructor signature, response contract, or shared record requires a contract-version decision and synchronized contract tests in both repositories.
Release artifacts additionally record the exact core and enhanced source revisions; the semantic contract version is not a substitute for those immutable revisions.
See [Reproducible Edition Builds](edition-builds.md) for the build, artifact, and runtime identity contracts.
See [Capability Lifecycle](capability-lifecycle.md) for backend enforcement, state semantics, and downgrade behavior.
See [Project Runner Registration](project-runner-registration.md) for the first project-runner consumer of this contract.
See [Project Runner Lifecycle](project-runner-lifecycle.md) for safe mutations, assignment conflicts, cache acknowledgement, and historical attribution.
See [Project Runner Health and History](project-runner-health-history.md) for runner reports, heartbeat semantics, and completed assignment pagination.
See [Project Runner Reconciliation](project-runner-reconciliation.md) for assignment generations, lost-runner policy, and stale-result rejection.
See [Project Runner Tag Placement](project-runner-placement.md) for deterministic multi-tag routing, atomic capacity claims, and redacted decisions.
See [Project Runner Executor Images](project-runner-executor-images.md) for capability-gated image overrides, runner compatibility, and immutable payloads.
See [Audit Webhook Export](audit-webhook-export.md) for the versioned envelope, transactional outbox, delivery policy, and administration contract.
See [Debug Log Filtering](debug-log-filtering.md) for per-instance matching, reload, structured debug output, and diagnostics.

## Source Provenance

- Core and Community files must come from the public Semaphore repository.
- Enhanced source must come from its independently reviewed repository and must not be copied into Community commits, build contexts, caches, logs, or artifacts.
- The workspace fixture is intentionally non-product code. Its `features` package is a clean-room implementation; thin adapters expose the unchanged Community packages only so a full replacement build exercises every current application import.
- Intent and focused tests may be reimplemented from historical branches after review. Stale branches are never merged wholesale.
- A release manifest identifies the core revision, enhanced revision when applicable, contract version, implementation version, and edition.

## Exported Contract Inventory

The core-owned contract types live in `pro_interfaces/`:

| Area | Interfaces and shared records |
|---|---|
| Capability presentation | `Features`, `Edition`, `Compatibility`, `CapabilityProvider`, `CapabilityServiceFacade`, typed decisions, limits, snapshots, and DTOs |
| Subscription | `SubscriptionController`, `SubscriptionService`, `SubscriptionToken` |
| Project runners | `ProjectRunnerController`, including health and history reads |
| Terraform inventory | `TerraformInventoryController` |
| Workflows | `WorkflowController`, `WorkflowService`, `WorkflowTaskEnqueuer`, `WorkflowRunLocker`, `WorkflowReconciler` |
| Structured logging and audit | `LogWriteService`, `LogWriteServiceLifecycle`, `DebugLogService`, per-instance `DebugFilter`, versioned application/task/result/debug envelopes, diagnostics, project-scoped `AuditEvent`, `AuditWebhookServiceFacade`, `AuditWebhookService`, configuration and delivery DTOs |
| High availability | `NodeRegistry`, `OrphanCleaner`, `ClusterInspector`, `NodeInfo`, `RedisInfo` |

The replaceable module exports these application entry points:

| Package | Constructors and functions |
|---|---|
| `pro/api` | subscription, role, Terraform, and email-verification controllers |
| `pro/api/projects` | project runner, Terraform inventory, and workflow controllers |
| `pro/db/factory` | Terraform, Ansible task-summary, and workflow repositories |
| `pro/db` | workflow validation, condition matching, and root-node selection |
| `pro/pkg/features` | capability provider, guarded lifecycle-test service, and compatibility metadata |
| `pro/pkg/stage_parsers` | task-stage progression |
| `pro/services/ha` | node registry, schedule deduplication, WebSocket broadcast, orphan cleanup, cluster inspection, and workflow locking |
| `pro/services/server` | subscription, structured logging, audit webhook export, workflow, secret-storage, and external-secret serializers |
| `pro/services/tasks` | task-state storage plus Docker and Kubernetes executor providers |

Concrete Community controllers, services, and repositories carry compile-time assertions against their core interfaces.
The contract tests fail at compile time when either side changes without reconciliation.

## Community HTTP Contract

Community routes remain registered so the router shape is stable, but disabled behavior is explicit:

| Response | Routes |
|---|---|
| `200` with `[]` | role collections, project runner/tag collections, Terraform alias/state collections, workflow/run/approval collections |
| `201` with `{}` | project runner registration-token regeneration |
| `403` with an empty body | enhanced email-session verification |
| `404` with no protected resource data | subscription mutations and reads; role mutations and details; Terraform state operations; project runner mutations, details, health, and history; workflow mutations and details |

Community middleware delegates to the next handler without mutating the request or invoking a repository.
Community capability flags are all false, collection services return empty values, log writers have no side effects, and enhanced executor constructors return an explicit unavailable error.

## Verification

`pro_interfaces/contract_integration_test.go` creates a Go Workspace containing the core module and `test/edition-contract/enhanced`.
It verifies that the enhanced directory owns the `github.com/semaphoreui/semaphore/pro` path, runs the clean-room capability consumer, and builds the full `github.com/semaphoreui/semaphore/cli` package without editing application imports.

Run the contract layers with:

```bash
go test ./pro_interfaces -run TestWorkspaceSelectsCleanRoomEnhancedModule -count=1
(cd pro && go test ./... -count=1)
go build ./cli
```
