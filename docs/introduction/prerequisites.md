# Prerequisites

Semaphore has few hard requirements of its own. Most of what you need to prepare
belongs to the automation it will run and to the environment around it. Work through
this page before [Installation](../admin-guide/installation.md) and the install itself
takes minutes.

<a id="a-host"></a>

## A host

Semaphore ships as a single binary and as a container image, and runs on Linux,
macOS, and Windows. Linux is what the packages, the Docker images, and the Helm chart
target, and what most deployments use.

The service is light: it is a Go process serving a web interface. What actually
consumes memory and CPU is Ansible, Terraform, and your scripts, running in parallel
on the same machine. Size the host for the work, not for Semaphore, and cap
concurrency with the project setting **Max number of parallel tasks** — or move
execution onto [runners](../admin-guide/runners.md) and size those instead.

Plan for persistent storage in two places: the database, and the directory in
`tmp_path` where repositories are cloned. In Docker that means a volume; a container
without one loses its data on recreation.

<a id="a-database"></a>

## A database

Pick one before you install, because moving later means migrating data.

| Engine | Use it when |
|---|---|
| **SQLite** | One server, one team. Bundled, nothing to set up, the default. |
| **PostgreSQL** or **MySQL/MariaDB** | The service matters to more than a few people, you want backups and monitoring from your existing database platform, or you plan to run more than one node. |

[High availability](../admin-guide/ha.md) requires PostgreSQL or MySQL plus Redis, and
cannot use SQLite. If HA is on your roadmap, start on PostgreSQL.

Create the database and a user with rights on it before installing; Semaphore creates
its own tables on first start and on every upgrade.

<a id="network-access"></a>

## Network access

| Semaphore must reach | For |
|---|---|
| Your Git remotes | Cloning the repositories templates point at. |
| The hosts and cloud APIs you automate | Actually doing the work. |
| Your identity provider, if you use one | [LDAP](../admin-guide/authentication/ldap.md) or [OpenID Connect](../admin-guide/authentication/openid.md) sign-in. |
| Your notification channels | E-mail, Telegram, Slack, and the rest. |

Users reach the web interface on port `3000` unless you change it. Put
[TLS](../admin-guide/reverse-proxy/README.md) in front of that before anyone signs in: sessions
and API tokens travel over it.

If a runner will execute the tasks, then *it* needs the access to Git remotes and
target hosts, and it needs outbound access to the Semaphore server. The server never
connects to a runner.

<a id="automation-tooling"></a>

## Automation tooling

Whatever a task runs must be installed where it runs — on the server, or on the
runner, or in the container image the executor uses.

- The Docker images ship with Ansible, Terraform, OpenTofu, and the usual
  dependencies. Extra Python packages go in a mounted `requirements.txt`; see
  [Installing additional Python dependencies](../admin-guide/installation/docker.md#installing-additional-python-dependencies).
- A package or binary install gives you Semaphore alone. Install Git, Python, Ansible,
  and any collections or providers yourself; see
  [Manual installation](../admin-guide/installation_manually.md).

Verify that your playbook or configuration runs from a shell on that machine, as the
user Semaphore runs as, before you create a template from it. Almost every "it works
locally" report resolves to a missing collection, provider, or Python package.

<a id="credentials-to-have-ready"></a>

## Credentials to have ready

Collect these before the first template, because each one is a separate stop otherwise:

- A **deploy key or token** for each repository Semaphore will clone.
- The **SSH keys or logins** used to reach the hosts you manage.
- Any **cloud credentials** your Terraform or modules require.
- An **Ansible Vault password**, if your playbooks are encrypted.

All of them belong in the [Key Store](../user-guide/key-store.md), not in the repository.

<a id="decisions-to-make-first"></a>

## Decisions to make first

Three choices are cheap now and expensive later:

1. **Database engine**, as above.
2. **The URL users will use.** Set it as `web_host`. Reverse proxies, OIDC redirect
   URIs, webhook targets, and notification links all derive from it.
3. **`access_key_encryption`.** Generate it at install time, back it up separately,
   and never rotate it casually: every stored secret is encrypted with it.

```bash
head -c32 /dev/urandom | base64
```

<a id="whats-next"></a>

## What's next

- [Installation](../admin-guide/installation.md) — choose a method and install.
- [Configuration](../admin-guide/configuration.md) — how options are supplied and what they mean.
- [Getting Started](../getting-started/README.md) — from an installed server to a first task.
