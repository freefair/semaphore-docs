# OIDC Group Mapping

Enhanced OIDC group mapping converts one configured, verified claim into provider-owned global or project role assignments. It extends the existing OIDC login path without changing whether OIDC login itself is edition-gated.

## Claim boundary

Each configured provider may select one dotted claim path, for example `groups` or `realm.groups`. The parser accepts only a string or an array containing only strings. Path depth, group count, and value length are bounded before mapping. Values are trimmed and deduplicated; case folding occurs only when `group_claim_case_insensitive` is explicitly enabled.

The verified ID token or user-info response stays inside the existing OIDC boundary. Only the normalized selected claim is passed to the mapping service. Raw tokens and unrestricted claim documents are not accepted by the administration API and are not written to reconciliation history, audit events, logs, or the UI.

An absent configured claim has an explicit policy:

- `preserve` retains the provider's last known managed assignments;
- `clear` computes removals for assignments owned by that provider.

Malformed or oversized claims fail login before a session is created. Account linking does not parse or reconcile group mappings.

## Mapping and reconciliation

A mapping binds one normalized claim value to one explicit role target:

- a global role ID; or
- a project ID and project role ID.

Targets are validated when a mapping is saved. Mapping changes increment a provider-scoped revision. Preview and login reconciliation both read that revision and compute the same deterministic additions, removals, unknown values, collisions, and protected-administrator violations.

After a successful OIDC identity verification and user resolution, login applies the computed changes in one SQL transaction. One stale-revision retry is allowed; a second stale result preserves the existing assignments and records a bounded failure. Other reconciliation failures also retain the verified login and last known access rather than partially applying policy.

Assignment ownership is `(oidc, provider ID, mapping ID)`. A removal must match all three values. Consequently, OIDC reconciliation cannot remove or adopt an equivalent manual assignment, LDAP-managed assignment, or assignment owned by another OIDC provider. Existing global and project administrator invariants are checked while the corresponding mutation authorities are locked.

## Administration API

All endpoints require the existing verified administrator middleware.

| Method and path | Purpose |
|---|---|
| `GET /api/capabilities/oidc/group-mapping/providers` | List secret-free provider and claim configuration projections |
| `GET /api/capabilities/oidc/group-mappings?provider_id={id}` | List mappings for one provider |
| `PUT /api/capabilities/oidc/group-mappings/{mapping_id}` | Create or update a mapping with optimistic revision control |
| `DELETE /api/capabilities/oidc/group-mappings/{mapping_id}` | Delete a mapping with optimistic revision control |
| `POST /api/capabilities/oidc/group-mappings/preview` | Preview selected scalar or string-array group values for a user |
| `GET /api/capabilities/oidc/group-mappings/history?provider_id={id}` | Read redacted reconciliation history |
| `GET /api/capabilities/oidc/group-mappings/assignments?provider_id={id}` | Read effective assignments owned by the provider |

There is no administrative apply endpoint. Preview is diagnostic; role changes occur only during a successful login by the affected user.

## Persistence and edition boundary

Migration `v2.20.32` creates provider-scoped mapping state, mappings, managed-assignment ownership, and redacted reconciliation history. Project membership stores the managed-assignment reference needed to distinguish OIDC ownership from manual and LDAP ownership.

The shared contracts are exported from `pro_interfaces/oidc.go` and `pro_interfaces/oidc_group_mapping.go`. The enhanced module supplies the service implementation through the existing edition seam; community supplies an unavailable stub. The existing OIDC provider configuration and login gate remain otherwise unchanged.
