# Slice 055 — Workflow Versions and Cross-Project References

An authorized user can compare and restore immutable workflow versions, and a workflow can use another project's approved resource only through an explicit grant.

| Field | Value |
|---|---|
| Selection | E07 |
| Depends on | 037, 046, 054 |
| Primary paths | workflow version/grant repositories, reference resolver, workflow APIs and UI |
| Out of scope | Implicit access through matching names and mutable references to a project's latest resource |

## Implementation

- [x] Create an immutable version for every successful definition mutation with author, time, parent revision, bounded message, and content fingerprint.
- [x] Store runs against an exact workflow version and exact referenced resource versions.
- [x] Provide structural diff for metadata, nodes, edges, parameters, permissions, and references.
- [x] Implement restore as creation of a new version rather than mutation or deletion of history.
- [x] Model a cross-project grant from an owning project resource/version range to a consuming project and permitted operation.
- [x] Require both resource-owner grant and consuming-user permission during save, start, and runtime resolution.
- [x] Snapshot resolved grants and resource versions at start, and define revocation as blocking new runs without corrupting existing audit history.
- [x] Add version timeline, compare, restore preview, grant management, reference picker, and revoked-reference remediation UI.

## Implemented contracts

### Immutable workflow history

Every successful workflow definition mutation appends a `WorkflowVersion` with a monotonically increasing version number, parent version, actor, timestamp, bounded message, canonical content fingerprint, and immutable definition snapshot.
The canonical representation covers metadata, graph nodes and edges, parameters, access policies, approval policies, artifacts, triggers, and cross-project references.
Legacy definitions receive a baseline version before their next mutation or run so exact provenance is available without rewriting prior state.

The version list is cursor-bounded, version detail returns one immutable snapshot, and structural diff reports before/after changes by domain section.
Restore validates the selected snapshot and appends a new version with `restored_from_version_id`; it never updates or deletes the source version.
Concurrent definition edits continue to use the workflow revision contract, while nested access and approval policy revisions are the only client-visible policy CAS tokens.

Every run stores the exact workflow version ID.
Each cross-project task node additionally stores the grant ID and revision, owner and consumer projects, template ID, immutable template version ID and number, and content fingerprint used by that run.

### Immutable template versions and grants

Publishing a template version snapshots the full executable template definition and its exact nested BuildTemplate dependencies.
Publishing unchanged content reuses the existing immutable version rather than creating duplicate history.
Runtime-secret references are stored only as value-free provider and object descriptors.

A grant binds one owner project template, an inclusive immutable version range, one consumer project, and the `reference`, `execute`, or combined operation mask.
The lifecycle is `pending` → `active` after consumer acceptance → `revoked`; inactive grants can be deleted.
Mutable grant operations require an expected revision and fail with a conflict when another actor changed the grant first.
Active or pending grants fence covered template versions and referenced nested versions from deletion.

Owner and consumer project administrators are resolved from persisted membership at every lifecycle transition.
The consumer project must exist, must differ from the owner project, and cannot discover unrelated grants or versions.
List and detail denial use hidden-resource behavior so IDs cannot be enumerated through response differences.

### Save, start, and runtime fences

The workflow client submits only a grant ID and exact template version number.
The server derives and persists immutable owner, consumer, template, grant-revision, version-ID, and fingerprint provenance after validating both the live owner grant and the current consuming actor permission.
Definition save and run start revalidate that provenance in the same transaction that commits the definition or run snapshot.

Runtime dispatch performs a second atomic grant, version, provenance, lifecycle, and consumer-capacity check before inserting the task.
The task is queued only after the transaction commits.
Owner-side repository, inventory, environment, and credential values are resolved just in time and are neither persisted in the consumer workflow/run snapshot nor returned by discovery APIs.
Revocation therefore blocks new saves, starts, and dispatches while already committed run and audit history remains readable.

### API boundaries

| Method | Path | Contract |
|---|---|---|
| `GET` | `/project/{project_id}/workflows/{workflow_id}/versions` | List a bounded immutable version timeline. |
| `GET` | `/project/{project_id}/workflows/{workflow_id}/versions/{version_number}` | Read one immutable definition snapshot. |
| `GET` | `/project/{project_id}/workflows/{workflow_id}/versions/diff?from={n}&to={n}` | Return a structural before/after diff. |
| `POST` | `/project/{project_id}/workflows/{workflow_id}/versions/{version_number}/restore` | Validate and append a restored version. |
| `POST` | `/project/{owner_project_id}/templates/{template_id}/versions` | Publish or reuse an immutable template version. |
| `GET` | `/project/{owner_project_id}/templates/{template_id}/versions` | List bounded immutable template versions. |
| `POST` | `/project/{owner_project_id}/templates/{template_id}/cross-project-grants` | Create a pending grant. |
| `GET` | `/project/{project_id}/cross-project-template-grants` | List only grants in which the project participates. |
| `PUT` | `/project/{project_id}/cross-project-template-grants/{grant_id}` | Update a pending grant with revision CAS. |
| `DELETE` | `/project/{project_id}/cross-project-template-grants/{grant_id}?expected_revision={n}` | Delete an inactive grant with revision CAS. |
| `POST` | `/project/{project_id}/cross-project-template-grants/{grant_id}/accept` | Accept a pending grant as the consumer project. |
| `POST` | `/project/{project_id}/cross-project-template-grants/{grant_id}/revoke` | Revoke a grant with revision CAS and a required reason. |
| `GET` | `/project/{project_id}/cross-project-template-grants/{grant_id}/references` | Resolve only safe exact-version picker entries. |

Grant mutation bodies accept only their documented lowercase `snake_case` fields and are limited to 8 KiB.
Unknown or case-variant field names, malformed pagination, invalid ranges, invalid operation masks, and malformed expected revisions are rejected.
Community implementations keep the same interfaces and return unavailable-resource behavior without importing Enhanced code.

### Minimal existing-surface UI

The existing workflow editor adds one version-history action, one shared-template action, an optional version message, and exact shared versions in the existing task-template picker.
The existing template toolbar adds one shared-template action for resource managers.
No new navigation section or replacement editor surface is introduced, which keeps the patch small and upstream-compatible.

Selecting a shared template stores the exact grant/version coordinates and removes local task parameters and override-policy inputs that cannot safely apply to an owner-controlled template.
A persisted revoked or otherwise unavailable reference remains visible as an unavailable picker item with remediation guidance instead of silently switching to another version.
The editor and grant dialog stack at the existing mobile breakpoint and do not introduce horizontal document overflow.

### Audit

Version publication, grant create/update/delete/accept/revoke, and exact reference resolution use explicit allow-listed audit actions.
Records contain stable project, template, version, range, operation, grant-revision, fingerprint, actor, and correlation provenance without secret values.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: version fingerprint/diff, restore, grant scope, dual authorization, resolution, and revocation decisions |
| Integration | Required: immutable history and two-project grant flows for save/start/run, concurrent edit, revoke, restore, and deletion guard |
| API | Required: versions/diff/restore, grant CRUD, reference resolution, unauthorized/revoked/stale access, and list filtering contracts |
| UI | Required: browser evidence for edit history, diff, restore, grant, cross-project run, revoked reference, and denied discovery |

- [x] Version history is append-only and restoring preserves the version being restored from.
- [x] A user cannot discover or use a cross-project resource without both sides of authorization.
- [x] Every run can identify the exact definition, resource versions, and grants it used.
