# ADR 0001: Preserve the Replaceable Enhanced Module Boundary

## Status

Proposed

## Date

2026-08-24

## Context

The Community repository imports `github.com/semaphoreui/semaphore/pro`, maps that module to the local Community no-op implementation, and uses a Go Workspace in official enhanced builds to replace it with a private module.
Shared database types, routes, UI surfaces, and `pro_interfaces` contracts already cross this seam.
Moving all enhanced behavior into the Community module would make upstream synchronization and disabled-feature behavior harder to reason about.
An independent implementation also needs a clear clean-room boundary because the official Pro and Enterprise implementation is proprietary.

## Decision

If an independent enhanced edition is selected, implement it as a separate Go module that satisfies the existing public contracts and is selected through the existing Go Workspace replacement mechanism.
Keep shared domain types, schema migrations, route registration, and Community-safe behavior in the root repository.
Keep enhanced repositories, orchestration, entitlement resolution, and external-provider clients in the enhanced module.
Build both variants from an explicitly pinned pair of core and enhanced-module commits.

## Consequences

### Positive

- Community builds remain independent of private credentials and enhanced source.
- Contract tests can detect drift between core, Community no-op, and enhanced implementations.
- Custom enhanced work remains isolated from upstream Community synchronization.
- Source provenance and clean-room review have a concrete module boundary.

### Negative

- Every public contract change must be coordinated across two modules.
- CI, release provenance, dependency scanning, and compatibility testing must include both revisions.
- Some cross-edition schema and UI work still lands in the root repository.

## Alternatives Considered

### Implement Enhanced Behavior Directly in `pro/`

This reduces module wiring but mixes Community and enhanced behavior and increases accidental feature leakage risk.

### Move All Enhanced Behavior into Community Core

This eliminates edition replacement but creates the largest upstream merge burden and changes the product boundary.

### Run Enhanced Features as a Separate Network Service

This provides strong process isolation but requires a new authenticated protocol, distributed transactions, deployment topology, and failure model that the current architecture does not have.
