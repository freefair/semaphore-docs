# Conditional Parallel Workflows

The Enhanced edition evaluates bounded conditions over immutable node results, schedules independent workflow nodes concurrently, and applies explicit join semantics.
SQL remains authoritative for every node claim and terminal transition.

## Table of Contents

- [Definition Contract](#definition-contract)
- [Condition Language](#condition-language)
- [Join and Skip Semantics](#join-and-skip-semantics)
- [Parallel Scheduling](#parallel-scheduling)
- [Persistence and API](#persistence-and-api)
- [Security Boundary](#security-boundary)

## Definition Contract

`max_parallel_tasks` limits the number of queued or running tasks in one workflow run.
The default is 4, the minimum is 1, and the maximum is 32.
The limit is frozen in the workflow definition snapshot when a run starts.

Each executable node has one of these join modes:

| Join mode | Readiness rule |
|---|---|
| `all-successful` | Every selected predecessor must finish successfully. |
| `all-complete` | Every selected predecessor must finish, regardless of its outcome. |
| `any-successful` | The node becomes ready as soon as one selected predecessor succeeds. |

The legacy convergence value remains compatible: `any` defaults to `any-successful`, while other or omitted values default to `all-successful`.

Edges support `on_success`, `on_failure`, `always`, and `expression`.
The built-in failure condition matches `failed`, `canceled`, and `stopped` predecessor results.

## Condition Language

Expressions are limited to 2,048 bytes and 256 tokens.
They support parentheses, `!`, `&&`, `||`, typed literals, and the comparison operators `==`, `!=`, `<`, `<=`, `>`, and `>=`.
Boolean values support equality comparisons only.

The following immutable fields are available:

| Field | Type | Missing-summary value |
|---|---|---|
| `result.status` | string | always present |
| `result.successful` | boolean | always present |
| `result.summary.available` | boolean | `false` |
| `result.summary.state` | string | empty string |
| `result.summary.expected_hosts` | integer | `0` |
| `result.summary.total_hosts` | integer | `0` |
| `result.summary.ok_hosts` | integer | `0` |
| `result.summary.failed_hosts` | integer | `0` |

For example:

```text
result.successful && result.summary.available && result.summary.failed_hosts == 0
```

The server parses and type-checks the source expression when a definition is validated or saved.
It stores both the source and a versioned data-only stack program, then recompiles the expression when creating the immutable run snapshot.

## Join and Skip Semantics

A predecessor is selected only when it is terminal and its incoming edge condition evaluates to true.
The planner waits when unfinished predecessors can still affect the selected set, except that `any-successful` may start after the first selected success.

When all predecessors are terminal and no edge condition selected a predecessor, the destination node becomes `skipped`.
A skipped node is terminal but is not selected by a downstream `always` edge, so an unselected branch remains unselected through later joins.

An `all-successful` join becomes `blocked` when a selected predecessor did not succeed.
An `any-successful` join becomes `blocked` when all predecessors are terminal and none of the selected predecessors succeeded.
Skipped nodes do not make a run fail; failed, canceled, and blocked nodes preserve distinct terminal run outcomes.

## Parallel Scheduling

The readiness planner computes decisions from the frozen definition and persisted node results.
It counts queued and running nodes against `max_parallel_tasks`, then claims ready nodes with conditional SQL updates before task creation.
The existing workflow run lock serializes local progression, while the SQL claim remains the durable at-most-once boundary for duplicate callbacks, retries, and concurrent predecessor completion.

Every task still enters through the normal task service and task-pool controls.
Parallel workflow scheduling does not bypass runner placement, resource locking, or executor policy.

## Persistence and API

Migration `v2.20.16` adds `max_parallel_tasks`, `join_mode`, condition source and program columns, and the immutable result JSON on run nodes.
The migration is reversible and preserves existing definitions with compatible defaults.

Workflow definition create, validate, update, and read responses use the fields described in [Workflow Editor and Definition Validation](workflow-editor-validation.md).
Workflow run detail responses include the frozen parallel limit, node join modes, condition source, node status, and only the sanitized immutable node result.
The internal compiled program, template snapshots, task arguments, vault configuration, and other execution data are excluded from run presentation responses.
Run-scoped typed values use the separate value-free API and security contract described in [Workflow Artifacts](workflow-artifacts.md).

## Security Boundary

The evaluator has no operation for function calls, filesystem access, network access, reflection, environment variables, secrets, task arguments, host names, or arbitrary artifacts.
Unknown fields, operators, program versions, instruction types, malformed programs, and type mismatches fail validation or evaluation.
Persisted instructions are validated again during evaluation, so modified database data cannot introduce executable operations.
