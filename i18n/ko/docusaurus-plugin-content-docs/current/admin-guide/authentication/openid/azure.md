# Azure 설정

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

## IdP 시작 로그인 {#idp-initiated-login}

Semaphore는 IdP 시작 로그인을 구현하지 않습니다. `allow_idp_initiated`는 지원되는 제공자 옵션이 아니며 `/initiate` 경로도 없습니다. Microsoft Entra ID(Azure AD)는 **My Apps**에서 Semaphore의 **`/login`** 엔드포인트를 통해 지원되는 애플리케이션 시작 Authorization Code 흐름을 시작할 수 있습니다.

Azure 포털에서 **App registration → Branding & properties**를 열고 **Home page URL**을 다음과 같이 설정합니다:

```
https://YOUR_SEMAPHORE_HOST_AND_PORT/api/auth/oidc/azure/login
```

사용자가 My Apps에서 Semaphore 타일을 클릭하면 Entra가 이 URL로 이동하며, 일반적인 SP 시작 Authorization Code 흐름이 시작됩니다.
