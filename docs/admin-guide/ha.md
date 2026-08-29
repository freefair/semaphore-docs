# High Availability

:::info
High Availability is available in the **Semaphore Enterprise** edition.
:::

Semaphore UI supports active-active high availability (HA) deployments where multiple instances run simultaneously behind a load balancer. Every instance is fully capable of handling UI requests, API calls, scheduled jobs, and task execution. If one instance fails, the remaining nodes continue operating without interruption.

## Architecture {#architecture}

A typical active-active deployment consists of the following components:

**Load Balancer** — Users connect through a load balancer (e.g. NGINX, HAProxy, or a cloud load balancer). The load balancer distributes HTTP and WebSocket traffic across the available Semaphore nodes.

**Semaphore Nodes** — Each node runs an identical instance of Semaphore UI. Any node can receive user requests, start automation jobs, process scheduled tasks, and send real-time updates. All nodes are equal — there is no primary or standby node.

**Shared Database** — All instances connect to a shared PostgreSQL or MySQL database. The database acts as the single source of truth for projects, templates, inventories, schedules, task history, user accounts, and RBAC configuration.

:::warning
SQLite and BoltDB are not supported for HA deployments. Use PostgreSQL or MySQL.
:::

**Redis** — Redis provides the coordination layer that allows multiple nodes to behave as a single system. It serves three functions:

* **Distributed Locks** ensure that only one instance executes a given job at a time, preventing duplicate task execution.
* **Shared Task Queue State** maintains the task queue so that jobs are picked up by exactly one worker. All nodes see the same queue and coordinate execution.
* **Pub/Sub Messaging** allows nodes to broadcast events such as task updates, cluster notifications, cache invalidation, and UI state changes. This keeps all nodes synchronized in real time.

## Prerequisites {#prerequisites}

Before setting up HA you need:

* **Semaphore Enterprise** subscription key.
* A shared **PostgreSQL** or **MySQL** database accessible from all nodes.
* A **Redis** instance (or Redis cluster) accessible from all nodes.
* A **load balancer** that supports HTTP and WebSocket traffic.
* Two or more servers to run Semaphore instances.

All Semaphore nodes must use the same database, Redis instance, and configuration (except for `ha.node_id`, which must be unique per node).

## Configuration {#configuration}

Enable HA by adding the `ha` block to your `config.json` on each node:

```json
{
  "dialect": "postgres",
  "postgres": {
    "host": "db.example.com:5432",
    "name": "semaphore",
    "user": "semaphore",
    "pass": "***"
  },

  "ha": {
    "enabled": true,
    "node_id": "node-1",
    "redis": {
      "addr": "redis.example.com:6379",
      "db": 0,
      "pass": "***"
    }
  },

  "cookie_hash": "...",
  "cookie_encryption": "...",
  "access_key_encryption": "..."
}
```

Each node must have a unique `ha.node_id`. All other configuration should be identical across nodes.

## Cluster membership dashboard

The Cluster Dashboard at `/cluster` is the operator view of Enhanced cluster membership.
It records one durable SQL row for every process lifetime and derives live state from a Redis heartbeat, so a restarted node is never confused with its earlier process.
The configured `ha.node_id` is the stable operator-managed identity and is required when HA is enabled.
Each process receives a fresh cryptographic boot identity at startup.

The dashboard refreshes its heartbeat every 10 seconds with a 30-second Redis TTL.
Redis `TIME`, rather than a node-local clock, supplies registration, observed, and liveness timestamps.
SQL history is retained for seven days after its last server-timed heartbeat, then removed; boot identities are never reused.

A node is Ready only if its SQL registration and live Redis heartbeat are both present, it uses the current cluster protocol and schema, it advertises the `cluster-dashboard` capability, and it is not draining.
Expired heartbeats appear as Stale.
Schema, protocol, or capability mismatches appear as Incompatible and cannot be Ready.
Draining is an operator-controlled durable state that also prevents readiness.

The existing dashboard table shows node identity, state, last heartbeat, start time, version context, aggregate health counts, Redis diagnostics, and the separate live-event transport state.
No new navigation surface is required.

