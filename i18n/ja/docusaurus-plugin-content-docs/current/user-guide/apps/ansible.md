
# Ansible

Semaphore UI を使用して Ansible playbook を実行できます。そのためには、**Ansible Playbook** テンプレートを作成する必要があります。

1. **タスクテンプレート**セクションに移動し、**新しいテンプレート**、次に **Ansible Playbook** をクリックします。

![](/assets/ansible_1.png)

2. テンプレートを設定します。

テンプレートでは次のパラメータを指定できます。

* リポジトリ
* playbook ファイルへのパス
* 作業ディレクトリ (任意)
* インベントリ
* 変数グループ
* Vault
* 追加の CLI 引数 (tags、skip-tags、limit、verbosity)
* 環境変数

![](/assets/ansible_2.png)

## 作業ディレクトリ {#working-directory}

**作業ディレクトリ**を使用すると、テンプレートのリポジトリのサブディレクトリから Ansible コマンドを実行できます。リポジトリのルートからの相対パスを入力します。たとえば、`ansible.cfg` が `<repository>/automation` に保存されている場合は `automation` と入力します。絶対パスとリポジトリ外のパスは拒否されます。省略した場合、Semaphore はリポジトリのルートを使用します。

作業ディレクトリは、プロセスのカレントディレクトリに依存する Ansible の動作に影響します。Ansible の[設定ファイルの検索順序][ansible-config-search]には、カレントディレクトリの `ansible.cfg` が含まれます。作業ディレクトリは、追加の CLI 引数内の相対パスの解決にも影響します。例として [`--extra-vars @vars.yml`][ansible-extra-vars-file] や [`--private-key key.pem`][ansible-private-key] があります。playbook とファイルインベントリのパスは、引き続きそれぞれのリポジトリのルートからの相対パスです。

作業ディレクトリを変更しても、それだけでそのディレクトリの `roles/` や `collections/` サブディレクトリが Ansible の検索パスに追加されるわけではありません。[playbook からの相対的なロール検出][ansible-role-search]と [playbook に隣接するコレクション][ansible-playbook-collections]は、引き続き playbook の場所を基準とします。ただし、選択された `ansible.cfg` が `roles_path` や `collections_path` を設定している場合は、作業ディレクトリが間接的にそれらの検出に影響することがあります。

[ansible-config-search]: https://docs.ansible.com/ansible/latest/reference_appendices/config.html#the-configuration-file
[ansible-extra-vars-file]: https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_variables.html#vars-from-a-json-or-yaml-file
[ansible-private-key]: https://docs.ansible.com/ansible/latest/cli/ansible-playbook.html#cmdoption-ansible-playbook-private-key
[ansible-role-search]: https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_reuse_roles.html#storing-and-finding-roles
[ansible-playbook-collections]: https://docs.ansible.com/ansible/latest/collections_guide/collections_installing.html#installing-collections-adjacent-to-playbooks

## テンプレートの種類 {#template-types}

ansible-playbook テンプレートは、次のいずれかの種類にできます。

* [Task](#task)
* [Build](#build)
* [Deploy](#deploy)

### Task {#task}

指定されたパラメータで、指定された playbook を実行するだけです。

*limit* 機能を使って API 呼び出しでテンプレートを起動する場合は、必ず *Ansible prompts: Limit* オプションを有効にしてください。そうしないと、API 呼び出しで設定された limit は無視されます。API でトリガーされたタスクでは対話的なプロンプトは表示されず、タスクは無人で実行されます。

### Build {#build}

この種類のテンプレートは、[アーティファクト](https://en.wikipedia.org/wiki/Artifact\_\(software\_development\))を作成するために使用します。アーティファクトの開始バージョンはテンプレートのパラメータで指定できます。実行ごとにアーティファクトのバージョンが増加します。

![](/assets/template_new_build_ipad1.png)

Semaphore は初期状態ではアーティファクトをサポートしておらず、タスクのバージョン管理のみを提供します。アーティファクトの作成は自分で実装する必要があります。その方法については、[CI/CD](../../admin-guide/cicd) の記事を参照してください。

### Deploy {#deploy}

この種類のテンプレートは、アーティファクトを配布先サーバーにデプロイするために使用します。各 `deploy` テンプレートは `build` テンプレートに関連付けられます。


これにより、アーティファクトの特定のバージョンをサーバーにデプロイできます。

## テンプレートのオプション {#template-options}

### スケジュール {#schedule}

テンプレート設定で cron スケジュールを指定して、タスクのスケジュール実行を設定できます。cron 式の形式は[ドキュメント](https://pkg.go.dev/github.com/robfig/cron/v3#hdr-CRON\_Expression\_Format)で確認できます。


#### リポジトリに新しい commit が追加されたときにタスクを実行する {#run-a-task-when-a-new-commit-is-added-to-the-repository}

cron を使用してリポジトリの新しい commit を定期的にチェックし、commit の到着時にタスクをトリガーできます。

たとえば、アプリのソースコードが Git リポジトリにあるとします。それを**リポジトリ**に追加し、新しい commit に対して Build タスクをトリガーできます。


### tags、skip-tags、limit {#tags-skip-tags-and-limit}

テンプレートは次の Ansible CLI オプションをサポートします。

- `--tags`
- `--skip-tags`
- `--limit`

これらはテンプレートで設定でき、タスクの作成時に上書きできます。API 経由でこれらの値を渡す予定がある場合は、対応するプロンプトが有効になっていることを確認してください。

### 並列実行 (`--forks` / `-f`) {#parallelism---forks---f}

テンプレートの**追加の CLI 引数**に `--forks` または
`-f` を渡すことで、Ansible が並列に接続するホスト数を制御できます。引数は有効な JSON である必要があります —
個別のトークンの配列を使用してください。

```json
["--forks", "10"]
```

短縮形もサポートされています。

```json
["-f", "10"]
```

テンプレートで**タスクでの引数の上書きを許可**が有効な場合、タスクは
実行時に独自の forks 値を指定できます。Ansible はテンプレートと
タスクの両方の引数を受け取り、コマンドライン上で最後にある `--forks` / `-f` が優先されます。

引数が有効な JSON でない場合、タスクは実行開始前に
わかりやすい検証エラーで失敗します。

### 認証 {#authentication}

playbook 内のホストの認証は、インベントリに設定されたキーストアのユーザー参照を使用して行われます。SSH のユーザーは、キーストア要素の任意のユーザー設定によって決まります。

### 複数の Vault パスワード {#multiple-vault-passwords}

キーストアから複数の Vault パスワードをテンプレートに添付できます。実行時、Ansible は指定されたパスワードで復号を試みます。

### 詳細度レベル {#verbosity-level}

トラブルシューティングに役立てるため、テンプレート/タスクのフォームからタスクの Ansible の詳細度 (例: `-v`、`-vvv`) を調整できます。
