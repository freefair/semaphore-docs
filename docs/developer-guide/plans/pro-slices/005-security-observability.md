# Slice 005 — Enhanced Features Inherit Security and Observability Guards

A denied enhanced action produces a redacted audit event and measurable result without leaking secrets through logs, metrics, traces, or errors.

| Field | Value |
|---|---|
| Selection | F06 |
| Depends on | 003–004 |
| Primary paths | `api/helpers/event_log.go`, `db/Event.go`, logging middleware, metrics |
| Out of scope | SIEM delivery and tamper-evident audit chains |

## Implementation

- [ ] Define the authorization test matrix for anonymous, user, project role, and administrator callers.
- [ ] Define redaction allowlists for logs, errors, metrics labels, traces, and audit payloads.
- [ ] Standardize correlation, actor, action, target, outcome, and source context.
- [ ] Add dependency health, failure, latency, queue-depth, and dropped-record metrics.
- [ ] Provide secret tripwire fixtures reused by every later slice.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: permission and redaction matrices, including failure paths |
| Integration | Required: tripwire secrets remain absent from persisted logs and metrics |
| API | Required: allow/deny outcomes and correlation IDs for one representative route |
| UI | N/A: operator dashboards are delivered by later feature slices |

- [ ] Every enhanced slice can reuse the same auth, audit, and redaction harness.
- [ ] Denials are actionable without revealing protected values.
- [ ] Optional dependency failure does not report the entire service unhealthy.
