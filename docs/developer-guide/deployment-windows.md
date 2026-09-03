---
sidebar_position: 23
title: Deployment Windows
description: Deterministic project deployment admission, blocked occurrences, and audited emergency overrides.
---

# Deployment Windows

Deployment windows are an Enhanced, project-scoped admission policy. Every task or workflow start is evaluated immediately before its durable enqueue. The same evaluator covers authenticated manual starts, schedules, API and webhook workflow triggers, integrations, autorun, and delayed workflow nodes.

Community keeps its existing start behavior. When the `deployment_windows` capability is unavailable, the governance UI is absent and the shared enqueue paths do not acquire an Enhanced dependency.

## Policy model

A project without a stored policy behaves as revision `1`, timezone `UTC`, default `allow`, with no rules. Saving replaces the complete policy using optimistic concurrency; resetting removes it and restores that default.

Each policy contains at most 64 versioned rules:

| Field | Contract |
|---|---|
| `timezone` | An IANA timezone such as `Europe/Berlin`; all recurrences use this zone. |
| `default` | `allow` or `deny` when no active rule applies. |
| `kind` | `allow` opens a window; `freeze` closes it. |
| `scope` | Project-wide, one project-owned task template, or one project-owned workflow. |
| `recurrence` | A standard five-field cron expression in policy-local time. |
| `duration_minutes` | From 1 through 1,440 minutes. |
| `effective_from` / `effective_until` | Optional inclusive local calendar dates. |

Rule IDs are stable across policy revisions. New rules use ID `0` in a write request and receive a positive ID from the repository. Draft validation works on an isolated copy so it cannot replace that creation sentinel before persistence.

## Evaluation

The evaluator is pure and deterministic for a policy, target, and instant:

1. Inactive and out-of-range rules are ignored.
2. A matching active freeze blocks the start.
3. Otherwise, a matching active allow window permits the start.
4. Otherwise, the project default decides.

Freeze precedence is independent of rule order. The repository supplies database time while holding the project policy lock, so preview, current status, and start admission use the same clock semantics. Local recurrence expansion handles nonexistent and repeated DST wall-clock times without substituting the application host timezone. `next_eligible_at` is returned only when the bounded search can prove an eligible instant; `next_eligible_known` distinguishes a known timestamp from an intentionally unknown result.

## Admission and durable results

Each final start boundary claims an immutable decision identified by a server-derived source/origin key. A retry returns the existing decision instead of evaluating a second time. Allowed or overridden decisions are bound to the created task, workflow run, or workflow-run node at the same persistence boundary that creates the execution.

A blocked schedule occurrence is terminal. Its occurrence row stores the decision, blocked time, and next-eligible result after the lease fencing check succeeds, so restart and HA retries cannot create duplicate delayed work. Workflow triggers and delayed workflow nodes use the equivalent durable blocked result.

Manual task and workflow starts return HTTP `409` with only:

```json
{
  "state": "blocked",
  "reason": "freeze_active",
  "next_eligible_at": "2026-09-03T07:00:00Z",
  "next_eligible_known": true
}
```

Rule names, policy revision, timezone, matched rules, decision keys, and actor identity are not present in this coarse response.

## Emergency override

An override is valid only on an authenticated manual task or workflow start. It requires the distinct `project.deployment_windows.override` permission in addition to the ordinary start permission. Automatic sources cannot carry or inherit an override.

The request-only envelope is:

```json
{
  "deployment_window_override": {
    "category": "incident",
    "reference": "INC-41"
  }
}
```

Category is one of `incident`, `security`, or `customer_impact`. The bounded reference uses an uppercase prefix and positive numeric suffix such as `INC-41`, `SEC-7`, or `CHG-19`. The server derives the actor and rechecks the current permission under the admission transaction; actor and authorization fields in the JSON are rejected. Denied overrides return `403 DEPLOYMENT_WINDOW_OVERRIDE_FORBIDDEN` and never fall back to a normal start.

Execution preflight remains value-safe and unchanged. The UI adds the override envelope only to the final confirmed start request, never to the preview request or its fingerprint.

## Governance API

All endpoints are below `/api/project/{project_id}` and capability-gated.

| Operation | Endpoint | Required access |
|---|---|---|
| Read policy | `GET /deployment-windows` | Capability `read` and project resource management |
| Replace policy | `PUT /deployment-windows` | Capability `write` and project resource management |
| Reset policy | `DELETE /deployment-windows?expected_revision=N` | Capability `write` and project resource management |
| Preview draft | `POST /deployment-windows/preview` | Capability `execute`, project resource management, and target read/start |
| Current target status | `GET /deployment-windows/status?template_id=N` or `?workflow_id=N` | Target read/start |
| Decision history | `GET /deployment-windows/history?count=25&before=N` | Capability `read` and project resource management |

Preview requires exactly one project-owned template or workflow target and accepts the complete unsaved policy shape. Current status returns the coarse decision. Preview and history may return bounded administrator provenance, but never the decision key, override reference, normal start actor, rule name or recurrence, input, header, credential, or secret.

## UI integration

The existing project settings page contains the only governance surface: a capability-gated list editor, target impact preview, current status, next eligible time, and recent decision history. No route or navigation item is added. Existing task and workflow start dialogs show the coarse block result and reveal the category, reference, and explicit confirmation controls only after a blocked start.

## Audit

Policy update/reset, new admission decisions, successful execution bindings, terminal blocks, overrides, and denied override attempts use typed audit actions. Decision provenance is bounded to the decision ID, policy revision, UTC evaluation time, effective timezone, at most 64 matched `{id, revision, kind}` tuples, decision state/reason/source/origin, override actor/category, and linked task/workflow-run/run-node/schedule IDs.

Automatic sources have no normal actor in the audit protocol. Override references and decision keys are excluded. The v1 audit webhook intentionally omits deployment-window provenance; the current application audit retains it for authorized local inspection.

## Verification

```bash
go test ./db ./pro_interfaces ./services/deployment_windows ./services/tasks ./services/schedules ./api -count=1
(cd test/edition-contract/enhanced && go test ./db/sql ./services/server ./api/projects -count=1)
(cd web && yarn test:unit tests/unit/deployment-windows.spec.js tests/unit/execution-preflight.spec.js)
(cd web && VUE_APP_EDITION=pro yarn build)
```

Browser acceptance covers rule creation, impact preview, current status, blocked task and workflow starts, authorized overrides, denied overrides, recent history, and a 390-pixel viewport without horizontal overflow.
