# Slice 055 — Workflow Versions and Cross-Project References

An authorized user can compare and restore immutable workflow versions, and a workflow can use another project's approved resource only through an explicit grant.

| Field | Value |
|---|---|
| Selection | E07 |
| Depends on | 037, 046, 054 |
| Primary paths | workflow version/grant repositories, reference resolver, workflow APIs and UI |
| Out of scope | Implicit access through matching names and mutable references to a project's latest resource |

## Implementation

- [ ] Create an immutable version for every successful definition mutation with author, time, parent revision, bounded message, and content fingerprint.
- [ ] Store runs against an exact workflow version and exact referenced resource versions.
- [ ] Provide structural diff for metadata, nodes, edges, parameters, permissions, and references.
- [ ] Implement restore as creation of a new version rather than mutation or deletion of history.
- [ ] Model a cross-project grant from an owning project resource/version range to a consuming project and permitted operation.
- [ ] Require both resource-owner grant and consuming-user permission during save, start, and runtime resolution.
- [ ] Snapshot resolved grants and resource versions at start, and define revocation as blocking new runs without corrupting existing audit history.
- [ ] Add version timeline, compare, restore preview, grant management, reference picker, and revoked-reference remediation UI.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: version fingerprint/diff, restore, grant scope, dual authorization, resolution, and revocation decisions |
| Integration | Required: immutable history and two-project grant flows for save/start/run, concurrent edit, revoke, restore, and deletion guard |
| API | Required: versions/diff/restore, grant CRUD, reference resolution, unauthorized/revoked/stale access, and list filtering contracts |
| UI | Required: browser evidence for edit history, diff, restore, grant, cross-project run, revoked reference, and denied discovery |

- [ ] Version history is append-only and restoring preserves the version being restored from.
- [ ] A user cannot discover or use a cross-project resource without both sides of authorization.
- [ ] Every run can identify the exact definition, resource versions, and grants it used.
