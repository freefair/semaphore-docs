
# Okta 配置

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

## IdP 发起的登录 {#idp-initiated-login}

Semaphore 不实现 IdP 发起的登录。`allow_idp_initiated` 不是受支持的提供方选项，也不存在 `/initiate` 路由。请通过 Semaphore 中的提供方按钮启动受支持的应用发起的授权码流程，或将 Okta 应用链接设置为：

```
https://semaphore.example.com/api/auth/oidc/okta/login
```

## 相关 GitHub Issue {#related-github-issues}

* [#1434](https://github.com/semaphoreui/semaphore/issues/1434) — 关于 OIDC Azure AD 配置/调试的求助
* [#1864](https://github.com/semaphoreui/semaphore/issues/1864) — v2.9.56 导致 keycloak 的 oidc 认证失效
* [#1329](https://github.com/semaphoreui/semaphore/issues/1329) — 测试 oidc_providers

[浏览所有与 Okta 相关的 Issue →](https://github.com/semaphoreui/semaphore/issues?q=is%3Aissue%20okta)

## 相关 GitHub 讨论 {#related-github-discussions}

* [#2822](https://github.com/semaphoreui/semaphore/discussions/2822) — 配置 GitHub OpenID 时，除 Email 之外无法解析其他字段
* [#1030](https://github.com/semaphoreui/semaphore/discussions/1030) &mdash; 是否支持 SAML？

[浏览所有与 Okta 相关的讨论 →](https://github.com/semaphoreui/semaphore/discussions?discussions_q=okta)
