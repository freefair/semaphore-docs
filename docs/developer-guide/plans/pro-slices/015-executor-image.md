# Slice 015 — A Template Selects the Runner Executor Image

A template author sets an allowed executor image and sees that exact image used by a compatible runner.

| Field | Value |
|---|---|
| Selection | P02a |
| Depends on | 014 |
| Primary paths | `db/Template.go`, template API/store, `TemplateForm.vue`, runner job payload |
| Out of scope | Docker/Kubernetes runtime implementation and signature policy |

## Implementation

- [x] Retain the existing `executor_image` migration, normalization, API field, and UI as the core baseline.
- [x] Validate image syntax and capability availability server-side at template save and task start.
- [x] Carry an immutable resolved image in the runner job payload and task attempt record.
- [x] Reject local or incompatible executors with an actionable placement reason.
- [x] Display requested and resolved image in task details without registry credentials.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: normalization, validation, and executor compatibility |
| Integration | Required: template round trip and immutable job payload |
| API | Required: valid, invalid, disabled-capability, and incompatible-executor cases |
| UI | Required: component tests plus browser save/run/resolved-image flow |

- [x] A compatible task receives exactly the saved image.
- [x] Incompatible execution fails before enqueue.
- [x] Clearing the image restores the runner default.

Implementation details and verification commands are recorded in [Project Runner Executor Images](../../project-runner-executor-images.md).
