# Menadžer paketa

> **Tip**
>
>   Pogledajte [ručnu instalaciju](../installation_manually.md) da biste saznali kako da podesite Python/Ansible/Systemd okruženje!

Preuzmite paket sa [stranice sa izdanjima](https://github.com/semaphoreui/semaphore/releases).

&#x20;`*.deb` za Debian i Ubuntu, `*.rpm` za CentOS i RedHat.&#x20;

Evo nekoliko komandi za instalaciju, u zavisnosti od menadžera paketa:

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

Podesite Semaphore sledećom komandom:

```
semaphore setup
```

Sada možete pokrenuti Semaphore:

```
semaphore server --config=./config.json
```

Semaphore će biti dostupan na ovoj adresi: [https://localhost:3000](https://localhost:3000).

----
