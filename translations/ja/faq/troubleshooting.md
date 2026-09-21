# トラブルシューティング

<a id="runner-prints-error-404"></a>

## Runner がエラー 404 を出力する

<a id="how-to-fix"></a>

### 対処方法

[Runner から 401 エラーコードが返される](https://github.com/semaphoreui/semaphore/discussions/1873?converting=1)

---

<a id="gathering-facts-issue-for-localhost"></a>

## localhost での Gathering Facts の問題

この問題は、[Snap](https://snapcraft.io/semaphore) または [Docker](https://hub.docker.com/r/semaphoreui/semaphore) でインストールした Semaphore UI で発生することがあります。

```
4:10:16 PM
TASK [Gathering Facts] *********************************************************
4:10:17 PM
fatal: [localhost]: FAILED! => changed=false
```

<a id="why-this-happens"></a>

### 原因

Ansible での localhost の使用について詳しくは、[Implicit 'localhost'](https://docs.ansible.com/ansible/latest/inventory/implicit_localhost.html) の記事を参照してください。

Ansible はローカルでファクトを収集しようとしますが、Ansible は制限された分離コンテナ内にあるため、これが許可されません。

<a id="how-to-fix-this"></a>

### 対処方法

2 つの方法があります。

1. ファクトの収集を無効にする:

```yaml
- hosts: localhost
  gather_facts: False
  roles:
    - ...
```

2. 接続タイプを明示的に **ssh** に設定する:
```
[localhost]
127.0.0.1 ansible_connection=ssh ansible_ssh_user=your_localhost_user
```
---
<a id="panic-pq-ssl-is-not-enabled-on-the-server"></a>

## panic: pq: SSL is not enabled on the server

これは、お使いの Postgres が SSL で動作していないことを意味します。

<a id="how-to-fix-this-1"></a>

### 対処方法

設定ファイルにオプション `sslmode=disable` を追加します。

```json
	"postgres": {
		"host": "localhost",
		"user": "postgres",
		"pass": "pwd",
		"name": "semaphore",
		"options": {
			"sslmode": "disable"
		}
	},
```
---
<a id="fatal-bad-numeric-config-value-0-for-git_terminal_prompt-invalid-unit"></a>

## fatal: bad numeric config value '0' for 'GIT_TERMINAL_PROMPT': invalid unit

これは、認証が必要なリポジトリに HTTPS でアクセスしようとしていることを意味します。

<a id="how-to-fix-this-2"></a>

### 対処方法

* **キーストア**画面に移動します。
* `Login with password` タイプの新しいキーを作成します。
* GitHub/BitBucket などのログイン名を指定します。
* パスワードを指定します。GitHub/BitBucket ではアカウントのパスワードは使用できないため、代わりに Personal Access Token (PAT) を使用する必要があります。詳細は[こちら](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)を参照してください。
* キーを作成したら、**リポジトリ**画面に移動し、対象のリポジトリを見つけてキーを指定します。

---

<a id="git-clone-or-pull-fails-intermittently"></a>

## Git のクローンまたはプルが断続的に失敗する

タスクログに `Git pull failed (...), retrying in 2s` のようなメッセージが表示され、その後に成功するか、数回の試行の後に最終的に失敗することがあります。

<a id="why-this-happens-1"></a>

### 原因

Git サーバー (GitHub、GitLab、Bitbucket、またはセルフホストのインスタンス) に一時的に到達できなかったか、一時的な HTTP エラーが返されたか、Semaphore とサーバーの間のネットワークに短時間の障害が発生しました。Semaphore はタスクを失敗にする前に、クローンとプルの操作を自動的に再試行します。

<a id="how-to-fix-this-3"></a>

### 対処方法

1. **一時的な障害**: 通常は自動的に解消します。Semaphore は試行の間に指数バックオフを挟みながら、最大 `git_attempts` 回 (デフォルト 4) 再試行します。
2. **頻繁な失敗**: 設定で試行回数の上限を増やします。

```json
{
  "git_attempts": 8
}
```

または環境変数で指定します。

```bash
export SEMAPHORE_GIT_ATTEMPTS=8
```

3. **即座に一貫して失敗する**: 再試行では解決しません。リポジトリの URL、ブランチ名、アクセスキー、および Semaphore サーバーまたは runner ホストからのネットワーク接続を確認してください。

`git_client` と `git_attempts` の詳細については、[Git 操作](../../../docs/admin-guide/configuration/config-file.md#git-operations)を参照してください。

---

<a id="bash-script-output-is-missing-or-incomplete"></a>

## Bash スクリプトの出力が欠落または不完全

Bash タスクは正常に完了するものの、ログに `echo`、`printf` などのコマンドの出力がほとんど、またはまったく表示されない — 特にスクリプトがすぐに終了する場合に発生します。

<a id="why-this-happens-2"></a>

### 原因

Semaphore はシェルコマンドの実行中に stdout と stderr をキャプチャします。非常に短いスクリプトは、バッファリングされた出力がすべて読み取られる前に終了することがあり、その場合は最後の数行がタスクログから欠落する可能性があります。

<a id="how-to-fix-this-4"></a>

### 対処方法

1. **アップグレード**: 最近の Semaphore バージョンでは、タスクを完了としてマークする前にプロセスの出力を読み切ります。古いリリースを使用している場合は、サーバーと runner を更新してください。
2. 確実な出力が必要な場合は、**スクリプト内で出力をフラッシュする**:

```bash
#!/bin/bash
echo "Starting deploy"
echo "Done" >&2
```

重要な診断情報については、リポジトリのワークスペース内のファイルに書き込み、スクリプトの最後に `cat` してください。
3. **無言の早期終了を避ける**: 出力が少ない場合でも失敗が見えるように、`set -euo pipefail` と明示的なエラーメッセージを使用してください。

---

<a id="unable-to-read-ldap-response-packet-unexpected-eof"></a>

## unable to read LDAP response packet: unexpected EOF

おそらく、LDAP サーバーが安全な接続 (TLS 経由) を想定しているにもかかわらず、安全でない方法で接続しようとしています。

<a id="how-to-fix-this-5"></a>

### 対処方法

`config.json` ファイルで TLS を有効にします。

```json
...
"ldap_needtls": true
...
```

---

<a id="ldap-result-code-49-invalid-credentials"></a>

## LDAP Result Code 49 "Invalid Credentials"

パスワードまたは `binddn` が間違っています。

<a id="how-to-fix-this-6"></a>

### 対処方法

`ldapwhoami` ツールを使用して、binddn が機能するか確認します。

```bash
ldapwhoami\
  -H ldap://ldap.com:389\
  -D "CN=/your/ldap_binddn/value/in/config/file"\
  -x\
  -W
```

パスワードの入力を対話的に求められ、コード **0** を返して、指定した **DN** を出力するはずです。

次の記事も参考になります:
* [ldapsearch: Invalid credentials (49)](https://serverfault.com/q/771549/443463)
* [https://github.com/semaphoreui/semaphore/issues/906](https://github.com/semaphoreui/semaphore/issues/906)

---

<a id="ldap-result-code-32-no-such-object"></a>

## LDAP Result Code 32 "No Such Object"

Semaphore が問い合わせた識別名 (DN) にエントリが存在しません。ほとんどの場合は
`ldap_searchdn` の誤りであり、まれに `ldap_binddn` の誤りです。

<a id="how-to-fix-this-7"></a>

### 対処方法

Semaphore が使用しているものと同じ認証情報で、検索ベースが存在するかどうかを確認します:

```bash
ldapsearch\
  -H ldap://ldap.example.com:389\
  -D "CN=/your/ldap_binddn/value/in/config/file"\
  -b "/your/ldap_searchdn/value/in/config/file"\
  -x\
  -W\
  -s base
```

- このコマンドが結果コード **32** を返す場合は、ベース自体が存在しません。
  `config.json` の `ldap_searchdn` を修正してください。実際は `OU=People` なのに
  `OU=Users` と書いているような、構成要素の入力ミスが通常の原因です。
- 結果コード **0** の場合はベースに問題はなく、原因は `ldap_searchfilter` です。
  そのベースの配下にあるどのエントリにも一致していません。

各オプションの意味については [LDAP と AD](../../../docs/admin-guide/authentication/ldap.md) を参照してください。
