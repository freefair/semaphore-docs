# 작업

작업은 Ansible playbook을 실행하는 하나의 인스턴스입니다. [작업 템플릿](task-templates/)에서 원하는 템플릿의 Run/Build/Deploy 버튼을 클릭하여 작업을 생성할 수 있습니다.

![](/assets/image6.png)

**Deploy** 작업 유형에서는 작업과 연결된 빌드 버전을 지정할 수 있습니다. 기본값은 최신 빌드 버전입니다.

![](/assets/task_deploy1.png)

작업이 실행 중이거나 완료되면 작업 상태와 실행 로그를 확인할 수 있습니다.

![](/assets/image7.png)

### 원시 로그 보기 {#raw-log-view}

작업 로그 창에서 RAW LOG 동작을 통해 가공되지 않은 원시 작업 로그를 열 수 있습니다.

## 작업 로그 보관 {#tasks-log-retention}
작업 템플릿이나 대시보드에서 이전 실행의 작업 로그를 확인할 수 있습니다.

하지만 기본적으로 로그 보관 기간은 무제한입니다.

`config.json`의 `max_tasks_per_template` 파라미터 또는 `SEMAPHORE_MAX_TASKS_PER_TEMPLATE` 환경 변수를 사용하여 이를 설정할 수 있습니다.

