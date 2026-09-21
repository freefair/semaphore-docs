# Logs

Semaphore writes server logs to **stdout** and stores **Task** and **Activity** logs in a **database**.
Optional structured file exports create additional persistent log files; include their retention and collection in your operations plan.

---

<a id="server-log"></a>

## Server log

The normal server log is written to **stdout**; structured file export is configured separately below.
If Semaphore is running as a systemd service, you can view the logs with the following command:

```bash
journalctl -u semaphore.service -f
```

If Semaphore is running in Docker container, you can view the logs with the following commamd:
```
docker logs -f my-semaphore-container
```

This provides a live (streaming) view of the logs.

---

<a id="activity-log"></a>

## Activity log

The Activity Log captures user actions performed in Semaphore, including:

- Adding or removing resources (e.g., Templates, Inventories, Repositories).
- Adding or removing team members.

<a id="pro-version-210-and-later"></a>

### Structured file logs

Semaphore EX can export application events, task lifecycle events, and normalized task
results as versioned JSON Lines. File export is disabled by default and does not replace the
database-backed Activity Log or Task History.

Each enabled event, task, or debug destination requires `format: "json"` and a logger with a `filename`.
Empty format does not select plain text; it is unsupported by the selected writer.
An enabled destination with an unsupported format or missing filename produces a configuration diagnostic and cannot write records.
Task logging may use `logger`, `result_logger`, or both, with at least one configured destination.

Destinations must be absolute, normalized paths to regular files. Semaphore rejects relative
paths, traversal, symlinks (including symlinked parent directories), directories, devices, and
named pipes. It creates parent directories with mode `0700` and files with mode `0600`.

Configure the writer in `config.json`:

```json
{
  "log": {
    "queue_size": 1024,
    "flush_interval": "1s",
    "rotation_interval": "24h",
    "events": {
      "enabled": true,
      "format": "json",
      "logger": {
        "filename": "/var/log/semaphore/events.jsonl",
        "maxsize": 100,
        "maxage": 30,
        "maxbackups": 10,
        "compress": true
      }
    },
    "tasks": {
      "enabled": true,
      "format": "json",
      "logger": {
        "filename": "/var/log/semaphore/tasks.jsonl",
        "maxsize": 100,
        "maxage": 30,
        "maxbackups": 10,
        "compress": true
      },
      "result_logger": {
        "filename": "/var/log/semaphore/results.jsonl",
        "maxsize": 100,
        "maxage": 30,
        "maxbackups": 10,
        "compress": true
      }
    }
  }
}
```

The equivalent environment variables are:

```bash
export SEMAPHORE_LOG_QUEUE_SIZE=1024
export SEMAPHORE_LOG_FLUSH_INTERVAL=1s
export SEMAPHORE_LOG_ROTATION_INTERVAL=24h
export SEMAPHORE_EVENT_LOG_ENABLED=true
export SEMAPHORE_EVENT_LOG_FORMAT=json
export SEMAPHORE_EVENT_LOGGER='{"filename":"/var/log/semaphore/events.jsonl","maxsize":100,"maxage":30,"maxbackups":10,"compress":true}'
export SEMAPHORE_TASK_LOG_ENABLED=true
export SEMAPHORE_TASK_LOG_FORMAT=json
export SEMAPHORE_TASK_LOGGER='{"filename":"/var/log/semaphore/tasks.jsonl","maxsize":100,"maxage":30,"maxbackups":10,"compress":true}'
export SEMAPHORE_TASK_RESULT_LOGGER='{"filename":"/var/log/semaphore/results.jsonl","maxsize":100,"maxage":30,"maxbackups":10,"compress":true}'
```

`queue_size` bounds memory use and isolates task execution from slow disks. Producers enqueue
without waiting. When the queue is full, Semaphore drops the new record, returns immediately,
increments `dropped_records`, and changes writer state to `dropping`. File-system and flush errors
change the state to `failed`; neither condition stalls normal task processing. Shutdown drains the
queue and synchronizes every open destination.

An administrator can inspect the effective destinations, queue depth and capacity, drop count,
last redacted write error, and last successful flush under **System Information → Structured file
logs**. The same data is returned by the authenticated admin-only `GET /api/admin/info` endpoint.

The enhanced writer can also capture filtered structured debug records. See
[Debug Log Filtering](../developer-guide/debug-log-filtering.md) for matching semantics, reload behavior,
diagnostics, and the operational cost of broad capture.

<a id="activity-events-logging-options"></a>

#### Activity (events) logging options

