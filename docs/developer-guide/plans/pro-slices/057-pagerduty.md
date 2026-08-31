# Slice 057 — PagerDuty Delivery

A routed failure opens or updates one PagerDuty alert, and a later recovery resolves that same alert with traceable delivery state.

| Field | Value |
|---|---|
| Selection | E09 |
| Depends on | 056 |
| Primary paths | PagerDuty client/adapter, destination validation, delivery UI |
| Out of scope | PagerDuty account administration and arbitrary REST API access |

## Implementation

- [x] Implement a PagerDuty client adapter for Events API v2 using the region-aware events base URL and a write-only routing key.
- [x] Map trigger and resolve lifecycle actions to the same stable `dedup_key` and use the provider's Common Event Format fields.
- [x] Bound summary, source, component, group, class, and custom details before transport.
- [x] Treat successful enqueue separately from later incident handling and retain the provider response status without exposing the routing key.
- [x] Classify validation, authentication, rate-limit, timeout, and server responses into retryable or terminal outcomes.
- [x] Validate configuration with a controlled test event that is clearly labeled and can be resolved using its returned identity.
- [x] Show routing region, redacted key state, logical incident key, last provider result, retry state, and resolution history.
- [x] Verify the contract against the official [Events API v2 guidance](https://support.pagerduty.com/main/docs/services-and-integrations#events-api-v2), [deduplication behavior](https://support.pagerduty.com/main/docs/event-management#deduplicate-alerts), and [regional endpoints](https://support.pagerduty.com/main/docs/service-regions) during delivery.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: event mapping, `dedup_key`, trigger/resolve pairing, field bounds, region URL, redaction, and retry classification |
| Integration | Required: contract fake for accepted trigger, duplicate trigger, resolve, rate limit, invalid key, timeout, and recovery |
| API | Required: PagerDuty destination CRUD/test/history, region validation, write-only key, retry, and permission contracts |
| UI | Required: component tests plus browser evidence for setup, controlled test, failure, retry, and resolved delivery history |

- [x] Repeated failures for one source lifecycle deduplicate under one stable key.
- [x] Recovery uses the exact key of the open alert and records the resolve attempt.
- [x] The routing key is absent from API reads, logs, audit details, and browser state.

## Verification Evidence

- Official PagerDuty Events API v2, alert-event, PD-CEF, rate-limit, and US/EU service-region documentation defines the implemented fixed transport contract.
- Fake-transport tests cover US/EU endpoints, trigger/update/resolve deduplication, bounded payloads, redirect refusal, malformed and oversized responses, invalid and changed credentials, timeouts, `429` retry hints, `5xx`, and terminal `4xx` responses without contacting PagerDuty.
- Migration `2.20.52` round-trips typed destination regions and immutable delivery snapshots, including legacy deliveries whose destination was already deleted.
- Migration `2.20.53` separates administrative optimistic-lock revisions from internal configuration revisions. Legacy deliveries are deliberately left with an unbound configuration revision and fail closed; pause/resume requeues only pause-deferred deliveries without altering either immutable snapshot.
- Desktop and `390x844` browser QA covers region selection, invalid-key feedback, write-only edit preservation, provider-change rejection, routing preview, safe trigger/resolve/failure history, stable incident identity, no page overflow, and an empty console. Synthetic local history rows exercise presentation without sending a test event to PagerDuty.
