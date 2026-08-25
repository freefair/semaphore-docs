# Slice 031 — Linear Workflow Run

An authorized user can start a valid two-node workflow and observe each task progress in dependency order to one terminal workflow result.

| Field | Value |
|---|---|
| Selection | P08b, P08c |
| Depends on | 030, 013 |
| Primary paths | workflow runner service, workflow-task repository, start/status API, workflow run UI |
| Out of scope | Branch conditions, parallel joins, artifacts, overrides, triggers, and approvals |

## Implementation

- [ ] Snapshot the selected workflow definition and referenced template revisions when a run starts.
- [ ] Define durable pending, queued, running, succeeded, failed, stopped, and blocked states for a run and its nodes.
- [ ] Create the first task through the normal task service and enqueue the second only after the first succeeds.
- [ ] Advance state with conditional SQL transitions so duplicate callbacks or retries cannot start a node twice.
- [ ] Propagate first-node failure to a terminal failed workflow with the dependent node marked blocked.
- [ ] Preserve actor, project, task IDs, definition revision, correlation ID, and timestamps for audit and diagnostics.
- [ ] Add a run dashboard with node status, task links, elapsed time, terminal reason, and live refresh through the existing event path.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: state machine, dependency readiness, terminal result, duplicate callback, and snapshot construction |
| Integration | Required: real task service/repository flow for success, first-node failure, retry, restart, and project isolation |
| API | Required: start, status, node/task links, stale definition behavior, duplicate request, capability, and permission contracts |
| UI | Required: component tests plus browser evidence for successful and failed two-node runs with live transitions |

- [ ] Exactly one task is created per node in one workflow attempt.
- [ ] The second node never starts before the first succeeds.
- [ ] Editing the workflow after start does not change the running snapshot.
