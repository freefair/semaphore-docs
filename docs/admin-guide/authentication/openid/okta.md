---
title: Okta config
description: Example config.json for Okta single sign-on.
---

# Okta config

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

## IdP-initiated login {#idp-initiated-login}

Semaphore does not implement IdP-initiated login. `allow_idp_initiated` is not a
supported provider option, and there is no `/initiate` route. Start the supported
application-initiated authorization-code flow from Semaphore's provider button or
an Okta application link to:

```
https://semaphore.example.com/api/auth/oidc/okta/login
```


## Related GitHub Issues {#related-github-issues}

* [#1434](https://github.com/semaphoreui/semaphore/issues/1434) — Help with OIDC Azure AD configuration/debugging
* [#1864](https://github.com/semaphoreui/semaphore/issues/1864) — v2.9.56 breaks oidc auth with keycloak
* [#1329](https://github.com/semaphoreui/semaphore/issues/1329) — testing oidc_providers

[Explore all Okta-related issues →](https://github.com/semaphoreui/semaphore/issues?q=is%3Aissue%20okta)

## Related GitHub Discussions {#related-github-discussions}

* [#2822](https://github.com/semaphoreui/semaphore/discussions/2822) — When setting up GitHub OpenID, parsing is not possible except for Email
* [#1030](https://github.com/semaphoreui/semaphore/discussions/1030) &mdash; SAML support?

[Explore all Okta-related discussions →](https://github.com/semaphoreui/semaphore/discussions?discussions_q=okta)
