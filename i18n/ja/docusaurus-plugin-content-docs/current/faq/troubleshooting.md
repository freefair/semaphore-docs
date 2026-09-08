# トラブルシューティング

## 1. Runner がエラー 404 を出力する {#1-runner-prints-error-404}

### 対処方法 {#how-to-fix}

[Runner から 401 エラーコードが返される](https://github.com/semaphoreui/semaphore/discussions/1873?converting=1)

---

## 2. localhost での Gathering Facts の問題 {#2-gathering-facts-issue-for-localhost}

この問題は、[Snap](https://snapcraft.io/semaphore) または [Docker](https://hub.docker.com/r/semaphoreui/semaphore) でインストールした Semaphore UI で発生することがあります。

```
4:10:16 PM
TASK [Gathering Facts] *********************************************************
4:10:17 PM
fatal: [localhost]: FAILED! => changed=false
```

### 原因 {#why-this-happens}

Ansible での localhost の使用について詳しくは、[Implicit 'localhost'](https://docs.ansible.com/ansible/latest/inventory/implicit_localhost.html) の記事を参照してください。

Ansible はローカルでファクトを収集しようとしますが、Ansible は制限された分離コンテナ内にあるため、これが許可されません。

### 対処方法 {#how-to-fix-this}

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
## 3. panic: pq: SSL is not enabled on the server {#3-panic-pq-ssl-is-not-enabled-on-the-server}

これは、お使いの Postgres が SSL で動作していないことを意味します。

### 対処方法 {#how-to-fix-this-1}

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


## 4. fatal: bad numeric config value '0' for 'GIT_TERMINAL_PROMPT': invalid unit {#4-fatal-bad-numeric-config-value-0-for-git_terminal_prompt-invalid-unit}

これは、認証が必要なリポジトリに HTTPS でアクセスしようとしていることを意味します。

### 対処方法 {#how-to-fix-this-2}

* **キーストア**画面に移動します。
* `Login with password` タイプの新しいキーを作成します。
* GitHub/BitBucket などのログイン名を指定します。
* パスワードを指定します。GitHub/BitBucket ではアカウントのパスワードは使用できないため、代わりに Personal Access Token (PAT) を使用する必要があります。詳細は[こちら](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)を参照してください。
* キーを作成したら、**リポジトリ**画面に移動し、対象のリポジトリを見つけてキーを指定します。


---

## 5. Git のクローンまたはプルが断続的に失敗する {#5-git-clone-or-pull-fails-intermittently}

タスクログに `Git pull failed (...), retrying in 2s` のようなメッセージが表示され、その後に成功するか、数回の試行の後に最終的に失敗することがあります。

### 原因 {#why-this-happens-1}

Git サーバーに一時的に到達できなかったか、一時的なエラーが返されました。Semaphore はタスクを失敗にする前に、クローンとプルの操作を自動的に再試行します。

### 対処方法 {#how-to-fix-this-3}

1. **一時的な障害**: 通常は自動的に解消します。Semaphore は指数バックオフを挟みながら、最大 `git_attempts` 回 (デフォルト 4) 再試行します。
2. **頻繁な失敗**: 設定で `git_attempts` を増やすか、`SEMAPHORE_GIT_ATTEMPTS` を設定します。
3. **即座に一貫して失敗する**: リポジトリの URL、ブランチ、アクセスキー、およびネットワーク接続を確認してください。

設定の詳細については、[Git 操作](/admin-guide/configuration/config-file#git-operations)を参照してください。

---

## 6. unable to read LDAP response packet: unexpected EOF {#6-unable-to-read-ldap-response-packet-unexpected-eof}

おそらく、LDAP サーバーが安全な接続 (TLS 経由) を想定しているにもかかわらず、安全でない方法で接続しようとしています。

### 対処方法 {#how-to-fix-this-4}

`config.json` ファイルで TLS を有効にします。

```json
...
"ldap_needtls": true
...
```

---

## 7. LDAP Result Code 49 "Invalid Credentials" {#7-ldap-result-code-49-invalid-credentials}

パスワードまたは `binddn` が間違っています。

### 対処方法 {#how-to-fix-this-5}

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

## 8. LDAP Result Code 32 "No Such Object" {#8-ldap-result-code-32-no-such-object}

近日公開予定です。
