# API

<a id="api-reference"></a>

## API リファレンス

Semaphore UI は 2 つの形式の API ドキュメントを提供しているため、ワークフローに最も適したものを選択できます。

* [Swagger/OpenAPI](../../../docs/reference/api.md) &mdash; ブラウザ上で対話的に操作したい場合に最適です。
* [公式 Postman コレクション](https://www.postman.com/semaphoreui) &mdash; Postman ですべてのエンドポイントを調べてテストできます。
* **組み込みの Swagger API ドキュメント** &mdash; Swagger UI による対話的な API ドキュメントです。ご利用のインスタンス上でアクセスできます。

![](../../../static/assets/swagger-link.webp)

いずれの方法でも、利用可能なエンドポイント、パラメーター、レスポンス例の完全なドキュメントが含まれています。

<a id="getting-started-with-the-api"></a>

## API を使い始める

Semaphore API を使い始めるには、API トークンを生成する必要があります。
このトークンは、次のようにリクエストヘッダーに含めてください。

```http
Authorization: Bearer YOUR_API_TOKEN
```

<a id="creating-an-api-token"></a>

### API トークンの作成

API トークンを作成する方法は 2 つあります。
- Web インターフェースから
- HTTP リクエストを使用する

<a id="through-the-web-interface-since-214"></a>

#### Web インターフェースから（2.14 以降）

サイドバー下部のアカウントメニューを開き、**API トークン** を選択します。このページにはトークンの一覧が表示され、ページ上の **API リファレンス** リンクから、ご利用のインスタンスに組み込まれた Swagger UI を開けます。

![API トークン](../../../static/assets/api-tokens.webp)

**新しいトークン** をクリックし、名前を入力し、トークンの有効期限を選択して、作成後に表示される値をコピーします。[アカウント](../../../docs/user-guide/account.md#api-tokens)を参照してください。

![新しいトークンのダイアログ](../../../static/assets/api-token-new.webp)

<a id="using-http-request"></a>

#### HTTP リクエストを使用する

直接 HTTP リクエストを送信して認証し、セッショントークンを生成することもできます。

Semaphore にログインします（パスワードはエスケープが必要です。たとえば `slashy\pass` ではなく `slashy\\pass` とします）。

```bash
curl -v -c /tmp/semaphore-cookie -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-d '{"auth": "YOUR_LOGIN", "password": "YOUR_PASSWORD"}' \
http://localhost:3000/api/auth/login
```

新しいトークンを生成し、そのトークンを取得します。

```bash
curl -v -b /tmp/semaphore-cookie -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
http://localhost:3000/api/user/tokens
```

このコマンドは次のような結果を返します。

```json
{
    "id": "YOUR_ACCESS_TOKEN",
    "created": "2025-05-21T02:35:12Z",
    "expired": false,
    "user_id": 3
}
```
---

<a id="using-token-to-make-api-requests"></a>

## トークンを使用して API リクエストを送信する

API トークンを取得したら、それを **Authorization** ヘッダーに含めてリクエストを認証します。

<a id="launch-a-task"></a>

### タスクの起動

タスクの起動やその他の操作には、このトークンを使用します。

```bash
curl -v -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
-d '{"template_id": 1}' \
http://localhost:3000/api/project/1/tasks
```

---

<a id="expiring-an-api-token"></a>

## API トークンの失効

トークンが不要になった場合は、アカウントの安全を保つために失効させてください。

API トークンを手動で取り消す（失効させる）には、トークンのエンドポイントに DELETE リクエストを送信します。

```bash
curl -v -XDELETE \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
http://localhost:3000/api/user/tokens/YOUR_ACCESS_TOKEN
```
