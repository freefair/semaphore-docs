# Custom Project Roles

Enhanced Edition lets a project administrator define a project-scoped role, assign it to a project member, and enforce that role at the backend API boundary.
Community Edition keeps the same shared interfaces and built-in roles but reports custom project roles as unavailable.

[[toc]]

## Permission Contract

The backend owns the assignable permission catalog.
Each catalog entry has a stable ID, English description, project scope, numeric permission bit, and a typed list of capability prerequisites.
The UI reads this catalog instead of maintaining a second checkbox model.

| Stable ID | Permission bit | Meaning |
|---|---:|---|
| `project.tasks.run` | `1` | Run project tasks |
| `project.settings.update` | `2` | Update project settings |
| `project.resources.manage` | `4` | Create, update, and delete project resources |
| `project.members.manage` | `8` | Manage project members and custom roles |
| `project.resources.view` | `16` | View project resources |

The `project_roles` capability gates every custom-role read and mutation.
The clean-room Enhanced implementation exposes read and write access as active.
The Community provider returns `unavailable`, and its role controller preserves the existing empty or not-found responses without accessing a repository.

## Built-in Compatibility

Built-in roles remain deterministic and are not converted into custom-role rows.
The new view bit makes the existing read behavior explicit; it does not remove access that the previous GET-compatible middleware allowed.

| Built-in role | Effective permission bits |
|---|---:|
| Owner | `31` |
| Manager | `21` |
| Task Runner | `17` |
| Guest | `16` |

Clients continue sending the built-in slugs `owner`, `manager`, `task_runner`, and `guest` when assigning those roles.

## Persistence and Concurrency

Migration `2.20.29` adds an immutable `role_id` and revision to project roles, plus `role_id` and revision to project memberships.
Existing project-role slugs are copied into `role_id`, existing custom-role assignments are linked within their project, and project custom roles receive the explicit view permission.
The legacy slug remains an internal compatibility key and is not editable through the custom-role UI.

Display names are unique within one project but may be reused in another project.
Every role lookup, update, delete, and assignment includes the current project ID.
A role from another project therefore behaves as absent rather than becoming assignable by ID or legacy slug.

Role and membership updates use compare-and-swap revisions.
Exactly one concurrent writer can advance a revision; stale updates return a conflict and do not overwrite the winning value.
A role cannot be deleted while any membership references it.

The reverse migration removes the additive identity and revision columns, clears only the view bit added to project custom roles, and retains the legacy role and membership rows.

## HTTP Contract

All routes require an authenticated project member.
Custom-role routes additionally require `project.members.manage` and the `project_roles` capability.

| Operation | Route | Success |
|---|---|---:|
| List project roles | `GET /api/project/{project_id}/roles` | `200` |
| List permission catalog | `GET /api/project/{project_id}/roles/permissions` | `200` |
| Read own project role | `GET /api/project/{project_id}/role` | `200` |
| Create role | `POST /api/project/{project_id}/roles` | `201` |
| Read role | `GET /api/project/{project_id}/roles/{role_id}` | `200` |
| Update role | `PUT /api/project/{project_id}/roles/{role_id}` | `200` |
| Delete role | `DELETE /api/project/{project_id}/roles/{role_id}?revision={revision}` | `204` |
| List assignable project roles | `GET /api/project/{project_id}/roles/all` | `200` |
| Assign role to member | `PUT /api/project/{project_id}/users/{user_id}` | `204` |
| Read effective member permissions | `GET /api/project/{project_id}/users` | `200` |

Create accepts only a display name and numeric permission bitset:

```json
{
  "name": "Resource viewer",
  "permissions": 16
}
```

Update includes the immutable ID and current revision:

```json
{
  "id": "role_0123456789abcdef0123456789abcdef",
  "name": "Resource operator",
  "permissions": 20,
  "revision": 1
}
```

Assignment uses the built-in slug or immutable custom-role ID in `role` and includes the current membership revision:

```json
{
  "role": "role_0123456789abcdef0123456789abcdef",
  "revision": 3
}
```

Member responses expose `role_id`, `revision`, and `effective_permissions` in addition to the existing role field.
The role field contains the immutable role ID for a custom assignment.
The current-member role response additionally exposes `role_name`, which contains the custom role display name while preserving the immutable ID in `role`.

| Status | Stable code or meaning |
|---:|---|
| `400` | Invalid role reference, unknown permission bit, or missing delete revision |
| `403` | Missing project permission or unavailable capability |
| `404` | Role is absent from the current project |
| `409` | `PROJECT_ROLE_REVISION_CONFLICT`, `PROJECT_ROLE_ASSIGNED`, `PROJECT_MEMBERSHIP_REVISION_CONFLICT`, or `LAST_PROJECT_ADMINISTRATOR` |

## Enforcement and Audit

Repository access is the first complete resource path using the new view permission.
`GET /api/project/{project_id}/repositories` requires `project.resources.view` even for direct API calls.
Repository mutations continue requiring `project.resources.manage`, so a resource-viewer role can list repositories but receives `403` when attempting to create, update, or delete one.
A role without the view bit receives `403` for the list route as well.

Membership mutation checks the resulting effective permissions inside the same serialized SQL boundary.
Removing, deleting, or demoting the final member with `project.members.manage` returns `LAST_PROJECT_ADMINISTRATOR`.
The invariant recognizes both the Owner built-in role and custom administrative roles.

Role create, update, delete, assignment, member add, and member removal pass through the Enhanced project audit middleware.
Audit outcomes distinguish allowed, denied, and failed operations and contain project-scoped role or membership targets without request-body data.
The existing event log remains active for project membership mutations.

## User Interface

The implementation reuses the existing Roles and Team pages.
The Roles page reads the permission catalog, uses immutable IDs for edit and delete actions, sends revisions, and shows a permission-denied state for direct navigation without member-management access.
The Team page uses the same built-in and custom role selector and displays the effective permission chips next to each assignment.
The Roles tab and repository navigation are hidden when the corresponding backend permission is absent.

No new navigation hierarchy, settings page, or alternate role editor is introduced.
This keeps the shared UI close to upstream while making backend enforcement authoritative.

## Verification

Run the focused backend and edition contracts with:

```bash
go test ./db ./db/sql ./api/projects ./api ./pro_interfaces -count=1
(cd pro && go test ./api ./pkg/features -count=1)
(cd test/edition-contract/enhanced && go test ./api ./pkg/features -count=1)
```

Run the UI contract, targeted lint, and production build with:

```bash
cd web
NODE_OPTIONS=--localstorage-file=/tmp/semaphore-ui-test-localstorage \
  yarn test:unit tests/unit/project-roles.spec.js
node_modules/.bin/eslint \
  src/App.vue src/lib/constants.js src/lib/project-permissions.js \
  src/components/ItemListPageBase.js src/components/EditRoleForm.vue \
  src/components/TeamMenu.vue src/components/TeamMemberForm.vue \
  src/views/Roles.vue src/views/project/Team.vue src/views/project/Invites.vue \
  src/lang/en.js tests/unit/project-roles.spec.js
VUE_APP_OUTPUT_DIR=/tmp/semaphore-project-roles-build yarn build
```

Browser acceptance uses two project members.
An administrator creates and assigns a viewer role, the viewer lists repositories, a direct mutation is denied, and demoting the final project administrator is rejected.
