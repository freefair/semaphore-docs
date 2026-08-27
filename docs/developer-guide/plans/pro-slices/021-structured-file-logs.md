# Slice 021 — Structured File Logs

An operator can enable bounded, redacted JSON Lines logs for application events, task events, and results without changing normal task execution.

| Field | Value |
|---|---|
| Selection | P05 |
| Depends on | 005 |
| Primary paths | `pro_interfaces/log_write_svc.go`, enhanced log service, config, System Info UI |
| Out of scope | External webhook delivery and debug filtering |

## Implementation

- [x] Define versioned envelopes for application, task, and result records with timestamp, instance, correlation, project, and event type fields.
- [x] Put structured serialization, secret redaction, and path-safe file creation behind the enhanced log service interface.
- [x] Use a bounded asynchronous queue with a documented overflow policy so slow disks cannot block task execution indefinitely.
- [x] Create files with restrictive permissions and reject symlinks, traversal, and unsupported destinations.
- [x] Add size/time rotation, retention, flush-on-shutdown, and crash-safe line boundaries.
- [x] Expose effective configuration, queue depth, drops, last write error, and last successful flush through an authorized diagnostics API and System Info view.
- [x] Keep the Community no-op implementation and disabled enhanced configuration behavior unchanged.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: every schema, redaction corpus, path validation, queue overflow, and rotation decisions |
| Integration | Required: real filesystem permissions, concurrent writes, rotation, retention, shutdown flush, and simulated disk failure |
| API | Required: authorized diagnostics, disabled state, redacted write failure, and forbidden access contracts |
| UI | Required: component tests plus browser evidence for healthy, disabled, dropping, and failed writer states |

- [x] Every emitted line is independently valid JSON and carries a schema version.
- [x] Known secrets and credential-shaped values do not appear in output or diagnostics.
- [x] A blocked or full destination degrades logging visibly without stalling task processing.
