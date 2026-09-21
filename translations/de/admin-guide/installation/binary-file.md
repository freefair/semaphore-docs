# Binärdatei

> **Tip**
>
> Sehen Sie sich die [manuelle Installation](../installation_manually.md) an, um zu erfahren, wie Sie Ihre Python-/Ansible-/Systemd-Umgebung einrichten!

Laden Sie die `*.tar.gz` für Ihre Plattform von der [Releases-Seite](https://github.com/semaphoreui/semaphore/releases) herunter. Entpacken Sie sie und richten Sie Semaphore mit den folgenden Befehlen ein:

### Linux (x64)

```bash
wget https://github.com/semaphoreui/semaphore/releases/download/v2.17.15/semaphore_2.17.15_linux_amd64.tar.gz

tar xf semaphore_2.17.15_linux_amd64.tar.gz

./semaphore setup
```

### Linux (ARM64)

```
wget https://github.com/semaphoreui/semaphore/releases/download/v2.17.15/semaphore_2.17.15_linux_arm64.tar.gz

tar xf semaphore_2.17.15_linux_arm64.tar.gz

./semaphore setup
```

### Windows (x64)

```powershell
Invoke-WebRequest `
-Uri ("https://github.com/semaphoreui/semaphore/releases/" +
      "download/v2.17.15/semaphore_2.17.15_windows_amd64.zip") `

-OutFile semaphore.zip

Expand-Archive -Path semaphore.zip  -DestinationPath ./

./semaphore setup
```

Jetzt können Sie Semaphore starten:

```bash
./semaphore server --config=./config.json
```

Semaphore ist über die folgende URL erreichbar: [https://localhost:3000](https://localhost:3000).

----

<a id="run-as-a-service"></a>

### Als Dienst ausführen

Ausführlichere Informationen &mdash; siehe die [erweiterte Dokumentation zum Systemd-Dienst](../installation_manually.md#extended-systemd-service).

Wenn Sie Semaphore über einen Paketmanager oder durch Herunterladen einer Binärdatei installiert haben, sollten Sie den Semaphore-Dienst manuell anlegen.

Erstellen Sie die systemd-Dienstdatei:

  Ersetzen Sie <code>/path/to/semaphore</code> und <code>/path/to/config.json</code> durch den Pfad zu Ihrer Semaphore-Binärdatei und Ihrer Konfigurationsdatei.

```bash
sudo cat > /etc/systemd/system/semaphore.service <<EOF
[Unit]
Description=Semaphore Ansible
Documentation=https://github.com/semaphoreui/semaphore
Wants=network-online.target
After=network-online.target

[Service]
Type=simple
ExecReload=/bin/kill -HUP $MAINPID
ExecStart=/path/to/semaphore server --config=/path/to/config.json
SyslogIdentifier=semaphore
Restart=always
RestartSec=10s

[Install]
WantedBy=multi-user.target
EOF
```

Starten Sie den Semaphore-Dienst:

```bash
sudo systemctl daemon-reload
sudo systemctl start semaphore
```

Prüfen Sie den Status des Semaphore-Dienstes:

```bash
sudo systemctl status semaphore
```

So aktivieren Sie den automatischen Start des Semaphore-Dienstes:

```bash
sudo systemctl enable semaphore
```