The Activity (events) logging options allow you to configure how Semaphore records user actions and system events to a file. These settings control the behavior of event logging, including whether it's enabled, the format of log entries, and specific logger configurations. When enabled, user actions like creating templates or managing teams will be written to the specified log file according to these settings.

| Parameter             | Environment Variables | Description           |
| --------------------- | --------------------- | --------------------- |
| `enabled`             | `SEMAPHORE_EVENT_LOG_ENABLED` | Enable event logging to file. |
| `format`              | `SEMAPHORE_EVENT_LOG_FORMAT`  | Log record format. Structured export requires `json`. |
| `logger`              | `SEMAPHORE_EVENT_LOGGER`  | [Logger options](#logger-options). |

<a id="tasks-logging-options"></a>

#### Tasks logging options

The Tasks logging options allow you to configure how Semaphore records task execution details to a file. These settings control the logging of task-related events, including task starts, completions, and their execution status. When enabled, all task operations and their outcomes will be written to the specified log file according to these settings, providing a detailed audit trail of task execution history.

| Parameter             | Environment Variables | Description           |
| --------------------- | --------------------- | --------------------- |
| `enabled`             | `SEMAPHORE_TASK_LOG_ENABLED` | Enable task logging to file. |
| `format`              | `SEMAPHORE_TASK_LOG_FORMAT`  | Log record format. Structured export requires `json`. |
| `logger`              | `SEMAPHORE_TASK_LOGGER`  | [Logger options](#logger-options). |
| `result_logger`       | `SEMAPHORE_TASK_RESULT_LOGGER`  | Logger options. |

<a id="logger-options"></a>

#### Logger options

| Parameter             | Type | Description           |
| --------------------- | ------- | --------------------- |
| `filename`     | String  | Required absolute, normalized path to a regular file. Rotated files remain in the same directory. |
| `maxsize`      | Integer | The maximum size in megabytes of the log file before it gets rotated. It defaults to 100 megabytes. |
| `maxage`       | Integer | The maximum number of days to retain old log files based on the timestamp encoded in their filename.  Note that a day is defined as 24 hours and may not exactly correspond to calendar days due to daylight savings, leap seconds, etc. The default is not to remove old log files based on age. |
| `maxbackups`   | Integer | The maximum number of old log files to retain.  The default is to retain all old log files (though MaxAge may still cause them to get deleted.) |
| `localtime`    | Boolean | Determines if the time used for formatting the timestamps in backup files is the computer's local time.  The default is to use UTC time. |
| `compress`     | Boolean | Determines if the rotated log files should be compressed using gzip. The default is not to perform compression. |

Each line is independently valid JSON and uses one of three schemas:

```json
{"version":1,"schema":"semaphore.application.v1","timestamp":"2026-08-27T12:00:00Z","instance":"node-a","correlation_id":"request-a","project":42,"event_type":"project.created","payload":{"action":"project.created"}}
{"version":1,"schema":"semaphore.task.v1","timestamp":"2026-08-27T12:00:01Z","instance":"node-a","correlation_id":"task-17","project":42,"event_type":"success","payload":{"task":17,"project":42,"status":"success"}}
{"version":1,"schema":"semaphore.result.v1","timestamp":"2026-08-27T12:00:02Z","instance":"node-a","correlation_id":"host-web-1","project":42,"event_type":"host_summary","payload":{"version":1,"event":"host_summary","event_id":"host-web-1","host":"web-1","status":"success"}}
```

Before serialization, credential-shaped object keys and inline values such as `password=...`,
`token: ...`, authorization headers, API keys, cookies, and private keys are replaced with
`[REDACTED]`. A partial final line left by a process crash is removed when the destination reopens,
so collectors never consume a permanently malformed tail record.

---

<a id="task-history"></a>

## Task history

Semaphore stores information about task execution in the database. Task history provides a detailed view of all executed tasks, including their status and logs. You can monitor tasks in real time or review historical logs through the web interface.

<a id="configuring-task-retention"></a>

### Configuring task retention

By default, Semaphore stores all tasks in the database. If you run a large number of tasks, they can occupy a significant amount of disk space.

You can configure how many tasks are retained per template using one of the following approaches:

1. **Environment Variable**
   ```bash
   SEMAPHORE_MAX_TASKS_PER_TEMPLATE=30
   ```
2. **`config.json` Option**
   ```json
   {
     "max_tasks_per_template": 30
   }
   ```

When the number of tasks exceeds this limit, the oldest Task Logs are automatically deleted.

---

<a id="syslog-protocol-support"></a>

## Syslog protocol support

Semaphore can forward activity and task log entries to an external syslog collector for long‑term storage or centralized monitoring. Syslog forwarding is disabled by default.

Configure syslog support in `config.json`:

```json
"syslog": {
  "enabled": true,
  "network": "udp",
  "address": "logs.example.com:514",
  "tag": "semaphore"
}
```

The same options are available through environment variables if you prefer not to edit the JSON file:

```bash
SEMAPHORE_SYSLOG_ENABLED=true
SEMAPHORE_SYSLOG_NETWORK=udp
SEMAPHORE_SYSLOG_ADDRESS=logs.example.com:514
SEMAPHORE_SYSLOG_TAG=semaphore
```

<a id="syslog-options"></a>

#### Syslog options

| Parameter             | Environment Variables | Description           |
| --------------------- | --------------------- | --------------------- |
| `enabled`             | `SEMAPHORE_SYSLOG_ENABLED` | Turn syslog forwarding on or off. |
| `network`              | `SEMAPHORE_SYSLOG_NETWORK`  | Protocol used to reach the collector, such as `udp` or `tcp`. |
| `address`              | `SEMAPHORE_SYSLOG_ADDRESS`  | Collector address in `host:port` format. |
| `tag`              | `SEMAPHORE_SYSLOG_TAG`  | Optional identifier prepended to every message. |

Restart the Semaphore service after changing these values so that the new syslog destination is applied.

---

<a id="siem-integration"></a>

## SIEM integration

Semaphore 2.20+ records a security audit trail suitable for forwarding to a SIEM (Splunk, Elastic Security, QRadar, Wazuh, etc.).

Every audit event includes the **action** (`create`, `update`, `delete`, `login_success`, `login_fail`, `logout`), the **client IP address** and the **user agent**, in addition to the acting user and the affected object. Besides resource changes, Semaphore logs:

- Successful logins (password, LDAP and OpenID), logouts, failed login attempts and failed MFA verifications.
- User account creation, update, deletion and password changes.
- API token creation and deletion (only the short token prefix is logged, never the secret).

There are three ways to deliver audit events to your SIEM:

1. **Pull:** read `/api/events` (see [API docs](../reference/api.md)).
2. **File collector:** enable structured Activity Log export above and ship the JSON Lines file with your collector.
3. **Audit webhook:** deliver the signed `semaphore.audit.v1` JSON envelope to an administrator-controlled HTTPS receiver. A SIEM requiring another format needs a receiver-side adapter.

<a id="audit-webhook"></a>

### Audit webhook

Audit-webhook settings are persisted in the database and managed through **System Information → Audit webhook** by an authenticated administrator.
They are not `log.audit_webhook` configuration fields, and there are no `SEMAPHORE_AUDIT_WEBHOOK_*` environment variables.

Configure the HTTPS endpoint, create the required signing key, verify a controlled test delivery, and use the pause/resume controls to manage background delivery.
An optional receiver credential is write-only and separate from the signing key.
See [Audit Webhook Export](../developer-guide/audit-webhook-export.md#administration-api) for the complete API and [Signed Webhooks](../developer-guide/signed-webhooks.md) for receiver verification and key rotation.

<a id="audit-webhook-options"></a>

#### Audit webhook options

| Control | Administration API | Effect |
|---|---|---|
| Endpoint and optional receiver credential | `GET` / `PUT /api/audit-webhook` | Read safe configuration or update the endpoint and write-only credential. |
| Signing key lifecycle | `/api/audit-webhook/signing-secret` and its stage/promote routes | Create or rotate signing material through the documented revision-guarded operations. |
| Pause / resume | `POST /api/audit-webhook/pause` or `POST /api/audit-webhook/resume` | Stop or resume background delivery claims; does not delete delivery history. |
| Controlled test | `POST /api/audit-webhook/test` | Test the configured receiver and signing key, including while paused. |
| Delivery history | `GET /api/audit-webhook/deliveries` | Inspect durable delivery states and redacted attempt details. |

Delivery uses a transactional SQL outbox and leased background workers rather than an in-memory-only queue.
Retryable failures use backoff; the eighth failed attempt becomes terminal.
Redirects and non-retryable client errors fail earlier.
Failed deliveries remain in history instead of disappearing after three attempts.

<a id="summary"></a>

## Summary

- **Server log:** Written to stdout; viewable via `journalctl` if running under systemd.
- **Activity and tasks log:** Tracks all user actions. Optionally, Semaphore EX can write these to a file.
- **Task history:** Stores real-time and historical task execution logs. Retention is configurable per template.

Following these guidelines ensures you have proper visibility into Semaphore UI operations while controlling storage usage and log retention.
