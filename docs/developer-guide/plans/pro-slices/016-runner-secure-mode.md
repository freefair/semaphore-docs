# Slice 016 — Runner Registration Enforces an Explicit Secure Mode

An administrator selects a registration policy and the server rejects runners whose transport, identity, or executor capabilities do not satisfy it.

| Field | Value |
|---|---|
| Selection | P02b |
| Depends on | 010, 014 |
| Primary paths | runner config/model, registration API, runner CLI, `RunnerForm.vue` |
| Out of scope | Primary runner token hashing and external certificate issuance |

## Implementation

- [x] Define named policies for standard and secure registration rather than a collection of ambiguous booleans.
- [x] Require server identity verification, one-time registration, supported runner version, and declared executor capabilities in secure mode.
- [x] Store policy with the runner and re-evaluate it on every reconnect or material metadata change.
- [x] Reject downgrade and insecure fallback with redacted diagnostics.
- [x] Show policy requirements and compliance state in runner UI and CLI output.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: policy evaluation and downgrade matrix |
| Integration | Required: runner registration against valid/invalid TLS fixtures |
| API | Required: registration, reconnect, downgrade, and version rejection contracts |
| UI | Required: component tests plus browser policy selection and compliance states |

- [x] Secure mode never silently falls back to insecure transport or identity.
- [x] Existing standard runners remain usable when their policy is unchanged.
- [x] Policy violations identify remediation without exposing credentials.

Implementation details and verification commands are recorded in [Runner Secure Mode](../../project-runner-secure-mode.md).
