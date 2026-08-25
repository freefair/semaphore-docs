# Slice 056 — Notification Governance

An administrator can route selected task, workflow, approval, and system events to managed destinations and inspect the complete delivery history.

| Field | Value |
|---|---|
| Selection | E09 |
| Depends on | 022, 046 |
| Primary paths | notification model/outbox/service, destination API, delivery history UI |
| Out of scope | Provider-specific payloads and transport, delivered by slices 057–059 |

## Implementation

- [ ] Define a versioned provider-neutral notification event with stable event ID, source, severity, lifecycle action, tenant scope, and allow-listed details.
- [ ] Persist event and outbox state in the same transaction as the source mutation.
- [ ] Model destinations, routing rules, event filters, severity thresholds, enabled state, and environment label with optimistic concurrency.
- [ ] Enforce global and project role permissions for destination configuration, test sends, routing, and history access.
- [ ] Define one logical incident key per source lifecycle so provider adapters can deduplicate trigger/update/resolve actions.
- [ ] Dispatch with bounded attempts, exponential backoff and jitter, response limits, rate-limit awareness, and explicit terminal failure.
- [ ] Store credentials encrypted and write-only; redact event fields and provider responses before persistence.
- [ ] Provide configuration, routing preview, test send, pause/resume, retry, and paginated delivery-history UI.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: routing/filter matrix, incident key, redaction, retry/rate-limit decisions, and permission rules |
| Integration | Required: transactional outbox, worker restart, duplicate event, pause/resume, retry, and retention with a fake adapter |
| API | Required: destination/rule CRUD, preview/test/history/retry, write-only credentials, concurrency, and permission contracts |
| UI | Required: component tests plus browser evidence for routing setup, preview, test, retrying failure, and successful history |

- [ ] A committed source event is either intentionally filtered or has an inspectable delivery outcome.
- [ ] Retrying retains the same logical event and incident identity.
- [ ] No destination secret or unrestricted provider response is returned to a browser or stored in logs.
