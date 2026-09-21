# Task Templates

A task template defines what to run and how: the application, the repository and the file to execute, the inventory, variable groups, credentials, and the options a user may change when starting a task. Every [task](../tasks.md) is created from a template.

Templates support the following applications:

* [Ansible](../apps/ansible.md)
* [Terraform/OpenTofu](../apps/terraform/README.md) and [Terragrunt](../apps/terragrunt.md)
* [Shell](../apps/bash.md)
* [PowerShell](../apps/powershell.md)
* [Python](../apps/python.md)

Administrators can enable or disable applications and add their own, see [Applications](../apps/README.md).

<a id="template-list"></a>

## Template list

The **Task Templates** section lists all templates of the project.

![Template list](../../../static/assets/templates-list.webp)

| Column | Content |
|---|---|
| **Name** | Template name with the application icon. The **play** button starts a new task. |
| **Version** | The latest build version for build and deploy templates, otherwise the result icon of the last task. |
| **Status** | Status badge of the last task, or *Not launched*. |
| **Last Task** | Number of the last task and who started it. |
| **Playbook** | The file the template runs. |
| **Inventory**, **Variable Groups**, **Repository** | Resources attached to the template. |

The tabs above the list are [views](views.md): named groups of templates. The gear icon in the top right corner lets you choose which columns are shown. Click the arrow on the left of a row to expand the latest tasks of that template.

![Expanded template row](../../../static/assets/templates-list-expanded.webp)

<a id="template-page"></a>

## Template page

Click a template name to open its page. The button in the top right corner starts a task (**Run**, **Build**, or **Deploy** depending on the type), **Stop all** stops every running or queued task of the template.

| Tab | Content |
|---|---|
| **Tasks** | Tasks of this template with a **rerun** button in every row. |
| **Details** | The playbook, type, inventory, variable groups, and repository, plus the task status chart with the same filters as [Stats](../projects/stats.md). |
| **Workspaces** | Terraform, OpenTofu, and Terragrunt templates only: the list of workspaces, see [Workspaces](../apps/terraform/workspaces.md). |

![Template details](../../../static/assets/template-details.webp)

<a id="template-types"></a>

## Template types

| Type | Purpose |
|---|---|
| **Task** | A plain run. The default type. |
| **Build** | Produces an artifact and assigns it an auto-incremented version. |
| **Deploy** | Deploys a version produced by a build template. |

Build and deploy templates and the `semaphore_vars` they pass to playbooks are described in [Build and deploy templates](build-deploy.md).

<a id="template-form"></a>

## Template form

Users with the **Manager** role or higher can create and edit templates with **New Template** and the pencil icon. The form is organized in the following groups. Fields marked with an application name appear only for that application.

<a id="common-fields"></a>

### Common fields

| Field | Description |
|---|---|
| **Name** | Required. Template name. |
| **Description** | Optional text shown under the name. |
| **App** | Application to run. |
| **Repository** | Repository with the playbook or script, see [Repositories](../repositories.md). |
| **Branch** | Git branch to check out. Empty means the branch configured in the repository. |
| **Playbook / Script filename** | Path to the file relative to the repository root. For Terraform apps: the subdirectory with the configuration. |
| **Different working directory** | Run the tool from another directory of the repository. |
| **Inventory** | Ansible inventory, or a workspace for Terraform apps. |
| **Variable Groups** | One or more variable groups whose variables and secrets are injected into the task, see [Variable Groups](../environment.md). |
| **Vault password** (Ansible) | Keys used to unlock Ansible Vault, see [Multiple vault passwords](../apps/ansible.md#multiple-vault-passwords). |
| **View** | Which [view](views.md) tab shows the template. |
| **CLI args** | Extra command line arguments as a JSON array, for example `["-vvv"]`. |

<a id="type-specific-fields"></a>

### Type-specific fields

| Field | Type | Description |
|---|---|---|
| **Start Version** | Build | The first version to assign, for example `1.0.0`. |
| **Build Template** | Deploy | The build template whose artifacts this template deploys. |
| **Autorun** | Deploy | Start a deploy automatically after every successful build. |

<a id="advanced-options"></a>

### Advanced options

| Field | Description |
|---|---|
| **Allow parallel tasks** | Let several tasks of this template run at the same time, see [Parallel tasks](#parallel-tasks). |
| **Alerts**, **Send on success**, **Send on error** | Whether notifications are sent for tasks of this template and on which results. Notifications also require **Allow alerts for this project** in [project settings](../projects/settings.md). |
| **Runner tag** | Run tasks only on runners with this tag, see [Project runners](../projects/runners.md). |
| **Executor image** | Container image for Docker and Kubernetes runners, see [Executor image](#executor-image-docker-and-kubernetes-runners). |
| **Issue JWT to task runner**, **JWT audience**, **JWT TTL** | Give the task a signed token, see [Task JWTs](jwt.md). |
| **Auto-run task if new git commit have been found** | Poll the repository at the given interval and start a task when the branch moves. |
| **Survey variables** | Inputs the user fills in when starting a task, see [Survey variables](survey-vars.md). |

<a id="prompts"></a>

### Prompts

Prompts are checkboxes that let the user change built-in options in the New Task dialog: branch, inventory, CLI arguments, and, for Ansible, limit, tags, skip tags, debug level, and Galaxy installation. See [Prompts](prompts.md).

<a id="application-options"></a>

### Application options

- **Ansible**: limit, tags, skip tags, and Galaxy installation options, see [Ansible](../apps/ansible.md).
- **Terraform/OpenTofu/Terragrunt**: auto approve and backend override, see [Terraform/OpenTofu](../apps/terraform/README.md) and [HTTP backend](../apps/terraform/states.md).

---

## Find a template

Use **Search templates** above the existing template table to filter the
templates you are allowed to see. Matching is case-insensitive and checks the
template name, description, playbook, and runner tags. Characters such as `%`
and `_` are treated as ordinary text rather than wildcards.

The result count and matching field update after a short pause in typing. The
matched text is highlighted without changing the available Run or navigation
actions. Press `/` while focus is outside another input to focus the search,
press Escape or use the clear action to restore the original list, and use the
browser Back and Forward actions to revisit searches stored in the URL.

Search applies the same template permissions as the ordinary list. A result
count therefore includes only templates that the current user can read.

---

<a id="parallel-tasks"></a>

## Parallel tasks

By default, tasks from the same template execute sequentially. To allow concurrent runs of the same template, enable the "Allow parallel tasks" option in the template settings.

<a id="executor-image-docker-and-kubernetes-runners"></a>

## Executor image (Docker and Kubernetes runners)

When a project runner uses the **Docker** or **Kubernetes** executor, each task normally runs in the default job image configured on the runner (for example `semaphoreui/job:latest`). You can override that image per template.

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

See [Runner configuration](../../admin-guide/configuration.md) for default image settings and [Project runners](../projects/runners.md) for executor setup.
