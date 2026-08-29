# Enhanced Edition Implementation Status

Legend: `[x]` complete · `[>]` active · `[ ]` queued

Last updated: 2026-08-29

## Last Completed Slice

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

## Current Slice

- [>] 037 — Workflow reconciliation
  - [x] Audit durable desired/observed state, stop boundary, and reconciler recovery path
  - [>] Persist stop/retry/quarantine state and implement conditional recovery transitions
    - [x] Persist durable `running` / `stopping` / `stopped` desired state and recover a stop after service restart
    - [x] Block late node claims and stale diagnostic writes after a durable stop request
    - [x] Persist bounded retry backoff, poison-run quarantine, and manual diagnostic reset
  - [x] Expose status and retry reconciliation through the existing run API/UI surfaces
    - [x] Add the retry endpoint and field-safe run-status response
    - [x] Show stopping, stopped, recovering, and quarantined states only in the existing run view
  - [ ] Verify restart, cancellation, races, browser flows, security review, and documentation

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
- [ ] 037 — Workflow reconciliation
- [ ] 040 — HA cluster dashboard
- [ ] 041 — Cross-node coordination
- [ ] 042 — HA task recovery
- [ ] 043 — HA workflow progression
- [ ] 044 — HA resilience verification
- [ ] 045 — Custom project roles
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
