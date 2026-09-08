# パイプライン

Semaphore は、`build` タスクと `deploy` タスクを使ったシンプルなパイプラインをサポートしています。

Semaphore は、実行する各 Ansible playbook に `semaphore_vars` 変数を渡します。

Ansible のタスク内でこの変数を使うと、実行されたタスクの種類、ビルドまたはデプロイすべきバージョン、タスクを実行したユーザーなどを取得できます。

---

`build` タスクにおける `semaphore_vars` の例:

```yaml
semaphore_vars:
    task_details:
        type: build
        username: user123
        message: New version of some feature
        target_version: 1.5.33
```

`deploy` タスクにおける `semaphore_vars` の例:

```yaml
semaphore_vars:
    task_details:
        type: deploy
        username: user123
        message: Deploy new feature to servers
        incoming_version: 1.5.33
```

**Bash**、**PowerShell**、**Python** のテンプレートでは、Semaphore は同じ `task_details` の値を環境変数として提供します:

| `task_details` フィールド | 環境変数 | 備考 |
| --- | --- | --- |
| `type` | `SEMAPHORE_TASK_DETAILS_TYPE` | `build` または `deploy` |
| `username` | `SEMAPHORE_TASK_DETAILS_USERNAME` | タスクを開始したユーザー |
| `message` | `SEMAPHORE_TASK_DETAILS_MESSAGE` | タスクのメッセージ |
| `target_version` | `SEMAPHORE_TASK_DETAILS_TARGET_VERSION` | `build` タスクで設定されます |
| `incoming_version` | `SEMAPHORE_TASK_DETAILS_INCOMING_VERSION` | `deploy` タスクで設定されます |

Bash の例:

```bash
echo "$SEMAPHORE_TASK_DETAILS_TYPE"
echo "$SEMAPHORE_TASK_DETAILS_TARGET_VERSION"
```

PowerShell の例:

```powershell
$env:SEMAPHORE_TASK_DETAILS_TYPE
$env:SEMAPHORE_TASK_DETAILS_INCOMING_VERSION
```

Python の例:

```python
import os

task_type = os.getenv("SEMAPHORE_TASK_DETAILS_TYPE")
target_version = os.getenv("SEMAPHORE_TASK_DETAILS_TARGET_VERSION")
incoming_version = os.getenv("SEMAPHORE_TASK_DETAILS_INCOMING_VERSION")
```

### ビルド {#build}

この種類のタスクは、[アーティファクト](https://en.wikipedia.org/wiki/Artifact\_\(software\_development\))を作成するために使用します。各ビルドタスクには自動生成されたバージョンがあります。作成すべきアーティファクトのバージョンを取得するには、Ansible playbook 内で変数 `semaphore_vars.task_details.target_version` を使用してください。アーティファクトが作成されると、デプロイに使用できます。

---

`build` 用 Ansible ロールの例:

1. GitHub からアプリのソースコードを取得する
2. ソースコードをコンパイルする
3. 作成したバイナリを `app-{{semaphore_vars.task_details.target_version}}.tar.gz` という名前の tarball にまとめる
4. `app-{{semaphore_vars.task_details.target_version}}.tar.gz` を S3 バケットに送信する



### デプロイ {#deploy}

この種類のタスクは、アーティファクトを配布先サーバーにデプロイするために使用します。各デプロイタスクはビルドタスクに関連付けられています。デプロイすべきアーティファクトのバージョンを取得するには、Ansible playbook 内で変数 `semaphore_vars.task_details.incoming_version` を使用してください。

---

`deploy` 用 Ansible ロールの例:

1. `app-{{semaphore_vars.task_details.incoming_version}}.tar.gz` を S3 バケットから配布先サーバーにダウンロードする
2. `app-{{semaphore_vars.task_details.incoming_version}}.tar.gz` を配布先ディレクトリに展開する
3. 設定ファイルを作成または更新する
4. アプリのサービスを再起動する

