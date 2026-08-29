# Enhanced Edition Implementation Status

Legend: `[x]` complete · `[>]` active · `[ ]` queued

Last updated: 2026-08-29

## Last Completed Slice

- [x] 037 — Workflow reconciliation
  - [x] Persist desired run state, reconciliation diagnostics, retry backoff, quarantine, and the immediate startup scan
  - [x] Make stop requests, node claims, approval opening, and stale diagnostic updates safe during callback and recovery races
  - [x] Expose redacted diagnostics and manual retry through the existing run API and run view only
  - [x] Verify Root, Community, Clean-room Enhanced, race, migration, frontend, docs, desktop/mobile browser, and final security-diff gates
  - [x] Commit documentation (`5dc56aa`), its root pointer (`268a895f`), and implementation (`63feab87`)

- [x] 036 — Workflow approvals
  - [x] Persist immutable request snapshots and conditional approval, rejection, expiry, and cancellation transitions
  - [x] Enforce project permission eligibility, separation of duties, bounded user comments, and durable attribution
  - [x] Reconcile expired approvals and resume eligible timeout outcomes after service restart without duplicate tasks
  - [x] Keep UI changes focused to approval-node properties, one workflow-list inbox dialog, and existing run-view actions
  - [x] Verify approval, rejection, inbox filtering, timeout outcomes, cancellation, concurrent decisions, restart recovery, migrations, Root and Enhanced suites, build, and desktop/mobile browser flows
  - [x] Complete the security diff review without reportable findings and commit documentation (`5d4648d`), its root pointer (`0b190e4d`), and implementation (`8dee30ee`)

- [x] 035 — Workflow triggers
  - [x] Implement versioned manual, schedule, API, and webhook trigger resources through one shared workflow-start boundary
  - [x] Persist hash-only opaque credentials, scoped idempotency, immutable trigger/input snapshots, and invocation history
  - [x] Add the UTC scheduler, management and public API routes, capability/permission enforcement, and Community stubs
  - [x] Keep the UI to one focused capability-gated workflow dialog with desktop and mobile rendering
  - [x] Verify API/webhook/scheduler behavior in the local server and browser, the four-database migration matrix, Root/Community/Enhanced suites, race checks, vet, builds, and the established frontend baseline
  - [x] Complete the security diff scan, reproduce the rotation/disable race, and bind current revision, enabled state, and credential generation to the durable claim before `StartWorkflow`
  - [x] Commit documentation (`88abe29`), its root pointer (`88b52b0b`), and implementation (`97d0e9da`)

## Current Compatibility Checkpoint

- [x] Audit all UI changes from Slices 001–031 before starting Slice 032
  - [x] Establish `origin/develop` as the repository-contained upstream baseline
  - [x] Inventory and classify the accumulated UI diff by slice acceptance contract
  - [x] Restore the Community `SystemInfoDialog`, `Auth`, and `TaskDetails` structures
  - [x] Isolate Enhanced system, TOTP enrollment, runner detail, and sync-history interfaces
  - [x] Remove the optional Task Details responsive-table rewrite
  - [x] Review the remaining required host hooks and runner UI for avoidable churn
  - [x] Re-run focused and full frontend tests plus the production build
    - [x] Pass the temporary upstream-host structure regression test
    - [x] Pass all 64 focused Enhanced UI contract tests
    - [x] Pass ESLint for every audit-touched source and test file
    - [x] Complete the production frontend build
    - [x] Match the full-suite baseline: 91 passing and the same 3 unrelated failures
  - [x] Verify the retained interfaces in desktop and mobile browser layouts
    - [x] Exercise the four extracted components with real Vue/Vuetify rendering and synthetic data
    - [x] Verify 1280 px and 390×844 layouts without horizontal overflow
    - [x] Verify the synchronization-history dialog and a clean browser console
  - [x] Complete the focused diff and security review without new findings
  - [x] Commit the verified UI integration changes (`5cccf59a`)

## Last Completed Slice

