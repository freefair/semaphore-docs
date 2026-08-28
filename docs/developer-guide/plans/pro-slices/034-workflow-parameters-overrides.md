# Slice 034 — Workflow Parameters and Node Overrides

A workflow author declares typed run parameters, and an authorized starter supplies values that become an immutable, auditable run snapshot.

| Field | Value |
|---|---|
| Selection | P08e, P08f |
| Depends on | 031 |
| Primary paths | workflow parameter model, run-start service/API, task override mapper, editor/run UI |
| Out of scope | Trigger-specific transport, deployment windows, and cross-project credentials |

## Implementation

- [x] Define string, integer, boolean, enumeration, and secret-reference parameters with descriptions, defaults, required flags, and bounds.
- [x] Validate parameter names and values in the backend and reject unknown fields.
- [x] Separate ordinary parameter values from secret references so plaintext secrets are never embedded in workflow definitions.
- [x] Define an allow-list of node overrides for inventory, environment, arguments, branch, and approved credentials.
- [x] Resolve definition defaults, trigger values, user values, and node overrides with documented precedence.
- [x] Store the effective non-secret values and value-free secret fingerprints in the immutable run snapshot.
- [x] Render parameter declaration, start form, validation errors, effective overrides, and redacted audit details in the UI.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: every type/bound, precedence table, unknown value, override allow-list, and redaction |
| Integration | Required: snapshot persistence, task mapping, concurrent definition edit, secret reference, and retry behavior |
| API | Required: definition CRUD, start input, default resolution, invalid/unknown/forbidden override, and permission contracts |
| UI | Required: component tests plus browser evidence for parameter authoring, start validation, effective values, and secret references |

- [x] A running workflow never observes later edits to parameter defaults or overrides.
- [x] Direct API callers cannot set task fields outside the same override allow-list as UI users.
- [x] Plaintext secret parameter values are rejected rather than stored.

The finalized contract, precedence, persistence, retry, and security boundaries are documented in [Workflow Parameters and Node Overrides](../../workflow-parameters-overrides.md).
