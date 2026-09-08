# 🔐 セキュリティ

## はじめに {#introduction}

Semaphore UI ではセキュリティを最優先事項としています。重要なインフラ作業を自動化する場合でも、機密性の高いシステムへのチームのアクセスを管理する場合でも、Semaphore UI は初期状態から堅牢で安全な運用を提供できるよう設計されています。このセクションでは、Semaphore がセキュリティをどのように扱っているか、また本番環境にデプロイする際に考慮すべき点について説明します。

## 認証と認可 {#authentication--authorization}

Semaphore は安全な認証と柔軟な認可の仕組みをサポートしています。

- **ログイン方法:**
  - **ユーザー名/パスワード**<br />Semaphore データベースに保存された認証情報を使用するデフォルトの方法です。パスワードは強力なアルゴリズム (bcrypt) でハッシュ化されます。

  - **LDAP**<br />企業のディレクトリサービスとの連携が可能です。ユーザー/グループのフィルタリングと、LDAPS による安全な接続をサポートします。

  - **OpenID Connect (OIDC)**<br />Google、Azure AD、Keycloak などの ID プロバイダーによるシングルサインオンを実現します。カスタムクレームとグループマッピングをサポートします。

- **二要素認証 (2FA)**<br />TOTP ベースの 2FA が利用可能で、すべてのユーザーに推奨されます。ユーザーごとに有効化でき、任意でリカバリーコードにも対応しています。設定オプション `auth.totp.enabled` と `auth.totp.allow_recovery` を参照してください。

- **ロールベースのアクセス制御**<br />Admin、Maintainer、Viewer などの異なるロールをユーザーに割り当て、責任範囲に応じてアクセスを制限できます。

- **セッション管理**<br />セッションは安全な HTTP Cookie で保護されます。セッションの有効期限とログアウトの仕組みにより、露出を最小限に抑えます。
<!-- - **Brute-Force Protection**: Login attempts are rate-limited to prevent brute-force attacks. -->

## シークレットと認証情報 {#secrets--credentials}

シークレットを安全に管理することは中核機能のひとつです。

- **暗号化されたキーストア**<br />認証情報とシークレット変数は、AES 暗号化により保存時に暗号化されます。

- **環境の分離**<br />シークレットは実行時にジョブへのみ渡され、コンテナ環境に直接公開されることはありません。

- **SSH キーとトークン**<br />有効な SSH キーとトークンをアップロードするのはユーザーの責任です。これらは暗号化され、タスクの実行時にのみ使用されます。
- **HashiCorp Vault 連携 (Pro)**<br />シークレットを外部の Vault インスタンスに保存できます。シークレットの作成時または編集時に、シークレットごとに保存先を選択します。

## データの暗号化 {#data-encryption}

機密データはデータベースに暗号化された形で保存されます。アクセスキーの暗号化を有効にするには、設定ファイルで設定オプション `access_key_encryption` を指定する必要があります。この値は次のコマンドで生成してください。

```bash
head -c32 /dev/urandom | base64
```

## 信頼できないコード / playbook の実行 {#running-untrusted-code--playbooks}

Semaphore はユーザー定義の playbook やコマンドを実行するため、リスクを伴う場合があります。

- **コンテナの分離**<br />タスクは分離された Docker コンテナ内で実行されます。これらのコンテナはホストシステムにアクセスできません。

- **最小権限**<br />コンテナは最小限の権限で実行され、Docker のフラグでさらに制限できます。

- **chroot による実行**<br />Semaphore はタスクを chroot jail 内で実行し、実行環境をホストシステムからさらに分離できます。

- **タスクプロセスのユーザー**<br />潜在的な脆弱性悪用の影響を減らすため、タスクを専用の非 root システムユーザー (例: `semaphore`) で実行できます。これは任意であり、システムポリシーに応じて設定できます。
<!-- - **Resource Limits**: To prevent abuse, CPU and memory limits can be applied. -->

## 安全なデプロイ {#secure-deployment}

Semaphore を安全にデプロイするために:

- **HTTPS を使用する**<br />
    Semaphore は**組み込みの TLS サポート**と **Nginx などのリバースプロキシ**の両方で HTTPS に対応しています。本番環境では HTTPS を有効にすることを強く推奨します。

    組み込みの HTTPS サポートを有効にするには、次のブロックを **config.json** に追加します。
    ```json
    {
        ...
        "tls": {
            "enabled": true,
            "cert_file": "/path/to/cert/example.com.cert",
            "key_file": "/path/to/key/example.com.key"
        }
        ...
    }
    ```

- **ファイアウォールの内側で実行する**<br />Semaphore UI とデータベースへのアクセスを、信頼できる IP のみに制限します。

- **データベースのセキュリティ**<br />強力なパスワードを使用し、データベースへのアクセスを Semaphore のみに制限します。

## アップデートとパッチ管理 {#updates--patch-management}

セキュリティアップデートは定期的に公開されます。

- **最新の状態を保つ**<br />常に最新の安定版リリースを使用してください。

- **変更履歴**<br />アップデートの前に GitHub で変更内容を確認してください。

- **自動アップデート**<br />Docker を使用している場合は、定期的なアップデートのための自動化 pipeline を検討してください。

<!-- ## Audit Logs & Monitoring

Semaphore provides basic audit logging:

- **User Activity**: Logins, failed attempts, and task executions are logged.
- **Configuration Changes**: Changes to settings, projects, and credentials are logged with timestamps.
- **Integration**: Logs can be forwarded to centralized logging systems like ELK or Prometheus exporters. -->

<!-- ## Backups & Disaster Recovery

To protect against data loss:

- **What to Back Up**: Semaphore database, configuration file, and secret storage.
- **How to Restore**: Follow the backup/restore guide in the admin docs.
- **Testing**: Periodically test restoring backups in a staging environment. -->

<!-- ## Common Vulnerabilities & Hardening Tips

- **Disable User Registration** if not needed to prevent unauthorized access.
- **Use Strong Passwords** and enforce complexity rules.
- **Limit Task Concurrency** to avoid resource exhaustion.
- **Restrict Access to Secrets** by managing team permissions carefully. -->

<!-- ## Compliance & Data Privacy

Semaphore collects minimal user data:

- **Data Handling**: Emails, IP logs, and session data are stored securely.
- **User Deletion**: Admins can delete user accounts and associated data upon request.
- **GDPR Compliance**: Self-hosted users are responsible for local compliance. -->

## 脆弱性の報告 {#reporting-vulnerabilities}

脆弱性を発見しましたか? Semaphore の安全性維持にご協力ください。

- **責任ある開示**<br />`security@semaphoreui.com` までメールでご連絡ください。
 
### 脆弱性解決の目標期間 {#vulnerability-resolution-targets}

報告された脆弱性は、次の目標期間内に解決することを目指しています。

- Critical (緊急): 30 日以内
- High (高): 60 日以内
- Medium (中): 90 日以内
- Low (低): ベストエフォート、通常 180 日以内

最新の安定版リリースに影響し、実際に悪用されている問題については、定期サイクル外のパッチをリリースする場合があります。

### コードセキュリティツール {#code-security-tooling}

コードベースと依存関係の分析、および依存関係更新の自動化のために、CodeQL、Codacy、Snyk、Renovate を使用しています。
- **公開エクスプロイトの禁止**<br />パッチが適用されるまで、脆弱性を公に共有しないでください。

- **謝辞**<br />ご希望があれば、セキュリティ研究者の方をリリースノートで紹介させていただく場合があります。
