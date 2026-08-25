# Slice 022 — Audit Webhook Export

An administrator can send a versioned, redacted audit stream to an HTTPS receiver and inspect whether each delivery succeeded.

| Field | Value |
|---|---|
| Selection | P05a |
| Depends on | 021 |
| Primary paths | audit event model, webhook client, delivery repository, admin API and UI |
| Out of scope | Payload signing and inbound replay protection, delivered by slice 073 |

## Implementation

- [ ] Extend the audit envelope with actor, action, target, outcome, source IP, user agent, correlation ID, and immutable occurrence time.
- [ ] Define an allow-listed export schema that omits secrets, tokens, raw task arguments, and unrestricted user content.
- [ ] Persist an outbox entry in the same transaction as the audited mutation and dispatch it after commit.
- [ ] Implement an HTTPS-only client with bounded timeouts, response-size limits, retry classification, exponential backoff, jitter, and a terminal failure state.
- [ ] Give every delivery a stable event ID so receiver-side deduplication remains possible before cryptographic signing is added.
- [ ] Provide permission-protected configuration, test delivery, pause/resume, and paginated delivery history workflows.
- [ ] Emit health metrics for queue age, attempts, successes, permanent failures, and redaction failures.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: schema mapping, allow-list redaction, retry classification, backoff bounds, and URL validation |
| Integration | Required: transactional outbox plus fake HTTPS receiver for timeout, retry, duplicate, oversized response, and recovery cases |
| API | Required: configuration, test, history, pause/resume, permission, and secret-write-only contracts |
| UI | Required: component tests plus browser evidence for setup, successful test, retrying delivery, and permanent failure |

- [ ] A committed audited action eventually has either a successful delivery or an inspectable terminal failure.
- [ ] Retrying never creates a different logical audit event ID.
- [ ] Endpoint credentials are write-only and absent from API responses, logs, and UI state.
