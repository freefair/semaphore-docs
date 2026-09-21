# User Guide

This section is for people who already have access to a Semaphore project.
Everything here happens in the web interface or through the project API. Installing
the server, configuring it, and connecting an identity provider are covered in the
[Admin Guide](../admin-guide/README.md).

Work in Semaphore follows one chain. A **project** holds everything else. Inside it
you register the resources a run needs: a **repository** with your playbooks or
scripts, the **keys** used to reach it and your hosts, an **inventory** of target
machines, and **variable groups** with values and secrets. A **task template**
combines those into a definition of what to run, and every run of that template is
a **task**. Schedules, workflows, and incoming webhooks start templates for you.

<a id="set-up-a-project"></a>

## Set up a project

In this order, because each step depends on the previous one.

| Page | What it covers |
|---|---|
| [Projects](projects.md) | Creating a project, the sections in the sidebar, backup and restore. |
| [Teams](team.md) | The four built-in roles, and custom roles included in Semaphore EX. |
| [Key Store](key-store.md) | SSH keys, logins, and external secret storages. |
| [Repositories](repositories.md) | Git repositories and local paths that hold your automation. |
| [Inventory](inventory.md) | Hosts and connection settings for Ansible, workspaces for Terraform. |
| [Variable Groups](environment.md) | Reusable variables and secrets passed into tasks. |

<a id="define-and-run-work"></a>

## Define and run work

| Page | What it covers |
|---|---|
| [Task Templates](task-templates/README.md) | Every field of the template form, plus template types. |
| [Apps](apps/README.md) | What each application runs: Ansible, Terraform, OpenTofu, Terragrunt, and scripts. |
| [Tasks](tasks.md) | Starting a task, task statuses, logs, stopping, and re-running. |
| [Schedules](schedules.md) | Running templates on a cron schedule. |
| [Workflows](workflows.md) | Chaining templates with approvals and branching. |
| [Integrations](integrations.md) | Starting tasks from incoming webhooks. |
| [Project runners](projects/runners.md) | Sending a project's tasks to your own runners. |
| [Your account](account.md) | Personal settings and API tokens. |

<a id="where-to-start"></a>

## Where to start

If someone has just added you to a project, read [Projects](projects.md)
to find your way around, then [Tasks](tasks.md) to run one and read its
log. If you are setting a project up from scratch, follow the table above in order.

New to Semaphore entirely? Start with [Getting Started](../getting-started/README.md).
