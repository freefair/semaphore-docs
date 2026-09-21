# Azure の設定

```json title="config.json"
{
  "oidc_providers": {
    "azure": {
      "icon": "microsoft",
      "color": "blue",
      "display_name": "Sign in with EntraID",
      "client_id": "REDACTED",
      "client_secret": "REDACTED",
      "redirect_url": "https://YOUR_SEMAPHORE_HOST_AND_PORT/api/auth/oidc/azure/redirect",
      "endpoint": {
        "issuer": "https://login.microsoftonline.com/TENANT_ID/v2.0",
        "auth": "https://login.microsoftonline.com/TENANT_ID/oauth2/v2.0/authorize",
        "token": "https://login.microsoftonline.com/TENANT_ID/oauth2/v2.0/token",
        "userinfo": "https://graph.microsoft.com/oidc/userinfo",
        "jwks": "https://login.microsoftonline.com/TENANT_ID/discovery/v2.0/keys"
      },
      "scopes": ["openid", "email", "profile", "User.Read"]
    }
  }
}
```

<a id="idp-initiated-login"></a>

## IdP 起点のログイン

Semaphore は IdP 起点のログインを実装していません。`allow_idp_initiated` はサポートされるプロバイダーオプションではなく、`/initiate` ルートもありません。Microsoft Entra ID (Azure AD) は **My Apps** から Semaphore の **`/login`** エンドポイントを使って、サポートされるアプリケーション起点の Authorization Code フローを開始できます。

Azure ポータルで、**アプリの登録 → ブランド化とプロパティ**を開き、**ホームページ URL** を次のように設定します。

```
https://YOUR_SEMAPHORE_HOST_AND_PORT/api/auth/oidc/azure/login
```

ユーザーが My Apps で Semaphore のタイルをクリックすると、Entra はこの URL に移動し、通常の SP 起点の認可コードフローが開始されます。
