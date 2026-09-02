# Slice 059 — ServiceNow Delivery

A routed failure creates one ServiceNow incident, later updates target that exact record, and delivery history links the source lifecycle to the returned record identity.

| Field | Value |
|---|---|
| Selection | E09 |
| Depends on | 056 |
| Primary paths | ServiceNow client/adapter, field mapping, destination API and UI |
| Out of scope | Arbitrary table access, custom Scripted REST APIs, and ServiceNow workflow administration |

## Implementation

- [x] Implement a client for the versioned ServiceNow Table API restricted to the `incident` table and a validated HTTPS instance origin.
- [x] Prefer OAuth 2.0 credentials where configured and isolate any supported fallback authentication behind the write-only client configuration.
- [x] Create with `POST /api/now/v1/table/incident`, capture the returned `sys_id` or Location identity, and persist it against the logical incident key.
- [x] Update the known incident by exact `sys_id`; never search unrestricted incident text to infer an update target.
- [x] Use an administrator-defined allow-list mapping from bounded Semaphore fields to approved incident fields.
- [x] Classify authentication, authorization, validation, rate-limit, timeout, and server responses for retry without persisting unrestricted response bodies.
- [x] Validate configuration with a clearly labeled controlled incident and display its record identity and optional instance link.
- [x] Verify create, identity capture, and update behavior against the official ServiceNow [incident create](https://www.servicenow.com/docs/r/api-reference/rest-api-explorer/t_GetStartedCreateInt.html), [read](https://www.servicenow.com/docs/r/api-reference/rest-api-explorer/t_GetStartedReadInt.html), and [update](https://www.servicenow.com/docs/r/api-reference/rest-api-explorer/get-started-update-incident.html) documentation during delivery.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: instance URL validation, field allow-list, create/update mapping, identity parsing, redaction, and retry classification |
| Integration | Required: contract fake for create/read/update, missing Location/body ID, rate limit, invalid credentials, timeout, and retry |
| API | Required: ServiceNow destination CRUD/test/history, field-map validation, write-only credentials, and permission contracts |
| UI | Required: component tests plus browser evidence for setup, controlled incident, update, failure, retry, and record link |

- [x] A logical source lifecycle creates at most one ServiceNow incident through retry and worker restart.
- [x] Updates use only the persisted exact `sys_id` from the successful create response.
- [x] Credentials and unrestricted ServiceNow response content never reach API reads, logs, audit details, or browser state.

## Verification Evidence

- Official contract review used the documented versioned incident create/read/update endpoints, the Table API query controls, OAuth client-credentials flow, and inbound REST rate-limit behavior. The implementation deliberately does not depend on an undocumented Table API idempotency header.
- Unit and integration tests cover origin/DNS/IP restrictions, OAuth and Basic isolation, allow-listed mappings, controlled-test payloads, create identity parsing, exact reconciliation, update-by-`sys_id`, ambiguous responses, status/retry classification, response limits, configuration-generation token fencing, worker restart, update-before-trigger, and atomic binding/history persistence.
- Facade and API tests cover strict ServiceNow input, configuration persistence, provider changes, write-only credentials, safe history identity, and redacted response contracts.
- Component and browser tests cover setup, invalid-origin feedback, authentication-mode fields, secret redaction, trigger/update/resolve history on one record identity, failed-delivery retry, safe record links, and a scrollable 390×844 dialog on the existing governance surface.
- Browser evidence uses a disposable local database and synthetically inserted safe delivery history. No request was sent to a real ServiceNow instance.
