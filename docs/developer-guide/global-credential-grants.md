# Global Credential Grants

Enhanced Edition can keep one reusable credential at global scope and grant selected projects permission to reference it without copying or disclosing the value.
Authorized workflow tasks resolve the current credential version only at dispatch time and retain value-free usage provenance.

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
| `consume` (`2`) | The runtime resolver may consume the credential immediately before an authorized task dispatch. |

A project selection is effective only when the credential is enabled, the grant is active, the `reference` operation is present, and the expiry is strictly later than the server's current UTC time.
Revocation and disable are reversible.
Grant deletion requires the grant to be revoked first.
Credential deletion requires the credential to be disabled and every grant to be deleted.

## Execution-Time Resolution

Workflow secret parameters can allow either a project access key or a global credential reference.
A global selection is persisted on the task as a private map from parameter name to credential ID; the task row, workflow snapshot, task API, and runner-visible task DTO never contain the value.

The resolver performs the following steps immediately before local execution or authenticated runner dispatch:

1. Validate the task, actor, template, and binding identities.
2. Require the executable `runtime_secrets` capability, current template-run permission, and `project.credentials.granted.consume`.
3. Re-read the enabled credential, its current immutable version, and the active unexpired project grant with `consume` permission.
4. Resolve local encrypted material or the configured external provider reference.
5. Repeat the authorization and version checks so a concurrent revoke, disable, expiry, or rotation wins before dispatch.
6. Persist a value-free audit record before injecting through the task-only secret channel.

An actorless scheduled or integration task cannot consume a global credential.
It is recorded with `actor_id: 0`, outcome `denied`, and reason `actor_required`, then becomes `blocked` without dispatch.
Other authorization, provider, audit, or injection failures also block the task with a stable remediation message that contains no provider response or credential coordinates.

## Global Vault and OpenBao Providers

External global credentials use a provider registry that is independent from project `SecretStorage` records.
The configuration contains connection and authentication metadata only:

```yaml
global_credential_providers:
  primary:
    type: openbao
    url: https://openbao.example.invalid
    namespace: platform
    ca_certificate: |-
      -----BEGIN CERTIFICATE-----
      ...
      -----END CERTIFICATE-----
    timeout: 5s
    max_response_bytes: 1048576
    auth_method: approle
    auth_mount: approle
    role_id: semaphore-runtime
```

Bootstrap material never belongs in the configuration.
The provider ID is normalized to one deterministic process environment variable: `primary` reads `SEMAPHORE_GLOBAL_CREDENTIAL_PROVIDER_PRIMARY_CREDENTIAL`.
Token authentication supplies the token, AppRole supplies the Secret ID, and Kubernetes authentication supplies the service-account JWT through that variable.
Invalid provider IDs, environment-name collisions, unsafe addresses or auth mounts, missing bootstrap material, and provider failures all fail closed.
Only loopback providers may use plain HTTP; non-loopback providers require HTTPS.

## Permission Boundaries

Credential permissions are independent from legacy system and project-resource permissions.

| Permission | Scope | Allows |
|---|---|---|
| `global.credentials.metadata.manage` | Global | Detailed metadata reads, display-name changes, enable/disable, and guarded deletion. |
| `global.credentials.rotate` | Global | Rotation with new write-only material. |
| `global.credentials.grant` | Global | Grant listing, creation, update, revoke, restore, deletion, and the project selector capped at 200 ID/name entries. |
| `project.credentials.granted.list` | Project | Listing and selecting safe granted metadata for that project. |
| `project.credentials.granted.consume` | Project | Execution-time consumption after current task and grant authorization succeeds. |

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

Usage and impact routes expose only the immutable IDs, version/fingerprint provenance, actor, runner, dispatch generation, outcome, reason, and time:

| Route | Permission | Purpose |
|---|---|---|
| `GET /api/global-credentials/{credential_id}/usage` | `global.audit.read` | Newest-first history with bounded `count`, cursor, project, task, and outcome filters |
| `GET /api/global-credentials/{credential_id}/impact` | Any global credential administration or audit permission | Value-free usage, project, active-grant, and last-used preview |
| `GET /api/project/{project_id}/tasks/{task_id}/credential-usage` | Existing task-view authorization | Task-scoped redacted credential provenance |

## Audit Contract

Create, rotate, grant, revoke, restore, disable, enable, grant deletion, and credential deletion attempts produce bounded audit actions.
Targets contain only a stable credential or grant ID.
Outcomes distinguish allowed, denied, and failed attempts without request bodies, material, external paths, or provider responses.

The append-only usage ledger has no task, user, grant, or credential lifecycle foreign keys.
Deleting one of those live records therefore cannot erase historical resolution provenance.
Exact credential values are redacted before WebSocket output, database task logs, structured summaries, workflow artifacts, notification-derived messages, and runner progress uploads.
The redactor covers raw and Go JSON-escaped representations produced by controlled transports.
It cannot promise to recognize arbitrary transformations deliberately performed by task code, such as hashing, encoding, splitting, or encryption; operators must still treat task code and artifact declarations as part of the secret-handling boundary.

Project metadata reads are audited against the project-scoped grant target.
Denied delegated permission checks use the same value-free route descriptors.

## UI Integration

Global administration is isolated behind Enhanced-only navigation instead of modifying shared Community screens.
Controls are rendered from independent global administration and audit permissions, and local material fields are cleared immediately after every submit attempt.
Rotation, grant changes, disable, and deletion show the current value-free impact preview before the action.
The existing task details surface shows credential version provenance and denied-resolution remediation without revealing material or provider paths.

The existing project Key Store gains one `Granted` tab.
It lists and selects only the project DTO and does not persist a runnable workflow reference or resolve a value.
The existing workflow secret-parameter selector can persist that value-free reference on a run and task; it never resolves material in the browser or workflow service.
Guests without `project.credentials.granted.list` receive an explicit permission explanation and no metadata request is made.

## Verification

Verification covers encryption-required local persistence, local and external execution-time resolution, immediate revoke and rotation races, provider outage, exact-value redaction, two-project isolation, operation and expiry filtering, optimistic-concurrency races, reversible transitions, deletion dependencies, permission separation, value-free audit/history/impact APIs, and browser flows for delegated administrators and project roles.

Run the focused layers with:

```bash
go test ./api ./api/runners ./db/sql ./services/tasks ./services/runners -run 'GlobalCredential|Redact'
go test -race ./api ./db/sql ./services/tasks -run 'GlobalCredential|Redact'
GOWORK="$PWD/test/edition-contract/go.work" \
  go test ./test/edition-contract/enhanced/services/server -run GlobalCredential
(cd web && yarn test:unit tests/unit/global-credentials.spec.js tests/unit/workflow-parameters.spec.js --runInBand)
```
