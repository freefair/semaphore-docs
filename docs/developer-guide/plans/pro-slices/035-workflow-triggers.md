# Slice 035 — Workflow Triggers

A workflow can start from a schedule, authenticated API request, or project webhook with the same validation, authorization, and immutable input rules as a manual start.

| Field | Value |
|---|---|
| Selection | P08e |
| Depends on | 031, 034 |
| Primary paths | trigger model/repository, scheduler, webhook/API controllers, workflow run UI |
| Out of scope | Webhook signatures and replay protection, delivered by slice 073, and deployment windows |

## Implementation

- [ ] Model manual, schedule, API, and webhook triggers as versioned resources with owner, enabled state, input mapping, and audit metadata.
- [ ] Route every trigger through one workflow-start use case so validation, permissions, capability gates, snapshotting, and idempotency are consistent.
- [ ] Give API and webhook invocations an idempotency key scoped to trigger and retain the result for a bounded window.
- [ ] Give scheduled occurrences a stable identity derived from trigger, scheduled instant, and definition revision.
- [ ] Validate trigger parameter mappings against the workflow definition when saving and again when firing.
- [ ] Issue revocable opaque webhook/API credentials, store only hashes, and show the plaintext once at creation.
- [ ] Add enable/disable, rotate, test, last-fired, last-result, and paginated invocation history workflows.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: input mapping, occurrence identity, idempotency scope, credential hashing, and disabled-state decisions |
| Integration | Required: scheduler plus API/webhook invocation, duplicate delivery, credential rotation, outage retry, and definition change |
| API | Required: trigger CRUD/test/fire/history, invalid input, duplicate key, revoked credential, capability, and permission contracts |
| UI | Required: component tests plus browser evidence for creating each trigger, rotating credentials, test fire, and history |

- [ ] The same scheduled occurrence or idempotent external request starts at most one workflow run.
- [ ] Triggered runs retain the initiating trigger and effective input snapshot.
- [ ] Disabled or revoked triggers cannot start new runs through direct API use.
