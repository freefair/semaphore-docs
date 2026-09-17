# ADR 0004: Encrypt and Version Terraform HTTP State

## Status

Accepted

## Date

2026-08-24

## Context

Terraform and OpenTofu state can contain credentials, generated passwords, infrastructure identifiers, and other sensitive values even when configuration variables are marked sensitive.
The repository already exposes Terraform inventory aliases, state models, routes, UI scaffolding, and an enhanced controller contract, while the Community implementation is a no-op.
The HTTP backend protocol also requires correct lock ownership and conflict behavior to prevent concurrent state corruption.

## Decision

Store state as append-only encrypted versions in SQL and keep alias metadata separate from encrypted payloads.
Authenticate each alias with a project-scoped `login_password` access key. Its material remains encrypted at rest and the alias stores only the key reference.
Implement protocol-correct GET, POST, DELETE, LOCK, and UNLOCK behavior with an atomic lock ID and holder metadata.
Require the matching lock ID for HTTP backend state updates, deletes, and unlocks while a lock is active. Project resource managers may recover the current state through the authenticated management route, which still refuses deletion while a backend lock is active.
Integrate retained state versions with the shared encryption-key rotation mechanism.

## Upgrade Procedure

The backend refuses legacy unprefixed state rows once state encryption is enabled. Before enabling an alias on an existing installation, add the active access encryption key, run `semaphore vault rekey`, and then run `semaphore vault check`. Rekey encrypts every retained state version and stamps the active key ID; check reports legacy or unavailable-key rows so a retired key is not removed while any historical state still references it. The procedure retains state history and never falls back to plaintext serving.

## Consequences

### Positive

- Database rows and backups do not expose plaintext state.
- Version history supports recovery from operator error or a bad apply.
- Atomic lock ownership prevents concurrent writers from silently overwriting one another.
- HTTP backend state updates and recovery actions follow the project resource-management authorization boundary.

### Negative

- State size, retention, encryption throughput, and key rotation require operational limits.
- Protocol compatibility must be verified against real Terraform and OpenTofu clients.
- Authorized recovery needs project resource-management access and exposes plaintext only through the scoped management route.

## Alternatives Considered

### Store Plaintext State in SQL

This is easier to inspect but exposes high-value secrets in primary storage and backups.

### Store State Only in an External Object Store

This can scale payload storage but introduces another required service and still needs metadata, locking, encryption, and consistency design.

### Omit Locking

This simplifies the endpoint but permits concurrent writers and does not meet safe HTTP backend behavior.
