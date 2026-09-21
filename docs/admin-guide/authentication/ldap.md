---
title: LDAP and Active Directory
description: Configure and operate LDAP or Active Directory through the Enhanced capability lifecycle without weakening transport, identity, or recovery controls.
---

# LDAP and Active Directory

Configure LDAP from the System Information capability panel. The lifecycle is
`disabled`, `shadow`, selected-user, and active; each transition validates directory
connection, search, and bind readiness before it changes authentication behavior.

The legacy `ldap_enable`, flat `ldap_*`, and `ldap_providers` configuration fields
remain parser compatibility paths. They do not create or activate the selected
database-managed LDAP providers.

## Transport and credentials {#transport-and-credentials}

Use TLS with explicit trust configuration. Do not use plaintext LDAP, disable
certificate verification, or use a configuration that silently falls back to either.
The bind credential is write-only: supply it through the designated secret field and
do not place it in examples, shell history, task output, or version-controlled files.

## Identity and directory boundaries {#identity-and-directory-boundaries}

The directory configuration uses a fixed user-search base, static user and group
filters, an allow-listed immutable identity attribute, and bounded nested-group
resolution. Semaphore escapes user-controlled login values before they reach a
directory search filter.

LDAP identity linking never silently merges accounts by display name. Disabling LDAP
stops new directory login without deleting linked-account history.

## Verify before activation {#verify-before-activation}

Use the panel's **Test** action before activation. It reports safe, redacted
connection, search, and bind diagnostics. If LDAP is unavailable, Semaphore retains
the designated local administrator recovery path. Keep that local recovery path
tested before enabling or changing the provider.

## Group-to-role mapping {#group-to-role-mapping}

Enhanced administrators can map an LDAP group to an explicit global or project role.
Configure the group search base, static user and group filters, immutable group
identity attribute, membership attribute, and maximum nested depth before adding a
mapping.

Use **Preview** to inspect additions, removals, unresolved users or groups,
collisions, and protected-administrator blockers without changing access. Semaphore
rejects stale applies when the directory or mapping configuration changes after the
preview. A directory outage retains existing managed grants and records stale
reconciliation history; it does not remove manual assignments.
