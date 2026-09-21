# Slack

Slack 通知を使用すると、Semaphore のワークフローに関するリアルタイムの更新を Slack チャンネルで直接受け取れます。この連携により、チームは Semaphore のダッシュボードを常に確認しなくても、ビルドのステータス、デプロイの結果、その他の重要なイベントを把握できます。

Slack 通知を設定するには、Semaphore と目的の Slack チャンネルを接続する webhook URL を作成する必要があります。この webhook は、2 つのプラットフォーム間の安全な通信の橋渡しとして機能します。

<a id="creating-slack-webhook"></a>

## Slack webhook の作成

<a id="step-1-open-slack-api-settings"></a>

### ステップ 1. Slack API の設定を開く

1. [https://api.slack.com/apps](https://api.slack.com/apps) にアクセスします。
2. **Create New App** をクリックし、**From Scratch** を選択します。
3. アプリに名前を付け(例: `Semaphore Bot`)、**Slack ワークスペース**を選択します。

---

<a id="step-2-enable-incoming-webhooks"></a>

### ステップ 2. Incoming Webhooks を有効にする

1. アプリの設定画面で、**Features → Incoming Webhooks** に移動します。
2. **Activate Incoming Webhooks** を **On** に切り替えます。

---

<a id="step-3-create-a-webhook-url"></a>

### ステップ 3. webhook URL を作成する

1. **Add New Webhook to Workspace** をクリックします。
2. メッセージの送信先となるチャンネルを選択します。
3. **Allow** をクリックします。
4. 次のような **Webhook URL** が表示されます。

   ```
   https://hooks.slack.com/services/xxxxxxxxxxx/xxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

<a id="step-4-test-your-webhook"></a>

### ステップ 4. webhook をテストする

`curl` を使用してテストします。

```bash
curl -X POST -H 'Content-type: application/json' \
--data '{"text":"Hello from Semaphore UI 🚀"}' \
https://hooks.slack.com/services/xxxxxxxxxxx/xxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx
```

すべて正しく設定されていれば、選択した Slack チャンネルにメッセージが表示されます。

<a id="semaphore-configuration"></a>

## Semaphore の設定

Slack の webhook URL を取得したら、いくつかの方法で Semaphore が通知を送信するように設定できます。

Slack 通知は、設定ファイルまたは環境変数のいずれかで有効にできます。

<a id="method-1-configuration-file"></a>

### 方法 1: 設定ファイル

Semaphore の設定ファイルに次の設定を追加します。

- `slack_alert`: Slack 通知を有効にするには `true` を設定します
- `slack_url`: 前のステップで取得した webhook URL

`config.json` の例:

```json
{
    "slack_alert": true,
    "slack_url": "https://hooks.slack.com/services/xxxxxxxxxxx/xxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx",
}
```

<a id="method-2-environment-variables"></a>

### 方法 2: 環境変数

また、環境変数を使用して Slack 通知を設定することもできます。この方法は、コンテナ化されたデプロイや、機密情報を設定ファイルから分離しておきたい場合に特に便利です。

```
SEMAPHORE_SLACK_ALERT=True
SEMAPHORE_SLACK_URL=https://hooks.slack.com/services/xxxxxxxxxxx/xxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx
```
