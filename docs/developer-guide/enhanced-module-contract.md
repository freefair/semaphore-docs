# Enhanced Module Contract

Semaphore keeps enhanced behavior behind the Go module path `github.com/semaphoreui/semaphore/pro`.
The committed root Go Workspace always selects the clean-room implementation at `test/edition-contract/enhanced` without changing imports in the core application.
The disabled implementation at `pro/` remains unwired compatibility scaffolding and is not a supported product build.

## Compatibility

The executable contract is versioned independently from product releases.

| Component | Current value | Source |
|---|---|---|
| Core contract | `1.21.0` | `pro_interfaces.CoreContractVersion` |
| Compatibility stub | `community-1` | `pro/pkg/features.ImplementationVersion` |
| Full-product clean-room implementation | `clean-room-test-1` | `test/edition-contract/enhanced/pkg/features` |

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

See [Docker Executor](docker-executor.md) for runner-side Docker configuration, task bundle boundaries, lifecycle behavior, and daemon trust limitations.
See [Audit Webhook Export](audit-webhook-export.md) for the versioned envelope, transactional outbox, delivery policy, and administration contract.
See [Signed Webhooks](signed-webhooks.md) for canonical HMAC bytes, receiver verification, durable replay identity, current/next rotation, and redacted history.
See [Notification Governance](plans/pro-slices/056-notification-governance.md) for provider-neutral routing, source-owned outbox transactions, delivery lifecycle, permissions, and adapter boundaries.
See [PagerDuty Delivery](plans/pro-slices/057-pagerduty.md) for the fixed regional Events API v2 transport, PD-CEF mapping, deduplication, and provider-result policy.
See [Opsgenie Delivery](plans/pro-slices/058-opsgenie.md) for fixed regional Alert API v2 transport, typed responders, asynchronous request tracking, alias deduplication, and close semantics.
See [ServiceNow Delivery](plans/pro-slices/059-servicenow.md) for the restricted incident Table API transport, exact record identity, lifecycle reconciliation, and field allow-list.
See [Debug Log Filtering](debug-log-filtering.md) for per-instance matching, reload, structured debug output, and diagnostics.
See [Deployment Windows](deployment-windows.md) for deterministic project admission, durable blocked occurrences, emergency overrides, governance, and bounded audit provenance.
See [Policy Guardrails](policy-guardrails.md) for bounded declarative execution policy, immutable global/project revisions, atomic admission, and governance.
See [Vault and OpenBao Runtime Secrets](runtime-secrets.md) for provider configuration, value-free references, task-boundary resolution, managed outbound synchronization, and failure policy.
See [TOTP Capability Lifecycle](totp-capability-lifecycle.md) for rollout states, enrollment, replay protection, session revocation, and administrator recovery.
See [Custom Project Roles](project-roles.md) for the typed permission catalog, scoped role identity, assignment invariants, backend enforcement, and audit contract.

## Source Provenance

- Core and compatibility files originate from the public Semaphore repository.
- The full-product source is the independently reviewed clean-room implementation committed under `test/edition-contract/enhanced`.
- Thin adapters expose unchanged upstream packages where the selected slices do not require a replacement.
- Intent and focused tests may be reimplemented from historical branches after review. Stale branches are never merged wholesale.
- A release manifest identifies the shared source revision, contract version, implementation version, and compatibility edition metadata.

## Executable Contract Inventory

The application repository records every exported compatibility-module,
`pro_interfaces`, and root database declaration in `maintenance/contracts.yml`.
`go run ./tools/upstreamcheck -mode check` compares current compiler-derived
signatures and selected implementation origins with that reviewed inventory.
Promoted Community methods and function aliases remain visible. New or changed
callables require behavioral test references when checked against the previous
reviewed baseline. See [maintenance tooling](upstream-maintenance-tooling.md).

## Exported Contract Inventory

The core-owned contract types live in `pro_interfaces/`:

