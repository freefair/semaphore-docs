# Mise à niveau

<a id="package-manager"></a>

### Gestionnaire de paquets

Téléchargez un fichier de paquet depuis la [page des versions](https://github.com/semaphoreui/semaphore/releases).

&#x20;`*.deb` pour Debian et Ubuntu, `*.rpm` pour CentOS et RedHat.&#x20;

Installez-le avec le gestionnaire de paquets.

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

<a id="binary"></a>

### Binaire

### Linux (x64)

  ```bash
  wget https://github.com/semaphoreui/semaphore/releases/\
  download/v2.17.15/semaphore_2.17.15_linux_amd64.tar.gz

  tar xf semaphore_2.17.15_linux_amd64.tar.gz
  ```

### Linux (ARM64)

  ```bash
  wget https://github.com/semaphoreui/semaphore/releases/\
  download/v2.17.15/semaphore_2.17.15_linux_arm64.tar.gz

  tar xf semaphore_2.17.15_linux_arm64.tar.gz
  ```

### Windows (x64)

  ```powershell
  Invoke-WebRequest `
  -Uri ("https://github.com/semaphoreui/semaphore/releases/" +
        "download/v2.17.15/semaphore_2.17.15_windows_amd64.zip") `
  -OutFile semaphore.zip

  Expand-Archive -Path semaphore.zip  -DestinationPath ./
  ```
