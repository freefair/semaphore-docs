# Slice 003 — Backend Capabilities Control Activation and Downgrade

An administrator can activate or disable a test capability, and API, worker, and UI behavior change consistently without deleting data.

| Field | Value |
|---|---|
| Selection | F03, F04 |
| Depends on | 001–002 |
| Primary paths | `pro_interfaces/featues.go`, `pro/pkg/features/features.go`, `api/system_info.go`, route middleware |
| Out of scope | Commercial quotas and license issuance |

## Implementation

- [ ] Define typed capability identifiers, limits, reason codes, and immutable request snapshots.
- [ ] Implement a clean-room provider backed by non-secret internal configuration.
- [ ] Guard one test route and one background action server-side before exposing the same state through `/api/info`.
- [ ] Define active, unavailable, disabled, expired, read-only, and insufficient-permission responses.
- [ ] Preserve stored feature data across disable and re-enable transitions.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: provider resolution, reason codes, and lifecycle transitions |
| Integration | Required: data survives disable/re-enable and concurrent snapshot reads |
| API | Required: direct calls and worker paths reject disabled operations |
| UI | Required: browser shows the server reason and never implies UI hiding is enforcement |

- [ ] API, workers, and UI observe one effective snapshot per request.
- [ ] Disabled writes fail without data deletion.
- [ ] Existing opaque user sessions remain unchanged.
