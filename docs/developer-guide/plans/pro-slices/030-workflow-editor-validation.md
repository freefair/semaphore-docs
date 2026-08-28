# Slice 030 — Workflow Editor and Validation

An authorized project user can create, validate, save, reopen, and edit a workflow graph before any execution behavior is enabled.

| Field | Value |
|---|---|
| Selection | P08a, P08c |
| Depends on | 003–005 |
| Primary paths | workflow model/repository/service/controller, workflow API, workflow editor UI |
| Out of scope | Executing nodes, triggers, approvals, and cross-project references |

## Implementation

- [x] Define a versioned workflow definition with stable node and edge IDs, display metadata, template reference, and layout coordinates.
- [x] Persist the graph and metadata transactionally through the existing workflow interfaces.
- [x] Validate schema, unique IDs, missing endpoints, self-edges, cycles, disconnected nodes, size bounds, and project-owned template references in the backend.
- [x] Return field- and graph-location-aware validation errors using stable machine-readable codes.
- [x] Add optimistic concurrency so two editors cannot silently overwrite each other.
- [x] Build editor workflows for create, connect, move, delete, validate, save, discard, reload, and conflict recovery.
- [x] Keep client validation aligned for fast feedback while treating the backend result as authoritative.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: graph validation, normalization, limits, reference authorization, and conflict rules |
| Integration | Required: transactional graph persistence, rollback, optimistic conflict, and project isolation |
| API | Required: CRUD, validation error shape, stale revision, unauthorized template, and capability contracts |
| UI | Required: editor component tests plus browser evidence for create/save/reopen, validation, and concurrent-edit recovery |

- [x] A saved workflow reopens with the same logical graph and layout.
- [x] Invalid graphs cannot be stored through either UI or direct API use.
- [x] A stale editor receives a conflict and never overwrites the newer definition silently.
