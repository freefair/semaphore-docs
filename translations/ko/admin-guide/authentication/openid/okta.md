# Okta 설정

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

## IdP 시작 로그인

Semaphore는 IdP 시작 로그인을 구현하지 않습니다. `allow_idp_initiated`는 지원되는 제공자 옵션이 아니며 `/initiate` 경로도 없습니다. Semaphore의 제공자 버튼으로 지원되는 애플리케이션 시작 Authorization Code 흐름을 시작하거나 Okta 애플리케이션 링크를 다음 URL로 설정하십시오.

```
https://semaphore.example.com/api/auth/oidc/okta/login
```

<a id="related-github-issues"></a>

## 관련 GitHub 이슈

* [#1434](https://github.com/semaphoreui/semaphore/issues/1434) — OIDC Azure AD 설정/디버깅 도움 요청
* [#1864](https://github.com/semaphoreui/semaphore/issues/1864) — v2.9.56에서 keycloak을 사용한 oidc 인증이 동작하지 않음
* [#1329](https://github.com/semaphoreui/semaphore/issues/1329) — oidc_providers 테스트

[Okta 관련 이슈 모두 보기 →](https://github.com/semaphoreui/semaphore/issues?q=is%3Aissue%20okta)

<a id="related-github-discussions"></a>

## 관련 GitHub 토론

* [#2822](https://github.com/semaphoreui/semaphore/discussions/2822) — GitHub OpenID 설정 시 이메일 외에는 파싱이 되지 않음
* [#1030](https://github.com/semaphoreui/semaphore/discussions/1030) &mdash; SAML 지원?

[Okta 관련 토론 모두 보기 →](https://github.com/semaphoreui/semaphore/discussions?discussions_q=okta)
