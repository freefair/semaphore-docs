# Slice 056 — Notification Governance

An administrator can route selected task, workflow, approval, and system events to managed destinations and inspect the complete delivery history.

| Field | Value |
|---|---|
| Selection | E09 |
| Depends on | 022, 046 |
| Primary paths | notification model/outbox/service, destination API, delivery history UI |
| Out of scope | Provider-specific payloads and transport, delivered by slices 057–059 |

## Implementation

- [x] Define a versioned provider-neutral notification event with stable event ID, source, severity, lifecycle action, tenant scope, and allow-listed details.
- [x] Persist event and outbox state in the same transaction as the source mutation.
- [x] Model destinations, routing rules, event filters, severity thresholds, enabled state, and environment label with optimistic concurrency.
- [x] Enforce global and project role permissions for destination configuration, test sends, routing, and history access.
- [x] Define one logical incident key per source lifecycle so provider adapters can deduplicate trigger/update/resolve actions.
- [x] Dispatch with bounded attempts, exponential backoff and jitter, response limits, rate-limit awareness, and explicit terminal failure.
- [x] Store credentials encrypted and write-only; redact event fields and provider responses before persistence.
- [x] Provide configuration, routing preview, test send, pause/resume, retry, and paginated delivery-history UI.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: routing/filter matrix, incident key, redaction, retry/rate-limit decisions, and permission rules |
| Integration | Required: transactional outbox, worker restart, duplicate event, pause/resume, retry, and retention with a fake adapter |
| API | Required: destination/rule CRUD, preview/test/history/retry, write-only credentials, concurrency, and permission contracts |
| UI | Required: component tests plus browser evidence for routing setup, preview, test, retrying failure, and successful history |

- [x] A committed source event is either intentionally filtered or has an inspectable delivery outcome.
- [x] Retrying retains the same logical event and incident identity.
- [x] No destination secret or unrestricted provider response is returned to a browser or stored in logs.

## Verification Evidence

- Community, clean-room Enhanced, race, vet, web unit, production web build, migration, and documentation build gates pass.
- Live API and browser QA cover destination and rule create/edit, write-only credential preservation, typed preview, test enqueue, pause/resume, retry, and safe event and delivery histories.
- Desktop and `390x844` browser checks show no page-level horizontal overflow, usable stacked selectors and dialogs, and no browser console warnings or errors.
- A dedicated Terra review found no remaining reportable security findings; a duplicate local QA worker was isolated and removed before the final credential-preservation dispatch check.
