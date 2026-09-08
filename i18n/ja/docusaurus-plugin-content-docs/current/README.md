---
title: Semaphore UI ドキュメント
sidebar_label: ホーム
hide_table_of_contents: true
---

# Semaphore UI ドキュメント

Semaphore UI は、**Ansible**、**Terraform/OpenTofu**、**Shell**、**PowerShell**、**Python** の自動化を実行するためのセルフホスト型の Web UI および API です。playbook やスクリプトの実行、認証情報の暗号化保管、ジョブのスケジュール実行、そして誰がいつ何を実行したかの確認を、チームでひとつの場所から行えます。

単一の Go バイナリまたは Docker イメージとして提供され、Linux、macOS、Windows 上で動作し、データは SQLite、MySQL、PostgreSQL のいずれかに保存されます。

:::tip[クイックスタート]

次のコマンド 1 つで SQLite を使って Semaphore を起動し、[http://localhost:3000](http://localhost:3000) を開いて `admin` / `changeme` でログインします。

```bash
docker run -d -p 3000:3000 \
  -e SEMAPHORE_DB_DIALECT=sqlite \
  -e SEMAPHORE_ADMIN=admin \
  -e SEMAPHORE_ADMIN_PASSWORD=changeme \
  -e SEMAPHORE_ADMIN_NAME=Admin \
  -e SEMAPHORE_ADMIN_EMAIL=admin@localhost \
  -v semaphore-data:/var/lib/semaphore \
  semaphoreui/semaphore:latest
```

本番環境向けには、Docker Compose、パッケージ、Kubernetes、バイナリでのインストール方法を[インストール](/admin-guide/installation)で確認してください。その後、[はじめに](/getting-started)に従って最初のタスクを実行してください。

:::

<div className="row home-cards">
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>インストールと設定</h3></div>
      <div className="card__body">
        <p>サーバーを起動し、データベース、ID プロバイダー、ネットワークに接続します。</p>
        <ul>
          <li><a href="/admin-guide/installation">インストール</a></li>
          <li><a href="/admin-guide/configuration">設定</a></li>
          <li><a href="/category/reverse-proxy">リバースプロキシと TLS</a></li>
          <li><a href="/admin-guide/ldap">LDAP</a> と <a href="/admin-guide/openid">OpenID Connect</a></li>
          <li><a href="/admin-guide/security">セキュリティ強化</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>自動化の実行</h3></div>
      <div className="card__body">
        <p>作業をプロジェクトに整理し、リポジトリと認証情報を接続して、タスクをオンデマンドまたはスケジュールで実行します。</p>
        <ul>
          <li><a href="/getting-started">はじめに: 6 つのステップで最初のタスクを実行</a></li>
          <li><a href="/user-guide/projects">プロジェクト</a> と <a href="/user-guide/team">チーム</a></li>
          <li><a href="/user-guide/task-templates">タスクテンプレート</a> と <a href="/user-guide/tasks">タスク</a></li>
          <li><a href="/user-guide/key-store">キーストア</a>、<a href="/user-guide/inventory">インベントリ</a>、<a href="/user-guide/environment">変数グループ</a></li>
          <li><a href="/user-guide/schedules">スケジュール</a> と <a href="/user-guide/workflows">ワークフロー</a> (Pro)</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>大規模運用</h3></div>
      <div className="card__body">
        <p>実行を分散し、冗長構成で稼働させ、サービスを監視可能かつ最新の状態に保ちます。</p>
        <ul>
          <li><a href="/admin-guide/runners">ランナー</a></li>
          <li><a href="/admin-guide/ha">高可用性</a></li>
          <li><a href="/admin-guide/upgrading">アップグレード</a></li>
          <li><a href="/admin-guide/logs">ログ</a> と <a href="/admin-guide/metrics">メトリクス</a></li>
          <li><a href="/category/notifications">通知</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>リファレンス</h3></div>
      <div className="card__body">
        <p>探しているものが分かっている場合に参照する、正確なオプションとエンドポイントです。</p>
        <ul>
          <li><a href="/admin-guide/configuration/config-file">設定ファイル</a> と <a href="/admin-guide/configuration/env-vars">環境変数</a></li>
          <li><a href="/admin-guide/api">REST API</a></li>
          <li><a href="/admin-guide/cli">CLI</a></li>
          <li><a href="/admin-guide/cicd">CI/CD 連携</a></li>
          <li><a href="/faq/troubleshooting">トラブルシューティング FAQ</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>

## ツール別ガイド {#guides-by-tool}

<div className="home-tools margin-bottom--lg">
  <a className="button button--outline button--primary" href="/user-guide/apps/ansible">Ansible</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/terraform">Terraform / OpenTofu</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/bash">Shell</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/powershell">PowerShell</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/python">Python</a>
</div>

## ヘルプとコミュニティ {#help-and-community}

- **質問:** [Discord](https://discord.gg/5R6k7hNGcH) でお尋ねください。
- **バグ報告と機能要望:** [GitHub](https://github.com/semaphoreui/semaphore/issues) で issue を作成してください。
- **ソースコード:** [github.com/semaphoreui/semaphore](https://github.com/semaphoreui/semaphore)。
- **Pro および Enterprise:** [ライセンスの有効化](/admin-guide/license)。