| Area | Interfaces and shared records |
|---|---|
| Capability presentation | `Features`, `Edition`, `Compatibility`, `CapabilityProvider`, `CapabilityServiceFacade`, typed decisions, limits, snapshots, and DTOs |
| Project runners | `ProjectRunnerController`, including health and history reads |
| Terraform inventory | `TerraformInventoryController` |
| Workflows | `WorkflowController`, `WorkflowService`, `WorkflowTaskEnqueuer`, `WorkflowRunLocker`, `WorkflowReconciler` |
| Structured logging and audit | `LogWriteService`, `LogWriteServiceLifecycle`, `DebugLogService`, per-instance `DebugFilter`, versioned application/task/result/debug envelopes, diagnostics, project-scoped `AuditEvent`, `AuditWebhookServiceFacade`, `AuditWebhookService`, signing lifecycle, configuration, delivery, and redacted attempt DTOs |
| Notification governance | Versioned provider-neutral notification event with exact source and lifecycle identities, deterministic source-transition identity, typed routing filters, severities, incident keys, and durable delivery state records. Provider transports remain outside the core contract until their owning slices. |
| Runtime secrets | `SecretReference`, `SecretProviderConfiguration`, `SecretProviderHealth`, `ManagedSecretField`, `ManagedSecretProvider`, `VaultOpenBaoClient`, and `RuntimeSecretResolver` |
| TOTP lifecycle | `TOTPService`, enrollment and rollout requests, status and ceremony DTOs, session requirements, and stable security errors |
| Project roles | Typed permission catalog, immutable project-role IDs, capability prerequisites, project assignment revisions, and audit actions |
| Signed webhooks | Canonical request binding and HMAC verification, current/next signing metadata, one-time secret results, audit attempt metadata, signed workflow ingress, and safe replay history |
| High availability | `NodeRegistry`, `OrphanCleaner`, `ClusterInspector`, `NodeInfo`, `RedisInfo` |

The replaceable module exports these application entry points:

| Package | Constructors and functions |
|---|---|
| `pro/api` | role, Terraform, and email-verification controllers |
| `pro/api/projects` | project runner, Terraform inventory, and workflow controllers |
| `pro/db/factory` | Terraform, Ansible task-summary, and workflow repositories |
| `pro/db` | workflow validation, condition matching, and root-node selection |
| `pro/pkg/features` | capability provider, guarded lifecycle-test service, TOTP lifecycle service, and compatibility metadata |
| `pro/pkg/stage_parsers` | task-stage progression |
| `pro/services/ha` | node registry, schedule deduplication, WebSocket broadcast, orphan cleanup, cluster inspection, and workflow locking |
| `pro/services/server` | structured logging, audit webhook export, notification governance and dispatch, workflow, secret-storage, and external-secret serializers |
| `pro/services/tasks` | task-state storage plus Docker and Kubernetes executor providers |

Concrete compatibility controllers, services, and repositories carry compile-time assertions against their core interfaces.
The contract tests fail at compile time when either side changes without reconciliation.

## Notification Governance Boundary

Contract version `1.15.0` adds the provider-neutral `semaphore.notification.v1` event, governance facade, and delivery-adapter boundary. Migration `2.20.51` stores destinations, routing rules, immutable events, and delivery attempts without coupling the core module to a provider transport.

- Task, workflow-run, approval, and global system sources write their notification event and routing outcome inside the same transaction as the source mutation. A monotonically increasing source revision and deterministic source-event key make a replay idempotent; a lifecycle-derived incident key remains stable across trigger, update, resolve, worker restart, and manual retry.
- Destinations and rules are either global or project scoped. Create, update, and delete operations use optimistic revisions; deleting a destination removes its scoped rules while immutable event and delivery history remains. Global configuration and retry require `CanManageGlobalSystem`; global preview and history require `CanReadGlobalAudit`. Project configuration and retry require `CanManageProjectResources`; project preview and history require `CanViewProjectResources`. Scope comes from the route and cannot be selected in request JSON.
- Destination credentials are write-only. Enhanced writes fail closed when option encryption is unavailable, decrypt only immediately before adapter dispatch, and never expose plaintext or ciphertext through DTOs, audit details, logs, or delivery history.
- The adapter contract accepts only the typed allow-listed event, immutable destination metadata, optional typed provider configuration, safe asynchronous request identity, and the transient credential. It returns a bounded outcome, optional retry delay, and optional validated request ID; raw HTTP status, headers, bodies, and free-form provider errors cannot cross this boundary. PagerDuty, Opsgenie, and ServiceNow payloads and transports belong to slices 057–059.
- The dispatcher uses random lease tokens, bounded attempts, exponential backoff with jitter, bounded rate-limit delays, restart reclamation, and fenced terminal writes. Pausing releases claimed work without consuming an attempt; resuming preserves the immutable configuration generation, while an explicit scoped manual retry may bind a failed delivery to the current generation and clears stale provider-request state.
- Delivery history exposes only bounded event identity, source, action, severity, destination snapshots, attempts, reason codes, and timestamps. A separate paginated event history makes both `routed` and `filtered` outcomes inspectable without selecting the typed details column.
- The existing audit-webhook administration page contains a collapsed global governance section. Project-scoped governance remains available through the API so the core project UI and navigation stay unchanged.

