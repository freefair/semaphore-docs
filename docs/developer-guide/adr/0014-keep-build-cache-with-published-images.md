# ADR 0014: Keep Build Cache with Published Images

## Status

Accepted

## Context

Server and runner builds shared the default GitHub Actions BuildKit cache scope.
Each image could replace the other's cache index.
Exporting all intermediate stages also competed with Go and npm caches for the
repository's Actions cache storage.
A cache upload could fail after the server image was pushed and prevent the
runner image from being built.

The observed `error writing layer blob: not_found` disappeared after cache
cleanup, but the exact service-side cause was not established.
The policy must not depend on periodically deleting shared caches.

## Decision

Export inline cache metadata with each published image and restore from that
image's own `latest` tag in the existing GitHub Container Registry repository.
Server and runner therefore have separate cache references.
Docker image builds write no GitHub Actions caches and create no separate cache
images; Go and npm caching remain unchanged.

Final and tagged Beta releases export inline cache as part of their normal image
push. Manual Beta dry runs restore only and omit `cache-to` because no image is
exported. Tagged Beta releases keep `latest` unchanged and restore from the last
stable release; the next stable release refreshes the shared baseline.

A missing registry cache reports an import diagnostic and falls back to a cold
build. Images published before this policy provide no inline cache metadata, so
the first release after the change may have no remote cache hits.
Build failures and image-push failures remain fatal.
There is no separate remote cache export that can fail after a successful push,
and no blanket `continue-on-error` or ignored build error is introduced.

## Alternatives

Separate GHA scopes fix index collisions but retain quota pressure and independent
cache uploads. Raising the quota introduces spending without fixing that coupling.
Separate registry cache images support `mode=max`, but require additional cache
storage and retention management. Disabling all caching loses even final-layer
reuse. Inline cache is the smallest policy that removes the additional storage
and upload lifecycle.

## Consequences

Inline cache supports final-stage reuse rather than the previous `mode=max`
intermediate-stage coverage. Some multi-stage builds can therefore take longer.
Cache metadata travels in the existing image configuration; image layers are not
duplicated into a second cache store. Normal image retention still applies.
Old GHA entries are no longer refreshed by these image workflows and expire under
GitHub's cache retention policy; existing releases and caches are not rewritten
or deleted by this change.

The cache trusts writers of the same GHCR package that already supplies release
images. The existing `GITHUB_TOKEN` permissions remain sufficient.

See Docker's [inline cache](https://docs.docker.com/build/cache/backends/inline/)
and [registry cache](https://docs.docker.com/build/cache/backends/registry/)
documentation, and GitHub's
[cache limits and eviction policy](https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching#usage-limits-and-eviction-policy).
