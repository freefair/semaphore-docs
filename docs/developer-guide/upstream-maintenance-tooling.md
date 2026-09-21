# Upstream Maintenance Tooling

The full-product fork uses repository-owned maintenance inventories and commands.
The operational policy is [Full-Product Upstream Maintenance](plans/pro-slices/upstream-maintenance.md).
The executable input reference is `maintenance/README.md` in the application repository.

## Migration Identity

`maintenance/migrations.yml` separates an upstream migration's identity from the
local numeric ID recorded in deployed databases. Existing IDs and SQL checksums
are immutable. New migrations append after the current local tail, with explicit
ownership and upstream mappings. This preserves installed databases while making
number collisions visible before a merge.

The first ledger preserves every SQL file from the verified product baseline.
Later CI checks compare the ledger against the push predecessor or PR base, so
updating a checksum alongside an altered shipped migration does not bypass the gate.
Historical unregistered SQL remains recorded and unregistered.

## Interface and Placeholder Detection

`maintenance/contracts.yml` inventories exported compatibility-module, core-interface,
and database declarations. The checker uses compiler export data and method-set
origins, rather than assuming interface conformance proves an implementation exists.
It identifies inherited Community methods and function aliases separately from local
methods. Intentional shared implementations and unwired scaffolding have reviewed
rationales; new or changed callable contracts require behavioral test references.

The delay contract regression invokes all six public store methods and verifies
durable creation, project/run scoping, expiration, resolution, and immutable terminal
state. Removing the explicit expired-delay method in a temporary overlay still
compiles through embedding, but fails both the inventory check and the behavior test.

## Assessment and Gates

The application repository provides:

- `tools/upstream-sync/preflight.sh`: exact root/docs ref capture, optional fetch,
  upstream seam and migration diffs, explicit incoming migration decisions, and
  isolated merge conflict previews. Staged and unstaged inputs have retained binary patches and fingerprints; untracked source must be staged first. It does not change branch tips or worktrees.
- `tools/upstream-sync/verify.sh`: ordered local verification with retained logs,
  exit codes, timings, source fingerprints, an immutable baseline SHA, and checksum manifests. Build failures
  remain failures; independent gates continue collecting evidence.
- `tools/upstreamcheck`: compiler-derived contract checks and immutable migration
  ledger checks, also invoked by the existing Full Product Build workflow.

Semantic conflict decisions remain with the maintainer. A clean textual merge or
a recorded resolution is not evidence that permissions, lifecycle behavior, or
persistence contracts survived.

## Documentation verification

Documentation is published as directly readable Markdown; see [ADR 0021](adr/0021-publish-plain-markdown-documentation.md).
From the product repository run:

```bash
node docs/scripts/check-docs.mjs
task docs:check
```

The checker validates file links, anchors, page-index coverage and absence of site-only syntax or vendor-site dependencies.
There is no locale compilation, documentation server, package installation or site deployment.
Reference generation is an optional maintainer operation whose Markdown output remains committed.