- [x] 040 — HA cluster dashboard
  - [x] Inventory the existing HA interfaces, registry stubs, cluster endpoints, and local Redis test boundaries
  - [x] Define the stable node/boot identity, SQL history, Redis-server-time liveness, compatibility, and readiness contracts
    - [x] Prove stable configured node identity and fresh cryptographic boot identity with an external failing contract
    - [x] Add the isolated Redis TTL and Redis-server-time heartbeat seam with a deterministic fake-client contract
    - [x] Define deterministic protocol, schema, capability, and drain compatibility before readiness
    - [x] Persist per-boot SQL history without overwriting a restarted node's earlier process lifetime
    - [x] Compose durable registration, compatibility, and Redis liveness into readiness
  - [x] Implement authenticated summary/detail APIs and the smallest existing admin UI hook
    - [x] Add admin-only cluster-node list pagination and boot-ID detail routes
    - [x] Add health aggregation and the existing dashboard state labels
    - [x] Persist and expose the admin drain transition for one boot identity
  - [x] Verify multi-instance lifecycle, compatibility, cleanup, browser states, documentation, review, and commits
    - [x] Prove a shared SQL/Redis registry, expiry, restart history, durable drain state, and seven-day SQL history cleanup
    - [x] Verify authenticated list/detail/drain API contracts and minimal dashboard state chips
    - [x] Complete desktop and 390×844 browser checks for Ready, Stale, Incompatible, Draining, recovery, version context, and a clean console
    - [x] Run full Root, Community, Clean-room Enhanced, migration, frontend, documentation, review, and security-diff gates
    - [x] Commit operator documentation (`b0594f2`), its root pointer (`dfa5ca8d`), and implementation (`414fbb8e`)

## Last Completed Slice

- [x] 041 — HA cross-node coordination
  - [x] Inventory scheduler, lock, Redis transport, SQL lease, API, and existing dashboard seams
  - [x] Define lease fencing, ownership, event ordering, and safe fallback contracts
    - [x] Prove a UTC-normalized occurrence key that binds schedule identity, intended fire instant, and relevant revision
    - [x] Persist renewable SQL leases with server-derived expiry, boot-owner fencing, compare-and-set release, and completed-occurrence rejection
    - [x] Bind legacy scheduled tasks to the durable occurrence through a unique SQL task key and a fenced pre-create re-check
    - [x] Add bounded Redis Pub/Sub fan-out with local delivery, echo/duplicate suppression, subscriber queue bounds, and reconnect backoff
    - [x] Expose SQL-authoritative coordinator health and live-event degradation through the existing cluster API and dashboard header
  - [x] Verify coordinator API/UI, multi-node recovery, documentation, review, and commit the bounded coordination slice
    - [x] Pass Root, Community, and Clean-room Enhanced compilation/suites, focused lease/fencing/PubSub tests, Root Vet, and the frontend build
    - [x] Complete authenticated desktop and 390×844 browser evidence for Healthy, Degraded, and recovered live-event transport states, with Redis diagnostics, SQL stale fallback, no horizontal overflow, and no console errors
    - [x] Preserve coordinator and Redis status during a Redis outage; a real Pub/Sub health probe now reaches the bounded reconnect path

## Last Completed Slice

