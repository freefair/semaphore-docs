# ADR 0009: Store Initial Bounded Artifacts in SQL

## Status

Proposed

## Date

2026-08-25

## Context

Selected workflow features need binary artifacts with checksums, provenance, retention, access control, and availability from every HA node.
Choosing a particular external object-store product would add an undeclared deployment dependency.
Using node-local files would make artifacts unavailable after node replacement and inconsistent across active-active instances.

## Decision

Introduce an artifact-store interface and implement the first production backend as bounded SQL content plus immutable metadata.
Stream data with per-artifact and per-run limits, verify SHA-256 during upload, and expose content only after metadata and bytes are committed consistently.
Use the existing supported SQL databases as shared durable authority for all nodes.

Keep the interface suitable for a future external object backend, but do not select or require one in this delivery plan.
Treat moving to external storage as a later ADR with measured artifact volume, database impact, availability, backup, and licensing evidence.

## Consequences

### Positive

- The initial feature works on every supported deployment without a new service.
- Active-active nodes share the same content and authorization transaction boundary.
- Backup, restore, retention, and provenance start from one consistent authority.
- Product limits keep the operational cost explicit and testable.

### Negative

- Artifact volume increases database size, backup duration, and replication traffic.
- Strict size and retention limits are required.
- Large-artifact workloads may later require an external object backend and migration tooling.

## Alternatives Considered

### Store Artifacts on Node-Local Filesystems

This is simple for one node but fails HA access, node replacement, and consistent backup requirements.

### Require an S3-Compatible Service Immediately

This scales content independently but adds credentials, availability, lifecycle, backup, and deployment decisions not selected by the user.

### Store Only Artifact Metadata

This does not deliver safe artifact upload, download, retention, or integrity verification.
