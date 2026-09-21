# パッケージマネージャー

> **Tip**
>
>   Python/Ansible/Systemd 環境のセットアップ方法については、[手動インストール](../installation_manually.md)を参照してください!

[リリースページ](https://github.com/semaphoreui/semaphore/releases)からパッケージファイルをダウンロードします。

&#x20;Debian と Ubuntu には `*.deb`、CentOS と RedHat には `*.rpm` を使用します。&#x20;

パッケージマネージャーごとのインストールコマンドは次のとおりです。

### Debian / Ubuntu (x64)

```bash
wget https://github.com/semaphoreui/semaphore/releases/\
download/v2.17.15/semaphore_2.17.15_linux_amd64.deb

sudo dpkg -i semaphore_2.17.15_linux_amd64.deb
```

### Debian / Ubuntu (ARM64)

```bash
wget https://github.com/semaphoreui/semaphore/releases/\
download/v2.17.15/semaphore_2.17.15_linux_arm64.deb

sudo dpkg -i semaphore_2.17.15_linux_arm64.deb
```

### CentOS (x64)

```bash
wget https://github.com/semaphoreui/semaphore/releases/\
download/v2.17.15/semaphore_2.17.15_linux_amd64.rpm

sudo yum install semaphore_2.17.15_linux_amd64.rpm
```

### CentOS (ARM64)

```bash
wget https://github.com/semaphoreui/semaphore/releases/\
download/v2.17.15/semaphore_2.17.15_linux_arm64.rpm

sudo yum install semaphore_2.17.15_linux_arm64.rpm
```

次のコマンドで Semaphore をセットアップします。

```
semaphore setup
```

これで Semaphore を起動できます。

```
semaphore server --config=./config.json
```

Semaphore には次の URL からアクセスできます: [https://localhost:3000](https://localhost:3000)。

----