## PagerDuty Delivery Boundary

Contract version `1.16.0` adds an allow-listed provider region to destination input, safe destination reads, dispatch requests, and immutable delivery-history snapshots. Migration `2.20.52` defaults legacy PagerDuty destinations and deliveries to the US region while leaving other providers regionless; retained deliveries remain attributable even after their destination is deleted.

- PagerDuty accepts only `us` and `eu`. Production transport selects `https://events.pagerduty.com/v2/enqueue` or `https://events.eu.pagerduty.com/v2/enqueue`; no destination-controlled URL, environment proxy, or redirect can change the egress target.
- Routing keys are write-only, encrypted destination credentials and must contain exactly 32 ASCII alphanumeric characters when supplied. A provider change requires an explicit replacement credential so encrypted material cannot cross provider boundaries.
- Trigger and update lifecycle events map to PagerDuty `trigger`; resolve maps to `resolve`. Every action uses the provider-neutral incident key as the `dedup_key`, so retries and lifecycle transitions address the same alert through the same routing key.
- PD-CEF summary, source, severity, timestamp, component, group, class, and custom details are built only from the typed notification event and are UTF-8 byte bounded before transport. The payload cannot include the reserved free-form message field and cannot exceed 512 KiB.
- HTTP `202` is accepted. `429` is rate limited with a bounded `Retry-After`; `408`, `425`, `5xx`, network failures, and timeouts are transient; other responses are terminal. Provider headers, bodies, status codes, routing keys, and free-form errors never enter persisted history or browser DTOs.
- The existing collapsed governance UI adds only a conditional US/EU selector and safe region/incident metadata inside existing cells. It does not add a provider route, navigation item, or project-level UI surface.

## Opsgenie Delivery Boundary

Contract version `1.17.0` adds typed Opsgenie priority/responders, a provider-neutral pending outcome, and a validated asynchronous provider-request ID. Migration `2.20.54` stores canonical non-secret provider configuration with the destination and the safe request ID with its delivery history.

- Opsgenie accepts only `us` and `eu`. Production transport selects `https://api.opsgenie.com` or `https://api.eu.opsgenie.com`; no destination-controlled URL, environment proxy, or redirect can change the egress target.
- API integration keys are write-only encrypted credentials and must be bounded visible ASCII when supplied. Provider changes still require an explicit replacement credential, and request payloads/history never contain the key.
- Trigger and update submit Alert API v2 create requests with the provider-neutral incident key as `alias`; resolve closes the same alias. Message, description, typed responders, generated tags, details, entity, source, and priority remain within documented provider limits and come only from typed configuration/event fields.
- Create and close require HTTP `202` plus a bounded request ID. The lease-fenced worker persists that ID, then polls `/v2/alerts/requests/{requestId}` across restarts until the bounded attempt budget yields success, terminal provider failure, or exhaustion. Direct close `404` and the exact completed `Alert does not exist` resolve result are idempotent success; the same status is terminal for create/update.
- `429` uses bounded rate-limit period or retry headers; `408`, `425`, `5xx`, network failures, and timeouts are transient; other responses are terminal. Response bodies are size bounded and never enter history, logs, or DTOs.
- The existing collapsed governance UI conditionally adds region, priority, and line-oriented typed responder fields, plus safe provider-request identity in the existing history cell. No provider route, navigation item, or project-level surface is added.
- Atlassian is phasing Opsgenie out and states that its REST APIs remain available until the April 5, 2027 support end. This adapter is a bounded compatibility path for existing users rather than a new architectural dependency.

## ServiceNow Delivery Boundary

Contract version `1.18.0` adds typed ServiceNow authentication and incident-field mapping, a provider-neutral ambiguous-create outcome, exact provider-record identity in delivery history, and an optional lifecycle-reconciliation adapter. Migration `2.20.55` stores safe provider record metadata and a lifecycle-wide create fence.

