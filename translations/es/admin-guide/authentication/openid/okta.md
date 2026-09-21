# Configuración de Okta

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

## Inicio de sesión iniciado por el IdP

Semaphore no implementa el inicio de sesión iniciado por IdP. `allow_idp_initiated` no es una opción de proveedor compatible y no existe una ruta `/initiate`. Inicie el flujo Authorization Code compatible iniciado por la aplicación mediante el botón del proveedor de Semaphore o un enlace de aplicación de Okta a:

```
https://semaphore.example.com/api/auth/oidc/okta/login
```

<a id="related-github-issues"></a>

## Issues relacionados en GitHub

* [#1434](https://github.com/semaphoreui/semaphore/issues/1434) — Ayuda con la configuración/depuración de OIDC con Azure AD
* [#1864](https://github.com/semaphoreui/semaphore/issues/1864) — v2.9.56 rompe la autenticación oidc con keycloak
* [#1329](https://github.com/semaphoreui/semaphore/issues/1329) — Pruebas de oidc_providers

[Explorar todos los issues relacionados con Okta →](https://github.com/semaphoreui/semaphore/issues?q=is%3Aissue%20okta)

<a id="related-github-discussions"></a>

## Discusiones relacionadas en GitHub

* [#2822](https://github.com/semaphoreui/semaphore/discussions/2822) — Al configurar OpenID con GitHub, no es posible analizar nada excepto el correo electrónico
* [#1030](https://github.com/semaphoreui/semaphore/discussions/1030) &mdash; ¿Compatibilidad con SAML?

[Explorar todas las discusiones relacionadas con Okta →](https://github.com/semaphoreui/semaphore/discussions?discussions_q=okta)
