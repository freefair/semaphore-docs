# Keycloak-Konfiguration

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

## IdP-initiierte Anmeldung

Semaphore unterstützt keine IdP-initiierte Anmeldung. `allow_idp_initiated` ist keine unterstützte Anbieteroption und es gibt keine `/initiate`-Route. Starten Sie den unterstützten anwendungsinitiierten Authorization-Code-Flow über die Provider-Schaltfläche von Semaphore oder setzen Sie die **Home URL** des Keycloak-Clients auf:

```
https://semaphore.example.com/api/auth/oidc/keycloak/login
```

<a id="related-github-issues"></a>

## Verwandte GitHub-Issues

* [#2308](https://github.com/semaphoreui/semaphore/issues/2308) — Deaktivieren der Zertifikatsprüfung für den Keycloak-Server
* [#2314](https://github.com/semaphoreui/semaphore/issues/2314) — Option zum Deaktivieren der TLS-Prüfung
* [#1496](https://github.com/semaphoreui/semaphore/issues/1496) — Abmeldung von der Keycloak-Sitzung beim Abmelden von Semaphore

[Alle Keycloak-bezogenen Issues anzeigen →](https://github.com/semaphoreui/semaphore/issues?q=is%3Aissue%20keycloak)

<a id="related-github-discussions"></a>

## Verwandte GitHub-Diskussionen

* [#1745](https://github.com/semaphoreui/semaphore/discussions/1745) — Benutzername weicht von `preferred_username` in OpenID ab
* [#1030](https://github.com/semaphoreui/semaphore/discussions/1030) &mdash; SAML-Unterstützung?

[Alle Keycloak-bezogenen Diskussionen anzeigen →](https://github.com/semaphoreui/semaphore/discussions?discussions_q=keycloak)
