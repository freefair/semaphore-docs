# ADR 0006: Resolve Secret References at Execution Time

## Status

Proposed

## Date

2026-08-25

## Context

Selected features include Vault/OpenBao storage, managed synchronization, global credential grants, workflow parameters, preflight, and artifact provenance.
Copying external secret values into definitions, task rows, previews, or project-specific credentials expands the blast radius and makes revocation unreliable.
Users still need stable metadata for selection, authorization, impact analysis, and audit.

## Decision

Persist typed secret and credential references, grants, provider versions, and value-free fingerprints instead of resolved plaintext.
Resolve the reference through a dedicated service immediately before task dispatch, rechecking capability, permission, grant, expiry, and revocation.
Inject the value through the existing task-scoped secret channel and keep it out of ordinary DTOs, logs, summaries, notifications, and artifacts.

Encrypt the small set of provider bootstrap credentials required by Semaphore and expose those fields as write-only.
Do not cache returned secret values beyond the task lifetime.

## Consequences

### Positive

- Rotation updates consumers without copying values between projects.
- Revocation can block a task until its final dispatch boundary.
- Preflight and audit can show provenance without disclosing content.
- External providers remain the authority for externally managed values.

### Negative

- Tasks that require a provider secret depend on provider availability at dispatch.
- Authorization and provider lookup add work to the critical execution path.
- Diagnostics must distinguish reference, permission, provider, and redaction failures without exposing content.

## Alternatives Considered

### Synchronize Every Value into Semaphore

This improves runtime independence but creates stale copies, expands plaintext exposure, and weakens immediate revocation.

### Resolve Secrets During Workflow Creation

This fails to capture later rotation and risks persisting plaintext in snapshots.

### Return Secret Values to the Browser for Injection

This would expose centrally managed credentials to users and browser state and is therefore rejected.
