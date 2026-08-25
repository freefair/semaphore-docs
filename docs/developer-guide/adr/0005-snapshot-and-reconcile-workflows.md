# ADR 0005: Snapshot and Reconcile Workflow Runs

## Status

Proposed

## Date

2026-08-25

## Context

Workflow definitions can change while a run is active.
Tasks, approvals, branches, and joins can complete after a server restart or on a different HA node.
An in-memory orchestration loop cannot explain which definition a run used and cannot guarantee correct recovery from durable state.

## Decision

Create an immutable snapshot of the workflow definition, referenced resource versions, effective non-secret inputs, and policy revisions when a run starts.
Persist run, node-attempt, approval, and desired-state transitions in SQL.
Treat task callbacks and live messages as wake-ups rather than authority.
Advance runs through idempotent reconciliation and conditional SQL transitions, with fenced ownership in HA mode.

Reject mutable references to a resource's latest revision inside an active run.
Represent restore as a new definition version and retry as a new attempt linked to the original run.

## Consequences

### Positive

- Every run remains reproducible and auditable after later definition edits.
- Process restart and cross-node ownership transfer can reconstruct progress from SQL.
- Duplicate callbacks cannot create a second logical task or approval when conditional transitions are correct.
- Version diff, rollback, and provenance use the same immutable model.

### Negative

- Definition and reference snapshots increase database storage.
- Every new workflow feature must define snapshot and reconciliation semantics.
- Schema evolution must retain readers for supported snapshot versions.

## Alternatives Considered

### Read the Current Definition During Progression

This stores less data but lets an edit change a running workflow and makes historical results ambiguous.

### Keep Orchestration State in Memory

This is straightforward on one process but loses progress on restart and cannot safely support active-active nodes.

### Use Redis as Workflow Authority

This improves wake-up latency but weakens durable recovery and conflicts with ADR 0003.
