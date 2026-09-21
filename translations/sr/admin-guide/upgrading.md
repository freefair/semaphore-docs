# Nadogradnja

<a id="package-manager"></a>

### Menadžer paketa

Preuzmite datoteku paketa sa [stranice sa izdanjima](https://github.com/semaphoreui/semaphore/releases).

&#x20;`*.deb` za Debian i Ubuntu, `*.rpm` za CentOS i RedHat.&#x20;

Instalirajte je pomoću menadžera paketa.

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

### Binarna datoteka

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
