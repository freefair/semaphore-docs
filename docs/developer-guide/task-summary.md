# Persisted Ansible Task Summaries

The enhanced edition stores a normalized Ansible result summary while a task runs. The summary is a durable projection of versioned runner events; page refreshes and repair operations read those persisted events and never parse the raw task log.

## Event contract

Semaphore currently supports runner result contract version 1. Its aggregate Ansible callback emits JSON Lines records for:

- individual task results, including play, stage, host, status, timing, and a bounded redacted error;
- final per-host counters; and
- a completion record containing the expected host count.

Event identity is stable within a task. Repeated delivery is ignored, and out-of-order delivery is recomputed into the same summary. Retry attempts receive distinct identities so they remain separate stage results.

An event with a newer contract version creates a summary with state **unsupported**. The server retains the runner version and a diagnostic, leaves the task status unchanged, and does not attempt to interpret unknown fields.

## Summary states

| State | Meaning |
|---|---|
| collecting | The task is not terminal and supported events are still being accepted. |
| complete | The completion record and every expected host summary were persisted. |
| partial | Collection or completion was interrupted, or expected host summaries are missing. Available data remains readable with a diagnostic. |
| empty | A terminal task produced no supported summary events. |
| unsupported | The runner emitted a result contract version the server cannot interpret. |

Summary persistence is non-authoritative for task execution. A parser, callback, or summary database failure cannot turn a successful task into a failed task or change any other terminal result. Terminal reads repair the projection from persisted summary events when possible.

## Data exposure and bounds

Every summary lookup validates both project and task identity. Host names and redacted errors from another project are therefore not distinguishable through these endpoints.

The host, stage, and error endpoints use descending cursor pagination. The default page size is 50 and the server-enforced maximum is 200. Error text is stripped of ANSI control sequences, common credential forms, bearer values, URL credentials, and private keys before persistence, then bounded to 4 KiB.

## API

The enhanced task API exposes:

- `GET /api/project/{project_id}/tasks/{task_id}/ansible/summary`
- `GET /api/project/{project_id}/tasks/{task_id}/ansible/summary/hosts`
- `GET /api/project/{project_id}/tasks/{task_id}/ansible/summary/stages`
- `GET /api/project/{project_id}/tasks/{task_id}/ansible/summary/errors`

Paged endpoints accept count and before. The response contains items and, when another page exists, next_cursor.
