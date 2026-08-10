# Task Templates

Templates define how to run Semaphore tasks. Currently the following task types are supported:

* [Ansible](/user-guide/apps/ansible)
* [Terraform/OpenTofu](/user-guide/apps/terraform)
* [Shell](/user-guide/apps/bash)
* [Powershell](/user-guide/apps/powershell)
* [Python](/user-guide/apps/python)

---

## Parallel tasks

By default, tasks from the same template execute sequentially. To allow concurrent runs of the same template, enable the "Allow parallel tasks" option in the template settings.

## Executor image (Docker and Kubernetes runners)

When a project runner uses the **Docker** (Pro) or **Kubernetes** (Enterprise) executor, each task normally runs in the default job image configured on the runner (for example `semaphoreui/job:latest`). You can override that image per template.

1. Open the template settings
2. Set **Executor image** to the container image reference (for example `my-registry/ansible:2.16` or `semaphoreui/job:latest`)
3. Save the template

**Behavior**:
- Only **Docker** and **Kubernetes** runner executors honor this field; the local executor ignores it
- Leave the field empty to use the runner's default image from `runner.executor.docker.image` or `runner.executor.k8s.image`
- Clearing the field in the UI removes the override

**Use cases**:
- Templates that need a different toolchain (older Ansible, a specific Terraform version, extra OS packages baked into a custom image)
- Isolated images for security-sensitive templates without changing the runner-wide default

See [Runner configuration](/admin-guide/configuration) for default image settings and [Project runners](/user-guide/projects/runners) for executor setup.
