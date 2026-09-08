# タスク

タスクは、Ansible playbook を起動したインスタンスです。タスクは、[タスクテンプレート](task-templates/)で目的のテンプレートの Run/Build/Deploy ボタンをクリックして作成できます。

![](/assets/image6.png)

**Deploy** タスクタイプでは、タスクに関連付けるビルドのバージョンを指定できます。デフォルトでは最新のビルドバージョンになります。

![](/assets/task_deploy1.png)

タスクの実行中または完了後に、タスクのステータスと実行ログを確認できます。

![](/assets/image7.png)

### 生ログの表示 {#raw-log-view}

タスクログウィンドウの RAW LOG アクションから、未加工の生タスクログを開くことができます。

## タスクログの保持 {#tasks-log-retention}
タスクの過去の実行ログは、タスクテンプレートまたはダッシュボードで確認できます。

ただし、デフォルトではログの保持期間は無期限です。

これは、`config.json` の `max_tasks_per_template` パラメーター、または `SEMAPHORE_MAX_TASKS_PER_TEMPLATE` 環境変数で設定できます。

