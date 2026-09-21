# What is Semaphore

Semaphore UI is a self-hosted web interface and REST API for running automation that
you already have. You point it at a Git repository holding your Ansible playbooks,
Terraform configurations, or shell scripts, tell it which credentials and hosts to
use, and it becomes the one place where your team runs that automation, stores the
secrets it needs, and keeps a record of every run.

You can run tasks individually or combine them into a single pipeline with
[Workflows](../user-guide/workflows.md), connecting builds, tests, deployments,
and infrastructure automation.

Semaphore does not replace Ansible, Terraform, or your scripts. It runs them, on a
server instead of on someone's laptop.

<a id="the-problem-it-solves"></a>

## The problem it solves

Automation usually starts on a workstation. One engineer has the playbook, the
inventory, the SSH key, and the right version of Ansible installed. That works until
a second person needs to run the same thing, or until someone asks what changed on a
host last Tuesday.

Semaphore moves the run to a shared server and adds the parts that were missing:

| Missing piece | What Semaphore provides |
|---|---|
| Everyone needs the tooling installed | One server (or a runner) has it; users only need a browser. |
| Credentials are copied between laptops | Encrypted [Key Store](../user-guide/key-store.md) that hands secrets to the run, never to the user. |
| No record of who ran what | Every [task](../user-guide/tasks.md) keeps its output, exit status, user, and time. |
| Nobody should have root to run one playbook | [Roles](../user-guide/team.md) decide who may run, edit, or only watch. |
| Runs happen when someone remembers | [Schedules](../user-guide/schedules.md), [webhooks](../user-guide/integrations.md), and API calls start them. |

<a id="who-it-is-for"></a>

## Who it is for

- **Infrastructure and platform teams** that already use Ansible or Terraform and want
  their colleagues to run it without handing out production credentials.
- **Teams building CI/CD pipelines** that want to connect build, test, and deployment
  tasks using workflows, alongside scheduled and on-demand operational jobs.
- **Teams with a CI/CD platform** that want operational runs — restarts, deployments,
  certificate renewals — kept out of the build system and visible to people who do not
  read pipeline YAML.

Semaphore is self-hosted. There is no SaaS version: you run the binary or container on
your own infrastructure, and your secrets never leave it.

<a id="what-it-runs"></a>

## What it runs

Each [task template](../user-guide/task-templates/README.md) chooses an application:

- [Ansible](../user-guide/apps/ansible.md) — playbooks with inventories, vault passwords, and
  the full `ansible-playbook` option set.
- [Terraform, OpenTofu, and Terragrunt](../user-guide/apps/terraform/README.md) — plan and apply with
  workspaces and state held by your backend.
- [Shell](../user-guide/apps/bash.md), [PowerShell](../user-guide/apps/powershell.md), and
  [Python](../user-guide/apps/python.md) — anything that is not covered by the above.

Tasks run on the server itself or on [runners](../admin-guide/runners.md) placed close to the
systems they manage.

[Workflows](../user-guide/workflows.md) connect task templates into a pipeline
using a visual editor. Each step can run a different application: for example,
build and test source code with shell scripts, provision infrastructure with
Terraform, then deploy with Ansible. You can add approval steps, timed pauses,
and branches that run on success or failure. Semaphore starts downstream tasks
automatically when their conditions are met.

<a id="when-not-to-use-it"></a>

## When not to use it

Knowing the edges saves time later.

- **Replacing Ansible or Terraform.** Semaphore has no execution engine of its own. If
  your playbook does not work from a shell, it will not work from Semaphore.
- **Acting as a CMDB.** [Inventories](../user-guide/inventory.md) are the inventories your
  runs need, not a source of truth about your estate. Generate them from your real source
  with a dynamic inventory.
- **Being your organisation's secret manager.** Secrets are encrypted at rest and are
  designed to be used by tasks, not read back by people. If you already run HashiCorp
  Vault or another store, [connect it](../user-guide/key-store.md) rather than copying secrets in.
- **Running a single-node service where any downtime is unacceptable.** Multiple active
  nodes need [high availability](../admin-guide/ha.md), which requires PostgreSQL or MySQL plus Redis.

<a id="whats-next"></a>

## What's next

- [Architecture](architecture.md) — the processes, the database, and where tasks execute.
- [Core concepts](concepts.md) — the ten words the interface expects you to know.
- [Getting Started](../getting-started/README.md) — install it and run something.
