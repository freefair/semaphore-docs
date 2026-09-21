# Fichier binaire

> **Tip**
>
> Consultez l'[installation manuelle](../installation_manually.md) pour savoir comment configurer votre environnement Python/Ansible/Systemd !

Téléchargez l'archive `*.tar.gz` correspondant à votre plateforme depuis la [page des versions](https://github.com/semaphoreui/semaphore/releases). Décompressez-la et configurez Semaphore à l'aide des commandes suivantes :

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

Vous pouvez maintenant lancer Semaphore :

```bash
./semaphore server --config=./config.json
```

Semaphore sera accessible à l'URL suivante [https://localhost:3000](https://localhost:3000).

----

<a id="run-as-a-service"></a>

### Exécuter en tant que service

Pour des informations plus détaillées &mdash; consultez la [documentation étendue du service Systemd](../installation_manually.md#extended-systemd-service).

Si vous avez installé Semaphore via un gestionnaire de paquets ou en téléchargeant un fichier binaire, vous devez créer le service Semaphore manuellement.

Créez le fichier de service systemd :

  Remplacez <code>/path/to/semaphore</code> et <code>/path/to/config.json</code> par les chemins de votre binaire Semaphore et de votre fichier de configuration.

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

Démarrez le service Semaphore :

```bash
sudo systemctl daemon-reload
sudo systemctl start semaphore
```

Vérifiez l'état du service Semaphore :

```bash
sudo systemctl status semaphore
```

Pour que le service Semaphore démarre automatiquement :

```bash
sudo systemctl enable semaphore
```
