# Product capabilities

Semaphore EX ships one full-featured product.
Implemented features are included without a license key, subscription, quota, or upgrade.
Configuration, project permissions, safety policies, and operational state still control access and execution.

<a id="feature-matrix"></a>

## Feature matrix

| Feature | Availability |
|---|---|
| [AWS Secrets Manager storage](user-guide/key-store/aws-secrets-manager.md) | Not implemented |
| [Devolutions Server storage](user-guide/key-store/devolutions-server.md) | Not implemented |
| [Docker executor](user-guide/task-templates/README.md#executor-image-docker-and-kubernetes-runners) | Included |
| [Environment and file secret sources](user-guide/key-store/env-and-file-sources.md) | Included |
| [Extended RBAC and custom roles](user-guide/team.md#extended-rbac-enterprise) | Included |
| [External secret storages](user-guide/key-store.md#secret-storages) | Included |
| [HashiCorp Vault storage](user-guide/key-store/hashicorp-vault.md) | Included |
| [High availability](admin-guide/ha.md) | Included |
| [Kubernetes executor](user-guide/task-templates/README.md#executor-image-docker-and-kubernetes-runners) | Included |
| [OpenBao storage](user-guide/key-store/openbao.md) | Included |
| [Project runners](user-guide/projects/runners.md) | Included |
| [Runner tags](admin-guide/runners.md) | Included |
| [Secret sync from external storages](user-guide/key-store/secret-sync.md) | Included |
| [Structured and syslog logging](admin-guide/logs.md) | Included |
| [Task summary](user-guide/tasks.md#task-window) | Included |
| [Terraform HTTP state backend](user-guide/apps/terraform/states.md) | Included |
| [Workflows](user-guide/workflows.md) | Included |

Vault and OpenBao are the supported managed secret-storage providers.
The [Terraform HTTP state backend](user-guide/apps/terraform/states.md) supports encrypted versions and durable locks.
AWS Secrets Manager and Devolutions Server are not implemented in this product.

<a id="how-editions-are-marked"></a>

## Feature availability

An included feature may require an administrator to enable and configure it.
See the individual feature guide for its permissions and setup requirements.
