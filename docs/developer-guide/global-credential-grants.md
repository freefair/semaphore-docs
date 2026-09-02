# Global Credential Grants

Enhanced Edition can keep one reusable credential at global scope and grant selected projects permission to reference it without copying or disclosing the value.
Runtime resolution and task injection are intentionally outside this contract and are added by the credential-resolution layer.

[[toc]]

## Domain Boundary

A global credential has stable metadata, an immutable current version, and zero or more explicit project grants.
It does not reuse project access keys or project secret-storage records because those records are tenant-scoped and must never become a cross-project authority.

The first supported credential type is `string`.
Additional material shapes require a versioned contract extension rather than an arbitrary JSON payload.

Each version stores exactly one material source:

- `local_encrypted` stores ciphertext produced by the configured option-encryption key.
- `external_reference` stores a value-free Vault or OpenBao provider identity, mount, path, version, and field.

Local material is rejected when option encryption is unavailable.
External references are validated but not resolved in this layer.
API responses never contain local plaintext, ciphertext, or a resolved external value.

## Immutable Versions and Fingerprints

Create writes version 1 and rotate appends the next immutable version in the same transaction that advances `current_version`.
Both operations generate a random 256-bit hexadecimal fingerprint.
The fingerprint identifies a version but is not derived from its value, so it cannot support offline guessing of low-entropy credentials.

Metadata updates, enabled-state transitions, rotations, grant updates, and deletions use optimistic revisions.
A stale request returns HTTP `409` and cannot overwrite a newer decision.

## Project Grants

One grant joins one credential to one project.
The database enforces one grant per credential/project pair, and the grant contains an operation mask, optional UTC expiry, status, and independent revision.

The operations are:

| Operation | Meaning |
|---|---|
| `reference` (`1`) | The project may list and select value-free metadata. |
| `consume` (`2`) | The runtime resolver may consume the credential after the resolution layer is enabled. |

A project selection is effective only when the credential is enabled, the grant is active, the `reference` operation is present, and the expiry is strictly later than the server's current UTC time.
Revocation and disable are reversible.
Grant deletion requires the grant to be revoked first.
Credential deletion requires the credential to be disabled and every grant to be deleted.

## Permission Boundaries

Credential permissions are independent from legacy system and project-resource permissions.

| Permission | Scope | Allows |
|---|---|---|
| `global.credentials.metadata.manage` | Global | Detailed metadata reads, display-name changes, enable/disable, and guarded deletion. |
| `global.credentials.rotate` | Global | Rotation with new write-only material. |
| `global.credentials.grant` | Global | Grant listing, creation, update, revoke, restore, deletion, and the project selector capped at 200 ID/name entries. |
| `project.credentials.granted.list` | Project | Listing and selecting safe granted metadata for that project. |
| `project.credentials.granted.consume` | Project | Runtime consumption after the resolution layer is present. |

Creating a credential requires both metadata-management and rotation permission because the request creates metadata and its first material version atomically.
Any one of the three global credential permissions permits the summary list needed by a delegated administrator.
Only metadata-management permission permits the detailed view containing owner attribution and an external provider reference.

The grant target selector returns only project `id` and `name`.
It is protected by `global.credentials.grant` and does not broaden the existing project-list or system-management permissions.

## API Views and Redaction

The global summary contains ID, type, display name, enabled state, revision, current version, material kind, and opaque fingerprint.
It omits owner attribution, timestamps, external provider coordinates, ciphertext, and plaintext.

The project view is narrower still.
It contains credential ID, type, display name, current version, allowed operations, grant ID, grant revision, and optional expiry.
It omits owner, fingerprint, material kind, provider identity, mount, path, field, and all credential content.

Create and rotate accept write-only material:

```json
{
  "type": "string",
  "display_name": "Container registry",
  "material": {
    "string_value": "write-only-value"
  }
}
```

An external reference uses the same mutually exclusive material field:

```json
{
  "type": "string",
  "display_name": "Deployment token",
  "material": {
    "external_reference": {
      "provider": "openbao",
      "provider_id": "primary",
      "mount": "secret",
      "path": "applications/payments",
      "version": 3,
      "field": "deployment_token"
    }
  }
}
```

The response contains only the global summary.
Metadata updates cannot carry material, and rotation cannot change metadata.

## Audit Contract

Create, rotate, grant, revoke, restore, disable, enable, grant deletion, and credential deletion attempts produce bounded audit actions.
Targets contain only a stable credential or grant ID.
Outcomes distinguish allowed, denied, and failed attempts without request bodies, material, external paths, or provider responses.

Project metadata reads are audited against the project-scoped grant target.
Denied delegated permission checks use the same value-free route descriptors.

## UI Integration

Global administration is isolated behind Enhanced-only navigation instead of modifying shared Community screens.
Controls are rendered from the three independent global permissions, and local material fields are cleared immediately after every submit attempt.

The existing project Key Store gains one `Granted` tab.
It lists and selects only the project DTO and does not persist a runnable workflow reference or resolve a value.
Guests without `project.credentials.granted.list` receive an explicit permission explanation and no metadata request is made.

## Verification

Verification covers encryption-required local persistence, external-reference redaction, two-project isolation, operation and expiry filtering, optimistic-concurrency races, reversible transitions, deletion dependencies, permission separation, value-free audit events, API body bounds, and browser flows for delegated administrators and project roles.

Run the focused layers with:

```bash
go test ./api ./db/sql -run 'TestGlobalCredential'
go test -race ./api ./db/sql -run 'TestGlobalCredential'
GOWORK="$PWD/test/edition-contract/go.work" \
  go test ./test/edition-contract/enhanced/services/server -run GlobalCredential
(cd web && yarn test:unit tests/unit/global-credentials.spec.js --runInBand)
```
