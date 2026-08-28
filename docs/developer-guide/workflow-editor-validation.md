# Workflow Editor and Definition Validation

The Enhanced edition provides a project-scoped workflow authoring contract before workflow execution is enabled. Authorized project users can create, connect, move, validate, save, reopen, and edit a graph. SQL remains the durable authority, and the backend validates every definition before persistence.

## Definition contract

A workflow definition has `definition_version: 1` and a monotonically increasing `revision`. The definition contains metadata plus nodes and directed edges:

- Node and edge `id` values are stable after the first save. The editor uses negative temporary IDs for unsaved elements; the server returns positive persisted IDs.
- Nodes store their kind, optional display name, project-owned task template reference, convergence and approval settings, task parameters, note text, and canvas coordinates.
- Edges store source and destination node IDs, execution condition, and an optional display label.
- Note nodes are annotations. They do not participate in the executable graph and cannot have edges.

The current size bounds are 200 nodes and 1,000 edges per workflow.

## Persistence and concurrency

Create and update operations persist workflow metadata, nodes, edges, and task parameters in one SQL transaction. An error in any graph mutation rolls the complete operation back.

Updates use compare-and-swap semantics on `revision`. A successful update increments the revision. A request with a stale revision returns HTTP `409` with code `WORKFLOW_REVISION_CONFLICT` and, when it is still readable, the current server definition. The editor keeps local changes until the user explicitly reloads the server version.

Migration `v2.20.14` adds the definition version and revision to workflow templates and display metadata to nodes and edges. Existing definitions receive schema version 1 and revision 1.

## Validation

The backend normalizes safe defaults and then validates:

- supported definition version and required name;
- node and edge count limits;
- non-zero, unique node and edge IDs;
- supported node kinds, convergence modes, and edge conditions;
- existing edge endpoints, self-edges, cycles, exactly one executable root, and disconnected executable nodes;
- note-node edge restrictions and approval-node field rules; and
- task template ownership in the workflow's project.

Validation issues are stable API data with `code`, human-readable `message`, and a `path`. Issues tied to a graph element also include `node_id` or `edge_id`. Examples include `WORKFLOW_CYCLE`, `WORKFLOW_DISCONNECTED`, `WORKFLOW_EDGE_SOURCE_MISSING`, and `WORKFLOW_TEMPLATE_NOT_IN_PROJECT`.

Client validation mirrors the structural rules for immediate feedback, but it is advisory. The server result remains authoritative, and invalid definitions are never written by create or update endpoints.

## HTTP contract

All paths are scoped below `/api/project/{project_id}` and require the existing project-resource management permission.

| Method and path | Purpose | Success |
|---|---|---|
| `GET /workflows` | List project workflow definitions | `200` |
| `POST /workflows/validate` | Validate without persistence | `200` with `{ valid, issues }` |
| `POST /workflows` | Validate and create atomically | `201` |
| `GET /workflows/{workflow_id}` | Read one complete definition | `200` |
| `PUT /workflows/{workflow_id}` | Validate and update with revision CAS | `200` |
| `DELETE /workflows/{workflow_id}` | Delete the definition | `204` |

Create and update return `422 WORKFLOW_VALIDATION_FAILED` with located issues when the graph is invalid. Project scoping is derived from the authenticated route context; request body IDs cannot move a workflow or template reference across projects.

Create, validate, and update accept workflow definition bodies up to 8 MiB. Larger requests are rejected before JSON decoding with HTTP `413` and code `WORKFLOW_DEFINITION_TOO_LARGE`; the 200-node and 1,000-edge semantic limits remain a separate validation boundary.

## Editor lifecycle

The editor keeps the last loaded or saved definition as its baseline. **Discard** restores that baseline, including layout. **Validate** calls the authoritative validation endpoint. **Save** first validates, then replaces the local graph with the server response so temporary IDs and the new revision are adopted. A revision conflict leaves the local graph untouched and exposes an explicit action to reload the current server definition.

Workflow execution, triggers, approvals, artifacts, and cross-project references are separate later slices and are not enabled by this authoring contract.
