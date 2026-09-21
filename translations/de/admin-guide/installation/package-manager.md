# Paketmanager

> **Tip**
>
>   Sehen Sie sich die [manuelle Installation](../installation_manually.md) an, um zu erfahren, wie Sie Ihre Python-/Ansible-/Systemd-Umgebung einrichten!

Laden Sie die Paketdatei von der [Releases-Seite](https://github.com/semaphoreui/semaphore/releases) herunter.

&#x20;`*.deb` für Debian und Ubuntu, `*.rpm` für CentOS und RedHat.&#x20;

Hier sind einige Installationsbefehle, abhängig vom Paketmanager:

### Debian / Ubuntu (x64)

```bash
wget https://github.com/semaphoreui/semaphore/releases/\
download/v2.17.15/semaphore_2.17.15_linux_amd64.deb

sudo dpkg -i semaphore_2.17.15_linux_amd64.deb
```

### Debian / Ubuntu (ARM64)

```bash
wget https://github.com/semaphoreui/semaphore/releases/\
download/v2.17.15/semaphore_2.17.15_linux_arm64.deb

sudo dpkg -i semaphore_2.17.15_linux_arm64.deb
```

### CentOS (x64)

```bash
wget https://github.com/semaphoreui/semaphore/releases/\
download/v2.17.15/semaphore_2.17.15_linux_amd64.rpm

sudo yum install semaphore_2.17.15_linux_amd64.rpm
```

### CentOS (ARM64)

```bash
wget https://github.com/semaphoreui/semaphore/releases/\
download/v2.17.15/semaphore_2.17.15_linux_arm64.rpm

sudo yum install semaphore_2.17.15_linux_arm64.rpm
```

Richten Sie Semaphore mit dem folgenden Befehl ein:

```
semaphore setup
```

Jetzt können Sie Semaphore starten:

```
semaphore server --config=./config.json
```

Semaphore ist über diese URL erreichbar: [https://localhost:3000](https://localhost:3000).

----
