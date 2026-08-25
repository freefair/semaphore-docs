# Slice 046 — Global and Template Roles

A global administrator can delegate bounded system permissions and a project administrator can restrict template actions independently of broad project access.

| Field | Value |
|---|---|
| Selection | E02 |
| Depends on | 045 |
| Primary paths | role model/repository/service, global and template permission evaluators, role UI |
| Out of scope | Directory mappings and workflow-specific approval policy |

## Implementation

- [ ] Extend the permission catalog with explicit global and template scopes without interpreting string prefixes dynamically.
- [ ] Persist global role assignments separately from project membership and require a global grant for every global action.
- [ ] Add template permission overrides that inherit from the project role unless an explicit allow or deny is stored.
- [ ] Define deterministic evaluation order for global, project, template, ownership, and capability constraints.
- [ ] Apply enforcement to representative global administration and template read/run/edit/delete paths, including list filtering.
- [ ] Protect the last effective global administrator and provide a break-glass recovery procedure.
- [ ] Show effective permission provenance so administrators can explain which grant or deny decided an action.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: scope/evaluation matrix, inheritance, explicit deny, provenance, and last-admin invariant |
| Integration | Required: global/template assignments, migration, concurrent change, list filtering, and audit persistence |
| API | Required: global/template role workflows and representative allowed, denied, inherited, cross-scope, and permission contracts |
| UI | Required: component tests plus multi-user browser evidence for global delegation and template-specific allow/deny behavior |

- [ ] Project administration alone grants no global system permission.
- [ ] Template list and detail APIs do not disclose templates that the effective user cannot read.
- [ ] Effective-permission output explains the deciding scope and role without exposing unrelated assignments.
