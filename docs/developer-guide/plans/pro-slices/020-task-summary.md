# Slice 020 — Persisted Task Summary

After a task finishes, an authorized user sees the real affected hosts, failed hosts, and stage results instead of demonstration data.

| Field | Value |
|---|---|
| Selection | P04 |
| Depends on | 001–005 |
| Primary paths | task output parser, `TaskSummaryRepository`, task API, task summary UI |
| Out of scope | Cross-task analytics and long-term metrics aggregation |

## Implementation

- [x] Define a versioned task-summary model containing normalized host, stage, status, timing, and redacted error fields.
- [x] Parse supported runner result events incrementally and make repeated or out-of-order ingestion idempotent.
- [x] Persist the summary in the same completion boundary as the task terminal state, with a repair path for interrupted writes.
- [x] Scope repository and API reads by project permission and task identity.
- [x] Replace UI demonstration values with explicit loading, empty, partial, success, and failure states backed by the API.
- [x] Bound host and error result pages so a large inventory cannot exhaust the API or browser.
- [x] Document which runner result versions can produce a summary and how an unsupported version is represented.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: parser fixtures, normalization, redaction, duplicate events, and unsupported versions |
| Integration | Required: repository persistence, terminal-state atomicity, repair, pagination, and project isolation |
| API | Required: authorized summary, partial summary, empty summary, pagination, forbidden project, and missing task contracts |
| UI | Required: component states plus browser evidence for successful and partially failed multi-host tasks |

- [x] Refreshing the page returns the same persisted summary without reparsing logs.
- [x] A user cannot infer hosts or errors from a project they cannot access.
- [x] Summary failures never change the underlying task result and are visible as a diagnosable partial state.

Implementation details and verification commands are recorded in [Persisted Ansible Task Summaries](../../task-summary.md).
