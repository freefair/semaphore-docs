# Gestore di pacchetti

> **Tip**
>
>   Consultare l'[installazione manuale](../installation_manually.md) per sapere come configurare l'ambiente Python/Ansible/Systemd!

Scaricare il file del pacchetto dalla [pagina delle release](https://github.com/semaphoreui/semaphore/releases).

&#x20;`*.deb` per Debian e Ubuntu, `*.rpm` per CentOS e RedHat.&#x20;

Di seguito alcuni comandi di installazione, a seconda del gestore di pacchetti:

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

Configurare Semaphore con il seguente comando:

```
semaphore setup
```

Ora è possibile eseguire Semaphore:

```
semaphore server --config=./config.json
```

Semaphore sarà disponibile a questo URL [https://localhost:3000](https://localhost:3000).

----
