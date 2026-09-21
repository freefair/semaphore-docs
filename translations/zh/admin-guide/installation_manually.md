# 手动安装 Semaphore

----

**目录：**

* [服务用户](../../../docs/admin-guide/installation_manually.md#service-user)
* [Python3](../../../docs/admin-guide/installation_manually.md#python3)
* [Ansible 集合与角色](../../../docs/admin-guide/installation_manually.md#ansible-collections--roles)
* [反向代理](../../../docs/admin-guide/installation_manually.md#reverse-proxy)
* [Systemd 服务](../../../docs/admin-guide/installation_manually.md#extended-systemd-service)
* [故障排查](../../../docs/admin-guide/installation_manually.md#troubleshooting)

----

本文档详细介绍了在使用以下安装方式时如何设置 Semaphore：

* [包管理器](../../../docs/admin-guide/installation/package-manager.md)
* [二进制文件](../../../docs/admin-guide/installation/binary-file.md)

Semaphore 软件包只是成功运行 Ansible 所需整个系统的一部分。

Python3 和 Ansible 的执行环境同样非常重要！

注意：已有[现成的 Ansible Galaxy 角色](https://galaxy.ansible.com/search?deprecated=false&keywords=ansible%20semaphore&order_by=-relevance&page=1)可以为你处理这些设置逻辑，也可以作为你自己编写 Ansible 角色的基础模板！

----

<a id="service-user"></a>

## 服务用户

Semaphore 不需要以 `root` 用户运行——所以你也不应该这样做。

使用服务用户的**好处**：
* 拥有自己的用户配置
* 拥有自己的环境
* 进程易于识别
* 提升系统安全性

你可以通过 `adduser` 手动创建系统用户，也可以使用 [ansible.builtin.user](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/user_module.html) 模块创建。

在本文档中我们假设：
* 创建的服务用户名为 `semaphore`
* 其 shell 设置为 `/bin/bash`
* 其主目录为 `/home/semaphore`

<a id="troubleshooting"></a>

### 故障排查

如果 Semaphore 执行 Ansible 失败，你需要在服务用户的上下文中进行排查。

你有多种方式可以做到这一点：

* 将整个 shell 会话切换到该用户的上下文：

  ```bash
  sudo su --login semaphore
  ```

* 在该用户的上下文中运行单条命令：

  ```bash
  sudo --login -u semaphore <command>
  ```

----

<a id="python3"></a>

## Python3

[Ansible](https://docs.ansible.com/ansible/latest/getting_started/index.html) 是使用 [Python3](https://docs.python.org/3/) 编程语言构建的。

因此，一个干净的 Python3 环境是 Ansible 正常工作的基础。

首先，确保系统中已安装 `python3` 和 `python3-pip` 软件包！

安装所需 Python 模块有多种方式：
* 在服务用户的上下文中安装
* 在专用于该服务的[虚拟环境](https://virtualenv.pypa.io/en/latest/)中安装

<a id="requirements"></a>

### 依赖文件

无论采用哪种方式，都建议使用 `requirements.txt` 文件来指定需要安装的模块。

我们假设使用的是 `/home/semaphore/requirements.txt` 文件。

其内容示例如下：

```text
ansible
# for common jinja-filters
netaddr
jmespath
# for common modules
pywinrm
passlib
requests
docker
```

注意：你还应该定期更新这些依赖！

下面的服务示例中也展示了一种自动完成此操作的方法。

<a id="modules-in-user-context"></a>

### 在用户上下文中安装模块

**手动**：

```bash
sudo --login -u semaphore python3 -m pip install --user --upgrade -r /home/semaphore/requirements.txt
```

**使用 Ansible**：

```yaml
- name: Install requirements
  ansible.builtin.pip:
    requirements: '/home/semaphore/requirements.txt'
    extra_args: '--user --upgrade'
  become_user: 'semaphore'
```

<a id="modules-in-a-virtualenv"></a>

### 在 virtualenv 中安装模块

我们假设虚拟环境创建在 `/home/semaphore/venv`

确保在服务中激活了该虚拟环境！下面的服务示例中也展示了这一点。

**手动**：
```bash
sudo su --login semaphore
python3 -m pip install --user virtualenv
python3 -m venv /home/semaphore/venv
# activate the context of the virtual environment
source /home/semaphore/venv/bin/activate
# verify we are using python3 from inside the venv
which python3
> /home/semaphore/venv/bin/python3
python3 -m pip install --upgrade -r /home/semaphore/requirements.txt
# disable the context to the virtual environment
deactivate
```

**使用 Ansible**：

```yaml
- name: Create virtual environment and install requirements into it
  ansible.builtin.pip:
    requirements: '/home/semaphore/requirements.txt'
    virtualenv: '/home/semaphore/venv'
    state: present  # or 'latest' to upgrade the requirements
```

<a id="troubleshooting-1"></a>

#### 故障排查

如果在使用虚拟环境时遇到 Python3 问题，你需要切换到该虚拟环境的上下文中进行排查：

```bash
sudo su --login semaphore
source /home/semaphore/venv/bin/activate
# verify we are using python3 from inside the venv
which python3
> /home/semaphore/venv/bin/python3

# troubleshooting

deactivate
```

有时虚拟环境也会在系统升级后损坏。如果出现这种情况，你可以直接删除现有的虚拟环境并重新创建。

----

<a id="ansible-collections--roles"></a>

## Ansible 集合与角色

你可能希望预先安装 Ansible 模块和角色，这样就不必在每次运行任务时重新安装！

<a id="requirements-1"></a>

### 依赖文件

建议使用 `requirements.yml` 文件来指定需要安装的模块。

我们假设使用的是 `/home/semaphore/requirements.yml` 文件。

其内容示例如下：

```yaml
---

collections:
  - 'namespace.collection'
  # for common collections:
  - 'community.general'
  - 'ansible.posix'
  - 'community.mysql'
  - 'community.crypto'

roles:
  - src: 'namespace.role'
```

另请参阅：[安装集合](https://docs.ansible.com/ansible/latest/galaxy/user_guide.html#installing-a-collection-from-galaxy)、[安装角色](https://docs.ansible.com/ansible/latest/galaxy/user_guide.html#installing-multiple-roles-from-a-file)

注意：你还应该定期更新这些依赖！

下面的服务示例中也展示了一种自动完成此操作的方法。

<a id="install-in-user-context"></a>

### 在用户上下文中安装

**手动**：
```bash
sudo su --login semaphore
ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml
ansible-galaxy role install --force -r /home/semaphore/requirements.yml
```

<a id="install-when-using-a-virtualenv"></a>

### 使用 virtualenv 时安装

**手动**：
```bash
sudo su --login semaphore
source /home/semaphore/venv/bin/activate
# verify we are using python3 from inside the venv
which python3
> /home/semaphore/venv/bin/python3

ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml
ansible-galaxy role install --force -r /home/semaphore/requirements.yml

deactivate
```

----

<a id="reverse-proxy"></a>

## 反向代理

请参阅：[安全 - 加密连接](../../../docs/admin-guide/security/network.md#reverse-proxy)

----

<a id="extended-systemd-service"></a>

## 扩展的 Systemd 服务

以下是 systemd 服务的基础模板。

将额外的设置添加到对应的 `[PART]` 段落下

<a id="base"></a>

### 基础

```ini
[Unit]
Description=Semaphore UI
Documentation=https://github.com/freefair/semaphore-docs
Wants=network-online.target
After=network-online.target
ConditionPathExists=/usr/bin/semaphore
ConditionPathExists=/etc/semaphore/config.json

[Service]
ExecStart=/usr/bin/semaphore server --config /etc/semaphore/config.json
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=10s

[Install]
WantedBy=multi-user.target
```

<a id="service-user-1"></a>

### 服务用户

```ini
[Service]
User=semaphore
Group=semaphore
```

----

<a id="python-modules"></a>

### Python 模块

<a id="in-user-context"></a>

#### 在用户上下文中

```ini
[Service]
# to auto-upgrade python modules at service startup
ExecStartPre=/bin/bash -c 'python3 -m pip install --upgrade --user -r /home/semaphore/requirements.txt'

# so the executables are found
Environment="PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/home/semaphore/.local/bin"
# set the correct python path. You can get the correct path with: python3 -c "import site; print(site.USER_SITE)"
Environment="PYTHONPATH=/home/semaphore/.local/lib/python3.10/site-packages"
```

<a id="in-virtualenv"></a>

#### 在 virtualenv 中

```ini
[Service]
# to auto-upgrade python modules at service startup
ExecStartPre=/bin/bash -c 'source /home/semaphore/venv/bin/activate \
                           && python3 -m pip install --upgrade -r /home/semaphore/requirements.txt'

# REPLACE THE EXISTING 'ExecStart'
ExecStart=/bin/bash -c 'source /home/semaphore/venv/bin/activate \
                        && /usr/bin/semaphore server --config /etc/semaphore/config.json'
```

----

<a id="ansible-collections--roles-1"></a>

### Ansible 集合与角色

<a id="if-using-python3-in-user-context"></a>

#### 如果在用户上下文中使用 Python3

```ini
[Service]
# to auto-upgrade ansible collections and roles at service startup
ExecStartPre=/bin/bash -c 'ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml'
ExecStartPre=/bin/bash -c 'ansible-galaxy role install --force -r /home/semaphore/requirements.yml'
```

<a id="if-using-python3-in-virtualenv"></a>

#### 如果在 virtualenv 中使用 Python3

```ini
# to auto-upgrade ansible collections and roles at service startup
ExecStartPre=/bin/bash -c 'source /home/semaphore/venv/bin/activate \
                           && ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml \
                           && ansible-galaxy role install --force -r /home/semaphore/requirements.yml'
```

----

<a id="other-use-cases"></a>

### 其他使用场景

<a id="using-local-mariadb"></a>

#### 使用本地 MariaDB

```ini
[Unit]
Requires=mariadb.service
```

<a id="using-local-nginx"></a>

#### 使用本地 Nginx

```ini
[Unit]
Wants=nginx.service
```

<a id="sending-logs-to-syslog"></a>

#### 将日志发送到 syslog

```ini
[Service]
StandardOutput=journal
StandardError=journal
SyslogIdentifier=semaphore
```

<a id="full-examples"></a>

### 完整示例

<a id="python-modules-in-user-context"></a>

#### 用户上下文中的 Python 模块

```ini
[Unit]
Description=Semaphore UI
Documentation=https://github.com/freefair/semaphore-docs
Wants=network-online.target
After=network-online.target
ConditionPathExists=/usr/bin/semaphore
ConditionPathExists=/etc/semaphore/config.json

[Service]
User=semaphore
Group=semaphore
Restart=always
RestartSec=10s
Environment="PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:~/.local/bin"

ExecStartPre=/bin/bash -c 'ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml'
ExecStartPre=/bin/bash -c 'ansible-galaxy role install --force -r /home/semaphore/requirements.yml'
ExecStartPre=/bin/bash -c 'python3 -m pip install --upgrade --user -r /home/semaphore/requirements.txt'

ExecStart=/usr/bin/semaphore server --config /etc/semaphore/config.json
ExecReload=/bin/kill -HUP $MAINPID

[Install]
WantedBy=multi-user.target
```

<a id="python-modules-in-virtualenv"></a>

#### virtualenv 中的 Python 模块

```ini
[Unit]
Description=Semaphore UI
Documentation=https://github.com/freefair/semaphore-docs
Wants=network-online.target
After=network-online.target
ConditionPathExists=/usr/bin/semaphore
ConditionPathExists=/etc/semaphore/config.json

[Service]
User=semaphore
Group=semaphore
Restart=always
RestartSec=10s

ExecStartPre=/bin/bash -c 'source /home/semaphore/venv/bin/activate \
                           && python3 -m pip install --upgrade -r /home/semaphore/requirements.txt'
ExecStartPre=/bin/bash -c 'source /home/semaphore/venv/bin/activate \
                           && ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml \
                           && ansible-galaxy role install --force -r /home/semaphore/requirements.yml'

ExecStart=/bin/bash -c 'source /home/semaphore/venv/bin/activate \
                        && /usr/bin/semaphore server --config /etc/semaphore/config.json'
ExecReload=/bin/kill -HUP $MAINPID

[Install]
WantedBy=multi-user.target
```

<a id="fixes"></a>

### 修复

如果你设置了自定义的系统语言，可能会遇到一些问题，可以通过更新相关环境变量来解决：

```ini
[Service]
Environment=LANG="en_US.UTF-8"
Environment=LC_ALL="en_US.UTF-8"
```

----

<a id="troubleshooting-2"></a>

## 故障排查

如果执行任务时出现问题，可能是你的环境设置存在问题，而不是 Semaphore 本身的问题！

请按照以下步骤确认问题是否发生在 Semaphore 之外：

- 切换到该用户的上下文：

  ```bash
  sudo su --login semaphore
  ```

- 如果使用了 virtualenv，切换到其上下文：

  ```ini
  source /home/semaphore/venv/bin/activate
  # verify we are using python3 from inside the venv
  which python3
  > /home/semaphore/venv/bin/python3

  # troubleshooting

  deactivate
  ```

- 手动运行 Ansible Playbook

  - 如果**失败** => 说明你的环境存在问题
  - 如果**成功**：
    - 重新检查 Semaphore 中的配置
    - 可能是 Semaphore 的问题
