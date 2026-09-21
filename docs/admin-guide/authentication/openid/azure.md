---
title: Azure config
description: An oidc_providers block with Entra ID endpoints and a supported My Apps launch URL.
---

# Azure config

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

## IdP-initiated login {#idp-initiated-login}

Semaphore does not implement IdP-initiated login. `allow_idp_initiated` is not a
supported provider option, and there is no `/initiate` route. Microsoft Entra ID
(Azure AD) can start the supported application-initiated authorization-code flow
from **My Apps** through Semaphore's **`/login`** endpoint.

In the Azure portal, open your **App registration → Branding & properties** and set the **Home page URL** to:

```
https://YOUR_SEMAPHORE_HOST_AND_PORT/api/auth/oidc/azure/login
```

When a user clicks the Semaphore tile in My Apps, Entra navigates to this URL, which begins a normal SP-initiated
Authorization Code flow.
