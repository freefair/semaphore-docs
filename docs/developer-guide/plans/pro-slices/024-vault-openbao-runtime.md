# Slice 024 — Vault and OpenBao Runtime Secrets

An authorized task can resolve a configured Vault or OpenBao secret at execution time without storing the plaintext value in Semaphore.

| Field | Value |
|---|---|
| Selection | P06 |
| Depends on | 003, 005 |
| Primary paths | secret storage interfaces, Vault/OpenBao client, task environment resolver, admin UI |
| Out of scope | Writing or synchronizing remote secrets, SOPS, and cloud-specific secret managers |

## Implementation

- [ ] Define a provider-neutral secret reference containing storage ID, mount, path, version, and field without plaintext.
- [ ] Implement an outbound client interface for compatible Vault/OpenBao KV reads with configurable address, namespace, mount, CA trust, and bounded timeouts.
- [ ] Support explicitly configured token, AppRole, and Kubernetes JWT authentication while keeping auth exchange and token renewal isolated behind the client.
- [ ] Encrypt provider bootstrap credentials at rest and expose them as write-only fields.
- [ ] Resolve values only inside the task execution boundary, inject them through the existing secret-safe mechanism, and clear transient buffers where practical.
- [ ] Cache only short-lived provider tokens and never cache returned secret values beyond the task lifetime.
- [ ] Add connection testing, capability gating, health telemetry, and redacted error categories.
- [ ] Provide UI flows to configure a provider and select a remote reference without browsing arbitrary secret values.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: reference validation, URL/TLS policy, token renewal, response bounds, error redaction, and capability decisions |
| Integration | Required: compatible fake server for auth, versioned KV read, expiry, denied access, TLS failure, timeout, and provider outage |
| API | Required: create/test/update/delete configuration, write-only credentials, reference validation, and permission contracts |
| UI | Required: component tests plus browser evidence for provider setup, successful reference, denied reference, and disabled capability |

- [ ] Database rows, task records, API payloads, logs, and audit events contain references rather than resolved plaintext.
- [ ] Provider outage fails only tasks that need the unavailable secret and returns actionable redacted diagnostics.
- [ ] Disabling the capability blocks new resolution while preserving configuration for a reversible rollback.
