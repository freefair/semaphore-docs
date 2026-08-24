# Feature Branch Assessment

## Purpose

This assessment records what is still useful in the remote feature branches without treating an old branch as merge-ready.
It separates features already present on current `develop`, partial scaffolding that still depends on the enhanced module, and work that is genuinely absent.

The repository was fetched and assessed on 2026-08-24 from `develop` at `071b312b8993121a2ce4a34b84c0e12b73477729`.
No branch was merged, rebased, deleted, or otherwise modified.

## Method

Each remote branch was compared with `develop` using its merge base, unique commit count, state diff, patch equivalence, commit subjects, and a semantic search of current code and tests.
`Behind` and `Ahead` are counts relative to the inspected `develop` commit, not a judgment of quality.

There are 27 remote refs named `feat/*` or `feature/*`.
Twenty-four contain commits not reachable from `develop`; three have no unique commits and require no recovery work.
The repository has 268 remote refs not merged into `develop` in total, so a second table covers related enhanced-feature branches whose names do not use the feature prefixes.

Classification meanings:

- **Baseline:** The intended behavior is already present in current `develop`, usually through different commits.
- **Partial:** Shared models, routes, UI, or tests exist, but the enhanced behavior is incomplete or supplied only by the missing private module.
- **Open:** The behavior was not found in current `develop` and remains a valid selectable backlog item.
- **No unique work:** The branch contains no commits beyond current `develop`.

## Feature-Named Branches

| Branch | Last commit | Behind | Ahead | Classification | Disposition |
|---|---:|---:|---:|---|---|
| `origin/feat/api_key_expire` | 2026-04-25 | 513 | 5 | Baseline | API token expiry, middleware rejection, and UI are present; retain only as a comparison source for missing edge-case tests, then archive after explicit approval. |
| `origin/feat/cluster_dashboard` | 2026-05-23 | 412 | 13 | Partial | Cluster routes and UI exist, but real HA behavior is still a Community no-op; use as evidence for E01a, not as a merge source. |
| `origin/feat/debug_filter` | 2026-06-07 | 357 | 3 | Baseline | Debug filtering is present; compare tests and retire rather than merge. |
| `origin/feat/executor_image_in_template` | 2026-07-30 | 51 | 3 | Partial | Template persistence, validation, migration, UI, and tests are present; executor enforcement belongs in P02/E05/E06. |
| `origin/feat/external-identity-linking` | 2026-07-14 | 129 | 45 | Baseline | Provider-scoped LDAP/OIDC identities, linking, unlinking, and tests are present; audit and recovery hardening may remain. |
| `origin/feat/gen_ssh_key` | 2026-08-20 | 0 | 9 | Open | The branch is based on current `develop` and contains focused SSH-key generation work; review and port as B04 after a fresh contract test. |
| `origin/feat/invite_to_project` | 2025-08-06 | 1257 | 1 | Baseline | Current code contains the full invite model, store, API, tests, and acceptance UI; the old migration-only branch should not be merged. |
| `origin/feat/multiple_env` | 2026-04-28 | 492 | 12 | Baseline | Multiple ordered variable groups per template are present; use the branch only to identify missing precedence or import tests. |
| `origin/feat/openbao-secret-storage` | 2026-07-09 | 194 | 0 | No unique work | No commits are unique relative to `develop`; OpenBao remains part of the enhanced P06 implementation surface. |
| `origin/feat/password-hash` | 2026-05-31 | 379 | 3 | Open | Current password storage still uses bcrypt; reimplement Argon2id migration as B07 from current `develop`. |
| `origin/feat/pushover-alerts` | 2026-06-18 | 293 | 4 | Open | No current Pushover provider was found; port the provider intent without unrelated lockfile churn as B08. |
| `origin/feat/rsbuild` | 2026-07-13 | 149 | 2 | Open | The frontend still uses Vue CLI 5; treat B09 as an isolated build migration with browser parity evidence. |
| `origin/feat/runner_register_options` | 2026-04-30 | 467 | 2 | Partial | One-time registration is present, but explicit secure-mode and registration policy options need a fresh design under P02b. |
| `origin/feat/secret_from_file` | 2026-02-22 | 732 | 22 | Open | Some specific config values already support file input, but arbitrary secret-value file references with safe path policy do not; redesign as B10. |
| `origin/feat/siem` | 2026-07-16 | 120 | 1 | Superseded | This is a plan-only precursor; use `origin/feature/siem-audit-events` and B29 instead. |
| `origin/feat/staged_cli_args` | 2025-11-09 | 1001 | 10 | Baseline | Current executor accepts stage-keyed argument maps and legacy arrays; retain only for parity-test comparison. |
| `origin/feat/stop_all_force` | 2026-02-18 | 773 | 0 | No unique work | No commits are unique relative to `develop`; no recovery action is required. |
| `origin/feat/survey_vars_target` | 2026-07-14 | 156 | 0 | No unique work | No commits are unique; survey targets are already present in current code. |
| `origin/feat/survey_vars_validation` | 2026-07-31 | 50 | 2 | Baseline | Backend survey type, target, and default validation exists; compare the two commits for unported cases only. |
| `origin/feat/tagged_global_runner` | 2026-04-28 | 494 | 24 | Baseline | Runner tags, filtering modes, placement, UI, and database relations are present; enhanced project-runner policy remains P01/P02. |
| `origin/feat/task_runner_name` | 2026-05-23 | 412 | 3 | Baseline | `UsedRunnerName` persists the assignment in task history; use branch tests only if they cover a missing deleted-runner case. |
| `origin/feat/template-search` | 2026-06-11 | 327 | 3 | Open | No current template search was found; implement B14 as a current UI/API slice rather than merging the stale branch. |
| `origin/feat/unpin_store_db` | 2026-05-23 | 417 | 8 | Baseline | A user-scoped, allowlisted options API and persisted unpinned navigation already exist with tests. |
| `origin/feat/unregistered_runners` | 2026-06-02 | 375 | 16 | Baseline | One-time hashed registration tokens, expiry, regeneration, API, and tests are present; primary runner-token hashing remains B18. |
| `origin/feat/workflow_params` | 2026-07-10 | 182 | 4 | Partial | Workflow nodes already reuse `TaskParams` and the editor surface, but Community workflow persistence and orchestration remain no-ops under P08. |
| `origin/feature/add_context_vars` | 2026-02-16 | 832 | 1 | Open test debt | The branch adds focused `ShellQuote` coverage rather than a product feature; port the test only if it exposes an untested current behavior. |
| `origin/feature/siem-audit-events` | 2026-07-20 | 120 | 9 | Open | The current event model lacks the full SIEM actor/action/client/correlation schema; redesign under B29/P05a. |

