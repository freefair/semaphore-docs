# Arquivo binário

> **Tip**
>
> Consulte a [instalação manual](../installation_manually.md) para saber como configurar seu ambiente Python/Ansible/Systemd!

Baixe o `*.tar.gz` para a sua plataforma na [página de Releases](https://github.com/semaphoreui/semaphore/releases). Descompacte-o e configure o Semaphore usando os seguintes comandos:

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

Agora você pode executar o Semaphore:

```bash
./semaphore server --config=./config.json
```

O Semaphore estará disponível na seguinte URL: [https://localhost:3000](https://localhost:3000).

----

<a id="run-as-a-service"></a>

### Executar como serviço

Para informações mais detalhadas &mdash; consulte a [documentação estendida do serviço Systemd](../installation_manually.md#extended-systemd-service).

Se você instalou o Semaphore por meio de um gerenciador de pacotes ou baixando um arquivo binário, deverá criar o serviço do Semaphore manualmente.

Crie o arquivo de serviço do systemd:

  Substitua <code>/path/to/semaphore</code> e <code>/path/to/config.json</code> pelos caminhos do seu binário do Semaphore e do arquivo de configuração.

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

Inicie o serviço do Semaphore:

```bash
sudo systemctl daemon-reload
sudo systemctl start semaphore
```

Verifique o status do serviço do Semaphore:

```bash
sudo systemctl status semaphore
```

Para que o serviço do Semaphore inicie automaticamente:

```bash
sudo systemctl enable semaphore
```