## Cross-node schedule coordination

The scheduler derives one immutable occurrence for every intended schedule fire.
Its identity binds the schedule ID, a digest of the relevant schedule definition, and the intended UTC instant.
An edit therefore cannot reuse a claim made for an older definition.

The occurrence is claimed in SQL with the configured node's boot identity, a monotonically increasing fencing token, and a database-server-derived lease expiry.
Every task creation re-checks that exact lease immediately before the insert.
The created task persists the occurrence key under a unique SQL constraint, then the occurrence records the task as complete.
If a node fails between these operations, a later claim discovers the unique task key and repairs the occurrence instead of creating another logical run.

Redis Pub/Sub distributes only bounded, lossy live-event notifications between WebSocket nodes.
It has a fixed channel name, message-size and subscriber-queue limits, echo/duplicate suppression, and reconnect backoff.
A missed Redis event can delay a browser update but cannot change or lose durable state: clients recover from the existing SQL-backed API refresh.

The cluster API returns `coordinator.sql_authoritative: true` independently of `coordinator.live_events`.
`healthy`, `degraded`, and `unavailable` describe only the live-notification path.
Operators should investigate a degraded Redis path, but must not infer that completed task or schedule state has become unavailable.

### Admin API

All cluster-node endpoints require an authenticated administrator.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/cluster` | Dashboard summary with health aggregation and Redis diagnostics. |
| `GET` | `/api/cluster/nodes?limit=20&offset=0` | Paginated node history. `limit` is capped at 100. |
| `GET` | `/api/cluster/nodes/{boot_id}` | One process lifetime by immutable boot identity. |
| `POST` | `/api/cluster/nodes/{boot_id}/draining` | Persist an operator drain transition with `{"draining": true}` or `{"draining": false}`. |

The drain API is intentionally separate from the small dashboard table to keep the upstream UI surface unchanged.

> **Important:** The membership dashboard is an observability and readiness boundary only.
> Workflow progression and resilience verification remain separate boundaries and must not be inferred from a Ready dashboard state.

### Environment variables {#environment-variables}

Alternatively, configure HA using environment variables:

```bash
SEMAPHORE_HA_ENABLED=true
SEMAPHORE_HA_NODE_ID=node-1
SEMAPHORE_HA_REDIS_ADDR=redis.example.com:6379
SEMAPHORE_HA_REDIS_DB=0
SEMAPHORE_HA_REDIS_PASS=***
```

### Configuration reference {#configuration-reference}

| Config file option | Environment variable | Description |
| --- | --- | --- |
| `ha.enabled` | `SEMAPHORE_HA_ENABLED` | Enable High Availability mode. |
| `ha.node_id` | `SEMAPHORE_HA_NODE_ID` | Unique identifier for this node. |
| `ha.redis.addr` | `SEMAPHORE_HA_REDIS_ADDR` | Redis server address (e.g. `localhost:6379`). |
| `ha.redis.db` | `SEMAPHORE_HA_REDIS_DB` | Redis database number. |
| `ha.redis.pass` | `SEMAPHORE_HA_REDIS_PASS` | Redis server password. |
| `ha.redis.user` | `SEMAPHORE_HA_REDIS_USER` | Redis server username. |
| `ha.redis.tls` | `SEMAPHORE_HA_REDIS_TLS` | Enable TLS for the Redis connection. |
| `ha.redis.tls_skip_verify` | `SEMAPHORE_HA_REDIS_TLS_SKIP_VERIFY` | Skip TLS certificate verification for Redis. |

See [Configuration](/admin-guide/configuration) for the full list of available options.

## Task ownership recovery

Every remote-runner assignment receives a stable execution identity derived from the runner, task, and assignment generation.
The dispatching Semaphore process claims a renewable SQL task-control lease with its boot identity and a monotonically increasing fencing token before a runner can observe the assignment.
The lease is renewed only while that process is Ready and is released before the process finishes draining.

After an owner disappears, another Ready process may claim the expired control with a higher fence.
The takeover and the task row's recovery fence are committed atomically, so a paused former owner cannot later change task state.
The new owner then waits for a complete runner snapshot observed strictly after the ownership transfer.
A missed Semaphore heartbeat alone never proves that the remote execution stopped.

Recovery follows these evidence rules:

| Runner evidence | Recovery behavior |
| --- | --- |
| The exact execution is still running | Keep observing it without creating a replacement. |
| The exact execution reports a terminal status | Persist that same terminal result and finalize the task. |
| A complete post-transfer snapshot proves the exact execution absent | Requeue a not-yet-running task, stop a canceled task, or fail a running task without starting a duplicate execution. |
| Evidence is missing, stale, incomplete, or otherwise ambiguous | Keep the task nonterminal and quarantine recovery for operator review. |

For a not-yet-running assignment, recovery first revokes the assignment without enqueueing a replacement.
It requeues only after a strictly later complete runner snapshot proves that the revoked generation is absent.
This two-step transition prevents an old runner from starting work concurrently with a replacement.

Task Details uses the existing runner-details area to show the current and previous boot owner, fence, runner generation, evidence, recovery decision, and operator-safe reason.
A quarantined task offers **Retry safe recovery check**.
That action re-evaluates current evidence only while the receiving process still owns the current fence; it does not force a replacement or convert ambiguity into a terminal result.

The task endpoints use the existing project task permissions:

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/project/{project_id}/tasks/{task_id}/recovery` | Return value-free ownership, evidence, and recovery diagnostics. |
| `POST` | `/api/project/{project_id}/tasks/{task_id}/retry-recovery` | Retry the server-declared safe recovery check for a quarantined task. |

