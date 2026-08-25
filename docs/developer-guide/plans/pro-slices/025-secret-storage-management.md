# Slice 025 — Managed Secret Storage

An administrator can manage an approved Vault or OpenBao storage and deliberately synchronize selected Semaphore keys with visible, auditable results.

| Field | Value |
|---|---|
| Selection | P06 |
| Depends on | 024 |
| Primary paths | enhanced secret storage service, synchronization worker, storage API and UI |
| Out of scope | Automatic bidirectional conflict merging and unselected external providers |

## Implementation

- [ ] Add storage list, update, delete, enable, and permission checks to the enhanced service behind existing interfaces.
- [ ] Model synchronization direction explicitly and default a new storage to read-only runtime resolution.
- [ ] For outbound synchronization, write only administrator-selected keys to explicit remote paths and record a value-free content fingerprint.
- [ ] Use a durable operation record and compare-and-set state so retries are idempotent and concurrent syncs cannot overwrite a newer request.
- [ ] Detect remote version conflicts and require a new explicit decision instead of silently choosing a winner.
- [ ] Schedule refresh through a lease-safe worker and retain manual sync as the first observable workflow.
- [ ] Display last attempt, last success, changed references, skipped items, conflicts, and redacted errors in the UI.
- [ ] Audit every configuration mutation and synchronization without recording secret values.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: direction policy, path mapping, fingerprints, conflict detection, state transitions, and redaction |
| Integration | Required: SQL operation records plus fake provider for create/update/delete, duplicate retry, conflict, outage, and recovery |
| API | Required: storage CRUD, manual sync, conflict response, history, permissions, and write-only credential contracts |
| UI | Required: component tests plus browser evidence for read-only setup, manual sync, conflict, failure, and recovery |

- [ ] A retry of the same synchronization operation cannot create a second logical write.
- [ ] Read-only storage never performs a remote mutation.
- [ ] Operators can explain the last synchronization outcome without gaining access to secret values.
