# Slice 045 — Custom Project Roles

A project administrator can define a custom role, assign it to a user, and see one real project action allowed or denied by that role.

| Field | Value |
|---|---|
| Selection | E02 |
| Depends on | 003, 005 |
| Primary paths | `db/Role.go`, role repository/service/controller, permission evaluator, project role UI |
| Out of scope | Global roles, template-level permissions, and directory group mapping |

## Implementation

- [x] Define a central typed permission catalog with stable identifiers, descriptions, scope, and capability prerequisites.
- [x] Persist project-scoped custom roles and immutable role IDs while allowing unique display names per project.
- [x] Add role assignment with explicit project membership and prevent assigning a role from another project.
- [x] Enforce the first complete permission path in backend service and API, including list visibility and mutation denial.
- [x] Preserve existing built-in project roles through a deterministic compatibility mapping.
- [x] Prevent removal of the last project administrator and audit role, permission, and assignment mutations.
- [x] Provide role CRUD, permission selection, assignment, effective-permission preview, and denied-state UI.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: permission catalog, scope checks, built-in mapping, effective permissions, and last-admin invariant |
| Integration | Required: role/assignment persistence, concurrent edits, project isolation, migration compatibility, and audit records |
| API | Required: role CRUD/assign/effective permissions plus allowed, denied, cross-project, stale, and capability contracts |
| UI | Required: component tests plus two-user browser evidence for creation, assignment, allowed action, denied action, and last-admin guard |

- [x] Direct API use cannot bypass the same permission enforced by the UI.
- [x] Existing project access remains equivalent immediately after migration.
- [x] A custom role or assignment never crosses its project boundary.