## Related Enhanced-Feature Branches

These branches carry relevant work despite not being named `feat/*` or `feature/*`.

| Branch | Last commit | Behind | Ahead | Assessment and destination |
|---|---:|---:|---:|---|
| `origin/active_ha` | 2026-02-14 | 829 | 10 | HA prototype; extract failure cases and fold them into E01. |
| `origin/app_versions` | 2026-02-18 | 774 | 6 | App-version selection is absent; redesign as B27. |
| `origin/aws_sm` | 2026-04-07 | 625 | 8 | AWS Secrets Manager prototype; implement independently as E04a behind the serializer boundary. |
| `origin/runner_secure_mode` | 2026-04-15 | 570 | 1 | Small policy prototype; combine with P02b rather than shipping a separate switch without a threat model. |
| `origin/runner_task_requeue` | 2025-12-14 | 921 | 1 | Recovery prototype; use its failure case in P01c/E01, not its old implementation. |
| `origin/tasks_pagination` | 2026-06-12 | 324 | 2 | Superseded by current keyset pagination and UI cursor state. |
| `origin/workflow_sq` | 2026-06-14 | 375 | 1 | Workflow experiment; current shared schema is newer, while enhanced persistence remains P08. |
| `origin/ha_remove_owner` | 2026-06-08 | 349 | 14 | Mixed HA/task-ownership work; mine failure tests for E01 and P01c, never merge wholesale. |
| `origin/session_max_life` | 2026-08-19 | 2 | 2 | Fresh, narrowly scoped session-lifetime work; review and port as B28 with clock-controlled tests. |
| `origin/pro_flag` | 2025-10-05 | 1096 | 1 | Old UI-only feature gating; superseded architecturally by F03 and ADR 0002. |
| `origin/remove_runner_pk` | 2026-06-23 | 289 | 2 | Runner-auth data-model experiment; assess together with B18 before choosing a migration. |
| `origin/oidc_idp_init` | 2026-05-30 | 379 | 2 | Earlier IdP-initiated login prototype; superseded by `oidc_idp_init2`. |
| `origin/oidc_idp_init2` | 2026-06-25 | 237 | 1 | IdP-initiated login is absent; redesign and test as B16. |
| `origin/jwt-runner-auth` | 2026-05-30 | 368 | 2 | Current code already exposes workload JWKS/task tokens; retain only for comparison and keep JWT out of user sessions. |
| `origin/admin_sysinfo` | 2026-04-16 | 565 | 0 | No unique work. |
| `origin/azure` | 2026-04-17 | 529 | 0 | No unique commits; Azure Key Vault still requires the enhanced E04b implementation. |
| `origin/config_maps` | 2025-04-12 | 1844 | 0 | No unique work. |
| `origin/running_concurrency` | 2026-06-08 | 344 | 0 | No unique work. |

## Recommended Branch Handling

For every selected item:

1. Start from the then-current, explicitly verified `develop` commit.
2. Write a minimal failing contract or reproduction under `/tmp/` before changing production code.
3. Compare the old branch at commit and file level; port only behavior, focused tests, and still-valid documentation.
4. Rework migrations against the current schema instead of replaying old migration assumptions.
5. Verify backend, frontend, browser, migration, and protocol boundaries required by the feature.
6. Archive or delete the old remote branch only after the replacement is merged and the user explicitly approves the destructive action.

Branches classified as Baseline still deserve a narrow parity review before archival.
That review should ask whether the old branch has a valuable negative test, not whether its diff can still be merged.

## Priority Order for Branch Recovery

1. Review the fresh, low-divergence branches `gen_ssh_key` and `session_max_life` if B04 or B28 is selected.
2. Complete the security-sensitive B07, B18, and B29 decisions and verify the C13 key-rotation baseline before expanding authentication or HA.
3. Fold runner, executor-image, requeue, and HA experiments into P01/P02/E01 contracts.
4. Treat Rsbuild as an independent infrastructure change after product behavior is stable.
5. Review Baseline branches for unique regression tests, then propose an explicit archival list.
