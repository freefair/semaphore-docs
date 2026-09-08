# キーストア

Semaphore のキーストアは、リモートリポジトリへのアクセス、リモートホストへのアクセス、sudo 認証情報、Ansible Vault のパスワードに使用する認証情報を保存するために使用します。

## 種類 {#types}

### 1. SSH {#1-ssh}
SSH キーは、リモートサーバーおよびリモートリポジトリへのアクセスに使用します。

キーをすばやく生成してホストに配置する方法については、[こちらの簡単なガイド](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-20-04)を参照してください。

SSH 認証を使用する Git リポジトリの場合、クローン元の Git リポジトリに、秘密鍵に対応する公開鍵が登録されている必要があります。

一般的な Git リポジトリのドキュメントへのリンクは次のとおりです。
* [GitHub](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
* [GitLab](https://docs.gitlab.com/ee/user/ssh.html)
* [Bitbucket](https://support.atlassian.com/bitbucket-cloud/docs/set-up-an-ssh-key/)

### 2. パスワードでログイン {#2-login-with-password}
「パスワードでログイン」は、ユーザー名とパスワード/アクセストークンの組み合わせで、次の用途に使用できます。
* リモートホストへの認証 (ただし SSH キーを使用するよりも安全性は低くなります)
* リモートホストでの sudo 認証情報
* HTTPS 経由でのリモート Git リポジトリへの認証 (ただし SSH の方がより安全です)
* Ansible Vault のロック解除

:::tip
    この種類のシークレットは、Personal Access Token (PAT) やシークレット文字列としても使用できます。ログインフィールドを空のままにしてください。
:::

### 3. なし {#3-none}
GitLab 上のオープンソースリポジトリなど、認証を必要としないリポジトリ用のプレースホルダーとして使用します。


## シークレットストレージ {#secret-storages}

Semaphore UI は、シークレット用に複数のストレージをサポートしています。シークレットの作成時または編集時に、シークレットごとにストレージを選択できます。

### データベース {#database}

デフォルトでは、シークレットは暗号化された形式でデータベースに保存されます。暗号化キーは、設定オプション
`access_key_encryption` または `SEMAPHORE_ACCESS_KEY_ENCRYPTION` で設定します (`head -c32 /dev/urandom | base64` で生成する必要があります)。

### HashiCorp Vault {#hashicorp-vault}

シークレットは、データベースの代わりに外部の HashiCorp Vault インスタンスに保存できます。

[詳細を読む...](/user-guide/key-store/hashicorp-vault)

### OpenBao {#openbao}

シークレットは、外部の [OpenBao](https://openbao.org) インスタンス (HashiCorp Vault のオープンソースかつ API 互換のフォーク) に保存できます。

[詳細を読む...](/user-guide/key-store/openbao)

### AWS Secrets Manager {#aws-secrets-manager}

![Static Badge](https://img.shields.io/badge/enterprise-yellow)

シークレットは AWS Secrets Manager に保存できます。IAM ロール/インスタンスプロファイル、または静的なアクセスキーで認証します。

[詳細を読む...](/user-guide/key-store/aws-secrets-manager)

### Devolutions Server {#devolutions-server}

シークレットは、データベースの代わりに外部の Devolutions Server インスタンスに保存できます。

[詳細を読む...](/user-guide/key-store/devolutions-server)

## リモートストレージからのシークレットの同期 {#syncing-secrets-from-remote-storages}

Semaphore は、外部のシークレットマネージャー (HashiCorp Vault、OpenBao、AWS Secrets Manager、Azure Key Vault、Devolutions Server) からシークレットを自動的にインポートし、同期を維持できます。同期パスを使用して、どのシークレットをインポートし、どのような名前を付けるかを選択できます。

[詳細を読む...](/user-guide/key-store/secret-sync)
