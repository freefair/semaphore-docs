# Enhanced Edition Implementation Status

Legend: `[x]` complete · `[>]` active · `[ ]` queued

Last updated: 2026-08-29

## Last Completed Slice

- [x] 034 — Workflow parameters and node overrides
  - [x] Add bounded string, integer, boolean, enumeration, and secret-reference declarations
  - [x] Resolve default, trigger, user, and node values into immutable run snapshots
  - [x] Enforce backend allow-lists for inventories, variable groups, arguments, branches, and credentials
  - [x] Resolve approved credentials just in time and scope them to explicitly authorized nodes
  - [x] Keep UI integration inside focused components and narrow existing workflow hooks
  - [x] Verify authoring, invalid input, explicit empty strings, UTF-8 byte limits, secret redaction, and responsive audit rendering in the browser
  - [x] Pass the four-database migration matrix, full Go suites, race checks, vet, focused lint, web/docs builds, and the established frontend baseline
  - [x] Complete the final security diff scan with 24/24 items and 0 findings
  - [x] Commit documentation (`915e995`, `a21681c`), its root pointer (`afaba44c`), and implementation (`47b9ce82`)

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

- [>] 035 — Workflow triggers
  - [>] Establish the existing scheduler, webhook, workflow-start, permission, and audit contracts
    - [x] Inventory reusable schedule, integration, credential, idempotency, and history implementations
      - [x] Reuse the existing workflow correlation CAS for committed-run idempotency
      - [x] Reuse opaque token hashing, workflow input validation, audit, pagination, and cron parsing patterns
      - [x] Keep workflow triggers separate from legacy template schedules and integrations
    - [x] Define versioned trigger resources and one shared start boundary
      - [x] Use explicit fixed/request input bindings with no implicit request-field passthrough
      - [x] Scope external request hashes to trigger and credential generation
      - [x] Derive scheduled occurrence identity from trigger revision, definition revision, and UTC instant
    - [x] Prove mapping, occurrence identity, idempotency, credential hashing, and disabled-state contracts with external failing tests
    - [x] Implement the bounded trigger domain model and validation as the first green layer
  - [>] Persist manual, schedule, API, and webhook triggers
    - [x] Add the additive trigger and invocation schema plus rollback across all database engines
    - [x] Store owner, enabled state, input mapping, audit metadata, and bounded invocation history
    - [x] Claim external invocation keys atomically and retain scheduled identity through the workflow run
    - [x] Store only hashes for revocable opaque API/webhook credentials and reveal plaintext once
      - [x] Persist 71-character domain-separated SHA-256 hashes without plaintext columns
      - [x] Issue and rotate plaintext credentials at the service boundary only
  - [>] Route every trigger through the same workflow-start use case
    - [x] Revalidate mappings against the current workflow definition at save and fire time
    - [x] Scope external idempotency to trigger and credential generation and derive stable scheduled occurrence identities
    - [x] Retain initiating trigger and effective immutable input snapshot on each run
    - [x] Retry failed starts through the same correlation CAS without creating a second run
    - [x] Complete runtime wiring and end-to-end API/scheduler verification
      - [x] Prove API and webhook duplicate delivery against the real local server
      - [x] Prove rotation/revocation and disabled direct-fire rejection
      - [x] Prove the scheduler creates one stable UTC occurrence and run snapshot
  - [x] Add trigger lifecycle interfaces with minimal existing-workflow UI hooks
    - [x] Support create, enable/disable, rotate, test, last-fired/result, and paginated history in the backend contract
    - [x] Add one focused Enhanced trigger surface behind a narrow workflow hook
    - [x] Re-audit the host diff and gate it strictly on the Enhanced `workflow_triggers` capability
    - [x] Preserve existing workflow navigation and graph/editor structure
    - [x] Verify the isolated dialog at desktop and mobile widths before accepting the UI
      - [x] Create all four trigger types, rotate credentials, test-fire, and inspect history
      - [x] Replace the clipped mobile table with component-local cards after browser evidence exposed inaccessible actions
      - [x] Verify 1280 px and 390×844 layouts without page overflow or browser-console findings
  - [>] Verify scheduler/API/webhook execution, duplicates, rotation, retries, definition changes, permissions, full suites, and security
    - [x] Complete focused domain, repository, service, API, UI, build, and browser checks
    - [x] Run the four-database migration matrix and full repository/module suites
      - [x] Pass SQLite, PostgreSQL, MySQL, and MariaDB migrate/rollback/reapply checks
      - [x] Pass the full root, Community, and Enhanced Go suites
      - [x] Pass root and Enhanced race checks plus `go vet` in all three workspaces
      - [x] Match the established frontend baseline: 116 passing and the same 3 unrelated failures
      - [x] Complete the production frontend and Docusaurus builds
    - [x] Complete the final diff, security, and acceptance review
      - [x] Re-read every new domain, repository, service, controller, migration, and UI boundary
      - [x] Confirm hash-only credential persistence, scoped authorization, and atomic idempotency controls
      - [x] Complete the native working-tree security diff scan
      - [x] Reproduce and fix the in-flight rotation/disable race before committing
        - [x] Bind revision, enabled state, and credential generation to the durable SQL invocation claim
        - [x] Prove rotation and disable reject a blocked external invocation with the race detector
        - [x] Preserve normal API and schedule idempotency after the guard
  - [>] Document and commit Slice 035
    - [x] Add the developer contract for mappings, APIs, credentials, schedules, persistence, and compatibility
    - [x] Mark the Slice 035 implementation and acceptance checklist complete

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
- [>] 035 — Workflow triggers
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
