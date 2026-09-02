# Template Search

Template search extends the existing project and view template-list endpoints;
it does not introduce a separate index or cross-project discovery surface.

## API contract

`GET /api/project/{project_id}/templates` and
`GET /api/project/{project_id}/views/{view_id}/templates` accept these optional
query parameters:

| Parameter | Contract |
|---|---|
| `search` | At most 256 Unicode code points; one value; case-insensitive literal substring match |
| `count` | Optional page size from 1 through 200 |
| `offset` | Zero-based offset, accepted only together with `count` |

An omitted or whitespace-only search retains the existing list ordering and
actions. Matching covers name, description, playbook, the legacy runner tag,
and every current runner tag. Name or configured view sorting remains primary;
the template ID is the deterministic tie-breaker.

Invalid size, cardinality, or pagination values return `400 Bad Request`.

## Permission and SQL boundary

The repository first evaluates the existing effective permission contract for
every candidate template. Only IDs that have `CanReadTemplate` enter the search
stage, and pagination runs after matching. Hidden templates therefore cannot
change a visible page or result count.

Printable ASCII searches use chunked, parameterized SQL `LIKE` queries only as
a candidate filter over those authorized IDs. The query uses `!` as an explicit
portable escape character: `!`, `%`, and `_` are escaped before the value is
bound. No search text is interpolated into SQL. Go performs the authoritative
literal match so normalization remains consistent across SQLite, MySQL/MariaDB,
and PostgreSQL. Unicode and control-character searches bypass the SQL candidate
optimization and use the same authorized in-memory set.

## Browser behavior

The existing `Templates.vue` list owns the search state. Input is debounced,
the previous request is canceled before another starts, and a monotonically
increasing request number prevents stale responses from replacing a newer
result. The applied term is stored in the existing route query, preserved when
switching views, and restores on browser navigation or reload.

Highlighting renders text segments through Vue interpolation; it never inserts
server values or the search term as HTML.
