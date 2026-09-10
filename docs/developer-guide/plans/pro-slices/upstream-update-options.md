# Options for Faster Upstream Updates

The regular-merge option is adopted by the [maintenance procedure](upstream-maintenance.md).
The ownership ledger, contract checks, assessment tooling, and measured documentation
build policy are described in [maintenance tooling](../../upstream-maintenance-tooling.md).
The comparison below preserves the reasoning behind that choice.

## Evidence from the Patch Stack

The application update replays 243 fork commits over 57 new upstream commits.
The documentation update replays 112 commits over 27 upstream commits. Root
history contains 104 documentation-pointer updates, whose referenced commits
change when documentation history is rebased. Documentation alone required 18
file-conflict resolutions at 16 stops, across 12 unique paths.

A merge-tree preview of the same starting tips reports 21 conflicting root paths
and 12 documentation paths. This is a structural comparison, not a measured
runtime benchmark: a merge still requires all semantic compatibility work and
release verification.

## Options

| Option | Benefit | Cost |
|---|---|---|
| Regular upstream merges into the long-lived fork | Resolve the combined change once; preserve published commit identities and use ordinary pushes | Nonlinear history; review the fork delta relative to upstream explicitly |
| Keep rebasing with reviewed recorded resolutions | Preserve a linear patch stack and reuse matching textual resolutions | Replays historical changes; still rewrites both repositories; submodule conflicts need separate mapping |
| Maintain a deliberately small patch stack | Smaller review surface and fewer overlapping shared files | Requires a separately planned restructuring of feature ownership and history |

The recommended follow-up is regular upstream merges for both repositories,
with documentation published before the root pointer update. Keep the existing
backup, contract review, browser, SQL-dialect, security, and CI gates. This strategy preserves published fork history; publication and destructive cleanup
remain explicit approval gates.

[Git merge](https://git-scm.com/docs/git-merge) records both histories in the
resulting merge commit. [Git rerere](https://git-scm.com/docs/git-rerere) can reuse
recorded textual resolutions in either workflow. Keep automatic index staging
disabled and review each reused resolution. Rerere does not resolve conflicting
submodule references.

## Reliability Work Worth Prioritizing

1. **Separate migration ownership.** Design an explicit upstream/fork migration
   ledger or namespace without renumbering shipped migrations. The current shared
   numeric sequence already collides at `2.20.2` and `2.20.3`; changing history
   strategy alone cannot fix this.
2. **Detect inherited placeholders.** Add a contract inventory for every exported
   upstream seam and behavior tests for new methods. Delay persistence shows why
   compile-time interface checks alone are insufficient with embedded null stores.
3. **Automate assessment and gates.** Extend the existing preflight with exact-ref
   capture, seam and migration diffs, conflict previews, and retained test evidence.
   Keep semantic conflict decisions explicit. Helper changes need their own scope.
4. **Reduce shared-file edits gradually.** Use the existing Enhanced module and
   focused UI components for future changes. Avoid a broad refactor during syncs.
5. **Bound documentation build concurrency.** Evaluate the existing parallel locale
   build against the serial eleven-locale build, measuring memory and elapsed time.
   Retain verification of translated security pages and canonical fallbacks.

These follow-up improvements are implemented separately from the upstream sync.
Future feature work follows the focused integration policy rather than a broad
refactor of existing shared files.
