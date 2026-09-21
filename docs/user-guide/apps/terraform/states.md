# Terraform HTTP state backend

Semaphore EX can store Terraform, OpenTofu and Terragrunt workspace state in its database.
Each write creates an encrypted version. Locks are shared across server instances.
Aliases provide independently revocable addresses for the same workspace state.

## Quick Start

Prerequisites: a Semaphore EX server with access-key encryption enabled, a workspace inventory,
and a project **Login with password** key. The key supplies the HTTP Basic-auth credentials.
Configure the server's public URL so copied alias addresses point to your reachable HTTPS endpoint.

1. Open the workspace state settings and create an alias bound to that project key.
2. Copy the alias URL. Supply it through `TF_HTTP_ADDRESS`, `TF_HTTP_LOCK_ADDRESS`, and `TF_HTTP_UNLOCK_ADDRESS`.
3. Supply the key's login and password through `TF_HTTP_USERNAME` and `TF_HTTP_PASSWORD` using your secret manager.
4. Add the backend declaration to the Terraform root:

```hcl
terraform {
  backend "http" {}
}
```

Run `terraform init`, then `terraform plan`. Terraform uses `LOCK` and `UNLOCK` by default.
After applying an approved plan, verify that another plan has no changes and that the workspace state list contains the new version.
Avoid placing credentials in backend configuration: Terraform may retain them in local metadata or saved plans.

The Terraform provider can manage aliases with `semaphore_ex_project_terraform_backend_alias`.
Its computed `url` is the backend address; `auth_key_id` selects the existing project login/password key.
Use a separate bootstrap configuration to create the alias before initializing a root that stores state there.

## Backend override in Semaphore tasks

When a template enables the built-in backend override, Semaphore resolves a persisted alias for the task's resolved workspace inventory.
Create at least one alias before enabling that override. Multiple aliases are accepted when they all bind the same project login/password key;
the lexically first alias is used. Conflicting key bindings stop the task with a configuration error instead of choosing credentials arbitrarily.
The task's temporary lifecycle alias is unrelated to these backend aliases.
Without backend override, Terraform, OpenTofu and Terragrunt retain their externally configured backend and do not resolve backend credentials.

## Existing state and encryption keys

Before using legacy plaintext state, configure the active access encryption key, run `semaphore vault rekey`,
and run `semaphore vault check`. The backend refuses unmigrated plaintext and unavailable encryption keys.
Keep previous encryption keys until rekey and check confirm that all retained state versions are readable with the current keyring.

## Permissions, locks and deletion

Backend requests require the alias's configured Basic-auth credential. Project resource managers can list state metadata
and retrieve decrypted versions through the authenticated management API.
Treat state downloads as secrets even when individual Terraform attributes are marked sensitive.

While a backend lock is active, state writes and deletes require its exact lock ID; unlock requires the same ID.
Management deletion refuses an active lock and only removes the current version if it has not changed concurrently.
Deleting current state hides it from the backend while retaining encrypted history. Deleting an alias revokes that address
without removing the workspace's history or other aliases. Destroying infrastructure through Terraform remains a separate operation.
