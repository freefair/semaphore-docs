# 快速入门

本页带您从全新安装走到第一个成功运行的任务。每个步骤都链接到包含详细信息的页面。

<a id="from-zero-to-first-task"></a>

## 从零到第一个任务

1. 使用您偏好的方式**安装 Semaphore**：[安装](../../docs/admin-guide/installation.md)。
2. **登录**：使用您在安装向导中创建的管理员用户，或在 Docker 中通过 `SEMAPHORE_ADMIN_*` 变量创建的用户。
3. **创建项目（Project）。** 项目将团队、基础设施或应用彼此隔离：[项目](../../docs/user-guide/projects.md)。
4. **连接自动化所需的资源：**
   - 包含 playbook、模块或脚本的源代码：[仓库（Repository）](../../docs/user-guide/repositories.md)。
   - SSH 密钥、令牌和密码：[密钥库（Key Store）](../../docs/user-guide/key-store.md)。
   - 目标主机和连接设置：[清单（Inventory）](../../docs/user-guide/inventory.md)。
   - 可复用的变量：[变量组（Variable Groups）](../../docs/user-guide/environment.md)。
5. **创建任务模板并运行。** 选择与您的工具对应的指南：[Ansible](../../docs/user-guide/apps/ansible.md)、[Terraform/OpenTofu](../../docs/user-guide/apps/terraform/README.md)、[Shell](../../docs/user-guide/apps/bash.md)、[PowerShell](../../docs/user-guide/apps/powershell.md) 或 [Python](../../docs/user-guide/apps/python.md)。然后运行并观察结果：[任务（Task）](../../docs/user-guide/tasks.md)。
6. **自动化并投入运营：**
   - 按计划运行：[计划任务（Schedule）](../../docs/user-guide/schedules.md)。
   - 控制谁能做什么：[团队（Team）与自定义角色](../../docs/user-guide/team.md)。
   - 获取结果告警：[通知](../../docs/admin-guide/notifications.md)。

<a id="key-concepts"></a>

## 核心概念

这些术语在 UI 中随处可见。

| 术语 | 含义 |
|------|---------|
| **项目（Project）** | 最基本的隔离单元。每个项目都有自己的仓库、密钥、清单、模板和团队。[项目](../../docs/user-guide/projects.md) |
| **仓库（Repository）** | 存放 playbook、模块或脚本的 Git 仓库或本地路径。[仓库](../../docs/user-guide/repositories.md) |
| **清单（Inventory）** | 用于 Ansible 风格运行的主机、分组和连接设置。[清单](../../docs/user-guide/inventory.md) |
| **变量组（Variable Group）** | 可复用的变量和环境配置，也称为环境（Environment）。[变量组](../../docs/user-guide/environment.md) |
| **密钥库（Key Store）** | 加密存储的凭据，如 SSH 密钥、令牌和密码。[密钥库](../../docs/user-guide/key-store.md) |
| **任务模板（Task Template）** | 一次运行的定义：应用、仓库、清单、变量和选项。[任务模板](../../docs/user-guide/task-templates/README.md) |
| **任务（Task）** | 模板的一次执行，包含其日志和状态。[任务](../../docs/user-guide/tasks.md) |
| **工作流（Workflow）** | 由模板组成的图，支持分支、审批和延迟。Pro 功能。[工作流](../../docs/user-guide/workflows.md) |
| **运行器（Runner）** | 任务的执行位置：服务器本身或远程运行器。[运行器](../../docs/admin-guide/runners.md) |

<a id="next-steps"></a>

## 后续步骤

- 通过[反向代理](../../docs/admin-guide/reverse-proxy/README.md)为 Semaphore 启用 TLS。
- 连接您的身份提供商：[LDAP](../../docs/admin-guide/authentication/ldap.md) 或 [OpenID Connect](../../docs/admin-guide/authentication/openid.md)。
- 通过 [API](../../docs/reference/api.md) 和 [CLI](../../docs/reference/cli/README.md) 从 CI 或脚本驱动 Semaphore。
