# 알림

Semaphore는 작업 결과를 채팅과 이메일로 알립니다. 채널은 서버에서 `config.json`이나 환경
변수로 한 번만 설정하며, 이후 모든 프로젝트에 적용됩니다. 어떤 작업이 알림을 발생시킬지는
웹 인터페이스에서 프로젝트별, 템플릿별로 결정합니다.

<a id="how-delivery-works"></a>

## 전달 방식

메시지가 전송될지는 세 가지 설정이 결정하며, 세 가지 모두가 이를 허용해야 합니다.

1. **채널이 서버에 설정되어 있어야 합니다.** 각 공급자는 `config.json`에 고유한 키를 가집니다.
   아래에서 해당 공급자의 페이지를 참조하십시오.
2. **프로젝트가 알림을 허용해야 합니다.** [프로젝트 설정](../../../docs/user-guide/projects/settings.md)의
   *Allow alerts for this project*가 주 스위치입니다. 이를 끄면 어떤 채널도 해당 프로젝트에
   대해 아무것도 보내지 않습니다.
3. **템플릿이 알림을 요청해야 합니다.** 작업 템플릿에서 성공 시 알릴지, 오류 시 알릴지,
   아니면 전혀 알리지 않을지 선택합니다. [작업 템플릿](../../../docs/user-guide/task-templates/README.md)을 참조하십시오.

프로젝트 설정의 **Test alerts**를 사용하면 작업을 실행하지 않고도 설정된 모든 채널로 테스트
메시지를 보낼 수 있습니다.

<a id="channels"></a>

## 채널

| 채널 | 페이지 |
|---|---|
| 이메일 (SMTP) | [이메일](../../../docs/admin-guide/notifications/email.md) |
| Telegram | [Telegram](../../../docs/admin-guide/notifications/telegram.md) |
| Slack | [Slack](../../../docs/admin-guide/notifications/slack.md) |
| Microsoft Teams | [Teams](../../../docs/admin-guide/notifications/teams.md) |
| Rocket.Chat | [Rocket.Chat](../../../docs/admin-guide/notifications/rocket.md) |
| DingTalk | [DingTalk](../../../docs/admin-guide/notifications/ding.md) |
| Gotify | [Gotify](../../../docs/admin-guide/notifications/gotify.md) |

여러 채널을 동시에 활성화할 수 있으며, 위의 세 가지 조건을 통과한 모든 알림은 각 채널에
전달됩니다.

<a id="per-project-overrides"></a>

## 프로젝트별 재정의

Telegram은 프로젝트별 채팅을 지원합니다. [프로젝트 설정](../../../docs/user-guide/projects/settings.md)에서
**Telegram Chat ID**를 지정하면 해당 프로젝트의 알림을 서버 전체 채팅이 아닌 다른 채팅으로
보낼 수 있습니다. 다른 채널은 모든 프로젝트에서 서버 설정을 사용합니다.

<a id="where-to-start"></a>

## 어디서 시작할까요

먼저 채널을 하나 설정하고 *Allow alerts for this project*를 켠 다음 **Test alerts**를
누르십시오. 테스트 메시지가 도착하면 중요한 템플릿에서 알림을 활성화하십시오.