Recovery diagnostics never include task output, executor environment values, credentials, or the internal stable execution identifier.

## Workflow progression ownership

Every nonterminal workflow transition is serialized by a renewable SQL ownership lease.
The lease identifies the owning process by boot identity and carries a monotonically increasing fencing token.
A task-completion callback, approval decision, stop request, or periodic scan only wakes reconciliation; the durable SQL task, approval, desired-state, and node rows remain authoritative.

Before changing a run, a Semaphore process claims ownership and reloads all readiness from SQL.
Task creation, approval opening and completion, planner finalization, and run-status changes verify the same live fence in their database transaction.
If the lease expires during a transition, that transition is rejected and the next owner rebuilds progress from SQL.
The unique run/node task boundary and conditional approval boundary ensure that replay cannot create a second logical task or approval.

The periodic scan interleaves runs across projects rather than exhausting one project's backlog first.
When a node begins draining, it stops taking start and progression ownership, waits for in-flight transitions, releases their leases, and only then persists the node's Draining state.
If any worker or the persisted drain transition fails, already-drained workers resume so the node is not left partially drained.

Run payloads expose value-free `reconciliation_ownership` diagnostics with the current and previous boot owner, fence, lease age, transfer count, recovered state, and reconciliation lag.
The existing run view shows a compact recovery notice only after ownership actually transfers.
The cluster summary exposes `coordinator.workflow_progression` for nonterminal runs:

| Field | Meaning |
| --- | --- |
| `current_ownerships` | Nonterminal runs with a live reconciliation lease. |
| `expired_ownerships` | Nonterminal runs whose persisted lease can be recovered. |
| `transfer_count` | Ownership changes between different boot identities. Same-boot lease renewal or reclaim is not a transfer. |
| `max_lag_seconds` | Greatest SQL-derived time since a nonterminal run was last reconciled or first acquired. Terminal history is excluded. |
| `observed_at` | Database server time used for this summary. |

The cluster dashboard renders this as one small workflow-progression status chip in the existing coordinator header.
An expired ownership or growing lag is an operator signal to inspect node readiness and reconciliation errors; it is not evidence that a duplicate transition occurred.

## Load balancer {#load-balancer}

Place a load balancer in front of the Semaphore nodes to distribute traffic. The load balancer must support **WebSocket connections** for real-time UI updates.

### NGINX example {#nginx-example}

