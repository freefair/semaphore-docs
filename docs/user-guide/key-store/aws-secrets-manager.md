---
title: AWS Secrets Manager secret storage
description: AWS Secrets Manager is not implemented in Semaphore EX.
---

# AWS Secrets Manager secret storage

AWS Secrets Manager is not implemented in Semaphore EX. The product does not expose
an AWS credential form, runtime resolver, or secret-sync provider for it.

Use [HashiCorp Vault](/user-guide/key-store/hashicorp-vault) or
[OpenBao](/user-guide/key-store/openbao) when a project needs an external secret
store. Their configuration and runtime resolution remain subject to the project's
authorization and server-side provider configuration.
