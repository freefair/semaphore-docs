# Audit Webhook Export

Audit webhook export sends a versioned, allowlisted audit stream from an Enhanced Edition installation to an administrator-controlled HTTPS receiver.
It uses a transactional outbox so a persisted audit event is never separated from its delivery record.

[[toc]]

## Delivery Architecture

The audit facade assigns a stable event ID and immutable UTC occurrence time before persistence.
It maps the event to both the canonical SQL audit record and the `semaphore.audit.v1` webhook envelope.
The SQL repository writes that audit record and its webhook outbox row in one transaction, then wakes the delivery worker only after commit.

The transaction covers the canonical audit record and its outbox row.
It does not retroactively include the domain mutation that caused the audit call.
Callers therefore continue to treat an audit write failure independently from the primary operation result, as described in [Enhanced Security and Observability Baseline](security-observability.md#audit-sinks-and-failure-behavior).

The worker polls every two seconds and claims at most 20 due rows with a 30-second lease.
A crashed worker can therefore leave a row temporarily in `delivering`, but a later worker reclaims it after the lease expires.
Delivery states are `pending`, `delivering`, `retrying`, `succeeded`, and `failed`.

## Wire Schema

Every request is an HTTP `POST` with `Content-Type: application/json` and this allowlisted envelope:

```json
{
  "schema_version": "semaphore.audit.v1",
  "event_id": "0123456789abcdef0123456789abcdef",
  "occurred_at": "2026-08-27T10:11:12Z",
  "actor": {
    "id": 7
  },
  "action": "project_runner_update",
  "target": {
    "type": "project_runner",
    "id": "runner:42",
    "project_id": 42
  },
  "outcome": "allowed",
  "source": "api",
  "source_ip": "192.0.2.10",
  "user_agent": "audit-client/1.0",
  "correlation_id": "abcdef0123456789abcdef0123456789",
  "reason": "active"
}
```

The event ID is 128 random bits encoded as 32 lowercase hexadecimal characters.
Retries reuse the same ID and occurrence time so the receiver can deduplicate deliveries.
Cryptographic signing and inbound replay protection remain out of scope until slice 073.

The actor ID and request metadata are omitted when unavailable.
`source_ip` is derived from the direct network peer rather than caller-controlled forwarding headers.
`user_agent` contains printable characters only and is limited to 256 UTF-8 bytes.

There are no generic metadata, request-body, response-body, header, raw error, task-argument, token, credential, or unrestricted user-content fields.
Adding a field requires an explicit schema-version decision and redaction tests.

## Receiver and Retry Contract

The endpoint must be an absolute HTTPS URL without embedded credentials or a fragment.
Semaphore does not follow redirects.
An optional credential is sent as `Authorization: Bearer <credential>`.
Each request has a five-second timeout, and response bodies are read only up to 64 KiB.

| Result | Delivery behavior |
|---|---|
| `2xx` | Mark `succeeded` |
| Network error or timeout | Retry |
| `408`, `425`, `429`, or `5xx` | Retry |
| Response larger than 64 KiB | Retry |
| `3xx` | Mark terminal `failed` |
| Other `4xx` | Mark terminal `failed` |
| Invalid endpoint or unavailable decryption key | Mark terminal `failed` with `configuration_error` |

Retry delay uses equal jitter over an exponentially growing interval, beginning at 500 milliseconds to one second and capped at 30 minutes to one hour.
The eighth failed attempt becomes terminal with `attempts_exhausted`.
Delivery history exposes only bounded reason codes, never raw dependency errors or response bodies.

## Administration API

All endpoints require an authenticated administrator session or API token and use the normal `/api` prefix.
Community Edition keeps the route shape but returns `404` because export is unavailable.

| Method and path | Purpose | Success response |
|---|---|---|
| `GET /api/audit-webhook` | Read non-secret configuration | `200` configuration |
| `PUT /api/audit-webhook` | Save endpoint and optionally replace or remove the credential | `200` configuration |
| `POST /api/audit-webhook/test` | Send and persist one test delivery immediately | `201` delivery |
| `POST /api/audit-webhook/pause` | Stop background delivery claims | `200` configuration |
| `POST /api/audit-webhook/resume` | Resume background delivery claims | `200` configuration |
| `GET /api/audit-webhook/deliveries?count=25&offset=0` | Read newest-first delivery history | `200` delivery array |

Configuration accepts at most one JSON object and rejects unknown fields.
The body is limited to 8 KiB.

```json
{
  "endpoint": "https://audit.example.test/semaphore",
  "credential": "replace-me"
}
```

Omitting `credential` preserves the existing value.
Sending an empty credential removes it.
The credential is limited to 4 KiB, uses Semaphore's option-encryption key path for storage, and is never returned by the API.
Set an option or access encryption key in deployments that require encrypted-at-rest option values; Semaphore's existing keyring compatibility behavior applies when encryption is disabled.

Configuration responses contain only `endpoint`, `credential_configured`, `paused`, and `updated_at`.
Delivery responses contain only the row ID, stable event ID, status, attempt count, scheduling timestamps, HTTP status, bounded failure reason, and delivery timestamp.
The serialized payload and credential never cross the administration API boundary.

Pagination defaults to 25 rows.
`count` must be between 1 and 100, and `offset` must be non-negative.
Invalid input returns `400`, an unconfigured pause, resume, or test operation returns `409`, unavailable Community behavior returns `404`, and internal failures return a stable `500` response.

## Administration UI

Enhanced Edition administrators open `/audit-webhooks` from the administration navigation.
The page configures the endpoint and write-only credential, sends a test, pauses or resumes delivery, and loads paginated history.

The credential input is cleared immediately after a successful save.
An explicit remove control is required to clear an existing credential.
Test delivery remains available while background delivery is paused so an administrator can validate a receiver before resuming the queue.

## Metrics

The Prometheus registry exposes:

- `semaphore_enhanced_queue_depth{queue="audit_webhook"}`;
- `semaphore_audit_webhook_oldest_queued_age_seconds`;
- `semaphore_audit_webhook_attempts_total`;
- `semaphore_audit_webhook_successes_total`;
- `semaphore_audit_webhook_permanent_failures_total`;
- `semaphore_audit_webhook_redaction_failures_total`;
- `semaphore_enhanced_dependency_healthy{dependency="audit_webhook"}`;
- `semaphore_enhanced_dependency_failures_total{dependency="audit_webhook"}`; and
- `semaphore_enhanced_dependency_latency_seconds{dependency="audit_webhook"}`.

Queue depth and age include `pending`, `retrying`, and leased `delivering` rows.
Webhook health is an optional dependency signal and does not change `/api/ping` readiness.

## Verification

Run the focused contract, repository, service, API, and UI tests with:

```bash
GOWORK=off go test ./pro_interfaces ./services/audit ./db/sql ./api -count=1
GOWORK=test/edition-contract/go.work go test github.com/semaphoreui/semaphore/pro/services/server -run AuditWebhook -count=1
cd web
NODE_OPTIONS=--localstorage-file=/tmp/semaphore-ui-test-localstorage yarn test:unit tests/unit/audit-webhooks.spec.js
```

Browser acceptance additionally covers initial setup, successful test delivery, a retrying delivery, a permanent failure, credential clearing, and the responsive history layout.
