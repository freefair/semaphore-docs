# Configuração do Okta

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

## Login iniciado pelo IdP

O Semaphore não implementa login iniciado pelo IdP. `allow_idp_initiated` não é uma opção de provedor suportada e não existe uma rota `/initiate`. Inicie o fluxo Authorization Code suportado e iniciado pela aplicação pelo botão do provedor no Semaphore ou por um link de aplicação do Okta para:

```
https://semaphore.example.com/api/auth/oidc/okta/login
```

<a id="related-github-issues"></a>

## Issues relacionadas no GitHub

* [#1434](https://github.com/semaphoreui/semaphore/issues/1434) — Ajuda com a configuração/depuração de OIDC com Azure AD
* [#1864](https://github.com/semaphoreui/semaphore/issues/1864) — v2.9.56 quebra a autenticação oidc com keycloak
* [#1329](https://github.com/semaphoreui/semaphore/issues/1329) — testando oidc_providers

[Explorar todas as issues relacionadas ao Okta →](https://github.com/semaphoreui/semaphore/issues?q=is%3Aissue%20okta)

<a id="related-github-discussions"></a>

## Discussões relacionadas no GitHub

* [#2822](https://github.com/semaphoreui/semaphore/discussions/2822) — Ao configurar o OpenID do GitHub, não é possível fazer o parsing, exceto do e-mail
* [#1030](https://github.com/semaphoreui/semaphore/discussions/1030) &mdash; Suporte a SAML?

[Explorar todas as discussões relacionadas ao Okta →](https://github.com/semaphoreui/semaphore/discussions?discussions_q=okta)
