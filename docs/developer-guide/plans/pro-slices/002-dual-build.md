# Slice 002 — CI Produces Reproducible Community and Enhanced Artifacts

A maintainer can build and identify both editions from one pinned core/enhanced revision pair.

| Field | Value |
|---|---|
| Selection | F02 |
| Depends on | 001 |
| Primary paths | `Taskfile.yml`, `.github/workflows/`, container build definitions, `web/` |
| Out of scope | Publishing or pushing artifacts |

## Implementation

- [x] Define Community and enhanced matrix jobs with pinned toolchains and module revisions.
- [x] Build server, runner, frontend, and containers for both editions.
- [x] Keep enhanced checkout credentials out of Community jobs, logs, layers, and build arguments.
- [x] Emit edition, core revision, enhanced revision, SBOM, and provenance with each artifact.
- [x] Add startup smoke checks for edition and effective capability payload.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | N/A: pipeline composition has no isolated domain logic |
| Integration | Required: clean rebuild of both matrices and container startup |
| API | Required: `/api/info` reports the expected edition in both artifacts |
| UI | Required: production bundles load the correct edition presentation in a browser smoke test |

- [x] Identical inputs produce equivalent artifacts.
- [x] Community jobs cannot access enhanced repository credentials.
- [x] Every artifact is traceable to both source revisions where applicable.
