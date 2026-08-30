# Global and Template Roles

Enhanced Edition separates instance-wide delegation from project membership and supports explicit per-template allow and deny overrides.
Community Edition keeps the shared models and routes but exposes no Enhanced role data.

[[toc]]

## Typed Permission Scopes

Permission IDs are resolved through the backend-owned catalog.
Callers never infer scope from a string prefix, and numeric permission bits are meaningful only together with their typed scope.

| Scope | Stable ID | Bit | Meaning |
|---|---|---:|---|
| Global | `global.users.manage` | `1` | Manage global users |
| Global | `global.roles.manage` | `2` | Manage global roles and assignments |
| Global | `global.system.manage` | `4` | Manage global system settings |
| Global | `global.audit.read` | `8` | Read the global audit log |
| Template | `template.read` | `1` | Read one template |
| Template | `template.run` | `2` | Run one template |
| Template | `template.edit` | `4` | Edit one template |
| Template | `template.delete` | `8` | Delete one template |

Global, project, and template masks use distinct Go types.
The same numeric bit in two scopes does not grant access across those scopes.
In particular, project administration alone grants no global permission.

## Evaluation Contract

Authorization evaluates a request in a fixed order:

1. Resolve the exact typed permission definition.
2. Evaluate the matching global or project grant.
3. For a template action, apply an explicit template deny first, then an explicit allow, then the project-role inheritance map.
4. Apply an ownership constraint, when the operation has one.
5. Apply the capability constraint last.

An ownership or capability denial can therefore revoke an otherwise allowed action.
An unknown permission fails closed.

Template inheritance is explicit:

| Template action | Inherited project permission |
|---|---|
| Read | `project.resources.view` |
| Run | `project.tasks.run` |
| Edit | `project.resources.manage` |
| Delete | `project.resources.manage` |

Each template action stores one of three states for a role:

- **Inherit** stores neither an allow nor a deny and follows the project role.
- **Allow** grants the action for this template even when the project role does not grant its mapped permission.
- **Deny** removes the action for this template even when the project role grants its mapped permission.

The effective-permission response contains one decision per catalog permission.
Each decision includes only the deciding scope, role, effect, or constraint.
It never returns unrelated role assignments.

## Persistence and Concurrency

Migration `2.20.30` adds a global permission mask to roles, a separate global-role assignment table, and revisioned template allow and deny masks.
Global assignments are independent of project membership.

Role, assignment, and template-override mutations use compare-and-swap revisions.
Stale mutations return a conflict instead of overwriting the winning change.
A global role cannot be deleted while it is assigned.

The migration preserves the legacy project and template permission columns for upstream compatibility.
It removes the legacy `role_slug` foreign key from template overrides because built-in roles intentionally have no row in the custom-role table; custom role references remain validated through the immutable role ID.
Existing template permissions are converted to the typed allow mask.
Fresh install, rollback to the Community baseline, re-upgrade, and restart persistence are verified on SQLite, MySQL, and PostgreSQL.

## Last Administrator and Break-glass Recovery

An effective global administrator is either:

- a built-in user with `admin=true`; or
- a user whose assigned global roles include `global.roles.manage`.

The repository serializes global-role mutations and rejects deleting or demoting a user, removing an assignment, or reducing a role when that change would leave no effective global administrator.
The stable conflict is `LAST_GLOBAL_ADMINISTRATOR`.

The built-in administrator remains the break-glass authority and receives all global permissions without an Enhanced role assignment.
Delegated user managers cannot set or clear the built-in `admin` flag.

If every delegated role assignment is unusable, recover from a trusted host with direct access to the configured Semaphore database:

1. Use the local [`semaphore user` CLI](../admin-guide/cli/users.md) to create a local user with `--admin`, or mark an existing local user as an administrator with `change-by-login --admin`.
2. Sign in with that local account and repair the global role or assignment.
3. Verify that at least two independent effective global administrators remain before retiring the recovery account.

Host and database access are the recovery authority.
Do not change role rows manually because that bypasses revision, audit, and last-administrator checks.

## HTTP Contract

Global-role routes require `global.roles.manage` and the `project_roles` capability.
Built-in administrators satisfy the global permission middleware through the break-glass rule.

| Operation | Route |
|---|---|
| List global permission catalog | `GET /api/roles/permissions` |
| List or create global roles | `GET`, `POST /api/roles` |
| Read or update a global role | `GET`, `PUT /api/roles/{role_id}` |
| Delete a global role | `DELETE /api/roles/{role_id}?revision={revision}` |
| List or add assignments | `GET`, `POST /api/users/{user_id}/global-roles` |
| Delete an assignment | `DELETE /api/users/{user_id}/global-roles/{assignment_id}?revision={revision}` |
| Explain effective global permissions | `GET /api/users/{user_id}/global-permissions` |
| Explain current template permissions | `GET /api/project/{project_id}/templates/{template_id}/permissions/effective` |

Template lists omit entries the current user cannot read.
Direct template detail, run, edit, and delete paths enforce their independent effective template permission.
Template overrides accept `allowed_permissions`, `denied_permissions`, and a positive `revision`; the same bit cannot be present in both masks.

## Audit and User Interface

Global role CRUD, assignment changes, delegated user and system administration, global audit reads, and template override changes pass through the Enhanced audit middleware.
Audit records contain bounded role, assignment, user, or template targets without request-body data.

The shared UI reuses existing surfaces:

- **Roles** edits global and legacy project permission masks separately.
- **Users** assigns global roles and shows effective global provenance in the existing user dialog.
- A template's existing **Permissions** tab edits inherit, allow, and deny states and shows the current user's effective provenance.

No new page or navigation hierarchy is introduced.

## Verification

Focused backend, edition-contract, and migration coverage includes scope isolation, inheritance, explicit deny, list filtering, bounded provenance, stale writes, concurrent last-administrator changes, audit persistence, and all three supported SQL dialects.
UI acceptance requires component tests plus two users in a rendered Enhanced instance: one built-in administrator delegates a global role, and one project role receives a template-specific allow and deny whose effective result is visible in the existing screens.
