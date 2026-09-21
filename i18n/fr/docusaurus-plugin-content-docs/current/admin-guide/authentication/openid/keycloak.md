
# Configuration Keycloak

```yaml title="config.json"
{
  "oidc_providers": {
    "keycloak": {
      "display_name": "Sign in with keycloak",
      "provider_url": "https://keycloak.example.com/realms/master",
      "client_id": "***",
      "client_secret": "***",
      "redirect_url": "https://semaphore.example.com/api/auth/oidc/keycloak/redirect"
    }
  }
}
```

## Connexion initiée par l'IdP {#idp-initiated-login}

Semaphore ne met pas en œuvre la connexion initiée par l’IdP. `allow_idp_initiated` n’est pas une option de fournisseur prise en charge et aucune route `/initiate` n’existe. Démarrez le flux Authorization Code pris en charge, initié par l’application, via le bouton du fournisseur dans Semaphore ou définissez la **Home URL** du client Keycloak sur :

```
https://semaphore.example.com/api/auth/oidc/keycloak/login
```

## Issues GitHub associées {#related-github-issues}

* [#2308](https://github.com/semaphoreui/semaphore/issues/2308) — Comment désactiver la validation du certificat pour le serveur Keycloak  
* [#2314](https://github.com/semaphoreui/semaphore/issues/2314) — Option pour désactiver la vérification TLS  
* [#1496](https://github.com/semaphoreui/semaphore/issues/1496) — Se déconnecter de la session Keycloak lors de la déconnexion de Semaphore  

[Voir toutes les issues liées à Keycloak →](https://github.com/semaphoreui/semaphore/issues?q=is%3Aissue%20keycloak)

## Discussions GitHub associées {#related-github-discussions}

* [#1745](https://github.com/semaphoreui/semaphore/discussions/1745) — Le nom d'utilisateur diffère de `preferred_username` dans OpenID
* [#1030](https://github.com/semaphoreui/semaphore/discussions/1030) &mdash; Prise en charge de SAML ?

[Voir toutes les discussions liées à Keycloak →](https://github.com/semaphoreui/semaphore/discussions?discussions_q=keycloak)
