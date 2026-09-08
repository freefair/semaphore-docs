# 알림

Semaphore는 작업 및 프로젝트 활동에 대한 알림을 널리 사용되는 채널로 보낼 수 있습니다. `config.json`에서 전역 알림 설정을 구성하고, 지원되는 경우 프로젝트별로 특정 옵션을 재정의할 수 있습니다.

지원되는 제공자:

* [이메일](/admin-guide/notifications/email)
* [Slack](/admin-guide/notifications/slack)
* [Telegram](/admin-guide/notifications/telegram)
* [Microsoft Teams](/admin-guide/notifications/teams)
* [RocketChat](/admin-guide/notifications/rocket)
* [DingTalk](/admin-guide/notifications/ding)
* [Gotify](/admin-guide/notifications/gotify)

## 동작 방식 {#how-it-works}

- **전역 설정**: Semaphore 서버의 `config.json`에서 제공자를 활성화하고 연결 옵션을 설정합니다. 정확한 키는 각 제공자 페이지를 참고하십시오.
- **이벤트**: 알림은 주요 작업 수명 주기 이벤트(예: 시작, 성공, 실패)에 전송되며, 설정된 채널/webhook으로 게시됩니다.
- **프로젝트별 재정의**: 일부 제공자는 프로젝트별 재정의를 지원합니다. 예를 들어 Telegram은 프로젝트별 채팅 ID를 지원합니다.
