# Configurazione Okta

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

<a id="idp-initiated-login"></a>

## Accesso avviato dall'IdP

Semaphore non implementa l’accesso avviato dall’IdP. `allow_idp_initiated` non è un’opzione del provider supportata e non esiste alcuna route `/initiate`. Avviare il flusso Authorization Code supportato e avviato dall’applicazione tramite il pulsante del provider in Semaphore oppure un collegamento dell’applicazione Okta a:

```
https://semaphore.example.com/api/auth/oidc/okta/login
```

<a id="related-github-issues"></a>

## Issue GitHub correlate

* [#1434](https://github.com/semaphoreui/semaphore/issues/1434) — Aiuto con la configurazione/debug di OIDC Azure AD
* [#1864](https://github.com/semaphoreui/semaphore/issues/1864) — La v2.9.56 interrompe l'autenticazione oidc con keycloak
* [#1329](https://github.com/semaphoreui/semaphore/issues/1329) — Test di oidc_providers

[Esplora tutte le issue relative a Okta →](https://github.com/semaphoreui/semaphore/issues?q=is%3Aissue%20okta)

<a id="related-github-discussions"></a>

## Discussioni GitHub correlate

* [#2822](https://github.com/semaphoreui/semaphore/discussions/2822) — Nella configurazione di GitHub OpenID, non è possibile il parsing se non per l'email
* [#1030](https://github.com/semaphoreui/semaphore/discussions/1030) &mdash; Supporto SAML?

[Esplora tutte le discussioni relative a Okta →](https://github.com/semaphoreui/semaphore/discussions?discussions_q=okta)
