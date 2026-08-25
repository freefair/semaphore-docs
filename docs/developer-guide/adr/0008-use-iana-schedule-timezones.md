# ADR 0008: Use IANA Schedule Timezones and Backend Occurrences

## Status

Proposed

## Date

2026-08-25

## Context

Per-schedule timezones must preserve wall-clock intent through daylight-saving transitions.
Abbreviations such as `CST` are ambiguous, fixed offsets do not model daylight-saving rules, and browser-only calculations can disagree with the scheduler's timezone data.
Existing schedules need to retain their current global-timezone behavior.

## Decision

Store an optional IANA timezone identifier on each schedule.
Resolve precedence as an explicit timezone embedded in the supported cron expression, then the schedule timezone, then the configured global scheduler timezone.
Validate identifiers and calculate next occurrences on the backend using its timezone database.
Return the effective timezone and next occurrence to the UI.

Use wall-clock cron semantics in the effective timezone and document behavior for nonexistent and repeated local times.
Give every intended occurrence a stable identity so a repeated local time cannot become an accidental duplicate execution.

## Consequences

### Positive

- Schedules retain local-time intent as offsets change.
- The UI preview and scheduler use one authoritative calculation.
- Existing rows remain compatible through a nullable additive column.
- Occurrence identity supports HA deduplication and delayed window handling.

### Negative

- Timezone database updates can change future civil-time rules.
- DST boundary behavior requires explicit fixtures and operator documentation.
- Browser zone lists are advisory and still require backend validation.

## Alternatives Considered

### Store a Fixed UTC Offset

This cannot represent future daylight-saving or government rule changes.

### Store a Browser-Formatted Timezone Name

Names and abbreviations are not stable unambiguous identifiers.

### Calculate Preview Only in the Browser

This can disagree with backend cron and timezone library behavior and is therefore not authoritative.
