# Reproducible Edition Builds

Semaphore builds the Community and enhanced editions from the same core source tree.
The enhanced edition replaces the `github.com/semaphoreui/semaphore/pro` module through a Go Workspace; application imports remain unchanged.

## Contents

- [Pinned Inputs](#pinned-inputs)
- [Local Build](#local-build)
- [Artifact Contract](#artifact-contract)
- [Reproducibility Decisions](#reproducibility-decisions)
- [Runtime Verification](#runtime-verification)

## Pinned Inputs

An edition build is identified by these immutable inputs:

| Input | Community | Enhanced |
|---|---|---|
| Core revision | Required full commit SHA | Required full commit SHA |
| Enhanced revision | Not present | Required full commit SHA |
| Contract version | `pro_interfaces.CoreContractVersion` | `pro_interfaces.CoreContractVersion` |
| Implementation | `community-1` | `enhanced-<revision-prefix>` |
| Source date epoch | Core commit timestamp | Core commit timestamp |

CI pins Go, Node.js, Task, and the container build images.
The `enhanced-build` GitHub Environment supplies the full `ENHANCED_REVISION` variable and the `ENHANCED_REPOSITORY_TOKEN` secret.
Only enhanced jobs bind that environment or reference that secret.
Community pull-request jobs therefore cannot read the enhanced repository credential.

## Local Build

Install the frontend dependencies with `npm ci` and use the pinned Task release from the workflow.
Build Community artifacts with:

```bash
task build:edition \
  CORE_REVISION="$(git rev-parse HEAD)" \
  SOURCE_DATE_EPOCH="$(git show -s --format=%ct HEAD)" \
  OUTPUT_DIR=dist/community
```

For an enhanced build, check out the enhanced module at the required revision as `pro_impl`, create the workspace, and pass both revisions explicitly:

```bash
go work init . ./pro_impl
task build:edition \
  APP_BUILD_TYPE=pro_selfhosted \
  CORE_REVISION="$(git rev-parse HEAD)" \
  ENHANCED_REVISION="$(git -C pro_impl rev-parse HEAD)" \
  SOURCE_DATE_EPOCH="$(git show -s --format=%ct HEAD)" \
  OUTPUT_DIR=dist/enhanced
```

The output directory must be absent or empty. This prevents stale files from entering a manifest.

## Artifact Contract

Each output directory contains:

| Path | Purpose |
|---|---|
| `semaphore-server` | Server executable |
| `semaphore-runner` | Runner executable |
| `web/` | Production frontend bundle without source maps or source-map references |
| `debug-source-maps/` | Source maps associated with the hashed production asset names; publish only to error-reporting tooling |
| `manifest.json` | Edition, revisions, source epoch, and SHA-256 digest of every product artifact |
| `sbom.spdx.json` | SPDX 2.3 inventory of Go build information and exact Production npm packages from `web/package-lock.json` |
| `provenance.json` | In-toto statement with SLSA provenance v1 predicate and artifact subjects |

Release containers expose the same identity through OCI labels:

- `io.semaphore.edition`
- `io.semaphore.core.revision`
- `io.semaphore.enhanced.revision`
- `org.opencontainers.image.revision`

Published container builds additionally request BuildKit SBOM and maximum provenance attestations.

## Reproducibility Decisions

The frontend is built once without source maps for the production directory and once with Webpack `hidden-source-map` for the debug directory.
Webpack includes source-map metadata in hashed asset names even when the bundle contains no source-map reference, so using a single hidden-map build would make equivalent output directories differ.
The build matches debug assets to production assets by SHA-256 digest, rewrites each map's `file` field to the production filename, and removes source maps plus their reference comments from the production tree.
This keeps browser-delivered files deterministic while retaining complete maps for error-reporting systems, as recommended by the [Webpack production source-map guidance](https://webpack.js.org/configuration/devtool/#production).

The SBOM parser reads the committed npm `packages` tree and excludes descriptors marked `dev` because npm defines those packages as strictly part of the development dependency tree.
Production and optional-production dependencies remain included, duplicate name-version pairs are collapsed, and package order plus SPDX identifiers are deterministic.
The lockfile is the input because npm documents it as the exact dependency-tree representation required for repeatable installs in the [package-lock format](https://docs.npmjs.com/cli/v7/configuring-npm/package-lock-json/#description).

## Runtime Verification

The authenticated `GET /api/info` response is authoritative for the running server.
It reports `edition`, `contract_version`, `implementation_version`, `core_revision`, the optional `enhanced_revision`, and the effective `features` payload.
The frontend uses that server edition after startup and embeds `data-edition` in the production document for pre-startup presentation.

CI verifies each edition by:

1. building the artifact directory twice and comparing it byte-for-byte;
2. loading the production bundle in Chromium and retaining a screenshot;
3. starting the server container with a temporary SQLite database;
4. authenticating and asserting the edition plus capability object returned by `/api/info`; and
5. starting the runner executable from its container image.

No workflow in this stage publishes or pushes an artifact.
