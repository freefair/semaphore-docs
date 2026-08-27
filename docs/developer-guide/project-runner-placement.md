# Project Runner Tag Placement

Runner tag placement maps one task to one eligible project or global runner and records why that runner won. The decision is deterministic for the same candidate state, capacity-safe across server nodes, and visible to project members without exposing runner credentials or task secrets.

## Contents

- [Template policy](#template-policy)
- [Eligibility and precedence](#eligibility-and-precedence)
- [Atomic capacity claims](#atomic-capacity-claims)
- [Placement decision](#placement-decision)
- [HTTP contract](#http-contract)
- [User interface](#user-interface)
- [Persistence and rollback](#persistence-and-rollback)
- [Verification](#verification)

## Template Policy

A template stores a normalized `runner_tags` array and a `runner_tag_match_mode` of `all` or `any`.
Tags are trimmed, lower-cased, deduplicated, and sorted before persistence. Empty values are discarded. A policy is limited to 32 tags, with at most 255 bytes per normalized tag.

| Requested tags | Match mode | Eligible tag state |
|---|---|---|
| Empty | `all` by default | Runner is marked as default |
| One or more | `all` | Runner contains every requested tag |
| One or more | `any` | Runner contains at least one requested tag |

The legacy single `runner_tag` field remains populated with the first normalized tag for rollback compatibility. Reads prefer the multi-tag policy and fall back to the legacy template or inventory tag when the new field is unavailable.

## Eligibility and Precedence

Placement evaluates every project runner in the task's project and every global runner. Each candidate must satisfy all of these criteria:

- it belongs to the task's project or has global scope;
- it is active and registered;
- a poll-based runner has a fresh heartbeat, or it is webhook-driven;
- its authoritative unfinished assignment count is below `max_parallel_tasks`, unless the limit is unlimited; and
- its normalized tags satisfy the template policy, or it is a default runner when no tags were requested.

Candidates from another project are retained only in pure decision-engine tests to prove scope rejection; production queries do not load them for dispatch.

Eligible candidates are ordered by:

1. project scope before global scope;
2. fewer current task assignments; and
3. lower stable runner ID.

Input order does not affect the result. A project runner therefore wins over a less-loaded global runner, while two runners in the same scope use load and then ID as deterministic tie-breakers.

## Atomic Capacity Claims

The in-memory evaluation is advisory. SQL owns the final assignment and capacity decision.

`AssignTaskRunner` locks the selected runner row, counts every unfinished task assigned to that runner, checks `max_parallel_tasks`, and conditionally assigns only an unassigned `waiting` or `starting` task in one transaction. The runner lock serializes claims to the same project runner and to the same global runner across different projects.

A dispatch that loses the claim reevaluates the remaining candidate state. Runner webhooks are called only after SQL reserved capacity, so a rejected concurrent claim cannot start untracked external work. A webhook failure closes the reserved task attempt through the normal task failure path and releases the slot.

## Placement Decision

Every evaluation produces a non-secret `placement_decision`:

```json
{
  "requested_tags": ["gpu", "linux"],
  "match_mode": "all",
  "selected_runner_id": 17,
  "selected_runner_name": "project-gpu",
  "selected_scope": "project",
  "reason": "selected project runner #17 by scope, current load, and stable runner id",
  "evaluations": [
    {
      "runner_id": 17,
      "runner_name": "project-gpu",
      "scope": "project",
      "eligible": true,
      "accepted_criteria": [
        "project scope accepted",
        "active",
        "registered",
        "heartbeat accepted",
        "capacity available",
        "tag policy matched"
      ],
      "rejected_criteria": []
    }
  ]
}
```

Rejected decisions omit the selected runner and add an `action_hint`. Reasons distinguish no configured runner, no default, tag mismatch, inactivity, missing registration, stale heartbeat, capacity exhaustion, and mixed blockers. Every reason includes a concrete corrective action.

The decision contains runner IDs, names, scope, and allowlisted criterion labels. It never serializes authentication tokens, registration hashes, public keys, webhook URLs, environment values, task arguments, or secrets.

## HTTP Contract

The existing APIs carry the new fields without adding a placement-specific mutation route:

| Operation | Contract |
|---|---|
| `GET /api/project/{project_id}/runner_tags` | Returns normalized, sorted tags from the project's runners and eligible global runners, with a distinct runner count |
| Project runner create/update | Accepts `tags`; validation and normalization happen before any runner mutation |
| Template create/update/read | Accepts and returns `runner_tags` and `runner_tag_match_mode` |
| Direct task start | Uses the persisted template policy when the queued task reaches remote dispatch |
| `GET /api/project/{project_id}/tasks/{task_id}` | Returns the latest redacted `placement_decision` |
| `GET /api/project/{project_id}/tasks/{task_id}/runner-attempts` | Returns `requested_tags`, `match_mode`, and `placement_reason` with each assigned attempt |

Project and task middleware continue enforcing their existing scope. Placement does not broaden runner, template, or task visibility.

## User Interface

Template advanced settings provide a multi-value runner-tag selector. Authors can select known tags or enter new ones and choose whether all or any tags must match. An empty selection explicitly means default-runner placement.

Task details display:

- the selected or rejected placement summary;
- an actionable hint when no runner qualifies;
- the requested policy and placement reason for every assignment attempt; and
- accepted and rejected criterion chips for every considered runner.

The attempt and criteria layouts wrap on narrow screens so the explanation remains usable on mobile widths.

## Persistence and Rollback

Migration `2.20.6` adds:

- `project__template.runner_tags` and `runner_tag_match_mode`;
- `task.placement_decision`; and
- `task__runner_attempt.requested_tags`, `match_mode`, and `placement_reason`.

The reverse migration removes only these enhanced fields. The legacy template `runner_tag`, task state, runner rows, and assignment history remain intact.

## Verification

Run the focused backend and clean-room contracts with:

```bash
go test ./db ./db/sql ./services/tasks ./services/server ./api/projects ./api/runners -count=1
go test -race ./db/sql ./services/tasks ./services/server ./api/projects -count=1
go run /tmp/semaphore-runner-placement-contract.go
GOWORK="$PWD/test/edition-contract/go.work" \
  go test github.com/semaphoreui/semaphore/pro/api/projects -count=1
```

Run the UI contract and build with the repository's supported Node.js version:

```bash
cd web
npm run test:unit -- tests/unit/runner-placement.spec.js
node_modules/.bin/eslint \
  src/components/RunnerForm.vue src/components/TemplateForm.vue \
  src/components/TaskDetails.vue tests/unit/runner-placement.spec.js
npm run build
```

Browser acceptance edits a template to require multiple tags, verifies both match modes, opens a task with a selected project runner, and opens a rejected task with its corrective hint and per-runner criteria at desktop and mobile widths.
