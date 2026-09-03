# ADR 0002: Make Capabilities Backend-Authoritative

## Status

Accepted

## Date

2026-08-24

## Context

The frontend receives feature information through `/api/info`.
UI visibility cannot enforce authorization, prevent direct API use, constrain background workers, or define downgrade behavior.
Optional functionality needs one effective capability snapshot that applies consistently to HTTP requests, services, and scheduled work.

## Decision

Use a typed server-side capability provider as the source of truth for configured feature availability and operational limits.
Enforce it in route middleware and again at service entry points where background execution can bypass HTTP.
Expose only the sanitized effective snapshot through `/api/info` so the UI can render the same decision and its user-facing reason.
Keep opaque, revocable, server-side user sessions; capability metadata does not become a JWT-based authentication mechanism.
Capability states express administrator configuration and operational lifecycle, not a commercial entitlement or product edition.

## Consequences

### Positive

- Direct API requests cannot bypass disabled UI controls.
- The UI, API, and workers observe a consistent capability decision.
- Static configuration and persisted administrator choices implement one interface.
- Disablement, read-only transitions, expiry, and reactivation semantics become testable where a feature needs them.

### Negative

- Every enhanced service and background path must be inventoried and guarded.
- Capability-provider availability and refresh behavior become operational concerns.
- Tests require explicit capability fixtures instead of relying on product-tier assumptions.

## Alternatives Considered

### Frontend and Build-Time Flags Only

This is simple but is presentation logic rather than security or authorization enforcement.

### Scattered Configuration Checks

This avoids a new abstraction but produces inconsistent behavior, untyped keys, and missed worker paths.

### Capability Claims in User JWTs

This makes entitlement changes stale until token expiry and conflicts with the project's opaque server-side session model.
