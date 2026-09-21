# Gestionnaire de paquets

> **Tip**
>
>   Consultez l'[installation manuelle](../installation_manually.md) pour savoir comment configurer votre environnement Python/Ansible/Systemd !

Téléchargez le fichier de paquet depuis la [page des versions](https://github.com/semaphoreui/semaphore/releases).

&#x20;`*.deb` pour Debian et Ubuntu, `*.rpm` pour CentOS et RedHat.&#x20;

Voici plusieurs commandes d'installation, selon le gestionnaire de paquets :

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

Configurez Semaphore à l'aide de la commande suivante :

```
semaphore setup
```

Vous pouvez maintenant lancer Semaphore :

```
semaphore server --config=./config.json
```

Semaphore sera accessible à cette URL [https://localhost:3000](https://localhost:3000).

----
