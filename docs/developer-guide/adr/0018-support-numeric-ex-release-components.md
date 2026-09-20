# ADR 0018: Support Numeric EX Release Components

## Status

Accepted

## Context

The final-release workflow accepts only tags ending in `ex.N`.
The Git SSH repair is requested as `v2.20.0-ex.2.1`, and the requested version format permits three numeric EX components.

## Decision

Accept `vX.Y.Z-ex.N`, `vX.Y.Z-ex.N.M`, and `vX.Y.Z-ex.N.M.P` in the final-release tag filter.
Retain explicit numeric patterns so plain upstream tags and candidate suffixes do not trigger final releases.
All supported final tags use the existing product gate, signed packaging and container publication jobs.
The Git SSH repair is released as `v2.20.0-ex.2.1`.

## Alternatives

A broad `ex.*` wildcard is shorter but would also match candidate tags and nonnumeric identifiers.
Changing the requested version to a single EX number avoids a workflow edit but does not meet the requested naming contract.

## Verification

Validate workflow syntax and exercise the tag filters with each supported shape, multi-digit components, candidate suffixes, upstream tags and excess components.
Extract the release notes for the exact requested version before creating its tag.
