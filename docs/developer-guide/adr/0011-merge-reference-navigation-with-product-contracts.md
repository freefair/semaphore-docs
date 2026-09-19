# ADR 0011: Merge Reference Navigation with Product Contracts

## Status

Accepted

## Context

Upstream reorganizes authentication and CLI guidance, adds generated configuration and command references, and labels features by commercial edition.
The fork publishes one product and maintains canonical security guidance that translations must not override with obsolete behavior.
The CLI reference generator imports the actual server command tree, which embeds the frontend.

## Decision

Retain upstream's navigation, page redirects, screenshots, and source-driven reference generation.
Keep upstream MDX edition tags as non-rendering compatibility components, and show the fork's actual capability availability in the product table.
Configuration and permissions remain independent of feature inclusion, as defined by ADR 0010.

Preserve canonical-English security fallbacks at the relocated CLI routes.
Use canonical-English product guidance for pages whose translated edition claims disagree with the merged product until those translations receive content review.
Keep other translated pages available.

Generate references against the merged fork source and build the embedded frontend first using the product's pinned toolchain.
Prepare both merges locally to verify this dependency; commit and publish documentation before the application's submodule pointer.

Pin the Docusaurus package family together at 3.7.0. This includes the upstream
[route-hash collision fix](https://github.com/facebook/docusaurus/pull/10727):
the German documentation root and landing page can otherwise share the same
three-character hash and overwrite the root route context. Verify all locales
with the actual Pages URL and base path. Keep the serial build and existing
navigation; changing page names to evade a hash collision would hide the bug.

## Alternatives

Keeping upstream edition badges would make incorrect claims about licensing and unavailable providers.
Removing upstream's new navigation and reference generators would discard useful documentation improvements and increase future merge conflicts.
Maintaining a second command-tree description would allow documentation to drift from the executable.

## Consequences

Moved pages retain redirects and the eleven-locale site remains supported.
Some pages intentionally render canonical English until translations reflect the product contracts.
The generated reference gate depends on a frontend build, and publication order must preserve a reachable documentation commit.
