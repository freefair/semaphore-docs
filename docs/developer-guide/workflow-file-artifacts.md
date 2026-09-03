# Workflow File Artifacts

Enhanced Edition can retain bounded files produced by workflow task attempts and make them available to authorized users through the existing Workflow Run view.
File artifacts are separate from [typed JSON workflow artifacts](workflow-artifacts.md): they use their own persistence, API, authorization policy, and retention lifecycle.

[[toc]]

## Artifact Model

A file artifact belongs to one project, workflow template, workflow run, workflow node, task, and assignment attempt.
Its immutable metadata records the logical name, sanitized download filename, media type, declared size, SHA-256 checksum, workflow definition revision, producer user, producer template and version, optional runner, value-free credential references, access-policy revision, and retention-policy snapshot.

Artifact content is stored as bounded SQL chunks behind the Enhanced artifact repository interface.
The Community repository factory remains unchanged and does not start an artifact retention worker.

The artifact lifecycle is:

| State | Meaning |
|---|---|
| `staging` | Metadata exists and exact-offset chunks may be appended, but content cannot be listed or downloaded. |
| `available` | Every declared byte was received and the calculated checksum matched. |
| `failed` | Upload reconciliation rejected or abandoned the staged content. |
| `expired` | Retention elapsed for an artifact from a terminal workflow run; metadata remains visible. |
| `deleted` | Content was explicitly removed and is no longer returned by the run list. |

Only the task's current unfinished assignment generation may create or mutate a file artifact, including generation `0` before any reassignment.
The workflow service derives producer, credential, access-policy, and retention provenance from server-side run state rather than trusting upload fields supplied by a client.

## Upload Protocol and Limits

An upload has three explicit phases:

1. `POST` the artifact declaration to the run's `file-artifacts` collection.
2. `PUT` the content endpoint with chunks whose `offset` and `revision` match the current staging record exactly.
3. `POST` the finalize endpoint with the latest `revision`.

Finalization atomically changes the artifact to `available` only after the uploaded byte count equals the declared size and the calculated SHA-256 digest equals the declaration.
A mismatch marks the upload as failed and never exposes partial bytes.
Stale staging records are reconciled by the retention worker.

The hard limits are intentionally independent of administrator policy:

| Limit | Value |
|---|---:|
| One artifact | 64 MiB |
| All file artifacts in one run | 256 MiB |
| One upload chunk | 1 MiB |
| File artifacts in one run | 256 |
| Staged-upload lifetime | 24 hours from artifact creation |

The retention policy may reduce the per-artifact or per-run byte limit, but it cannot increase a hard limit.
Run reservations and exact-offset compare-and-swap updates serialize concurrent writers without buffering the complete file in application memory.

## Authorization

Every list, metadata, upload, and download request first requires current workflow-run visibility in the artifact's project.
An artifact access policy may additionally allow-list current custom role IDs.
That policy can narrow workflow-run access but can never grant access to a user who cannot view the run.

Authorization uses the caller's current project and global role assignments.
Changing or removing a role therefore affects future artifact access immediately; immutable provenance records which access-policy revision was captured when the artifact was created.

Denied metadata or content access does not reveal artifact bytes.
Download attempts and lifecycle changes emit value-free audit records containing identifiers and bounded outcomes, never file content, credentials, checksums used as secrets, or request bodies.

## Download Contract

`GET` streams an available artifact and `HEAD` performs the same live authorization and lease acquisition without returning the body.
Both operations acquire a bounded download lease before reading chunks.
The retention worker cannot expire content while an active lease exists, and the lease deadline is absolute so a stalled client cannot extend retention indefinitely.

Successful responses include:

| Header | Contract |
|---|---|
| `Content-Disposition` | Attachment with a sanitized ASCII fallback and RFC 5987 filename. |
| `Content-Type` | The validated recorded media type. |
| `Content-Length` | The immutable recorded size. |
| `X-Checksum-SHA256` | The immutable lowercase SHA-256 digest. |
| `Accept-Ranges` | `none`. |
| `X-Content-Type-Options` | `nosniff`. |
| `Cache-Control` | Restrictive private, no-store caching. |

Byte ranges are deliberately unsupported.
A request containing `Range` receives `416 Range Not Satisfiable`, because partial responses would complicate checksum verification and lease fencing without improving the bounded initial storage contract.

## Retention Governance

The global policy defines retention duration, maximum artifact bytes, and maximum run bytes.
A project policy may only narrow each global value.
Policies are immutable revisions, and updates require the caller's expected current revision so concurrent changes return `409 Conflict` instead of overwriting each other.

The built-in global defaults are revision `0` until an administrator publishes the first global revision.
Global and project publication lock the migrated retention sentinel before calculating the next revision, which serializes first-write bootstrap across all supported SQL databases and HA nodes.
Every artifact snapshots the effective global revision, optional project revision, retention duration, and byte limits when it is created.

The idempotent Enhanced retention worker processes bounded batches.
It expires only `available` artifacts whose recorded deadline elapsed, whose workflow run is terminal, and whose active download leases have ended.
It also reconciles staged uploads older than 24 hours.
Expired artifacts stay in the run metadata list so operators can see provenance and lifecycle state without recovering content.

Administrators edit global retention in the existing System Information dialog.
Project resource administrators edit the project override in existing Project Settings.
Neither integration adds a route or navigation item to the shared Community UI.

## API Reference

| Method and path | Result |
|---|---|
| `GET /api/project/{project_id}/workflows/{workflow_id}/runs/{run_id}/file-artifacts` | List authorized available and expired metadata. |
| `POST /api/project/{project_id}/workflows/{workflow_id}/runs/{run_id}/file-artifacts` | Begin a bounded staged upload. |
| `GET /api/project/{project_id}/workflows/{workflow_id}/runs/{run_id}/file-artifacts/{artifact_id}` | Read authorized metadata. |
| `HEAD .../file-artifacts/{artifact_id}/content` | Preflight a download with live authorization and lease fencing. |
| `GET .../file-artifacts/{artifact_id}/content` | Stream available content with safe headers. |
| `PUT .../file-artifacts/{artifact_id}/content?offset={offset}&revision={revision}` | Append one exact-offset chunk. |
| `POST .../file-artifacts/{artifact_id}/finalize?revision={revision}` | Verify size and checksum, then publish atomically. |
| `GET /api/workflow-artifact-retention` | Read global retention governance. |
| `PUT /api/workflow-artifact-retention` | Publish a global revision. |
| `GET /api/project/{project_id}/workflow-artifact-retention` | Read global, project, and effective project retention. |
| `PUT /api/project/{project_id}/workflow-artifact-retention` | Publish a narrowing project revision. |

The complete request, response, validation, and error schemas are published in `api-docs.yml`.

## Verification

Repository tests cover SQLite, PostgreSQL, and MySQL storage, policy precedence, bootstrap serialization, interrupted uploads, leases, expiry, and reconciliation.
Service and API tests cover checksums, hard and policy limits, exact offsets, safe headers, rejected range requests, current-role authorization, and terminal metadata visibility.
The browser contract verifies the existing run and administration surfaces at desktop and mobile widths without changing shared Community navigation.
