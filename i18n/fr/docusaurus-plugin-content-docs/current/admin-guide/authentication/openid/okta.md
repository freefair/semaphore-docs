
# Configuration Okta

```yaml title="config.json"
{
  "oidc_providers": {
    "okta": {
      "display_name": "Sign in with Okta",
      "provider_url": "https://trial-776xxxx.okta.com/oauth2/default",
      "client_id": "***",
      "client_secret": "***",
      "redirect_url": "https://semaphore.example.com/api/auth/oidc/okta/redirect/"
    }
  }
}
```

## Connexion initiée par l'IdP {#idp-initiated-login}

Semaphore ne met pas en œuvre la connexion initiée par l’IdP. `allow_idp_initiated` n’est pas une option de fournisseur prise en charge et aucune route `/initiate` n’existe. Démarrez le flux Authorization Code pris en charge, initié par l’application, via le bouton du fournisseur dans Semaphore ou un lien d’application Okta vers :

```
https://semaphore.example.com/api/auth/oidc/okta/login
```

## Issues GitHub associées {#related-github-issues}

* [#1434](https://github.com/semaphoreui/semaphore/issues/1434) — Aide pour la configuration/le débogage OIDC avec Azure AD
* [#1864](https://github.com/semaphoreui/semaphore/issues/1864) — La v2.9.56 casse l'authentification oidc avec keycloak
* [#1329](https://github.com/semaphoreui/semaphore/issues/1329) — Test de oidc_providers

[Voir toutes les issues liées à Okta →](https://github.com/semaphoreui/semaphore/issues?q=is%3Aissue%20okta)

## Discussions GitHub associées {#related-github-discussions}

* [#2822](https://github.com/semaphoreui/semaphore/discussions/2822) — Lors de la configuration de GitHub OpenID, l'analyse n'est possible que pour l'e-mail
* [#1030](https://github.com/semaphoreui/semaphore/discussions/1030) &mdash; Prise en charge de SAML ?

[Voir toutes les discussions liées à Okta →](https://github.com/semaphoreui/semaphore/discussions?discussions_q=okta)
