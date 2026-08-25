# Slice 016 — Runner Registration Enforces an Explicit Secure Mode

An administrator selects a registration policy and the server rejects runners whose transport, identity, or executor capabilities do not satisfy it.

| Field | Value |
|---|---|
| Selection | P02b |
| Depends on | 010, 014 |
| Primary paths | runner config/model, registration API, runner CLI, `RunnerForm.vue` |
| Out of scope | Primary runner token hashing and external certificate issuance |

## Implementation

- [ ] Define named policies for standard and secure registration rather than a collection of ambiguous booleans.
- [ ] Require server identity verification, one-time registration, supported runner version, and declared executor capabilities in secure mode.
- [ ] Store policy with the runner and re-evaluate it on every reconnect or material metadata change.
- [ ] Reject downgrade and insecure fallback with redacted diagnostics.
- [ ] Show policy requirements and compliance state in runner UI and CLI output.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: policy evaluation and downgrade matrix |
| Integration | Required: runner registration against valid/invalid TLS fixtures |
| API | Required: registration, reconnect, downgrade, and version rejection contracts |
| UI | Required: component tests plus browser policy selection and compliance states |

- [ ] Secure mode never silently falls back to insecure transport or identity.
- [ ] Existing standard runners remain usable when their policy is unchanged.
- [ ] Policy violations identify remediation without exposing credentials.
