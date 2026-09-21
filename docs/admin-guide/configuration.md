---
title: Configuration
description: Choose how to configure Semaphore, understand setting precedence, and set the public URL users connect to.
---

# Configuration

Semaphore reads its settings from a configuration file and environment variables.
The online configurator helps you prepare either format by filling in a form.
Choose the workflow that fits how you run your server.

## In this section {#in-this-section}

| Method | Use it when |
|---|---|
| [Online configurator](/admin-guide/configuration/online) | You want a form that generates configuration and startup commands for a binary or Docker installation. |
| [Configuration file](/admin-guide/configuration/config-file) | You want to keep server settings in a `config.json` file. |
| [Environment variables](/admin-guide/configuration/env-vars) | You manage settings through Docker, a service definition, or your deployment tools. |

## Feature controls {#feature-controls}

The [generated reference](/reference/configuration) lists startup configuration and boolean defaults, including flags inside named app and provider objects.
A setting accepted by the parser is not necessarily an effective feature switch: legacy compatibility fields and unsupported values are identified in their descriptions.
Optional infrastructure, configured policies, and permissions still determine whether an included feature can be used.

Startup settings such as `ha.enabled`, `metrics.enabled`, file-log `enabled` flags, and alert-channel flags control their configured subsystem.
Their defaults are `false`; enabling one still requires its destination, infrastructure, or per-task alert selection where applicable.
`runner.enabled` supplies the initial enabled state during registration and does not start or stop a runner process.
`teams.invites_enabled` controls invitation UI visibility, while backend project permissions remain authoritative; `teams.members_can_leave` currently has no runtime consumer.

The `/api/info` feature booleans describe which implementations are included.
For example, HA can be included while `ha.enabled` is `false`.
The backend capability registry below has no generic `config.json` or environment-variable binding for its IDs:

| Capability ID | Initial effective state | Where behavior is controlled |
|---|---|---|
| `lifecycle_test` | `disabled` without a saved row | Administrator-only contract fixture, configured through `/api/capabilities/lifecycle-test`; not a product switch. See [Capability lifecycle](/developer-guide/capability-lifecycle). |
| `runtime_secrets` | `active` without a saved row | Persisted administrator configuration through `/api/capabilities/runtime-secrets`. `active` grants read/write/execute; `read_only` grants read/execute; `disabled` and expired retain read only. See [Runtime secrets](/developer-guide/runtime-secrets). |
| `totp` | `disabled` without a saved row | Administrator TOTP lifecycle: `disabled`, `shadow`, `optional`, `required_selected`, or `required`. Legacy TOTP booleans do not select this rollout. See [TOTP lifecycle](/developer-guide/totp-capability-lifecycle). |
| `project_runners` | `active` | Runner registration, enabled state, project scope, and permissions. See [Runners](/admin-guide/runners). |
| `ldap` | `active` capability; new providers are `disabled` | Each database-managed provider has `disabled`, `shadow`, `selected_users`, and `active` states. Legacy LDAP environment variables do not enable these providers. See [LDAP](/admin-guide/authentication/ldap). |
| `workflow_triggers` | `active` | Trigger configuration, lifecycle, and project permissions. |
| `project_roles` | `active` | Administrator/project role and membership rules. |
| `execution_preflight` | `active` | Execution authorization and the reviewed plan. |
| `deployment_windows` | `active` | Configured project deployment windows and policy. |
| `policy_guardrails` | `active` | Configured rules and admission policy. |

