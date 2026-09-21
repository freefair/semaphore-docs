# Configuration Azure

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

## Connexion initiée par l'IdP

Semaphore ne met pas en œuvre la connexion initiée par l’IdP. `allow_idp_initiated` n’est pas une option de fournisseur prise en charge et aucune route `/initiate` n’existe. Microsoft Entra ID (Azure AD) peut démarrer le flux Authorization Code pris en charge, initié par l’application, depuis **My Apps** via le point de terminaison **`/login`** de Semaphore.

Dans le portail Azure, ouvrez votre **Inscription d’application → Personnalisation et propriétés** et définissez l’**URL de la page d’accueil** à :

```
https://YOUR_SEMAPHORE_HOST_AND_PORT/api/auth/oidc/azure/login
```

Lorsqu’un utilisateur clique sur la tuile Semaphore dans My Apps, Entra navigue vers cette URL, ce qui démarre un flux Authorization Code initié par le SP classique.
