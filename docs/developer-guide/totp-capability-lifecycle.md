# TOTP Capability Lifecycle

The Enhanced edition implements TOTP as a capability-controlled lifecycle rather than an immediate database toggle.
The design keeps opaque server-side sessions, requires a completed enrollment ceremony, and provides a host-local recovery path for administrator lockout.

## Rollout states

| State | Enrollment | Login enforcement |
|---|---|---|
| `disabled` | Blocked | Disabled for newly created sessions |
| `shadow` | Blocked | Disabled while administrators inspect rollout status |
| `optional` | Available to local users | Active enrollments are challenged |
| `required_selected` | Available to local users | Selected local users must enroll; every active enrollment is challenged |
| `required` | Available to local users | Every local user must enroll; external users fail closed |

State changes and their actor are recorded in `totp_capability_transition`.
Changing rollout state preserves enrollment data and existing opaque sessions.
The UI reads the effective state from the backend capability snapshot; hiding controls is never the enforcement boundary.

`required` can be enabled only when there are no external users and at least one local administrator has an active enrollment, has acknowledged recovery-code storage, and still has an unused recovery code.
`required_selected` accepts local users only.
An external account created after `required` was enabled cannot receive a session, so late provisioning cannot bypass the policy.

## Enrollment ceremony

1. A local user re-enters their current password.
2. The server generates an RFC 6238 secret and eight recovery codes.
3. The provisioning URI is encrypted before persistence and is returned only by the authenticated, time-limited enrollment ceremony and its QR endpoint.
4. Recovery codes are persisted only as bcrypt hashes.
5. The user submits a valid six-digit TOTP code and re-enters the current password.
6. The enrollment moves to `pending_recovery_ack` but is not active yet.
7. The user explicitly acknowledges that the recovery codes were stored.
8. One transaction activates the enrollment, verifies the current session, revokes every other session, and clears prior TOTP failures.

Pending ceremonies expire after 15 minutes.
Starting a new pending ceremony replaces the previous pending ceremony and its recovery codes.
An active enrollment cannot be replaced without a reset.

Existing plaintext TOTP rows are migrated on Enhanced startup.
The provisioning URI is encrypted, the plaintext columns are cleared, and the legacy recovery hash becomes a single-use recovery-code record in the same transaction.
Startup fails closed when legacy data exists but encryption is not configured.

## Runtime verification

The verifier accepts the current 30-second step and one adjacent step in either direction.
The accepted step is persisted conditionally, so two concurrent requests using the same or an older step cannot both succeed.
Five failed TOTP or recovery attempts in a five-minute window block further attempts for five minutes.

Recovery codes are normalized, compared with their bcrypt hashes, and consumed with a conditional update.
Using a recovery code verifies the current session but does not disable TOTP.
Every enrollment, confirmation, acknowledgment, challenge, recovery, reset, and rollout result emits an allowlisted security audit event without secret material.

Cookie-authenticated TOTP mutation and verification endpoints use the same-origin CSRF middleware.
OIDC and LDAP-created sessions use the same TOTP policy resolution as password sessions.

## Session and recovery policy

| Event | Session effect |
|---|---|
| Enrollment activation | Keep and verify the ceremony session; revoke all other sessions for the user |
| Successful challenge or recovery code | Verify only the current session |
| User reset, administrator reset, or local CLI reset | Revoke every session for the user |
| Rollout state change | Preserve existing sessions and enrollment data |

The API refuses to reset the last recoverable administrator while that administrator is required by the active policy.
The host-local command remains available when no web session can be recovered:

```bash
semaphore user totp disable --login <login>
```

The command deletes the enrollment and revokes every session in one transaction.
It intentionally bypasses the web API's last-administrator guard because access to the Semaphore host and database is the explicit recovery authority.
It never prints the enrollment secret or recovery hashes.

Community builds expose the Enhanced TOTP capability as unavailable.
If a Community upgrade encounters an account that was already protected by enabled legacy TOTP, session creation fails closed with `TOTP_UNAVAILABLE` instead of issuing a password-only session.
The local reset command is the recovery path for that state.

## HTTP contract

| Method and path | Purpose | Authentication |
|---|---|---|
| `GET /api/users/{user_id}/2fas/totp` | Read lifecycle status | Verified self or administrator session |
| `POST /api/users/{user_id}/2fas/totp` | Begin enrollment | Verified self session plus password re-authentication |
| `GET /api/users/{user_id}/2fas/totp/{totp_id}/qr` | Render ceremony QR | Verified self session during the pending ceremony |
| `POST /api/users/{user_id}/2fas/totp/{totp_id}/confirm` | Confirm password and TOTP code | Verified self session |
| `POST /api/users/{user_id}/2fas/totp/{totp_id}/recovery-codes/acknowledge` | Activate enrollment | Verified self session |
| `DELETE /api/users/{user_id}/2fas/totp/{totp_id}` | Reset enrollment and revoke sessions | Self with password re-authentication, or administrator |
| `POST /api/auth/verify` | Complete a TOTP login challenge | Unverified TOTP session |
| `POST /api/auth/recovery` | Complete a challenge with one recovery code | Unverified TOTP session |
| `POST /api/auth/totp/enroll` | Begin required enrollment during login | Unverified enrollment session plus password re-authentication |
| `PUT /api/capabilities/totp` | Change rollout state and selected users | Verified administrator session |
| `GET /api/capabilities/totp/transitions` | Read rollout history | Verified administrator session |

Stable security errors include `INVALID_PASSCODE`, `INVALID_RECOVERY_CODE`, `TOTP_REPLAYED`, `TOTP_THROTTLED`, `TOTP_ENROLLMENT_CONFLICT`, and `TOTP_ADMIN_RECOVERY_NOT_READY`.

## Persistence and ownership

Core owns the SQL schema, DTOs, repository interface, API transport, and UI.
The replaceable Enhanced module owns the framework-free `TOTPService` implementation and capability decisions.
SQL is the authority for single-use time steps, recovery codes, activation/reset atomicity, throttling, rollout selection, and transition history.

The contract is exported from `pro_interfaces/totp.go` and is versioned with `pro_interfaces.CoreContractVersion`.
