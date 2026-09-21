# インストール

Semaphore は、オペレーティングシステム、環境、好みに応じて、さまざまな方法でインストールできます。

<a id="in-this-section"></a>

## このセクションの内容

| 方法 | 適した用途 |
|---|---|
| [パッケージマネージャー](../../../docs/admin-guide/installation/package-manager.md) | Linux ディストリビューション向けのネイティブパッケージを使いたい場合。 |
| [Docker](../../../docs/admin-guide/installation/docker.md) | Docker または Docker Compose を使ってコンテナ内で Semaphore を実行したい場合。 |
| [クラウド](../../../docs/admin-guide/installation/cloud.md) | クラウドプラットフォームにデプロイし、マネージドサービスやインフラに関する情報が必要な場合。 |
| [バイナリファイル](../../../docs/admin-guide/installation/binary-file.md) | コンパイル済みバイナリをインストールし、プロセスを自分で管理したい場合。 |
| [Kubernetes (Helm チャート)](../../../docs/admin-guide/installation/k8s.md) | すでに Kubernetes を使っており、Helm でデプロイを管理したい場合。 |

<a id="installing-additional-python-packages"></a>

## 追加の Python パッケージのインストール

一部の Ansible モジュールやロールは、実行に追加の Python パッケージを必要とします。追加の Python パッケージをインストールするには、`requirements.txt` ファイルを作成し、コンテナの `/etc/semaphore` ディレクトリにマウントします。たとえば、`docker-compose.yml` ファイルに次の行を追加します。

```yaml
volumes:
  - /path/to/requirements.txt:/etc/semaphore/requirements.txt
```

requirements ファイルで指定されたパッケージは、コンテナが起動するたびに、同梱の Ansible 仮想環境にインストールされます。同じマウントは `semaphoreui/runner` イメージでも機能します。詳細とカスタムイメージを使う代替方法については、[追加の Python 依存関係のインストール](../../../docs/admin-guide/installation/docker.md#installing-additional-python-dependencies)を参照してください。

Python の requirements ファイルの詳細については、[Pip Requirements File Format リファレンス](https://pip.pypa.io/en/stable/reference/requirements-file-format/)を参照してください

<a id="where-to-start"></a>

## はじめに

デプロイ環境に合ったガイドから始めてください。バイナリをインストールする場合は、Semaphore を継続して実行するためにサービスとして実行する手順に従ってください。サービスユーザー、Python の依存関係、systemd の設定については、手動インストールのガイドを参照してください。

* [サービスとして実行する](../../../docs/admin-guide/installation/binary-file.md#run-as-a-service)
* [手動インストール](../../../docs/admin-guide/installation_manually.md)