```nginx
upstream semaphore {
    server node1.example.com:3000 max_fails=3 fail_timeout=10s;
    server node2.example.com:3000 max_fails=3 fail_timeout=10s;
    server node3.example.com:3000 max_fails=3 fail_timeout=10s;
}

server {
    listen 443 ssl;
    server_name semaphore.example.com;

    ssl_certificate     /etc/ssl/certs/semaphore.crt;
    ssl_certificate_key /etc/ssl/private/semaphore.key;

    location / {
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        proxy_pass http://semaphore;

        proxy_connect_timeout 3s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
        proxy_next_upstream_tries 3;
    }


    location /api/ws {
        
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_pass http://semaphore;
        
        proxy_connect_timeout 3s;
        proxy_send_timeout 1h;
        proxy_read_timeout 1h;

        proxy_next_upstream error timeout http_502 http_503 http_504;
        proxy_next_upstream_tries 3;
    }
}
```

See [Reverse Proxy](/admin-guide/reverse-proxy/nginx) for more NGINX configuration details.

## How job execution works {#how-job-execution-works}

> **Note:** The coordination behavior in this section is the intended completed HA architecture.
> Cluster membership, schedule coordination, live-event delivery, and remote-runner task recovery are implemented as separate correctness boundaries.

In a multi-node deployment, task execution follows a coordinated flow:

1. **User triggers a task.** A user starts a job through the UI or API. The request can land on any Semaphore node.
2. **Task metadata is stored.** The receiving node writes task metadata to the database and signals work through Redis.
3. **A node picks the task.** One of the available nodes retrieves the task from Redis, acquires a distributed lock, and marks it as running in the database.
4. **The task executes.** The node runs the task locally or delegates it to a [remote runner](/admin-guide/runners). Progress and logs are written back to the database.
5. **Results are broadcast.** Task updates propagate through Redis Pub/Sub so all nodes and connected UI clients remain synchronized.

## Scaling with runners {#scaling-with-runners}

HA also enables horizontal scaling of task execution. Instead of running jobs only on the Semaphore nodes themselves, execution can be delegated to multiple [runners](/admin-guide/runners). This allows you to:

* Distribute workload across your infrastructure.
* Scale automation capacity independently from the web/API layer.
* Isolate execution environments to limit blast radius.
* Run tasks across many nodes in parallel.

See [Runners](/admin-guide/runners) for setup instructions.

## Benefits {#benefits}

* **Improved reliability** — If one instance fails, others continue serving traffic and executing jobs.
* **Zero-downtime maintenance** — Nodes can be updated or restarted individually without stopping the system.
* **Horizontal scalability** — Add Semaphore nodes behind the load balancer to increase capacity.
* **No primary node dependency** — All nodes are equal, removing complex failover mechanisms.
* **Consistent cluster state** — Shared database and Redis coordination keep all instances synchronized.

## FAQ {#faq}

### What is active-active high availability? {#what-is-active-active-high-availability}

Active-active HA means multiple application instances run simultaneously, and all of them serve requests. There is no primary node — any instance can handle traffic and execute jobs.

### Why does Semaphore use Redis in HA mode? {#why-does-semaphore-use-redis-in-ha-mode}

Redis acts as a coordination layer between instances. It provides distributed locks, shared task queue state, and Pub/Sub messaging to ensure nodes do not execute the same job simultaneously.

### What database should I use for HA deployments? {#what-database-should-i-use-for-ha-deployments}

Semaphore supports PostgreSQL and MySQL as the shared database. SQLite and BoltDB cannot be used in HA mode because they do not support concurrent access from multiple processes.

### What happens if one Semaphore node fails? {#what-happens-if-one-semaphore-node-fails}

The load balancer routes traffic to the remaining nodes. Running jobs continue on other instances, and new jobs are picked up by any available node.

### Can I scale horizontally? {#can-i-scale-horizontally}

Yes. You can add Semaphore nodes behind the load balancer to increase web/API capacity, and add [runners](/admin-guide/runners) to increase task execution capacity.
