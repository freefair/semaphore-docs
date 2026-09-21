# OpenID Connect

Semaphore supports authentication via OpenID Connect (OIDC).

Links:

* [GitHub config](openid/github.md)
* [Google config](openid/google.md)
* [GitLab config](openid/gitlab.md)
* [Authelia config](openid/authelia.md)
* [Authentik config](openid/authentik.md)
* [Keycloak config](openid/keycloak.md)
* [Okta config](openid/okta.md)
* [PingFederate config](openid/pingfederate.md)
* [Azure config](openid/azure.md)
* [Zitadel config](openid/zitadel.md)
* [Pocket-ID config](openid/pocket-id.md)

Example of SSO provider configuration:

```json
{
  "oidc_providers": {
    "mysso": {
      "display_name": "Sign in with MySSO",
      "color": "orange",
      "icon": "login",
      "provider_url": "https://mysso-provider.com",
      "client_id": "***",
      "client_secret": "***",
      "redirect_url": "https://your-domain.com/api/auth/oidc/mysso/redirect"
    }
  }
}
```

<a id="configure-via-environment-variable"></a>

### Configure via environment variable

When running in containers it may be convenient to configure providers using a single environment variable:

```bash
SEMAPHORE_OIDC_PROVIDERS='{
  "github": {
    "client_id": "***",
    "client_secret": "***"
  }
}'
```

This value must be a valid JSON string matching the `oidc_providers` structure above.

All SSO provider options:

| Parameter             | Description                                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| `display_name`        | Provider name which displayed on Login screen.                                                              |
| `icon`                | [MDI-icon](https://pictogrammers.com/library/mdi/) which displayed before of provider name on Login screen. |
| `color`               | Provider name which displayed on Login screen.                                                              |
| `client_id`           | Provider client ID.                                                                                         |
| `client_id_file`      | The path to the file where the provider's client ID is stored. Has less priorty then `client_id`.           |
| `client_secret`       | Provider client Secret.                                                                                     |
| `client_secret_file`  | The path to the file where the provider's client secret is stored. Has less priorty then `client_secret`.   |
| `redirect_url`        |                                                                                                             |
| `provider_url`        |                                                                                                             |
| `scopes`              |                                                                                                             |
| `username_claim`      | Username claim expression[\*](#claim-expression).                               |
| `email_claim`         | Email claim expression[\*](#claim-expression).                                  |
| `name_claim`          | Profile Name claim expression[\*](#claim-expression).                           |
| `group_claim_path`    | Allow-listed dotted path to a scalar or string-array group claim used by enhanced role mapping. |
| `group_claim_case_insensitive` | Lowercase group values before matching. Default `false`; matching is case-sensitive unless explicitly enabled. |
| `group_claim_missing_policy` | `preserve` keeps the provider's existing managed grants when the claim is absent; `clear` removes only grants owned by that provider. Default `preserve`. |
| `order`               | Position of the provider button on the Sign in screen.                                                      |
| `return_via_state`    | Pass the post-login return path via OAuth `state`. Default `true`; normal startup currently replaces an explicit `false` with the default. |
| `require_verified_email` | Require `email_verified: true` before matching an existing account by email. Default `false`: a missing claim is accepted for providers that omit it, but an explicit `false` is always rejected. |
| `endpoint.issuer`     |                                                                                                             |
| `endpoint.auth`       |                                                                                                             |
| `endpoint.token`      |                                                                                                             |
| `endpoint.userinfo`   |                                                                                                             |
| `endpoint.jwks`       |                                                                                                             |
| `endpoint.algorithms` |                                                                                                             |

<a id="claim-expression"></a>

### \*Claim expression

Example of claim expression:

```
email | {{ .username }}@your-domain.com
```

Semaphore is attempting to claim the email field first. If it is empty, the expression following it is executed.

  The expression <code>"username_claim": "|"</code> generates a random <code>username</code> for each user who logs in through the provider.

## Group-to-role mapping

Enhanced administrators can map values from one configured OIDC group claim to explicit global or project role IDs. This full-product behavior has no subscription or edition gate. Configure a bounded claim path on the provider first:

```json
{
  "oidc_providers": {
    "mysso": {
      "provider_url": "https://mysso-provider.com",
      "client_id": "***",
      "client_secret": "***",
      "group_claim_path": "realm.groups",
      "group_claim_case_insensitive": false,
      "group_claim_missing_policy": "preserve"
    }
  }
}
```

The selected claim may be one string or an array of strings. Semaphore rejects objects, mixed arrays, overlong values, excessive nesting, and excessive group counts. It does not inspect or retain unrelated claims for role mapping.

Use the OIDC group mapping panel in **System Information** to create mappings and preview a redacted list of group values for a user. Preview reports additions, removals, unknown values, assignment collisions, and protected-administrator violations. Role changes are applied only after that user completes a successful, verified OIDC login.

OIDC reconciliation owns only assignments created by the same provider and mapping. It never removes manual, LDAP-owned, or another OIDC provider's grants. `preserve` is the safe default for providers that may omit groups from some token or user-info responses; choose `clear` only when claim absence authoritatively means no groups.

<a id="idp-initiated-login"></a>

## IdP-initiated login

IdP-initiated login is not implemented. `allow_idp_initiated` is not a parsed
provider setting and Semaphore has no `/api/auth/oidc/<provider>/initiate` route.
Start the supported authorization-code flow from Semaphore's provider button or
`/api/auth/oidc/<provider>/login` instead.

<a id="sign-in-screen"></a>

## Sign in screen

For each of the configured providers, an additional login button is added to the login page:

![Screenshot of the Semaphore login page, with two login buttons. One says "Sign In", the other says "Sign in with MySSO"](https://user-images.githubusercontent.com/5564491/232345599-13f744a0-0530-4422-8b55-6a563a4ef5d9.png)
