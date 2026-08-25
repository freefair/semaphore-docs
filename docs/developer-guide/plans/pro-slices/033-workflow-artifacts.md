# Slice 033 — Workflow Artifacts

A downstream workflow node can consume a bounded, typed output produced by a reachable upstream node.

| Field | Value |
|---|---|
| Selection | P08d |
| Depends on | 032 |
| Primary paths | workflow result model, artifact repository, task preparation, editor and run UI |
| Out of scope | Binary artifact storage and retention, delivered by slice 074 |

## Implementation

- [ ] Define named JSON output declarations with an explicit schema, sensitivity flag, maximum size, and producing node.
- [ ] Capture declared output from structured task results rather than parsing unrestricted console text.
- [ ] Validate type and size before committing output and fail the producing node with a bounded diagnostic when invalid.
- [ ] Permit references only from graph-reachable predecessors and validate them when the definition is saved.
- [ ] Resolve inputs immediately before task creation and record value-free fingerprints in the run snapshot.
- [ ] Route sensitive outputs through the secret-safe injection path and redact them from API, logs, audit, and UI.
- [ ] Show output names, schema, availability, provenance, and redacted sensitivity state in editor and run views.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: schema/type/size validation, reachability, reference resolution, sensitivity, and fingerprinting |
| Integration | Required: upstream production and downstream consumption, invalid output, retry, skipped producer, and redaction |
| API | Required: definition references, run metadata, hidden sensitive values, invalid access, and permission contracts |
| UI | Required: component tests plus browser evidence for declaring, linking, consuming, missing, and sensitive outputs |

- [ ] A node cannot read an output from an unrelated or downstream node.
- [ ] Sensitive values never appear in persisted definition JSON or user-visible run payloads.
- [ ] Retrying a run uses outputs from that run and attempt only.