- ServiceNow destinations accept only canonical HTTPS instance origins below `service-now.com` or `servicenow.com`, with no path, credentials, custom port, environment proxy, or redirect. Production DNS resolution rejects non-public, reserved, documentation, benchmark, and carrier-grade NAT addresses before connecting.
- OAuth 2.0 client credentials are preferred; Basic authentication remains an explicit alternative. Secrets are write-only encrypted destination credentials. Client IDs, Basic usernames, optional scopes, and the administrator-defined field mapping are bounded, typed configuration; authentication modes cannot carry each other's identity fields.
- The adapter is restricted to the versioned Table API for `incident`. It maps only `summary`, `severity`, `lifecycle_action`, and optional `status` into the approved `short_description`, `description`, `impact`, and `urgency` targets. Append-only or arbitrary table fields are not available.
- Trigger delivery first performs an exact, two-result-bounded `correlation_id` lookup. A durable lifecycle binding is fenced immediately before the one permitted incident `POST`; a restart or ambiguous response reconciles by the exact 64-character incident key and never issues a second create. Zero matches remain bounded retry, exactly one valid match binds its `sys_id`, and multiple or malformed matches fail closed.
- Update and resolve address only `/api/now/v1/table/incident/{sys_id}` using the persisted lowercase 32-character identity. The binding, all matching lifecycle-history metadata, and the successful owner delivery are committed atomically after create.
- Create accepts only an unambiguous body or same-origin Location identity. `429` uses bounded `Retry-After`; `408`, `425`, `5xx`, timeouts, and network failures are transient; invalid authentication, authorization, validation, identities, and response shapes are terminal. A create conflict or missing/conflicting identity is ambiguous and enters reconciliation. Provider bodies, headers, status codes, tokens, and free-form errors never enter history, logs, audit details, or DTOs.
- The existing collapsed governance UI conditionally adds only the instance origin, authentication fields, line-oriented field mapping, and safe record link. The controlled test uses the fixed summary `Semaphore controlled notification test`; no provider route, navigation item, or project-level surface is added.

## Signed Webhook Boundary

Contract version `1.21.0` adds the shared `semaphore.webhook.v1` binding and verification functions, current/next signing lifecycle DTOs, redacted audit-attempt history, signed workflow ingress, and safe replay metadata. Migration `2.20.64` stores encrypted audit and workflow signing state, audit delivery attempts, and rotation-independent workflow replay identities.

- The core contract owns canonical binary framing, strict header syntax, HMAC-SHA-256 signing and constant-time verification, the inclusive five-minute freshness window, server-generated key material, and the durable trigger/event identity hash. HTTP clients, persistence, workers, and controllers remain replaceable-module responsibilities behind their existing interfaces.
- Audit delivery keeps the immutable event ID and payload across attempts but signs each attempt with a fresh timestamp. Production selects exactly the current key; controlled tests may select current or next. Attempt DTOs expose only key identity, bounded outcome/reason, HTTP status, and timestamps.
- Workflow webhook ingress binds the raw request target and body before JSON decoding, accepts current and next only during an explicit overlap, and commits the replay claim before workflow start. API-trigger Bearer authentication remains a separate route and cannot authenticate a webhook request.
- Secrets cross the module boundary only in one-time mutation responses and transient signing/verification calls. Ciphertext, plaintext, HMACs, raw headers, request bodies, and internal verification reasons remain absent from read DTOs, logs, audit details, retained browser state, and backups.
- Existing Audit Webhook and Workflow Triggers surfaces host the minimal signing controls. Community navigation, shared layout, workflow routes, and unrelated administration UI remain unchanged.

## Compatibility Stub Contract

The unshipped compatibility module retains explicit disabled behavior for upstream contract testing:

| Response | Routes |
|---|---|
| `200` with `[]` | role collections, project runner/tag collections, Terraform alias/state collections, workflow/run/approval collections |
| `201` with `{}` | project runner registration-token regeneration |
| `403` with an empty body | enhanced email-session verification |
| `404` with no protected resource data | role mutations and details; Terraform state operations; project runner mutations, details, health, and history; workflow mutations and details |
| `503` with a bounded unavailable response | global and project notification-governance configuration, preview, test, history, and retry routes |

Compatibility middleware delegates to the next handler without mutating the request or invoking a repository.
Compatibility capability flags are all false, collection services return empty values, log writers have no side effects, and enhanced executor constructors return an explicit unavailable error.
Compatibility TOTP operations return unavailable; any persisted enrollment prevents password-only session creation rather than weakening authentication.

## Verification

The committed root `go.work` contains the core module and `test/edition-contract/enhanced`.
Contract tests verify that the clean-room directory owns the `github.com/semaphoreui/semaphore/pro` path, run the capability consumer, and build the full `github.com/semaphoreui/semaphore/cli` package without editing application imports.

Run the contract layers with:

```bash
go test ./pro_interfaces -run TestWorkspaceSelectsCleanRoomEnhancedModule -count=1
(cd pro && go test ./... -count=1)
go build ./cli
```
