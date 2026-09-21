# Менеджер пакетов

> **Tip**
>
>   Ознакомьтесь с [ручной установкой](../installation_manually.md), чтобы узнать, как настроить окружение Python/Ansible/Systemd!

Скачайте файл пакета со [страницы релизов](https://github.com/semaphoreui/semaphore/releases).

&#x20;`*.deb` для Debian и Ubuntu, `*.rpm` для CentOS и RedHat.&#x20;

Ниже приведены команды установки для разных менеджеров пакетов:

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

Настройте Semaphore с помощью следующей команды:

```
semaphore setup
```

Теперь можно запустить Semaphore:

```
semaphore server --config=./config.json
```

Semaphore будет доступен по этому URL: [https://localhost:3000](https://localhost:3000).

----
