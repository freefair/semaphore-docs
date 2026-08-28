# Enhanced Edition Implementation Status

Legend: `[x]` complete · `[>]` active · `[ ]` queued

Last updated: 2026-08-28

## Last Completed Slice

- [x] 031 — Linear workflow run
  - [x] Define immutable workflow and template snapshots
  - [x] Add durable run/node states and SQL migration
  - [x] Prove repository transitions, idempotency, isolation, and rollback
  - [x] Implement and compile sequential task orchestration
  - [x] Fix root-task state update discovered during implementation
  - [x] Add service tests for success, failure, retry, restart, and snapshot isolation
  - [x] Verify immutable template execution through the real TaskPool path
  - [x] Implement run API endpoints and controller tests
  - [x] Wire the existing run views to live data with minimal UI changes and frontend tests
  - [x] Fix missing run-task lookup found by browser verification
  - [x] Preserve the distinct blocked-node status in the existing graph
  - [x] Verify success/failure flows, task links, responsive layouts, and console output in-browser
  - [x] Run the four-database migration matrix, full test suites, race checks, vet, and docs build
  - [x] Replace unbounded local workflow lock retention found during focused review
  - [x] Expand MySQL snapshot columns to match the accepted workflow definition size
  - [x] Re-run final verification after the review fixes and complete the focused diff review
  - [x] Record final verification and commit Slice 031 documentation and implementation
  - [x] Run the committed Slice 031 security diff scan
  - [x] Replace persistence-model responses with permission-safe run DTOs
    - [x] Reproduce snapshot, template, and task configuration disclosure on every run response
    - [x] Preserve only the immutable graph and task fields required by the existing run UI
    - [x] Verify the fix across API contracts and full suites while retaining the browser-verified UI contract
    - [x] Independently verify the original attack path is closed
  - [x] Commit the verified Slice 031 security fix

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
- [ ] 032 — Conditional parallel workflow
- [ ] 033 — Workflow artifacts
- [ ] 034 — Workflow parameters and overrides
- [ ] 035 — Workflow triggers
- [ ] 036 — Workflow approvals
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
