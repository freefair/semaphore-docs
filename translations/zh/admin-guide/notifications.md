# 通知

Semaphore 把任务结果报告到聊天工具和电子邮件。渠道在服务器上通过 `config.json` 或
环境变量配置一次，随后对每个项目都生效。哪些任务会产生告警，则在 Web 界面中按项目
和按模板决定。

<a id="how-delivery-works"></a>

## 投递的工作方式

有三项设置决定消息是否发送，并且三者都必须允许：

1. **渠道已在服务器上配置。** 每个提供方在 `config.json` 中都有自己的配置键。请参阅
   下面该提供方的页面。
2. **项目允许告警。** [项目设置](../../../docs/user-guide/projects/settings.md)中的
   *Allow alerts for this project* 是总开关。关闭它之后，任何渠道都不会发送与该项目
   有关的内容。
3. **模板要求发送。** 任务模板可以选择在成功时告警、在出错时告警，或完全不告警，
   参见[任务模板](../../../docs/user-guide/task-templates/README.md)。

使用项目设置中的 **Test alerts**，即可通过每个已配置的渠道发送一条测试消息，而无需
运行任务。

<a id="channels"></a>

## 渠道

| 渠道 | 页面 |
|---|---|
| 电子邮件（SMTP） | [电子邮件](../../../docs/admin-guide/notifications/email.md) |
| Telegram | [Telegram](../../../docs/admin-guide/notifications/telegram.md) |
| Slack | [Slack](../../../docs/admin-guide/notifications/slack.md) |
| Microsoft Teams | [Teams](../../../docs/admin-guide/notifications/teams.md) |
| Rocket.Chat | [Rocket.Chat](../../../docs/admin-guide/notifications/rocket.md) |
| DingTalk | [DingTalk](../../../docs/admin-guide/notifications/ding.md) |
| Gotify | [Gotify](../../../docs/admin-guide/notifications/gotify.md) |

可以同时启用多个渠道；每个渠道都会收到通过上述三项检查的每一条告警。

<a id="per-project-overrides"></a>

## 按项目覆盖

Telegram 支持按项目指定聊天：在[项目设置](../../../docs/user-guide/projects/settings.md)中设置
**Telegram Chat ID**，即可把某个项目的告警发送到与服务器全局配置不同的聊天。其他
渠道对所有项目都使用服务器配置。

<a id="where-to-start"></a>

## 从哪里开始

先配置一个渠道，打开 *Allow alerts for this project*，然后按下 **Test alerts**。
测试消息到达后，再为你关心的模板启用告警。
