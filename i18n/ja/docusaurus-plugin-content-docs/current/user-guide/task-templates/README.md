# タスクテンプレート

テンプレートは、Semaphore のタスクをどのように実行するかを定義します。現在、次のタスクタイプがサポートされています。

* [Ansible](/user-guide/apps/ansible)
* [Terraform/OpenTofu](/user-guide/apps/terraform)
* [Shell](/user-guide/apps/bash)
* [Powershell](/user-guide/apps/powershell)
* [Python](/user-guide/apps/python)

---

## 並列タスク {#parallel-tasks}

デフォルトでは、同じテンプレートのタスクは順番に実行されます。同じテンプレートの同時実行を許可するには、テンプレート設定で「並列タスクを許可」オプションを有効にします。

## 実行イメージ（Docker および Kubernetes runner） {#executor-image-docker-and-kubernetes-runners}

プロジェクトの runner が **Docker**（Pro）または **Kubernetes**（Enterprise）エグゼキューターを使用している場合、各タスクは通常、runner に設定されたデフォルトのジョブイメージ（例: `semaphoreui/job:latest`）で実行されます。このイメージはテンプレートごとに上書きできます。

1. テンプレート設定を開きます
2. **実行イメージ**にコンテナイメージの参照を設定します（例: `my-registry/ansible:2.16` または `semaphoreui/job:latest`）
3. テンプレートを保存します

**動作**:
- このフィールドを考慮するのは **Docker** および **Kubernetes** の runner エグゼキューターのみです。ローカルエグゼキューターでは無視されます
- フィールドを空のままにすると、`runner.executor.docker.image` または `runner.executor.k8s.image` で設定された runner のデフォルトイメージが使用されます
- UI でフィールドをクリアすると、上書きが解除されます

**ユースケース**:
- 別のツールチェーンが必要なテンプレート（古いバージョンの Ansible、特定バージョンの Terraform、カスタムイメージに組み込んだ追加の OS パッケージなど）
- runner 全体のデフォルトを変更せずに、セキュリティ上重要なテンプレート向けに分離されたイメージを使用する場合

デフォルトイメージの設定については [Runner の設定](/admin-guide/configuration)を、エグゼキューターのセットアップについては[プロジェクト runner](/user-guide/projects/runners)を参照してください。
