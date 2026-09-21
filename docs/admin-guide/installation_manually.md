# Manually installing Semaphore

----

**Content:**

* [Service User](installation_manually.md#service-user)
* [Python3](installation_manually.md#python3)
* [Ansible Collections & Roles](installation_manually.md#ansible-collections--roles)
* [Reverse Proxy](installation_manually.md#reverse-proxy)
* [Systemd Service](installation_manually.md#extended-systemd-service)
* [Troubleshooting](installation_manually.md#troubleshooting)

----

This documentation goes into the details on how to set-up Semaphore when using these installation methods:

* [Package manager](installation/package-manager.md)
* [Binary file](installation/binary-file.md)

The Semaphore software-package is just a part of the whole system needed to successfully run Ansible with it.

The Python3- and Ansible-Execution-Environment are also very important!

NOTE: There are [existing Ansible-Galaxy Roles](https://galaxy.ansible.com/search?deprecated=false&keywords=ansible%20semaphore&order_by=-relevance&page=1) that handle this setup-logic for you or can be used as a base-template for your own Ansible Role!

----

<a id="service-user"></a>

## Service User

Semaphore does not need to be run as user `root` - so you shouldn't.

**Benefits** of using a service user:
* Has its own user-config
* Has its own environment
* Processes easily identifiable
* Gained system security

You can create a system user either manually by using `adduser` or using the [ansible.builtin.user](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/user_module.html) module.

In this documentation we will assume:
* the service user creates is named `semaphore`
* it has the shell `/bin/bash` set
* its home directory is `/home/semaphore`

<a id="troubleshooting"></a>

### Troubleshooting

If the Ansible execution of Semaphore is failing - you will need to troubleshoot it in the context of the service user.

You have multiple options to do so:

* Change your whole shell session to be in the user's context:

  ```bash
  sudo su --login semaphore
  ```

* Run a single command in the user's context:

  ```bash
  sudo --login -u semaphore <command>
  ```

----

<a id="python3"></a>

## Python3

[Ansible](https://docs.ansible.com/ansible/latest/getting_started/index.html) is build using the [Python3](https://docs.python.org/3/) programming language.

So its clean setup is essential for Ansible to work correctly.

First - make sure the packages `python3` and `python3-pip` are installed on your system!

You have multiple options to install required Python modules:
* Installing them in the service user's context
* Installing them in a service-specific [Virtual Environment](https://virtualenv.pypa.io/en/latest/)

<a id="requirements"></a>

### Requirements

Either way - it is recommended to use a `requirements.txt` file to specify the modules that need to be installed.

We will assume the file `/home/semaphore/requirements.txt` is used.

Here is an example of its content:

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

NOTE: You should also update those requirements from time to time!

An option for doing this automatically is also shown in the service example below.

<a id="modules-in-user-context"></a>

### Modules in user context

**Manually**:

```bash
sudo --login -u semaphore python3 -m pip install --user --upgrade -r /home/semaphore/requirements.txt
```

**Using Ansible**:

```yaml
- name: Install requirements
  ansible.builtin.pip:
    requirements: '/home/semaphore/requirements.txt'
    extra_args: '--user --upgrade'
  become_user: 'semaphore'
```

<a id="modules-in-a-virtualenv"></a>

### Modules in a virtualenv

We will assume the virtualenv is created at `/home/semaphore/venv`

Make sure the virtual environment is activated inside the Service! This is also shown in the service example below.

**Manually**:
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

**Using Ansible**:

```yaml
- name: Create virtual environment and install requirements into it
  ansible.builtin.pip:
    requirements: '/home/semaphore/requirements.txt'
    virtualenv: '/home/semaphore/venv'
    state: present  # or 'latest' to upgrade the requirements
```

<a id="troubleshooting-1"></a>

#### Troubleshooting

If you encounter Python3 issues when using a virtual environment, you will need to change into its context to troubleshoot them:

```bash
sudo su --login semaphore
source /home/semaphore/venv/bin/activate
# verify we are using python3 from inside the venv
which python3
> /home/semaphore/venv/bin/python3

# troubleshooting

deactivate
```

Sometimes a virtual environment also breaks on system upgrades. If this happens you might just remove the existing one and re-create it.

----

<a id="ansible-collections--roles"></a>

## Ansible Collections & Roles

You might want to pre-install Ansible modules and roles, so they don't need to be installed every time a task runs!

<a id="requirements-1"></a>

### Requirements

It is recommended to use a `requirements.yml` file to specify the modules that need to be installed.

We will assume the file `/home/semaphore/requirements.yml` is used.

Here is an example of its content:

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

See also: [Installing Collections](https://docs.ansible.com/ansible/latest/galaxy/user_guide.html#installing-a-collection-from-galaxy), [Installing Roles](https://docs.ansible.com/ansible/latest/galaxy/user_guide.html#installing-multiple-roles-from-a-file)

NOTE: You should also update those requirements from time to time!

An option for doing this automatically is also shown in the service example below.

<a id="install-in-user-context"></a>

### Install in user-context

**Manually**:
```bash
sudo su --login semaphore
ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml
ansible-galaxy role install --force -r /home/semaphore/requirements.yml
```

<a id="install-when-using-a-virtualenv"></a>

### Install when using a virtualenv

**Manually**:
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

## Reverse Proxy

See: [Security - Encrypted connection](security/network.md#reverse-proxy)

----

<a id="extended-systemd-service"></a>

## Extended Systemd Service

Here is the basic template of the systemd service.

Add additional settings under their `[PART]`

<a id="base"></a>

### Base

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

### Service user

```ini
[Service]
User=semaphore
Group=semaphore
```

----

<a id="python-modules"></a>

### Python Modules

<a id="in-user-context"></a>

#### In user-context

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

#### In virtualenv

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

### Ansible Collections & Roles

<a id="if-using-python3-in-user-context"></a>

#### If using Python3 in user-context

```ini
[Service]
# to auto-upgrade ansible collections and roles at service startup
ExecStartPre=/bin/bash -c 'ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml'
ExecStartPre=/bin/bash -c 'ansible-galaxy role install --force -r /home/semaphore/requirements.yml'
```

<a id="if-using-python3-in-virtualenv"></a>

#### If using Python3 in virtualenv

```ini
# to auto-upgrade ansible collections and roles at service startup
ExecStartPre=/bin/bash -c 'source /home/semaphore/venv/bin/activate \
                           && ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml \
                           && ansible-galaxy role install --force -r /home/semaphore/requirements.yml'
```

----

<a id="other-use-cases"></a>

### Other use-cases

<a id="using-local-mariadb"></a>

#### Using local MariaDB

```ini
[Unit]
Requires=mariadb.service
```

<a id="using-local-nginx"></a>

#### Using local Nginx

```ini
[Unit]
Wants=nginx.service
```

<a id="sending-logs-to-syslog"></a>

#### Sending logs to syslog

```ini
[Service]
StandardOutput=journal
StandardError=journal
SyslogIdentifier=semaphore
```

<a id="full-examples"></a>

### Full Examples

<a id="python-modules-in-user-context"></a>

#### Python Modules in user-context

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

#### Python Modules in virtualenv

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

### Fixes

If you have a custom system language set - you might run into problems that can be resoled by updating the associated environmental variables:

```ini
[Service]
Environment=LANG="en_US.UTF-8"
Environment=LC_ALL="en_US.UTF-8"
```

----

<a id="troubleshooting-2"></a>

## Troubleshooting

If there is a problem while executing a task it might be an environmental issue with your setup - not an issue with Semaphore itself!

Please go through these steps to verify if the issue occurs outside Semaphore:

- Change into the context of the user:

  ```bash
  sudo su --login semaphore
  ```

- Change into the context of the virtualenv if you use one:

  ```ini
  source /home/semaphore/venv/bin/activate
  # verify we are using python3 from inside the venv
  which python3
  > /home/semaphore/venv/bin/python3

  # troubleshooting

  deactivate
  ```

- Run the Ansible Playbook manually

  - If it **fails** => there is an issue with your environment
  - If it **works**:
    - Re-check your configuration inside Semaphore
    - It might be an issue with Semaphore
