# Slice 063 — Template Search

A project user can quickly filter the templates they are already allowed to see by name, description, playbook, or tag and operate the result with keyboard or pointer.

| Field | Value |
|---|---|
| Selection | B14 |
| Depends on | 005 |
| Primary paths | template query API/repository, `Templates.vue`, translations and frontend tests |
| Out of scope | Full-text ranking across projects and wholesale merge of `origin/feat/template-search` |

## Implementation

- [ ] Port the focused interaction intent from `origin/feat/template-search` onto the current template list.
- [ ] Define case-insensitive literal matching over normalized name, description, playbook, and tag fields with deterministic tie-breaking.
- [ ] Apply permission filtering before matching and pagination so search cannot disclose hidden templates or counts.
- [ ] Add a bounded `search` query to the template list API and implement database-specific escaping consistently across supported SQL engines.
- [ ] Debounce browser input, cancel stale requests, retain query in the URL, and reset pagination when it changes.
- [ ] Add a labeled search control, clear action, result count, no-results state, highlighted matched field without unsafe HTML, and keyboard focus behavior.
- [ ] Keep empty-query ordering and existing list actions unchanged.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: normalization, field matching, literal wildcard handling, deterministic ordering, and safe highlighting |
| Integration | Required: repository search on PostgreSQL, MySQL/MariaDB, and SQLite with pagination and permission filtering |
| API | Required: each field, combined values, empty/long/special-character query, pagination, and hidden-template contracts |
| UI | Required: component tests plus browser evidence for typing, stale-request cancellation, keyboard use, URL restore, clear, and no results |

- [ ] Search never reveals a template or count hidden by normal list permissions.
- [ ] SQL wildcard and control characters are treated as bounded literal input.
- [ ] Clearing the query restores the original deterministic list and page behavior.
