# 작업 템플릿

템플릿은 Semaphore 작업을 실행하는 방법을 정의합니다. 현재 다음 작업 유형이 지원됩니다:

* [Ansible](/user-guide/apps/ansible)
* [Terraform/OpenTofu](/user-guide/apps/terraform)
* [Shell](/user-guide/apps/bash)
* [Powershell](/user-guide/apps/powershell)
* [Python](/user-guide/apps/python)

---

## 병렬 작업 {#parallel-tasks}

기본적으로 같은 템플릿의 작업은 순차적으로 실행됩니다. 같은 템플릿의 동시 실행을 허용하려면 템플릿 설정에서 "Allow parallel tasks" 옵션을 활성화하십시오.

## 실행기 이미지 (Docker 및 Kubernetes runner) {#executor-image-docker-and-kubernetes-runners}

프로젝트 runner가 **Docker**(Pro) 또는 **Kubernetes**(Enterprise) 실행기를 사용하는 경우, 각 작업은 일반적으로 runner에 설정된 기본 job 이미지(예: `semaphoreui/job:latest`)에서 실행됩니다. 이 이미지는 템플릿별로 재정의할 수 있습니다.

1. 템플릿 설정을 엽니다
2. **실행기 이미지**를 컨테이너 이미지 참조(예: `my-registry/ansible:2.16` 또는 `semaphoreui/job:latest`)로 설정합니다
3. 템플릿을 저장합니다

**동작**:
- **Docker** 및 **Kubernetes** runner 실행기만 이 필드를 반영하며, 로컬 실행기는 무시합니다
- 필드를 비워 두면 `runner.executor.docker.image` 또는 `runner.executor.k8s.image`에 설정된 runner의 기본 이미지가 사용됩니다
- UI에서 필드를 지우면 재정의가 제거됩니다

**활용 사례**:
- 다른 툴체인이 필요한 템플릿(이전 버전의 Ansible, 특정 Terraform 버전, 사용자 정의 이미지에 포함된 추가 OS 패키지)
- runner 전체의 기본값을 변경하지 않고 보안에 민감한 템플릿을 위한 격리된 이미지 사용

기본 이미지 설정은 [Runner 설정](/admin-guide/configuration)을, 실행기 설정은 [프로젝트 runner](/user-guide/projects/runners)를 참고하십시오.
