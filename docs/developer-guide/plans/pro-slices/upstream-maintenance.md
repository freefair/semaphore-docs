# Full-Product Upstream Maintenance

This runbook defines how to rebase the `freefair/semaphore-ex` full-product fork onto `semaphoreui/semaphore` without silently dropping selected feature behavior or current upstream fixes.
It is written for maintainers and coding agents that have the repository but no access to a separate commercial module.

## Table of Contents

- [Source of Truth](#source-of-truth)
- [Product Invariants](#product-invariants)
- [Feature and Implementation Map](#feature-and-implementation-map)
- [Conflict-Sensitive Contracts](#conflict-sensitive-contracts)
- [Rebase Procedure](#rebase-procedure)
- [Verification Gates](#verification-gates)
- [Guarded Push and Pipeline Verification](#guarded-push-and-pipeline-verification)

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

### Generated Frontend

`api/router.go` embeds `api/public/*`.
A clean checkout must run the frontend build before any Go test or build that compiles the router.
Local success with an ignored `api/public` directory is not evidence that CI can compile a clean checkout.

### Gitless Container Builds

The HA clean-room context deliberately excludes `.git`.
Every nested Task invocation in the Docker build must receive all revision-derived variables it might otherwise calculate with Git, including `CORE_REVISION`, `ENHANCED_REVISION`, and `SOURCE_DATE_EPOCH`.
Do not fix a missing variable by copying `.git` into the image context.

### Dredd Fixtures

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

### Project Role Mutation Locks

Project-role mutations serialize on the project row.
PostgreSQL, MySQL, and MariaDB use `SELECT ... FOR UPDATE`; do not infer row existence from a no-op update's affected-row count because MySQL-compatible drivers report zero when the matched value is unchanged.
The external migration matrix creates a real project membership so this remains covered on every supported SQL dialect.

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
Rebase and push documentation first, then commit the resulting submodule pointer in the root repository.
Never point the root repository at a documentation commit that is not reachable from the configured fork.

## Rebase Procedure

1. Verify the repository and remotes instead of assuming them.
   `origin` must identify `freefair/semaphore-ex`; `upstream` must identify `semaphoreui/semaphore`.
2. Fetch both remotes with the required SSH identity policy.
3. Record the exact local head, `origin/develop`, `upstream/develop`, merge base, and left/right commit counts.
4. Stop if the expected merge base is absent or the branch ancestry is unrelated.
5. Obtain explicit approval for the history rewrite and later guarded force-push.
6. Create a local `codex/` safety branch at the pre-rebase head.
7. Preserve unrelated tracked and untracked working state separately.
   Do not stage local journals, generated knowledge mirrors, build output, or credentials.
8. Rebase `develop` onto `upstream/develop`.
9. For every conflict, identify the replayed commit and map each path to the slice families above.
10. Read the relevant slice specifications, the upstream version, the replayed version, and the pre-rebase final version before editing.
11. Preserve current upstream behavior and reapply the selected contract through its documented seam.
12. Run a focused formatter, compiler, linter, or test before continuing each conflict.
13. After the rebase, restore unrelated working state and compare old and new patch stacks with `git range-diff`.
14. Implement any genuinely new upstream seam as a separate compatibility commit with a failing regression first.

Do not use `git rebase --skip` merely because a commit is difficult to replay.
Skip only when patch equivalence proves that upstream already contains the complete behavior and its tests.
Do not refactor conflicted code or fix unrelated defects during conflict resolution.

## Verification Gates

Run all gates on the final rebased head after the last compatibility change.

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

## Guarded Push and Pipeline Verification

Fetch `origin` again immediately before pushing.
Abort if `origin/develop` no longer equals the previously recorded remote head.
Push the rewritten history with an exact lease bound to that recorded commit, never with an unqualified force:

```bash
git push --force-with-lease=refs/heads/develop:<recorded-origin-sha> origin develop:develop
```

Read the remote branch SHA after the push and require exact equality with the local head.
Wait for every push-triggered required workflow to reach a terminal result.
Inspect failed job logs and fix root causes before declaring the update complete.
Dependabot update failures are separate work unless they break the selected build or the user explicitly includes them.

Remove generated build directories, temporary binaries, caches created for the run, and the local safety branch only after remote verification succeeds.
