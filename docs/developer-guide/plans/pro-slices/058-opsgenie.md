# Slice 058 — Opsgenie Delivery

A routed failure creates or deduplicates one Opsgenie alert, and the asynchronous provider result remains visible until success or terminal failure.

| Field | Value |
|---|---|
| Selection | E09 |
| Depends on | 056 |
| Primary paths | Opsgenie client/adapter, destination validation, delivery UI |
| Out of scope | Opsgenie policy or team administration |

## Implementation

- [ ] Implement an Opsgenie Alert API v2 client with explicit US/EU base URL and write-only API integration key.
- [ ] Map the logical incident key to `alias` so repeated routed events deduplicate predictably.
- [ ] Bound message, alias, description, responders, tags, details, entity, and priority according to the provider contract.
- [ ] Treat create and lifecycle actions as asynchronous: persist the request ID and poll bounded request-status checks before finalizing delivery.
- [ ] Map recovery to closing the alert by alias and make repeated close requests idempotent.
- [ ] Classify validation, authentication, rate-limit, timeout, accepted-but-failed, and server outcomes for retry.
- [ ] Validate configuration through a controlled labeled alert and optional close operation.
- [ ] Verify payload limits, asynchronous request status, regional base URLs, and lifecycle actions against the official [Opsgenie Alert API](https://docs.opsgenie.com/docs/alert-api) during delivery.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: payload bounds, alias mapping, priority, region URL, async state machine, redaction, and retry classification |
| Integration | Required: contract fake for 202 plus status success/failure, duplicate alias, close, rate limit, invalid key, and timeout |
| API | Required: Opsgenie destination CRUD/test/history, region/responders validation, write-only key, and permission contracts |
| UI | Required: component tests plus browser evidence for setup, accepted/pending/succeeded test, failure, retry, and close history |

- [ ] HTTP 202 remains pending until the request-status result is known or the bounded poll policy expires.
- [ ] Repeated source events use one alias and recovery closes that alias.
- [ ] The API key is absent from API reads, logs, audit details, and browser state.
