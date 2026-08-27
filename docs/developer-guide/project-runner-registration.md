# Project Runner Registration

Project runners use a project-bound, one-time registration flow. The enhanced controller creates the runner identity first, returns registration material once, and keeps the runner visible only inside its originating project.

The implementation in `test/edition-contract/enhanced` is the executable clean-room reference for the replaceable enhanced module contract. The Community implementation remains disabled and does not acquire enhanced behavior.

## Request Flow

```mermaid
sequenceDiagram
    actor Admin as Project administrator
    participant API as Project runner API
    participant SQL as SQL store
    participant Runner as Runner process

    Admin->>API: POST /api/project/{project_id}/runners
    API->>SQL: Store SHA-256 token hash, expiry, project ID
    API-->>Admin: 201 runner + plaintext registration token
    Runner->>API: POST /api/internal/runners with one-time token
    API->>SQL: Conditional token consume
    SQL-->>API: One winner; clear hash and expiry
    API-->>Runner: Opaque runner authentication token
    Runner->>API: Authenticated heartbeat
    Admin->>API: GET /api/project/{project_id}/runners
    API-->>Admin: Project-only list with online status
```

## HTTP Contract

| Operation | Authentication and authorization | Result |
|---|---|---|
| `POST /api/project/{project_id}/runners` | Authenticated project administrator; active `project_runners` write capability | `201` with the created runner and `registration_token` |
| `GET /api/project/{project_id}/runners` | Authenticated project member with runner read permission; active read capability | `200` with runners from that project only |
| `GET /api/project/{project_id}/runners/{runner_id}` | Same project and read permission; active read capability | `200`, or non-disclosing `404` for another project |
| `POST /api/internal/runners` | One-time registration token | `200` with the runner authentication token; replay and expired tokens return `400` |

Project membership and capability decisions are enforced independently in the backend. Route middleware resolves a runner through both `project_id` and `runner_id`; a runner from another project is indistinguishable from a missing runner.

The existing subscription-service constructor parameter remains part of the cross-module compatibility signature, but this slice does not apply runner quotas. Commercial quota enforcement is not selected in this backlog; availability comes from the backend `project_runners` capability decision.

## Registration Material

`CreateProjectRunner` generates the existing high-entropy `smrs_` token, stores only its SHA-256 hash, and sets a one-hour expiry. The plaintext value exists only in the create response and the registration dialog.

Registration uses a conditional SQL update that requires all of the following at the point of consumption:

- the runner has no authentication token yet;
- the supplied hash still matches; and
- the registration token has not expired.

Only one concurrent request can update the row. A successful registration creates a separate opaque runner authentication token, activates the runner, and clears the registration hash and expiry. Values supplied by the runner cannot change the persisted project binding.

Runner authentication tokens, registration hashes, and registration expiry fields are excluded from JSON and backup serialization. Audit records, application logs, metrics, and stable HTTP errors contain runner IDs and typed outcomes, never registration material. Every runner audit record persists the requested project scope, so unrelated authenticated users cannot receive its metadata through the global event feed.

## User Interface

Creating a runner from a project always selects the one-time registration flow. The response opens a dialog with copyable environment, configuration, and container commands. Closing the dialog removes the only normal UI view of the plaintext token; subsequent list and detail reads contain only registration and online state.

After registration, state transitions and destructive-action conflict behavior follow the [Project Runner Lifecycle](project-runner-lifecycle.md) contract.

## Verification

Run the backend and contract layers with:

```bash
go test ./db ./db/sql ./services/server ./api/runners ./api ./pro_interfaces -count=1
(cd pro && go test ./... -count=1)
GOWORK="$PWD/test/edition-contract/go.work" \
  go test github.com/semaphoreui/semaphore/pro/api/projects \
  github.com/semaphoreui/semaphore/pro/pkg/features -count=1
```

Run the focused component contract with:

```bash
cd web
NODE_OPTIONS=--localstorage-file=/tmp/semaphore-web-test-localstorage \
  npm run test:unit -- tests/unit/runner-registration.spec.js
```
