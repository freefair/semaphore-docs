# Instalación manual de Semaphore

----

**Contenido:**

* [Usuario de servicio](../../../docs/admin-guide/installation_manually.md#service-user)
* [Python3](../../../docs/admin-guide/installation_manually.md#python3)
* [Colecciones y roles de Ansible](../../../docs/admin-guide/installation_manually.md#ansible-collections--roles)
* [Proxy inverso](../../../docs/admin-guide/installation_manually.md#reverse-proxy)
* [Servicio de Systemd](../../../docs/admin-guide/installation_manually.md#extended-systemd-service)
* [Solución de problemas](../../../docs/admin-guide/installation_manually.md#troubleshooting)

----

Esta documentación detalla cómo configurar Semaphore cuando se utilizan estos métodos de instalación:

* [Gestor de paquetes](../../../docs/admin-guide/installation/package-manager.md)
* [Archivo binario](../../../docs/admin-guide/installation/binary-file.md)

El paquete de software de Semaphore es solo una parte de todo el sistema necesario para ejecutar Ansible correctamente con él.

¡El entorno de ejecución de Python3 y de Ansible también es muy importante!

NOTA: Existen [roles de Ansible Galaxy](https://galaxy.ansible.com/search?deprecated=false&keywords=ansible%20semaphore&order_by=-relevance&page=1) que se encargan de esta lógica de configuración por usted o que pueden usarse como plantilla base para su propio rol de Ansible.

----

<a id="service-user"></a>

## Usuario de servicio

Semaphore no necesita ejecutarse como usuario `root`, así que no debería hacerlo.

**Ventajas** de usar un usuario de servicio:
* Tiene su propia configuración de usuario
* Tiene su propio entorno
* Los procesos son fácilmente identificables
* Mayor seguridad del sistema

Puede crear un usuario del sistema manualmente con `adduser` o mediante el módulo [ansible.builtin.user](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/user_module.html).

En esta documentación se asumirá que:
* el usuario de servicio creado se llama `semaphore`
* tiene configurado el shell `/bin/bash`
* su directorio personal es `/home/semaphore`

<a id="troubleshooting"></a>

### Solución de problemas

Si la ejecución de Ansible desde Semaphore falla, deberá diagnosticarla en el contexto del usuario de servicio.

Tiene varias opciones para hacerlo:

* Cambiar toda su sesión de shell al contexto del usuario:

  ```bash
  sudo su --login semaphore
  ```

* Ejecutar un único comando en el contexto del usuario:

  ```bash
  sudo --login -u semaphore <command>
  ```

----

<a id="python3"></a>

## Python3

[Ansible](https://docs.ansible.com/ansible/latest/getting_started/index.html) está desarrollado con el lenguaje de programación [Python3](https://docs.python.org/3/).

Por tanto, una instalación limpia de este es esencial para que Ansible funcione correctamente.

En primer lugar, asegúrese de que los paquetes `python3` y `python3-pip` estén instalados en su sistema.

Tiene varias opciones para instalar los módulos de Python necesarios:
* Instalarlos en el contexto del usuario de servicio
* Instalarlos en un [entorno virtual](https://virtualenv.pypa.io/en/latest/) específico del servicio

<a id="requirements"></a>

### Requisitos

En cualquier caso, se recomienda usar un archivo `requirements.txt` para especificar los módulos que deben instalarse.

Se asumirá que se utiliza el archivo `/home/semaphore/requirements.txt`.

Este es un ejemplo de su contenido:

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

NOTA: ¡También debería actualizar estos requisitos de vez en cuando!

En el ejemplo de servicio que se muestra más abajo se incluye una opción para hacerlo automáticamente.

<a id="modules-in-user-context"></a>

### Módulos en el contexto del usuario

**Manualmente**:

```bash
sudo --login -u semaphore python3 -m pip install --user --upgrade -r /home/semaphore/requirements.txt
```

**Con Ansible**:

```yaml
- name: Install requirements
  ansible.builtin.pip:
    requirements: '/home/semaphore/requirements.txt'
    extra_args: '--user --upgrade'
  become_user: 'semaphore'
```

<a id="modules-in-a-virtualenv"></a>

### Módulos en un virtualenv

Se asumirá que el virtualenv se crea en `/home/semaphore/venv`

Asegúrese de que el entorno virtual esté activado dentro del servicio. Esto también se muestra en el ejemplo de servicio más abajo.

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

**Con Ansible**:

```yaml
- name: Create virtual environment and install requirements into it
  ansible.builtin.pip:
    requirements: '/home/semaphore/requirements.txt'
    virtualenv: '/home/semaphore/venv'
    state: present  # or 'latest' to upgrade the requirements
```

<a id="troubleshooting-1"></a>

#### Solución de problemas

Si encuentra problemas con Python3 al usar un entorno virtual, deberá entrar en su contexto para diagnosticarlos:

```bash
sudo su --login semaphore
source /home/semaphore/venv/bin/activate
# verify we are using python3 from inside the venv
which python3
> /home/semaphore/venv/bin/python3

# troubleshooting

deactivate
```

A veces un entorno virtual también se rompe tras actualizaciones del sistema. Si esto ocurre, puede simplemente eliminar el existente y volver a crearlo.

----

<a id="ansible-collections--roles"></a>

## Colecciones y roles de Ansible

Es posible que desee preinstalar los módulos y roles de Ansible para que no tengan que instalarse cada vez que se ejecuta una tarea.

<a id="requirements-1"></a>

### Requisitos

Se recomienda usar un archivo `requirements.yml` para especificar los módulos que deben instalarse.

Se asumirá que se utiliza el archivo `/home/semaphore/requirements.yml`.

Este es un ejemplo de su contenido:

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

Véase también: [Instalación de colecciones](https://docs.ansible.com/ansible/latest/galaxy/user_guide.html#installing-a-collection-from-galaxy), [Instalación de roles](https://docs.ansible.com/ansible/latest/galaxy/user_guide.html#installing-multiple-roles-from-a-file)

NOTA: ¡También debería actualizar estos requisitos de vez en cuando!

En el ejemplo de servicio que se muestra más abajo se incluye una opción para hacerlo automáticamente.

<a id="install-in-user-context"></a>

### Instalación en el contexto del usuario

**Manualmente**:
```bash
sudo su --login semaphore
ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml
ansible-galaxy role install --force -r /home/semaphore/requirements.yml
```

<a id="install-when-using-a-virtualenv"></a>

### Instalación al usar un virtualenv

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

## Proxy inverso

Consulte: [Seguridad - Conexión cifrada](../../../docs/admin-guide/security/network.md#reverse-proxy)

----

<a id="extended-systemd-service"></a>

## Servicio de Systemd ampliado

Esta es la plantilla básica del servicio de systemd.

Añada los ajustes adicionales bajo su `[PART]` correspondiente

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

### Usuario de servicio

```ini
[Service]
User=semaphore
Group=semaphore
```

----

<a id="python-modules"></a>

### Módulos de Python

<a id="in-user-context"></a>

#### En el contexto del usuario

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

#### En un virtualenv

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

### Colecciones y roles de Ansible

<a id="if-using-python3-in-user-context"></a>

#### Si usa Python3 en el contexto del usuario

```ini
[Service]
# to auto-upgrade ansible collections and roles at service startup
ExecStartPre=/bin/bash -c 'ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml'
ExecStartPre=/bin/bash -c 'ansible-galaxy role install --force -r /home/semaphore/requirements.yml'
```

<a id="if-using-python3-in-virtualenv"></a>

#### Si usa Python3 en un virtualenv

```ini
# to auto-upgrade ansible collections and roles at service startup
ExecStartPre=/bin/bash -c 'source /home/semaphore/venv/bin/activate \
                           && ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml \
                           && ansible-galaxy role install --force -r /home/semaphore/requirements.yml'
```

----

<a id="other-use-cases"></a>

### Otros casos de uso

<a id="using-local-mariadb"></a>

#### Uso de MariaDB local

```ini
[Unit]
Requires=mariadb.service
```

<a id="using-local-nginx"></a>

#### Uso de Nginx local

```ini
[Unit]
Wants=nginx.service
```

<a id="sending-logs-to-syslog"></a>

#### Envío de registros a syslog

```ini
[Service]
StandardOutput=journal
StandardError=journal
SyslogIdentifier=semaphore
```

<a id="full-examples"></a>

### Ejemplos completos

<a id="python-modules-in-user-context"></a>

#### Módulos de Python en el contexto del usuario

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

#### Módulos de Python en un virtualenv

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

### Correcciones

Si tiene configurado un idioma del sistema personalizado, puede encontrarse con problemas que se resuelven actualizando las variables de entorno correspondientes:

```ini
[Service]
Environment=LANG="en_US.UTF-8"
Environment=LC_ALL="en_US.UTF-8"
```

----

<a id="troubleshooting-2"></a>

## Solución de problemas

Si se produce un problema al ejecutar una tarea, puede tratarse de un problema del entorno de su instalación, ¡y no de un problema de Semaphore en sí!

Siga estos pasos para comprobar si el problema ocurre fuera de Semaphore:

- Entre en el contexto del usuario:

  ```bash
  sudo su --login semaphore
  ```

- Entre en el contexto del virtualenv, si utiliza uno:

  ```ini
  source /home/semaphore/venv/bin/activate
  # verify we are using python3 from inside the venv
  which python3
  > /home/semaphore/venv/bin/python3

  # troubleshooting

  deactivate
  ```

- Ejecute el playbook de Ansible manualmente

  - Si **falla** => hay un problema en su entorno
  - Si **funciona**:
    - Vuelva a revisar su configuración dentro de Semaphore
    - Puede tratarse de un problema de Semaphore
