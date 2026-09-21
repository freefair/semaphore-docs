# はじめに

このページでは、新規インストールから最初のタスクの成功までを順を追って説明します。各ステップは詳細ページへのリンクになっています。

<a id="from-zero-to-first-task"></a>

## ゼロから最初のタスクまで

1. お好みの方法で **Semaphore をインストール**します: [インストール](../../docs/admin-guide/installation.md)。
2. セットアップ時に作成した管理者ユーザー、または Docker の場合は `SEMAPHORE_ADMIN_*` 変数で**ログイン**します。
3. **プロジェクトを作成します。** プロジェクトはチーム、インフラ、アプリケーションを互いに分離します: [プロジェクト](../../docs/user-guide/projects.md)。
4. **自動化に必要なものを接続します:**
   - playbook、モジュール、スクリプトを含むソースコード: [リポジトリ](../../docs/user-guide/repositories.md)。
   - SSH キー、トークン、パスワード: [キーストア](../../docs/user-guide/key-store.md)。
   - 対象ホストと接続設定: [インベントリ](../../docs/user-guide/inventory.md)。
   - 再利用可能な変数: [変数グループ](../../docs/user-guide/environment.md)。
5. **タスクテンプレートを作成して実行します。** お使いのツールのガイドを選択してください: [Ansible](../../docs/user-guide/apps/ansible.md)、[Terraform/OpenTofu](../../docs/user-guide/apps/terraform/README.md)、[Shell](../../docs/user-guide/apps/bash.md)、[PowerShell](../../docs/user-guide/apps/powershell.md)、または [Python](../../docs/user-guide/apps/python.md)。その後、実行して結果を確認します: [タスク](../../docs/user-guide/tasks.md)。
6. **自動化と運用化:**
   - スケジュールで実行する: [スケジュール](../../docs/user-guide/schedules.md)。
   - 誰が何をできるかを制御する: [チームとカスタムロール](../../docs/user-guide/team.md)。
   - 結果の通知を受け取る: [通知](../../docs/admin-guide/notifications.md)。

<a id="key-concepts"></a>

## 主要な概念

これらの用語は UI のあらゆる場所に登場します。

| 用語 | 意味 |
|------|---------|
| **プロジェクト** | 分離の基本単位。各プロジェクトは独自のリポジトリ、キー、インベントリ、テンプレート、チームを持ちます。[プロジェクト](../../docs/user-guide/projects.md) |
| **リポジトリ** | playbook、モジュール、スクリプトが置かれている Git リポジトリまたはローカルパス。[リポジトリ](../../docs/user-guide/repositories.md) |
| **インベントリ** | Ansible スタイルの実行のためのホスト、グループ、接続設定。[インベントリ](../../docs/user-guide/inventory.md) |
| **変数グループ** | 再利用可能な変数と環境設定。Environment とも呼ばれます。[変数グループ](../../docs/user-guide/environment.md) |
| **キーストア** | SSH キー、トークン、パスワードなどの暗号化された認証情報。[キーストア](../../docs/user-guide/key-store.md) |
| **タスクテンプレート** | 実行の定義: アプリ、リポジトリ、インベントリ、変数、オプション。[タスクテンプレート](../../docs/user-guide/task-templates/README.md) |
| **タスク** | テンプレートの 1 回の実行。ログとステータスを持ちます。[タスク](../../docs/user-guide/tasks.md) |
| **ワークフロー** | 分岐、承認、遅延を含むテンプレートのグラフ。Pro 機能。[ワークフロー](../../docs/user-guide/workflows.md) |
| **Runner** | タスクが実行される場所: サーバー自体またはリモートの runner。[Runner](../../docs/admin-guide/runners.md) |

<a id="next-steps"></a>

## 次のステップ

- [リバースプロキシ](../../docs/admin-guide/reverse-proxy/README.md)を使って Semaphore を TLS の背後に配置する。
- ID プロバイダーを接続する: [LDAP](../../docs/admin-guide/authentication/ldap.md) または [OpenID Connect](../../docs/admin-guide/authentication/openid.md)。
- [API](../../docs/reference/api.md) と [CLI](../../docs/reference/cli/README.md) を使って、CI やスクリプトから Semaphore を操作する。
