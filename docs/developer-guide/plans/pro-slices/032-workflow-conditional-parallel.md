# Slice 032 — Conditional Parallel Workflow

A workflow can choose branches from completed node output, run independent nodes concurrently, and join them with explicit semantics.

| Field | Value |
|---|---|
| Selection | P08b |
| Depends on | 031 |
| Primary paths | workflow expression evaluator, dependency planner, runner service, editor and run UI |
| Out of scope | Arbitrary scripts in conditions and cross-project data access |

## Implementation

- [ ] Define a small typed condition language over allow-listed node result fields with no filesystem, network, reflection, or secret access.
- [ ] Validate and compile conditions when saving a workflow, then evaluate the stored form against immutable node results.
- [ ] Represent branch skips explicitly and distinguish skipped, blocked, failed, and canceled nodes.
- [ ] Enqueue ready independent nodes concurrently with configurable per-workflow parallelism bounded by existing task controls.
- [ ] Add explicit `all-successful`, `all-complete`, and `any-successful` join modes with deterministic empty-branch behavior.
- [ ] Make readiness calculation idempotent under concurrent predecessor completion.
- [ ] Visualize conditions, join mode, skipped paths, and parallel progress in editor and run views.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: condition grammar/evaluation, type errors, inaccessible fields, joins, skips, and readiness races |
| Integration | Required: diamond graphs for every join mode, simultaneous completion, retry, failure, and parallelism bounds |
| API | Required: validated condition model, conditional run status, malformed expression, limit, and permission contracts |
| UI | Required: component tests plus browser evidence for branch authoring and a parallel diamond run with skipped and joined paths |

- [ ] The same immutable inputs always select the same branches.
- [ ] A condition cannot read secrets or invoke arbitrary code.
- [ ] Concurrent predecessor completion starts a ready node at most once.
