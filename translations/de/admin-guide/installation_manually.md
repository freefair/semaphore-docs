# Manuelle Installation von Semaphore

----

**Inhalt:**

* [Dienstbenutzer](../../../docs/admin-guide/installation_manually.md#service-user)
* [Python3](../../../docs/admin-guide/installation_manually.md#python3)
* [Ansible Collections & Rollen](../../../docs/admin-guide/installation_manually.md#ansible-collections--roles)
* [Reverse Proxy](../../../docs/admin-guide/installation_manually.md#reverse-proxy)
* [Systemd-Dienst](../../../docs/admin-guide/installation_manually.md#extended-systemd-service)
* [Fehlerbehebung](../../../docs/admin-guide/installation_manually.md#troubleshooting)

----

Diese Dokumentation beschreibt im Detail, wie Sie Semaphore einrichten, wenn Sie eine dieser Installationsmethoden verwenden:

* [Paketmanager](../../../docs/admin-guide/installation/package-manager.md)
* [Binärdatei](../../../docs/admin-guide/installation/binary-file.md)

Das Semaphore-Softwarepaket ist nur ein Teil des Gesamtsystems, das nötig ist, um Ansible damit erfolgreich auszuführen.

Die Python3- und Ansible-Ausführungsumgebung sind ebenfalls sehr wichtig!

HINWEIS: Es gibt [bestehende Ansible-Galaxy-Rollen](https://galaxy.ansible.com/search?deprecated=false&keywords=ansible%20semaphore&order_by=-relevance&page=1), die diese Einrichtungslogik für Sie übernehmen oder als Basisvorlage für Ihre eigene Ansible-Rolle dienen können!

----

<a id="service-user"></a>

## Dienstbenutzer

Semaphore muss nicht als Benutzer `root` ausgeführt werden – und das sollten Sie auch nicht tun.

**Vorteile** eines Dienstbenutzers:
* Hat seine eigene Benutzerkonfiguration
* Hat seine eigene Umgebung
* Prozesse sind leicht identifizierbar
* Höhere Systemsicherheit

Sie können einen Systembenutzer entweder manuell mit `adduser` oder mit dem Modul [ansible.builtin.user](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/user_module.html) anlegen.

In dieser Dokumentation gehen wir davon aus, dass:
* der angelegte Dienstbenutzer `semaphore` heißt
* für ihn die Shell `/bin/bash` gesetzt ist
* sein Home-Verzeichnis `/home/semaphore` ist

<a id="troubleshooting"></a>

### Fehlerbehebung

Wenn die Ansible-Ausführung von Semaphore fehlschlägt, müssen Sie das Problem im Kontext des Dienstbenutzers untersuchen.

Dafür haben Sie mehrere Möglichkeiten:

* Wechseln Sie mit Ihrer gesamten Shell-Sitzung in den Kontext des Benutzers:

  ```bash
  sudo su --login semaphore
  ```

* Führen Sie einen einzelnen Befehl im Kontext des Benutzers aus:

  ```bash
  sudo --login -u semaphore <command>
  ```

----

<a id="python3"></a>

## Python3

[Ansible](https://docs.ansible.com/ansible/latest/getting_started/index.html) ist in der Programmiersprache [Python3](https://docs.python.org/3/) geschrieben.

Eine saubere Einrichtung von Python3 ist daher unerlässlich, damit Ansible korrekt funktioniert.

Stellen Sie zunächst sicher, dass die Pakete `python3` und `python3-pip` auf Ihrem System installiert sind!

Sie haben mehrere Möglichkeiten, die benötigten Python-Module zu installieren:
* Installation im Kontext des Dienstbenutzers
* Installation in einer dienstspezifischen [virtuellen Umgebung](https://virtualenv.pypa.io/en/latest/)

<a id="requirements"></a>

### Requirements

In beiden Fällen wird empfohlen, eine Datei `requirements.txt` zu verwenden, um die zu installierenden Module anzugeben.

Wir gehen davon aus, dass die Datei `/home/semaphore/requirements.txt` verwendet wird.

Hier ein Beispiel für ihren Inhalt:

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

HINWEIS: Sie sollten diese Requirements auch von Zeit zu Zeit aktualisieren!

Eine Möglichkeit, dies automatisch zu tun, wird ebenfalls im Dienst-Beispiel weiter unten gezeigt.

<a id="modules-in-user-context"></a>

### Module im Benutzerkontext

**Manuell**:

```bash
sudo --login -u semaphore python3 -m pip install --user --upgrade -r /home/semaphore/requirements.txt
```

**Mit Ansible**:

```yaml
- name: Install requirements
  ansible.builtin.pip:
    requirements: '/home/semaphore/requirements.txt'
    extra_args: '--user --upgrade'
  become_user: 'semaphore'
```

<a id="modules-in-a-virtualenv"></a>

### Module in einem virtualenv

Wir gehen davon aus, dass das virtualenv unter `/home/semaphore/venv` erstellt wird

Stellen Sie sicher, dass die virtuelle Umgebung innerhalb des Dienstes aktiviert ist! Dies wird ebenfalls im Dienst-Beispiel weiter unten gezeigt.

**Manuell**:
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

**Mit Ansible**:

```yaml
- name: Create virtual environment and install requirements into it
  ansible.builtin.pip:
    requirements: '/home/semaphore/requirements.txt'
    virtualenv: '/home/semaphore/venv'
    state: present  # or 'latest' to upgrade the requirements
```

<a id="troubleshooting-1"></a>

#### Fehlerbehebung

Wenn bei der Verwendung einer virtuellen Umgebung Python3-Probleme auftreten, müssen Sie zur Fehlersuche in deren Kontext wechseln:

```bash
sudo su --login semaphore
source /home/semaphore/venv/bin/activate
# verify we are using python3 from inside the venv
which python3
> /home/semaphore/venv/bin/python3

# troubleshooting

deactivate
```

Manchmal geht eine virtuelle Umgebung auch bei System-Upgrades kaputt. In diesem Fall können Sie die bestehende einfach entfernen und neu erstellen.

----

<a id="ansible-collections--roles"></a>

## Ansible Collections & Rollen

Möglicherweise möchten Sie Ansible-Module und -Rollen vorinstallieren, damit sie nicht bei jeder Task-Ausführung erneut installiert werden müssen!

<a id="requirements-1"></a>

### Requirements

Es wird empfohlen, eine Datei `requirements.yml` zu verwenden, um die zu installierenden Module anzugeben.

Wir gehen davon aus, dass die Datei `/home/semaphore/requirements.yml` verwendet wird.

Hier ein Beispiel für ihren Inhalt:

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

Siehe auch: [Collections installieren](https://docs.ansible.com/ansible/latest/galaxy/user_guide.html#installing-a-collection-from-galaxy), [Rollen installieren](https://docs.ansible.com/ansible/latest/galaxy/user_guide.html#installing-multiple-roles-from-a-file)

HINWEIS: Sie sollten diese Requirements auch von Zeit zu Zeit aktualisieren!

Eine Möglichkeit, dies automatisch zu tun, wird ebenfalls im Dienst-Beispiel weiter unten gezeigt.

<a id="install-in-user-context"></a>

### Installation im Benutzerkontext

**Manuell**:
```bash
sudo su --login semaphore
ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml
ansible-galaxy role install --force -r /home/semaphore/requirements.yml
```

<a id="install-when-using-a-virtualenv"></a>

### Installation bei Verwendung eines virtualenv

**Manuell**:
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

Siehe: [Sicherheit – Verschlüsselte Verbindung](../../../docs/admin-guide/security/network.md#reverse-proxy)

----

<a id="extended-systemd-service"></a>

## Erweiterter Systemd-Dienst

Hier ist die Basisvorlage des systemd-Dienstes.

Fügen Sie zusätzliche Einstellungen unter dem jeweiligen `[PART]` hinzu

<a id="base"></a>

### Basis

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

### Dienstbenutzer

```ini
[Service]
User=semaphore
Group=semaphore
```

----

<a id="python-modules"></a>

### Python-Module

<a id="in-user-context"></a>

#### Im Benutzerkontext

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

#### Im virtualenv

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

### Ansible Collections & Rollen

<a id="if-using-python3-in-user-context"></a>

#### Bei Verwendung von Python3 im Benutzerkontext

```ini
[Service]
# to auto-upgrade ansible collections and roles at service startup
ExecStartPre=/bin/bash -c 'ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml'
ExecStartPre=/bin/bash -c 'ansible-galaxy role install --force -r /home/semaphore/requirements.yml'
```

<a id="if-using-python3-in-virtualenv"></a>

#### Bei Verwendung von Python3 im virtualenv

```ini
# to auto-upgrade ansible collections and roles at service startup
ExecStartPre=/bin/bash -c 'source /home/semaphore/venv/bin/activate \
                           && ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml \
                           && ansible-galaxy role install --force -r /home/semaphore/requirements.yml'
```

----

<a id="other-use-cases"></a>

### Weitere Anwendungsfälle

<a id="using-local-mariadb"></a>

#### Verwendung einer lokalen MariaDB

```ini
[Unit]
Requires=mariadb.service
```

<a id="using-local-nginx"></a>

#### Verwendung eines lokalen Nginx

```ini
[Unit]
Wants=nginx.service
```

<a id="sending-logs-to-syslog"></a>

#### Logs an syslog senden

```ini
[Service]
StandardOutput=journal
StandardError=journal
SyslogIdentifier=semaphore
```

<a id="full-examples"></a>

### Vollständige Beispiele

<a id="python-modules-in-user-context"></a>

#### Python-Module im Benutzerkontext

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

#### Python-Module im virtualenv

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

### Korrekturen

Wenn Sie eine benutzerdefinierte Systemsprache eingestellt haben, kann es zu Problemen kommen, die sich durch Anpassen der zugehörigen Umgebungsvariablen beheben lassen:

```ini
[Service]
Environment=LANG="en_US.UTF-8"
Environment=LC_ALL="en_US.UTF-8"
```

----

<a id="troubleshooting-2"></a>

## Fehlerbehebung

Wenn bei der Ausführung eines Tasks ein Problem auftritt, kann es sich um ein Umgebungsproblem Ihrer Einrichtung handeln – nicht um ein Problem mit Semaphore selbst!

Bitte gehen Sie diese Schritte durch, um zu prüfen, ob das Problem auch außerhalb von Semaphore auftritt:

- Wechseln Sie in den Kontext des Benutzers:

  ```bash
  sudo su --login semaphore
  ```

- Wechseln Sie in den Kontext des virtualenv, falls Sie eines verwenden:

  ```ini
  source /home/semaphore/venv/bin/activate
  # verify we are using python3 from inside the venv
  which python3
  > /home/semaphore/venv/bin/python3

  # troubleshooting

  deactivate
  ```

- Führen Sie das Ansible-Playbook manuell aus

  - Wenn es **fehlschlägt** => liegt ein Problem mit Ihrer Umgebung vor
  - Wenn es **funktioniert**:
    - Überprüfen Sie Ihre Konfiguration in Semaphore erneut
    - Es könnte ein Problem mit Semaphore sein
