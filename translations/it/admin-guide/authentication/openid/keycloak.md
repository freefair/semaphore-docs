# Configurazione Keycloak

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

<a id="idp-initiated-login"></a>

## Accesso avviato dall'IdP

Semaphore non implementa l’accesso avviato dall’IdP. `allow_idp_initiated` non è un’opzione del provider supportata e non esiste alcuna route `/initiate`. Avviare il flusso Authorization Code supportato e avviato dall’applicazione tramite il pulsante del provider in Semaphore oppure impostare la **Home URL** del client Keycloak su:

```
https://semaphore.example.com/api/auth/oidc/keycloak/login
```

<a id="related-github-issues"></a>

## Issue GitHub correlate

* [#2308](https://github.com/semaphoreui/semaphore/issues/2308) — Come disabilitare la convalida del certificato per il server Keycloak
* [#2314](https://github.com/semaphoreui/semaphore/issues/2314) — Opzione per disabilitare la verifica TLS
* [#1496](https://github.com/semaphoreui/semaphore/issues/1496) — Disconnessione dalla sessione Keycloak alla disconnessione da Semaphore

[Esplora tutte le issue relative a Keycloak →](https://github.com/semaphoreui/semaphore/issues?q=is%3Aissue%20keycloak)

<a id="related-github-discussions"></a>

## Discussioni GitHub correlate

* [#1745](https://github.com/semaphoreui/semaphore/discussions/1745) — Il nome utente differisce da `preferred_username` in OpenID
* [#1030](https://github.com/semaphoreui/semaphore/discussions/1030) &mdash; Supporto SAML?

[Esplora tutte le discussioni relative a Keycloak →](https://github.com/semaphoreui/semaphore/discussions?discussions_q=keycloak)
