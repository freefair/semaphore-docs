# 应用

应用（App）是任务模板（Task Template）所运行的工具。Semaphore 内置七个应用；管理员可以启用或禁用它们，也可以注册自己的应用。

| 应用 | ID | 模板运行的内容 | 指南 |
|---|---|---|---|
| Ansible Playbook | `ansible` | 使用所选清单运行 `ansible-playbook` | [Ansible](ansible.md) |
| Terraform Code | `terraform` | 在所选子目录和工作区中运行 `terraform` | [Terraform/OpenTofu](../../../../docs/user-guide/apps/terraform/README.md) |
| OpenTofu Code | `tofu` | `tofu`，选项与 Terraform 相同 | [Terraform/OpenTofu](../../../../docs/user-guide/apps/terraform/README.md) |
| Terragrunt Code | `terragrunt` | 封装 Terraform 或 OpenTofu 的 `terragrunt` | [Terragrunt](terragrunt.md) |
| Bash Script | `bash` | 使用 `/bin/bash` 运行 shell 脚本 | [Shell](bash.md) |
| PowerShell Script | `powershell` | 使用 `pwsh` 运行 `.ps1` 脚本 | [PowerShell](powershell.md) |
| Python Script | `python` | 使用 `python3` 运行 `.py` 脚本 | [Python](python.md) |

工具本身必须安装在执行任务的机器上：Semaphore 服务器或[运行器（Runner）](../../../../docs/admin-guide/runners.md)。官方 Docker 镜像包含 Ansible、Terraform、OpenTofu、Bash 和 Python。

<a id="managing-applications"></a>

## 管理应用

管理员可从侧边栏底部的账户菜单打开**应用**（Applications）。

![应用页面](../../../../static/assets/apps-list.webp)

每一行的开关用于启用或禁用该应用。被禁用的应用不会出现在模板表单中，但现有模板仍可继续工作。创建模板时只会显示已启用的应用，因此请禁用未安装在服务器上的工具。

点击某个应用可修改其标题、图标、二进制文件路径和优先级（在模板表单中的排序）。

<a id="custom-applications"></a>

## 自定义应用

**新建应用**（New App）可将任意命令行工具注册为应用：

| 字段 | 说明 |
|---|---|
| **ID** | 在 API 和模板中使用的简短标识符，例如 `pulumi`。 |
| **图标（Icon）** | 显示在名称旁的图标。 |
| **名称（Name）** | 在模板表单中显示的标题。 |
| **路径（Path）** | 服务器或运行器上可执行文件的路径。 |
| **优先级（Priority）** | 在应用列表中的位置。 |
| **启用（Active）** | 该应用是否在模板中可选。 |

自定义应用的模板会以仓库中的脚本文件作为参数运行该可执行文件，并以环境变量的形式接收变量组（Variable Groups），与 [Bash](bash.md) 模板的方式相同。

应用也可以在服务器配置中预定义，参见[配置](../../../../docs/admin-guide/configuration.md)中的 `apps` 部分。
