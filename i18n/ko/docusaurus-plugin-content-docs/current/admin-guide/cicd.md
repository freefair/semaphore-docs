# Pipeline

Semaphore는 `build` 및 `deploy` 작업을 사용하는 간단한 pipeline을 지원합니다. 

Semaphore는 실행하는 각 Ansible playbook에 `semaphore_vars` 변수를 전달합니다.

Ansible 작업에서 이 변수를 사용하여 어떤 유형의 작업이 실행되었는지, 어떤 버전을 빌드하거나 배포해야 하는지, 누가 작업을 실행했는지 등을 확인할 수 있습니다.

---

`build` 작업의 `semaphore_vars` 예시:

```yaml
semaphore_vars:
    task_details:
        type: build
        username: user123
        message: New version of some feature
        target_version: 1.5.33
```

`deploy` 작업의 `semaphore_vars` 예시:

```yaml
semaphore_vars:
    task_details:
        type: deploy
        username: user123
        message: Deploy new feature to servers
        incoming_version: 1.5.33
```

**Bash**, **PowerShell**, **Python** 템플릿의 경우 Semaphore는 동일한 `task_details` 값을 환경 변수로 제공합니다.

| `task_details` 필드 | 환경 변수 | 비고 |
| --- | --- | --- |
| `type` | `SEMAPHORE_TASK_DETAILS_TYPE` | `build` 또는 `deploy` |
| `username` | `SEMAPHORE_TASK_DETAILS_USERNAME` | 작업을 시작한 사용자 |
| `message` | `SEMAPHORE_TASK_DETAILS_MESSAGE` | 작업 메시지 |
| `target_version` | `SEMAPHORE_TASK_DETAILS_TARGET_VERSION` | `build` 작업에서 제공됨 |
| `incoming_version` | `SEMAPHORE_TASK_DETAILS_INCOMING_VERSION` | `deploy` 작업에서 제공됨 |

Bash 예시:

```bash
echo "$SEMAPHORE_TASK_DETAILS_TYPE"
echo "$SEMAPHORE_TASK_DETAILS_TARGET_VERSION"
```

PowerShell 예시:

```powershell
$env:SEMAPHORE_TASK_DETAILS_TYPE
$env:SEMAPHORE_TASK_DETAILS_INCOMING_VERSION
```

Python 예시:

```python
import os

task_type = os.getenv("SEMAPHORE_TASK_DETAILS_TYPE")
target_version = os.getenv("SEMAPHORE_TASK_DETAILS_TARGET_VERSION")
incoming_version = os.getenv("SEMAPHORE_TASK_DETAILS_INCOMING_VERSION")
```

### Build {#build}

이 유형의 작업은 [아티팩트](https://en.wikipedia.org/wiki/Artifact\_\(software\_development\))를 생성하는 데 사용됩니다. 각 build 작업에는 자동 생성된 버전이 있습니다. Ansible playbook에서 `semaphore_vars.task_details.target_version` 변수를 사용하여 어떤 버전의 아티팩트를 생성해야 하는지 확인해야 합니다. 아티팩트가 생성되면 배포에 사용할 수 있습니다.

---

`build` Ansible 역할 예시:

1. GitHub에서 앱 소스 코드 가져오기
2. 소스 코드 컴파일
3. 생성된 바이너리를 `app-{{semaphore_vars.task_details.target_version}}.tar.gz`라는 이름의 tarball로 묶기
4. `app-{{semaphore_vars.task_details.target_version}}.tar.gz`를 S3 버킷으로 전송



### Deploy {#deploy}

이 유형의 작업은 아티팩트를 대상 서버에 배포하는 데 사용됩니다. 각 배포 작업은 build 작업과 연결됩니다. Ansible playbook에서 `semaphore_vars.task_details.incoming_version` 변수를 사용하여 어떤 버전의 아티팩트를 배포해야 하는지 확인해야 합니다.

---

`deploy` Ansible 역할 예시:

1. S3 버킷에서 `app-{{semaphore_vars.task_details.incoming_version}}.tar.gz`를 대상 서버로 다운로드
2. `app-{{semaphore_vars.task_details.incoming_version}}.tar.gz`를 대상 디렉터리에 압축 해제
3. 구성 파일 생성 또는 업데이트
4. 앱 서비스 재시작

