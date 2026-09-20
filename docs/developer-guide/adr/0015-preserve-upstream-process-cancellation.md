# ADR 0015: Preserve Upstream Process Cancellation

## Status

Accepted

## Context

Upstream replaces direct task-process killing with synchronized cancellation and process-group cleanup.
The fork also owns SQL-authoritative task start claims and the task-scoped SSH agent described in [ADR 0012](0012-share-task-repository-ssh-identities.md).
An upstream merge must retain both lifecycle contracts, including when a command handles termination and exits successfully.

## Decision

Keep upstream's single-use `LocalExecutor`, mutex-protected stop request, and `StopCh` command contract.
On Unix, application commands use a dedicated process group, receive SIGTERM on cancellation, and receive SIGKILL after the grace period or when the group leader exits.
Preserve the upstream direct-process fallback and bounded output draining.
Cancellation remains independent of the command's exit code, so a successful SIGTERM handler still results in a stopped task and a cancelled Terraform plan cannot advance to apply.

Keep the fork's conditional SQL start claim before execution and preserve remote asynchronous completion.
Cancellation fixtures create tasks in the real `waiting` state so they exercise finalization instead of being rejected as stale queue entries.
Use `Kill()` in SSH lifecycle tests rather than assigning the removed private flag.
Assert that pre-run cancellation skips application execution while deferred cleanup closes the task agent and removes identity selectors.

Retain upstream's single-newline `api/public/.gitkeep` and its matching `build:fe` restoration step.
Apply the same restoration after the fork's `build:fe:edition` production and source-map builds so full-product builds preserve the tracked source fingerprint.
The placeholder supports Go embedding in a clean source tree; release verification still builds the actual frontend before Go compilation.
Keep existing product builds, migration identities, permission checks, secret redaction, and the selected Enhanced module unchanged.

## Alternatives

Restoring the process callback or a separate fork-owned kill path would discard upstream's synchronized cancellation and leave child-process cleanup inconsistent.
Weakening the SQL start claim to accommodate an empty test status would bypass the authoritative lifecycle boundary.
Keeping the placeholder deleted while accepting its restoration command would make source-tree state depend on which build entry point ran.

## Verification

Run the upstream cancellation, graceful-exit, process-group, and pending-stop regressions in `db_lib`, `services/tasks`, and `util`.
Run the fork's SSH agent lifecycle regression and targeted race-detector tests.
The complete upstream-sync gate runner verifies both Go modules, contract and migration inventories, frontend, product artifacts, Dockerfiles, and documentation.

## Consequences

Local cancellation waits for command termination before releasing task resources, including SSH credentials.
This preserves upstream's process-group behavior; it is not an operating-system sandbox for untrusted task code.
The upstream process-group implementation documents a PID/group reuse risk after the group leader is reaped.
The fork adds no new cancellation mechanism or migration in this merge.
