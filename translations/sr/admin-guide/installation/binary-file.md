# Binarni fajl

> **Tip**
>
> Pogledajte [ručnu instalaciju](../installation_manually.md) da biste saznali kako da podesite Python/Ansible/Systemd okruženje!

Preuzmite `*.tar.gz` za svoju platformu sa [stranice sa izdanjima](https://github.com/semaphoreui/semaphore/releases). Raspakujte ga i podesite Semaphore pomoću sledećih komandi:

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

Sada možete pokrenuti Semaphore:

```bash
./semaphore server --config=./config.json
```

Semaphore će biti dostupan na sledećoj adresi [https://localhost:3000](https://localhost:3000).

----

<a id="run-as-a-service"></a>

### Pokretanje kao servis

Za detaljnije informacije &mdash; pogledajte [proširenu dokumentaciju za Systemd servis](../installation_manually.md#extended-systemd-service).

Ako ste Semaphore instalirali preko menadžera paketa ili preuzimanjem binarnog fajla, Semaphore servis treba da kreirate ručno.

Kreirajte fajl systemd servisa:

  Zamenite <code>/path/to/semaphore</code> i <code>/path/to/config.json</code> putanjama do vašeg semaphore binarnog fajla i konfiguracionog fajla.

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

Pokrenite Semaphore servis:

```bash
sudo systemctl daemon-reload
sudo systemctl start semaphore
```

Proverite status Semaphore servisa:

```bash
sudo systemctl status semaphore
```

Da bi se Semaphore servis automatski pokretao:

```bash
sudo systemctl enable semaphore
```
