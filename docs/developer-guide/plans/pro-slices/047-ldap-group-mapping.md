# Slice 047 — LDAP Group Mapping

An administrator can preview and apply LDAP group-to-role mappings, and a directory login receives exactly the managed assignments shown in the preview.

| Field | Value |
|---|---|
| Selection | E03 |
| Depends on | 027, 045–046 |
| Primary paths | LDAP group client, mapping/reconciliation service, role repository, mapping API and UI |
| Out of scope | Modifying LDAP groups and mapping OIDC claims |

## Implementation

- [ ] Define mappings from normalized immutable LDAP group identifiers to explicit global or project role IDs.
- [ ] Read group membership with bounded nested-group depth, cycle detection, paging, TLS, and escaped queries.
- [ ] Produce a dry-run diff containing additions, removals, unresolved users/groups, collisions, and protected-admin violations.
- [ ] Track assignment ownership so reconciliation removes only grants previously managed by the same mapping.
- [ ] Apply the diff transactionally after a fresh directory read and reject stale previews.
- [ ] Support login-time refresh plus an idempotent scheduled/manual reconciliation path with outage-safe behavior.
- [ ] Audit mapping changes and reconciliations while retaining stable external IDs instead of sensitive directory attributes.
- [ ] Render mapping editor, dry-run, apply confirmation, history, and unresolved-item remediation.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: normalization, nested/cyclic groups, ownership, diff, stale preview, and protected-admin rules |
| Integration | Required: disposable LDAP plus SQL roles for add/remove, rename, nested groups, outage, retry, and manual-grant preservation |
| API | Required: mapping CRUD, dry-run/apply/history, stale diff, unresolved target, protected admin, and permission contracts |
| UI | Required: component tests plus browser evidence for preview, apply, directory change, reconciliation, and unresolved mapping |

- [ ] A reconciliation never deletes a role assignment it does not own.
- [ ] Directory outage retains the last known grants and reports staleness instead of stripping access.
- [ ] Preview and applied result match unless the service rejects the stale preview.
