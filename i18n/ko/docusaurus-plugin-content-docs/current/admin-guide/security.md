# 🔐 보안

## 소개 {#introduction}

보안은 Semaphore UI의 최우선 과제입니다. 핵심 인프라 작업을 자동화하든 민감한 시스템에 대한 팀 접근을 관리하든, Semaphore UI는 별도 설정 없이도 견고하고 안전하게 운영되도록 설계되었습니다. 이 섹션에서는 Semaphore가 보안을 어떻게 처리하는지, 그리고 프로덕션 환경에 배포할 때 무엇을 고려해야 하는지 설명합니다.

## 인증 및 권한 부여 {#authentication--authorization}

Semaphore는 안전한 인증과 유연한 권한 부여 메커니즘을 지원합니다:

- **로그인 방식:**
  - **사용자 이름/비밀번호**<br />Semaphore 데이터베이스에 저장된 자격 증명을 사용하는 기본 방식입니다. 비밀번호는 강력한 알고리즘(bcrypt)으로 해시됩니다.

  - **LDAP**<br />엔터프라이즈 디렉터리 서비스와의 통합을 지원합니다. 사용자/그룹 필터링과 LDAPS를 통한 보안 연결을 지원합니다.

  - **OpenID Connect (OIDC)**<br />Google, Azure AD, Keycloak 등의 ID 공급자를 통한 싱글 사인온을 지원합니다. 사용자 정의 클레임과 그룹 매핑을 지원합니다.

- **2단계 인증(2FA)**<br />TOTP 기반 2FA를 사용할 수 있으며 모든 사용자에게 권장됩니다. 사용자별로 활성화할 수 있고 선택적으로 복구 코드를 지원합니다. 구성 옵션 `auth.totp.enabled` 및 `auth.totp.allow_recovery`를 참조하십시오.

- **역할 기반 접근 제어**<br />사용자에게 Admin, Maintainer, Viewer 등 서로 다른 역할을 할당하여 책임에 따라 접근을 제한할 수 있습니다.

- **세션 관리**<br />세션은 보안 HTTP 쿠키로 보호됩니다. 세션 만료 및 로그아웃 메커니즘으로 노출을 최소화합니다.
<!-- - **Brute-Force Protection**: Login attempts are rate-limited to prevent brute-force attacks. -->

## 비밀 정보 및 자격 증명 {#secrets--credentials}

비밀 정보를 안전하게 관리하는 것은 핵심 기능입니다:

- **암호화된 키 저장소**<br />자격 증명과 비밀 변수는 AES 암호화를 사용하여 저장 시 암호화됩니다.

- **환경 격리**<br />비밀 정보는 실행 시점에만 작업에 전달되며 컨테이너 환경에 직접 노출되지 않습니다.

- **SSH 키 및 token**<br />유효한 SSH 키와 token을 업로드하는 것은 사용자의 책임입니다. 이들은 암호화되어 작업 실행 시에만 사용됩니다.
- **HashiCorp Vault 통합(Pro)**<br />비밀 정보를 외부 Vault 인스턴스에 저장할 수 있습니다. 비밀 정보를 생성하거나 편집할 때 비밀 정보별로 저장소를 선택할 수 있습니다.

## 데이터 암호화 {#data-encryption}

민감한 데이터는 데이터베이스에 암호화된 형태로 저장됩니다. Access Key 암호화를 활성화하려면 구성 파일에서 구성 옵션 `access_key_encryption`을 설정해야 합니다. 이 값은 다음 명령으로 생성해야 합니다:

```bash
head -c32 /dev/urandom | base64
```

## 신뢰할 수 없는 코드 / playbook 실행 {#running-untrusted-code--playbooks}

Semaphore는 사용자가 정의한 playbook과 명령을 실행하므로 위험이 따를 수 있습니다:

- **컨테이너 격리**<br />작업은 격리된 Docker 컨테이너에서 실행됩니다. 이 컨테이너는 호스트 시스템에 접근할 수 없습니다.

- **최소 권한**<br />컨테이너는 최소한의 권한으로 실행되며 Docker 플래그를 사용하여 추가로 제한할 수 있습니다.

- **chroot 실행**<br />Semaphore는 실행 환경을 호스트 시스템으로부터 더욱 격리하기 위해 chroot jail 내부에서 작업을 실행할 수 있습니다.

