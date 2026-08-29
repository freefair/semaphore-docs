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
> Task ownership recovery, workflow progression, and resilience verification follow in Slices 042–044 and must not be inferred from a Ready dashboard state.

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
> Slice 040 implements only the cluster membership dashboard described above.

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
