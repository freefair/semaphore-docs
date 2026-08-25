# Slice 054 — Workflow RBAC and Role Approvals

A workflow author can restrict start, edit, view, and approve actions to explicit roles, including approval steps that require a different authorized role.

| Field | Value |
|---|---|
| Selection | E07 |
| Depends on | 036, 045–048 |
| Primary paths | workflow permission model, role evaluator, approval service, workflow and approval UI |
| Out of scope | Immutable version history and cross-project references |

## Implementation

- [ ] Add stable workflow view, edit, start, stop, and administer permissions to the typed permission catalog.
- [ ] Allow a workflow to narrow start and view access to selected project roles without granting broader project permissions.
- [ ] Extend approval nodes with any-of/all-of role requirements, minimum distinct approvers, and separation from run initiator.
- [ ] Snapshot required role IDs and policy when a run starts while evaluating the actor's current effective roles at decision time.
- [ ] Define behavior when a role is deleted or an approver loses access during a pending request.
- [ ] Enforce list filtering, detail access, mutations, starts, stops, approvals, and run logs in backend services.
- [ ] Explain effective access and approval eligibility in editor, run, and approval inbox views.
- [ ] Audit denied actions and every approval contribution with policy revision and role provenance.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: permission matrix, role policy, distinct approvers, separation, deletion/revocation, and snapshot rules |
| Integration | Required: multi-user roles, directory-managed roles, concurrent approvals, revocation, and audit persistence |
| API | Required: view/edit/start/stop/list/log/approve allow-deny matrix and direct-call bypass attempts |
| UI | Required: multi-user browser evidence for hidden/visible workflows, denied edit/start, staged role approvals, and revoked eligibility |

- [ ] A workflow or run hidden by policy is absent from list and detail responses.
- [ ] The initiator cannot satisfy a separated approval through another session.
- [ ] Role removal takes effect for future actions without rewriting the immutable run policy snapshot.
