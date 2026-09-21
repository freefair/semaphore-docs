# Configuration file

- [Loading order](#loading-order)
- [Server example](#server-example)
- [Runner example](#runner-example)
- [Nested objects and defaults](#nested-objects-and-defaults)
- [Secrets and changes](#secrets-and-changes)

Semaphore accepts YAML (`.yaml` or `.yml`) and JSON configuration files.
Both use the exact same field names.
Use the [complete parameter reference](../../reference/configuration.md) for every startup setting and nested provider field.
No online configurator or documentation build is needed.

## Loading order

1. `--config /absolute/path/config.yaml` selects an explicit file.
2. Otherwise, the native binary uses `SEMAPHORE_CONFIG_PATH` as a **file path**.
3. Otherwise, it searches the working directory, `/usr/local/etc/semaphore`, then `/etc/semaphore`; in each directory it tries `config.json`, `config.yaml`, then `config.yml` and loads the first readable file.
4. `--no-config` skips file loading and uses environment variables and defaults.
5. Present environment variables override their tagged file fields. Object-valued environment variables must contain JSON, even when the file is YAML.
6. Defaults are applied to zero-valued fields, and configuration is validated.

The Docker wrappers use `SEMAPHORE_CONFIG_PATH` as a **directory**, defaulting to `/etc/semaphore`.
The server wrapper generates/loads `config.json` there; the runner wrapper starts with `--no-config`.
See [container bootstrap settings](../../reference/configuration-schemas.md#container-bootstrap-settings) before sharing configuration between native and container deployments.

## Server example

Create `config.yaml` with non-secret deployment values:

```yaml
# PostgreSQL must already exist; Semaphore creates/migrates its own tables.
dialect: postgres
postgres:
  host: db.example.org:5432
  user: semaphore
  name: semaphore
  options:
    sslmode: verify-full
interface: 127.0.0.1
port: ':3000'
web_host: https://semaphore.example.org
tmp_path: /var/lib/semaphore/work
dirs:
  secrets: /var/lib/semaphore/secrets
  repos: /var/lib/semaphore/repositories
  ssh_agent_sockets: /var/lib/semaphore/sockets
schedule:
  timezone: UTC
max_parallel_tasks: 10
```

Choose the database, paths, bind address and public URL for your deployment.
The service account needs access to the configured directories and database.
Supply `SEMAPHORE_DB_PASS`, `SEMAPHORE_COOKIE_HASH`, `SEMAPHORE_COOKIE_ENCRYPTION` and `SEMAPHORE_ACCESS_KEY_ENCRYPTION` from your secret store or service environment before startup.
Cookie and encryption values are base64-encoded keys; use independent random 32-byte values, persist them, and share the same values across HA nodes.
For a rotating keyring, configure `encryption.keys_file` instead of the legacy access key variable; see [encryption](../security/encryption.md).

```bash
semaphore server --config ./config.yaml
```

The server starts its HTTP listener and applies database migrations.
On a new database, create the administrator using the [user commands](../../reference/cli/users.md).
Verify sign-in and the authenticated `/api/info` response, then run a task from the [getting-started guide](../../getting-started/README.md).

For a single-node SQLite installation replace the PostgreSQL block with:

```yaml
dialect: sqlite
sqlite:
  host: /var/lib/semaphore/database.sqlite
```

`sqlite.host` is the file path; `sqlite.name` does not select that file.
SQLite is not the shared database for an HA deployment.

## Runner example

The runner needs the server's public address and either a registration token or its previously issued runner token:

```yaml
web_host: https://semaphore.example.org
tmp_path: /var/lib/semaphore/work
runner:
  name: runner-01
  enabled: true
  tags: [linux, ansible]
  max_parallel_tasks: 4
  check_interval_seconds: 1
  token_file: /var/lib/semaphore/runner-token
  executor:
    type: local
```

For initial registration, supply `SEMAPHORE_RUNNER_REGISTRATION_TOKEN` through the process environment and run:

```bash
semaphore runner start --register --config ./runner.yaml
```

Persist the runner token and identity files, then start subsequent runs with `semaphore runner start --config ./runner.yaml`.
`runner.token` and `runner.token_file` are mutually exclusive.
`runner.enabled` sets the initial registration state; server-side policy still determines task placement.
See [runners](../runners.md) for registration permissions, secure identity, Docker and Kubernetes requirements.

## Nested objects and defaults

A dotted reference key such as `runner.executor.type` means nested YAML mappings; it is not a literal YAML key containing dots.
Named maps use arbitrary stable IDs, such as `oidc_providers.company`; the reference denotes these IDs with `<id>`.
Members of named maps have no independent environment bindings: supply the whole map as JSON in its parent variable.

Defaults are applied **after** environment overrides.
For non-pointer scalar fields with a tagged default, explicit zero, empty string or false can be replaced by that default.
For example, `git_attempts: 0` becomes `4`; use `1` for a single attempt.
The compatibility setting `oidc_providers.<id>.return_via_state` defaults to true and false is treated as unset.
Descriptions distinguish tagged defaults from runtime fallback behavior and accepted but unwired compatibility settings.

<a id="secrets-directory"></a>

## Secrets and changes

Use secret files or a secret-injecting process environment, and restrict file access to the service account.
Main-config strings are literal: `${VARIABLE}` in a YAML value is not expanded by the application.
`dirs.secrets` defines the allowed location of file-based secret sources.
Legacy `secrets_path` applies only when `dirs.secrets` is empty or still its default `/tmp/semaphore`.

Restart the server or runner after changing startup settings.
The separate encryption keys file supports polling and SIGHUP reload as described in the encryption guide.
Database-backed capability lifecycle and administrator settings are separate from startup configuration; see [feature controls](../configuration.md#feature-controls).

## Git operations

`git_client` selects `cmd_git` (the default, uses installed Git) or `go_git`.
`git_attempts` sets the total number of clone/pull attempts, default `4`; use `1` for no retries.
`git_submodule_jobs` sets command-line Git submodule fetch concurrency, default `4`.
Retries use exponential backoff from one second, capped at 60 seconds.
Persistent authentication failures require corrected credentials rather than more retries.
See [repositories](../../user-guide/repositories.md) for repository keys and host verification.
