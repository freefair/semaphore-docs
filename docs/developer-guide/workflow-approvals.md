# Workflow Approvals

An approval node pauses a workflow after all selected predecessors have completed and before it creates any downstream task.
The request is a durable snapshot of the node configuration, so later edits to the workflow definition cannot change who may decide an already pending approval.

## Node Configuration

Approval nodes do not reference a task template.
The workflow editor exposes the following configuration, and the backend validates the same fields before a definition is stored.

| Field | Meaning | Default |
|---|---|---|
| Approval message | Prompt shown to eligible project members. | `Approval required.` |
| Eligible project permission | Permission required at decision time. | Can run project tasks |
| Approval timeout | Optional positive number of seconds before expiry. | No expiry |
| Timeout outcome | Whether expiry blocks or permits downstream execution. | Reject |
| Separation of duties | Prevents the user who started the run from deciding the request. | Disabled |

The supported eligible permissions are run project tasks, update project, manage project resources, and manage project users.
The request stores the selected permission rather than re-reading the mutable node definition.

## Request Lifecycle

Each approval node opens exactly one immutable request per workflow run node attempt.
The request begins in `pending` and has one terminal outcome: `approved`, `rejected`, `expired`, or `canceled`.
Only the pending-to-terminal transition is writable, and it uses a conditional database update.
Concurrent decisions therefore produce exactly one durable outcome.

The durable request records the prompt, deadline, eligible permission, separation-of-duties setting, run actor, timeout outcome, correlation ID, decision source, optional comment, decision time, and deciding user when a user made the decision.
Resolved requests cannot be edited.

| Outcome | Source | Run-node result | Downstream work |
|---|---|---|---|
| `approved` | User | Succeeded | May continue |
| `rejected` | User | Blocked | Never created |
| `expired` with reject outcome | Timeout worker | Blocked | Never created |
| `expired` with approve outcome | Timeout worker | Succeeded | May continue |
| `canceled` | Run stop | Canceled | Never created |

The worker reconciles every active workflow run, so a process restart catches a deadline that elapsed while the service was unavailable.

## Authorization and APIs

The approval inbox is capability-gated and returns only pending requests that the current user may decide according to the stored permission and separation-of-duties setting.
The service repeats the authorization check when an approval is resolved; the inbox is a convenience, not an authorization boundary.

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/project/{project_id}/workflow-approvals` | List pending approvals the authenticated user can decide. |
| `GET` | `/api/project/{project_id}/workflows/{workflow_id}/runs/{run_id}/approvals` | List immutable approval records for one run. |
| `POST` | `/api/project/{project_id}/workflows/{workflow_id}/runs/{run_id}/approvals/{node_id}` | Conditionally approve or reject a pending request. |

The resolve body is strict JSON with no unknown fields or trailing values.

```json
{
  "status": "approved",
  "comment": "Reviewed the production change.",
  "source": "user"
}
```

`status` accepts only `approved` or `rejected`, `source` must be `user`, and comments are limited to 1024 bytes.
An ineligible user, the requester when separation of duties applies, a malformed body, or a stale decision is rejected without changing the request.

## UI and Compatibility Boundary

The workflow list adds one approval-inbox action that opens a focused dialog and links to the existing run view.
The run view displays pending and resolved request snapshots and provides approve/reject controls to users who have the normal project task-run permission.
The workflow editor adds configuration controls only within the existing approval-node properties panel.

No Community routes, navigation structure, or shared host components change.
The backend remains authoritative for every capability, permission, and conditional state transition.
