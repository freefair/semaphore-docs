# Environment variables

Only variables listed in the [parameter reference](../../reference/configuration.md) have automatic configuration bindings.
The [additional schemas](../../reference/configuration-schemas.md) document native special variables and Docker wrapper inputs separately.
There is no automatic environment variable for an arbitrary dotted configuration key.

## Value formats and precedence

- Strings are passed literally. An explicitly present empty string overrides the file before defaults are applied.
- Integers are decimal values; malformed values fail parsing.
- Boolean environment values are true for `1`, `true` or `yes` (case-insensitive words); all other strings become false. Prefer `true` and `false`.
- Arrays and objects must be JSON, not YAML or comma-separated lists unless the parameter explicitly says otherwise.
- A whole object, such as `SEMAPHORE_RUNNER_EXECUTOR`, replaces that file object; individual tagged child variables are applied afterward.
- Defaults can replace scalar zero values after environment loading; see [loading order](config-file.md#loading-order).

```bash
SEMAPHORE_PORT=3000 SEMAPHORE_MAX_PARALLEL_TASKS=4 \
  semaphore server --config ./config.yaml
```

Put secrets into the environment through your service manager or secret store.
The binary removes variables marked sensitive from its own environment after reading them.
This does not imply arbitrary keys inside a JSON map are automatically removed or safe to forward.

<a id="application-environment-for-apps-ansible-terraform-etc"></a>

## Application environment for apps (Ansible, Terraform, etc.)

Semaphore can pass environment variables to application processes (Ansible, Terraform/OpenTofu, Python, PowerShell, etc.). There are two related options:

- `env_vars` / `SEMAPHORE_ENV_VARS`: static key-value pairs that will be set for app processes.
- `forwarded_env_vars` / `SEMAPHORE_FORWARDED_ENV_VARS`: a list of variable names the server will forward from its own process environment.

Example configuration file:

```json
{
  "env_vars": {
    "HTTP_PROXY": "http://proxy.internal:3128",
    "ANSIBLE_STDOUT_CALLBACK": "yaml"
  },
  "forwarded_env_vars": [
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "GOOGLE_APPLICATION_CREDENTIALS"
  ]
}
```

Equivalent with environment variables:

```bash
export SEMAPHORE_ENV_VARS='{"HTTP_PROXY":"http://proxy.internal:3128","ANSIBLE_STDOUT_CALLBACK":"yaml"}'
export SEMAPHORE_FORWARDED_ENV_VARS='["AWS_ACCESS_KEY_ID","AWS_SECRET_ACCESS_KEY","GOOGLE_APPLICATION_CREDENTIALS"]'
```

Notes:
- Forwarding is explicit: only variables listed in `forwarded_env_vars` are inherited by app processes.
- Secrets should be provided securely (for example via Docker/Kubernetes secrets) and then forwarded using `forwarded_env_vars`.

---

<a id="runner-executor-configuration"></a>

## Runner executor configuration

For runner deployments, the entire executor block can be set as a single JSON environment variable instead of individual keys:

```bash
export SEMAPHORE_RUNNER_EXECUTOR='{"type":"docker","docker":{"image":"semaphoreui/job:latest"}}'
```

This is equivalent to setting `runner.executor.type` and nested `runner.executor.docker.*` fields in the configuration file. See [Configuration options](../configuration.md) for all runner executor settings.

---

<a id="secret-environment-variables-in-variable-groups"></a>

## Secret environment variables in Variable Groups

In addition to global environment variables, you can define per-project secrets in Variable Groups. Secret keys are masked in the UI and logs. See `User Guide → Variable Groups` for usage and Terraform integration with `TF_VAR_*` variables.
