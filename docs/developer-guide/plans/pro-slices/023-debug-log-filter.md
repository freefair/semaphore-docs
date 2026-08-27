# Slice 023 — Debug Log Filtering

An operator can narrow enhanced debug output to named components and immediately verify the effective filter on each instance.

| Field | Value |
|---|---|
| Selection | P05b |
| Depends on | 021 |
| Primary paths | debug logger, enhanced log service, config, diagnostics API and UI |
| Out of scope | Per-user log preferences and arbitrary regular-expression execution |

## Implementation

- [x] Define stable component names and exact/prefix matching semantics with an explicit default.
- [x] Parse and validate the filter once per configuration reload without package-global mutable test state.
- [x] Apply the decision before expensive debug field construction and before structured file enqueue.
- [x] Keep warnings, errors, audit events, and required task result events outside the debug filter.
- [x] Expose configured and effective filters, rejected entries, and reload time per instance.
- [x] Document configuration examples and the operational cost of broad debug capture.

## Tests and Acceptance

| Layer | Required evidence |
|---|---|
| Unit | Required: exact/prefix matching, invalid entries, reload, concurrency, and non-debug bypass |
| Integration | Required: configuration reload and structured-file output with multiple component filters |
| API | Required: effective-filter diagnostics, invalid configuration reporting, and authorization contracts |
| UI | Required: component tests plus browser evidence for effective, empty, and rejected filter states |

- [x] Two instances can use different effective filters without influencing each other.
- [x] Filtering debug output never removes warnings, errors, audit records, or result records.
- [x] An invalid filter is reported and does not silently broaden log collection.
