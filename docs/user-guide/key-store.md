# Key Store

The Key Store in Semaphore is used to store credentials for accessing remote Repositories, accessing remote hosts, sudo credentials, and Ansible vault passwords.

## Types {#types}

### 1. SSH {#1-ssh}
SSH Keys are used to access remote servers as well as remote Repositories.

For a locally stored SSH credential, Semaphore can generate the key pair on the
server. Select **Generate on server** while creating an SSH key, keep the default
**Ed25519** algorithm unless a target explicitly requires **RSA 3072**, and copy
the displayed OpenSSH public key to the target host or Git provider. Semaphore
stores the private key inside the encrypted Access Key record and never returns
it through the API or UI.

Server-side generation requires Access Key encryption to be configured. It is
not available for environment, file, external-storage, or synchronized keys.
Imported private keys continue to use the existing create and edit flow.

An authorized project member can rotate a local SSH key from the Key Store. The
confirmation shows which project resources reference the key. Rotation replaces
the private key immediately, clears affected Repository caches, and returns the
new public key and SHA-256 fingerprint. Install the new public key on every
referenced target before starting another task.

If you need assistance quickly generating a key and placing it on your host, [here is a quick guide.](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-20-04)

For Git Repositories that use SSH authentication, the Git Repository you are trying to clone from needs to have your public key associated to the private key.

Below are links to the docs for some common Git Repositories:
* [GitHub](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
* [GitLab](https://docs.gitlab.com/ee/user/ssh.html)
* [Bitbucket](https://support.atlassian.com/bitbucket-cloud/docs/set-up-an-ssh-key/)

### 2. Login With Password {#2-login-with-password}
Login With Password is a username and password/access token combination that can be used to do the following:
* Authenticate to remote hosts (although this is less secure than using SSH keys)
* Sudo credentials on remote hosts
* Authenticate to remote Git Repositories over HTTPS (although SSH is more secure)
* Unlock Ansible vaults

:::tip
    This type of secret can be used as Personal Access Token (PAT) or secret string. Simply leave the Login field empty.
:::

### 3. None {#3-none}
This is used as a filler for Repos that do not require authentication, like an Open-Source Repository on GitLab.


## Secret Storages {#secret-storages}

Semaphore UI supports different storages for secrets. You can choose the storage per-secret when creating or editing a secret.

### Database {#database}

Secrets are stored in the database in encrypted form by default. The encryption key is configured via the configuration option
`access_key_encryption` or `SEMAPHORE_ACCESS_KEY_ENCRYPTION` (must be generated using `head -c32 /dev/urandom | base64`).

### HashiCorp Vault {#hashicorp-vault}

Secrets can be stored in an external HashiCorp Vault instance instead of the database.

[Read more...](/user-guide/key-store/hashicorp-vault)

### OpenBao {#openbao}

Secrets can be stored in an external [OpenBao](https://openbao.org) instance (an open-source, API-compatible fork of HashiCorp Vault).

[Read more...](/user-guide/key-store/openbao)

### AWS Secrets Manager {#aws-secrets-manager}

![Static Badge](https://img.shields.io/badge/enterprise-yellow)

Secrets can be stored in AWS Secrets Manager. Authenticate with an IAM role/instance profile or static access keys.

[Read more...](/user-guide/key-store/aws-secrets-manager)

### Devolutions Server {#devolutions-server}

Secrets can be stored in an external Devolutions Server instance instead of the database.

[Read more...](/user-guide/key-store/devolutions-server)

## Syncing secrets from remote storages {#syncing-secrets-from-remote-storages}

Semaphore can automatically import secrets from an external secret manager (HashiCorp Vault, OpenBao, AWS Secrets Manager, Azure Key Vault, or Devolutions Server) and keep them in sync. Sync paths let you choose which secrets to import and how to name them.

[Read more...](/user-guide/key-store/secret-sync)

## Granted global credentials

Enhanced Edition can grant a project permission to select a credential that is administered globally.
Open the **Granted** tab in the project's Key Store to see the value-free references available to your project role.

The list shows only the display name, type, current version, effective operations, and optional expiry.
It never shows the credential value, owner, fingerprint, or external provider path.

Select a row when a workflow or resource asks for a granted credential reference.
Selection identifies the credential by its stable ID; it does not retrieve or copy the value into the project.

If the tab reports that your role cannot list granted metadata, ask a project administrator for a role containing **List granted credential metadata**.
The separate **Consume granted credentials** permission controls runtime use and does not imply list access.

A revoked, expired, or disabled grant disappears from the list immediately.
Rotation keeps the same credential ID, so projects do not need a copied replacement value.
