# Бинарный файл

> **Tip**
>
> Ознакомьтесь с [ручной установкой](../installation_manually.md), чтобы узнать, как настроить окружение Python/Ansible/Systemd!

Скачайте архив `*.tar.gz` для вашей платформы со [страницы релизов](https://github.com/semaphoreui/semaphore/releases). Распакуйте его и настройте Semaphore с помощью следующих команд:

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

Теперь можно запустить Semaphore:

```bash
./semaphore server --config=./config.json
```

Semaphore будет доступен по следующему URL: [https://localhost:3000](https://localhost:3000).

----

<a id="run-as-a-service"></a>

### Запуск в качестве службы

Более подробную информацию см. в [расширенной документации по службе Systemd](../installation_manually.md#extended-systemd-service).

Если вы установили Semaphore через менеджер пакетов или скачав бинарный файл, службу Semaphore нужно создать вручную.

Создайте файл службы systemd:

  Замените <code>/path/to/semaphore</code> и <code>/path/to/config.json</code> на пути к вашему файлу semaphore и файлу конфигурации.

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

Запустите службу Semaphore:

```bash
sudo systemctl daemon-reload
sudo systemctl start semaphore
```

Проверьте состояние службы Semaphore:

```bash
sudo systemctl status semaphore
```

Чтобы служба Semaphore запускалась автоматически:

```bash
sudo systemctl enable semaphore
```
