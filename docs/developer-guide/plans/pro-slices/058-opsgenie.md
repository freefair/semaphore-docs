# Slice 058 — Opsgenie Delivery

A routed failure creates or deduplicates one Opsgenie alert, and the asynchronous provider result remains visible until success or terminal failure.

| Field | Value |
|---|---|
| Selection | E09 |
| Depends on | 056 |
| Primary paths | Opsgenie client/adapter, destination validation, delivery UI |
| Out of scope | Opsgenie policy or team administration |

## Implementation

- [x] Implement an Opsgenie Alert API v2 client with explicit US/EU base URL and write-only API integration key.
- [x] Map the logical incident key to `alias` so repeated routed events deduplicate predictably.
- [x] Bound message, alias, description, responders, tags, details, entity, and priority according to the provider contract.
- [x] Treat create and lifecycle actions as asynchronous: persist the request ID and poll bounded request-status checks before finalizing delivery.
- [x] Map recovery to closing the alert by alias and make repeated close requests idempotent.
- [x] Classify validation, authentication, rate-limit, timeout, accepted-but-failed, and server outcomes for retry.
- [x] Validate configuration through a controlled labeled alert and optional close operation.
- [x] Verify payload limits, asynchronous request status, regional base URLs, and lifecycle actions against the official [Opsgenie Alert API](https://docs.opsgenie.com/docs/alert-api) during delivery.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: payload bounds, alias mapping, priority, region URL, async state machine, redaction, and retry classification |
| Integration | Required: contract fake for 202 plus status success/failure, duplicate alias, close, rate limit, invalid key, and timeout |
| API | Required: Opsgenie destination CRUD/test/history, region/responders validation, write-only key, and permission contracts |
| UI | Required: component tests plus browser evidence for setup, accepted/pending/succeeded test, failure, retry, and close history |

- [x] HTTP 202 remains pending until the request-status result is known or the bounded poll policy expires.
- [x] Repeated source events use one alias and recovery closes that alias.
- [x] The API key is absent from API reads, logs, audit details, and browser state.

## Verification Evidence

- Official Alert API, authentication, rate-limit, European service-region, and product-lifecycle documentation define the implemented fixed transport and the April 5, 2027 support boundary.
- Fake transports cover US/EU create, stable aliases for trigger/update, asynchronous close, request-status pending/success/failure, exact resolve idempotency, `429`, `408`, `425`, `5xx`, terminal responses, malformed/oversized bodies and IDs, network failures, redirects, bounds, and redaction without contacting Opsgenie.
- Migration `2.20.54` round-trips typed non-secret provider configuration and lease-fenced request IDs. Manual retry clears an old provider request before intentionally binding the failed delivery to the current destination generation.
- API and UI tests cover typed region/priority/responders, nested unknown-field rejection, write-only credentials, safe request-ID history, pending reason labels, and provider-change isolation.
- Browser QA covers EU/P2/two-responder setup, invalid responder feedback, blank-key edit preservation, routing preview, synthetic pending/succeeded/failed and close history, safe request IDs, desktop/mobile layout, and no page-level overflow. No real Opsgenie request was sent.
