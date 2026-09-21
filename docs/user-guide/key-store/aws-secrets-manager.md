# AWS Secrets Manager secret storage

AWS Secrets Manager is not implemented in Semaphore EX. The product does not expose
an AWS credential form, runtime resolver, or secret-sync provider for it.

Use [HashiCorp Vault](hashicorp-vault.md) or
[OpenBao](openbao.md) when a project needs an external secret
store. Their configuration and runtime resolution remain subject to the project's
authorization and server-side provider configuration.
