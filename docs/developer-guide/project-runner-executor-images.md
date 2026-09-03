# Project Runner Executor Images

A template can request one credential-free OCI image for execution by a compatible Docker or Kubernetes runner. The server validates the request at every write and task-start boundary, freezes the resolved value on the task, and never silently falls back to local execution.

## Image Contract

`executor_image` is optional. An omitted, empty, or whitespace-only value means that the selected runner uses its configured default image.

A non-empty value must:

- be at most 255 bytes after trimming;
- use a lower-case repository path;
- contain no whitespace or URL scheme;
- use an OCI-style optional tag or digest; and
- contain no registry user information or credentials.

Examples:

```text
ubuntu:latest
registry.example.com/team/job:1.2
localhost:5000/team/job@sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

Values such as `https://registry.example.com/job`, `user:password@registry.example.com/job`, and upper-case repository paths are rejected with `400`.

## Capability Enforcement

The committed full-product module is the source of Docker and Kubernetes executor availability.
One resolver is shared by template writes and the task pool.

- The shipped product includes both Docker and Kubernetes executor support.
- Availability is independent of the requesting user and any subscription plan.
- Schedules, workflows, integrations, and direct API starts all pass through the task-pool check, so they cannot bypass the UI or template API.

Template create/update returns `403` when the image capability is unavailable. Task start revalidates both capability and syntax before inserting a task.

## Runner Compatibility

Runners report one execution strategy: `local`, `docker`, or `k8s`. Missing reports from older runners are treated as `local`.

The strategy is sent during registration and on every authenticated poll in `X-Runner-Executor-Type`, then persisted on the runner. Unknown values are rejected.

An image task can be placed only on a Docker or Kubernetes runner. Tag matching and project/global precedence remain unchanged. A local candidate receives the redacted rejection criterion `executor image unsupported`. If every tag-compatible candidate is local, placement explains the failure and tells the author to use a container runner or clear the image.

Task start rejects a known incompatible runner set with `409` before task insertion or enqueue. No matching runners remains the normal actionable waiting flow, because a compatible runner can still be registered later.

The runner repeats the compatibility check before constructing an executor. This protects rolling upgrades and stale runner metadata from delivering an image task to a local subprocess executor.

## Immutable Resolution

At task creation, the server copies the normalized template value into:

- `task.requested_executor_image`; and
- `task.resolved_executor_image`.

The current policy resolves both to the same value. Keeping separate fields makes future allowlist, alias, mirror, or signature resolution auditable without changing the task contract.

Each successful assignment copies both values into `task__runner_attempt`. The runner job payload also carries `executor_image` explicitly and overwrites the mutable template snapshot before constructing the executor. Editing or clearing the template after enqueue therefore cannot change an existing task.

Task details show requested and resolved values and the resolved value for each attempt. Because invalid references and registry user information are rejected before persistence, these fields cannot expose registry credentials.

## Persistence

Migration `2.20.7` adds:

- `runner.executor_type` with the backward-compatible `local` default;
- requested and resolved image fields on `task`; and
- requested and resolved image snapshots on `task__runner_attempt`.

The existing `project__template.executor_image` column from migration `2.19.12` remains the template baseline.

## Verification

Run the backend and independent contracts with:

```bash
go test ./db ./db/sql ./services/capabilities ./services/tasks ./services/runners ./api/projects ./api/runners -count=1
go test -race ./db/sql ./services/tasks ./services/runners ./api/projects ./api/runners -count=1
go run /tmp/semaphore-executor-image-contract.go
GOWORK="$PWD/test/edition-contract/go.work" go test github.com/semaphoreui/semaphore/pro/... -count=1
```

Run the UI and docs checks with:

```bash
cd web
npm run test:unit -- tests/unit/runner-placement.spec.js
node_modules/.bin/eslint src/components/TemplateForm.vue src/components/TaskDetails.vue tests/unit/runner-placement.spec.js
npm run build

cd ../docs
npm run build
```

Browser acceptance saves and clears a normalized image, opens a task whose immutable resolved image reached a Docker-compatible runner, and verifies the task and attempt values at desktop and mobile widths.