- [x] 042 — HA task recovery
  - [x] Inventory task ownership, runner reconciliation, executor identity, and existing task diagnostics seams
  - [x] Define the durable owner/fencing and stable execution-evidence contracts in an external failing test
  - [x] Persist the SQL task-control lease with server-derived expiry, fenced renewal/release, and immutable execution identity binding
  - [x] Persist complete value-free runner snapshots atomically, including explicit absence, server-time observation, and stale-generation rejection
  - [x] Specify recovery decisions for queued, running, canceling, completing, and ambiguous executions before production changes
  - [x] Register and renew task ownership through the Enhanced boundary only while the node is ready
  - [x] Relinquish every owned lease before drain completes and resume ownership only after the node returns to Ready
  - [x] Claim expired work with a higher fence and recover only after a complete post-transfer runner snapshot
  - [x] Bind every recovery-only task mutation to the same atomically installed task-control fence
    - [x] Reproduce the pause-after-decision stale-owner race with an external failing contract
    - [x] Reject stale quarantine, requeue, stop, fail, terminal-result, and assignment-revocation writes after a newer takeover
    - [x] Return a conflict instead of a misleading successful safe-retry response when ownership changed
  - [x] Require a complete evidence snapshot strictly after transfer or assignment revocation
    - [x] Reproduce and reject equal second-resolution database timestamps as insufficient ordering evidence
    - [x] Verify task-control claim and recovery reads on SQLite, MySQL 8.4, MariaDB 10.11, and PostgreSQL 16
  - [x] Reconcile exact terminal evidence, quarantine ambiguity, and expose a retry-safe operator action
  - [x] Keep UI work to the existing `TaskRunnerDetails` hook only
    - [x] Add scoped value-free diagnostics and retry API contracts
    - [x] Render ownership transfer, fence, evidence, decision, and the safe retry action
    - [x] Add the queued/running/canceling/completing integration matrix and browser evidence
      - [x] Verify a real expired-owner takeover, fence increment, observation window, quarantine, and safe retry against the isolated HA instance
      - [x] Verify the existing task-details dialog at 1280 px and 390×844 with no console errors
      - [x] Remove the mobile alert overflow found during browser QA without changing the surrounding task UI
    - [x] Run full Root, Community, Enhanced, migration, frontend, documentation, and review gates
      - [x] Re-run the complete backend, race, vet, migration, and frontend suites
      - [x] Re-read the implementation diff against the Slice 042 acceptance contract
      - [x] Complete the final security-focused diff review and atomic commits
        - [x] Record the reproduced drain/claim race as one Medium finding in scan `9e3a97fc-7741-4200-831f-d15ac779514f`
        - [x] Serialize in-flight ownership operations, drain/release/resume, and persisted drain transitions (`ee93e2c4`)
        - [x] Pass the fixed-range security verification with no findings (`a24829c4-bf2f-48d2-af9c-91b2d4b30de9`)

## Last Completed Slice

- [x] 043 — HA workflow progression
  - [x] Persist renewable SQL ownership leases, boot transfer history, database-time expiry, and monotonically increasing fences
  - [x] Fence task creation, approval transitions, planner-node finalization, and run status against owner loss
  - [x] Rebuild readiness from SQL, interleave projects fairly, and compose bounded task/workflow drain behavior
  - [x] Expose value-free run and cluster diagnostics through the existing APIs and two minimal UI hooks
  - [x] Verify Root, Community, Clean-room Enhanced, race, vet, four-dialect migration, frontend, docs, desktop/mobile browser, and security gates
  - [x] Complete Security scan `c2b1247a-ec7d-465f-897e-e52d7ea17d4d` with 16/16 production files covered and no findings
  - [x] Commit documentation (`2b3ab66`), its root pointer (`1a31195a`), and implementation (`edbb2381`)

## Slice 044 Completion

