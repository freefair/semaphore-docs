---
title: Authentication
description: The three ways users sign in to Semaphore - local accounts, LDAP, and OpenID Connect - how they combine, and how identities are linked.
---

# Authentication

Semaphore has three ways of establishing who somebody is. They are independent and
can all be enabled at once, so the sign-in screen may offer a password form, a
directory login, and one button per identity provider.

| Method | Who verifies the password | Use it when |
|---|---|---|
| [Local accounts](/admin-guide/authentication/local) | Semaphore, against its own database | You have no directory, or you need a break-glass administrator. |
| [LDAP and Active Directory](/admin-guide/authentication/ldap) | Your directory server | People already exist in LDAP or AD and you want one set of credentials. |
| [OpenID Connect](/admin-guide/authentication/openid) | Your identity provider | You have single sign-on: Keycloak, Okta, Entra ID, Google, GitHub, and others. |

Authentication only answers *who* the user is. What they are allowed to do is decided
separately, by their server role and by their role in each project — see
[Teams](/user-guide/team).

## How a user record comes to exist {#how-a-user-record-comes-to-exist}

Every person who signs in has a row in the Semaphore database, whichever method they
used. A local account is created by an administrator or by `semaphore user add`. An
LDAP or OIDC account is created on first successful sign-in, and Semaphore stores an
**external identity** next to it: the provider ID plus the user ID that provider
returned.

That external identity is what later logins match on, which means renaming somebody
in the directory does not create a second account. What does need care is the *first*
login of an existing user, where no external identity exists yet. The
`external_auth_email_matching` option decides what happens then:

| Value | Behaviour |
|---|---|
| `auto` (default) | Link by e-mail, but only for external users that have no identity yet. This adopts accounts created before 2.20 once, and nothing else. |
| `always` | Link by e-mail for any external user. Use it when one person signs in through several providers. |
| `never` | Never link by e-mail; identities are matched strictly by provider ID. |

Local password accounts are never matched by e-mail, in any mode. An OIDC provider
that lets a user choose their own e-mail address could otherwise be used to take over
an administrator's account.

:::warning
The provider ID — the key in `oidc_providers` or `ldap_providers` — is part of every
stored identity. Renaming it orphans the identities that reference it, and those users
get new, empty accounts on their next sign-in. Choose it once.
:::

## Combining methods {#combining-methods}

A realistic setup enables single sign-on for people and keeps one local administrator
for the day the identity provider is unreachable:

1. Configure the provider and confirm that a real user can sign in through it.
2. Give that user the roles they need.
3. Keep one local administrator record with a strong password and
   [TOTP](/admin-guide/authentication/local#two-factor-authentication) enabled.
4. Confirm a second identity-provider path or host recovery procedure before
   changing password-login settings.

Do those in order. `password_login_disable` disables ordinary local password login.
When an active or selected-user managed LDAP provider has a designated recovery
administrator, that exact local account remains available for recovery. Otherwise,
recovery requires host access to re-enable the setting and restart the service, or
another independently verified identity-provider path.

## In this section {#in-this-section}

| Page | What it covers |
|---|---|
| [Local accounts](/admin-guide/authentication/local) | Passwords, TOTP, session lifetime, and disabling password login. |
| [LDAP and Active Directory](/admin-guide/authentication/ldap) | Binding to a directory, search filters, attribute mappings, and TLS. |
| [OpenID Connect](/admin-guide/authentication/openid) | Provider configuration, claim expressions, and worked provider examples. |

## Where to start {#where-to-start}

A new installation already has the local administrator created during setup, so start
with [Local accounts](/admin-guide/authentication/local) to secure it, then add
[OpenID Connect](/admin-guide/authentication/openid) or
[LDAP](/admin-guide/authentication/ldap) for everyone else.
