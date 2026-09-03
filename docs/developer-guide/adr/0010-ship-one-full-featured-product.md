# ADR 0010: Ship One Full-Featured Product

## Status

Accepted

## Date

2026-09-03

## Context

The original clean-room plan preserved separate Community and enhanced builds and expected a commercial subscription provider to decide which features were available.
This repository now owns the selected full-feature implementation and does not ship a Community product variant.
Keeping build selectors, subscription routes, upgrade UI, and user quotas would create inactive product paths that can disagree with the implementation actually shipped.

Feature inclusion is distinct from operational enablement.
Some features depend on administrator choice or external infrastructure and must remain easy to disable without reintroducing licenses or product tiers.

## Decision

Ship exactly one full-featured product build.
The committed Go Workspace always selects the repository-contained clean-room module, and supported CI, release, server-container, and runner-container paths use that workspace without an edition argument.

Remove commercial subscription services, activation routes, validation jobs, plan-based feature resolution, subscription quotas, upgrade UI, and Pro-user controls from the shipped runtime.
Retain the existing module seam and disabled implementation only as unwired compatibility scaffolding for upstream synchronization and contract tests.

All implemented features are included without entitlement checks.
Ordinary configuration, backend-authoritative capability lifecycle, authorization, permissions, and safety policies may still disable behavior and hide irrelevant UI.
Unimplemented features remain absent rather than appearing as locked or purchasable options.

## Consequences

### Positive

- Every supported build has one deterministic feature implementation.
- Direct API use and background work follow the same authorization and configured capability decisions as the UI.
- The product no longer presents upgrade, trial, billing, or quota states that cannot be satisfied.
- The upstream module boundary remains available without carrying two shipped product editions.

### Negative

- The historical Community compatibility suite is no longer a release artifact test.
- Compatibility metadata still uses `enhanced` until the public response contract can be versioned independently.
- New optional features need an explicit enablement design when always-on behavior would be noisy or require unavailable infrastructure.

## Alternatives Considered

### Keep Dual Builds and Replace Only the Subscription Provider

This preserves the original plan but retains two product identities and leaves build-time edition gates able to diverge from runtime capabilities.

### Make Every Included Feature Always Active

This removes all switches but forces operators to expose integrations and UI they may not configure or use.
It also conflates product inclusion with operational readiness.

### Move All Full-Feature Code into the Root Module

This removes the module seam but creates the largest upstream synchronization burden.
The committed workspace provides one product build without requiring that migration.
