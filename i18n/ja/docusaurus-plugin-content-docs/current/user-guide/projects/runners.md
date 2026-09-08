
# プロジェクト runner (Pro)

プロジェクト runner は、複数のサーバーにまたがる分散タスク実行を可能にする Semaphore Pro の強力な機能です。この機能により、Semaphore UI インスタンスとは別のサーバーでタスクを実行でき、セキュリティ、スケーラビリティ、リソース管理が向上します。

![](/assets/project_runners.webp)

## 概要 {#overview}

プロジェクト runner は、GitLab や GitHub Actions の runner と同様の原理で動作します。

- runner は Semaphore UI とは別のサーバーにデプロイされます
- runner はセキュアなトークンを使用して Semaphore インスタンスに接続します
- タスクが作成されると、Semaphore は利用可能な runner にタスクを委任します
- runner はタスクを実行し、結果を Semaphore に報告します

## 利点 {#benefits}

runner を使用すると、次のような重要な利点があります。

1. **セキュリティの強化**
   - runner を隔離された環境や制限されたネットワークにデプロイできます
   - 機密性の高い操作を管理された環境で実行できます
   - UI と実行環境の間で関心事をより適切に分離できます

2. **スケーラビリティの向上**
   - 複数のサーバーに負荷を分散できます
   - 需要に応じて runner を追加または削除できます
   - インフラストラクチャ全体でリソースをより効率的に利用できます

3. **柔軟なデプロイ**
   - 対象のインフラストラクチャの近くに runner をデプロイできます
   - 異なるネットワークゾーンでタスクを実行できます
   - さまざまなデプロイモデル (オンプレミス、クラウド、ハイブリッド) に対応します

## プロジェクト runner の使用 {#using-project-runners}

### 前提条件 {#prerequisites}

runner を使用するには、次のものが必要です。

1. Semaphore Pro のライセンス
2. runner を実行するための別のサーバー
3. runner と Semaphore UI 間のネットワーク接続
4. Semaphore UI サーバーと runner サーバーの両方での適切な設定

<!-- ### Configuration

1. **Semaphore UI Configuration**
  

2. **Runner Setup** -->


### runner の管理 {#managing-runners}

runner は Semaphore UI から管理できます。

1. プロジェクトの runner セクションに移動します
2. 登録済みのすべての runner とそのステータスを確認します
3. 必要に応じて runner を追加または削除します
4. runner の正常性とパフォーマンスを監視します

### セキュリティに関する考慮事項 {#security-considerations}

- runner と Semaphore UI 間の通信には常に HTTPS を使用してください
- runner と Semaphore UI 間で適切なネットワークセキュリティを実装してください
- 機密性の高い操作には隔離された環境の使用を検討してください

## ベストプラクティス {#best-practices}

1. **リソース計画**
   - ワークロードに合わせて runner のサイズを適切に設定する
   - runner のリソース使用量を監視する
   - 需要に応じて runner をスケールする

2. **ネットワーク設定**
   - 適切なネットワーク接続を確保する
   - ファイアウォールを適切に設定する
   - セキュアな通信チャネルを使用する

3. **メンテナンス**
   - runner のソフトウェアを定期的に更新する
   - runner の正常性を監視する
   - 適切なロギングと監視を実装する
   - runner の障害に備えたバックアップ戦略を用意する

4. **セキュリティ**
   - 最小権限の原則に従う
   - 適切なアクセス制御を実装する
   - 定期的なセキュリティ監査を行う
   - ソフトウェアを最新の状態に保つ
