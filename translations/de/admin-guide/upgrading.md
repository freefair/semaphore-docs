# Aktualisieren

<a id="package-manager"></a>

### Paketmanager

Laden Sie eine Paketdatei von der [Releases-Seite](https://github.com/semaphoreui/semaphore/releases) herunter.

&#x20;`*.deb` für Debian und Ubuntu, `*.rpm` für CentOS und RedHat.&#x20;

Installieren Sie sie mit dem Paketmanager.

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

### Binärdatei

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
