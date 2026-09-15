---
title: Devolutions Server secret storage
description: Devolutions Server is not implemented in Semaphore EX.
---

# Devolutions Server secret storage

Devolutions Server is not implemented in Semaphore EX. The product does not expose
a connection form, runtime resolver, or secret-sync provider for it.

Use [HashiCorp Vault](/user-guide/key-store/hashicorp-vault) or
[OpenBao](/user-guide/key-store/openbao) when a project needs an external secret
store. Their configuration and runtime resolution remain subject to the project's
authorization and server-side provider configuration.
