# Enhanced Edition Implementation Status

Legend: `[x]` complete · `[>]` active · `[ ]` queued

Last updated: 2026-08-28

## Last Completed Slice

- [x] 033 — Workflow artifacts
  - [x] Define bounded typed output declarations and reachable input references
  - [x] Persist immutable, value-free provenance and attempt-bound output values
  - [x] Capture declared Ansible outputs and resolve downstream inputs just in time
  - [x] Route sensitive values only through encrypted task secrets and redact every user-visible surface
  - [x] Add the required API contracts and compact controls inside the existing workflow views
  - [x] Verify declaration, linking, validation, redaction, and metadata in desktop and mobile browsers
  - [x] Pass the four-database migration matrix, full suites, race checks, vet, lint, builds, and docs build
  - [x] Complete the committed security diff scan with 0 findings
  - [x] Commit documentation (`3d8a9d5`), its root pointer (`82ae3374`), and implementation (`db1cd1f2`)

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

- [>] 034 — Workflow parameters and node overrides
  - [>] Establish the existing workflow-start, task-override, credential, and permission contracts
    - [ ] Inventory duplicate or reusable parameter and override implementations
    - [ ] Confirm the architecture and OSS API/UI reference patterns
    - [ ] Specify typed values, bounds, precedence, immutable snapshots, and redaction
    - [ ] Prove the contract with external failing tests before production edits
  - [ ] Add parameter declarations and backend validation
    - [ ] Support string, integer, boolean, enumeration, and secret-reference parameters
    - [ ] Reject invalid names, unknown values, out-of-bound values, and plaintext secrets
  - [ ] Resolve immutable run inputs and node overrides
    - [ ] Apply definition defaults, trigger values, user values, and node overrides with documented precedence
    - [ ] Restrict inventory, environment, arguments, branch, and credentials to one backend allow-list
    - [ ] Store effective non-secret values and value-free secret fingerprints
  - [ ] Map the frozen snapshot to every task attempt without observing later definition edits
  - [ ] Extend API contracts and minimal existing UI surfaces
    - [ ] Add compact parameter declaration controls to the existing editor
    - [ ] Add start validation and effective/redacted audit details without changing navigation or graph structure
  - [ ] Verify persistence, concurrency, retries, permissions, browser behavior, full suites, and security
  - [ ] Document and commit Slice 034

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
- [>] 034 — Workflow parameters and overrides
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
