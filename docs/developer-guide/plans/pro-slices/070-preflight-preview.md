# Slice 070 — Execution Preflight Preview

Before starting a task or workflow, an authorized user sees the runner choice, resolved references, command shape, and policy findings that the real enqueue path would use, without revealing secret values.

| Field | Value |
|---|---|
| Selection | X01 |
| Depends on | 014–016, 034, 061 |
| Primary paths | execution planning service, placement/credential/policy resolvers, preflight API and start UI |
| Out of scope | Reserving a runner indefinitely and exposing resolved secret content |

## Implementation

- [ ] Extract one side-effect-free execution planner used by both preflight and actual enqueue.
- [ ] Resolve template/workflow revision, inventory, variable sources, credential references, executor/image, candidate runners, command shape, and current capability/permission decisions.
- [ ] Return selected and rejected placement candidates with stable reason codes while omitting secret values and sensitive environment data.
- [ ] Include a short-lived plan fingerprint over all relevant revisions and decisions.
- [ ] On start, recompute the plan and either accept the matching fingerprint or return a clear stale-preview diff.
- [ ] Bound preview size, candidate counts, validation work, and external metadata calls.
- [ ] Add a review step showing effective inputs, references, runner/executor, command shape, warnings, denials, and stale-preview recovery.
- [ ] Audit preview and start decisions without treating preview as execution authorization.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: plan construction, fingerprint, stale diff, redaction, placement reasons, and bounds |
| Integration | Required: preview/start parity across runner, variable, credential, image, and definition changes |
| API | Required: task/workflow preview, denied finding, stale fingerprint, hidden reference, no candidate, and permission contracts |
| UI | Required: browser evidence for preview, warning, denial, changed input, stale recovery, and successful start from reviewed plan |

- [ ] An unchanged preview and start produce the same effective execution plan.
- [ ] A changed dependency prevents silent start under the old fingerprint.
- [ ] Preview responses contain credential identities and provenance but no credential values.
