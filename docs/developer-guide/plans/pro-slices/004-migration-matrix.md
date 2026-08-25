# Slice 004 — Enhanced Migrations Are Verified Across SQL Dialects

A maintainer can upgrade and roll back an enhanced schema fixture on every selected database without corrupting Community data.

| Field | Value |
|---|---|
| Selection | F05 |
| Depends on | 001 |
| Primary paths | `db/sql/migrations/`, `db/Migration.go`, repository fixtures |
| Out of scope | Choosing the deployment database for the user |

## Implementation

- [ ] Capture the current `develop` schema as upgrade fixtures for SQLite, PostgreSQL, and MySQL/MariaDB.
- [ ] Add a migration harness for forward, rollback, restart, and mixed-version checks.
- [ ] Require expand/backfill/switch/contract staging for active or large tables.
- [ ] Define backup prerequisites and explicit handling for irreversible transformations.
- [ ] Make enhanced tables harmless when the Community module is active.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: migration registry ordering and dialect selection |
| Integration | Required: real upgrade/rollback fixtures for every supported dialect |
| API | N/A: no user API behavior changes in this risk-reduction slice |
| UI | N/A: no visible behavior changes |

- [ ] A fresh install and current-schema upgrade reach the same semantic schema.
- [ ] Reversible migrations restore the prior fixture.
- [ ] No migration assumes one SQL dialect's syntax or constraint behavior.
