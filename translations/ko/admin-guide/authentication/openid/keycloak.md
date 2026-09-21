# Keycloak 설정

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

## IdP 시작 로그인

Semaphore는 IdP 시작 로그인을 구현하지 않습니다. `allow_idp_initiated`는 지원되는 제공자 옵션이 아니며 `/initiate` 경로도 없습니다. Semaphore의 제공자 버튼으로 지원되는 애플리케이션 시작 Authorization Code 흐름을 시작하거나 Keycloak 클라이언트의 **Home URL**을 다음으로 설정하십시오.

```
https://semaphore.example.com/api/auth/oidc/keycloak/login
```

<a id="related-github-issues"></a>

## 관련 GitHub 이슈

* [#2308](https://github.com/semaphoreui/semaphore/issues/2308) — Keycloak 서버의 인증서 검증을 비활성화하는 방법
* [#2314](https://github.com/semaphoreui/semaphore/issues/2314) — TLS 검증을 비활성화하는 옵션
* [#1496](https://github.com/semaphoreui/semaphore/issues/1496) — Semaphore에서 로그아웃할 때 Keycloak 세션에서도 로그아웃

[Keycloak 관련 이슈 모두 보기 →](https://github.com/semaphoreui/semaphore/issues?q=is%3Aissue%20keycloak)

<a id="related-github-discussions"></a>

## 관련 GitHub 토론

* [#1745](https://github.com/semaphoreui/semaphore/discussions/1745) — OpenID에서 사용자 이름이 `preferred_username`과 다름
* [#1030](https://github.com/semaphoreui/semaphore/discussions/1030) &mdash; SAML 지원?

[Keycloak 관련 토론 모두 보기 →](https://github.com/semaphoreui/semaphore/discussions?discussions_q=keycloak)
