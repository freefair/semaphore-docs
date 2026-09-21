# Additional configuration schemas

This reference complements the [complete startup parameter list](configuration.md).
It covers structured values declared in external types, the separate encryption file, process-only variables and container bootstrap inputs.

- [Logger objects](#logger-objects)
- [Encryption keys file](#encryption-keys-file)
- [Native process variables](#native-process-variables)
- [Container bootstrap settings](#container-bootstrap-settings)
- [Persisted runtime settings](#persisted-runtime-settings)

## Logger objects

These members apply to `log.events.logger`, `log.tasks.logger`, `log.tasks.result_logger` and `log.debug.logger`.
Supply them as a nested configuration mapping or as JSON in `SEMAPHORE_EVENT_LOGGER`, `SEMAPHORE_TASK_LOGGER`, `SEMAPHORE_TASK_RESULT_LOGGER` or `SEMAPHORE_DEBUG_LOGGER` respectively.
There are no individual environment bindings for these members.

| Member | Type / default | Meaning |
|---|---|---|
| `filename` | string; required when used | Absolute normalized regular-file destination. Relative paths, traversal, symlinks and special files are rejected. |
| `maxsize` | integer; `100` | Rotation size in MiB. Zero uses the library default of 100. |
| `maxage` | integer; `0` | Retention in 24-hour days; zero disables age-based removal. |
| `maxbackups` | integer; `0` | Maximum old files; zero disables count-based removal. Age limits still apply. |
| `localtime` | boolean; `false` | Use local time in backup filenames instead of UTC. |
| `compress` | boolean; `false` | Gzip rotated log files. |

```yaml
log:
  events:
    enabled: true
    format: json
    logger:
      filename: /var/log/semaphore/events.jsonl
      maxsize: 100
      maxage: 30
      maxbackups: 10
      compress: true
```

The selected writer requires `format: json` and at least one valid destination per enabled channel.
See [logs](../admin-guide/logs.md) for queue overflow, flushing, diagnostics and syslog.

## Encryption keys file

`encryption.keys_file` selects a separate JSON or YAML file; these are its members, not keys to put at the root of the main configuration.
The file combines a named key map and/or a directory of key files with active-key selections.

| Key | Type / default | Meaning |
|---|---|---|
| `keys` | map; empty | Map from operator-chosen labels to key sources. |
| `keys.<label>.value` | string; empty | Inline base64-encoded encryption key. Mutually exclusive with `file`; prefer a file source. |
| `keys.<label>.file` | string; empty | Path of a file containing the base64-encoded encryption key. Mutually exclusive with `value`. |
| `keys_folder` | string; empty | Directory of key files; filenames provide labels. Combined with `keys`. |
| `active.secret_key` | string; empty | Label of the active key for stored access-key secrets. |
| `active.option_key` | string; empty | Label of the active key for encrypted database options; when no separate option key is selected, the access key is the fallback. |
| `active.secret_key_file` | string; empty | Select the active access-key file from `keys_folder` by filename instead of label. |
| `active.option_key_file` | string; empty | Select the active option-key file from `keys_folder` by filename instead of label. |

Use exactly one selector per purpose, and retain old key material while any database row or backup still needs it.
For example, in the keys file:

```yaml
keys:
  current:
    file: /run/secrets/semaphore-access-key
active:
  secret_key: current
```

In the main configuration:

```yaml
encryption:
  keys_file: /etc/semaphore/encryption-keys.yaml
  keys_poll_interval: 15s
```

`keys_poll_interval: '0'` disables polling; SIGHUP still requests a reload.
Follow the [encryption guide](../admin-guide/security/encryption.md) for precedence, validation and rotation.

## Native process variables

| Variable | Type / default | Meaning |
|---|---|---|
| `SEMAPHORE_CONFIG_PATH` | string; automatic search | Configuration **file** path, overridden by `--config`; ignored by `--no-config`. |
| `SEMAPHORE_LOG_LEVEL` | string; `INFO` | Logging level when `--log-level` is absent; `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL` or `PANIC`. |
| `SEMAPHORE_DB_NAME` | string; empty | Non-empty value overrides the selected database name at connection time, taking precedence over `SEMAPHORE_DB` and the file's `name`. |
| `SEMAPHORE_RUNNER_REGISTRATION_TOKEN` | secret string; empty | Bootstrap registration token; consumed by the runner and the legacy server registration field. It is not the long-lived runner token. |
| `SEMAPHORE_GLOBAL_CREDENTIAL_PROVIDER_<NORMALIZED_ID>_CREDENTIAL` | secret string; required per configured provider when resolving | Provider token, AppRole Secret ID or Kubernetes service-account token. ID normalization uppercases letters and replaces supported separators with underscores; collisions are rejected. |

For example, provider ID `primary` uses `SEMAPHORE_GLOBAL_CREDENTIAL_PROVIDER_PRIMARY_CREDENTIAL`.
See [global credentials](../developer-guide/global-credential-grants.md#global-vault-and-openbao-providers) for the registry and grant model.
CLI flags are documented separately in the [command reference](cli/commands.md).
Standard process settings such as `PATH`, `HOME`, `HTTP_PROXY`, `HTTPS_PROXY` and `NO_PROXY` belong to the invoked tools and HTTP clients, not the Semaphore configuration schema.

## Container bootstrap settings

These variables are interpreted by the shipped wrappers, not by the native configuration parser.
Ordinary `SEMAPHORE_*` variables from the startup reference also remain available.
The server wrapper creates its configuration only when `config.json` is absent.
Initial administrator, import and migration values do not reconfigure an already initialized installation.

| Variable | Default / scope | Meaning |
|---|---|---|
| `SEMAPHORE_CONFIG_PATH` | `/etc/semaphore`; server and runner | Configuration **directory**. Server uses `config.json`; runner uses it for optional `requirements.txt` and otherwise starts with `--no-config`. |
| `SEMAPHORE_DB_PATH` | `/var/lib/semaphore`; server | Persistent database directory; SQLite defaults to `database.sqlite` inside it. |
| `SEMAPHORE_DB_DIALECT` | Existing config, otherwise `mysql`; server | Bootstrap engine. Set `sqlite` explicitly for the single-container example. The native binary's tagged default is different (`sqlite`). |
| `SEMAPHORE_DB_HOST` | Existing config; otherwise `0.0.0.0` or SQLite path | Database host; a supplied port is split into `SEMAPHORE_DB_PORT`. |
| `SEMAPHORE_DB_PORT` | `3306` MySQL, `5432` Postgres | Port used for the connectivity check and server connection. |
| `SEMAPHORE_DB` | `semaphore`; server | Database name supplied to setup. |
| `SEMAPHORE_DB_USER` / `SEMAPHORE_DB_PASS` | empty; server | Database username/password supplied to setup and runtime. |
| `SEMAPHORE_ADMIN` | empty; first setup | Initial local administrator username. |
| `SEMAPHORE_ADMIN_PASSWORD` | empty; first setup | Initial administrator password. |
| `SEMAPHORE_ADMIN_NAME` | `Semaphore Admin`; first setup | Administrator display name. |
| `SEMAPHORE_ADMIN_EMAIL` | `admin@localhost`; first setup | Administrator email address. |
| `SEMAPHORE_ACCESS_KEY_ENCRYPTION` | setup-generated when absent | Persistent legacy encryption key. Supply the existing key when reconnecting an existing database. |
| `SEMAPHORE_LDAP_ACTIVATED` | `no`; first setup | `yes` adds the legacy LDAP setup answers. |
| `SEMAPHORE_LDAP_HOST` / `SEMAPHORE_LDAP_PORT` | empty; first setup | Legacy LDAP address and port supplied to setup. |
| `SEMAPHORE_LDAP_NEEDTLS` | `no`; first setup | Legacy setup TLS answer. The native runtime binding is `SEMAPHORE_LDAP_NEEDTLS` too. |
| `SEMAPHORE_LDAP_DN_BIND` / `SEMAPHORE_LDAP_PASSWORD` | empty; first setup | Legacy LDAP bind DN and password. Runtime bindings use `SEMAPHORE_LDAP_BIND_DN` / `SEMAPHORE_LDAP_BIND_PASSWORD`. |
| `SEMAPHORE_LDAP_DN_SEARCH` | empty; first setup | Legacy search base. Runtime binding: `SEMAPHORE_LDAP_SEARCH_DN`. |
| `SEMAPHORE_LDAP_SEARCH_FILTER` | `(uid=%s)`; first setup | Legacy LDAP filter. |
| `SEMAPHORE_LDAP_MAPPING_DN` | `dn`; first setup | DN attribute. |
| `SEMAPHORE_LDAP_MAPPING_USERNAME` | `uid`; first setup | Username attribute. Runtime binding: `SEMAPHORE_LDAP_MAPPING_UID`. |
| `SEMAPHORE_LDAP_MAPPING_FULLNAME` | `cn`; first setup | Display-name attribute. Runtime binding: `SEMAPHORE_LDAP_MAPPING_CN`. |
| `SEMAPHORE_LDAP_MAPPING_EMAIL` | `mail`; first setup | Email attribute. Runtime binding: `SEMAPHORE_LDAP_MAPPING_MAIL`. |
| `SEMAPHORE_MIGRATE_FROM_BOLTDB` | empty; first setup, SQLite | BoltDB source path. `true` or `yes` (case-insensitive) selects `database.boltdb` under `SEMAPHORE_DB_PATH`. Review migration instructions before use. |
| `SEMAPHORE_MIGRATE_SKIP_TASK_OUTPUT` | empty; migration | Any non-empty value adds `--skip-task-output`, including the string `false`. |
| `SEMAPHORE_IMPORT_PROJECT_FILE` | empty; first setup | Project export file to import. |
| `SEMAPHORE_IMPORT_PROJECT_NAME` | empty; first setup | Optional imported project name override. |
| `SEMAPHORE_DATA_PATH` | `/var/lib/semaphore`; runner | Runner state directory. During registration, the wrapper defaults `SEMAPHORE_RUNNER_TOKEN_FILE` to `runner_token.txt` here if neither token nor token-file variable is provided. |
| `SEMAPHORE_TMP_PATH` | `/tmp/semaphore`; both | Working directory for task data. |
| `SEMAPHORE_WEB_ROOT` | empty; server | Public URL supplied to setup and runtime. |

The server wrapper supports `_FILE` variants for exactly these inputs:
`SEMAPHORE_DB_USER_FILE`, `SEMAPHORE_DB_PASS_FILE`, `SEMAPHORE_ADMIN_FILE`,
`SEMAPHORE_ADMIN_PASSWORD_FILE`, `SEMAPHORE_LDAP_PASSWORD_FILE` and `SEMAPHORE_ACCESS_KEY_ENCRYPTION_FILE`.
A non-empty direct variable and its non-empty `_FILE` variant are mutually exclusive.
The runner's `SEMAPHORE_RUNNER_REGISTRATION_TOKEN_FILE` and `SEMAPHORE_RUNNER_TOKEN_FILE` are native settings, documented in the main reference.
Do not assume every variable supports a `_FILE` suffix.

## Persisted runtime settings

Capabilities, managed LDAP providers, project roles, executor policy, audit webhooks, notification governance, deployment windows and project resources are stored in the database and configured through their administrator/project APIs and UI.
They are not additional undocumented startup keys.
Use [feature controls](../admin-guide/configuration.md#feature-controls), [the API guide](api.md) and each feature guide for those contracts.

## Unwired source declarations

`RecaptchaConfig` declares `SEMAPHORE_RECAPTCHA_ENABLED` and `SEMAPHORE_RECAPTCHA_SITE_KEY`, but it is not reachable from the main configuration structure.
These names are not supported runtime configuration inputs in this product.
Do not use an unreferenced Go type as evidence that a feature can be enabled.
