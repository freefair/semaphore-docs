# Настройка Okta

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

## Вход, инициированный IdP

Semaphore не реализует вход, инициированный IdP. `allow_idp_initiated` не является поддерживаемой опцией провайдера, и маршрута `/initiate` не существует. Запустите поддерживаемый поток Authorization Code, инициированный приложением, кнопкой провайдера в Semaphore или ссылкой приложения Okta на:

```
https://semaphore.example.com/api/auth/oidc/okta/login
```

<a id="related-github-issues"></a>

## Связанные Issues на GitHub

* [#1434](https://github.com/semaphoreui/semaphore/issues/1434) — Помощь с настройкой/отладкой OIDC Azure AD
* [#1864](https://github.com/semaphoreui/semaphore/issues/1864) — v2.9.56 ломает аутентификацию oidc с keycloak
* [#1329](https://github.com/semaphoreui/semaphore/issues/1329) — Тестирование oidc_providers

[Все issues, связанные с Okta →](https://github.com/semaphoreui/semaphore/issues?q=is%3Aissue%20okta)

<a id="related-github-discussions"></a>

## Связанные обсуждения на GitHub

* [#2822](https://github.com/semaphoreui/semaphore/discussions/2822) — При настройке GitHub OpenID не удаётся разобрать ничего, кроме Email
* [#1030](https://github.com/semaphoreui/semaphore/discussions/1030) &mdash; Поддержка SAML?

[Все обсуждения, связанные с Okta →](https://github.com/semaphoreui/semaphore/discussions?discussions_q=okta)
