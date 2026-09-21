# Okta の設定

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

## IdP 起点のログイン

Semaphore は IdP 起点のログインを実装していません。`allow_idp_initiated` はサポートされるプロバイダーオプションではなく、`/initiate` ルートもありません。Semaphore のプロバイダーボタンからサポートされるアプリケーション起点の Authorization Code フローを開始するか、Okta アプリケーションリンクを次の URL に設定してください。

```
https://semaphore.example.com/api/auth/oidc/okta/login
```

<a id="related-github-issues"></a>

## 関連する GitHub Issue

* [#1434](https://github.com/semaphoreui/semaphore/issues/1434) — OIDC Azure AD の設定/デバッグに関するヘルプ
* [#1864](https://github.com/semaphoreui/semaphore/issues/1864) — v2.9.56 で keycloak との oidc 認証が動作しなくなる
* [#1329](https://github.com/semaphoreui/semaphore/issues/1329) — oidc_providers のテスト

[Okta 関連のすべての Issue を見る →](https://github.com/semaphoreui/semaphore/issues?q=is%3Aissue%20okta)

<a id="related-github-discussions"></a>

## 関連する GitHub ディスカッション

* [#2822](https://github.com/semaphoreui/semaphore/discussions/2822) — GitHub OpenID の設定時に、Email 以外を解析できない
* [#1030](https://github.com/semaphoreui/semaphore/discussions/1030) &mdash; SAML のサポートは?

[Okta 関連のすべてのディスカッションを見る →](https://github.com/semaphoreui/semaphore/discussions?discussions_q=okta)
