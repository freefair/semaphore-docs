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

## Documentation Build Concurrency

`npm run build` remains the default serial eleven-locale Docusaurus build.
`npm run build:parallel` is an explicit alternative with `JOBS=1` or `JOBS=2`,
defaulting to two workers. The tested bound is enforced; increase it only after
measuring memory and elapsed time on the intended builder.

The benchmark command uses an isolated copy of committed documentation, retains
every output and log, and samples aggregate RSS of the npm process tree every 200ms:

```bash
npm ci
node scripts/benchmark-builds.cjs --output /tmp/semaphore-docs-benchmark
DOCS_BUILD_DIR=/tmp/semaphore-docs-benchmark/serial-warm-build \
  node --test tests/security-fallbacks.test.cjs
DOCS_BUILD_DIR=/tmp/semaphore-docs-benchmark/parallel-2-warm-build \
  node --test tests/security-fallbacks.test.cjs
```

The first-pass order warms shared dependency/compiler caches. Compare warm serial
and warm parallel results separately; the first serial/parallel ratio does not
isolate a concurrency benefit. RSS sums may double-count shared pages and sampling
may miss short peaks. The benchmark is a workstation observation, not a deployment
capacity guarantee.

The reference measurements are retained in the application repository at
`AGENTS/plans/upstream-maintenance/docs-build-measurements.yml`. On the measured
48 GiB, 18-logical-CPU macOS host with Node 26.8.1, warm serial took 39.96 seconds
and approximately 2.53 GiB peak sampled tree RSS; warm two-worker builds took
54.92 seconds and approximately 2.71 GiB. The first serial build took 336.36 seconds,
while the following two-worker build took 45.15 seconds. Cache effects dominate
that first-pass difference. A repeat using the delivered benchmark command measured
warm serial at 32.17 seconds / 2.16 GiB and warm two-worker builds at 27.15 seconds /
2.78 GiB. The latter was about 16% faster with about 29% higher sampled RSS. Speed
varied between runs while serial consistently used less memory, so serial remains
the conservative default and two-worker builds remain an explicit option.

Both modes preserve locale URL prefixes and all 45 canonical English security
fallbacks. The source test rejects reintroduced unreviewed overrides; supplying
`DOCS_BUILD_DIR` additionally checks generated locale routes, headings, security
content, and absence of commercial entitlement assertions. A missing supplied
build directory fails verification.
