# API

## API リファレンス {#api-reference}

Semaphore UI は 2 種類の形式で API ドキュメントを提供しているため、ワークフローに最も合うものを選べます:

* [Swagger/OpenAPI](https://semaphoreui.com/api-docs) &mdash; ブラウザ上で対話的に操作したい場合に最適です。
* [公式 Postman コレクション](https://www.postman.com/semaphoreui) &mdash; Postman ですべてのエンドポイントを探索・テストできます。
* **組み込みの Swagger API ドキュメント** &mdash; Swagger UI による対話型の API ドキュメントです。自身のインスタンス上でアクセスできます。

![](/assets/swagger-link.webp)

いずれの形式にも、利用可能なエンドポイント、パラメーター、レスポンス例の完全なドキュメントが含まれています。

## API の利用を始める {#getting-started-with-the-api}

Semaphore API を使い始めるには、API トークンを生成する必要があります。
このトークンは、次のようにリクエストヘッダーに含める必要があります:

```http
Authorization: Bearer YOUR_API_TOKEN
```

### API トークンの作成 {#creating-an-api-token}

API トークンを作成する方法は 2 つあります:
- Web インターフェースから作成する
- HTTP リクエストを使用する

#### Web インターフェースから作成する (2.14 以降) {#through-the-web-interface-since-214}

Semaphore の Web UI から API トークンを作成・管理できます:

![API トークン](https://www.semaphoreui.com/uploads/v2.14/tokens.webp)

#### HTTP リクエストを使用する {#using-http-request}

直接 HTTP リクエストを送って認証し、セッショントークンを生成することもできます。

Semaphore にログインします (パスワードはエスケープする必要があります。例: `slashy\pass` ではなく `slashy\\pass`):

```bash
curl -v -c /tmp/semaphore-cookie -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-d '{"auth": "YOUR_LOGIN", "password": "YOUR_PASSWORD"}' \
http://localhost:3000/api/auth/login
```

新しいトークンを生成し、そのトークンを取得します:

```bash
curl -v -b /tmp/semaphore-cookie -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
http://localhost:3000/api/user/tokens
```

このコマンドは次のような結果を返します:

```json
{
    "id": "YOUR_ACCESS_TOKEN",
    "created": "2025-05-21T02:35:12Z",
    "expired": false,
    "user_id": 3
}
```
---

## トークンを使って API リクエストを行う {#using-token-to-make-api-requests}

API トークンを取得したら、リクエストを認証するために **Authorization** ヘッダーに含めます。

### タスクの起動 {#launch-a-task}

このトークンを使って、タスクの起動やその他の操作を行います:

```bash
curl -v -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
-d '{"template_id": 1}' \
http://localhost:3000/api/project/1/tasks
```

---

## API トークンの失効 {#expiring-an-api-token}

トークンが不要になった場合は、アカウントの安全を保つために失効させてください。

API トークンを手動で取り消す (失効させる) には、トークンのエンドポイントに DELETE リクエストを送信します:

```bash
curl -v -XDELETE \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
http://localhost:3000/api/user/tokens/YOUR_ACCESS_TOKEN
```
