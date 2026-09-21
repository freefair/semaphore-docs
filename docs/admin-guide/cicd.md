# CI/CD integration

Semaphore can be a step in an external pipeline, and it can run its own simple build and deploy pipelines.

<a id="build-and-deploy-pipelines-inside-semaphore"></a>

## Build and deploy pipelines inside Semaphore

Template types **Build** and **Deploy**, artifact versioning, and the `semaphore_vars` variable are described in the user guide: [Build and deploy templates](../user-guide/task-templates/build-deploy.md). Multi-step pipelines with approvals are built with [Workflows](../user-guide/workflows.md).

<a id="starting-semaphore-tasks-from-an-external-ci-system"></a>

## Starting Semaphore tasks from an external CI system

There are two ways to trigger a task from GitHub Actions, GitLab CI, Jenkins, or any other system:

- **Integrations**: a webhook URL per project that starts a template when the request matches. It supports GitHub signatures, tokens, and HMAC and can pass request fields to the task as variables. See [Integrations](../user-guide/integrations.md).
- **REST API**: create a task with an API token:

```bash
curl -X POST https://semaphore.example.com/api/project/1/tasks \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"template_id": 5, "message": "Triggered by CI"}'
```

The response contains the task ID. Poll `GET /api/project/1/tasks/{task_id}` until the `status` is `success`, `error`, or `stopped`. See [API](../reference/api.md) for tokens and the built-in Swagger reference.
