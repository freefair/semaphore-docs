# Migration Policy

Semaphore migrations must preserve Community data across edition changes and must behave consistently on SQLite, MySQL/MariaDB, and PostgreSQL. SQL remains authoritative; an enhanced module may add schema, but Community code must remain usable when those tables exist.

## Ownership and Shipped Identity

The application repository's `maintenance/migrations.yml` is the reviewed ownership
ledger. Its immutable local IDs are the versions recorded in deployed databases;
`upstream_id` records the separate upstream identity. Upstream `2.20.2` and `2.20.3`
map to local `2.20.66` and `2.20.67` because the original local numbers were already
shipped. New upstream and fork migrations append after the local tail. Preserve
shipped SQL byte-for-byte and use a new migration for later corrections.

The maintenance checker validates registration state, ownership, unique upstream
mappings, and forward/rollback/dialect checksums. CI compares against the prior
reviewed ledger and rejects rewriting an old entry, even if its checksum changes
alongside SQL. See [maintenance tooling](upstream-maintenance-tooling.md).

## Executable Upgrade Fixture

The migration matrix captures the schema immediately before the first enhanced table as migration target `2.20.1`. This target is the current-`develop` fixture for all supported dialects. The fixture also creates a representative Community user so forward and rollback checks prove data survival rather than schema shape alone.

| CI job | Database engine | Registry dialect | Upgrade fixture |
|---|---|---|---|
| `migrate-sqlite` | SQLite | `sqlite` | `2.20.1` |
| `migrate-mysql` | MySQL 8.4 | `mysql` | `2.20.1` |
| `migrate-mariadb` | MariaDB 10.11 | `mysql` | `2.20.1` |
| `migrate-postgres` | PostgreSQL 12.22 | `postgres` | `2.20.1` |

`TestMigrationMatrix` runs the same lifecycle on each engine:

1. Refuse a server database that is not explicitly enabled, does not end in `_matrix`, or already contains application tables.
2. Migrate an empty database to the latest schema, capture a normalized semantic description of the enhanced tables, and insert the Community fixture.
3. Roll back to `2.20.1`, prove the enhanced tables are absent, and prove the Community fixture survived.
4. Migrate to the latest schema, compare it with the fresh-install semantics, and prove the Community fixture still exists.
5. Write enhanced data, reconnect with a new store, and prove the data survived the restart.

The normalized comparison covers column names, type families, nullability, and primary keys. Repository round trips separately verify generated identifiers and timestamp handling. Migration SQL is also transpiled and inspected for each registry dialect by unit tests.

Community capability tests run the Community provider against the rolled-back `2.20.1` schema. The provider remains unavailable without querying enhanced tables. Conversely, the matrix proves that ordinary Community repositories continue to work when the enhanced tables are present. This is the supported mixed-version window; running an enhanced provider before its required migrations is not supported.

## Change Staging

An additive migration may be applied in one release only when it creates an independent table or a nullable/defaulted column and does not rewrite an active or large table. All other changes use four separately deployable stages:

1. **Expand** — add compatible tables, columns, or indexes. Old and new binaries must both work after this stage.
2. **Backfill** — copy or transform existing data in bounded, restartable batches. Store progress durably and make each batch idempotent.
3. **Switch** — deploy code that reads the new representation. Dual-write only when reconciliation can detect and repair divergence.
4. **Contract** — remove the old representation only after the supported rollback window has closed and the backfill has been verified on every dialect.

Migration transactions must remain short. Large backfills do not run inside a schema-migration transaction, and schema changes must not depend on implicit constraint names, identifier quoting, generated-key syntax, or timestamp behavior from a single database engine.

## Reversibility and Recovery

Every migration is classified before merge:

- **Reversible:** the undo migration restores the preceding schema without discarding data that existed before the forward migration. The matrix must execute and verify it.
- **Conditionally reversible:** rollback is safe only before the switch or contract stage. The release notes and operator runbook must name that boundary.
- **Irreversible:** the original data cannot be reconstructed from the migrated database. The migration must not provide a misleading destructive undo path. Recovery uses the verified backup, and the release notes must state that rollback means restoring that backup.

Before applying a migration outside an ephemeral test environment, the operator must have:

- a database-native, transactionally consistent backup from immediately before migration;
- a recorded application version and migration-table version;
- a restore procedure tested against a separate database;
- enough free storage for the migration, its indexes, and the backup;
- a write-quiescence or online-migration plan appropriate to the change; and
- explicit success checks and a recovery decision point.

Stopping the application binary does not roll back committed schema changes. Disabling an enhanced capability also does not remove its tables or data. Use the migration CLI only after reviewing the undo SQL for every version in the requested range.

## Adding a Migration

For every new migration:

1. Register versions in strict ascending order in `db/Migration.go`.
2. Provide forward SQL that can be prepared for all three registry dialects.
3. Provide undo SQL only when it honestly restores the prior fixture.
4. Advance the executable fixture only when `develop` intentionally drops support for upgrading from its previous target.
5. Add semantic assertions for new tables or columns and repository round trips for dialect-sensitive behavior.
6. Run the real CI matrix for SQLite, MySQL, MariaDB, and PostgreSQL before release.

The server-database test is opt-in through `SEMAPHORE_MIGRATION_MATRIX=1`. Connection settings are supplied through the dedicated `SEMAPHORE_MIGRATION_MATRIX_DB_*` environment variables; the harness never accepts a populated database.
