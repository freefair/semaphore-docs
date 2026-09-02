# Slice 063 — Template Search

A project user can quickly filter the templates they are already allowed to see by name, description, playbook, or tag and operate the result with keyboard or pointer.

| Field | Value |
|---|---|
| Selection | B14 |
| Depends on | 005 |
| Primary paths | template query API/repository, `Templates.vue`, translations and frontend tests |
| Out of scope | Full-text ranking across projects and wholesale merge of `origin/feat/template-search` |

## Implementation

- [x] Port the focused interaction intent from `origin/feat/template-search` onto the current template list.
- [x] Define case-insensitive literal matching over normalized name, description, playbook, and tag fields with deterministic tie-breaking.
- [x] Apply permission filtering before matching and pagination so search cannot disclose hidden templates or counts.
- [x] Add a bounded `search` query to the template list API and implement database-specific escaping consistently across supported SQL engines.
- [x] Debounce browser input, cancel stale requests, retain query in the URL, and reset pagination when it changes.
- [x] Add a labeled search control, clear action, result count, no-results state, highlighted matched field without unsafe HTML, and keyboard focus behavior.
- [x] Keep empty-query ordering and existing list actions unchanged.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: normalization, field matching, literal wildcard handling, deterministic ordering, and safe highlighting |
| Integration | Required: repository search on PostgreSQL, MySQL/MariaDB, and SQLite with pagination and permission filtering |
| API | Required: each field, combined values, empty/long/special-character query, pagination, and hidden-template contracts |
| UI | Required: component tests plus browser evidence for typing, stale-request cancellation, keyboard use, URL restore, clear, and no results |

- [x] Search never reveals a template or count hidden by normal list permissions.
- [x] SQL wildcard and control characters are treated as bounded literal input.
- [x] Clearing the query restores the original deterministic list and page behavior.

## Acceptance Evidence

- Repository and API tests cover every searchable field, combined values, permission-first filtering, deterministic pagination, query bounds, and literal `%`, `_`, `!`, backslash, Unicode, and control-character input.
- SQLite executes the parameterized repository query; dialect preparation tests verify the same escaped placeholder contract for PostgreSQL and MySQL/MariaDB without requiring external services.
- Component tests cover debounce, stale-request cancellation, URL restoration, safe text-segment highlighting, keyboard shortcuts, and the no-results state.
- Browser acceptance on the disposable Enhanced instance verifies the existing list actions, view changes, browser history, clear behavior, keyboard focus, and a 390-pixel layout without horizontal overflow or browser/HTTP errors.
- Core, Community, and Enhanced Go tests and vet, the focused race test, the frontend suite and builds, OpenAPI parsing, documentation build, and final Terra security review pass.
