# Configuração do Azure

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

## Login iniciado pelo IdP

O Semaphore não implementa login iniciado pelo IdP. `allow_idp_initiated` não é uma opção de provedor suportada e não existe uma rota `/initiate`. O Microsoft Entra ID (Azure AD) pode iniciar o fluxo Authorization Code suportado e iniciado pela aplicação a partir de **My Apps** pelo endpoint **`/login`** do Semaphore.

No portal do Azure, abra o seu **App registration → Branding & properties** e defina a **Home page URL** como:

```
https://YOUR_SEMAPHORE_HOST_AND_PORT/api/auth/oidc/azure/login
```

Quando um usuário clica no bloco do Semaphore no My Apps, o Entra navega para essa URL, que inicia um fluxo Authorization Code normal iniciado pelo SP.
