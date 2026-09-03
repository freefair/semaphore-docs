# Reproducible Full-Product Builds

Semaphore ships one full-featured product build from this repository.
There is no Community artifact, commercial subscription provider, license activation, or product-tier selection in the supported build and release paths.

## Contents

- [Module Selection](#module-selection)
- [Local Build](#local-build)
- [Artifact Contract](#artifact-contract)
- [Runtime Configuration](#runtime-configuration)
- [Verification](#verification)
- [HA Release Gate](#ha-release-gate)

## Module Selection

The application keeps the replaceable Go module path `github.com/semaphoreui/semaphore/pro` to preserve the existing upstream integration boundary.
The committed root `go.work` always resolves that path to `test/edition-contract/enhanced`, which is the clean-room full-feature implementation contained in this repository.
The disabled module under `pro/` remains only as unwired compatibility scaffolding for contract tests; no supported build selects it.

Core and full-feature implementation metadata use the same source revision.
The authenticated `GET /api/info` response retains `edition: enhanced`, `core_revision`, `enhanced_revision`, and `implementation_version` as compatibility metadata.
These fields do not select features or authorize operations.

## Local Build

Install dependencies and build the product with:

```bash
task deps
task build
```

Build traceable release artifacts with:

```bash
task build:edition \
  CORE_REVISION="$(git rev-parse HEAD)" \
  ENHANCED_REVISION="$(git rev-parse HEAD)" \
  SOURCE_DATE_EPOCH="$(git show -s --format=%ct HEAD)" \
  OUTPUT_DIR=dist/product
```

`build:edition` keeps its historical task name for automation compatibility, but it has no edition input and always builds the full product.
The output directory must be absent or empty so stale files cannot enter a manifest.

## Artifact Contract

Each output directory contains:

| Path | Purpose |
|---|---|
| `semaphore-server` | Server executable |
| `semaphore-runner` | Runner executable |
| `web/` | Production frontend bundle without source maps or source-map references |
| `debug-source-maps/` | Source maps for error-reporting tooling; never publish them with the application |
| `manifest.json` | Compatibility metadata, source revision, source epoch, and SHA-256 digest of every product artifact |
| `sbom.spdx.json` | SPDX 2.3 inventory of Go and production npm dependencies |
| `provenance.json` | In-toto statement with SLSA provenance v1 predicate and artifact subjects |

Release containers expose the same source identity through OCI labels.
`io.semaphore.edition` remains the constant value `enhanced` for compatibility; it is not a configurable build argument.

## Runtime Configuration

Feature inclusion and feature enablement are separate concerns.
Every implemented feature is present without an entitlement check, while ordinary configuration and capability lifecycle controls may disable optional, noisy, or external-infrastructure-dependent behavior.
Authorization, role permissions, safety policies, and operational lifecycle states remain enforced independently of product inclusion.

The frontend does not receive a build-type or edition environment variable.
It uses authenticated backend capability and configuration responses to decide whether an optional surface is relevant.

## Verification

The `Full Product Build` workflow:

1. tests the root and clean-room full-feature modules;
2. builds the artifact directory twice and compares it byte-for-byte;
3. loads the production bundle in Chromium and retains a screenshot;
4. builds and starts the server and runner containers;
5. authenticates and verifies the compatibility metadata plus feature response from `/api/info`; and
6. uploads the product artifacts, browser evidence, SBOM, and provenance.

Beta and release workflows use the same committed workspace and container definitions.
They do not fetch a separate proprietary module and do not accept an edition selector.

## HA Release Gate

The `HA resilience contract` job builds a `.git`-free context from the same committed full-product source.
It starts two compatible but visibly skewed application builds with shared PostgreSQL and Redis, an NGINX proxy, and a real runner.

The gate injects node pause, kill, network partition, Redis restart, database loss, runner reconnect, and a drained rolling replacement.
It fails unless the API remains available where specified, readiness fails closed on SQL loss, coordinated work degrades safely on Redis loss, every accepted write converges, audit history remains continuous, and no duplicate schedule, task, workflow-node, or approval decision exists.

The machine-readable result is uploaded as `ha-resilience-<source-sha>` from `dist/ha-resilience/report.json` and retained for 14 days.
The operator procedures and report acceptance fields are documented in [High Availability](../admin-guide/ha.md#operator-runbooks).
