# ADR 0013: Use One Reference for Duration Labels

## Status

Accepted

## Context

Day.js duration humanization calculates relative time using separate reads of
the current clock. A clock tick between those reads can move an exact rounding
boundary: 90 seconds intermittently renders as one minute instead of two.

## Decision

Capture one Day.js reference, add the duration in milliseconds, and format the
result relative to that same reference without a suffix. Preserve the existing
input handling, locale behavior and relative-time thresholds. Cover advancing
clocks with a deterministic regression test that restores the original clock.

## Alternatives

Freezing the clock only in tests would hide the production rendering defect.
Replacing Day.js or implementing separate rounding thresholds would introduce
unnecessary dependency or localization changes.

## Consequences

Duration labels remain stable across clock ticks, including numeric strings
and negative durations. The small shared-filter change stays compatible with
upstream templates. This does not change elapsed-time measurement itself.

The relative-time API is documented in [Day.js: Time from X](https://day.js.org/docs/en/display/from).
