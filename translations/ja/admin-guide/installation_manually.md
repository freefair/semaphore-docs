# Semaphore の手動インストール

----

**目次:**

* [サービスユーザー](../../../docs/admin-guide/installation_manually.md#service-user)
* [Python3](../../../docs/admin-guide/installation_manually.md#python3)
* [Ansible コレクションとロール](../../../docs/admin-guide/installation_manually.md#ansible-collections--roles)
* [リバースプロキシ](../../../docs/admin-guide/installation_manually.md#reverse-proxy)
* [Systemd サービス](../../../docs/admin-guide/installation_manually.md#extended-systemd-service)
* [トラブルシューティング](../../../docs/admin-guide/installation_manually.md#troubleshooting)

----

このドキュメントでは、次のインストール方法を使用する場合の Semaphore のセットアップ方法を詳しく説明します。

* [パッケージマネージャー](../../../docs/admin-guide/installation/package-manager.md)
* [バイナリファイル](../../../docs/admin-guide/installation/binary-file.md)

Semaphore のソフトウェアパッケージは、Ansible を正常に実行するために必要なシステム全体の一部にすぎません。

Python3 と Ansible の実行環境も非常に重要です!

注: このセットアップロジックを代わりに処理してくれる、または独自の Ansible ロールのベーステンプレートとして使用できる [Ansible Galaxy ロール](https://galaxy.ansible.com/search?deprecated=false&keywords=ansible%20semaphore&order_by=-relevance&page=1)が既に存在します!

----

<a id="service-user"></a>

## サービスユーザー

Semaphore を `root` ユーザーとして実行する必要はありません。そのため、root で実行すべきではありません。

サービスユーザーを使用する **メリット**:
* 独自のユーザー設定を持つ
* 独自の環境を持つ
* プロセスを簡単に識別できる
* システムのセキュリティが向上する

システムユーザーは、`adduser` を使用して手動で作成することも、[ansible.builtin.user](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/user_module.html) モジュールを使用して作成することもできます。

このドキュメントでは、次のことを前提とします。
* 作成するサービスユーザーの名前は `semaphore`
* シェルとして `/bin/bash` が設定されている
* ホームディレクトリは `/home/semaphore`

<a id="troubleshooting"></a>

### トラブルシューティング

Semaphore による Ansible の実行が失敗する場合は、サービスユーザーのコンテキストでトラブルシューティングを行う必要があります。

これには複数の方法があります。

* シェルセッション全体をそのユーザーのコンテキストに切り替える:

  ```bash
  sudo su --login semaphore
  ```

* そのユーザーのコンテキストで単一のコマンドを実行する:

  ```bash
  sudo --login -u semaphore <command>
  ```

----

<a id="python3"></a>

## Python3

[Ansible](https://docs.ansible.com/ansible/latest/getting_started/index.html) は [Python3](https://docs.python.org/3/) プログラミング言語で構築されています。

そのため、Ansible が正しく動作するには Python3 が正しくセットアップされていることが不可欠です。

まず、`python3` と `python3-pip` パッケージがシステムにインストールされていることを確認してください!

必要な Python モジュールをインストールするには複数の方法があります。
* サービスユーザーのコンテキストにインストールする
* サービス専用の[仮想環境](https://virtualenv.pypa.io/en/latest/)にインストールする

<a id="requirements"></a>

### Requirements

どちらの方法でも、インストールが必要なモジュールを `requirements.txt` ファイルで指定することをおすすめします。

ここでは `/home/semaphore/requirements.txt` ファイルを使用することを前提とします。

内容の例を次に示します。

```text
ansible
# for common jinja-filters
netaddr
jmespath
# for common modules
pywinrm
passlib
requests
docker
```

注: これらの requirements も定期的に更新してください!

これを自動で行う方法は、後述のサービスの例でも示しています。

<a id="modules-in-user-context"></a>

### ユーザーコンテキストのモジュール

**手動**:

```bash
sudo --login -u semaphore python3 -m pip install --user --upgrade -r /home/semaphore/requirements.txt
```

**Ansible を使用**:

```yaml
- name: Install requirements
  ansible.builtin.pip:
    requirements: '/home/semaphore/requirements.txt'
    extra_args: '--user --upgrade'
  become_user: 'semaphore'
```

<a id="modules-in-a-virtualenv"></a>

### virtualenv 内のモジュール

ここでは virtualenv が `/home/semaphore/venv` に作成されていることを前提とします。

サービス内で仮想環境が有効化されていることを確認してください! これも後述のサービスの例で示しています。

**手動**:
```bash
sudo su --login semaphore
python3 -m pip install --user virtualenv
python3 -m venv /home/semaphore/venv
# activate the context of the virtual environment
source /home/semaphore/venv/bin/activate
# verify we are using python3 from inside the venv
which python3
> /home/semaphore/venv/bin/python3
python3 -m pip install --upgrade -r /home/semaphore/requirements.txt
# disable the context to the virtual environment
deactivate
```

**Ansible を使用**:

```yaml
- name: Create virtual environment and install requirements into it
  ansible.builtin.pip:
    requirements: '/home/semaphore/requirements.txt'
    virtualenv: '/home/semaphore/venv'
    state: present  # or 'latest' to upgrade the requirements
```

<a id="troubleshooting-1"></a>

#### トラブルシューティング

仮想環境の使用中に Python3 の問題が発生した場合は、そのコンテキストに切り替えてトラブルシューティングを行う必要があります。

```bash
sudo su --login semaphore
source /home/semaphore/venv/bin/activate
# verify we are using python3 from inside the venv
which python3
> /home/semaphore/venv/bin/python3

# troubleshooting

deactivate
```

システムのアップグレードによって仮想環境が壊れることもあります。その場合は、既存の仮想環境を削除して再作成するだけで済むことがあります。

----

<a id="ansible-collections--roles"></a>

## Ansible コレクションとロール

タスクを実行するたびにインストールする必要がないよう、Ansible のモジュールとロールを事前にインストールしておくとよいでしょう!

<a id="requirements-1"></a>

### Requirements

インストールが必要なモジュールを `requirements.yml` ファイルで指定することをおすすめします。

ここでは `/home/semaphore/requirements.yml` ファイルを使用することを前提とします。

内容の例を次に示します。

```yaml
---

collections:
  - 'namespace.collection'
  # for common collections:
  - 'community.general'
  - 'ansible.posix'
  - 'community.mysql'
  - 'community.crypto'

roles:
  - src: 'namespace.role'
```

関連項目: [コレクションのインストール](https://docs.ansible.com/ansible/latest/galaxy/user_guide.html#installing-a-collection-from-galaxy)、[ロールのインストール](https://docs.ansible.com/ansible/latest/galaxy/user_guide.html#installing-multiple-roles-from-a-file)

注: これらの requirements も定期的に更新してください!

これを自動で行う方法は、後述のサービスの例でも示しています。

<a id="install-in-user-context"></a>

### ユーザーコンテキストへのインストール

**手動**:
```bash
sudo su --login semaphore
ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml
ansible-galaxy role install --force -r /home/semaphore/requirements.yml
```

<a id="install-when-using-a-virtualenv"></a>

### virtualenv 使用時のインストール

**手動**:
```bash
sudo su --login semaphore
source /home/semaphore/venv/bin/activate
# verify we are using python3 from inside the venv
which python3
> /home/semaphore/venv/bin/python3

ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml
ansible-galaxy role install --force -r /home/semaphore/requirements.yml

deactivate
```

----

<a id="reverse-proxy"></a>

## リバースプロキシ

参照: [セキュリティ - 暗号化された接続](../../../docs/admin-guide/security/network.md#reverse-proxy)

----

<a id="extended-systemd-service"></a>

## Systemd サービスの詳細

systemd サービスの基本テンプレートを次に示します。

追加の設定は、それぞれの `[PART]` の下に追加してください

<a id="base"></a>

### ベース

```ini
[Unit]
Description=Semaphore UI
Documentation=https://github.com/freefair/semaphore-docs
Wants=network-online.target
After=network-online.target
ConditionPathExists=/usr/bin/semaphore
ConditionPathExists=/etc/semaphore/config.json

[Service]
ExecStart=/usr/bin/semaphore server --config /etc/semaphore/config.json
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=10s

[Install]
WantedBy=multi-user.target
```

<a id="service-user-1"></a>

### サービスユーザー

```ini
[Service]
User=semaphore
Group=semaphore
```

----

<a id="python-modules"></a>

### Python モジュール

<a id="in-user-context"></a>

#### ユーザーコンテキストの場合

```ini
[Service]
# to auto-upgrade python modules at service startup
ExecStartPre=/bin/bash -c 'python3 -m pip install --upgrade --user -r /home/semaphore/requirements.txt'

# so the executables are found
Environment="PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/home/semaphore/.local/bin"
# set the correct python path. You can get the correct path with: python3 -c "import site; print(site.USER_SITE)"
Environment="PYTHONPATH=/home/semaphore/.local/lib/python3.10/site-packages"
```

<a id="in-virtualenv"></a>

#### virtualenv の場合

```ini
[Service]
# to auto-upgrade python modules at service startup
ExecStartPre=/bin/bash -c 'source /home/semaphore/venv/bin/activate \
                           && python3 -m pip install --upgrade -r /home/semaphore/requirements.txt'

# REPLACE THE EXISTING 'ExecStart'
ExecStart=/bin/bash -c 'source /home/semaphore/venv/bin/activate \
                        && /usr/bin/semaphore server --config /etc/semaphore/config.json'
```

----

<a id="ansible-collections--roles-1"></a>

### Ansible コレクションとロール

<a id="if-using-python3-in-user-context"></a>

#### ユーザーコンテキストの Python3 を使用する場合

```ini
[Service]
# to auto-upgrade ansible collections and roles at service startup
ExecStartPre=/bin/bash -c 'ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml'
ExecStartPre=/bin/bash -c 'ansible-galaxy role install --force -r /home/semaphore/requirements.yml'
```

<a id="if-using-python3-in-virtualenv"></a>

#### virtualenv の Python3 を使用する場合

```ini
# to auto-upgrade ansible collections and roles at service startup
ExecStartPre=/bin/bash -c 'source /home/semaphore/venv/bin/activate \
                           && ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml \
                           && ansible-galaxy role install --force -r /home/semaphore/requirements.yml'
```

----

<a id="other-use-cases"></a>

### その他のユースケース

<a id="using-local-mariadb"></a>

#### ローカルの MariaDB を使用する場合

```ini
[Unit]
Requires=mariadb.service
```

<a id="using-local-nginx"></a>

#### ローカルの Nginx を使用する場合

```ini
[Unit]
Wants=nginx.service
```

<a id="sending-logs-to-syslog"></a>

#### ログを syslog に送信する場合

```ini
[Service]
StandardOutput=journal
StandardError=journal
SyslogIdentifier=semaphore
```

<a id="full-examples"></a>

### 完全な例

<a id="python-modules-in-user-context"></a>

#### ユーザーコンテキストの Python モジュール

```ini
[Unit]
Description=Semaphore UI
Documentation=https://github.com/freefair/semaphore-docs
Wants=network-online.target
After=network-online.target
ConditionPathExists=/usr/bin/semaphore
ConditionPathExists=/etc/semaphore/config.json

[Service]
User=semaphore
Group=semaphore
Restart=always
RestartSec=10s
Environment="PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:~/.local/bin"

ExecStartPre=/bin/bash -c 'ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml'
ExecStartPre=/bin/bash -c 'ansible-galaxy role install --force -r /home/semaphore/requirements.yml'
ExecStartPre=/bin/bash -c 'python3 -m pip install --upgrade --user -r /home/semaphore/requirements.txt'

ExecStart=/usr/bin/semaphore server --config /etc/semaphore/config.json
ExecReload=/bin/kill -HUP $MAINPID

[Install]
WantedBy=multi-user.target
```

<a id="python-modules-in-virtualenv"></a>

#### virtualenv の Python モジュール

```ini
[Unit]
Description=Semaphore UI
Documentation=https://github.com/freefair/semaphore-docs
Wants=network-online.target
After=network-online.target
ConditionPathExists=/usr/bin/semaphore
ConditionPathExists=/etc/semaphore/config.json

[Service]
User=semaphore
Group=semaphore
Restart=always
RestartSec=10s

ExecStartPre=/bin/bash -c 'source /home/semaphore/venv/bin/activate \
                           && python3 -m pip install --upgrade -r /home/semaphore/requirements.txt'
ExecStartPre=/bin/bash -c 'source /home/semaphore/venv/bin/activate \
                           && ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml \
                           && ansible-galaxy role install --force -r /home/semaphore/requirements.yml'

ExecStart=/bin/bash -c 'source /home/semaphore/venv/bin/activate \
                        && /usr/bin/semaphore server --config /etc/semaphore/config.json'
ExecReload=/bin/kill -HUP $MAINPID

[Install]
WantedBy=multi-user.target
```

<a id="fixes"></a>

### 修正

システムにカスタムの言語設定をしている場合、問題が発生することがあります。これは関連する環境変数を更新することで解決できます。

```ini
[Service]
Environment=LANG="en_US.UTF-8"
Environment=LC_ALL="en_US.UTF-8"
```

----

<a id="troubleshooting-2"></a>

## トラブルシューティング

タスクの実行中に問題が発生した場合、それは Semaphore 自体の問題ではなく、セットアップ環境の問題である可能性があります!

問題が Semaphore の外部で発生しているかどうかを確認するため、次の手順を実行してください。

- ユーザーのコンテキストに切り替えます。

  ```bash
  sudo su --login semaphore
  ```

- virtualenv を使用している場合は、そのコンテキストに切り替えます。

  ```ini
  source /home/semaphore/venv/bin/activate
  # verify we are using python3 from inside the venv
  which python3
  > /home/semaphore/venv/bin/python3

  # troubleshooting

  deactivate
  ```

- Ansible playbook を手動で実行します

  - **失敗する** 場合 => 環境に問題があります
  - **成功する** 場合:
    - Semaphore 内の設定を再確認してください
    - Semaphore の問題である可能性があります
