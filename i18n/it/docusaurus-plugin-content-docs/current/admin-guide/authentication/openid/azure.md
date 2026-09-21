# Configurazione Azure

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

## Accesso avviato dall'IdP {#idp-initiated-login}

Semaphore non implementa l’accesso avviato dall’IdP. `allow_idp_initiated` non è un’opzione del provider supportata e non esiste alcuna route `/initiate`. Microsoft Entra ID (Azure AD) può avviare il flusso Authorization Code supportato e avviato dall’applicazione da **My Apps** tramite l’endpoint **`/login`** di Semaphore.

Nel portale Azure, aprire **App registration → Branding & properties** e impostare **Home page URL** a:

```
https://YOUR_SEMAPHORE_HOST_AND_PORT/api/auth/oidc/azure/login
```

Quando un utente fa clic sul riquadro di Semaphore in My Apps, Entra apre questo URL, che avvia un normale flusso Authorization Code SP-initiated.
