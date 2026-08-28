# LDAP Capability Lifecycle

The Enhanced edition manages LDAP authentication as a provider lifecycle with backend-authoritative readiness and recovery gates.
The design keeps LDAP protocol handling behind an outbound client, stores provider state in SQL, and preserves a tested local administrator login when the directory is unavailable.

## Table of contents

- [Ownership and data flow](#ownership-and-data-flow)
- [Provider configuration](#provider-configuration)
- [Lifecycle and readiness](#lifecycle-and-readiness)
- [Identity and collision policy](#identity-and-collision-policy)
- [Runtime security and recovery](#runtime-security-and-recovery)
- [HTTP contract](#http-contract)
- [Persistence and edition boundary](#persistence-and-edition-boundary)

## Ownership and data flow

Core owns the HTTP transport, SQL schema and repository contract, login integration, and administrative UI.
The replaceable Enhanced module owns the framework-free `LDAPService` implementation and lifecycle decisions.
The `LDAPClient` interface is the only directory transport boundary; it owns TLS negotiation, bind, search, filter escaping, referral handling, response bounds, and directory error classification.

An LDAP login follows this sequence:

1. The login endpoint resolves a backend-exposed provider and asks `LDAPService` to authenticate the submitted credentials.
2. The service checks lifecycle state and the persisted subject throttle before calling `LDAPClient`.
3. The client performs service bind, fixed-base search, and user bind over the configured TLS mode.
4. The service resolves the normalized immutable external ID against `user__external_identity`.
5. The service either updates the linked external user's directory-owned profile fields, provisions a new external user in `active`, or rejects the login according to lifecycle and collision policy.
6. The normal opaque server-side session and TOTP policy are applied after LDAP authentication succeeds.

## Provider configuration

Administrators configure providers in the System Information dialog.
Provider IDs are stable lowercase identifiers and cannot be renamed after creation.
Connection configuration can be changed only while the provider is `disabled` or `shadow`; exposed providers must first move to one of those inactive states.

The server accepts only these transport combinations:

| TLS mode | Server URL | Trust mode |
|---|---|---|
| `ldaps` | `ldaps://host:port` | System trust store or an explicit custom CA PEM |
| `starttls` | `ldap://host:port` | System trust store or an explicit custom CA PEM |

TLS 1.2 is the minimum version.
The client rejects URL credentials, paths, queries, fragments, scheme mismatches, silent downgrade, and invalid TLS hostnames.
The configured user search base is fixed, the user filter must contain `{{username}}` exactly once, and the supplied username is escaped before the search request is built.

The immutable identity attribute is restricted to `entryUUID`, `objectGUID`, `nsUniqueId`, or `ipaUniqueID`.
UUID values are normalized before persistence, including Active Directory `objectGUID` byte ordering.
Searches request only the configured identity, username, name, and email attributes, reject referrals, allow at most two entries, and have a five-second operation limit.

The bind password is encrypted with the configured option-encryption keyring before SQL persistence.
API responses expose only `bind_password_configured`; the secret is never returned and an empty password on a later update retains the existing encrypted value.

## Lifecycle and readiness

| State | Login exposure | Provisioning and selection behavior |
|---|---|---|
| `disabled` | Hidden and rejected | Configuration and linked identity history are retained |
| `shadow` | Hidden and rejected | Administrators can configure and test the provider without exposing login |
| `selected_users` | Exposed | Only explicitly selected users with an existing link may authenticate; new users are not provisioned |
| `active` | Exposed | Linked users authenticate and new directory identities may be provisioned |

Every lifecycle transition records provider, prior state, next state, actor, and time in SQL.
Moving to `selected_users` or `active` requires readiness proven within the previous 15 minutes.
Readiness cannot be supplied by a caller or timestamped in the future.

One readiness test proves all of the following in a single operation:

- a secure connection can be established;
- the service account can bind and search the fixed base;
- the nominated directory user can bind;
- the nominated recovery account is an active, non-external local administrator whose password verifies.

A configuration change resets readiness to `untested`.
Failed tests persist a safe readiness code without directory diagnostics or credentials.

## Identity and collision policy

LDAP identity authority is `(type, provider, normalized immutable external ID)`.
Display name, username, and email are never used to silently merge an unlinked LDAP identity into an existing local account.
If initial provisioning would collide with an existing username or email, login fails with `LDAP_IDENTITY_COLLISION`.

A local user can explicitly link a provider through `POST /api/user/identities/ldap` after proving control with directory credentials.
The directory username or email must match that local profile, and neither the LDAP identity nor the local account may already have a conflicting LDAP link.
After a link exists, the immutable external ID remains authoritative and directory-owned name and email fields are synchronized at successful login.

Disabling a provider stops new LDAP login but does not delete the external user or `user__external_identity` row.
This preserves auditability and allows a later re-enable without rebinding the account to a different directory object.

## Runtime security and recovery

Five invalid credential attempts within five minutes block that provider and normalized username for five minutes.
The persisted throttle key is a SHA-256 subject hash, so raw usernames are not stored in the attempt table.
A successful authentication clears the recorded failures.

Directory diagnostics are classified into stable errors and do not expose bind DNs, filters, hosts, certificates, passwords, or raw server messages.
Referral, duplicate identity, timeout, TLS, bind, and search failures fail closed.
Configuration, readiness, lifecycle, link, and login outcomes emit allowlisted security audit events.

When a managed provider is exposed, the login page keeps local password login available only as the recovery path if global password login is disabled.
The backend permits that exception solely for the designated local recovery administrator whose readiness proof is still recorded.
An LDAP outage produces an explicit provider-unavailable message and does not prevent that administrator from using the local recovery login.

## HTTP contract

| Method and path | Purpose | Authentication |
|---|---|---|
| `GET /api/capabilities/ldap` | List secret-free provider configuration and readiness | Verified administrator session |
| `PUT /api/capabilities/ldap` | Create or update an inactive provider | Verified administrator session |
| `POST /api/capabilities/ldap/test` | Prove directory access and local recovery | Verified administrator session plus both submitted credentials |
| `PUT /api/capabilities/ldap/state` | Apply lifecycle state and selected linked users | Verified administrator session |
| `GET /api/capabilities/ldap/transitions?provider_id={id}` | Read lifecycle history | Verified administrator session |
| `POST /api/user/identities/ldap` | Explicitly link the current local account | Verified self session plus LDAP credentials |
| `GET /api/auth/login` | Read exposed LDAP providers and local-recovery metadata | Public |
| `POST /api/auth/login` | Authenticate with `method: "ldap"` and a provider ID | Public |

Stable LDAP errors include `LDAP_INVALID_CREDENTIALS`, `LDAP_PROVIDER_UNAVAILABLE`, `LDAP_THROTTLED`, `LDAP_IDENTITY_COLLISION`, `LDAP_RECONFIGURATION_REQUIRES_INACTIVE`, `LDAP_ADMIN_RECOVERY_NOT_READY`, `LDAP_DISABLED`, `LDAP_FORBIDDEN`, and `LDAP_PROVIDER_NOT_FOUND`.

## Persistence and edition boundary

SQL is authoritative for provider configuration, encrypted bind credentials, readiness, recovery-admin designation, selected users, authentication throttles, lifecycle transitions, users, and external identities.
Migration `v2.20.13` creates `ldap_provider`, `ldap_provider_selected_user`, `ldap_auth_attempt`, and `ldap_capability_transition` on SQLite, MySQL, MariaDB, and PostgreSQL.

The contract is exported from `pro_interfaces/ldap.go` and versioned with `pro_interfaces.CoreContractVersion`.
Enhanced provides the lifecycle implementation through the existing module seam.
Community provides an unavailable stub for the managed capability while retaining its legacy LDAP configuration and login compatibility path behind the separate `LegacyLDAPClient` transport boundary.
