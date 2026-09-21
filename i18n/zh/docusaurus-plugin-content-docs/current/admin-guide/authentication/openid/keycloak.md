
# Keycloak 配置

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

## IdP 发起的登录 {#idp-initiated-login}

Semaphore 不实现 IdP 发起的登录。`allow_idp_initiated` 不是受支持的提供方选项，也不存在 `/initiate` 路由。请通过 Semaphore 中的提供方按钮启动受支持的应用发起的授权码流程，或将 Keycloak 客户端的 **Home URL** 设置为：

```
https://semaphore.example.com/api/auth/oidc/keycloak/login
```

## 相关 GitHub Issue {#related-github-issues}

* [#2308](https://github.com/semaphoreui/semaphore/issues/2308) — 如何为 Keycloak 服务器禁用证书校验  
* [#2314](https://github.com/semaphoreui/semaphore/issues/2314) — 提供禁用 TLS 校验的选项  
* [#1496](https://github.com/semaphoreui/semaphore/issues/1496) — 从 Semaphore 退出登录时同时退出 Keycloak 会话  

[浏览所有与 Keycloak 相关的 Issue →](https://github.com/semaphoreui/semaphore/issues?q=is%3Aissue%20keycloak)

## 相关 GitHub 讨论 {#related-github-discussions}

* [#1745](https://github.com/semaphoreui/semaphore/discussions/1745) — OpenID 中的用户名与 `preferred_username` 不一致
* [#1030](https://github.com/semaphoreui/semaphore/discussions/1030) &mdash; 是否支持 SAML？

[浏览所有与 Keycloak 相关的讨论 →](https://github.com/semaphoreui/semaphore/discussions?discussions_q=keycloak)
