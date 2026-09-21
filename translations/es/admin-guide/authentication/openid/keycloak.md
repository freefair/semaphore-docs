# Configuración de Keycloak

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

## Inicio de sesión iniciado por el IdP

Semaphore no implementa el inicio de sesión iniciado por IdP. `allow_idp_initiated` no es una opción de proveedor compatible y no existe una ruta `/initiate`. Inicie el flujo Authorization Code compatible iniciado por la aplicación mediante el botón del proveedor de Semaphore o configure la **Home URL** del cliente de Keycloak en:

```
https://semaphore.example.com/api/auth/oidc/keycloak/login
```

<a id="related-github-issues"></a>

## Issues relacionados en GitHub

* [#2308](https://github.com/semaphoreui/semaphore/issues/2308) — Cómo deshabilitar la validación de certificados para el servidor Keycloak
* [#2314](https://github.com/semaphoreui/semaphore/issues/2314) — Opción para deshabilitar la verificación TLS
* [#1496](https://github.com/semaphoreui/semaphore/issues/1496) — Cerrar la sesión de Keycloak al cerrar sesión en Semaphore

[Explorar todos los issues relacionados con Keycloak →](https://github.com/semaphoreui/semaphore/issues?q=is%3Aissue%20keycloak)

<a id="related-github-discussions"></a>

## Discusiones relacionadas en GitHub

* [#1745](https://github.com/semaphoreui/semaphore/discussions/1745) — El nombre de usuario difiere de `preferred_username` en OpenID
* [#1030](https://github.com/semaphoreui/semaphore/discussions/1030) &mdash; ¿Compatibilidad con SAML?

[Explorar todas las discusiones relacionadas con Keycloak →](https://github.com/semaphoreui/semaphore/discussions?discussions_q=keycloak)
