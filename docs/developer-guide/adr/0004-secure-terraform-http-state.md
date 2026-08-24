# ADR 0004: Encrypt and Version Terraform HTTP State

## Status

Proposed

## Date

2026-08-24

## Context

Terraform and OpenTofu state can contain credentials, generated passwords, infrastructure identifiers, and other sensitive values even when configuration variables are marked sensitive.
The repository already exposes Terraform inventory aliases, state models, routes, UI scaffolding, and an enhanced controller contract, while the Community implementation is a no-op.
The HTTP backend protocol also requires correct lock ownership and conflict behavior to prevent concurrent state corruption.

## Decision

Store state as append-only encrypted versions in SQL and keep alias metadata separate from encrypted payloads.
Authenticate each alias with an opaque scoped credential and store only a verifier when protocol compatibility permits it.
Implement protocol-correct GET, POST, DELETE, LOCK, and UNLOCK behavior with an atomic lock ID and holder metadata.
Require the matching lock ID for state updates and unlocks, except for an explicitly authorized and audited force-unlock.
Integrate retained state versions with the shared encryption-key rotation mechanism.

## Consequences

### Positive

- Database rows and backups do not expose plaintext state.
- Version history supports recovery from operator error or a bad apply.
- Atomic lock ownership prevents concurrent writers from silently overwriting one another.
- Access, mutation, recovery, and force-unlock actions can be audited consistently.

### Negative

- State size, retention, encryption throughput, and key rotation require operational limits.
- Protocol compatibility must be verified against real Terraform and OpenTofu clients.
- Authorized recovery needs a carefully constrained plaintext access path.

## Alternatives Considered

### Store Plaintext State in SQL

This is easier to inspect but exposes high-value secrets in primary storage and backups.

### Store State Only in an External Object Store

This can scale payload storage but introduces another required service and still needs metadata, locking, encryption, and consistency design.

### Omit Locking

This simplifies the endpoint but permits concurrent writers and does not meet safe HTTP backend behavior.
