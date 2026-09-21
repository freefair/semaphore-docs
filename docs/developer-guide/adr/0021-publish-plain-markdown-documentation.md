# ADR 0021: Publish plain Markdown documentation

## Status

Accepted. Supersedes the website rendering and locale-build parts of ADR 0011.

## Context

Documentation must be readable directly from Git, including complete configuration details.
MDX components, site-relative links, implicit translation fallbacks and hosted configurators prevent that.
The parameter generator previously omitted most members of named maps.

## Decision

Publish ordinary Markdown with relative file links, static navigation indexes, local images, blockquote callouts and explicit fallback links.
Remove the documentation application, its dependencies, site builds and deployments.
Preserve the existing documentation submodule and published repository history.
Preserve translations as Markdown under `translations/<locale>`.
Keep configuration and CLI generators as optional maintainer tools; their full output stays committed and needs no generation to read.
Expand named configuration objects completely and document logger, key-file and process/container schemas alongside them.
Use a dependency-free source checker for local links, anchors and unwanted site syntax.

Keeping a website alongside Markdown was rejected because it retains the unwanted UI and toolchain.
Hand-maintained parameter names were rejected because they drift from the parser.
Moving documentation into the product repository was unnecessary for the requested result and would change repository ownership.

## Consequences

Readers can use GitHub or any Markdown viewer, including offline.
Maintainers update page indexes and check links without building eleven locale sites.
Generated references still need regeneration when commands or configuration declarations change.
Website deployment settings and hosting are no longer part of this repository; already published external deployments are outside this source migration.
