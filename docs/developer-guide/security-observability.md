# Enhanced Security and Observability Baseline

Every enhanced feature uses the same typed audit boundary, server-owned correlation IDs, bounded metrics labels, and tripwire fixtures. The boundary is deliberately constructive: callers provide only approved context fields, so request bodies and raw dependency errors never enter an observable sink and do not need best-effort cleanup afterward.

## Authorization Matrix

The `lifecycle_test` route is the representative contract. Project roles do not grant global enhanced permissions; a project manager remains a non-administrator for this capability.

| Caller | Authentication | Active enhanced capability | Community provider | Audit outcome |
|---|---|---|---|---|
| Anonymous | no session or API token | `401` | `401` | `denied`, reason `unauthenticated` |
| Authenticated user | opaque session or API token | `403` | `404` | `denied`, reason `insufficient_permission` or `provider_unavailable` |
| Project role | authenticated project member | `403`; project role does not elevate global access | `404` | same as authenticated user |
| Administrator | authenticated administrator | allowed according to the capability state and requested access | `404` | `allowed` or lifecycle-specific denial |

The backend applies authentication, administrator/project permission, and capability access independently. UI visibility is never accepted as authorization evidence. Admin-only configuration is audited by middleware before the controller; read, write, and execute decisions are audited at the capability guard.

Project runner routes apply the same boundary with project-scoped permissions. They add the typed actions `project_runner_list`, `project_runner_read`, `project_runner_create`, and `project_runner_registration_issue`, plus the `project_runner` target type. Target IDs are restricted to `project:<positive integer>` and `runner:<positive integer>`; names, tags, registration material, and request bodies cannot enter the audit record. Each project-runner event carries the requested positive `project_id`, and a `project:<id>` target must match it. Cross-project lookups return `404` and record a denied result under the requested project without disclosing the runner's origin project.

## Standard Context

`pro_interfaces.AuditEvent` contains the reusable fields:

| Field | Meaning | Source |
|---|---|---|
| `correlation_id` | One server-generated request identifier | 128 random bits, emitted as 32 lowercase hexadecimal characters |
| `actor_id` | Authenticated database user ID, omitted for anonymous calls | Authentication context |
| `project_id` | Positive project scope for project-runner events; omitted for global capability events | Authorized request project |
| `action` | Typed operation such as `capability_write` | Route/service constant |
| `target_type` | Typed resource family | Route/service constant |
| `target_id` | Allowlisted non-secret identifier | Domain constant |
| `outcome` | `allowed`, `denied`, or `failure` | Enforcement result |
| `source` | `api` or `worker` | Execution boundary |
| `reason` | Stable allowlisted reason code | Enforcement result |

The server ignores an incoming `X-Request-ID` and returns its own value in that header. This prevents a caller from smuggling protected material into logs or audit storage through a syntactically valid correlation value.

`AuditEvent.Validate` rejects unknown actions, targets, outcomes, sources, and reasons. A later slice extends those enums when it introduces a new operation; it does not pass user-controlled strings through the existing fields.

## Redaction Allowlists

Observable surfaces accept the following data and nothing else:

| Surface | Allowed data | Explicitly excluded |
|---|---|---|
| Audit database payload | Standard context above | Request/response bodies, credentials, raw errors, headers |
| Structured file event | Standard context above plus existing numeric project/integration IDs | Domain values, connection details, raw errors |
| Application logs | `AuditEvent.SafeFields()` only | Error strings and arbitrary request fields |
| HTTP errors | Stable codes such as `CAPABILITY_DENIED`, `CAPABILITY_INPUT_INVALID`, and `CAPABILITY_OPERATION_ERROR` | Validation input and dependency messages |
| Metrics labels | Typed action/outcome/source, dependency, queue, sink, and drop reason | Actor, correlation, target ID, body values, error text |
| Trace attributes | `AuditEvent.SafeFields()` only when tracing is added | Span events containing bodies, credentials, or raw errors |

Semaphore does not currently configure a trace exporter. The allowlist is still part of the contract so a later exporter cannot expand the data surface implicitly.

## Audit Sinks and Failure Behavior

`services/audit` writes the same JSON payload to the SQL `event` repository and the edition's `LogWriteService`. SQL events use object type `capability` or `project_runner_audit`. Project-runner events for an existing project populate the existing project column in both sinks, so project membership scopes event-feed visibility; global capability events deliberately retain a null project. Anonymous attempts against a nonexistent project remain as unscoped `project_runner_audit` rows for operational review but are excluded from ordinary authenticated user feeds. Both sinks are attempted independently: failure of one does not suppress the other, and the caller receives only `audit persistence failed`, never the underlying message.

An audit write failure does not change the primary allow/deny HTTP result. It emits safe structured context and increments sink-specific metrics. Operators can diagnose which sink failed without exposing the failed record.

## Metrics

The application registry exposes:

- `semaphore_enhanced_actions_total{action,outcome,source}`;
- `semaphore_enhanced_dependency_healthy{dependency}`;
- `semaphore_enhanced_dependency_failures_total{dependency}`;
- `semaphore_enhanced_dependency_latency_seconds{dependency}`;
- `semaphore_enhanced_queue_depth{queue}`; and
- `semaphore_enhanced_dropped_records_total{sink,reason}`.

Dependency and queue labels are fixed enums. Optional dependency failure changes only its dependency gauge and counters; `/api/ping` remains healthy. A later feature with a required dependency must define its readiness effect explicitly instead of reusing this optional behavior by accident.

## Reusable Tripwire Harness

Tests import `test/securityfixtures`. `TripwireValues` provides recognizable fake protected values, and `AssertTripwiresAbsent` checks HTTP error bodies, captured logs, serialized audit records, and Prometheus exposition together. Every later enhanced slice adds its values to the input and failure paths and applies the same assertion to every observable output.

The baseline tests cover:

- the anonymous/user/project-role/administrator permission matrix;
- server-owned correlation IDs;
- allowlisted audit validation and safe log/trace fields;
- a denied API action persisted to SQL and the file-sink boundary;
- raw dependency failures reduced to stable errors and bounded metrics; and
- optional dependency failure without global health failure.
