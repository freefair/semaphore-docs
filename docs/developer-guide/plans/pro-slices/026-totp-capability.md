# Slice 026 — TOTP Capability Lifecycle

An administrator can safely enable TOTP, and users can enroll and use it without risking an unrecoverable administrator lockout.

| Field | Value |
|---|---|
| Selection | P07 TOTP |
| Depends on | 003, 005 |
| Primary paths | authentication service, TOTP enrollment API, recovery controls, account and admin UI |
| Out of scope | SMS factors, WebAuthn, and replacing opaque server-side sessions |

## Implementation

- [ ] Add disabled, shadow, optional, required-for-selected-users, and required capability states with recorded rollout transitions.
- [ ] Generate an enrollment secret server-side, encrypt it at rest, and expose it only during the authenticated enrollment ceremony.
- [ ] Require password re-authentication and a valid code before activating enrollment.
- [ ] Generate single-use hashed recovery codes and require explicit acknowledgment that they were stored.
- [ ] Add bounded clock skew, attempt throttling, replay prevention for an accepted time step, and security audit events.
- [ ] Revoke existing sessions according to a documented policy after enrollment reset or administrator disablement.
- [ ] Protect the last recoverable administrator with a local recovery path and pre-enable readiness check.
- [ ] Gate backend endpoints first and render enrollment, challenge, recovery, and lifecycle status in the UI.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: RFC-compatible code fixtures, clock boundaries, replay, recovery hashing, throttling, and lifecycle state machine |
| Integration | Required: encrypted persistence, session revocation, concurrent code use, last-admin recovery, and audit records |
| API | Required: enroll/confirm/challenge/recover/reset, invalid and replayed codes, rollout states, and permission contracts |
| UI | Required: component tests plus browser evidence for enrollment, login challenge, recovery, reset, and disabled/required transitions |

- [ ] No user is considered enrolled before successful confirmation.
- [ ] The same TOTP time-step or recovery code cannot authenticate twice.
- [ ] Enabling required mode is rejected until the documented administrator recovery condition is satisfied.