- [x] 044 — HA resilience verification
  - [x] Inventory the existing HA harness, deployment health/readiness, failure seams, and release-gate wiring
    - [x] Map reusable multi-node SQL, Redis, runner, server, and browser fixtures from Slices 040–043
    - [x] Identify every named fault boundary and the invariant that must be probed before, during, and after recovery
    - [x] Keep product UI unchanged unless browser recovery exposes a required compatibility defect
  - [x] Define the supported rolling-upgrade skew and readiness rejection matrix
    - [x] Allow application-version/build skew only inside one edition with exact protocol, schema, and required-capability parity
    - [x] Fail readiness for edition, protocol, schema, capability, drain, registration, and SQL failures
    - [x] Preserve API traffic readiness while Redis-backed live events and coordinated work are degraded
    - [x] Drain schedule claims and workflow-trigger runs alongside task and workflow ownership
  - [x] Build a reproducible multi-node fault topology and machine-readable report contract
    - [x] Pin shared PostgreSQL/Redis, two server nodes, load balancer, and runner fixtures
      - [x] Build `.git`-free Candidate and compatible skew images with explicit traceability metadata
      - [x] Verify final candidate and skew manifests as `sha256:dfabae732866…` and `sha256:c7fbdc4e1ed4…`
    - [x] Boot the isolated topology and seed one schedule task and one approval workflow through the API
      - [x] Correct the Clean-room AES-256 key encoding exposed by the first real boot
      - [x] Preserve one SchedulePool identity so every preloaded job observes the HA deduplicator
      - [x] Make scheduled workflow-trigger selection portable to PostgreSQL's integer-backed enabled column
      - [x] Mark the registered QA runner as default through the admin API and refresh random ports after restart
      - [x] Rebuild the corrected images and rerun the topology from empty volumes
      - [x] Reproduce PostgreSQL rejection of Go booleans for integer-backed approval fields
      - [x] Encode persisted workflow-node and approval booleans as portable `0`/`1` values
      - [x] Rebuild the PostgreSQL boolean portability fix and continue from empty volumes
      - [x] Reproduce PostgreSQL rejection of the unquoted workflow-run `end` column
      - [x] Quote every workflow-run `end` write through the existing dialect translator
      - [x] Rebuild the reserved-word fix and continue the topology from empty volumes
      - [x] Reproduce the paused-upstream timeout exceeding the QA client's availability budget
      - [x] Bound proxy read failover to two seconds and verify the config contract with Bats
      - [x] Rerun all fault scenarios from empty volumes
    - [x] Inject node kill, pause, partition, Redis restart, SQL loss, runner reconnect, and rolling replacement
    - [x] Continuously probe API availability and assert schedule, task, workflow, approval, and audit uniqueness
      - [x] Pass all seven scenarios with zero duplicate invariants, eight converged writes, zero replacement probe failures, and continuous audit history
  - [x] Add the enhanced release gate and retain its result artifact
    - [x] Keep the required job independent of the unavailable Pro/Enterprise module and its credentials
    - [x] Validate and upload the machine-readable report for 14 days on every job outcome
  - [x] Publish operator runbooks for scale-out, drain, upgrade, degraded Redis, failed nodes, and ambiguous execution
  - [x] Verify cluster, task, and workflow browser recovery through node replacement at desktop and mobile widths
    - [x] Verify the existing cluster and task surfaces at desktop width without document-level horizontal overflow
    - [x] Diagnose the browser-exposed duplicate runner-attempt generation during recovered task reassignment
      - [x] Trace the recovery/requeue/dispatch transaction from task ownership evidence to the unique attempt insert
      - [x] Add an external and repository regression test that reproduces the duplicate generation
      - [x] Fence the `waiting` → `starting` transition with a SQL-authoritative compare-and-set claim
      - [x] Pass focused database and task-service verification after the root-cause fix
      - [x] Strengthen the HA gate to kill the actual task owner and wait for recovery to a terminal state
        - [x] Create a dedicated recovery task and prove its first fenced runner assignment
        - [x] Kill the node recorded as owner instead of a hard-coded node
        - [x] Compare runner restarts with the generation-specific assignment time so recovered work is not requeued again
        - [x] Prove exactly two unique attempt generations, safe requeue, terminal convergence, and absence of the original constraint error
        - [x] Keep the fixed two-node QA proxy available across restart/kill DNS transitions and reload it after address-changing replacement
        - [x] Rerun the complete isolated HA topology from empty volumes with all seven scenarios and invariants passing
    - [x] Verify the succeeded workflow run, ownership-transfer notice, approved node, and live node rejoin at desktop width
    - [x] Repeat cluster, task, and workflow verification at 390×844 with no document overflow and an empty browser diagnostic log
  - [x] Run full verification, manual review, security review, and atomic commits
    - [x] Pass the current Root, Community, Clean-room Enhanced, full race, Root/Enhanced vet, and eight Bats contract suites
    - [x] Match the unchanged frontend baseline at 126 passing with the same three unrelated failures and complete the Enhanced production build
    - [x] Complete the Docusaurus production build and recheck both repository diffs for whitespace errors
    - [x] Validate the retained HA report with seven scenarios, zero duplicates, eight converged writes, zero probe failures, and continuous audit history
    - [x] Seal Security scan `a5e7236a-f278-4423-99da-5b5b9082b3c2` with complete coverage, no findings, and no deferred work
    - [x] Commit operator documentation (`b2b56c4`), its root pointer (`3aff205d`), and implementation (`f74ebb87`)

## Current Slice

