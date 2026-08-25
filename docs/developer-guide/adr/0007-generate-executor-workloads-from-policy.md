# ADR 0007: Generate Executor Workloads from Policy

## Status

Proposed

## Date

2026-08-25

## Context

Docker and Kubernetes executors run project-controlled automation near high-authority daemon or cluster APIs.
Accepting arbitrary container create options or Pod manifests would let a project request privileged mode, host mounts, service accounts, devices, or host networking beyond administrator intent.
The task model still needs deliberate variability for image, resources, and approved network profiles.

## Decision

Generate Docker create specifications and Kubernetes Job manifests inside the runner from typed task inputs and an administrator-owned policy.
Project inputs may narrow or select from allow-listed options but cannot add authority.
Default generated workloads to non-root, no privilege escalation, bounded resources, minimal capabilities, read-only roots, and isolated networking where supported.

Keep Docker and Kubernetes protocol calls behind outbound client interfaces.
Record resolved image digest and workload identity for provenance and reconciliation.
Treat ambiguous executor state after loss of contact as quarantine, not permission to launch a replacement.

## Consequences

### Positive

- Direct API callers cannot bypass executor policy with raw workload fields.
- Docker and Kubernetes share the same placement, task lifecycle, provenance, and cancellation concepts.
- Generated specifications can be exhaustively unit-tested before an external API call.
- Stable workload identity supports safe cleanup and recovery.

### Negative

- The supported workload surface is narrower than raw Docker or Kubernetes APIs.
- New executor options require a typed model, policy rule, and migration path.
- Docker socket access still trusts the runner host and daemon administrator.

## Alternatives Considered

### Accept Raw Docker or Kubernetes Configuration

This maximizes flexibility but makes least-privilege enforcement and backward-compatible validation unreliable.

### Render User-Supplied Pod Templates

Allow-list patching is difficult to prove complete because new Kubernetes fields can introduce authority.

### Execute Container Commands Through a Shell CLI

This adds quoting and binary-version ambiguity and weakens typed error handling compared with protocol clients.
