# Configuração do Authelia

<a id="authelia-configuration"></a>

## Configuração do Authelia

```yaml title="config.yaml"
identity_providers:
  oidc:
    claims_policies:
      semaphore_claims_policy:
        id_token:
          - groups
          - email
          - email_verified
          - alt_emails
          - preferred_username
          - name
    clients:
      - client_id: semaphore
        client_name: Semaphore
        client_secret: 'your_secret'
        claims_policy: semaphore_claims_policy
        public: false
        authorization_policy: two_factor
        redirect_uris:
          - https://your-semaphore-domain.com/api/auth/oidc/authelia/redirect
        scopes:
          - openid
          - profile
          - email
        userinfo_signed_response_alg: none
```

<a id="semaphore-ui-configuration"></a>

## Configuração do Semaphore UI

```json title="config.json"
"oidc_providers":  {
    "authelia": {
        "display_name": "Authelia",
        "provider_url": "https://your-authelia-domain.com",
        "client_id": "semaphore",
        "client_secret": "your_secret",
        "redirect_url": "https://your-semaphore-domain.com/api/auth/oidc/authelia/redirect"
    }
},
```
