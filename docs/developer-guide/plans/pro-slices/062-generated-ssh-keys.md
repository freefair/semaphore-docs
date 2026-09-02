# Slice 062 — Server-Generated SSH Keys

An authorized user can ask Semaphore to generate an SSH credential and copy its public OpenSSH key without ever receiving the stored private key back.

| Field | Value |
|---|---|
| Selection | B04 |
| Depends on | 005 |
| Primary paths | access-key service/API, encryption service, `KeyForm.vue`, project keys UI |
| Out of scope | Importing the stale branch wholesale, client-side generation, and external CA-signed SSH certificates |

## Implementation

- [x] Implement the focused branch intent from this specification on current `develop` without importing an unavailable Pro/Enterprise module.
- [x] Add an explicit generate request accepted only for new or deliberately rotated SSH credentials.
- [x] Generate keys with the platform's cryptographic random source and a documented algorithm policy, with Ed25519 as the modern default and RSA only where compatibility is explicitly required.
- [x] Serialize the public key in authorized-keys-compatible OpenSSH format and the private key in a standard format supported by the runner.
- [x] Encrypt the private key through the existing access-key service before persistence and clear plaintext request/response fields after use.
- [x] Return the public key and non-sensitive fingerprint while keeping every private-key read response masked.
- [x] Require an explicit rotation action for an existing key, show impact, and audit generation/rotation without key material.
- [x] Add generate, copy-public-key, fingerprint, validation, rotation-confirmation, and unsupported-storage UI states.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: algorithm policy, key parsing, public/private correspondence, OpenSSH encoding, fingerprints, and secret redaction |
| Integration | Required: encrypted key persistence and a real SSH authentication fixture for generated Ed25519 and supported RSA compatibility keys |
| API | Required: create/generate/read/rotate, forbidden type/storage, masked private key, public fingerprint, and permission contracts |
| UI | Required: component tests plus browser evidence for generation, copy, reopen, rotation warning, and denied user behavior |

- [x] The displayed public key authenticates with the stored private key in a real SSH fixture.
- [x] The private key is absent from API read responses, logs, audit events, and browser state after creation.
- [x] Existing imported SSH keys continue to work without regeneration.

## Acceptance Evidence

- The focused service and API suites exercise Ed25519 and RSA-3072 generation, exact RSA key-size validation, encrypted persistence, real in-process SSH authentication, strict request decoding, authorization, rotation, auditing, and private-field-free responses.
- The generated-key UI suite covers the narrow create payload, hidden-field clearing, validated result projection, imported-key compatibility, rotation impact, unsupported storage, and denied actions.
- Browser acceptance on the disposable Enhanced instance at `127.0.0.1:31030` covers generation, copy, reopen, rotation impact and confirmation, unsupported storage, denied-user behavior, desktop and mobile overflow, and the absence of a generic secret override for generated keys.
- Full Core and Enhanced Go suites, focused race detection, Go vet, changed-file lint, Community and Enhanced production builds, OpenAPI parsing, and the documentation build pass. The unchanged frontend baseline retains its three unrelated legacy unit-test failures.
