---
title: Local accounts
description: Password sign-in against the Semaphore database - how passwords are stored, TOTP two-factor authentication, session lifetime, and turning passwords off.
---

# Local accounts

A local account keeps its password in the Semaphore database. Every installation
starts with one, created by `semaphore setup` or by the `SEMAPHORE_ADMIN_*`
variables, and that account is how you reach the server before any identity provider
exists.

Keep at least one local administrator even after single sign-on works. It is the only
way back in when the identity provider is unreachable.

## How passwords are stored {#how-passwords-are-stored}

Passwords are hashed with **Argon2id** using the OWASP minimum-strength parameters,
and the parameters are recorded alongside each hash in
[PHC string format](https://github.com/P-H-C/phc-string-format/blob/master/phc-sf-spec.md).
Releases before 2.20 used bcrypt; those hashes still work, and each one is replaced
with an Argon2id hash on the owner's next successful sign-in. Accounts that never sign
in again keep their bcrypt hash, so reset those passwords to upgrade them.

The full parameter table is in [Security](/admin-guide/security#password-hashing).

Semaphore does not enforce a password policy — no minimum length, no complexity, no
expiry. If you need one, use a directory or an identity provider, which is where such
policies belong.

## Manage accounts {#manage-accounts}

Administrators manage users in the web interface, and the same operations exist on the
command line for scripting and for recovery when nobody can sign in:

```bash
semaphore users add --admin --login jane --name "Jane Doe" \
  --email jane@example.com --password 's3cret'
semaphore users change-by-login --login jane --password 'new-s3cret'
semaphore users list
```

See [`semaphore users`](/reference/cli/users) for every flag, and
[Teams](/user-guide/team) for what a role lets a user do once they are in.

:::warning
A password on the command line lands in your shell history and in the process list of
the machine. Use it for the first administrator and for recovery, and change the
password from the web interface afterwards.
:::

## Two-factor authentication {#two-factor-authentication}

Semaphore supports TOTP: the six-digit codes produced by Google Authenticator, Aegis,
1Password, and similar apps. Administrators configure the Enhanced lifecycle in the
System Information capability panel: `disabled`, `shadow`, `optional`,
selected-required, or required. Enrollment is password-confirmed; provisioning
secrets are encrypted; recovery codes are single-use; and replay protection,
throttling, and session revocation apply throughout the ceremony.

Required mode is blocked until at least one local administrator has an acknowledged,
unused recovery code. External accounts cannot enroll while required mode is active.
The legacy `mfa.totp.enabled` and `mfa.totp.allow_recovery` switches are compatibility
settings; they do not replace lifecycle or enforcement decisions.

Use the host-local recovery command only when the designated administrator cannot
complete the authenticated web ceremony:

```bash
semaphore user totp disable --login jane
```

It resets the affected enrollment and revokes that user's sessions. It never prints a
TOTP provisioning secret or recovery-code hash.

## Session lifetime {#session-lifetime}

A session expires after **seven days without activity**. That inactivity timeout is
built in and not configurable.

An absolute limit is, and it is measured from the moment of sign-in rather than from
the last request, so an actively used session also ends:

```json
{
  "auth": {
    "max_session_life_hours": 12
  }
}
```

The default, `0`, means no absolute limit. Set it where a shared workstation or a
compliance rule requires people to re-authenticate on a schedule.

## Turn password sign-in off {#turn-password-sign-in-off}

Once an identity provider is configured and you have verified that a real user can
sign in through it, `password_login_disable` rejects ordinary password login:

```json
{
  "password_login_disable": true
}
```

LDAP and OpenID Connect are unaffected. Existing local accounts keep their roles and
history. When an active or selected-user managed LDAP provider designates a recovery
administrator, only that local account can still use password login. Do not rely on
this exception until the managed provider and recovery administrator have been tested.

:::danger
This option is honoured immediately. Confirm the managed recovery administrator, a
second identity-provider path, or the host recovery procedure by performing it before
you set it. Without the managed recovery exception, recovery means editing the
configuration file on the server and restarting.
:::

## What's next {#whats-next}

- [LDAP and Active Directory](/admin-guide/authentication/ldap) — authenticate against a directory.
- [OpenID Connect](/admin-guide/authentication/openid) — single sign-on with an identity provider.
- [Security](/admin-guide/security) — hashing parameters, encryption, and hardening.
