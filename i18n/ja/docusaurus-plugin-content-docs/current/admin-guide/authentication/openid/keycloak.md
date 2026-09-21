
# Keycloak の設定

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

## IdP 起点のログイン {#idp-initiated-login}

Semaphore は IdP 起点のログインを実装していません。`allow_idp_initiated` はサポートされるプロバイダーオプションではなく、`/initiate` ルートもありません。Semaphore のプロバイダーボタンからサポートされるアプリケーション起点の Authorization Code フローを開始するか、Keycloak クライアントの **Home URL** を次のように設定してください。

```
https://semaphore.example.com/api/auth/oidc/keycloak/login
```

## 関連する GitHub Issue {#related-github-issues}

* [#2308](https://github.com/semaphoreui/semaphore/issues/2308) — Keycloak サーバーの証明書検証を無効にする方法  
* [#2314](https://github.com/semaphoreui/semaphore/issues/2314) — TLS 検証を無効にするオプション  
* [#1496](https://github.com/semaphoreui/semaphore/issues/1496) — Semaphore からログアウトしたときに Keycloak セッションからもログアウトする  

[Keycloak 関連のすべての Issue を見る →](https://github.com/semaphoreui/semaphore/issues?q=is%3Aissue%20keycloak)

## 関連する GitHub ディスカッション {#related-github-discussions}

* [#1745](https://github.com/semaphoreui/semaphore/discussions/1745) — OpenID でユーザー名が `preferred_username` と異なる
* [#1030](https://github.com/semaphoreui/semaphore/discussions/1030) &mdash; SAML のサポートは?

[Keycloak 関連のすべてのディスカッションを見る →](https://github.com/semaphoreui/semaphore/discussions?discussions_q=keycloak)
