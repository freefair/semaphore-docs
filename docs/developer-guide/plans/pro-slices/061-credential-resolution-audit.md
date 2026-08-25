# Slice 061 — Credential Resolution and Audit

An authorized task resolves a granted global credential only at execution time, and an administrator can audit exactly which task used which credential version.

| Field | Value |
|---|---|
| Selection | E10 |
| Depends on | 005, 060 |
| Primary paths | credential resolver, task preparation, usage audit repository/API, credential history UI |
| Out of scope | Returning credential values to users and application-managed rotation of external provider secrets |

## Implementation

- [ ] Resolve credentials through one service that verifies current user/task permission, project grant, operation, expiry, credential state, and capability.
- [ ] Resolve external references just in time and inject values through the existing secret-safe task channel.
- [ ] Snapshot credential ID, grant ID, provider version/fingerprint, and policy decision without plaintext.
- [ ] Emit an append-only usage audit for allowed and denied resolution attempts with task, project, runner, actor, time, and outcome.
- [ ] Re-check revocation immediately before dispatch and define a task as blocked when a previously selected grant is no longer valid.
- [ ] Prevent runner logs, task summaries, structured logs, notification payloads, and artifacts from containing resolved credential values.
- [ ] Add bounded searchable usage history and impact preview before rotation, revoke, disable, or delete.
- [ ] Display redacted version provenance and denied-resolution remediation on task and credential views.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: complete resolution policy matrix, snapshot, redaction corpus, revocation race, and audit mapping |
| Integration | Required: local/external resolution, task injection, rotation, immediate revoke, provider outage, and cross-project isolation |
| API | Required: usage history/impact preview, task blocked reason, filters/pagination, denied access, and permission contracts |
| UI | Required: multi-user browser evidence for granted task use, version provenance, rotation, revoke-before-run, and usage history |

- [ ] No API or UI path can read the resolved credential value.
- [ ] Every resolution attempt has an attributable value-free audit result.
- [ ] Revocation before dispatch prevents use even when the task was created while the grant was valid.
