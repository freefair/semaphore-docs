# Enhanced Edition Implementation Status

Legend: `[x]` complete · `[>]` active · `[ ]` queued

Last updated: 2026-08-28

## Last Completed Slice

- [x] 032 — Conditional parallel workflow
  - [x] Define a bounded typed condition language over immutable result fields
  - [x] Persist compiled conditions, explicit joins, parallelism, skips, cancellations, and sanitized results
  - [x] Replace linear progression with idempotent DAG readiness planning
  - [x] Prove diamond joins, simultaneous completion, retries, failure paths, and parallelism bounds
  - [x] Add the required API contracts and minimal editor/run-view hooks
  - [x] Verify conditional branch authoring and execution in desktop and mobile browsers
  - [x] Pass the four-database migration matrix, full suites, race checks, vet, lint, builds, and docs build
  - [x] Fix stopped-predecessor and explicit-zero validation regressions found during review
  - [x] Complete the committed security diff scan with 0 findings
  - [x] Commit documentation (`aa1be43`) and implementation (`841cd536`)

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

- [>] 033 — Workflow artifacts
  - [>] Establish the existing structured-result and secret-injection contracts
    - [ ] Inventory current task-summary, result, variable, and secret-safe paths
    - [ ] Define bounded typed JSON declarations, provenance, sensitivity, and size limits
    - [ ] Prove validation and redaction behavior in external tests before production edits
  - [ ] Add artifact persistence and migration coverage
    - [ ] Keep sensitive values out of definition snapshots and user-visible payloads
    - [ ] Bind outputs to the producing run and attempt
    - [ ] Pass SQLite, MySQL, MariaDB, and PostgreSQL migration tests
  - [ ] Validate graph reachability and resolve downstream inputs immediately before task creation
  - [ ] Capture declared outputs from structured task results and fail invalid producers safely
  - [ ] Extend API contracts with value-free provenance and redacted sensitivity metadata
  - [ ] Add only acceptance-required output controls and states to the existing workflow UI
  - [ ] Verify focused/full suites, race checks, builds, browser behavior, and security review
  - [ ] Document and commit Slice 033

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
- [>] 033 — Workflow artifacts
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
