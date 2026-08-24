# ADR 0003: Keep SQL Authoritative and Use Redis for HA Coordination

## Status

Proposed

## Date

2026-08-24

## Context

Active-active operation must coordinate schedules, task ownership, runner assignment, cross-node events, and orphan recovery.
The application already persists durable domain state in SQL.
Redis locks and Pub/Sub improve coordination latency but cannot by themselves guarantee correctness through lock expiry, process pauses, partitions, or message loss.

## Decision

Keep SQL as the authoritative record for task, schedule, runner, workflow, and ownership transitions.
Use Redis for node heartbeats, Pub/Sub, short-lived coordination locks, and schedule-deduplication assistance.
Protect correctness with conditional SQL state transitions, fencing or ownership generations, idempotency keys, and reconciliation workers.
Require Redis availability when HA mode is enabled, while allowing explicitly configured single-node operation without Redis.

## Consequences

### Positive

- Durable state survives Redis restarts and Pub/Sub loss.
- Expired locks cannot authorize conflicting terminal transitions by themselves.
- Single-node deployments do not acquire an unnecessary Redis dependency.
- Recovery behavior can be tested against authoritative state.

### Negative

- Every distributed transition needs careful transactional and idempotency design.
- Reconciliation is required even when the normal coordination path works.
- Operators must monitor both SQL correctness signals and Redis coordination health.

## Alternatives Considered

### Redis as the Source of Truth

This reduces some SQL contention but weakens durability and creates complex recovery between Redis and the existing SQL domain model.

### SQL-Only Coordination

This avoids Redis but makes cross-node event delivery, heartbeats, and high-frequency lock coordination less efficient and more database-specific.

### Treat Redis Locks as Correctness Guarantees

This is simpler but permits split ownership when a lease expires while the original holder is still running.
