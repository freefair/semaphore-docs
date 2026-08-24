# Enhanced Edition Feature Selection

## Table of Contents

- [How to Use This Document](#how-to-use-this-document)
- [Delivery Model Decision](#delivery-model-decision)
- [Required Foundation](#required-foundation)
- [Pro Capability Set](#pro-capability-set)
- [Enterprise Capability Set](#enterprise-capability-set)
- [Current Develop Baseline](#current-develop-baseline)
- [Existing Branch and Plan Backlog](#existing-branch-and-plan-backlog)
- [Additional Product Ideas](#additional-product-ideas)
- [Suggested Bundles](#suggested-bundles)
- [Selection Handoff](#selection-handoff)

## How to Use This Document

Check one delivery model and every capability that should be implemented.
Parent items can be selected without selecting every optional child item.
Dependencies shown after an item are automatically included in its implementation scope.
No capability in this list is treated as approved until its checkbox is checked.

The detailed design, delivery slices, verification boundaries, and sequencing for every item are in [the implementation plan](pro-implementation-plan.md).
The evidence and disposition for existing remote branches are in [the branch assessment](feature-branch-assessment.md).

## Delivery Model Decision

Select exactly one option before implementation begins.

- [ ] **D01 — Use the official licensed Semaphore Pro/Enterprise module.**
  This is the lowest-risk and shortest path when the objective is to use the currently sold product features without owning their implementation.
  It requires commercial access to the proprietary module and does not provide implementation control.
- [ ] **D02 — Build an independent clean-room enhanced module.**
  This preserves the existing replaceable Go module boundary and implements only behavior derived from the MIT-licensed repository, public documentation, and original design work.
  It has the highest engineering cost but gives full control over behavior and roadmap.
- [ ] **D03 — Move enhanced behavior into the Community module.**
  This removes the build variant but creates the largest upstream merge burden and weakens the existing boundary.
  It is not recommended unless maintaining separate editions is explicitly unwanted.

> **Important:** Semaphore Pro and Enterprise are proprietary products.
> A clean-room implementation must not use or assume access to the private `semaphorepro-module` source.

## Required Foundation

These items are required for D02 and D03.

- [ ] **F01 — Executable Community/enhanced contract suite.**
  Pin the current public interfaces, HTTP behavior, database compatibility, and Community no-op behavior before implementing features.
- [ ] **F02 — Reproducible enhanced build and test matrix.**
  Build Community and enhanced variants from the same core commit and run backend, frontend, migration, and container tests for both.
- [ ] **F03 — Backend-authoritative capability service.**
  Resolve feature availability and limits on the server, enforce them in every API path, and expose the same matrix to the UI.
- [ ] **F04 — Upgrade, downgrade, and disabled-feature semantics.**
  Define how existing enhanced data remains preserved but inaccessible when a capability is disabled.
- [ ] **F05 — Compatibility and migration policy.**
  Support PostgreSQL, MySQL/MariaDB, and SQLite with reversible migrations and fixtures for upgrades from the current `develop` schema.
- [ ] **F06 — Security and observability baseline.**
  Add authorization matrix tests, secret-redaction tests, audit events, metrics, and failure-mode documentation before feature rollout.

## Pro Capability Set

These entries cover the current public Pro offering plus the Pro workflow surface already present in this repository.

- [ ] **P01 — Isolated project runners.**
  Project-scoped runner CRUD, least-privilege registration, dispatch, cache management, health, and lifecycle visibility.
  Depends on F01–F06.
  - [ ] **P01a — One-time runner registration tokens and re-registration.**
  - [ ] **P01b — Runner version, platform, uptime, and historical task assignment.**
  - [ ] **P01c — Runner timeout, requeue, and terminal-state reconciliation.**
- [ ] **P02 — Tag-based runner routing and execution capabilities.**
  Route by tags and supported executors, define deterministic fallback, and expose placement reasons.
  Depends on P01.
  - [ ] **P02a — Per-template executor image selection.**
  - [ ] **P02b — Runner registration options and secure mode.**
- [ ] **P03 — Terraform/OpenTofu HTTP backend.**
  Authenticated state aliases, encrypted version history, protocol-correct locking, recovery, and audit events.
  Depends on F01–F06.
- [ ] **P04 — Task execution summaries.**
  Persist host results and structured errors for Ansible tasks and render a useful summary without parsing the complete raw log in the browser.
  Depends on F01–F06.
- [ ] **P05 — File-based and structured log export.**
  Export event and task logs with rotation, redaction, delivery health, and a stable schema for SIEM ingestion.
  Depends on F06.
  - [ ] **P05a — Extended audit fields and webhook sink.**
  - [ ] **P05b — Configurable debug-log filters.**
- [ ] **P06 — HashiCorp Vault and OpenBao secret storage.**
  Resolve external secrets only at execution time, prevent plaintext persistence, and support safe synchronization and deletion behavior.
  Depends on F06 and F04.
- [ ] **P07 — Pro authentication controls.**
  Apply backend capability enforcement to the existing TOTP, LDAP/Active Directory, and OIDC surfaces without changing the opaque server-side session model.
  Depends on F03 and F04.
- [ ] **P08 — Project workflows.**
  Complete the existing workflow persistence, orchestration, API, and UI surface.
  Depends on F01–F06 and P01c.
  - [ ] **P08a — Workflow templates and DAG validation.**
  - [ ] **P08b — Parallel conditional execution engine.**
  - [ ] **P08c — Visual editor and run dashboard.**
  - [ ] **P08d — Artifacts and variable passing between nodes.**
  - [ ] **P08e — Workflow-level parameters, schedules, API, and webhook triggers.**
  - [ ] **P08f — Per-node inventory, credential, variable-group, and CLI overrides.**
  - [ ] **P08g — Human approval gates with timeout and notifications.**
- [ ] **P09 — Usage accounting and configurable limits.**
  Count users, runners, Terraform states, managed nodes, and instances only when the selected delivery model requires commercial or internal quotas.
  Depends on F03.

## Enterprise Capability Set

- [ ] **E01 — Active-active high availability.**
  Use SQL as the source of truth and Redis for coordination, heartbeats, Pub/Sub, and best-effort locks.
  Include schedule deduplication, orphan recovery, cross-node WebSocket delivery, and startup safety checks.
  Depends on F01–F06 and P01c.
  - [ ] **E01a — Cluster dashboard and operational metrics.**
  - [ ] **E01b — Failure injection and rolling-upgrade verification.**
- [ ] **E02 — Custom global and project roles.**
  Implement custom role CRUD, permission validation, template-level permissions, and least-privilege enforcement in middleware and services.
  Depends on F03 and F06.
- [ ] **E03 — LDAP/OIDC group-to-role and project mapping.**
  Reconcile externally managed memberships deterministically and audit every grant and removal.
  Depends on E02 and the current external-identity baseline.
- [ ] **E04 — Enterprise external secret stores.**
  Implement each provider independently behind the existing serializer boundary.
  Depends on P06.
  - [ ] **E04a — AWS Secrets Manager.**
  - [ ] **E04b — Azure Key Vault.**
  - [ ] **E04c — Devolutions Server.**
- [ ] **E05 — Docker executor.**
  Run tasks in constrained, ephemeral containers with explicit image policy, resource limits, network policy, and cleanup.
  Depends on P01 and P02.
- [ ] **E06 — Kubernetes executor.**
  Run tasks as isolated Jobs with service-account scoping, pod security, log streaming, cancellation, and garbage collection.
  Depends on P01 and P02.
- [ ] **E07 — Enterprise workflows.**
  Extend P08 with workflow RBAC, role-based approvals, cross-project references, and immutable definition versions with rollback.
  Depends on P08 and E02.
- [ ] **E08 — Air-gapped and multi-instance entitlement support.**
  Required only for a commercial licensing model; define signed offline entitlements, clock-skew tolerance, instance identity, renewal grace, and recovery.
  Depends on F03 and the selected delivery model.
- [ ] **E09 — Notification governance and incident integrations.**
  Add notification delivery history, role-controlled configuration, and optional PagerDuty, Opsgenie, or ServiceNow adapters.
  Depends on E02 and P05.
- [ ] **E10 — Global credentials and secret access audit.**
  Share centrally managed credentials across projects without copying values and record every read, injection, sync, and deletion.
  Depends on E02, P06, and F06.

## Current Develop Baseline

These capabilities were verified in current `develop` after the branch comparison.
They are not selection checkboxes because they do not authorize new implementation work.
A selected enhanced capability may still add focused hardening or reuse them as dependencies.

| ID | Existing capability |
|---|---|
| C01 | API token expiry, expiry-aware authentication, and token UI |
| C02 | Provider-scoped external identity linking and multiple named LDAP providers |
| C03 | Project invitation model, lifecycle API, tests, and acceptance UI |
| C04 | Multiple ordered variable groups per template |
| C05 | Stage-specific Terraform/OpenTofu CLI argument maps with legacy-array compatibility |
| C06 | Backend survey type/default/target validation, schedule defaults, and environment-variable delivery |
| C07 | Runner tags, one-time hashed registration tokens, persisted runner name, and executor-image template configuration |
| C08 | User-scoped allowlisted navigation preferences |
| C09 | Keyset pagination for task history |
| C10 | Repository-keyed Git operation locking |
| C11 | Short-lived workload identity tokens and JWKS endpoint without JWT user sessions |
| C12 | Encrypted, task-bound survey-secret transfer for remote runners |
| C13 | Content-addressed encryption keyrings, hot reload, check, and rekey tooling |
| C14 | Workflow parameters, node editor, shared models, routes, and UI scaffold; enhanced persistence and orchestration remain P08 |
| C15 | Configurable debug-log filtering |

## Existing Branch and Plan Backlog

These selectable capabilities were found in remote branches or repository plans and are not complete in current `develop`.
Items absorbed into a Pro or Enterprise capability are listed there instead of duplicated here.

- [ ] **B04 — Server-generated SSH keys with public-key display.**
  Source: `origin/feat/gen_ssh_key`.
- [ ] **B07 — Argon2id password hashing with opportunistic bcrypt migration.**
  Source: `origin/feat/password-hash` and `AGENTS/plans/2_19/password-hash-argon2id.md`.
- [ ] **B08 — Pushover notifications.**
  Port the provider without the branch's unrelated lockfile churn.
  Source: `origin/feat/pushover-alerts`.
- [ ] **B09 — Replace Vue CLI with Rsbuild.**
  Treat this as a build migration with production bundle and browser-regression evidence, not a user feature.
  Source: `origin/feat/rsbuild`.
- [ ] **B10 — Secret values from mounted files.**
  Constrain paths to configured roots, reject traversal and symlink escapes, and keep values out of logs and API responses.
  Source: `origin/feat/secret_from_file`.
- [ ] **B14 — Template search.**
  Search name, description, playbook, and tags with deterministic filtering and keyboard accessibility.
  Source: `origin/feat/template-search`.
- [ ] **B16 — OIDC IdP-initiated login.**
  Implement third-party initiated login with state, nonce, issuer validation, and provider allowlisting.
  Source: `origin/oidc_idp_init2` and `AGENTS/plans/2_20/oidc-idp-initiated-auth.md`.
- [ ] **B18 — Runner tokens stored as hashes.**
  Source: `AGENTS/plans/2_19/runner-token-hash.md`.
- [ ] **B22 — Reusable survey definitions.**
  Extract versioned survey definitions that templates can reference while preserving current inline surveys and schedule defaults.
  Source: `AGENTS/plans/2_20/survey-vars-reusable.md`.
- [ ] **B24 — Per-schedule timezones.**
  Store an IANA timezone per schedule and define deterministic daylight-saving behavior.
  Source: `AGENTS/plans/2_20/schedule-timezone.md`.
- [ ] **B26 — Contextual offline help panel.**
  Bundle version-matched help content and verify keyboard, responsive, and deep-link behavior in a real browser.
  Source: `AGENTS/plans/2_20/contextual-help-panel.md`.
- [ ] **B27 — Application versions selectable per template.**
  Source: `origin/app_versions`.
- [ ] **B28 — Configurable maximum session lifetime.**
  Source: `origin/session_max_life`.
- [ ] **B29 — SIEM-grade audit events.**
  Record actor, action, client address, user agent, integration, outcome, and correlation ID with a stable schema.
  Source: `origin/feature/siem-audit-events`.

## Additional Product Ideas

These ideas were added because this plan was completed before 15:00 Europe/Berlin on 2026-08-24.

- [ ] **X01 — Preflight execution preview.**
  Show selected runner, inventory, credentials by reference, variable sources, command shape, and policy findings before a task starts without revealing secret values.
- [ ] **X02 — Deployment windows and change freezes.**
  Permit scheduled execution only inside approved windows, with audited emergency override permissions.
- [ ] **X03 — Policy-as-code guardrails.**
  Evaluate task, inventory, environment, and workflow metadata against versioned policies before enqueueing.
- [ ] **X04 — Tamper-evident audit chain.**
  Hash-chain immutable audit batches, periodically seal them externally, and provide an offline verifier.
- [ ] **X05 — OpenTelemetry traces and operational SLOs.**
  Trace API request, enqueue, runner pickup, execution stages, persistence, and notification delivery without recording secrets.
- [ ] **X06 — Disaster-recovery export and restore drills.**
  Produce encrypted, versioned backups and continuously verify restoration into an isolated test instance.
- [ ] **X07 — Drift detection and scheduled plans.**
  Run non-mutating Terraform/OpenTofu plans on a schedule, retain sanitized summaries, and alert on drift.
- [ ] **X08 — Just-in-time credential leases.**
  Acquire short-lived external credentials immediately before execution and revoke or expire them after the task.
- [ ] **X09 — Signed webhook delivery with replay protection.**
  Sign outbound webhooks, attach event IDs and timestamps, retry idempotently, and expose delivery history.
- [ ] **X10 — Artifact retention and provenance.**
  Store workflow artifacts with checksums, producer task identity, retention policy, access audit, and safe download headers.

## Suggested Bundles

These bundles are recommendations, not implicit selections.

- **Operational MVP:** F01–F06, P01, P02, P03, P04, P05, P06, and B18.
- **Automation platform:** Operational MVP plus P08, B22, B24, X01, and X10.
- **Enterprise resilience:** Automation platform plus E01–E04, E07, E10, X04–X06, and X08.
- **Independent backlog release:** B04, B07–B10, B14, B16, B18, B22, B24, and B26–B29, each implemented as a fresh vertical slice from current `develop`.

## Selection Handoff

After checking boxes, record the chosen delivery model and ordered capability IDs in a new implementation epic.
Implement one vertical feature slice at a time.
Do not merge a stale feature branch wholesale; use the branch assessment to port intent and tests onto current `develop`.
