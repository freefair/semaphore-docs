# Debug Log Filtering

Debug log filtering narrows high-volume diagnostic output by stable component name. The same
per-instance filter controls `DEBUG` records written to stdout, Syslog, and the optional enhanced
structured debug file. It never filters warnings, errors, audit events, or required task result
records.

## Matching Semantics

`log.debug_filter` is a comma- or whitespace-separated list. A plain entry is an exact component
name. A single terminal `*` makes it a prefix match. Prefix an entry with `-` to exclude it;
exclusions win over includes.

```yaml
log:
  debug_filter: runner,task_*,-task_logger
```

This configuration includes exactly `runner`, includes every component beginning with `task_`, and
then excludes exactly `task_logger`. Arbitrary regular expressions and wildcards in the middle of
an entry are rejected.

The default is explicit:

- An empty configuration captures all components for compatibility.
- A non-empty configuration captures only valid included entries.
- Rejected entries are omitted. An invalid-only configuration therefore captures no components;
  it never silently broadens to all.
- If the configuration file cannot be read or decoded during reload, the last-known-good filter
  remains active and the error is reported in diagnostics.

Stable component names currently include:

| Area | Components |
|---|---|
| Task execution | `task_pool`, `task_runner`, `task_running`, `task_logger`, `task_summary`, `structured_result_log` |
| Remote runners | `runner`, `runner_reconciler`, `registration`, `unregistration`, `checking_new_jobs`, `job_running`, `sending_progress` |
| Authentication and transport | `csrf`, `jwt`, `ldap`, `oidc_link`, `session`, `survey_secrets`, `websocket` |
| System and integrations | `cluster`, `debugging`, `enhanced_audit`, `git`, `integrations`, `migration`, `system_info`, `terraform` |

New structured debug call sites use constants from `pro_interfaces`; `task_pool` is the first
structured component and emits `task_queued` and `task_started` events.

## Configuration and Reload

The command-line flag has highest precedence, followed by the environment, then the configuration
file:

```bash
semaphore server --log-level DEBUG --debug-filter 'runner,task_*'
```

```bash
export SEMAPHORE_DEBUG_FILTER='runner,task_*'
```

For configuration-file changes, send `SIGHUP` to the Semaphore process. Each instance parses and
atomically swaps its own immutable filter snapshot. A flag or environment value continues to win
on every reload. Instances do not share mutable filter state.

The enhanced edition can additionally persist accepted structured debug records as JSON Lines:

```yaml
log:
  debug_filter: task_pool
  debug:
    enabled: true
    format: json
    logger:
      filename: /var/log/semaphore/debug.jsonl
      maxsize: 100
      maxage: 7
      maxbackups: 3
      compress: true
```

Equivalent environment variables are `SEMAPHORE_DEBUG_FILTER`,
`SEMAPHORE_DEBUG_LOG_ENABLED`, `SEMAPHORE_DEBUG_LOG_FORMAT`, and
`SEMAPHORE_DEBUG_LOGGER`. The logger environment value is a JSON object using the same fields as
other structured file log destinations.

## Diagnostics

Administrators can inspect the current instance under **System Information → Debug log
filtering**. The admin-only `GET /api/admin/info` response exposes the same sanitized
`debug_filter` object:

- instance identifier;
- explicit default;
- configured and effective entries;
- rejected entries and validation reasons;
- last reload time and any bounded reload error.

Non-administrators cannot access this endpoint. In HA deployments, inspect every instance because
configuration and reload status are intentionally per process.

## Operational Cost

Broad debug capture can substantially increase CPU use, allocation rate, disk writes, rotation,
and log-ingestion volume. Structured debug fields are built only after the component passes the
filter, which avoids their construction cost for rejected records. The broad `*` default still
constructs and enqueues every available debug record, so use narrow exact or prefix entries during
investigation and restore the intended steady-state filter afterward.
