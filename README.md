# Semaphore EX documentation

A directly readable Markdown manual for Semaphore EX.

## Quick start

Open [the documentation](docs/README.md), [the complete configuration reference](docs/reference/configuration.md), or [the full page index](docs/CONTENTS.md).
No installation, compilation, web UI or hosted documentation service is required.
When cloning the product repository, initialize its docs submodule with `git submodule update --init docs`.

## Editing and verification

Edit ordinary Markdown with relative `.md` links and local images from `static/`.
Use blockquotes for notes and headings for alternative setup methods.
Headings contain readable text; explicit stable links may use standard HTML anchors on separate lines.

Run the dependency-free link and format checker from this repository:

```bash
node scripts/check-docs.mjs
```

Node is needed only for this maintainer check, never for reading the manual.
The product repository maintains the optional configuration and CLI generators (`task docs:gen`); their complete Markdown output is committed here.
See [the Markdown documentation decision](docs/developer-guide/adr/0021-publish-plain-markdown-documentation.md).

## Sources and security

The [product source](https://github.com/freefair/semaphore-ex) defines behavior.
[Security guidance](docs/admin-guide/security.md) describes deployment responsibilities.
Examples use placeholders; keep deployment credentials outside version control.
