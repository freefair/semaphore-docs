---
title: Semaphore UI Documentation
sidebar_label: Home
hide_table_of_contents: true
---

# Semaphore UI Documentation

Semaphore UI is a self-hosted web UI and API for running **Ansible**, **Terraform/OpenTofu**, **Shell**, **PowerShell**, and **Python** automation. It gives your team one place to run playbooks and scripts, keep credentials encrypted, schedule jobs, and see who ran what and when.

It ships as a single Go binary or Docker image, runs on Linux, macOS, and Windows, and stores data in SQLite, MySQL, or PostgreSQL.

:::tip[Quick start]

Run Semaphore with SQLite in one command, then open [http://localhost:3000](http://localhost:3000) and log in as `admin` / `changeme`.

```bash
docker run -d -p 3000:3000 \
  -e SEMAPHORE_DB_DIALECT=sqlite \
  -e SEMAPHORE_ADMIN=admin \
  -e SEMAPHORE_ADMIN_PASSWORD=changeme \
  -e SEMAPHORE_ADMIN_NAME=Admin \
  -e SEMAPHORE_ADMIN_EMAIL=admin@localhost \
  -v semaphore-data:/var/lib/semaphore \
  semaphoreui/semaphore:latest
```

For production, see [Installation](/admin-guide/installation) for Docker Compose, packages, Kubernetes, and binary installs. Then follow [Getting Started](/getting-started) to run your first task.

:::

<div className="row home-cards">
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Install and configure</h3></div>
      <div className="card__body">
        <p>Get a server running and connect it to your database, identity provider, and network.</p>
        <ul>
          <li><a href="/admin-guide/installation">Installation</a></li>
          <li><a href="/admin-guide/configuration">Configuration</a></li>
          <li><a href="/category/reverse-proxy">Reverse proxy and TLS</a></li>
          <li><a href="/admin-guide/ldap">LDAP</a> and <a href="/admin-guide/openid">OpenID Connect</a></li>
          <li><a href="/admin-guide/security">Security hardening</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Run automation</h3></div>
      <div className="card__body">
        <p>Organize work into projects, connect repositories and credentials, and run tasks on demand or on a schedule.</p>
        <ul>
          <li><a href="/getting-started">Getting started: first task in six steps</a></li>
          <li><a href="/user-guide/projects">Projects</a> and <a href="/user-guide/team">Teams</a></li>
          <li><a href="/user-guide/task-templates">Task templates</a> and <a href="/user-guide/tasks">Tasks</a></li>
          <li><a href="/user-guide/key-store">Key Store</a>, <a href="/user-guide/inventory">Inventory</a>, <a href="/user-guide/environment">Variable Groups</a></li>
          <li><a href="/user-guide/schedules">Schedules</a> and <a href="/user-guide/workflows">Workflows</a> (Pro)</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Operate at scale</h3></div>
      <div className="card__body">
        <p>Distribute execution, run redundantly, and keep the service observable and up to date.</p>
        <ul>
          <li><a href="/admin-guide/runners">Runners</a></li>
          <li><a href="/admin-guide/ha">High availability</a></li>
          <li><a href="/admin-guide/upgrading">Upgrading</a></li>
          <li><a href="/admin-guide/logs">Logs</a> and <a href="/admin-guide/metrics">Metrics</a></li>
          <li><a href="/category/notifications">Notifications</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Reference</h3></div>
      <div className="card__body">
        <p>Exact options and endpoints when you already know what you are looking for.</p>
        <ul>
          <li><a href="/admin-guide/configuration/config-file">Configuration file</a> and <a href="/admin-guide/configuration/env-vars">Environment variables</a></li>
          <li><a href="/admin-guide/api">REST API</a></li>
          <li><a href="/admin-guide/cli">CLI</a></li>
          <li><a href="/admin-guide/cicd">CI/CD integration</a></li>
          <li><a href="/faq/troubleshooting">Troubleshooting FAQ</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Guides by tool

<div className="home-tools margin-bottom--lg">
  <a className="button button--outline button--primary" href="/user-guide/apps/ansible">Ansible</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/terraform">Terraform / OpenTofu</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/bash">Shell</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/powershell">PowerShell</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/python">Python</a>
</div>

## Help and community

- **Questions:** ask on [Discord](https://discord.gg/5R6k7hNGcH).
- **Bugs and feature requests:** open an issue on [GitHub](https://github.com/semaphoreui/semaphore/issues).
- **Source code:** [github.com/semaphoreui/semaphore](https://github.com/semaphoreui/semaphore).
- **Pro and Enterprise:** [License activation](/admin-guide/license).
