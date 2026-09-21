# API

<a id="api-reference"></a>

## API reference

Read the [Markdown endpoint reference](api-endpoints.md) for methods, paths, parameters and response schemas.
The source contracts live in the product repository as [api-docs.yml](https://github.com/freefair/semaphore-ex/blob/develop/api-docs.yml) and [api-docs-ex.yml](https://github.com/freefair/semaphore-ex/blob/develop/api-docs-ex.yml).
The Markdown manual is usable without Swagger UI or a documentation server.

<a id="getting-started-with-the-api"></a>

## Getting Started with the API

To start using the Semaphore API, you need to generate an API token.
This token must be included in the request header as:

```http
Authorization: Bearer YOUR_API_TOKEN
```

<a id="creating-an-api-token"></a>

### Creating an API Token

There are two ways to create an API token:
- Through the web interface
- Using HTTP request

<a id="through-the-web-interface-since-214"></a>

#### Through the web interface (since 2.14)

Open the account menu at the bottom of the sidebar and choose **API Tokens**. The page lists your tokens; the **API Reference** link on it opens the Swagger UI built into your instance.

![API Tokens](../../static/assets/api-tokens.webp)

Click **New Token**, enter a name, choose when the token expires, and copy the value shown after creation. See [Your account](../user-guide/account.md#api-tokens).

![New token dialog](../../static/assets/api-token-new.webp)

<a id="using-http-request"></a>

#### Using HTTP request

You can also authenticate and generate a session token using a direct HTTP request.

Login to Semaphore (password should be escaped, `slashy\\pass` instead of `slashy\pass` e.g.):

```bash
curl -v -c /tmp/semaphore-cookie -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-d '{"auth": "YOUR_LOGIN", "password": "YOUR_PASSWORD"}' \
http://localhost:3000/api/auth/login
```

Generate a new token, and get the new token:

```bash
curl -v -b /tmp/semaphore-cookie -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
http://localhost:3000/api/user/tokens
```

The command should return something similar to:

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

## Using token to make API requests

Once you have your API token, include it in the **Authorization** header to authenticate your requests.

<a id="launch-a-task"></a>

### Launch a task

Use this token for launching a task or anything else:

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

## Expiring an API token

If you no longer need the token, you should expire it to keep your account secure.

To manually revoke (expire) an API token, send a DELETE request to the token endpoint:

```bash
curl -v -XDELETE \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
http://localhost:3000/api/user/tokens/YOUR_ACCESS_TOKEN
```
