# Slice 072 — Policy Guardrails

An administrator can publish a versioned policy, and every task or workflow start receives the same allow, warn, or deny findings before enqueue.

| Field | Value |
|---|---|
| Selection | X03 |
| Depends on | 070–071 |
| Primary paths | policy model/repository/compiler/evaluator, execution planner, policy API and UI |
| Out of scope | Running arbitrary user code, remote policy bundles, and post-execution compliance scanning |

## Implementation

- [x] Define a bounded declarative YAML policy schema over allow-listed task, inventory, environment, workflow, runner, executor, image, credential-reference, and time metadata.
- [x] Support typed predicates and allow, warn, or deny findings with stable rule IDs, severity, message, and remediation URL.
- [x] Parse and compile policy on draft validation and publish an immutable revision only when every rule is valid.
- [x] Evaluate active global and project policies in deterministic order inside the shared execution planner.
- [x] Prevent policies from reading secret values, performing network/filesystem access, or consuming unbounded input.
- [x] Snapshot policy revisions and findings into preflight and execution provenance.
- [x] Add draft, validate, test-fixture, diff, publish, rollback-as-new-revision, impact preview, and evaluation-history UI.
- [x] Require a separate permission for policy administration and retain audited break-glass rollback.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: YAML schema, every predicate, ordering, limits, secret-field denial, findings, fingerprint, and rollback |
| Integration | Required: global/project revisions through preflight and every enqueue path, concurrent publish, and history persistence |
| API | Required: draft/validate/test/diff/publish/history, malformed/oversized policy, allow/warn/deny, and permission contracts |
| UI | Required: browser evidence for authoring, validation, fixture test, publish, denied start, warning, diff, and rollback |

- [x] Direct API and background starts cannot bypass a deny finding.
- [x] The evaluator is deterministic and has no network, filesystem, clock, or secret-value access beyond explicit bounded inputs.
- [x] Every execution records the exact policy revisions and findings evaluated.
