# Azure 配置

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

## IdP 发起的登录 {#idp-initiated-login}

Semaphore 不实现 IdP 发起的登录。`allow_idp_initiated` 不是受支持的提供方选项，也不存在 `/initiate` 路由。Microsoft Entra ID（Azure AD）可以从 **My Apps** 通过 Semaphore 的 **`/login`** 端点启动受支持的应用发起的授权码流程。

在 Azure 门户中，打开你的 **App registration → Branding & properties**，并将 **Home page URL** 设置为：

```
https://YOUR_SEMAPHORE_HOST_AND_PORT/api/auth/oidc/azure/login
```

当用户在 My Apps 中点击 Semaphore 图块时，Entra 会跳转到该 URL，从而开始一次正常的 SP 发起的授权码流程。
