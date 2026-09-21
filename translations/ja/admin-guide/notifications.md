# 通知

Semaphore はタスクの結果をチャットとメールに通知します。チャンネルはサーバー上で
`config.json` または環境変数を使って一度だけ設定し、以後はすべてのプロジェクトに適用され
ます。どのタスクがアラートを発生させるかは、Web インターフェース上でプロジェクトごと、
テンプレートごとに決まります。

<a id="how-delivery-works"></a>

## 配信の仕組み

メッセージが送信されるかどうかは 3 つの設定で決まり、その 3 つすべてが許可している必要が
あります。

1. **チャンネルがサーバー上で設定されていること。** 各プロバイダーは `config.json` に
   独自のキーを持ちます。以下にある各プロバイダーのページを参照してください。
2. **プロジェクトがアラートを許可していること。**
   [プロジェクト設定](../../../docs/user-guide/projects/settings.md)の *Allow alerts for this project* が
   マスタースイッチです。これをオフにすると、そのプロジェクトについてどのチャンネルも
   何も送信しません。
3. **テンプレートがアラートを要求していること。** タスクテンプレートでは、成功時に通知するか、
   エラー時に通知するか、まったく通知しないかを選びます。[タスクテンプレート](../../../docs/user-guide/task-templates/README.md)を参照してください。

プロジェクト設定の **Test alerts** を使うと、タスクを実行せずに、設定済みのすべての
チャンネルへテストメッセージを送信できます。

<a id="channels"></a>

## チャンネル

| チャンネル | ページ |
|---|---|
| メール (SMTP) | [メール](../../../docs/admin-guide/notifications/email.md) |
| Telegram | [Telegram](../../../docs/admin-guide/notifications/telegram.md) |
| Slack | [Slack](../../../docs/admin-guide/notifications/slack.md) |
| Microsoft Teams | [Teams](../../../docs/admin-guide/notifications/teams.md) |
| Rocket.Chat | [Rocket.Chat](../../../docs/admin-guide/notifications/rocket.md) |
| DingTalk | [DingTalk](../../../docs/admin-guide/notifications/ding.md) |
| Gotify | [Gotify](../../../docs/admin-guide/notifications/gotify.md) |

複数のチャンネルを同時に有効にできます。上記の 3 つの条件を満たしたアラートは、その
すべてのチャンネルに届きます。

<a id="per-project-overrides"></a>

## プロジェクトごとの上書き

Telegram はプロジェクトごとのチャットに対応しています。
[プロジェクト設定](../../../docs/user-guide/projects/settings.md)で **Telegram Chat ID** を設定すると、
そのプロジェクトのアラートを、サーバー全体のチャットとは別のチャットに送れます。他の
チャンネルは、すべてのプロジェクトでサーバーの設定を使用します。

<a id="where-to-start"></a>

## ここから始める

まずチャンネルを 1 つ設定し、*Allow alerts for this project* をオンにして、**Test alerts**
を押してください。テストメッセージが届いたら、重要なテンプレートでアラートを有効にします。
