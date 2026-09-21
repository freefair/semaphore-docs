# File binario

> **Tip**
>
> Consultare l'[installazione manuale](../installation_manually.md) per sapere come configurare l'ambiente Python/Ansible/Systemd!

Scaricare il file `*.tar.gz` per la propria piattaforma dalla [pagina delle release](https://github.com/semaphoreui/semaphore/releases). Estrarlo e configurare Semaphore con i seguenti comandi:

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

Ora è possibile eseguire Semaphore:

```bash
./semaphore server --config=./config.json
```

Semaphore sarà disponibile al seguente URL [https://localhost:3000](https://localhost:3000).

----

<a id="run-as-a-service"></a>

### Esecuzione come servizio

Per informazioni più dettagliate &mdash; consultare la [documentazione estesa sul servizio Systemd](../installation_manually.md#extended-systemd-service).

Se Semaphore è stato installato tramite un gestore di pacchetti o scaricando un file binario, è necessario creare manualmente il servizio Semaphore.

Creare il file del servizio systemd:

  Sostituire <code>/path/to/semaphore</code> e <code>/path/to/config.json</code> con i percorsi del binario di Semaphore e del file di configurazione.

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

Avviare il servizio Semaphore:

```bash
sudo systemctl daemon-reload
sudo systemctl start semaphore
```

Verificare lo stato del servizio Semaphore:

```bash
sudo systemctl status semaphore
```

Per abilitare l'avvio automatico del servizio Semaphore:

```bash
sudo systemctl enable semaphore
```
