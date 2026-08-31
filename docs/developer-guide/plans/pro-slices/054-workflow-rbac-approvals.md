# Slice 054 — Workflow RBAC and Role Approvals

A workflow author can restrict start, edit, view, and approve actions to explicit roles, including approval steps that require a different authorized role.

| Field | Value |
|---|---|
| Selection | E07 |
| Depends on | 036, 045–048 |
| Primary paths | workflow permission model, role evaluator, approval service, workflow and approval UI |
| Out of scope | Immutable version history and cross-project references |

## Implementation

- [x] Add stable workflow view, edit, start, stop, and administer permissions to the typed permission catalog.
- [x] Allow a workflow to narrow start and view access to selected project roles without granting broader project permissions.
- [x] Extend approval nodes with any-of/all-of role requirements, minimum distinct approvers, and separation from run initiator.
- [x] Snapshot required role IDs and policy when a run starts while evaluating the actor's current effective roles at decision time.
- [x] Define behavior when a role is deleted or an approver loses access during a pending request.
- [x] Enforce list filtering, detail access, mutations, starts, stops, approvals, and run logs in backend services.
- [x] Explain effective access and approval eligibility in editor, run, and approval inbox views.
- [x] Audit denied actions and every approval contribution with policy revision and role provenance.

## Implemented contracts

### Workflow permissions

Project roles use five independent permission IDs: `workflow.view`, `workflow.edit`, `workflow.start`, `workflow.stop`, and `workflow.administer`.
Built-in roles retain their pre-slice behavior, and migration `2.20.49` maps existing project-scoped custom-role permissions to the corresponding workflow permissions.
Global roles are not treated as project workflow roles and are not migrated into implicit workflow access.

Workflow definitions may narrow view and start access to stable role references.
Built-in references use `builtin:<role>` and custom project roles use `role:<immutable-role-id>`.
Empty view or start role lists preserve permission-only behavior.
Unknown or deleted role references fail closed.

Workflow runs retain the access policy in their immutable definition snapshot.
Run detail, artifacts, approval history, and workflow-owned task logs therefore use the policy that existed when the run started rather than the current editable definition.

### Current role evaluation

Every authorization decision resolves the actor's current project membership and current role revision.
Manual, LDAP-managed, and OIDC-managed assignments share one fail-closed resolver.
Directory provenance is accepted only when the membership, managed-assignment ledger, enabled mapping, mapping revision, and latest applied reconciliation agree.
The resolver exposes only stable identifiers and a SHA-256 fingerprint of the directory or claim revision.

Membership removal, role reassignment, role deletion, mapping disablement, and directory reconciliation changes affect subsequent actions immediately.
They do not rewrite workflow or approval snapshots.

### Approval policies and contributions

Approval nodes support `any_of` and `all_of` role policies, a minimum number of distinct approvers, and initiator separation.
New approval nodes require explicit role policies.
Pre-`2.20.49` approval nodes retain a compatibility path that synthesizes stable role IDs once and persists that immutable snapshot before accepting a contribution.
An explicit role policy cannot be cleared back to the legacy permission-based behavior.

Each actor may contribute once per approval request.
An approval contribution records the decision, comment, actor, selected stable role, role revision, policy revision, timestamp, correlation ID, and bounded assignment provenance.
An `all_of` policy requires every selected role to be covered and may require additional distinct contributors for the same selected roles.
A valid rejection is terminal immediately.

Membership and role provenance are resolved inside the same database transaction that inserts the contribution.
The transaction also arbitrates duplicate actors, deadline expiry, quorum completion, and the single terminal approval transition.
A deleted required role remains in the immutable snapshot and makes the unsatisfied request fail closed until rejection, cancellation, or timeout.

### API and UI boundaries

Workflow collections are filtered before serialization.
Hidden workflow, run, artifact, approval-history, and workflow-task resources return `404`.
Visible resources with a denied mutation return `403`.
Generic task lists refill filtered pages so hidden workflow tasks do not create incomplete or misleading pagination.

The existing workflow list, editor, run view, and approval inbox expose only compact `effective_access`, current eligibility, policy revision, mode, minimum approvers, and persisted contribution count.
No directory provider, mapping, claim, group, or reconciliation value is returned to the UI.
An eligible pending approver may read the specific run and artifacts required for the decision without gaining workflow-list visibility.

### Audit

Workflow actions use an explicit allow-listed audit taxonomy.
Denied workflow access and every committed approval contribution include the server-owned policy revision.
Contribution events include bounded role provenance from the committed contribution row.
User decisions are API-sourced, timeout decisions are worker-sourced, and arbitrary idempotency keys are represented by a deterministic bounded audit correlation fingerprint.
The audit webhook remains on schema v1; workflow policy and role provenance are persisted in the database audit JSON and are intentionally not added to that frozen envelope.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: permission matrix, role policy, distinct approvers, separation, deletion/revocation, and snapshot rules |
| Integration | Required: multi-user roles, directory-managed roles, concurrent approvals, revocation, and audit persistence |
| API | Required: view/edit/start/stop/list/log/approve allow-deny matrix and direct-call bypass attempts |
| UI | Required: multi-user browser evidence for hidden/visible workflows, denied edit/start, staged role approvals, and revoked eligibility |

- [x] A workflow or run hidden by policy is absent from list and detail responses.
- [x] The initiator cannot satisfy a separated approval through another session.
- [x] Role removal takes effect for future actions without rewriting the immutable run policy snapshot.
