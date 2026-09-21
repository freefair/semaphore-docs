# Python

Semaphore は Python スクリプトを直接実行できます。そのためには、**Python** タスクテンプレートを作成します。

<a id="creating-a-python-template"></a>

## Python テンプレートの作成

1. **タスクテンプレート**セクションに移動し、**新しいテンプレート**ボタンをクリックします。
2. アプリの種類として **Python** を選択します。
3. テンプレートを設定します:

| フィールド | 説明 |
|---|---|
| **名前** | テンプレートのわかりやすい名前 |
| **リポジトリ** | `.py` スクリプトを含むリポジトリ |
| **Playbook / スクリプト** | スクリプトへの相対パス (例: `scripts/deploy.py`) |
| **変数グループ** | 値が環境変数として注入される変数グループ |

4. **作成**をクリックします。
5. **実行**をクリックしてテンプレートを実行します。

<a id="passing-variables-to-scripts"></a>

## スクリプトへの変数の受け渡し

選択した**変数グループ**の変数は、環境変数として注入されます。Python 内では `os.environ` でアクセスします。

```python
import os

target = os.environ.get("TARGET_HOST")
print(f"Deploying to {target}")
```

<a id="python-version-and-dependencies"></a>

## Python のバージョンと依存関係

Semaphore は、実行環境の `PATH` 上にある `python3` バイナリをそのまま使用します。

- **バイナリ/パッケージによるインストール**: ホストに正しい `python3` がインストールされていることを確認してください。
- **Docker**: 必要な Python バージョンを含むカスタムイメージを使用してください。
- **Docker (追加パッケージ)**: サーバーまたは runner のコンテナ内の `/etc/semaphore/requirements.txt` に `requirements.txt` をマウントします。Semaphore はコンテナの起動ごとに、同梱の Python 仮想環境にそれをインストールします。[追加の Python 依存関係のインストール](../../../../docs/admin-guide/installation/docker.md#installing-additional-python-dependencies)を参照してください。

<a id="notes"></a>

## 注意事項

- スクリプトは非対話的に実行されます。
- 終了コード `0` は成功を意味し、0 以外の終了コードはタスクを失敗としてマークします。
