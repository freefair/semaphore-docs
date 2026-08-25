# Slice 048 — OIDC Group Mapping

An administrator can preview OIDC group-claim mappings and a successful existing OIDC login receives the corresponding managed roles.

| Field | Value |
|---|---|
| Selection | E03 |
| Depends on | 045–046 |
| Primary paths | existing OIDC identity flow, claim mapping service, role repository, mapping API and UI |
| Out of scope | Enabling the separately unchecked P07 OIDC capability gate and provider administration beyond the existing baseline |

## Implementation

- [ ] Configure an allow-listed claim path and accepted scalar/array string shapes with strict size and count bounds.
- [ ] Normalize claim values without case folding unless the provider configuration explicitly declares case-insensitive semantics.
- [ ] Map claim values to explicit global or project role IDs and validate every target at save time.
- [ ] Produce a preview from a redacted captured claim fixture and display additions, removals, unknown values, and protected-admin violations.
- [ ] Track assignment ownership and replace only grants managed by this provider and mapping set after a successful login.
- [ ] Reject stale mapping revisions during login reconciliation and preserve last known access when the provider supplies no trusted group claim according to the configured missing-claim policy.
- [ ] Audit mapping and reconciliation decisions without persisting raw tokens or unrestricted claim sets.
- [ ] Render mapping editor, fixture preview, history, and effective managed assignments.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: claim parsing/bounds, normalization, mapping diff, ownership, missing-claim policy, and protected-admin rules |
| Integration | Required: signed OIDC fixtures plus SQL roles for array/scalar claims, mapping change, unknown group, missing claim, and retry |
| API | Required: mapping CRUD/preview/history, invalid claim shape, stale revision, target scope, and permission contracts |
| UI | Required: component tests plus browser evidence for mapping preview and an OIDC login that gains and loses managed access |

- [ ] Raw ID/access tokens and unrelated claims are absent from database, logs, audit, and UI.
- [ ] Mapping reconciliation never removes a manual or LDAP-owned assignment.
- [ ] This slice does not change whether OIDC login itself is edition-gated.
