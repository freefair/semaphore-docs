# ADR 0019: Preserve Generated SSH Key Contracts During Upstream Sync

## Status

Accepted

## Context

Upstream adds server-generated SSH keys through a `generate_ssh_key` flag on generic access-key create and update requests.
The full product already implements [Slice 062](../plans/pro-slices/062-generated-ssh-keys.md) through dedicated generation and rotation endpoints.
Its contract includes Ed25519 by default, explicit RSA-3072 compatibility, confirmation before rotation, encrypted persistence, public fingerprints, and audited changes.
Merging both request paths would create competing lifecycle and response contracts for the same credential.

## Decision

Keep the dedicated generation and rotation endpoints as the selected product interface.
Keep ordinary key creation and updates separate from generation; an unknown generation flag must not silently rotate a credential.
Preserve the fork's algorithm policy and explicit rotation confirmation, authorization, audit, and storage restrictions.
Expose public-key details through validated `generated_ssh_key` metadata and the focused generated-key components.
Keep private key material encrypted in storage and absent from read responses and browser state.
Generic service calls discard caller-supplied public metadata and preserve existing derived metadata on rename, independently of controller flags.
Review upstream model, SQL, encryption, and UI changes together because a textual merge can retain a conflicting persistence or presentation path without a Git conflict.

Use upstream's `deps:image` task in both product Dockerfiles.
It installs backend and frontend dependencies without release-tool installation.
Retain full-product workspace selection and the fork's revision, timestamp, tag, and SHA propagation.
This replaces the equivalent pair of direct dependency tasks without restoring edition selection.

## Alternatives

Replacing the existing generated-key implementation with upstream's generic flag would discard published rotation, algorithm, fingerprint, and audit contracts.
Shipping both generation paths would make those guarantees depend on which request shape a caller chooses.
Keeping the entire fork side would obscure the upstream Docker dependency split and avoid reviewing automatically merged key-storage changes.

## Verification

Exercise generated-key creation, encrypted persistence, masked reads, explicit rotation, forbidden storage/type, and permission checks.
Verify desktop and mobile generation, public-key display/copy, reopening, rotation confirmation, and denied-user behavior.
Run the retained upstream-sync gates and a dedicated Terra review of the final diff.
Compare any frontend failure against the exact assessed upstream source and lockfile.

## Consequences

The fork keeps one coherent generated-key interface and requires no schema migration for this sync.
Clients using the upstream generic generation flag must use the documented dedicated endpoints instead.
Future upstream merges must preserve this deliberate API difference while retaining applicable validation and storage fixes.
