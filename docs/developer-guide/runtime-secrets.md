# Vault and OpenBao Runtime Secrets

Enhanced Edition can resolve one field from a Vault or OpenBao KV v2 secret when a task starts.
An administrator can also opt into outbound synchronization for explicitly selected Semaphore keys.
Semaphore does not browse remote values, and its persisted references, fingerprints, operation history, API responses, audit events, and logs remain value-free.

[[toc]]

## Execution Boundary

A runtime reference contains the project-scoped storage ID, KV mount, path, optional version, and field name.
The canonical reference is stored with the access key or variable-group secret and is expanded into explicit fields at the API boundary.
No resolved value is added to the access-key row, task row, API response, audit event, or application log.

Task execution uses the existing access-key deserialization boundary.
Repository, inventory, and variable-group consumers therefore receive the resolved value only while preparing that task's execution payload.
A provider outage fails a task only if that task needs a reference from the unavailable provider.

New providers default to read-only runtime resolution.
Outbound synchronization is a separate, explicit direction and never changes runtime references into cached values.

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

The default `sync_direction` is `read_only`; the server then forces `readonly: true`, disables automatic synchronization, and removes any managed sync configuration.
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

## Managed Outbound Synchronization

Set `sync_direction` to `outbound` to allow selected local keys to be written to explicit KV v2 fields.
The feature supports Semaphore string, login/password, and SSH keys that are stored locally and do not already reference an external source.
Each mapping identifies one local access-key ID, mount, relative path, and field:

```json
{
  "project_id": 42,
  "name": "Team Vault",
  "type": "vault",
  "sync_direction": "outbound",
  "sync_enabled": false,
  "sync_interval": 0,
  "sync_paths": [
    {
      "access_key_id": 91,
      "mount": "secret",
      "path": "applications/payments",
      "field": "deployment_token"
    }
  ]
}
```

Manual synchronization is the primary workflow:

```http
POST /api/project/42/secret_storages/7/sync
Content-Type: application/json

{
  "request_id": "manual:018f2f41-c89d-7d3b-8a31-c50863d31b3f"
}
```

The request ID is idempotent within one sync configuration.
A durable operation record is created before provider access, and the worker leases one operation per configuration at a time.
The lease is renewed before provider reads and writes, and the claimed attempt fences both renewal and completion so a stale worker cannot commit after a reclaim.
An expired lease can be reclaimed after a worker interruption.
Provider writes use KV v2 `PATCH` with compare-and-set, so unrelated fields remain untouched and a retry cannot silently overwrite a newer remote version.

Successful paths retain only a SHA-256 content fingerprint and the resulting remote version.
The fingerprint detects local and remote changes without exposing either value.
Read-only providers are never enqueued for automatic synchronization and reject remote mutations at the provider boundary.

### Conflicts and explicit resolution

If the remote field or version changed since the last successful synchronization, the operation ends in `conflict` without writing.
The response and history identify the affected mapping and observed version but contain no value.
An administrator may create a new operation that explicitly confirms overwriting the exact observed versions:

```http
POST /api/project/42/secret_storages/7/sync
Content-Type: application/json

{
  "request_id": "manual:018f2f42-7771-7ea2-bfc4-d692d30d02c2",
  "resolve_operation_id": 314
}
```

The referenced operation must belong to the same project and storage, use the current synchronization-configuration revision, and still describe the current remote version.
A further remote change produces another conflict instead of applying a stale decision.

### Operation history

`GET /api/project/{project_id}/secret_storages/{storage_id}/sync/history?limit=25` returns newest-first durable operations.
Each entry includes status, attempt count, timestamps, changed/skipped/conflict counts, a bounded error category, and per-mapping outcomes containing only IDs, remote coordinates, version, status, and content fingerprint.
Provider response bodies and secret values are never returned.
Temporary encoded request and response buffers are zeroed after provider access.

Configuration create, update, and delete calls use the existing project permission and event-audit boundary.
Manual and scheduled synchronization is additionally audited by its durable operation record, including the requester for manual calls.
Scheduled operations have no requester identity and use deterministic minute-scoped request IDs.
Only outbound configurations with a positive interval are scheduled.

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

Browser acceptance covers read-only provider setup, a healthy connection, a successful value-free reference, manual outbound synchronization, conflict and explicit resolution, provider failure and recovery, and responsive light and dark layouts.
