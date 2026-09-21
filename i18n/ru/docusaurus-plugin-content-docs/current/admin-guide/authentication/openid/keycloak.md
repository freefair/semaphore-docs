
# Настройка Keycloak

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

## Вход, инициированный IdP {#idp-initiated-login}

Semaphore не реализует вход, инициированный IdP. `allow_idp_initiated` не является поддерживаемой опцией провайдера, и маршрута `/initiate` не существует. Запустите поддерживаемый поток Authorization Code, инициированный приложением, кнопкой провайдера в Semaphore или укажите для **Home URL** клиента Keycloak:

```
https://semaphore.example.com/api/auth/oidc/keycloak/login
```

## Связанные Issues на GitHub {#related-github-issues}

* [#2308](https://github.com/semaphoreui/semaphore/issues/2308) — Как отключить проверку сертификата для сервера Keycloak  
* [#2314](https://github.com/semaphoreui/semaphore/issues/2314) — Опция для отключения проверки TLS  
* [#1496](https://github.com/semaphoreui/semaphore/issues/1496) — Выход из сессии Keycloak при выходе из Semaphore  

[Все issues, связанные с Keycloak →](https://github.com/semaphoreui/semaphore/issues?q=is%3Aissue%20keycloak)

## Связанные обсуждения на GitHub {#related-github-discussions}

* [#1745](https://github.com/semaphoreui/semaphore/discussions/1745) — Имя пользователя отличается от `preferred_username` в OpenID
* [#1030](https://github.com/semaphoreui/semaphore/discussions/1030) &mdash; Поддержка SAML?

[Все обсуждения, связанные с Keycloak →](https://github.com/semaphoreui/semaphore/discussions?discussions_q=keycloak)
