# Slice 027 — LDAP Capability Lifecycle

An administrator can validate and enable LDAP authentication while retaining a tested local-administrator recovery path.

Implementation details and operational guidance are documented in [LDAP Capability Lifecycle](../../ldap-capability-lifecycle.md).

| Field | Value |
|---|---|
| Selection | P07 LDAP |
| Depends on | 003, 005 |
| Primary paths | LDAP auth client, identity service, capability API, login and admin UI |
| Out of scope | LDAP group-to-role mapping, delivered by slice 047, and directory writes |

## Implementation

- [x] Put all LDAP transport and protocol behavior behind an outbound client interface and keep authentication orchestration in the identity service.
- [x] Require TLS with explicit trust configuration and reject silent downgrade, referral escape, and unbounded directory responses.
- [x] Use a fixed user search base, escaped filter parameters, an allow-listed unique identity attribute, and normalized immutable external IDs.
- [x] Encrypt bind credentials at rest and return them only as write-only configuration fields.
- [x] Add disabled, shadow, selected-user, and active lifecycle states with connection, search, and bind readiness checks.
- [x] Define account linking and collision behavior for existing local users without silently merging identities by display name.
- [x] Rate-limit authentication failures, redact directory diagnostics, and audit configuration and login outcomes.
- [x] Preserve a tested local administrator login and make provider outage behavior explicit on the login screen.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: filter escaping, identity normalization, collision policy, lifecycle decisions, redaction, and error mapping |
| Integration | Required: disposable LDAP server with TLS for search/bind, duplicate identity, referral, timeout, outage, and recovery cases |
| API | Required: configure/test/enable/disable, write-only bind secret, login, collision, lifecycle, and permission contracts |
| UI | Required: component tests plus browser evidence for setup, test failure, LDAP login, outage messaging, and local recovery |

- [x] User-controlled values never become executable LDAP filter fragments.
- [x] LDAP failure does not lock out the designated local recovery administrator.
- [x] Disabling LDAP stops new directory login without deleting linked account history.
