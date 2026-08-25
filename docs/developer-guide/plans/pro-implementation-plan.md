# Enhanced Edition Implementation Plan

## Table of Contents

- [Outcome](#outcome)
- [Evidence Snapshot](#evidence-snapshot)
- [Feasibility Conclusion](#feasibility-conclusion)
- [Delivery Options](#delivery-options)
- [Target Architecture](#target-architecture)
- [Decisions Required Before Implementation](#decisions-required-before-implementation)
- [Delivery Sequence](#delivery-sequence)
- [Foundation Plan](#foundation-plan)
- [Pro Capability Plans](#pro-capability-plans)
- [Enterprise Capability Plans](#enterprise-capability-plans)
- [Existing Backlog Plans](#existing-backlog-plans)
- [Additional Capability Plans](#additional-capability-plans)
- [Testing and Verification Strategy](#testing-and-verification-strategy)
- [Migration and Rollout Strategy](#migration-and-rollout-strategy)
- [Risks](#risks)
- [Definition of Ready](#definition-of-ready)
- [Definition of Done](#definition-of-done)
- [Source Map](#source-map)

## Outcome

This plan provides two viable ways to obtain enhanced Semaphore functionality.
The shortest and lowest-risk path is to use the official licensed module.
The independent path is a clean-room implementation behind the repository's existing replaceable Go module boundary.

The [feature selection document](pro-feature-selection.md) is the approval surface.
This document plans every selectable capability without treating any unchecked item as authorized implementation work.
The checked D02 selection is expanded into the ordered [vertical-slice implementation backlog](pro-slices/README.md).

## Evidence Snapshot

The repository was fetched and inspected on 2026-08-24 at commit `071b312b8993121a2ce4a34b84c0e12b73477729` on `develop`.
The working copy tracks `origin/develop` in `freefair/semaphore-ex`.

| Area | Verified state |
|---|---|
| Backend | Go 1.26.4 module `github.com/semaphoreui/semaphore` |
| Frontend | Vue 2.6, Vuetify 2.6, Vue CLI 5 |
| Persistence | PostgreSQL, MySQL/MariaDB, SQLite, plus legacy Bolt-related code |
| Enhanced contract | `pro_interfaces/` contains capability, controller, service, HA, logging, and workflow contracts |
| Community implementation | `pro/` intentionally returns empty collections, `404`, `false`, `nil`, or safe no-op behavior |
| Enhanced build seam | Official workflows clone a private `semaphorepro-module` into `pro_impl` and activate it with a Go Workspace |
| Frontend gating | `GET /api/info` returns a `features` object; the UI also uses `VUE_APP_BUILD_TYPE` for presentation decisions |
| Enhanced data model | Core includes runner, role, secret-storage, Terraform-state, workflow, approval, and artifact-related types and routes |
| Remote branches | 268 remote refs are not merged into `develop`; 27 are named `feat/*` or `feature/*`, of which 24 carry commits not reachable from `develop` |
| Private source | No `pro_impl/` object exists in any locally reachable Git history |

The current official product matrix lists project runners, tag routing, Terraform/OpenTofu HTTP state, TOTP, LDAP, OIDC, Vault, task summaries, and file log export as Pro capabilities.
It lists HA, custom roles, IdP group mapping, and additional external secret providers as Enterprise capabilities.
The current public roadmap also describes Pro workflows and future inventory, notification, and secret-management capabilities.

Primary references:

- [Semaphore pricing and current capability matrix](https://semaphoreui.com/pricing)
- [Semaphore Pro overview](https://semaphoreui.com/pro)
- [Semaphore public roadmap](https://semaphoreui.com/roadmap)
- [Semaphore license activation documentation](https://semaphoreui.com/docs/admin-guide/license)
- [Semaphore product terms](https://semaphoreui.com/legal/terms-of-service)
- [Terraform HTTP backend protocol](https://developer.hashicorp.com/terraform/language/backend/http)
- [Terraform state security guidance](https://developer.hashicorp.com/terraform/language/manage-sensitive-data)

## Feasibility Conclusion

Implementing enhanced features is technically feasible because the Community repository already provides most cross-edition models, routes, UI surfaces, factories, and interfaces.
The missing work is substantial because the actual persistence, orchestration, entitlement, HA, log export, and external-provider behavior is deliberately absent.

A wholesale merge of old feature branches is not feasible or responsible.
Most feature branches are hundreds of commits behind `develop`, and several combine migrations, UI changes, plans, and unrelated generated-file churn.
They are useful as design evidence and test sources, but new work should start from current `develop` and port one vertical behavior at a time.

An independent implementation must remain clean-room.
The public contracts and documentation can define expected behavior, but proprietary source code must not be requested, copied, reconstructed from binaries, or treated as MIT-licensed.

## Delivery Options

| Option | Advantages | Costs and constraints | Recommendation |
|---|---|---|---|
| D01 — Official licensed module | Fastest path, vendor support, product compatibility, existing activation flow | Commercial dependency, no implementation control, private build input | Choose when the goal is simply to operate official Pro/Enterprise |
| D02 — Independent enhanced module | Preserves upstream seam, isolates custom code, keeps Community behavior testable, full product control | Largest implementation and maintenance cost, clean-room discipline, separate release compatibility work | Choose only when control or custom behavior justifies ownership |
| D03 — Enhanced behavior in Community core | One module and one build | Highest merge burden, harder upstream sync, capability separation becomes implicit | Avoid unless edition separation is explicitly unwanted |

The architecture below assumes D02 because it is the only implementation-heavy option.
If D01 is selected, the plan becomes an integration, compatibility, security-review, and deployment project rather than a feature reimplementation.

## Target Architecture

The existing dependency direction should remain intact.

```text
Vue UI
  -> Community HTTP router and middleware
     -> public pro_interfaces contracts
        -> Community pro/ no-op module in Community builds
        -> independent enhanced module in enhanced builds
           -> Community db.Store and domain types
           -> external clients for Redis, Vault, AWS, Azure, Devolutions
```

The enhanced module should use the same module path expected by current imports and satisfy every public constructor and interface.
The root repository remains the owner of shared domain types, schema migrations, route registration, and Community-safe behavior.
The enhanced module owns enhanced repository implementations, orchestration, entitlement resolution, external clients, and capability-specific tests.

The build must select a module implementation without changing application source.
Community CI builds against `./pro`.
Enhanced CI checks out a pinned enhanced-module revision, creates a Go Workspace, and builds both server and runner from the same pair of commits.
Private Git credentials must be passed through the CI checkout mechanism or BuildKit secret mounts, not Docker `ARG` values.

The server is authoritative for every capability.
UI feature flags control visibility and explanation only.
Every enhanced route, service entry point, background worker, and resource-limit check must reject unauthorized use even when called directly.

Shared SQL remains the system of record.
Redis is used for HA heartbeats, Pub/Sub, schedule deduplication, and short-lived coordination locks.
Conditional SQL updates remain the correctness boundary when Redis locks expire or a node fails.

Related decisions:

- [ADR 0001 — Preserve the replaceable enhanced module boundary](../adr/0001-preserve-enhanced-module-boundary.md)
- [ADR 0002 — Make capabilities backend-authoritative](../adr/0002-backend-authoritative-capabilities.md)
- [ADR 0003 — Keep SQL authoritative in HA](../adr/0003-sql-authority-and-redis-coordination.md)
- [ADR 0004 — Encrypt and version Terraform state](../adr/0004-secure-terraform-http-state.md)

## Decisions Required Before Implementation

These questions affect product behavior, deployment, cost, or legal scope and therefore require explicit selection.

1. Select D01, D02, or D03 in the feature selection document.
2. State whether the result is private internal software, a distributed fork, or a commercial product.
3. Select the initial database dialects and deployment environments that must be supported at first release.
4. Select the exact Pro and Enterprise capability IDs.
5. Decide whether quotas and license validation are required at all.
6. If quotas are required, decide whether entitlements are static internal configuration, centrally issued signed documents, or the official Semaphore subscription service.
7. Define the supported upgrade source and rollback window.
8. Define the required availability target before selecting E01.

No implementation ticket may enter Ready while one of its user-visible or operational decisions remains unresolved.

## Delivery Sequence

The order minimizes irreversible schema work and makes each completed slice observable.

1. **Foundation:** F01–F06.
2. **Operational core:** P01, P02, P03, P04, and P05.
3. **Secret integration:** P06, then selected E04 providers.
4. **Workflow platform:** P08 in its listed child order.
5. **Authorization:** E02 and E03, building on the existing external-identity baseline.
6. **Resilience:** P01c and B18, building on the existing encryption-keyring baseline, then E01.
7. **Executor isolation:** E05 and E06 after runner placement is stable.
8. **Enterprise workflow and governance:** E07, E09, and E10.
9. **Independent backlog and additional capabilities:** one selected vertical slice at a time.

Every delivery stage is optional except Foundation when D02 or D03 is selected.

## Foundation Plan

### F01 — Executable Community/enhanced Contract Suite

**Outcome:** The same core commit can prove Community behavior, enhanced contract compatibility, and absence of accidental feature leakage.

Implementation slices:

1. Inventory every `pro_interfaces` method and every constructor imported from `github.com/semaphoreui/semaphore/pro`.
2. Write black-box HTTP and service contracts for Community disabled behavior before changing implementation code.
3. Add compile-time interface assertions for every enhanced implementation.
4. Add database fixtures that describe existing enhanced tables without depending on proprietary code.
5. Add a minimal enhanced test double that proves Go Workspace replacement and dependency wiring.

Acceptance criteria:

- [ ] Community builds without the enhanced repository or credentials.
- [ ] Community enhanced routes expose only the documented disabled behavior and no mutable side effects.
- [ ] The enhanced test double satisfies all public interfaces.
- [ ] Contract failures identify the exact method, route, or schema mismatch.
- [ ] A core-interface change fails both build variants until both implementations are updated.

### F02 — Reproducible Build and Test Matrix

**Outcome:** A released binary can be reproduced from an exact core commit, enhanced-module commit, toolchain, frontend lockfile, and build type.

Implementation slices:

1. Pin Go, Node, task runner, container bases, and enhanced-module revision.
2. Build server and runner in Community and enhanced variants.
3. Run unit, integration, migration, frontend, API-contract, and container smoke tests for both variants.
4. Generate SBOMs and provenance containing both source revisions.
5. Verify that build logs and image layers contain no repository token or entitlement secret.

Acceptance criteria:

- [ ] Repeating a build from the same inputs produces equivalent artifacts.
- [ ] Community jobs never receive credentials for the enhanced repository.
- [ ] Enhanced source checkout uses a pinned revision rather than an unbounded branch head.
- [ ] Both images start and report the expected build type and capability matrix.

### F03 — Backend-Authoritative Capability Service

**Outcome:** Capabilities, limits, and plan metadata have one server-side source of truth.

Implementation slices:

1. Define typed capability and limit identifiers instead of free-form strings.
2. Introduce a provider that resolves the current entitlement snapshot.
3. Apply capability middleware and service guards to every enhanced operation.
4. Expose a sanitized effective-capability document through `/api/info`.
5. Record entitlement transitions and rejected attempts without logging keys.

Acceptance criteria:

- [ ] Direct API calls cannot bypass disabled UI controls.
- [ ] Background workers do not perform disabled enhanced operations.
- [ ] Capability changes are atomic from a request's perspective.
- [ ] The API never returns a plaintext license key or secret.
- [ ] Existing opaque user sessions remain unchanged.

### F04 — Disabled, Upgrade, and Downgrade Semantics

**Outcome:** Disabling a capability cannot corrupt or silently delete its existing data.

Rules:

- Enhanced data remains stored when a capability is disabled.
- Reads either return a clear disabled response or a documented read-only view.
- Writes and new executions are rejected server-side.
- Already running work follows a capability-specific policy chosen before delivery.
- Re-enabling the capability restores access without a reverse migration.

Acceptance criteria:

- [ ] Every capability documents behavior for activation, expiry, downgrade, and reactivation.
- [ ] No downgrade path deletes rows, state versions, logs, credentials, or workflow history.
- [ ] UI messaging distinguishes unavailable, disabled, expired, and insufficient-permission states.

### F05 — Database Compatibility and Migration Policy

**Outcome:** Enhanced migrations behave consistently across supported SQL dialects and remain recoverable.

Implementation slices:

1. Add dialect-specific migration fixtures from the current `develop` schema.
2. Require forward and rollback scripts for every reversible schema change.
3. Separate expand, backfill, switch, and contract stages for large tables.
4. Test mixed-version operation during rolling upgrades where supported.
5. Publish backup and restore prerequisites for irreversible data transformations.

### F06 — Security and Observability Baseline

**Outcome:** Every later feature inherits authorization, redaction, audit, metrics, and diagnostics conventions.

Acceptance criteria:

- [ ] Authorization tests cover anonymous, regular, project-role, and admin callers.
- [ ] Logs, metrics labels, traces, API errors, and audit payloads exclude secret material.
- [ ] All outbound clients define timeouts, TLS verification, retry limits, and circuit behavior.
- [ ] Audit events include actor, action, target, outcome, request correlation, and source context.
- [ ] Health endpoints distinguish required dependency failure from optional integration failure.

## Pro Capability Plans

### P01 and P02 — Project Runners, Registration, and Placement

**Current leverage:** The core already contains runner models, runner services, internal runner APIs, project runner routes, frontend forms, tags, and a `ProjectRunnerController` contract.
The Community controller is the missing project-scoped behavior.

Vertical slices:

1. **Read-only project runner inventory:** list, detail, online state, version, platform, uptime, and permissions.
2. **Secure registration:** create an unregistered runner, issue a single-use short-lived registration token, atomically consume it, and show the resulting identity once.
3. **Lifecycle management:** activate, deactivate, rotate registration, clear cache, and delete with in-flight-task safeguards.
4. **Placement:** choose eligible runners by project, active state, heartbeat, tag expression, executor capability, and deterministic tie-breaking.
5. **Template integration:** select tags and allowed executor image through validated template fields.
6. **Recovery:** reconcile stale assignments, runner restarts, duplicate polls, task cancellation, and late completion reports.
7. **Operator UX:** explain why no runner is eligible and preserve the assigned runner on task history.

Acceptance criteria:

- [ ] A project member sees only runners allowed by backend authorization.
- [ ] A registration token is high entropy, single use, short lived, stored only as a hash, and never returned again.
- [ ] Concurrent registration attempts can activate at most one runner identity.
- [ ] Placement is deterministic for the same eligible set and never selects inactive or stale runners.
- [ ] A task reaches exactly one terminal state despite retries, late reports, or node failure.
- [ ] Finished task history retains a non-secret runner identity.
- [ ] Browser verification covers creation, registration, routing, offline state, recovery, and deletion.

Branch use:

- Port focused tests and behavior from `feat/unregistered_runners`, `feat/tagged_global_runner`, `feat/runner_register_options`, `feat/executor_image_in_template`, `runner_secure_mode`, `runner_task_requeue`, and `ha_remove_owner`.
- Do not merge any of those branches wholesale.

### P03 — Terraform/OpenTofu HTTP Backend

**Current leverage:** Public routes, alias models, state models, UI, store interfaces, and controller contracts already exist.

Vertical slices:

1. **Protocol fixture:** exercise GET, POST, DELETE, LOCK, and UNLOCK with real Terraform and OpenTofu clients against a temporary server.
2. **Alias authentication:** create a scoped alias and opaque credential, store only a hash where possible, and support rotation without changing the state URL.
3. **Encrypted version storage:** encrypt every state payload at rest, append versions transactionally, retain lineage and serial metadata, and expose recovery history only to authorized users.
4. **Locking:** atomically acquire a lock by alias, return protocol-correct `409` or `423` responses with holder metadata, and unlock only with the matching lock ID unless an authorized force-unlock is used.
5. **Concurrency:** bind state update to the current lock ID and reject stale or conflicting writes.
6. **UI and audit:** show state versions, lock owner, recovery actions, and access history without rendering state plaintext by default.

Acceptance criteria:

- [ ] Real Terraform and OpenTofu can initialize, plan, apply, pull, lock, unlock, and recover state.
- [ ] Two concurrent writers cannot both hold the lock or commit conflicting versions.
- [ ] A wrong lock ID cannot unlock or update state.
- [ ] Database rows and backups do not contain plaintext state.
- [ ] State read, write, delete, lock, unlock, and force-unlock are audited.
- [ ] Key rotation keeps all retained versions decryptable until rekey completes.

### P04 — Task Execution Summaries

**Current leverage:** `db.AnsibleTaskRepository`, task result contracts in `db/ansible.go`, stage parsers, and summary UI hooks exist.

Vertical slices:

1. Persist normalized host outcomes and structured task errors from the execution stream.
2. Make writes idempotent by task, host, play, and event identity.
3. Derive totals and failed-host summaries server-side.
4. Expose paginated summary endpoints with project/task authorization.
5. Render overview, failed hosts, error groups, and links to the corresponding raw-log position.
6. Define retention and deletion behavior together with task history.

Acceptance criteria:

- [ ] Summary totals match a fixed real Ansible execution fixture.
- [ ] Retry or duplicate event delivery does not double-count a host result.
- [ ] Very large inventories remain bounded by pagination and do not require loading the raw log into the browser.
- [ ] Summary data never includes secret extra variables or decrypted credentials.
- [ ] A task deletion applies the documented summary retention policy.

### P05 — File and Structured Log Export

**Current leverage:** `LogWriteService`, event/task record contracts, task lifecycle hooks, syslog support, and debug formatter code exist.

Vertical slices:

1. Define versioned JSON Lines schemas for event, task lifecycle, and task result records.
2. Write through an asynchronous bounded queue with explicit backpressure behavior.
3. Use atomic append, restrictive permissions, rotation, retention, and reopen-on-rotation handling.
4. Add optional webhook or syslog sinks behind independent clients.
5. Add debug filtering without changing source log statements.
6. Surface exporter lag, drops, delivery errors, and last success through metrics and admin status.

Acceptance criteria:

- [ ] A known lifecycle produces exactly the expected ordered schema records.
- [ ] Passwords, tokens, private keys, state payloads, and survey secrets are redacted by tripwire tests.
- [ ] Rotation does not lose or duplicate accepted records.
- [ ] A slow external sink cannot block task finalization indefinitely.
- [ ] Sink failure is visible and recoverable without crashing the server.

### P06 — Vault and OpenBao Secret Storage

**Current leverage:** Secret storage entities, CRUD, sync scheduling, access-key serializer selection, Vault/OpenBao type values, and UI forms already exist.

Vertical slices:

1. Implement a client interface for authentication, read, write, delete, health, and token renewal.
2. Store only provider references and encrypted provider credentials locally.
3. Resolve runtime secrets into memory immediately before execution.
4. Zero or release temporary buffers where practical and prevent secret values from entering errors.
5. Implement read-only and managed modes explicitly.
6. Make sync idempotent, observable, HA-deduplicated, and safe under partial provider failure.

Acceptance criteria:

- [ ] A runtime secret is usable by a task but absent from database plaintext, API responses, logs, and process arguments.
- [ ] Provider timeouts fail the task with a redacted actionable error.
- [ ] Read-only storage cannot be mutated through the Semaphore API.
- [ ] Deleting a referenced storage is blocked with referrer details.
- [ ] Token renewal and expiry behavior is deterministic and tested with a fake provider.

### P07 — Authentication Capability Enforcement

The repository already implements opaque server-side sessions, TOTP, LDAP, and OIDC paths.
This work adds capability enforcement only if edition separation is part of the selected delivery model.

Acceptance criteria:

- [ ] Disabling a login provider never locks out the last configured recovery administrator without an explicit override procedure.
- [ ] OIDC uses state, nonce, issuer, audience, and redirect validation.
- [ ] LDAP and OIDC errors do not reveal whether an unrelated local account exists.
- [ ] Session tokens remain opaque, revocable, and server-side.
- [ ] Authentication feature changes are audited.

### P08 — Project Workflows

**Current leverage:** The core contains workflow types, migrations, routes, editor, graph renderer, run UI, approvals, task-pool hooks, backup/restore support, and comprehensive public interfaces.
The enhanced workflow repository, service, reconciler, and controller are no-op stubs.

Delivery slices:

1. **P08a — Template persistence and validation.**
   Implement transactional graph create/update/delete, root validation, cycle detection, node-kind validation, and cross-project reference rejection.
2. **P08b — Execution engine.**
   Mint immutable run versions, enqueue the root, evaluate `on_success`, `on_failure`, and `always`, support ALL convergence, and launch independent ready nodes in parallel.
3. **P08c — Run dashboard.**
   Provide stable run, node, task, timing, and status APIs consumed by the existing graph UI.
4. **P08d — Artifacts.**
   Parse bounded task output artifacts, merge only reachable upstream values, apply explicit conflict rules, and inject them into downstream tasks.
5. **P08e — Triggers and parameters.**
   Add workflow schedules, API and webhook triggers, parameter validation, and idempotency keys.
6. **P08f — Per-node overrides.**
   Validate inventory, environment, credential, variable-group, and CLI overrides at both save and execution time.
7. **P08g — Approvals.**
   Persist pending approvals, authorize approvers, resolve once with conditional SQL, handle timeout, notify, and audit approve/reject actions.
8. **Reconciliation.**
   Periodically progress all non-terminal runs, recover missed task completions, and use per-run locks as an optimization.
9. **Stop behavior.**
   Stop queued and running child tasks and converge the workflow run to one terminal status.

Acceptance criteria:

- [ ] A real browser can create, validate, save, run, observe, approve, reject, stop, and rerun a workflow.
- [ ] Diamond DAGs launch each converged node exactly once under concurrent parent completion.
- [ ] A node never consumes artifacts from an unreachable or unrelated branch.
- [ ] Approval resolution, stop, timeout, and task completion races converge deterministically.
- [ ] A server restart and an HA node failure do not strand a non-terminal run.
- [ ] Backup and restore preserve definitions but not unsafe live execution state.
- [ ] API and UI authorization match for every workflow operation.

### P09 — Usage Accounting and Configurable Limits

Implement this capability only when the selected delivery model needs enforceable commercial or internal quotas.
Do not add artificial limits to an independent internal edition without a stated product requirement.

Delivery slices:

1. Define typed counters for active users, registered runners, Terraform state aliases, managed nodes, and active instances.
2. Specify the authoritative query and exact inclusion rules for each counter, including disabled, deleted, stale, and pending resources.
3. Evaluate limits transactionally at the write or registration boundary rather than through UI checks.
4. Expose current usage, limit, remaining capacity, measurement time, and actionable remediation without exposing entitlement secrets.
5. Reconcile cached counts against SQL and record discrepancies without blocking unrelated operations.
6. Define behavior for limit reduction, temporary overage, provider outage, expiry, and administrative recovery.

Acceptance criteria:

- [ ] Concurrent creates cannot commit more resources than the effective hard limit allows.
- [ ] Existing resources remain readable when a lowered limit creates an overage, while the documented new-write policy is enforced.
- [ ] Every counter has fixtures for deletion, disablement, staleness, and reactivation.
- [ ] The UI and API report the same effective usage snapshot and limit reason.
- [ ] Usage refresh and enforcement continue safely through capability-provider restarts or temporary unavailability.
- [ ] Community builds contain no unintended quota enforcement.

## Enterprise Capability Plans

### E01 — Active-Active High Availability

**Current leverage:** Core startup wiring already expects node registry, schedule deduplicator, WebSocket broadcaster, orphan cleaner, task state store, workflow run locker, and cluster inspector implementations.

Vertical slices:

1. Register each node with a unique identity, startup metadata, and expiring heartbeat.
2. Use Redis Pub/Sub for cross-node WebSocket and scheduler refresh events with reconnect and resubscribe behavior.
3. Deduplicate each schedule occurrence by schedule ID and logical fire time.
4. Reconcile task ownership and mark or retry work from dead nodes according to task type and idempotency.
5. Protect task and workflow transitions with conditional SQL updates.
6. Expose cluster nodes, Redis health, key groups, queue depth, and recovery activity through the admin dashboard.
7. Test rolling restart, Redis restart, network partition, node pause, and duplicate delivery.

Acceptance criteria:

- [ ] Two nodes serving the same database fire one scheduled occurrence exactly once.
- [ ] A WebSocket event created on one node reaches a client connected to another node.
- [ ] Node death does not leave tasks or workflow runs permanently non-terminal.
- [ ] Redis lock expiry cannot cause duplicate committed transitions.
- [ ] HA mode refuses unsafe startup when required shared dependencies are unavailable.
- [ ] Single-node mode continues to work without Redis.

### E02 and E03 — Custom Roles and Identity Mapping

Vertical slices:

1. Define a stable permission catalog with scope and implication rules.
2. Implement global and project role repositories and transactional CRUD.
3. Enforce permissions in middleware and service methods, including task/template-specific permissions.
4. Prevent deletion or mutation of protected built-in roles.
5. Map LDAP/OIDC groups to roles and project memberships through declarative rules.
6. Reconcile external membership with explicit ownership so locally managed grants are not accidentally removed.
7. Provide a dry-run mapping preview and audit every effective change.

Acceptance criteria:

- [ ] Every protected action has allow and deny tests for built-in and custom roles.
- [ ] The UI never grants an action that the API rejects, and hidden UI never substitutes for backend authorization.
- [ ] Removing an IdP group removes only externally managed grants.
- [ ] A malformed or unavailable identity provider cannot silently grant broader permissions.
- [ ] At least one recoverable administrator path remains after mapping changes.

### E04 — AWS, Azure, and Devolutions Secret Providers

Implement one provider per vertical ticket after P06 establishes common behavior.

Each provider ticket includes:

1. Provider-specific client and fake server or emulator contract.
2. Authentication through environment, workload identity, or encrypted local reference without personal-tool dependencies.
3. Read, optional managed write/delete, health, timeout, retry, and rate-limit behavior.
4. Exact mapping between Semaphore key fields and provider secret payloads.
5. Redaction, audit, rotation, and failure recovery.

Acceptance criteria:

- [ ] Provider tests cover permission denial, missing secret, throttling, timeout, invalid credentials, and partial outage.
- [ ] A secret value never appears in an API response or diagnostic artifact.
- [ ] Managed deletion cannot remove a provider secret still referenced by Semaphore resources.

### E05 and E06 — Docker and Kubernetes Executors

Delivery slices:

1. Define an executor interface for start, stream, signal, stop, inspect, and cleanup.
2. Validate images against an allowlist or signed-image policy.
3. Build a minimal immutable task bundle with references to short-lived credentials.
4. Apply CPU, memory, process, filesystem, and network constraints.
5. Stream logs with bounded buffering and preserve cancellation semantics.
6. Garbage-collect abandoned containers, Jobs, volumes, and credentials.
7. Report executor placement and lifecycle in task details and audit logs.

Acceptance criteria:

- [ ] A task cannot escape the selected project or service-account permissions.
- [ ] Stop terminates the real workload, not only the Semaphore status record.
- [ ] Server or runner restart triggers deterministic inspection and cleanup.
- [ ] Pull failure, image-policy denial, scheduling failure, and out-of-memory termination have distinct operator-facing results.
- [ ] Browser verification covers template selection, run, live log, cancel, failure, and cleanup.

### E07 — Enterprise Workflow Controls

Vertical slices:

1. Add workflow CRUD, run, stop, and approve permissions to E02.
2. Assign approval gates to roles or groups and capture the effective approver set on run creation.
3. Reference cross-project templates through explicit immutable identifiers and permission checks in both projects.
4. Store immutable workflow definition versions and bind each run to one version.
5. Show diffs and permit rollback by creating a new version from an old definition.

Acceptance criteria:

- [ ] Losing access after run creation follows a documented approval policy and cannot elevate privilege.
- [ ] A cross-project run cannot access credentials or inventories beyond the referenced template's explicit grants.
- [ ] Historical runs render from their original immutable definition.

### E08 — Air-Gapped and Multi-Instance Entitlements

This capability is implemented only if a commercial or centrally governed entitlement model is selected.

Delivery slices:

1. Define a signed, versioned entitlement document with issuer, subject, capabilities, limits, instance rules, validity, and key ID.
2. Verify signatures locally with embedded public keys and support key rotation.
3. Define clock-skew, expiry grace, rollback-clock, and recovery behavior.
4. Derive instance identity without binding irrecoverably to ephemeral container state.
5. Keep the key outside YAML through environment variables or mounted files.
6. Provide an offline inspection command that never prints the raw key.

### E09 and E10 — Governance, Notification, and Secret Audit

Deliver notification history and secret-access audit as append-only domain events first.
Add incident-management adapters only after delivery semantics, retries, signatures, and role controls are stable.
Global credentials use references to one encrypted value rather than copied secrets and require explicit project grants.

Acceptance criteria:

- [ ] Every delivery and secret access has actor, target, outcome, and correlation metadata.
- [ ] Retried webhook or incident delivery is idempotent.
- [ ] Revoking a project grant immediately prevents future credential resolution.
- [ ] Audit retention and deletion policies are explicit and testable.

## Existing Backlog Plans

The table plans both the selectable open backlog and the parity review required before retiring branches whose behavior is already in `develop`.
The branch assessment provides the evidence for each classification.

| ID | Current status | Planned slice | Lowest verification boundary |
|---|---|---|---|
| C01 | Baseline | Parity-review API token expiry branch for missing negative tests, then propose archival | HTTP token lifecycle and expired-token request |
| C02 | Baseline | Harden identity audit, recovery, and last-login-method cases while preserving named provider identities | Real LDAP/OIDC fixtures plus browser account-security flow |
| C03 | Baseline | Verify invite expiry, revocation, permission, and two-user browser coverage before branch archival | Two-user browser flow including expired and revoked invitations |
| C04 | Baseline | Verify ordering, merge precedence, scheduling, and backup/restore for multiple variable groups | Real task plus export/import round trip |
| C05 | Baseline | Verify immutable stage-argument assembly for legacy arrays and stage maps across supported Terraform apps | Command snapshots and real init/plan/apply fixture |
| C06 | Baseline | Complete parity tests for survey defaults, types, choices, targets, and schedule serialization | Direct API bypass tests plus real task input |
| C07 | Baseline/partial | Retain current runner registration, tags, history identity, and executor-image configuration as the base for P01/P02 | Runner registration and placement integration tests |
| C08 | Baseline | Verify allowlist enforcement, user isolation, rollback, and deletion cleanup | Two-user API tests plus browser persistence |
| C09 | Baseline | Verify stable task-history cursors under concurrent inserts and filter changes | Concurrent database fixture plus browser navigation |
| C10 | Baseline | Verify repository-key normalization, cancellation, and lock cleanup | Concurrent real Git repositories in temporary directories |
| C11 | Baseline | Verify audience, replay, expiry, and JWKS rotation while keeping user sessions opaque | Relying-party fixture with wrong-audience negatives |
| C12 | Baseline | Verify task-bound survey-secret expiry, remote dispatch, requeue, and HA handoff | Remote-runner failover test with plaintext tripwires |
| C13 | Baseline | Verify mixed-key restart, interrupted rekey, check output, hot reload, and rollback | Mixed-key database fixture and restart |
| C14 | Partial | Reuse current workflow parameters and editor scaffold within P08; do not treat UI presence as working orchestration | Browser run flow backed by real enhanced persistence |
| C15 | Baseline | Verify debug-filter isolation and concurrency while integrating structured export under P05 | Concurrent logging tests and exported records |
| B04 | Open | Generate supported key types server-side; validate size; store private key encrypted; return public key; rotate explicitly | Cryptographic parse/sign test plus browser create/update/copy flow |
| B07 | Open | Versioned password-hash envelope; Argon2id parameters; constant-time verify; opportunistic bcrypt upgrade; recovery compatibility | Unit vectors plus real login that upgrades an old fixture |
| B08 | Open | Pushover client; configuration validation; templates; test action; retry/error mapping; redaction | Fake provider contract plus browser configuration and test delivery |
| B09 | Open | Rsbuild configuration; environment substitution; static asset paths; source maps; dev server; production bundle parity | Build exit zero plus browser regression of auth, routing, editor, and assets |
| B10 | Open | Configured secret roots; canonical-path validation; file permission checks; `_FILE` convention; reload semantics | Symlink/traversal tests plus container mounted-secret smoke test |
| B14 | Open | Search model and normalization; debounce; result count; URL state; keyboard and screen-reader behavior | Browser verification with large template fixture |
| B16 | Open | Third-party initiated OIDC endpoint; provider allowlist; state/nonce; return-target validation; error UX | Real provider fixture plus CSRF and open-redirect negative tests |
| B18 | Open | Prefix and hash primary runner tokens; atomic lookup and rotation; migration grace; remove plaintext after proof | Database inspection plus old/new runner authentication and revocation |
| B22 | Open | Versioned reusable survey definitions; reference lifecycle; inline compatibility; override precedence; backup/restore | Shared definition used by tasks and schedules plus export/import |
| B24 | Open | Per-schedule IANA timezone; instance-default fallback; DST gap/overlap policy; next-run preview; import/export | Clock-controlled scheduler tests plus browser preview |
| B26 | Open | Versioned bundled help; context routing; search; offline assets; responsive and accessible panel | Browser verification offline at desktop and mobile widths |
| B27 | Open | App-version model; ordering; template selection; runtime executable resolution; import/export | Real app invocation proving selected version and missing-version error |
| B28 | Open | Absolute session lifetime config; idle versus maximum semantics; existing-session transition; admin visibility | Clock-controlled login/session tests and browser expiry UX |
| B29 | Open | Stable audit schema; auth and CRUD coverage; correlation ID; client IP trust policy; SIEM sink | Golden JSON schema plus real login/logout/token lifecycle |

## Additional Capability Plans

These were produced before the requested 15:00 Europe/Berlin cutoff.

| ID | Planned design | Lowest verification boundary |
|---|---|---|
| X01 | Build a server-side preflight document from the exact enqueue inputs; resolve references and policy without resolving secret values; show placement and command shape | Browser preview compared with the subsequently created task |
| X02 | Add versioned deployment-window rules, timezone, protected-template mapping, emergency override permission, and complete audit | Clock-controlled API tests plus browser blocked/override flows |
| X03 | Define a small policy input contract and provider interface; evaluate versioned policies before enqueue; store decision and policy revision | Policy fixture proving allow, deny, error, and timeout behavior |
| X04 | Canonicalize audit records, hash-chain batches, sign periodic seals, export proofs, and provide an offline verifier | Tamper one record and prove verification fails at the exact position |
| X05 | Propagate trace context through API, queue, runner, task stages, persistence, and notification; apply attribute allowlists | End-to-end trace in a local collector with secret tripwire assertions |
| X06 | Create encrypted logical backups, manifest checksums, compatibility metadata, isolated restore automation, and scheduled restore drills | Automated restore into an empty temporary instance with semantic comparisons |
| X07 | Schedule read-only plan jobs, normalize and sanitize changes, compare prior result, acknowledge drift, and notify | Real Terraform fixture with introduced and resolved drift |
| X08 | Add lease-provider clients, acquire immediately before execution, deliver in memory, revoke after completion, and handle orphan revocation | Fake lease server proving issue, renew, revoke, expiry, and crash recovery |
| X09 | Sign canonical webhook payloads, include event ID/timestamp, retain delivery attempts, retry idempotently, and reject stale inbound callbacks | Receiver fixture proving signature, replay rejection, and retry deduplication |
| X10 | Store artifacts by checksum with producer/run metadata, access grants, retention, safe content headers, and garbage collection | Workflow artifact round-trip plus unauthorized access and retention expiry |

## Testing and Verification Strategy

Every implementation ticket begins with a failing reproduction or contract harness under `/tmp/`.
Only after the expected behavior and failure are demonstrated is the real repository modified.

The permanent test pyramid is capability-specific:

1. **Unit:** pure validation, state transitions, permission evaluation, redaction, parsing, and merge rules.
2. **Repository:** every query and migration against every supported SQL dialect.
3. **Service:** interfaces with fakes for time, external clients, persistence, and task dispatch.
4. **HTTP:** status, payload, authn, authz, CSRF, concurrency, and disabled-capability behavior.
5. **Protocol:** real Terraform/OpenTofu, runner, OIDC, LDAP, Vault/OpenBao, Redis, and executor fixtures where applicable.
6. **Frontend unit:** state, validation, error handling, and component behavior.
7. **Browser:** every visible happy path and meaningful error path in the rendered application.
8. **Container:** Community and enhanced images, fresh install, upgrade, restart, and health.
9. **Resilience:** process kill, duplicate delivery, dependency restart, network partition, clock movement, and cancellation.

Required final evidence for a feature:

- Current test command output with zero failures.
- Current build output with exit code zero.
- Browser screenshots or a recorded browser assertion for UI work.
- Protocol or HTTP evidence at the lowest real boundary.
- Migration upgrade and rollback evidence where schema changes exist.
- Diff review proving no unrelated side edits.

## Migration and Rollout Strategy

Use expand-and-contract migrations for any table touched by active tasks or rolling nodes.
New columns are nullable or have safe defaults during the expand phase.
Backfills are resumable, bounded, observable, and separate from startup when data volume can be large.
Code reads old and new forms during the compatibility window.
Constraints or old-column removal occur only after every supported node version has switched.

Each capability rolls out through four states:

1. **Dark:** code and schema present, capability unavailable.
2. **Internal:** enabled only for controlled test projects or administrators.
3. **Opt-in:** administrators enable it per instance or project.
4. **Default for selected edition:** enabled according to the effective capability provider.

Rollback disables new writes first, preserves data, drains or stops active work according to the documented policy, and then rolls binaries back.
No rollback plan relies on deleting production rows.

## Risks

| Risk | Mitigation |
|---|---|
| Proprietary-source contamination | Clean-room rule, source provenance review, no private module access, legal review before distribution |
| Upstream drift | Contract tests at the module seam, pinned core/enhanced revisions, regular rebase windows |
| Stale branch merge damage | Port behavior and tests onto new branches from current `develop`; never merge old branches wholesale |
| UI-only entitlement bypass | Backend capability middleware and service guards with direct-API negative tests |
| Secret exposure | Runtime resolution, encryption at rest, environment/stdin delivery, redaction tripwires, no secret CLI args |
| HA split brain | SQL conditional transitions as authority; Redis locks are not correctness guarantees |
| Migration divergence across dialects | Per-dialect fixtures and upgrade/rollback test matrix |
| Generated frontend churn | Isolate lockfile/build migrations and verify semantic diff separately |
| Scope explosion | One selected capability epic at a time, vertical tickets, WIP limit one |
| False confidence from unit tests | Browser, protocol, container, and failure-injection evidence at the lowest real boundary |

## Definition of Ready

A feature ticket is Ready only when:

- [ ] Its capability ID is checked in the selection document.
- [ ] The delivery model is selected.
- [ ] The user-visible outcome and scope boundary are explicit.
- [ ] Dependencies are complete or named.
- [ ] No product, licensing, environment, or rollout decision remains open.
- [ ] The exact current source branch and target database/deployment matrix are recorded.
- [ ] The failing `/tmp/` reproduction or contract is defined.
- [ ] Acceptance criteria and the lowest verification boundary are concrete.
- [ ] The relevant branch is classified as port, rewrite, split, or retire.

## Definition of Done

A feature is Done only when:

- [ ] The user can perform the new observable capability described by the ticket.
- [ ] Community behavior remains unchanged unless explicitly selected otherwise.
- [ ] Backend authorization and capability enforcement are proven by negative tests.
- [ ] Unit, repository, HTTP, frontend, browser, protocol, migration, and container checks required by the feature are green.
- [ ] A deliberate regression proves the new test can fail.
- [ ] Upgrade, downgrade, restart, and failure behavior match the plan.
- [ ] Documentation, API schema, configuration schema, and operational runbook are updated.
- [ ] A focused review finds no unrelated changes or untracked side defects in scope.
- [ ] The change is committed atomically with evidence recorded in the task journal.

## Source Map

| Concern | Current paths |
|---|---|
| Capability DTO | `pro_interfaces/featues.go` |
| Capability resolution | `pro/pkg/features/features.go`, `api/system_info.go` |
| Dependency wiring | `cli/cmd/root.go` |
| Route surface | `api/router.go` |
| Community stubs | `pro/api/`, `pro/db/`, `pro/services/` |
| Project runners | `pro_interfaces/project_runner_ctl.go`, `pro/api/projects/runners.go`, `services/server/runner_svc.go`, `web/src/views/Runners.vue` |
| Terraform state | `pro_interfaces/terraform_inventory_ctl.go`, `db/TerraformInventoryStore_pro.go`, `pro/api/terraform.go`, `pro/db/sql/terraform_inventory.go` |
| Task summaries | `db/ansible.go`, `db/Store.go`, `pro/db/sql/ansible_task.go`, `pro/pkg/stage_parsers/` |
| Log export | `pro_interfaces/log_write_svc.go`, `pro/services/server/log_write_svc.go` |
| External secrets | `db/SecretStorage.go`, `services/server/secret_storage_svc.go`, `pro/services/server/access_key_serializer_*.go` |
| Roles | `db/Role.go`, `pro/api/roles.go`, `web/src/views/Roles.vue` |
| HA | `pro_interfaces/ha.go`, `pro/services/ha/ha.go`, `api/cluster.go`, `web/src/views/Cluster.vue` |
| Workflows | `db/Workflow.go`, `pro_interfaces/workflow_*.go`, `pro/db/sql/workflow.go`, `pro/services/server/workflow_svc.go`, `web/src/views/project/Workflow*.vue` |
| Existing detailed plans | `AGENTS/plans/` |
| Branch evidence | [Feature branch assessment](feature-branch-assessment.md) |
