# 키 저장소

Semaphore의 키 저장소는 원격 저장소 접근, 원격 호스트 접근, sudo 자격 증명, Ansible vault 비밀번호를 위한 자격 증명을 저장하는 데 사용됩니다.

## 유형 {#types}

### 1. SSH {#1-ssh}
SSH 키는 원격 서버와 원격 저장소에 접근하는 데 사용됩니다.

키를 빠르게 생성하고 호스트에 배치하는 데 도움이 필요하다면 [이 간단한 가이드](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-20-04)를 참조하십시오.

SSH 인증을 사용하는 Git 저장소의 경우, 복제하려는 Git 저장소에 개인 키와 연결된 공개 키가 등록되어 있어야 합니다.

다음은 일반적인 Git 저장소 서비스의 문서 링크입니다:
* [GitHub](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
* [GitLab](https://docs.gitlab.com/ee/user/ssh.html)
* [Bitbucket](https://support.atlassian.com/bitbucket-cloud/docs/set-up-an-ssh-key/)

### 2. 비밀번호 로그인 {#2-login-with-password}
비밀번호 로그인은 사용자 이름과 비밀번호/액세스 token의 조합으로, 다음 용도로 사용할 수 있습니다:
* 원격 호스트 인증(SSH 키를 사용하는 것보다 보안성이 낮음)
* 원격 호스트의 sudo 자격 증명
* HTTPS를 통한 원격 Git 저장소 인증(SSH가 더 안전함)
* Ansible vault 잠금 해제

:::tip
    이 유형의 시크릿은 개인 액세스 토큰(PAT)이나 시크릿 문자열로 사용할 수 있습니다. 로그인 필드를 비워 두기만 하면 됩니다.
:::

### 3. 없음 {#3-none}
GitLab의 오픈 소스 저장소처럼 인증이 필요하지 않은 저장소를 위한 자리 표시자로 사용됩니다.


## 시크릿 스토리지 {#secret-storages}

Semaphore UI는 시크릿을 위한 다양한 스토리지를 지원합니다. 시크릿을 생성하거나 편집할 때 시크릿별로 스토리지를 선택할 수 있습니다.

### 데이터베이스 {#database}

시크릿은 기본적으로 암호화된 형태로 데이터베이스에 저장됩니다. 암호화 키는 구성 옵션
`access_key_encryption` 또는 `SEMAPHORE_ACCESS_KEY_ENCRYPTION`을 통해 구성합니다(`head -c32 /dev/urandom | base64`를 사용하여 생성해야 합니다).

### 환경 변수 또는 파일 {#environment-variable-or-file}

키는 Semaphore 서버의 환경 변수 또는 서버에 있는 파일(예: 컨테이너에 마운트된 SSH 키)에서
값을 읽어올 수 있습니다. 키 양식의 **Env** 및 **File** 탭에서 이 모드를 선택합니다.

파일은 구성된 시크릿 디렉터리(`dirs.secrets` / `SEMAPHORE_SECRETS_PATH`, 기본값 `/tmp/semaphore`) 내부에 있어야 하며,
SSH 및 비밀번호 로그인 키는 작은 JSON 문서로 감싸야 합니다.

[자세히 알아보기...](/user-guide/key-store/env-and-file-sources)

### HashiCorp Vault {#hashicorp-vault}

시크릿을 데이터베이스 대신 외부 HashiCorp Vault 인스턴스에 저장할 수 있습니다.

[자세히 알아보기...](/user-guide/key-store/hashicorp-vault)

### OpenBao {#openbao}

시크릿을 외부 [OpenBao](https://openbao.org) 인스턴스(HashiCorp Vault의 오픈 소스, API 호환 포크)에 저장할 수 있습니다.

[자세히 알아보기...](/user-guide/key-store/openbao)

### AWS Secrets Manager {#aws-secrets-manager}

![Static Badge](https://img.shields.io/badge/enterprise-yellow)

시크릿을 AWS Secrets Manager에 저장할 수 있습니다. IAM 역할/인스턴스 프로파일 또는 정적 액세스 키로 인증합니다.

[자세히 알아보기...](/user-guide/key-store/aws-secrets-manager)

### Devolutions Server {#devolutions-server}

시크릿을 데이터베이스 대신 외부 Devolutions Server 인스턴스에 저장할 수 있습니다.

[자세히 알아보기...](/user-guide/key-store/devolutions-server)

## 원격 스토리지에서 시크릿 동기화 {#syncing-secrets-from-remote-storages}

Semaphore는 외부 시크릿 관리자(HashiCorp Vault, OpenBao, AWS Secrets Manager, Azure Key Vault 또는 Devolutions Server)에서 시크릿을 자동으로 가져와 동기화 상태를 유지할 수 있습니다. 동기화 경로를 통해 가져올 시크릿과 이름 지정 방식을 선택할 수 있습니다.

[자세히 알아보기...](/user-guide/key-store/secret-sync)
