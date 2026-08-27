# Vault and OpenBao Runtime Secrets

Enhanced Edition can resolve one field from a Vault or OpenBao KV v2 secret when a task starts.
Semaphore persists only a value-free reference and does not browse, synchronize, or cache returned secret values.

[[toc]]

## Execution Boundary

A runtime reference contains the project-scoped storage ID, KV mount, path, optional version, and field name.
The canonical reference is stored with the access key or variable-group secret and is expanded into explicit fields at the API boundary.
No resolved value is added to the access-key row, task row, API response, audit event, or application log.

Task execution uses the existing access-key deserialization boundary.
Repository, inventory, and variable-group consumers therefore receive the resolved value only while preparing that task's execution payload.
A provider outage fails a task only if that task needs a reference from the unavailable provider.

Runtime providers are read-only in this slice.
Writing, synchronizing, or listing arbitrary remote values is documented separately by the managed-secret-storage delivery slice.

## Provider Configuration

Create a project provider with `POST /api/project/{project_id}/secret_storages`.
Vault uses type `vault`; OpenBao uses type `openbao`.

```json
{
  "project_id": 42,
  "name": "Team Vault",
  "type": "vault",
  "params": {
    "url": "https://vault.example.test",
    "namespace": "platform/team-a",
    "mount": "secret",
    "ca_certificate": "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
    "timeout": "5s",
    "auth_method": "approle",
    "auth_mount": "approle",
    "role_id": "semaphore-runtime"
  },
  "secret": "write-only-bootstrap-credential"
}
```

The server forces runtime providers to `readonly: true`, disables synchronization, and removes sync paths.
Configuration reads and write responses always return an empty `secret` field.
Omitting `secret` during an update preserves the existing bootstrap credential.

The URL must use HTTPS.
Plain HTTP is accepted only for `localhost` or a loopback IP, which supports isolated local testing without weakening remote-provider policy.
Embedded URL credentials, query strings, fragments, and non-root URL paths are rejected.
TLS verification cannot be disabled.
Use `ca_certificate` to trust a private CA.
Timeouts must be positive and no longer than 30 seconds; the default is five seconds.

## Authentication

The `auth_method` parameter accepts:

| Method | Non-secret parameters | Write-only credential |
|---|---|---|
| `token` | none | Vault/OpenBao token |
| `approle` | `role_id`, optional `auth_mount` (default `approle`) | AppRole secret ID |
| `kubernetes` | `role`, optional `auth_mount` (default `kubernetes`) | Service-account JWT |

Database-backed bootstrap credentials use Semaphore's access-key encryption path.
The existing environment-variable and file credential sources remain available when operators do not want the bootstrap credential in Semaphore's database.

AppRole and Kubernetes exchanges produce short-lived provider tokens.
Semaphore may retain those tokens until renewal or expiry and renew renewable tokens through `auth/token/renew-self`.
Static bootstrap tokens and returned KV values are not placed in that cache.

## Value-Free References

Access-key create and update payloads select a provider without reading its contents:

```json
{
  "project_id": 42,
  "name": "Deployment token",
  "type": "string",
  "source_storage_type": "vault",
  "source_storage_id": 7,
  "source_storage_mount": "secret",
  "source_storage_key": "applications/payments",
  "source_storage_version": 3,
  "source_storage_field": "deployment_token"
}
```

Version zero or an omitted version selects the provider's latest KV v2 version.
Mount and field names use a conservative identifier grammar.
Paths are relative, bounded, and reject empty, `.` and `..` segments.
The API rejects a reference accompanied by plaintext.

The UI exposes the same explicit fields and deliberately provides no arbitrary value browser.

## Connection Health and Errors

`POST /api/project/{project_id}/secret_storages/{storage_id}/test` performs an authenticated token self-lookup.
The response includes only storage ID, health state, check time, latency, token expiry, renewable status, and a bounded error category.

Error categories are `validation`, `capability_disabled`, `authentication`, `permission`, `tls`, `timeout`, `unavailable`, `response_invalid`, `response_too_large`, and `field_missing`.
Provider addresses, credentials, tokens, secret paths, remote response bodies, and dependency error strings are not included.

Requests do not follow redirects and response bodies are bounded.
The default response limit is 1 MiB and the maximum configurable limit is 4 MiB.

## Capability Lifecycle

The backend-authoritative capability ID is `runtime_secrets`.
Active state permits configuration reads, writes, connection tests, and task resolution.
Read-only state permits reads and existing-reference resolution but blocks configuration and reference changes.
Disabled state keeps configuration readable for rollback while blocking writes, connection tests, and all new resolution.
Community Edition reports the capability as unavailable and fails closed.

Administrators configure the state through `PUT /api/capabilities/runtime-secrets` with the same `state` and optional `expires_at` body used by other capability lifecycle endpoints.

## Verification

Run the contract, Core, Community, Enhanced, and UI layers with:

```bash
go test ./pro_interfaces ./services/server ./api/projects ./api -count=1
(cd pro && go test ./... -count=1)
(cd test/edition-contract/enhanced && go test ./... -count=1)
(cd web && NODE_OPTIONS=--localstorage-file=/tmp/semaphore-ui-test-localstorage \
  yarn test:unit tests/unit/runtime-secrets.spec.js tests/unit/lib/capabilities.spec.js)
```

Browser acceptance covers provider setup, a healthy connection, a successful value-free reference, a denied provider read, a disabled capability, and the responsive layout.
