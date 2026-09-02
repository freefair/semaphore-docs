# Server-Generated SSH Keys

Semaphore exposes server-side SSH key generation as explicit project-key
commands. Imported-key CRUD remains unchanged.

## API contract

- `POST /api/project/{project_id}/keys/generate` creates a new local SSH key.
  The request contains only a name, optional login, and optional algorithm.
- `POST /api/project/{project_id}/keys/{key_id}/rotate` replaces an existing
  local SSH key and requires `confirm_rotation: true`.
- The default algorithm is Ed25519. `rsa-3072` is the only compatibility
  algorithm.
- Command responses contain the safe Access Key metadata, authorized-keys
  compatible public key, SHA-256 fingerprint, and algorithm. They never contain
  the private key or passphrase.
- Read and list responses expose the same non-sensitive metadata for generated
  keys without decrypting the stored secret.

Both commands require project-resource management permission. Generation and
rotation are rejected for external, environment, file, and synchronized keys.

## Storage boundary

The generator uses the platform cryptographic random source. It serializes the
private key as unencrypted PKCS#8 PEM only inside the existing Access Key
encryption boundary, then clears the transient request fields before returning.
The command fails closed when no active Access Key encryption key is configured.

Only the public key, fingerprint, and algorithm are stored as safe metadata in
the existing `access_key.plain` column. This keeps read paths value-free and
avoids a schema migration. Existing imported and legacy SSH key formats remain
supported by the runner.

## Rotation and audit

Clients should read `/api/project/{project_id}/keys/{key_id}/refs` before asking
for rotation so the user sees the affected Templates, Inventories, Repositories,
Schedules, and other references. Successful generation and rotation use the
existing event log with the key identity, algorithm, and public fingerprint;
neither private nor public key content is written to the audit record.

Rotation takes effect immediately. Future tasks receive the new private key,
while already dispatched work retains its existing material. Repository caches
that reference the key are cleared as part of the command flow.
