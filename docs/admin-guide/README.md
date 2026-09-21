# Admin Guide

This section is for administrators who install and operate Semaphore for other
people. Everything here needs access the server itself: the configuration file,
environment variables, command line, or the machine Semaphore runs on. Work done
inside a project through the web interface is covered in the
[User Guide](../user-guide/README.md).

Semaphore is a single Go binary with a web interface and a REST API. It stores
its data in SQLite, MySQL, or PostgreSQL, keeps credentials encrypted, and runs
tasks either on the server itself or on separate runners. A working installation
therefore comes down to four decisions: how to install it, where the database
lives, how users sign in, and where tasks execute.

<a id="set-up"></a>

## Set up

Everything you configure before or around starting the server.

| Page | What it covers |
|---|---|
| [Installation](installation.md) | Package manager, Docker, binary, Kubernetes, and a manual setup. |
| [Configuration](configuration.md) | The `config.json` file, environment variables, and every supported option. |
| [Upgrading](upgrading.md) | Moving to a newer release and what to check first. |
| [Reverse proxy](reverse-proxy/README.md) | Serving Semaphore behind nginx, Apache, or Caddy, with TLS. |
| [Security](security.md) | Password hashing, secret encryption, network hardening, and task JWTs. |
| [Authentication](authentication/README.md) | Local accounts and two-factor, LDAP and Active Directory, and single sign-on with twelve OpenID Connect providers. |
| [Runners](runners.md) | Executing tasks on machines other than the server. |
| [High availability](ha.md) | Running several Semaphore nodes against one database. |

<a id="operate"></a>

## Operate

Everything you do on a server that is already running.

| Page | What it covers |
|---|---|
| [CLI](../reference/cli/README.md) | Managing users, projects, vaults, runners, and database migrations from the shell. |
| [API](../reference/api.md) | Authenticating with a token and driving Semaphore programmatically. |
| [CI/CD integration](cicd.md) | Starting Semaphore tasks from an external pipeline. |
| [Logs](logs.md) | Server logs, task logs, and forwarding them elsewhere. |
| [Metrics](metrics.md) | The Prometheus endpoint and the metrics it exposes. |
| [Notifications](notifications.md) | Delivery channels for alerts: e-mail, Telegram, Slack, and others. |

<a id="where-to-start"></a>

## Where to start

If you are installing Semaphore for the first time, read
[Installation](installation.md) and pick one method, then
[Configuration](configuration.md) to learn how options are supplied.
Put the server behind a [reverse proxy](reverse-proxy/README.md) with TLS
before anyone else uses it.
