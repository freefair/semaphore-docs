
# Okta-Konfiguration

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

## IdP-initiierte Anmeldung {#idp-initiated-login}

Semaphore unterstützt keine IdP-initiierte Anmeldung. `allow_idp_initiated` ist keine unterstützte Anbieteroption und es gibt keine `/initiate`-Route. Starten Sie den unterstützten anwendungsinitiierten Authorization-Code-Flow über die Provider-Schaltfläche von Semaphore oder einen Okta-Anwendungslink zu:

```
https://semaphore.example.com/api/auth/oidc/okta/login
```

## Verwandte GitHub-Issues {#related-github-issues}

* [#1434](https://github.com/semaphoreui/semaphore/issues/1434) — Hilfe bei der Konfiguration/Fehlersuche für OIDC mit Azure AD
* [#1864](https://github.com/semaphoreui/semaphore/issues/1864) — v2.9.56 bricht die OIDC-Authentifizierung mit Keycloak
* [#1329](https://github.com/semaphoreui/semaphore/issues/1329) — Testen von oidc_providers

[Alle Okta-bezogenen Issues anzeigen →](https://github.com/semaphoreui/semaphore/issues?q=is%3Aissue%20okta)

## Verwandte GitHub-Diskussionen {#related-github-discussions}

* [#2822](https://github.com/semaphoreui/semaphore/discussions/2822) — Beim Einrichten von GitHub OpenID ist außer der E-Mail kein Parsen möglich
* [#1030](https://github.com/semaphoreui/semaphore/discussions/1030) &mdash; SAML-Unterstützung?

[Alle Okta-bezogenen Diskussionen anzeigen →](https://github.com/semaphoreui/semaphore/discussions?discussions_q=okta)
