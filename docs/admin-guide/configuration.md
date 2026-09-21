# Configuration

All configuration documentation is available as checked-in Markdown.
Start with the loading guide and use the reference for exact parameter names.

| Guide | Contents |
|---|---|
| [Configuration file](configuration/config-file.md) | YAML and JSON, lookup order, server/runner examples, secrets, restart behavior |
| [Environment variables](configuration/env-vars.md) | Scalar, array and object values; override precedence |
| [Complete parameter reference](../reference/configuration.md) | Every startup parameter, environment binding, type, default and meaning |
| [Additional schemas](../reference/configuration-schemas.md) | Logger fields, encryption keys file, native and Docker bootstrap variables |
| [CLI reference](../reference/cli/commands.md) | Command-line flags and defaults |

<a id="configuration-options"></a>

## Configuration options

Use the [complete parameter reference](../reference/configuration.md).
It replaces the former partial table so there is one authoritative list of names and bindings.

<a id="feature-controls"></a>

## Feature controls

The [generated reference](../reference/configuration.md) lists startup configuration and boolean defaults, including flags inside named app and provider objects.
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
| `lifecycle_test` | `disabled` without a saved row | Administrator-only contract fixture, configured through `/api/capabilities/lifecycle-test`; not a product switch. See [Capability lifecycle](../developer-guide/capability-lifecycle.md). |
| `runtime_secrets` | `active` without a saved row | Persisted administrator configuration through `/api/capabilities/runtime-secrets`. `active` grants read/write/execute; `read_only` grants read/execute; `disabled` and expired retain read only. See [Runtime secrets](../developer-guide/runtime-secrets.md). |
| `totp` | `disabled` without a saved row | Administrator TOTP lifecycle: `disabled`, `shadow`, `optional`, `required_selected`, or `required`. Legacy TOTP booleans do not select this rollout. See [TOTP lifecycle](../developer-guide/totp-capability-lifecycle.md). |
| `project_runners` | `active` | Runner registration, enabled state, project scope, and permissions. See [Runners](runners.md). |
| `ldap` | `active` capability; new providers are `disabled` | Each database-managed provider has `disabled`, `shadow`, `selected_users`, and `active` states. Legacy LDAP environment variables do not enable these providers. See [LDAP](authentication/ldap.md). |
| `workflow_triggers` | `active` | Trigger configuration, lifecycle, and project permissions. |
| `project_roles` | `active` | Administrator/project role and membership rules. |
| `execution_preflight` | `active` | Execution authorization and the reviewed plan. |
| `deployment_windows` | `active` | Configured project deployment windows and policy. |
| `policy_guardrails` | `active` | Configured rules and admission policy. |

Capability access never replaces authenticated routes, role permissions, or resource ownership checks.
State names are feature-specific: the `lifecycle_test` read-only example denies execution, whereas runtime-secret read-only mode intentionally permits existing resolution.
Audit-webhook export is another persisted control: configure its endpoint and signing key in the administrator UI, then pause or resume delivery there. See [Audit webhook](logs.md#audit-webhook).

<a id="frequently-asked-questions"></a>
<a id="1-how-to-configure-a-public-url-for-semaphore-ui"></a>

## Public URL

Set `web_host` or `SEMAPHORE_WEB_ROOT` to the URL users open, including any path prefix.
For example, use `https://semaphore.example.org/semaphore` when that is the reverse-proxy URL.
The internal listener is configured separately using `interface` and `port`.

<a id="where-to-start"></a>

## Where to start

Create the [server configuration](configuration/config-file.md#server-example), supply secrets through the service environment and start Semaphore.
Restart it after changing startup settings.
