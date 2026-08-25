# Slice 064 — Per-Schedule Timezones

A user can choose an IANA timezone for a schedule and see the backend-authoritative next run remain correct across daylight-saving changes.

| Field | Value |
|---|---|
| Selection | B24 |
| Depends on | 004 |
| Primary paths | schedule model/migrations, cron parser/scheduler, validation API, schedule form/list UI |
| Out of scope | User-profile timezone preferences and changing cron expression syntax beyond existing `CRON_TZ` compatibility |

## Implementation

- [ ] Add a nullable IANA timezone identifier to schedules with the existing global scheduler timezone as the compatibility fallback.
- [ ] Define precedence as an explicit cron expression timezone, then schedule timezone, then configured global timezone.
- [ ] Validate identifiers with the backend's installed timezone database and reject abbreviations and unknown zones.
- [ ] Calculate occurrences from wall-clock cron semantics in the effective zone and document skipped and repeated local times at DST boundaries.
- [ ] Return effective timezone and backend-computed next run in create, update, validation, list, and detail responses.
- [ ] Preserve existing schedules through additive migrations on PostgreSQL, MySQL/MariaDB, and SQLite.
- [ ] Populate the selector from browser-supported IANA zones, allow text search, and still submit every choice to backend validation.
- [ ] Show effective timezone and next run beside the expression before save and in schedule lists.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: precedence, valid/invalid zones, fixed offsets, spring gap, autumn overlap, and next-run calculations |
| Integration | Required: three-database migration/round-trip and scheduler occurrence identity across DST and restart |
| API | Required: create/update/validate/list/detail, fallback, explicit expression precedence, invalid zone, and permission contracts |
| UI | Required: component tests plus browser evidence for searchable selection, preview, edit/reopen, DST case, and backend rejection |

- [ ] Existing schedules keep their previous effective timezone after migration.
- [ ] UI and scheduler use the same backend-authoritative next-run calculation.
- [ ] A repeated wall-clock time produces only the documented occurrence set and never an accidental duplicate run.
