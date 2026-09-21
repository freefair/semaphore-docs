# ADR 0020: Document Effective Feature Controls

## Status

Accepted

## Context

The configuration reference is generated from Go declarations, but declarations alone do not establish whether a field is used by the selected implementation.
Legacy authentication switches, unsupported Docker settings, and inactive scaffolding can parse successfully while a different runtime mechanism controls the feature.
The generator also omitted boolean zero defaults and the boolean fields inside named application and provider maps.

## Decision

Keep field names, environment bindings, and defaults source-driven.
Correct field comments against the selected implementation and regenerate the reference through `task docs:gen`.
Display `false` for non-pointer boolean fields without an explicit default tag, preserve explicit defaults, and leave an unset pointer boolean distinct from `false`.
Expose boolean members of named maps under an `<id>` placeholder while retaining each parent object as its environment binding.
Map entries have no individual environment-variable bindings because the loader consumes the parent JSON object.

Document process configuration separately from persisted capability and provider lifecycle controls.
Identify compatibility-only, unsupported, and currently inactive settings explicitly, including their limits and the applicable supported control path.
Keep capability access, feature inclusion metadata, and authorization distinct.
Qualify the generic lifecycle example as the `lifecycle_test` fixture instead of applying its access matrix to every capability.
Use the existing canonical-English fallbacks for reviewed product and security guidance.

## Alternatives

Hand-editing the generated page would lose corrections on the next generation run.
Implementing behavior for inactive settings would change application scope under a documentation request.
Expanding every provider credential field would broaden this feature-flag correction; provider guides and the parent object entries continue to describe those schemas.
Adding runtime default tags solely for display would alter startup behavior, so default presentation belongs in the documentation generator.

## Verification

Exercise generator fixtures for false and explicit true defaults, pointer booleans, named-map controls, recursive types, and environment-binding boundaries.
Check all six named application/provider flags against the real configuration declarations.
Compare regenerated output with the committed reference, inspect each audit finding against corrected prose, and build all eleven documentation locales serially.
Verify canonical security fallbacks and review authentication guidance against the selected implementation.
Application configuration declarations, tags, and executable behavior remain unchanged.