Capability access never replaces authenticated routes, role permissions, or resource ownership checks.
State names are feature-specific: the `lifecycle_test` read-only example denies execution, whereas runtime-secret read-only mode intentionally permits existing resolution.
Audit-webhook export is another persisted control: configure its endpoint and signing key in the administrator UI, then pause or resume delivery there. See [Audit webhook](/admin-guide/logs#audit-webhook).

## Configuration options {#configuration-options}

An environment variable overrides the corresponding value in the configuration
file. The built-in default applies when neither is set. If editing the file has no
effect, check the environment passed to the Semaphore process.

| Config file option / Environment variable     | Description                        |
| ----------------------- | --------------------------------------------------------- |
| **Common** ||
| <br />`git_client`      <hr /> `SEMAPHORE_GIT_CLIENT`<br /><br /> | Type of Git client. Can be `cmd_git` (default) or `go_git`. |
| <br />`git_attempts`    <hr /> `SEMAPHORE_GIT_ATTEMPTS`<br /><br /> | How many times a git clone or pull is tried before the task fails. Uses exponential backoff (1s, then 2s, 4s, … up to 60s) between attempts. Default: `4`. Set to `1` to disable retries. |
| <br />`ssh_config_path` <hr /> `SEMAPHORE_SSH_PATH`<br /><br /> | Path to custom SSH configuration file. Default: `~/.ssh/config`. |
| <br />`port`           <hr /> `SEMAPHORE_PORT`<br /><br /> | TCP port on which the web interface will be available. Default: `:3000` |
| <br />`interface`      <hr /> `SEMAPHORE_INTERFACE`<br /><br /> | Bind address (empty = all interfaces). Useful if your server has multiple network interfaces. |
| <br />`tmp_path`       <hr /> `SEMAPHORE_TMP_PATH`<br /><br /> | Path to directory where cloned repositories and generated files are stored. Default: /tmp/semaphore |
| <br />`dirs.secrets` <hr /> `SEMAPHORE_SECRETS_PATH`<br /><br /> | Path to directory where secrets are stored (for example Vault token files). Default: `/tmp/semaphore`. Legacy top-level `secrets_path` is still accepted when `dirs.secrets` is unset or left at the default. |
| <br />`dirs.repos` <hr /> `SEMAPHORE_REPOS_DIR`<br /><br /> | Path to directory where repositories are stored. |
| <br />`dirs.ssh_agent_sockets` <hr /> `SEMAPHORE_SSH_AGENT_SOCKETS_DIR`<br /><br /> | Path to directory where SSH agent sockets are stored. Default: /tmp/semaphore |
| <br />`home_dir_mode`  <hr /> `SEMAPHORE_HOME_DIR_MODE` <br /><br /> | Controls how the HOME environment variable is set for tasks. Options: `template_dir` (default), `project_home`, `user_home`. |
| <br />`max_parallel_tasks`    <hr /> `SEMAPHORE_MAX_PARALLEL_TASKS` <br /><br /> | Max number of parallel tasks that can be run on the server. Default: 9999 |
| <br />`max_task_duration_sec` <hr /> `SEMAPHORE_MAX_TASK_DURATION_SEC` <br /><br /> | Max duration of a task in seconds. |
| <br />`max_tasks_per_template`<hr /> `SEMAPHORE_MAX_TASKS_PER_TEMPLATE` <br /><br /> | Maximum number of recent tasks stored in the database for each template. |
| <br />`schedule.timezone`     <hr /> `SEMAPHORE_SCHEDULE_TIMEZONE` <br /><br /> | Timezone used for scheduling tasks and cron jobs. Default: UTC |
| <br />`oidc_providers` ![Static Badge](https://img.shields.io/badge/v2.10+-red) <hr /> `SEMAPHORE_OIDC_PROVIDERS` <br /><br /> | OpenID provider settings. You can provide multiple OpenID providers. More about OpenID configuration read in [OpenID](/admin-guide/authentication/openid). |
| <br />`password_login_disable` <hr /> `SEMAPHORE_PASSWORD_LOGIN_DISABLED` <br /><br /> ![Static Badge](https://img.shields.io/badge/v2.10+-red)    <br /><br /> | Disable ordinary password login. The designated local administrator may still use password recovery under the managed LDAP recovery policy; see [Local authentication](/admin-guide/authentication/local). |
| <br />`non_admin_can_create_project`      <hr /> `SEMAPHORE_NON_ADMIN_CAN_CREATE_PROJECT` <br /><br /> | Allow non-admin users to create projects. |
| <br />`env_vars`               <hr /> `SEMAPHORE_ENV_VARS` <br /><br /> | JSON map which contains environment variables exposed to task runs. |
| <br />`forwarded_env_vars`     <hr /> `SEMAPHORE_FORWARDED_ENV_VARS` <br /><br /> | JSON array of host environment variables which will be forwarded into task runs. |
| <br />`apps`                   <hr /> `SEMAPHORE_APPS` <br /><br /> | JSON map which contains apps configuration. |
| <br />`use_remote_runner`      <hr /> `SEMAPHORE_USE_REMOTE_RUNNER` <br /><br /> | Deprecated remote-runner fallback when `runners.default_global_runners_mode` is empty. An explicit mode takes precedence; project runner policies are separate. |
| <br />`runner_registration_token` <hr /> `SEMAPHORE_RUNNER_REGISTRATION_TOKEN` <br /><br /> | Bootstrap token used by runners to register with the server. |
| **JWT** ||
| <br />`jwt.enabled` <hr /> `SEMAPHORE_JWT_ENABLED` <br /><br /> | Publish the JWKS endpoint and permit task JWT issuance for templates that enable JWT parameters. Default: `false`. |
| <br />`jwt.issuer` <hr /> `SEMAPHORE_JWT_ISSUER` <br /><br /> | Value emitted in the `iss` claim of issued JWTs. |
| <br />`jwt.default_ttl` <hr /> `SEMAPHORE_JWT_DEFAULT_TTL` <br /><br /> | Default lifetime of an issued task JWT, as a Go duration (e.g. `30m`, `1h`). Default: 1h |
| <br />`jwt.max_ttl` <hr /> `SEMAPHORE_JWT_MAX_TTL` <br /><br /> | Hard upper bound on per-template JWT TTL, as a Go duration. Default: 24h |
| **Runner** ||
| <br />`runner.registration_token_file` <hr /> `SEMAPHORE_RUNNER_REGISTRATION_TOKEN_FILE` <br /><br /> | Path to file containing the runner registration token. |
| <br />`runner.token` <hr /> `SEMAPHORE_RUNNER_TOKEN` <br /><br /> | Runner authentication token. Mutually exclusive with `runner.token_file`. |
| <br />`runner.token_file` <hr /> `SEMAPHORE_RUNNER_TOKEN_FILE` <br /><br /> | Path to token file for runner registration. |
| <br />`runner.identity_private_key_file` <hr /> `SEMAPHORE_RUNNER_IDENTITY_PRIVATE_KEY_FILE` <br /><br /> | Path to the runner's Ed25519 private identity. When unset, Semaphore uses a path beside the runner configuration file and creates it with mode `0600`. |
| <br />`runner.one_off` <hr /> `SEMAPHORE_RUNNER_ONE_OFF` <br /><br /> | Runner processes a single job and exits. Useful for dynamic runners. |
| <br />`runner.enabled` <hr /> `SEMAPHORE_RUNNER_ENABLED` <br /><br /> | Initial enabled value sent during runner registration; defaults to `false`. It does not start or stop the runner process or replace server-side registration state. |
| <br />`runner.webhook` <hr /> `SEMAPHORE_RUNNER_WEBHOOK` <br /><br /> | Webhook URL for runner. |
| <br />`runner.name` <hr /> `SEMAPHORE_RUNNER_NAME` <br /><br /> | Runner name. |
| <br />`runner.tags` <hr /> `SEMAPHORE_RUNNER_TAGS` <br /><br /> | JSON array of runner tags. |
| <br />`runner.max_parallel_tasks` <hr /> `SEMAPHORE_RUNNER_MAX_PARALLEL_TASKS` <br /><br /> | Max number of parallel tasks for the runner. Default: 9999. |
| <br />`runner.check_interval_seconds` <hr /> `SEMAPHORE_RUNNER_CHECK_INTERVAL_SECONDS` <br /><br /> | How often the runner polls the server for new jobs and reports progress, in seconds. Default: 1. Higher values reduce request volume at the cost of slightly slower job pickup. |
| <br />`runner.project_id` <hr /> `SEMAPHORE_RUNNER_PROJECT_ID` <br /><br /> | Restrict the runner to a single project. |
| <br />`runner.connection.server_ca_cert_file` <hr /> `SEMAPHORE_RUNNER_SERVER_CA_CERT_FILE` <br /><br /> | PEM bundle used to verify the Semaphore server certificate, in addition to the system trust store. Set when the server uses a self-signed or internal-CA certificate. |
| <br />`runner.connection.skip_tls_verify` <hr /> `SEMAPHORE_RUNNER_SKIP_TLS_VERIFY` <br /><br /> | Disable server certificate verification entirely. Insecure (vulnerable to MITM) — use only for testing. |
| <br />`runner.executor` <hr /> `SEMAPHORE_RUNNER_EXECUTOR` <br /><br /> | JSON object with the full runner executor configuration (`type` plus nested `docker` or `k8s` settings). Use when you want to set the entire executor block from a single environment variable. |
| <br />`runner.executor.type` <hr /> &mdash; <br /><br /> | Strategy the runner uses to execute each task: `local` (default), `k8s` or `docker`. |
| <br />`runner.executor.k8s.kubeconfig` <hr /> `SEMAPHORE_RUNNER_K8S_KUBECONFIG` <br /><br /> | Absolute path to a runner-owned kubeconfig file. Empty selects explicit in-cluster authentication. |
| <br />`runner.executor.k8s.context` <hr /> `SEMAPHORE_RUNNER_K8S_CONTEXT` <br /><br /> | Exact kubeconfig context. Required when `kubeconfig` is set; `current-context` is never used. |
| <br />`runner.executor.k8s.cluster_alias` <hr /> `SEMAPHORE_RUNNER_K8S_CLUSTER_ALIAS` <br /><br /> | Required non-secret cluster label shown in task diagnostics. |
| <br />`runner.executor.k8s.namespace` <hr /> `SEMAPHORE_RUNNER_K8S_NAMESPACE` <br /><br /> | Namespace where task Jobs are created. Default: semaphore |
| <br />`runner.executor.k8s.image` <hr /> `SEMAPHORE_RUNNER_K8S_IMAGE` <br /><br /> | Required default task image with an immutable `@sha256:` digest. |
| <br />`runner.executor.k8s.helper_image` <hr /> `SEMAPHORE_RUNNER_K8S_HELPER_IMAGE` <br /><br /> | Required bundle init-container image with an immutable `@sha256:` digest. |
| <br />`runner.executor.k8s.service_account` <hr /> `SEMAPHORE_RUNNER_K8S_SERVICE_ACCOUNT` <br /><br /> | Required dedicated workload service account. The namespace `default` account is rejected and token mounting is disabled. |
| <br />`runner.executor.k8s.pull_secrets` <hr /> `SEMAPHORE_RUNNER_K8S_PULL_SECRETS` <br /><br /> | Comma-separated list of imagePullSecrets attached to each Pod. |
| <br />`runner.executor.k8s.poll_interval_seconds` <hr /> `SEMAPHORE_RUNNER_K8S_POLL_INTERVAL_SECONDS` <br /><br /> | How often the executor polls Pod status, in seconds. Default: 3 |
| <br />`runner.executor.k8s.cleanup_grace_seconds` <hr /> `SEMAPHORE_RUNNER_K8S_CLEANUP_GRACE_SECONDS` <br /><br /> | Grace period when deleting Pods, in seconds. Default: 30 |
| <br />`runner.executor.k8s.active_deadline_seconds` <hr /> `SEMAPHORE_RUNNER_K8S_ACTIVE_DEADLINE_SECONDS` <br /><br /> | Maximum complete Job lifetime in seconds. Default: 3600; maximum: 86400. |
| <br />`runner.executor.docker.host` <hr /> `SEMAPHORE_RUNNER_DOCKER_HOST` <br /><br /> | Docker daemon URL (`unix://`, `tcp://` or `npipe://`). Empty = standard environment (`DOCKER_HOST`) and platform default socket. |
| <br />`runner.executor.docker.tls_verify` <hr /> `SEMAPHORE_RUNNER_DOCKER_TLS_VERIFY` <br /><br /> | Enable TLS certificate verification for `tcp://` connections. |
| <br />`runner.executor.docker.cert_path` <hr /> `SEMAPHORE_RUNNER_DOCKER_CERT_PATH` <br /><br /> | Directory holding ca.pem, cert.pem and key.pem for mutual TLS. |
| <br />`runner.executor.docker.image` <hr /> `SEMAPHORE_RUNNER_DOCKER_IMAGE` <br /><br /> | Default image for the build container. Default: semaphoreui/job:latest |
| <br />`runner.executor.docker.helper_image` <hr /> `SEMAPHORE_RUNNER_DOCKER_HELPER_IMAGE` <br /><br /> | Image used by the network-disabled transient bundle-population container. Default: semaphoreui/helper:latest |
| <br />`runner.executor.docker.network` <hr /> `SEMAPHORE_RUNNER_DOCKER_NETWORK` <br /><br /> | Compatibility input; the selected Docker execution policy controls the effective task network and defaults to `none`. |
| <br />`runner.executor.docker.pull_policy` <hr /> `SEMAPHORE_RUNNER_DOCKER_PULL_POLICY` <br /><br /> | Image pull policy: `always`, `if-not-present` (default) or `never`. |
| <br />`runner.executor.docker.cpu_limit` <hr /> `SEMAPHORE_RUNNER_DOCKER_CPU_LIMIT` <br /><br /> | When > 0, caps the build container CPU (passed as `--cpus`). |
| <br />`runner.executor.docker.memory_limit` <hr /> `SEMAPHORE_RUNNER_DOCKER_MEMORY_LIMIT` <br /><br /> | When non-empty, caps the build container memory (e.g. `2g`). |
| <br />`runner.executor.docker.poll_interval_seconds` <hr /> `SEMAPHORE_RUNNER_DOCKER_POLL_INTERVAL_SECONDS` <br /><br /> | How often container status is polled, in seconds. Default: 2 |
| <br />`runner.executor.docker.cleanup_grace_seconds` <hr /> `SEMAPHORE_RUNNER_DOCKER_CLEANUP_GRACE_SECONDS` <br /><br /> | Timeout passed to `docker stop`, in seconds. Default: 30 |
| <br />`runner.executor.docker.privileged` <hr /> `SEMAPHORE_RUNNER_DOCKER_PRIVILEGED` <br /><br /> | Compatibility field; `true` is rejected by the selected Docker executor. Keep `false` (the default). |
| **Runners (server-side fleet)** ||
| <br />`runners.offline_timeout_sec` <hr /> `SEMAPHORE_RUNNERS_OFFLINE_TIMEOUT_SEC` <br /><br /> | Heartbeat staleness boundary in seconds. A runner remains online at the exact boundary and becomes offline after it. Unacknowledged `waiting`/`starting` tasks are safely reassigned, while offline cancellation converges to `stopped`. Webhook startup uses `task_fail_timeout_sec` instead. Default: 120 |
| <br />`runners.task_fail_timeout_sec` <hr /> `SEMAPHORE_RUNNERS_TASK_FAIL_TIMEOUT_SEC` <br /><br /> | Heartbeat staleness (seconds) after which possibly executing tasks are failed rather than retried. Also bounds webhook startup and never-polled running assignments. Values below `offline_timeout_sec` are clamped to it. Default: 420 |
| <br />`runners.reconcile_interval_sec` <hr /> `SEMAPHORE_RUNNERS_RECONCILE_INTERVAL_SEC` <br /><br /> | How often (seconds) dispatched tasks are reconciled against runner liveness. Default: 30 |
| **Teams** ||
| <br />`teams.invites_enabled` <hr /> `SEMAPHORE_TEAMS_INVITES_ENABLED` <br /><br /> | Show invitation controls in the UI. Backend project permissions remain authoritative; this is not a backend authorization switch. Default: `false`. |
| <br />`teams.invite_type` <hr /> `SEMAPHORE_TEAMS_INVITE_TYPE` <br /><br /> | Type of invite: `username` (default), `email`, `both`. |
| <br />`teams.members_can_leave` <hr /> `SEMAPHORE_TEAMS_MEMBERS_CAN_LEAVE` <br /><br /> | Compatibility field with no current runtime consumer; changing it does not add a leave-team action. Default: `false`. |
| **Database** ||
| <br />`sqlite.host` <hr /> `SEMAPHORE_DB_HOST`<br /><br /> | Path to the SQLite database file.   |
| <br />`mysql.host` <hr /> `SEMAPHORE_DB_HOST`<br /><br /> | MySQL database host.                |
| <br />`mysql.name` <hr /> `SEMAPHORE_DB_NAME`<br /><br /> | MySQL database (schema) name.       |
| <br />`mysql.user` <hr />`SEMAPHORE_DB_USER`<br /><br /> | MySQL user name.                    |
| <br />`mysql.pass` <hr /> `SEMAPHORE_DB_PASS`<br /><br /> | MySQL user's password.              |
| <br />`postgres.host` <hr /> `SEMAPHORE_DB_HOST`<br /><br /> | Postgres database host.             |
| <br />`postgres.name` <hr /> `SEMAPHORE_DB_NAME`<br /><br /> | Postgres database (schema) name.    |
| <br />`postgres.user` <hr /> `SEMAPHORE_DB_USER`<br /><br /> | Postgres user name.                 |
| <br />`postgres.pass` <hr /> `SEMAPHORE_DB_PASS`<br /><br /> | Postgres user's password.           |
| <br />`dialect`       <hr /> `SEMAPHORE_DB_DIALECT`<br /><br /> | Can be `sqlite` (default), `postgres` or `mysql`.   |
| <br /> `*.options`    <hr /> `SEMAPHORE_DB_OPTIONS`<br /><br /> | JSON map which contains database connection options. |
| **Security** ||
| <br />`access_key_encryption` <hr /> `SEMAPHORE_ACCESS_KEY_ENCRYPTION`<br /><br /> | Base64-encoded key used for encrypting access keys stored in the database. Read more in [Database encryption reference](/admin-guide/security#data-encryption). |
| <br />`option_encryption` <hr /> `SEMAPHORE_OPTION_ENCRYPTION`<br /><br /> | Base64-encoded key used to encrypt DB options and Enhanced TOTP provisioning secrets. Falls back to the access key when unset. TOTP enrollment and legacy migration fail closed when neither key is active. |
| <br />`global_credential_providers` ![Static Badge](https://img.shields.io/badge/pro-red) <hr /> `SEMAPHORE_GLOBAL_CREDENTIAL_PROVIDERS` <br /><br /> | Value-free global Vault/OpenBao provider registry. Each provider's bootstrap credential is supplied only through `SEMAPHORE_GLOBAL_CREDENTIAL_PROVIDER_<NORMALIZED_ID>_CREDENTIAL`; see [Global Credential Grants](/developer-guide/global-credential-grants#global-vault-and-openbao-providers). |
| <br />`cookie_hash`           <hr /> `SEMAPHORE_COOKIE_HASH`<br /><br /> | Base64-encoded HMAC key used to sign cookies. |
| <br />`cookie_encryption`     <hr /> `SEMAPHORE_COOKIE_ENCRYPTION`<br /><br /> | Base64-encoded key used to encrypt cookies. |
| <br />`web_host`       <hr /> `SEMAPHORE_WEB_ROOT`<br /><br /> | Can be useful if you want to use Semaphore by the subpath, for example: [http://yourdomain.com/semaphore](http://yourdomain.com/semaphore). Do not add a trailing `/`. |
| <br />`tls.enabled`    <hr /> `SEMAPHORE_TLS_ENABLED`<br /><br /> | Enable or disable TLS (HTTPS) for secure communication with the Semaphore server. |
| <br />`tls.cert_file`  <hr /> `SEMAPHORE_TLS_CERT_FILE`<br /><br /> | Path to TLS certificate file. |
| <br />`tls.key_file`   <hr /> `SEMAPHORE_TLS_KEY_FILE`<br /><br /> | Path to TLS key file. |
| <br />`tls.http_redirect_addr` <hr /> `SEMAPHORE_TLS_HTTP_REDIRECT_ADDR`<br /><br /> | Address (`host[:port]`) for the HTTP→HTTPS redirect listener. Mutually exclusive with `tls.http_redirect_port`. |
| <br />`tls.http_redirect_port` <hr /> `SEMAPHORE_TLS_HTTP_REDIRECT_PORT`<br /><br /> | Port to redirect HTTP traffic to HTTPS. Mutually exclusive with `tls.http_redirect_addr`. |
| <br />`auth.max_session_life_hours` ![Static Badge](https://img.shields.io/badge/v2.20.0-red) <hr /> `SEMAPHORE_AUTH_MAX_SESSION_LIFE_HOURS` ![Static Badge](https://img.shields.io/badge/v2.20.0-red) <br /><br /> | Absolute lifetime of a login session in hours, counted from login. Once exceeded the user must log in again, even if the session was recently active. `0` (default) means no absolute limit; sessions then expire only after 7 days without activity. Maximum: `2562047` hours. |
| <br />`mfa.totp.enabled`         <hr /> `SEMAPHORE_TOTP_ENABLED` <br /><br /> | Legacy TOTP compatibility switch. Enhanced rollout and enforcement are configured through the TOTP capability lifecycle in the administrator UI. |
| <br />`mfa.totp.app_name` ![Static Badge](https://img.shields.io/badge/v2.17.0-red) <hr /> `SEMAPHORE_TOTP_ISSUER` ![Static Badge](https://img.shields.io/badge/v2.17.0-red) <br /><br /> | Issuer label (Semaphore title) shown in TOTP authenticator apps. |
| <br />`mfa.totp.allow_recovery`  <hr /> `SEMAPHORE_TOTP_ALLOW_RECOVERY` <br /><br /> | Legacy recovery compatibility switch. Enhanced enrollments always issue hashed, single-use recovery codes and do not disable TOTP when a code is used. |
| <br />`mfa.email.enabled`        <hr /> `SEMAPHORE_EMAIL_2TP_ENABLED` <br /><br /> | Compatibility-only setting. Email MFA is not implemented by the selected product; this flag does not add an email verification challenge. |
| <br />`mfa.email.allow_login_as_external_user` <hr /> `SEMAPHORE_EMAIL_2TP_ALLOW_LOGIN_AS_EXTERNAL_USER` <br /><br /> | Compatibility-only setting; email-only login is not implemented by the selected product. |
| <br />`mfa.email.allow_create_external_user` <hr /> `SEMAPHORE_EMAIL_2TP_ALLOW_CREATE_EXTERNAL_USER` <br /><br /> | Compatibility-only setting; this flag does not create accounts through email login. |
| <br />`mfa.email.allowed_domains` <hr /> `SEMAPHORE_EMAIL_2TP_ALLOWED_DOMAINS` <br /><br /> | Compatibility-only parsed list with no active email-login enforcement. It is not a working authentication domain restriction. |
| <br />`mfa.email.disable_for_oidc` <hr /> `SEMAPHORE_EMAIL_2TP_DISABLE_FOR_OIDC` <br /><br /> | Compatibility-only setting; the selected product does not implement email MFA for OIDC or other login paths. |
| **Encryption** ||
| <br />`encryption.keys_file` <hr /> `SEMAPHORE_ENCRYPTION_KEYS_FILE` <br /><br /> | Path to a separate file holding the encryption keyrings (YAML or JSON). Watched for changes — edits are applied without restarting the server. When unset, the legacy `access_key_encryption` field is used. |
| <br />`encryption.keys_poll_interval` <hr /> `SEMAPHORE_ENCRYPTION_KEYS_POLL_INTERVAL` <br /><br /> | How often `keys_file` is polled for changes (a Go duration like `15s`). `0` disables polling (a SIGHUP still forces a reload). Default: 15s |
| **Process** ||
| <br />`process.user`          <hr /> `SEMAPHORE_PROCESS_USER` <br /><br /> | User under which wrapped processes (such as Ansible, Terraform, or OpenTofu) will run. |
| <br />`process.uid`           <hr /> `SEMAPHORE_PROCESS_UID` <br /><br /> | ID of user under which wrapped processes (such as Ansible, Terraform, or OpenTofu) will run. |
| <br />`process.gid`           <hr /> `SEMAPHORE_PROCESS_GID` <br /><br /> | ID for group under which wrapped processes (such as Ansible, Terraform, or OpenTofu) will run. |
| <br />`process.chroot`        <hr /> `SEMAPHORE_PROCESS_CHROOT` <br /><br /> | Chroot directory for wrapped processes. |
| <br />`process.no_new_privs`  <hr /> `SEMAPHORE_PROCESS_NO_NEW_PRIVS` <br /><br /> | Set the `no_new_privs` flag so wrapped processes cannot gain new privileges. |
| <br />`process.app_namespaces.user`  <hr /> `SEMAPHORE_PROCESS_APP_NS_USER` <br /><br /> | Isolate UIDs/GIDs (`CLONE_NEWUSER`) for app runs. Linux only. |
| <br />`process.app_namespaces.mount` <hr /> `SEMAPHORE_PROCESS_APP_NS_MOUNT` <br /><br /> | Hide host mount points such as secret tmpfs (`CLONE_NEWNS`) for app runs. Linux only. |
| <br />`process.app_namespaces.pid`   <hr /> `SEMAPHORE_PROCESS_APP_NS_PID` <br /><br /> | Hide host processes from app runs (`CLONE_NEWPID`). Linux only. |
| <br />`process.app_namespaces.ipc`   <hr /> `SEMAPHORE_PROCESS_APP_NS_IPC` <br /><br /> | Isolate SysV IPC and POSIX message queues (`CLONE_NEWIPC`) for app runs. Linux only. |
| <br />`process.app_namespaces.uts`   <hr /> `SEMAPHORE_PROCESS_APP_NS_UTS` <br /><br /> | Isolate hostname and domain (`CLONE_NEWUTS`) for app runs. Linux only. |
| **Email** ||
| <br />`email_sender`   <hr /> `SEMAPHORE_EMAIL_SENDER`<br /><br /> | Email address of the sender. |
| <br />`email_host`     <hr /> `SEMAPHORE_EMAIL_HOST`<br /><br /> | SMTP server hostname. |
| <br />`email_port`     <hr /> `SEMAPHORE_EMAIL_PORT`<br /><br /> | SMTP server port. |
| <br />`email_secure`   <hr /> `SEMAPHORE_EMAIL_SECURE`<br /><br /> | Enable StartTLS to upgrade an unencrypted SMTP connection to a secure, encrypted one. |
| <br />`email_tls`      <hr /> `SEMAPHORE_EMAIL_TLS`<br /><br /> | Use SSL or TLS connection for communication with the SMTP server. |
| <br />`email_tls_min_version` <hr /> `SEMAPHORE_EMAIL_TLS_MIN_VERSION`<br /><br /> | Minimum TLS version to use for the connection. |
| <br />`email_username` <hr /> `SEMAPHORE_EMAIL_USERNAME`<br /><br /> | Username for SMTP server authentication. |
| <br />`email_password` <hr /> `SEMAPHORE_EMAIL_PASSWORD`<br /><br /> | Password for SMTP server authentication. |
| <br />`email_alert`    <hr /> `SEMAPHORE_EMAIL_ALERT`<br /><br /> | Flag which enables email alerts. |
| **Messengers** ||
| <br />`telegram_alert` <hr /> `SEMAPHORE_TELEGRAM_ALERT`<br /><br /> | Set to True to enable pushing alerts to Telegram. It should be used in combination with `telegram_chat` and `telegram_token`. |
| <br />`telegram_chat`  <hr /> `SEMAPHORE_TELEGRAM_CHAT`<br /><br /> | Set to the Chat ID for the chat to send alerts to.  Read more in [Telegram Notifications Setup](/admin-guide/notifications/telegram#chat-id) |
| <br />`telegram_token` <hr /> `SEMAPHORE_TELEGRAM_TOKEN`<br /><br /> | Set to the Authorization Token for the bot that will receive the alert payload.  Read more in [Telegram Notifications Setup](/admin-guide/notifications/telegram#bot-setup) |
| <br />`slack_alert`    <hr /> `SEMAPHORE_SLACK_ALERT`<br /><br /> | Set to True to enable pushing alerts to slack. It should be used in combination with `slack_url`                          |
| <br />`slack_url`      <hr /> `SEMAPHORE_SLACK_URL`<br /><br /> | The slack webhook url. Semaphore will used it to POST Slack formatted json alerts to the provided url.    |
| <br />`microsoft_teams_alert` <hr /> `SEMAPHORE_MICROSOFT_TEAMS_ALERT` <br /><br /> | Flag which enables Microsoft Teams alerts. |
| <br />`microsoft_teams_url`   <hr /> `SEMAPHORE_MICROSOFT_TEAMS_URL` <br /><br /> | Microsoft Teams webhook URL. |
| <br />`rocketchat_alert`      <hr /> `SEMAPHORE_ROCKETCHAT_ALERT` <br /><br /> | Set to True to enable pushing alerts to Rocket.Chat. It should be used in combination with `rocketchat_url`. Available since v2.9.56.  |
| <br />`rocketchat_url`        <hr /> `SEMAPHORE_ROCKETCHAT_URL` <br /><br /> | The rocketchat webhook url. Semaphore will used it to POST Rocket.Chat formatted json alerts to the provided url. Available since v2.9.56. |
| <br />`dingtalk_alert`        <hr /> `SEMAPHORE_DINGTALK_ALERT` <br /><br /> | Enable Dingtalk alerts. |
| <br />`dingtalk_url`          <hr /> `SEMAPHORE_DINGTALK_URL` <br /><br /> | Dingtalk messenger webhook URL. |
| <br />`gotify_alert`          <hr /> `SEMAPHORE_GOTIFY_ALERT` <br /><br /> | Enable Gotify alerts. |
| <br />`gotify_url`            <hr /> `SEMAPHORE_GOTIFY_URL` <br /><br /> | Gotify server URL. |
| <br />`gotify_token`          <hr /> `SEMAPHORE_GOTIFY_TOKEN` <br /><br /> | Gotify server token. |
| **LDAP** ||
| <br />`ldap_enable`           <hr /> `SEMAPHORE_LDAP_ENABLE` <br /><br /> | Legacy LDAP compatibility switch. Configure and activate database-managed providers in the [LDAP administrator panel](/admin-guide/authentication/ldap). This flag alone does not enable managed LDAP. |
| <br />`ldap_needtls`          <hr /> `SEMAPHORE_LDAP_NEEDTLS` <br /><br /> | TLS flag for legacy LDAP configuration; managed provider trust and TLS settings are configured separately through the LDAP administrator panel. |
| <br />`ldap_binddn`           <hr /> `SEMAPHORE_LDAP_BIND_DN` <br /><br /> | The distinguished name (DN) used to bind to the LDAP server for authentication. |
| <br />`ldap_bindpassword`     <hr /> `SEMAPHORE_LDAP_BIND_PASSWORD` <br /><br /> | The password used to bind to the LDAP server for authentication. |
| <br />`ldap_server`           <hr /> `SEMAPHORE_LDAP_SERVER` <br /><br /> | The hostname and port of the LDAP server (e.g., ldap-server.com:1389). |
| <br />`ldap_searchdn`         <hr /> `SEMAPHORE_LDAP_SEARCH_DN` <br /><br /> | The base distinguished name (DN) used for searching users in the LDAP directory (e.g., dc=example,dc=org). |
| <br />`ldap_searchfilter`     <hr /> `SEMAPHORE_LDAP_SEARCH_FILTER` <br /><br /> | The filter used to search for users in the LDAP directory (e.g., (&(objectClass=inetOrgPerson)(uid=%s))). |
| <br />`ldap_mappings.dn`      <hr /> `SEMAPHORE_LDAP_MAPPING_DN` <br /><br /> | LDAP attribute to use as the distinguished name (DN) mapping for user authentication. |
| <br />`ldap_mappings.mail`    <hr /> `SEMAPHORE_LDAP_MAPPING_MAIL` <br /><br /> | LDAP attribute to use as the email address mapping for user authentication. |
| <br />`ldap_mappings.uid`     <hr /> `SEMAPHORE_LDAP_MAPPING_UID` <br /><br /> | LDAP attribute to use as the user ID (UID) mapping for user authentication. |
| <br />`ldap_mappings.cn`      <hr /> `SEMAPHORE_LDAP_MAPPING_CN` <br /><br /> | LDAP attribute to use as the common name (CN) mapping for user authentication. |
| **Logging** ||
| <br />`log.queue_size` ![Static Badge](https://img.shields.io/badge/pro-red) <hr /> `SEMAPHORE_LOG_QUEUE_SIZE` <br /><br /> | Bounded asynchronous writer queue. A full queue drops new records without blocking tasks. Default: `1024`. |
| <br />`log.flush_interval` ![Static Badge](https://img.shields.io/badge/pro-red) <hr /> `SEMAPHORE_LOG_FLUSH_INTERVAL` <br /><br /> | Durable flush interval as a Go duration. Default: `1s`. |
| <br />`log.rotation_interval` ![Static Badge](https://img.shields.io/badge/pro-red) <hr /> `SEMAPHORE_LOG_ROTATION_INTERVAL` <br /><br /> | Time-based rotation interval as a Go duration. Default: `24h`. |
| <br />`log.debug_filter` ![Static Badge](https://img.shields.io/badge/pro-red) <hr /> `SEMAPHORE_DEBUG_FILTER` <br /><br /> | Exact and terminal-prefix component filters for debug output. Empty captures all components. See [Debug Log Filtering](/developer-guide/debug-log-filtering). |
| <br />`log.events.format`      ![Static Badge](https://img.shields.io/badge/pro-red) <hr /> `SEMAPHORE_EVENT_LOG_FORMAT` <br /><br /> | Structured event file export supports only `json`; an empty format is unsupported. |
| <br />`log.events.enabled`     ![Static Badge](https://img.shields.io/badge/pro-red) <hr /> `SEMAPHORE_EVENT_LOG_ENABLED` <br /><br /> | Enable structured event file logging; requires `format=json` and `logger.filename`. Default: `false`. |
| <br />`log.events.logger`      ![Static Badge](https://img.shields.io/badge/pro-red) <hr /> `SEMAPHORE_EVENT_LOGGER` <br /><br /> | Event destination and rotation options. An absolute, normalized `filename` is required when event export is enabled. |
| <br />`log.tasks.format`       ![Static Badge](https://img.shields.io/badge/pro-red) <hr /> `SEMAPHORE_TASK_LOG_FORMAT` <br /><br /> | Structured task and result file export supports only `json`; an empty format is unsupported. |
| <br />`log.tasks.enabled`      ![Static Badge](https://img.shields.io/badge/pro-red) <hr /> `SEMAPHORE_TASK_LOG_ENABLED` <br /><br /> | Enable structured task/result file logging; requires `format=json` and a filename in `logger`, `result_logger`, or both. Default: `false`. |
| <br />`log.tasks.logger`       ![Static Badge](https://img.shields.io/badge/pro-red) <hr /> `SEMAPHORE_TASK_LOGGER` <br /><br /> | Task lifecycle destination and rotation options. Each configured destination requires an absolute, normalized `filename`. |
| <br />`log.tasks.result_logger`  ![Static Badge](https://img.shields.io/badge/pro-red) <hr /> `SEMAPHORE_TASK_RESULT_LOGGER` <br /><br /> | Normalized task-result destination and rotation options; requires an absolute, normalized `filename` when configured. |
| <br />`log.debug.enabled` ![Static Badge](https://img.shields.io/badge/pro-red) <hr /> `SEMAPHORE_DEBUG_LOG_ENABLED` <br /><br /> | Enable structured debug file logging; requires `format=json` and `logger.filename`, with components selected by `log.debug_filter`. Default: `false`. |
| <br />`log.debug.format` ![Static Badge](https://img.shields.io/badge/pro-red) <hr /> `SEMAPHORE_DEBUG_LOG_FORMAT` <br /><br /> | Structured debug file export supports only `json`; an empty format is unsupported. |
| <br />`log.debug.logger` ![Static Badge](https://img.shields.io/badge/pro-red) <hr /> `SEMAPHORE_DEBUG_LOGGER` <br /><br /> | Debug destination and rotation options. An absolute, normalized `filename` is required when debug export is enabled. |
| <br />`syslog.enabled` ![Static Badge](https://img.shields.io/badge/pro-red) <hr /> `SEMAPHORE_SYSLOG_ENABLED` <br /><br /> | Enable or disable writing logs to the configured syslog server. |
| <br />`syslog.network` ![Static Badge](https://img.shields.io/badge/pro-red) <hr /> `SEMAPHORE_SYSLOG_NETWORK` <br /><br /> | Protocol used to connect to the Syslog server: `udp` or `tcp`. |
| <br />`syslog.address` ![Static Badge](https://img.shields.io/badge/pro-red) <hr /> `SEMAPHORE_SYSLOG_ADDRESS` <br /><br /> | Hostname and port of the Syslog server. Example: `localhost:514`. |
| <br />`syslog.tag` ![Static Badge](https://img.shields.io/badge/pro-red) <hr /> `SEMAPHORE_SYSLOG_TAG` <br /><br /> | The tag used to mark Semaphore UI records on the Syslog server. |
| <br />`syslog.format` ![Static Badge](https://img.shields.io/badge/pro-red) <hr /> `SEMAPHORE_SYSLOG_FORMAT` <br /><br /> | Format of the Syslog messages. Can be `rfc5424` or empty for default. |
| **Debugging** ||
| <br />`debugging.api_delay` <hr /> `SEMAPHORE_API_DELAY` <br /><br /> | Add delay to API responses (for debugging purposes). |
| <br />`debugging.pprof_dump_dir` <hr /> `SEMAPHORE_PPROF_DUMP_DIR` <br /><br /> | Directory for pprof dump files. |
| **High Availability (HA)** ||
| <br />`ha.enabled` ![Static Badge](https://img.shields.io/badge/enterprise-yellow) <hr /> `SEMAPHORE_HA_ENABLED` <br /><br /> | Enable High Availability (HA) mode. |
| <br />`ha.node_id` ![Static Badge](https://img.shields.io/badge/enterprise-yellow)<hr /> `SEMAPHORE_HA_NODE_ID` <br /><br /> | Unique identifier for the HA node. |
| <br />`ha.redis.addr` ![Static Badge](https://img.shields.io/badge/enterprise-yellow) <hr /> `SEMAPHORE_HA_REDIS_ADDR` <br /><br /> | Address of the Redis server used for HA. Example: `localhost:6379`. |
| <br />`ha.redis.db` ![Static Badge](https://img.shields.io/badge/enterprise-yellow)<hr /> `SEMAPHORE_HA_REDIS_DB` <br /><br /> | Redis database number. |
| <br />`ha.redis.pass` ![Static Badge](https://img.shields.io/badge/enterprise-yellow)<hr /> `SEMAPHORE_HA_REDIS_PASS` <br /><br /> | Password for the Redis server. |
| <br />`ha.redis.user` ![Static Badge](https://img.shields.io/badge/enterprise-yellow)<hr /> `SEMAPHORE_HA_REDIS_USER` <br /><br /> | Username for the Redis server. |
| <br />`ha.redis.tls` ![Static Badge](https://img.shields.io/badge/enterprise-yellow)<hr /> `SEMAPHORE_HA_REDIS_TLS` <br /><br /> | Enable TLS for the Redis connection. |

The [Configuration options reference](/reference/configuration) lists option names,
environment variables, types, and defaults. It is generated from the Semaphore
source; use documentation for your release when configuring an older server.

<span id="frequently-asked-questions" />

## Public URL {#1-how-to-configure-a-public-url-for-semaphore-ui}

Set `web_host` (or `SEMAPHORE_WEB_ROOT`) to the address users open in their browser.
For example, if a reverse proxy serves Semaphore at
`https://example.com/semaphore`, use that full address, including `/semaphore`.
This is the public address, not the internal address the proxy connects to.

## Where to start {#where-to-start}

For a new server, open the online configurator guide above and follow the binary
or Docker steps. For an existing server, update the file or environment variables
used by its service, then restart Semaphore to apply the changes.
