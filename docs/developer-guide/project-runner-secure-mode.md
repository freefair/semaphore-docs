# Runner Secure Mode

Runner secure mode is an explicit, server-owned registration policy. It does
not infer security from a collection of optional flags and it never falls back
to the standard policy when a secure requirement is missing.

## Policies

| Policy | Registration | Transport | Runner metadata | Identity |
|---|---|---|---|---|
| `standard` | Shared or one-time token | Existing behavior | Optional for older runners | Optional |
| `secure` | One-time `smrs_secure_` token only | HTTPS with system trust or a configured CA | Supported version, protocol version `1`, and explicit executor | Generated Ed25519 public identity |

The minimum runner version for secure mode is `2.20.0`. A secure runner reports
its transport trust, version, protocol, and executor during registration and on
every poll. Missing or downgraded metadata produces HTTP `409` before the server
returns work.

## Persistence

Migration `2.20.8` adds the policy, registration kind, latest transport and
protocol report, compliance state, redacted reason and remediation, and the
last security check time to `runner`. Existing rows use `standard`, so an
unchanged Community or older runner remains compatible.

The public identity is stored in the existing `runner.public_key` column and is
never serialized in runner API responses or backups. The runner creates its
Ed25519 private key beside its configuration file with mode `0600`; only the
public key is sent during one-time registration. The secure token prefix tells
the CLI to prepare this identity; standard `smrs_` registration remains usable
without identity material.

## API contracts

`POST /api/internal/runners` accepts these non-secret secure-mode fields:

- `transport_trust`: `system_ca`, `custom_ca`, `plaintext`, or
  `insecure_skip_verify`;
- `runner_version`;
- `security_protocol_version`;
- `executor_type`;
- `public_key`.

A successful response includes `registration_policy`, `security_compliant`,
and `security_reason` beside the runner token. A policy violation returns HTTP
`409` with `policy`, `compliant`, `reason`, `remediation`,
`accepted_criteria`, and `rejected_criteria`. Diagnostics name the corrective
action but never echo the registration token, runner token, CA material, private
key, or public key.

Changing the policy of an already registered runner is rejected. Reset its
registration first, select the new policy while it is unregistered, and then
register it using the newly issued one-time token.

## Verification

The slice is covered by the policy and downgrade matrix in `db`, migration and
registration persistence tests in `db/sql`, valid and invalid local TLS fixtures
in `services/runners`, registration/reconnect/version API contracts in
`api/runners`, and runner-form UI tests.
