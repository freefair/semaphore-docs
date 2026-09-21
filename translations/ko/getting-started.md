# 시작하기

이 페이지는 새로 설치한 상태에서 첫 번째 작업을 성공적으로 실행할 때까지의 과정을 안내합니다. 각 단계는 자세한 내용이 담긴 페이지로 연결됩니다.

<a id="from-zero-to-first-task"></a>

## 처음부터 첫 작업까지

1. 원하는 방법으로 **Semaphore를 설치합니다**: [설치](../../docs/admin-guide/installation.md).
2. 설치 중에 생성한 관리자 사용자로, 또는 Docker의 `SEMAPHORE_ADMIN_*` 변수를 통해 **로그인합니다**.
3. **프로젝트를 생성합니다.** 프로젝트는 팀, 인프라 또는 애플리케이션을 서로 분리합니다: [프로젝트](../../docs/user-guide/projects.md).
4. **자동화에 필요한 항목을 연결합니다:**
   - 플레이북, 모듈 또는 스크립트가 있는 소스 코드: [리포지토리](../../docs/user-guide/repositories.md).
   - SSH 키, 토큰, 비밀번호: [키 저장소](../../docs/user-guide/key-store.md).
   - 대상 호스트 및 연결 설정: [인벤토리](../../docs/user-guide/inventory.md).
   - 재사용 가능한 변수: [변수 그룹](../../docs/user-guide/environment.md).
5. **작업 템플릿을 생성하고 실행합니다.** 사용하는 도구에 맞는 가이드를 선택하십시오: [Ansible](../../docs/user-guide/apps/ansible.md), [Terraform/OpenTofu](../../docs/user-guide/apps/terraform/README.md), [셸](../../docs/user-guide/apps/bash.md), [PowerShell](../../docs/user-guide/apps/powershell.md) 또는 [Python](../../docs/user-guide/apps/python.md). 그리고 실행하여 진행 상황을 확인하십시오: [작업](../../docs/user-guide/tasks.md).
6. **자동화하고 운영에 적용합니다:**
   - 일정에 따라 실행: [스케줄](../../docs/user-guide/schedules.md).
   - 누가 무엇을 할 수 있는지 제어: [팀 및 사용자 지정 역할](../../docs/user-guide/team.md).
   - 결과에 대한 알림 받기: [알림](../../docs/admin-guide/notifications.md).

<a id="key-concepts"></a>

## 핵심 개념

다음 용어는 UI 전반에 걸쳐 등장합니다.

| 용어 | 의미 |
|------|---------|
| **프로젝트** | 분리의 기본 단위입니다. 각 프로젝트는 고유한 리포지토리, 키, 인벤토리, 템플릿, 팀을 가집니다. [프로젝트](../../docs/user-guide/projects.md) |
| **리포지토리** | 플레이북, 모듈 또는 스크립트가 있는 Git 리포지토리 또는 로컬 경로입니다. [리포지토리](../../docs/user-guide/repositories.md) |
| **인벤토리** | Ansible 방식 실행을 위한 호스트, 그룹, 연결 설정입니다. [인벤토리](../../docs/user-guide/inventory.md) |
| **변수 그룹** | 재사용 가능한 변수와 환경 설정으로, Environment라고도 합니다. [변수 그룹](../../docs/user-guide/environment.md) |
| **키 저장소** | SSH 키, 토큰, 비밀번호와 같은 암호화된 자격 증명입니다. [키 저장소](../../docs/user-guide/key-store.md) |
| **작업 템플릿** | 실행에 대한 정의입니다: 앱, 리포지토리, 인벤토리, 변수, 옵션. [작업 템플릿](../../docs/user-guide/task-templates/README.md) |
| **작업** | 템플릿의 단일 실행으로, 로그와 상태를 가집니다. [작업](../../docs/user-guide/tasks.md) |
| **워크플로** | 분기, 승인, 지연을 포함하는 템플릿 그래프입니다. Pro 기능입니다. [워크플로](../../docs/user-guide/workflows.md) |
| **러너** | 작업이 실행되는 위치입니다: 서버 자체 또는 원격 러너. [러너](../../docs/admin-guide/runners.md) |

<a id="next-steps"></a>

## 다음 단계

- [리버스 프록시](../../docs/admin-guide/reverse-proxy/README.md)를 사용해 Semaphore를 TLS 뒤에 배치하십시오.
- ID 공급자를 연결하십시오: [LDAP](../../docs/admin-guide/authentication/ldap.md) 또는 [OpenID Connect](../../docs/admin-guide/authentication/openid.md).
- [API](../../docs/reference/api.md)와 [CLI](../../docs/reference/cli/README.md)를 사용해 CI나 스크립트에서 Semaphore를 제어하십시오.
