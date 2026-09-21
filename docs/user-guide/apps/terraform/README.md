# Terraform/OpenTofu

Using Semaphore UI you can run Terraform code. To do this, you need to create a **Terraform Code Template**.

1. Go to **Task Templates** section and click the **New Template** button.
2. Select **Terraform** as the app type.
3. Set up the template and click the **Create** button.
4. Click **Run** to execute the template.

<a id="passing-variables"></a>

## Passing variables

Variables from the selected **Variable Groups** are injected as environment variables. Prefix names with `TF_VAR_` so Terraform picks them up as input variables:

| Variable Group key | Terraform variable |
|---|---|
| `TF_VAR_region` | `var.region` |
| `TF_VAR_instance_type` | `var.instance_type` |

For sensitive values, use the **Secrets** tab in Variable Groups — they are encrypted at rest.

<a id="workspaces"></a>

## Workspaces

Semaphore supports Terraform/OpenTofu workspaces natively. See [Workspaces](workspaces.md) for creating and switching workspaces and using SSH keys for private modules.

<a id="backend-override-and-http-backend-pro"></a>

## State backends

Use the [Semaphore EX HTTP state backend](states.md) with encrypted version history and durable locks,
or configure another supported backend in your Terraform or OpenTofu code.

<a id="destroy-flag-and-state-migration"></a>

## Destroy flag and state migration

The task run dialog includes toggles for `-destroy` and `-migrate-state`. Use them when tearing down infrastructure or migrating Terraform state.

<a id="notes"></a>

## Notes

- Semaphore runs `terraform init` automatically before each run.
- State is managed by whatever backend is configured in your Terraform code (local, S3, GCS, etc.).
