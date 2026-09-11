# Full-Product Upstream Maintenance

This runbook defines how to merge upstream into the `freefair/semaphore-ex` full-product fork from `semaphoreui/semaphore` without silently dropping selected feature behavior or current upstream fixes.
It is written for maintainers and coding agents that have the repository but no access to a separate commercial module.

## Table of Contents

- [Source of Truth](#source-of-truth)
- [Product Invariants](#product-invariants)
- [Feature and Implementation Map](#feature-and-implementation-map)
- [Conflict-Sensitive Contracts](#conflict-sensitive-contracts)
- [Merge Procedure](#merge-procedure)
- [Verification Gates](#verification-gates)
- [Publication and Pipeline Verification](#publication-and-pipeline-verification)

## Source of Truth

The [ordered slice index](/docs/developer-guide/plans/pro-slices/#ordered-slice-index) is the complete selected feature inventory.
Each linked slice document is the canonical behavioral specification, dependency declaration, and acceptance-test contract for that feature.
[ADR 0010](../../adr/0010-ship-one-full-featured-product.md) supersedes the older dual-edition assumptions contained in historical slices.
[STATUS.md](STATUS.md) records whether the complete backlog and any current maintenance work are finished.

Do not reconstruct a feature from memory or from an inaccessible commercial repository.
When a conflict touches a feature path, read the corresponding slice documents and their required tests before choosing a resolution.
When upstream introduces a new function in the replaceable `pro` seam, implement that contract in the repository-contained Enhanced module rather than bypassing the caller or restoring an external module dependency.

## Product Invariants

- The repository builds one full-featured product from the root workspace and the clean-room Enhanced module under `test/edition-contract/enhanced`.
- Implemented features have no commercial subscription, user-count, quota, trial, billing, edition, or upgrade gate.
- Ordinary configuration can disable optional or noisy behavior.
  An `enabled` flag controls deployment behavior; it never represents a commercial entitlement.
- Backend capability and permission decisions remain authoritative.
  The UI can explain or hide unavailable actions but cannot grant access.
- SQL is durable authority for lifecycle transitions.
  Redis and in-memory state coordinate work but do not replace conditional database writes.
- Secret values remain write-only or execution-local.
  APIs, logs, task summaries, audit records, notifications, artifacts, and diagnostics expose references or fingerprints, never resolved plaintext.
- Shared upstream UI remains structurally close to upstream.
  Feature-specific rendering and orchestration belong in focused components behind narrow integration hooks.
- Unselected capabilities remain absent even though the product has no editions.
  This includes Terraform state, SOPS, the separate P07 OIDC edition gate, and unimplemented external cloud secret providers.

## Feature and Implementation Map

The table covers every slice in the ordered index and routes conflicts to the right specifications and implementation areas.

| Slice family | Specifications | Primary implementation anchors |
|---|---|---|
| Foundation and build | [001–005](/docs/developer-guide/plans/pro-slices/#ordered-slice-index) | `pro_interfaces/`, `go.work`, `Taskfile.yml`, `.github/workflows/product_*.yml`, `tools/buildmeta/`, `tools/frontendmaps/`, `api/capabilities.go`, `services/capabilities/`, migration-matrix tests |
| Runners and placement | [010–016](/docs/developer-guide/plans/pro-slices/#ordered-slice-index) | `api/runners/`, `services/runners/`, `services/tasks/`, runner tables and migrations, `web/src/views/Runners.vue`, focused runner components |
| Task diagnostics and secrets | [020–027](/docs/developer-guide/plans/pro-slices/#ordered-slice-index) | task-summary storage, structured log services, audit webhooks, debug filters, runtime-secret references, Enhanced Vault/OpenBao clients, TOTP and LDAP controllers/components |
| Workflow execution | [030–037](/docs/developer-guide/plans/pro-slices/#ordered-slice-index) | workflow models and migrations, Enhanced workflow services/controllers, `WorkflowEditor.vue`, `WorkflowGraph.vue`, focused workflow dialogs, reconciliation tests |
| HA and roles | [040–048](/docs/developer-guide/plans/pro-slices/#ordered-slice-index) | cluster and lease repositories, `services/ha`, HA harness, role repositories/controllers, LDAP/OIDC mapping services and panels |
| Container executors | [050–053](/docs/developer-guide/plans/pro-slices/#ordered-slice-index) | `services/tasks/container_task_plan.go`, Enhanced Docker/Kubernetes executors, execution-policy APIs, runner diagnostics and remediation UI |
| Workflow governance and delivery | [054–059](/docs/developer-guide/plans/pro-slices/#ordered-slice-index) | approval/RBAC snapshots, immutable versions, cross-project grants, notification outbox and provider clients, governance components |
| Credentials and focused additions | [060–064](/docs/developer-guide/plans/pro-slices/#ordered-slice-index) | global credential grants, dispatch-time resolution and redaction, generated SSH keys, template search, schedule timezone persistence and UI |
| Advanced policy controls | [070–074](/docs/developer-guide/plans/pro-slices/#ordered-slice-index) | execution preflight, deployment-window and guardrail admission, signed webhook lifecycle, artifact retention/provenance repositories, APIs, workers, and focused panels |

The root `pro/` directory is the upstream-compatible null or Community-side seam.
The selected implementation is the module at `test/edition-contract/enhanced`, selected by the committed workspace.
Calls imported as `github.com/semaphoreui/semaphore/pro/...` therefore need matching exported contracts in both module implementations when upstream extends the seam.

## Conflict-Sensitive Contracts

### Upstream Schema and Module Extensions

Shipped fork migration identifiers are immutable. Upstream reused `2.20.2` and
`2.20.3` for delay nodes and template working directories; the fork already uses
those identifiers for capability configuration and runner names. The new schema
is appended as `2.20.66` and `2.20.67`. Preserve both shipped migrations and verify
upgrade, rollback, and re-upgrade from an existing fork database.

Delay rows reference the immutable workflow-run node through the pair
`(workflow_run_id, workflow_node_id)`. Definition edits must not delete an active
wait. Database time controls the deadline and completion predicate; atomic SQL
transitions and HA fencing control completion and stop. A waiting node consumes
no task worker slot. Durations are whole seconds from 1 through 2147483647.

Template-version snapshots include `working_directory`, copy its pointer value,
and include it in the execution fingerprint. Running a pinned version preserves
its directory even after the live template changes.

Enhanced stores embed upstream null implementations. A newly added interface
method can therefore compile while silently inheriting a placeholder. Review
new exported methods explicitly and test their observable persistence behavior;
interface conformance alone does not prove the Enhanced contract is implemented.

### Generated Frontend

`api/router.go` embeds `api/public/*`.
A clean checkout must run the frontend build before any Go test or build that compiles the router.
Local success with an ignored `api/public` directory is not evidence that CI can compile a clean checkout.

### Gitless Container Builds

The HA clean-room context deliberately excludes `.git`.
Every nested Task invocation in the Docker build must receive all revision-derived variables it might otherwise calculate with Git, including `CORE_REVISION`, `ENHANCED_REVISION`, and `SOURCE_DATE_EPOCH`.
Do not fix a missing variable by copying `.git` into the image context.

### Fork Source Boundaries

Task-summary persistence lives in the selected Enhanced SQL module and its factory.
The selected UI uses `EnhancedTaskSummary.vue`; the upstream `AnsibleStageView.vue` remains unwired compatibility source.
Fork-only root declarations use focused same-package `_ex.go` files when moving modules would change public type identity or introduce dependency cycles.
Keep existing authorization, SQL transaction, admission, fencing, and redaction calls at their authoritative integration points.
Vue option additions live under `web/src/lib/enhanced`, while new rendering uses focused components and fork messages live under `web/src/lang/enhanced`.
Shared hosts explicitly select these additions.
Fork build tasks live in `Taskfile.ex.yml`, included with their original task names.

### Dredd Fixtures

Fork-only paths and definitions live in `api-docs-ex.yml` and are referenced from `api-docs.yml`.
Run `go run ./tools/openapibundle` before direct Dredd invocations; Task targets perform this step automatically.
The ignored `.dredd/api-docs.bundled.yml` is the standalone contract for Dredd 13.1.2, which cannot resolve the authored external schema references.
The bundler preserves internal references and rejects unsupported external paths and authored-source overwrites.

The Dredd hooks compile against the selected workspace implementation.
Workflow fixtures must create durable workflow-run nodes and use current atomic store methods such as `OpenWorkflowApproval`; they must not restore removed persistence shortcuts.
Feature API calls must use the current replaceable-module signature.
Collection and singleton `PUT` routes do not have a trailing object ID and must not be forced through item-route ID injection.
Multi-step full-product state machines are identified by exact path families in `tools/dreddhooks`; Dredd parses their OpenAPI contracts while focused Go integration tests own their stateful execution coverage.

### HA Task and Dependency Recovery

SQL remains authoritative for runner assignments; each node's `TaskStateStore` is only a process-local cache.
In HA mode every runner poll therefore loads unfinished assignments for that runner from SQL and hydrates any missing or stale local `TaskRunner` before producing `new_jobs` or `current_jobs`.
Do not replace this recovery path with sticky routing or a durable Redis task cache.

Task-control release carries the task's runner and assignment-generation identity.
A delayed cleanup from an older generation must not release the currently tracked lease for a replacement generation.
Cluster-node repository operations carry `context.Context`, and registry, readiness, diagnostics, and drain calls bound dependency access so a black-holed SQL connection cannot permanently stop heartbeats or HTTP readiness recovery.

The partition gate checks recovered readiness from inside the reconnected node.
Docker's host-published port can remain temporarily unavailable after `docker network disconnect` followed by `docker network connect`, even when the service has already restored SQL and Redis readiness; peer API availability remains a separate proxy assertion.
The later rolling-replacement gate must follow the same boundary: send the authenticated drain request through the stable proxy, but verify the targeted node's drained and recovered readiness from inside that service container.

### Project Role Mutation Locks

Project-role mutations serialize on the project row.
PostgreSQL, MySQL, and MariaDB use `SELECT ... FOR UPDATE`; do not infer row existence from a no-op update's affected-row count because MySQL-compatible drivers report zero when the matched value is unchanged.
The external migration matrix creates a real project membership so this remains covered on every supported SQL dialect.

### Workflow Graph SQL Portability

Workflow-node inserts provide neutral `[]` values for artifact input and output JSON before the second persistence phase writes the fully mapped declarations.
They do not rely on defaults for `LONGTEXT` columns, which MariaDB deliberately creates without defaults.
Workflow-edge statements quote the `condition` identifier because it is reserved by MariaDB.

### Task Logging and Credential Redaction

Upstream owns command-local output finalization in `TaskRunner.LogCmd` and `runningJob.LogCmd`.
Do not restore an obsolete runner-level `sync.WaitGroup` when resolving logging conflicts.
The full-product layer adds a `taskredaction.Redactor`, configures it immediately after dispatch-time credential resolution, and redacts before every websocket, database, structured-result, and listener sink.
Tests must exercise credential output through `LogCmd` and its returned finalizer, not only direct calls to `Log`.

### Secret-Storage Credential Classification

`StorageRequiresSecret` is part of the replaceable Enhanced server contract.
It returns `false` only for `aws_sm` with a literal boolean `params.use_iam_role` value of `true`.
Missing, false, malformed, unsupported, Vault, and OpenBao configurations default to requiring a credential.
This compatibility classifier does not enable AWS or another unselected provider in the Enhanced provider list.

### UI Conflict Resolution

Preserve new upstream fields, loading states, and permission handling in shared host views.
Insert selected behavior through existing focused components and narrow props/events.
For the workflow editor, upstream navigation and responsive/collapsible behavior must coexist with version, parameter, RBAC, and validation controls.
For task details, keep upstream schedule/integration origin rendering while runner-attempt orchestration stays in `TaskRunnerDetails`.

### Documentation Submodule

The root submodule URL is the writable fork `git@github.com:freefair/semaphore-docs.git`.
Inside the submodule, `origin` is the writable fork and `upstream` is `git@github.com:semaphoreui/semaphore-docs`.
Merge, verify, and publish documentation first, then commit the resulting submodule pointer in the root repository.
Never point the root repository at a documentation commit that is not reachable from the configured fork.

## Merge Procedure

Routine updates merge upstream into the long-lived root `develop` and docs `main`
branches. Both published histories remain intact. Rebases and force-pushes are
exceptions requiring a separate explicit request. Older personal skill instructions
that prescribe rebasing do not override this repository policy.

1. Verify the repository, worktrees, remotes, and branch names. Preserve unrelated
   tracked and untracked work; review unpublished commits before including them.
2. Run the repository-owned assessment and retain its output:

   ```bash
   bash tools/upstream-sync/preflight.sh --fetch --output /tmp/semaphore-assessment .
   ```

3. Read the exact ref records, seam/schema diffs, incoming migration decisions,
   and root/docs conflict previews. Confirm ancestry and expected origin tips.
   If local and origin tips differ, reconcile that explicitly before the sync.
4. Create a clearly named local recovery branch at each pre-merge head. Keep
   recovery points until cleanup is explicitly authorized.
5. Merge the recorded docs upstream SHA into docs `main` with
   `git merge --no-ff --no-commit <recorded-docs-upstream-sha>`. Resolve and verify
   the docs changes, commit, obtain publication approval, and push normally.
6. Read the remote docs head back, then merge the recorded root upstream SHA into
   `develop` with `git merge --no-ff --no-commit <recorded-root-upstream-sha>`.
   Point the submodule at the verified published docs commit.
7. Resolve each conflict against the relevant slice specs and current upstream
   behavior. Keep permissions, configured enablement, credentials, and durable
   lifecycle transitions authoritative.
8. Preserve every shipped migration ID and SQL file. Append newly mapped upstream
   migrations at the local tail and update the ownership ledger. Review corrected
   upstream SQL as a new local corrective migration, never a historical rewrite.
9. Inventory new/changed exported seams, implement required Enhanced behavior,
   and add behavioral regressions before updating the reviewed contract inventory.
10. Run focused verification for conflict resolutions and the complete retained
    gate runner. Inspect the resulting diff against both pre-merge parents before
    committing the merge and any separate compatibility changes.
11. Obtain publication approval, verify the recorded origin tip again, push
    normally, read back the exact remote SHA, and wait for the required workflows.

The merge preview never chooses a semantic resolution. Avoid blanket side selection,
automatic placeholder approval, and unrelated refactoring. Implement future feature
behavior in the existing Enhanced module and focused UI components; shared hosts
receive only the smallest necessary integration.

See [maintenance tooling](../../upstream-maintenance-tooling.md) and the application
repository's `maintenance/README.md` for executable checks and inventory updates.

## Verification Gates

Run all gates on the final merged source after the last compatibility change.
The repository-owned runner retains command logs, exit codes, source fingerprints,
and checksums: `bash tools/upstream-sync/verify.sh --output /tmp/semaphore-gates`.

```bash
go test ./... -count=1
(cd test/edition-contract/enhanced && go test ./... -count=1)
(cd .dredd/hooks && go build -o /tmp/semaphore-dredd-hooks .)
npm --prefix web run test:unit
go run github.com/go-task/task/v3/cmd/task@v3.53.1 build:edition
docker build --check --file deployment/docker/server/Dockerfile .
docker build --check --file deployment/docker/runner/Dockerfile .
npm --prefix docs run build
```

Run Go vet for both modules and lint every manually merged frontend file.
Treat a local ignored frontend build as contaminated evidence for clean-checkout tests.
If the full frontend suite has failures, reproduce each failure on the exact upstream base before classifying it as an upstream baseline failure.
Do not convert a new failure into an accepted baseline.

Perform browser verification for every visible path changed during conflict resolution.
Check desktop and mobile widths, browser-console errors, permissions, disabled capabilities, and absence of commercial upgrade surfaces.

Security-sensitive conflicts and the final tracked diff require a dedicated Terra security review.
The primary agent integrates the evidence and runs the non-security release gates.

## Source Separation Outside Syncs

Use focused components in `web/src/components/enhanced` for fork-only rendering and
explicit option/state spreads in `web/src/lib/enhanced`. Preserve update ordering,
keyboard focus, disabled controls and the host's network/lifecycle responsibilities.
Keep upstream controls visible in their original host, using slots for surrounding
fork content. A complete fork-owned transaction can live in a same-package helper
when its locks, error handling and caller order remain intact.

The root API and embedded Swagger surface each retain their own public entry and
fork fragment. Verify expanded contracts and the shipped Swagger resolver; these
surfaces intentionally expose different sets of endpoints. Keep configuration
schema references self-contained until a fork schema identity and its consumers
are explicitly reviewed. Consult `maintenance/source-boundaries.md` in the root
repository for the ownership table and integration rules.

## Publication and Pipeline Verification

Fetch `origin` again immediately before pushing. Require its branch tip to match
the assessment's recorded tip. If it advanced, incorporate the new work and repeat
relevant verification before proceeding. Obtain publication approval for the concrete
reviewed result. Push the merged history normally:

```bash
git push origin develop:develop
```

Inside the docs submodule, use `git push origin main:main`. Use
`GIT_SSH_COMMAND='ssh -o IdentitiesOnly=yes'` for network Git operations.
A normal push must be a fast-forward of the current remote history; never use force
to get around a concurrent update.

Read the remote branch SHA after the push and require exact equality with the local
head. Wait for every required push-triggered workflow. Inspect failed job logs and
fix root causes before declaring the update complete. Dependabot update failures
are separate work unless they break the selected build or are explicitly included.

Retain verification evidence. Remove only this run's generated artifacts, and delete
recovery branches or restored stashes only with explicit cleanup authorization.