- [>] 045 — Custom project roles
  - [>] Inventory the current built-in role model, project membership mutations, permission checks, audit seams, and narrow UI host points
    - [ ] Prove there is no duplicate custom-role implementation or repository contract
    - [ ] Map every existing built-in role to its effective permissions before adding persistence
    - [ ] Select one real project action for the first end-to-end allow/deny enforcement path
    - [ ] Keep Community behavior and shared project UI structurally unchanged outside required interfaces
  - [ ] Define the typed permission catalog and project-scoped custom-role contract with an external failing test
  - [ ] Persist immutable role IDs, unique per-project names, assignments, and migration-compatible built-in mappings
  - [ ] Enforce project isolation, capability prerequisites, stale writes, and the last-administrator invariant in the backend
  - [ ] Add audited role CRUD, assignment, and effective-permission APIs
  - [ ] Add only the required capability-gated role management, preview, assignment, and denied-state UI hooks
  - [ ] Verify unit, integration, API, migration, two-user browser, full-suite, documentation, and security gates

## Completed Slice Detail

- [x] 036 — Workflow approvals
  - [x] Establish the approval-node, planner, workflow-run, role, and audit contracts
    - [x] Inventory the existing approval status stub and all workflow progression transition points
    - [x] Define the approval request state machine, immutable audit fields, and timeout/reconciliation boundaries
    - [x] Prove eligibility, separation-of-duties, state transition, and timeout contracts with failing external tests
  - [x] Persist and conditionally resolve immutable approval requests
  - [x] Pause and resume workflow progression without downstream task creation before an allowed outcome
  - [x] Add the capability/permission-gated inbox, run action, expiry worker, API, and minimal focused UI
  - [x] Verify concurrent decisions, restart recovery, audit immutability, APIs, browser flows, full suites, and security review
    - [x] Prove cancel, both timeout outcomes, concurrent terminal decisions, eligibility, and restart recovery with focused tests
    - [x] Run migrations and full Root, Community, Enhanced, and frontend verification
    - [x] Complete local browser flows at desktop and mobile widths
    - [x] Complete diff/security review and documentation
  - [x] Document and commit Slice 036

## Slice Plan

- [x] 001 — Core contract
- [x] 002 — Dual-build verification
- [x] 003 — Capability lifecycle
- [x] 004 — Migration matrix
- [x] 005 — Security and observability baseline
- [x] 010 — Project runner registration
- [x] 011 — Runner lifecycle
- [x] 012 — Runner health and history
- [x] 013 — Runner reconciliation
- [x] 014 — Tag placement
- [x] 015 — Executor image
- [x] 016 — Runner secure mode
- [x] 020 — Task summary
- [x] 021 — Structured file logs
- [x] 022 — Audit webhook export
- [x] 023 — Debug log filtering
- [x] 024 — Vault and OpenBao runtime secrets
- [x] 025 — Managed secret storage
- [x] 026 — TOTP capability lifecycle
- [x] 027 — LDAP capability lifecycle
- [x] 030 — Workflow editor and validation
- [x] 031 — Linear workflow run
- [x] 032 — Conditional parallel workflow
- [x] 033 — Workflow artifacts
- [x] 034 — Workflow parameters and overrides
- [x] 035 — Workflow triggers
- [x] 036 — Workflow approvals
- [x] 037 — Workflow reconciliation
- [x] 040 — HA cluster dashboard
- [x] 041 — Cross-node coordination
- [x] 042 — HA task recovery
- [x] 043 — HA workflow progression
- [x] 044 — HA resilience verification
- [>] 045 — Custom project roles
- [ ] 046 — Global and template roles
- [ ] 047 — LDAP group mapping
- [ ] 048 — OIDC group mapping
- [ ] 050 — Docker executor
- [ ] 051 — Docker executor hardening
- [ ] 052 — Kubernetes executor
- [ ] 053 — Kubernetes executor hardening
- [ ] 054 — Workflow RBAC and role approvals
- [ ] 055 — Workflow versions and cross-project references
- [ ] 056 — Notification governance
- [ ] 057 — PagerDuty delivery
- [ ] 058 — Opsgenie delivery
- [ ] 059 — ServiceNow delivery
- [ ] 060 — Global credential grants
- [ ] 061 — Credential resolution and audit
- [ ] 062 — Server-generated SSH keys
- [ ] 063 — Template search
- [ ] 064 — Per-schedule timezones
- [ ] 070 — Execution preflight
- [ ] 071 — Deployment windows
- [ ] 072 — Policy guardrails
- [ ] 073 — Signed webhooks
- [ ] 074 — Artifact retention and provenance
