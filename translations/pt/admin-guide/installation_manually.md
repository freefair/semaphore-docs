# Instalando o Semaphore manualmente

----

**Conteúdo:**

* [Usuário de serviço](../../../docs/admin-guide/installation_manually.md#service-user)
* [Python3](../../../docs/admin-guide/installation_manually.md#python3)
* [Coleções e roles do Ansible](../../../docs/admin-guide/installation_manually.md#ansible-collections--roles)
* [Proxy reverso](../../../docs/admin-guide/installation_manually.md#reverse-proxy)
* [Serviço Systemd](../../../docs/admin-guide/installation_manually.md#extended-systemd-service)
* [Solução de problemas](../../../docs/admin-guide/installation_manually.md#troubleshooting)

----

Esta documentação detalha como configurar o Semaphore ao usar estes métodos de instalação:

* [Gerenciador de pacotes](../../../docs/admin-guide/installation/package-manager.md)
* [Arquivo binário](../../../docs/admin-guide/installation/binary-file.md)

O pacote de software do Semaphore é apenas uma parte de todo o sistema necessário para executar o Ansible com sucesso.

O ambiente de execução do Python3 e do Ansible também é muito importante!

NOTA: Existem [roles do Ansible Galaxy](https://galaxy.ansible.com/search?deprecated=false&keywords=ansible%20semaphore&order_by=-relevance&page=1) que cuidam dessa lógica de configuração para você ou que podem ser usadas como modelo base para a sua própria role do Ansible!

----

<a id="service-user"></a>

## Usuário de serviço

O Semaphore não precisa ser executado como usuário `root` - então você não deveria fazer isso.

**Benefícios** de usar um usuário de serviço:
* Possui sua própria configuração de usuário
* Possui seu próprio ambiente
* Processos facilmente identificáveis
* Maior segurança do sistema

Você pode criar um usuário de sistema manualmente usando `adduser` ou usando o módulo [ansible.builtin.user](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/user_module.html).

Nesta documentação, vamos assumir que:
* o usuário de serviço criado se chama `semaphore`
* ele tem o shell `/bin/bash` definido
* seu diretório home é `/home/semaphore`

<a id="troubleshooting"></a>

### Solução de problemas

Se a execução do Ansible pelo Semaphore estiver falhando - você precisará diagnosticar o problema no contexto do usuário de serviço.

Você tem várias opções para fazer isso:

* Mudar toda a sua sessão de shell para o contexto do usuário:

  ```bash
  sudo su --login semaphore
  ```

* Executar um único comando no contexto do usuário:

  ```bash
  sudo --login -u semaphore <command>
  ```

----

<a id="python3"></a>

## Python3

O [Ansible](https://docs.ansible.com/ansible/latest/getting_started/index.html) é desenvolvido na linguagem de programação [Python3](https://docs.python.org/3/).

Por isso, uma configuração limpa do Python3 é essencial para que o Ansible funcione corretamente.

Primeiro - certifique-se de que os pacotes `python3` e `python3-pip` estejam instalados no seu sistema!

Você tem várias opções para instalar os módulos Python necessários:
* Instalá-los no contexto do usuário de serviço
* Instalá-los em um [ambiente virtual](https://virtualenv.pypa.io/en/latest/) específico do serviço

<a id="requirements"></a>

### Requisitos

De qualquer forma - é recomendável usar um arquivo `requirements.txt` para especificar os módulos que precisam ser instalados.

Vamos assumir que o arquivo `/home/semaphore/requirements.txt` é utilizado.

Aqui está um exemplo do seu conteúdo:

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

NOTA: Você também deve atualizar esses requisitos de tempos em tempos!

Uma opção para fazer isso automaticamente também é mostrada no exemplo de serviço abaixo.

<a id="modules-in-user-context"></a>

### Módulos no contexto do usuário

**Manualmente**:

```bash
sudo --login -u semaphore python3 -m pip install --user --upgrade -r /home/semaphore/requirements.txt
```

**Usando o Ansible**:

```yaml
- name: Install requirements
  ansible.builtin.pip:
    requirements: '/home/semaphore/requirements.txt'
    extra_args: '--user --upgrade'
  become_user: 'semaphore'
```

<a id="modules-in-a-virtualenv"></a>

### Módulos em um virtualenv

Vamos assumir que o virtualenv é criado em `/home/semaphore/venv`

Certifique-se de que o ambiente virtual esteja ativado dentro do serviço! Isso também é mostrado no exemplo de serviço abaixo.

**Manualmente**:
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

**Usando o Ansible**:

```yaml
- name: Create virtual environment and install requirements into it
  ansible.builtin.pip:
    requirements: '/home/semaphore/requirements.txt'
    virtualenv: '/home/semaphore/venv'
    state: present  # or 'latest' to upgrade the requirements
```

<a id="troubleshooting-1"></a>

#### Solução de problemas

Se você encontrar problemas com o Python3 ao usar um ambiente virtual, precisará entrar no contexto dele para diagnosticá-los:

```bash
sudo su --login semaphore
source /home/semaphore/venv/bin/activate
# verify we are using python3 from inside the venv
which python3
> /home/semaphore/venv/bin/python3

# troubleshooting

deactivate
```

Às vezes, um ambiente virtual também quebra em atualizações do sistema. Se isso acontecer, basta remover o existente e recriá-lo.

----

<a id="ansible-collections--roles"></a>

## Coleções e roles do Ansible

Você pode querer pré-instalar módulos e roles do Ansible, para que não precisem ser instalados toda vez que uma tarefa for executada!

<a id="requirements-1"></a>

### Requisitos

É recomendável usar um arquivo `requirements.yml` para especificar os módulos que precisam ser instalados.

Vamos assumir que o arquivo `/home/semaphore/requirements.yml` é utilizado.

Aqui está um exemplo do seu conteúdo:

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

Veja também: [Instalando coleções](https://docs.ansible.com/ansible/latest/galaxy/user_guide.html#installing-a-collection-from-galaxy), [Instalando roles](https://docs.ansible.com/ansible/latest/galaxy/user_guide.html#installing-multiple-roles-from-a-file)

NOTA: Você também deve atualizar esses requisitos de tempos em tempos!

Uma opção para fazer isso automaticamente também é mostrada no exemplo de serviço abaixo.

<a id="install-in-user-context"></a>

### Instalação no contexto do usuário

**Manualmente**:
```bash
sudo su --login semaphore
ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml
ansible-galaxy role install --force -r /home/semaphore/requirements.yml
```

<a id="install-when-using-a-virtualenv"></a>

### Instalação ao usar um virtualenv

**Manualmente**:
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

## Proxy reverso

Consulte: [Segurança - Conexão criptografada](../../../docs/admin-guide/security/network.md#reverse-proxy)

----

<a id="extended-systemd-service"></a>

## Serviço Systemd estendido

Aqui está o template básico do serviço systemd.

Adicione configurações adicionais na respectiva seção `[PART]`

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

### Usuário de serviço

```ini
[Service]
User=semaphore
Group=semaphore
```

----

<a id="python-modules"></a>

### Módulos Python

<a id="in-user-context"></a>

#### No contexto do usuário

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

#### Em um virtualenv

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

### Coleções e roles do Ansible

<a id="if-using-python3-in-user-context"></a>

#### Se estiver usando o Python3 no contexto do usuário

```ini
[Service]
# to auto-upgrade ansible collections and roles at service startup
ExecStartPre=/bin/bash -c 'ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml'
ExecStartPre=/bin/bash -c 'ansible-galaxy role install --force -r /home/semaphore/requirements.yml'
```

<a id="if-using-python3-in-virtualenv"></a>

#### Se estiver usando o Python3 em um virtualenv

```ini
# to auto-upgrade ansible collections and roles at service startup
ExecStartPre=/bin/bash -c 'source /home/semaphore/venv/bin/activate \
                           && ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml \
                           && ansible-galaxy role install --force -r /home/semaphore/requirements.yml'
```

----

<a id="other-use-cases"></a>

### Outros casos de uso

<a id="using-local-mariadb"></a>

#### Usando MariaDB local

```ini
[Unit]
Requires=mariadb.service
```

<a id="using-local-nginx"></a>

#### Usando Nginx local

```ini
[Unit]
Wants=nginx.service
```

<a id="sending-logs-to-syslog"></a>

#### Enviando logs para o syslog

```ini
[Service]
StandardOutput=journal
StandardError=journal
SyslogIdentifier=semaphore
```

<a id="full-examples"></a>

### Exemplos completos

<a id="python-modules-in-user-context"></a>

#### Módulos Python no contexto do usuário

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

#### Módulos Python em um virtualenv

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

### Correções

Se você tiver um idioma de sistema personalizado definido - poderá encontrar problemas que podem ser resolvidos atualizando as variáveis de ambiente correspondentes:

```ini
[Service]
Environment=LANG="en_US.UTF-8"
Environment=LC_ALL="en_US.UTF-8"
```

----

<a id="troubleshooting-2"></a>

## Solução de problemas

Se houver um problema ao executar uma tarefa, pode ser um problema de ambiente na sua configuração - e não um problema do Semaphore em si!

Siga estas etapas para verificar se o problema ocorre fora do Semaphore:

- Entre no contexto do usuário:

  ```bash
  sudo su --login semaphore
  ```

- Entre no contexto do virtualenv, se você usar um:

  ```ini
  source /home/semaphore/venv/bin/activate
  # verify we are using python3 from inside the venv
  which python3
  > /home/semaphore/venv/bin/python3

  # troubleshooting

  deactivate
  ```

- Execute o playbook do Ansible manualmente

  - Se **falhar** => há um problema no seu ambiente
  - Se **funcionar**:
    - Verifique novamente a sua configuração dentro do Semaphore
    - Pode ser um problema do Semaphore