- **작업 프로세스 사용자**<br />잠재적인 익스플로잇의 영향을 줄이기 위해 작업을 전용 비루트 시스템 사용자(예: `semaphore`)로 실행할 수 있습니다. 이는 선택 사항이며 시스템 정책에 따라 구성할 수 있습니다.
<!-- - **Resource Limits**: To prevent abuse, CPU and memory limits can be applied. -->

## 안전한 배포 {#secure-deployment}

Semaphore를 안전하게 배포하려면:

- **HTTPS 사용**<br />
    Semaphore는 **내장 TLS 지원**과 **Nginx 같은 리버스 프록시**를 통한 HTTPS를 모두 지원합니다. 프로덕션 환경에서는 HTTPS를 활성화할 것을 강력히 권장합니다.

    내장 HTTPS 지원을 활성화하려면 **config.json**에 다음 블록을 추가하십시오:
    ```json
    {
        ...
        "tls": {
            "enabled": true,
            "cert_file": "/path/to/cert/example.com.cert",
            "key_file": "/path/to/key/example.com.key"
        }
        ...
    }
    ```

- **방화벽 뒤에서 실행**<br />Semaphore UI와 데이터베이스에 대한 접근을 신뢰할 수 있는 IP로만 제한하십시오.

- **데이터베이스 보안**<br />강력한 비밀번호를 사용하고 데이터베이스 접근을 Semaphore로만 제한하십시오.

## 업데이트 및 패치 관리 {#updates--patch-management}

보안 업데이트는 정기적으로 게시됩니다:

- **최신 상태 유지**<br />항상 최신 안정 릴리스를 사용하십시오.

- **변경 로그**<br />업데이트 전에 GitHub에서 변경 사항을 검토하십시오.

- **자동 업데이트**<br />Docker를 사용하는 경우 정기 업데이트를 위한 자동화 pipeline을 고려하십시오.

<!-- ## Audit Logs & Monitoring

Semaphore provides basic audit logging:

- **User Activity**: Logins, failed attempts, and task executions are logged.
- **Configuration Changes**: Changes to settings, projects, and credentials are logged with timestamps.
- **Integration**: Logs can be forwarded to centralized logging systems like ELK or Prometheus exporters. -->

<!-- ## Backups & Disaster Recovery

To protect against data loss:

- **What to Back Up**: Semaphore database, configuration file, and secret storage.
- **How to Restore**: Follow the backup/restore guide in the admin docs.
- **Testing**: Periodically test restoring backups in a staging environment. -->

<!-- ## Common Vulnerabilities & Hardening Tips

- **Disable User Registration** if not needed to prevent unauthorized access.
- **Use Strong Passwords** and enforce complexity rules.
- **Limit Task Concurrency** to avoid resource exhaustion.
- **Restrict Access to Secrets** by managing team permissions carefully. -->

<!-- ## Compliance & Data Privacy

Semaphore collects minimal user data:

- **Data Handling**: Emails, IP logs, and session data are stored securely.
- **User Deletion**: Admins can delete user accounts and associated data upon request.
- **GDPR Compliance**: Self-hosted users are responsible for local compliance. -->

## 취약점 신고 {#reporting-vulnerabilities}

취약점을 발견하셨습니까? Semaphore를 안전하게 유지하는 데 도움을 주십시오:

- **책임 있는 공개**<br />`security@semaphoreui.com`으로 이메일을 보내 주십시오.
 
### 취약점 해결 목표 {#vulnerability-resolution-targets}

신고된 취약점은 다음 목표 기간 내에 해결하는 것을 목표로 합니다:

- Critical: 30일 이내
- High: 60일 이내
- Medium: 90일 이내
- Low: 최선의 노력, 일반적으로 180일 이내

최신 안정 릴리스에 영향을 미치는 실제 악용 중인 문제에 대해서는 정규 주기 외의 패치가 릴리스될 수 있습니다.

### 코드 보안 도구 {#code-security-tooling}

코드베이스와 의존성을 분석하고 의존성 업데이트를 자동화하기 위해 CodeQL, Codacy, Snyk, Renovate를 사용합니다.
- **공개 익스플로잇 금지**<br />패치되기 전까지 취약점을 공개적으로 공유하지 마십시오.

- **감사의 표시**<br />원하시는 경우 보안 연구자의 이름을 릴리스 노트에 기재할 수 있습니다.

