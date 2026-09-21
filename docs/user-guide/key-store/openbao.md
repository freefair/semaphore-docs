# OpenBao secret storage

Semaphore UI supports [OpenBao](https://openbao.org) as a storage for secrets.

OpenBao is an open-source fork of HashiCorp Vault and is API-compatible with it, so the storage works exactly like the [HashiCorp Vault storage](hashicorp-vault.md).

You can provide the following options:
- **Server URL** — address of your OpenBao server.
- **Mount** — the KV v2 secrets engine mount path (`secret` by default).
- **Namespace** — OpenBao namespace (v2.3+), optional.
- **Token** — authentication token. The token can be:
    - Stored in the database.
    - Provided via an environment variable.
    - Provided via a file.
> **Warning**
>
> When the token comes from a **file**, that file must be **inside** the secrets directory Semaphore uses. Configure that directory using `dirs.secrets` or the `SEMAPHORE_SECRETS_PATH` environment variable. The legacy top-level `secrets_path` option is still accepted for older configs. If none are set, the default is `/tmp/semaphore`. See [Secrets directory](../../admin-guide/configuration/config-file.md#secrets-directory) for precedence details.

The storage can work in read-only mode.

<a id="how-to-use"></a>

## How to use

1. In your project, open **Key Store** → **Storages** and create a new **OpenBao** storage (URL, mount path, and token).
2. When creating or editing a key in the Key Store, select your OpenBao storage as the storage type.
3. Provide the secret path in OpenBao where the credential should be stored.

<a id="syncing-secrets"></a>

## Syncing secrets

Secrets stored in OpenBao can be automatically imported into the Key Store and kept in sync, the same way as with other external storages. See [Syncing secrets from remote storages](secret-sync.md).

<a id="variable-groups"></a>

## Variable Groups

OpenBao can also be used as a storage for [Variable Groups](../environment.md). When editing a variable group, select your OpenBao storage as the storage type and specify the path of the folder where secrets will be stored.
