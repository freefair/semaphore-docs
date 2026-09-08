# 通知

Semaphore は、タスクやプロジェクトのアクティビティに関する通知を、よく使われるチャネルに送信できます。`config.json` でグローバルな通知先を設定し、(対応している場合は)プロジェクトごとに一部のオプションを上書きできます。

対応プロバイダー:

* [メール](/admin-guide/notifications/email)
* [Slack](/admin-guide/notifications/slack)
* [Telegram](/admin-guide/notifications/telegram)
* [Microsoft Teams](/admin-guide/notifications/teams)
* [RocketChat](/admin-guide/notifications/rocket)
* [DingTalk](/admin-guide/notifications/ding)
* [Gotify](/admin-guide/notifications/gotify)

## 仕組み {#how-it-works}

- **グローバル設定**: Semaphore サーバーの `config.json` でプロバイダーを有効にし、接続オプションを設定します。正確なキーについては各プロバイダーのページを参照してください。
- **イベント**: 通知は主要なタスクのライフサイクルイベント(開始、成功、失敗など)で送信され、設定されたチャネル/webhook に投稿されます。
- **プロジェクトごとの上書き**: 一部のプロバイダーはプロジェクトごとの上書きに対応しています。たとえば、Telegram はプロジェクト固有のチャット ID をサポートしています。
