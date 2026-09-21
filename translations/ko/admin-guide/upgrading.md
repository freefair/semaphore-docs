# 업그레이드

<a id="package-manager"></a>

### 패키지 관리자

[릴리스 페이지](https://github.com/semaphoreui/semaphore/releases)에서 패키지 파일을 다운로드합니다.

&#x20;Debian 및 Ubuntu용은 `*.deb`, CentOS 및 RedHat용은 `*.rpm`입니다.&#x20;

패키지 관리자를 사용하여 설치합니다.

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

### 바이너리

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
