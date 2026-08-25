# Slice 074 — Artifact Retention and Provenance

An authorized user can download a bounded workflow artifact, verify its checksum and producer, and see it expire under an explicit retention policy.

| Field | Value |
|---|---|
| Selection | X10 |
| Depends on | 033, 046, 061 |
| Primary paths | artifact metadata/content repositories, upload/download service, retention worker, run and governance UI |
| Out of scope | An unbounded binary repository and recommending a specific external object-store product |

## Implementation

- [ ] Define immutable artifact metadata with run/node/task/attempt, logical name, media type, size, SHA-256 checksum, producer, credential-reference provenance, and timestamps.
- [ ] Start with a bounded SQL-backed content store so all supported deployments and HA nodes share one durable authority; isolate it behind an artifact-store interface.
- [ ] Stream uploads and downloads with hard per-artifact, per-run, and request limits rather than loading full content into memory.
- [ ] Commit content and metadata atomically or reconcile incomplete staged uploads without exposing them.
- [ ] Enforce workflow/run view permission plus artifact-specific policy on list, metadata, and download.
- [ ] Return safe content disposition, nosniff, restrictive cache, sanitized filename, exact length, and checksum headers.
- [ ] Apply versioned global/project retention rules through an idempotent worker and write value-free access/deletion audit events.
- [ ] Render artifact list, producer/version provenance, checksum copy/verify affordance, expiry, download denial, and retention administration.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: metadata, checksum, filename/content headers, limits, permission, retention precedence, and GC decisions |
| Integration | Required: streaming SQL storage on all database engines, interrupted upload, concurrent download/delete, expiry, retry, and HA access |
| API | Required: upload/finalize/list/metadata/download, range policy, unsafe filename/type, checksum mismatch, expiry, and permission contracts |
| UI | Required: browser evidence for produced artifact, provenance, safe download, denied user, expiry warning, and post-GC state |

- [ ] Downloaded bytes match the immutable recorded size and checksum.
- [ ] Partial, expired, unauthorized, or deleted content is never downloadable.
- [ ] Retention deletes only artifacts proven eligible by the recorded policy revision and terminal run state.
