---
title: Documentazione di Semaphore UI
sidebar_label: Home
hide_table_of_contents: true
---

# Documentazione di Semaphore UI

Semaphore UI è un'interfaccia web e un'API self-hosted per eseguire automazioni **Ansible**, **Terraform/OpenTofu**, **Shell**, **PowerShell** e **Python**. Offre al team un unico punto da cui eseguire playbook e script, conservare le credenziali cifrate, pianificare i job e vedere chi ha eseguito cosa e quando.

Viene distribuito come singolo binario Go o immagine Docker, funziona su Linux, macOS e Windows e memorizza i dati in SQLite, MySQL o PostgreSQL.

:::tip[Avvio rapido]

Avviare Semaphore con SQLite con un solo comando, quindi aprire [http://localhost:3000](http://localhost:3000) e accedere come `admin` / `changeme`.

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

Per la produzione, consultare [Installazione](/admin-guide/installation) per Docker Compose, pacchetti, Kubernetes e installazione da binario. Seguire poi [Primi passi](/getting-started) per eseguire il primo task.

:::

<div className="row home-cards">
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Installazione e configurazione</h3></div>
      <div className="card__body">
        <p>Mettere in funzione un server e collegarlo al database, all'identity provider e alla rete.</p>
        <ul>
          <li><a href="/admin-guide/installation">Installazione</a></li>
          <li><a href="/admin-guide/configuration">Configurazione</a></li>
          <li><a href="/category/reverse-proxy">Reverse proxy e TLS</a></li>
          <li><a href="/admin-guide/ldap">LDAP</a> e <a href="/admin-guide/openid">OpenID Connect</a></li>
          <li><a href="/admin-guide/security">Hardening della sicurezza</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Eseguire automazioni</h3></div>
      <div className="card__body">
        <p>Organizzare il lavoro in progetti, collegare repository e credenziali ed eseguire task su richiesta o in base a una pianificazione.</p>
        <ul>
          <li><a href="/getting-started">Primi passi: il primo task in sei passaggi</a></li>
          <li><a href="/user-guide/projects">Progetti</a> e <a href="/user-guide/team">Team</a></li>
          <li><a href="/user-guide/task-templates">Template di task</a> e <a href="/user-guide/tasks">Task</a></li>
          <li><a href="/user-guide/key-store">Key Store</a>, <a href="/user-guide/inventory">Inventory</a>, <a href="/user-guide/environment">Gruppi di variabili</a></li>
          <li><a href="/user-guide/schedules">Pianificazioni</a> e <a href="/user-guide/workflows">Workflow</a> (Pro)</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Operare su larga scala</h3></div>
      <div className="card__body">
        <p>Distribuire l'esecuzione, garantire la ridondanza e mantenere il servizio osservabile e aggiornato.</p>
        <ul>
          <li><a href="/admin-guide/runners">Runner</a></li>
          <li><a href="/admin-guide/ha">Alta disponibilità</a></li>
          <li><a href="/admin-guide/upgrading">Aggiornamento</a></li>
          <li><a href="/admin-guide/logs">Log</a> e <a href="/admin-guide/metrics">Metriche</a></li>
          <li><a href="/category/notifications">Notifiche</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Riferimento</h3></div>
      <div className="card__body">
        <p>Opzioni ed endpoint esatti, per quando si sa già cosa si sta cercando.</p>
        <ul>
          <li><a href="/admin-guide/configuration/config-file">File di configurazione</a> e <a href="/admin-guide/configuration/env-vars">Variabili d'ambiente</a></li>
          <li><a href="/admin-guide/api">API REST</a></li>
          <li><a href="/admin-guide/cli">CLI</a></li>
          <li><a href="/admin-guide/cicd">Integrazione CI/CD</a></li>
          <li><a href="/faq/troubleshooting">FAQ sulla risoluzione dei problemi</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Guide per strumento {#guides-by-tool}

<div className="home-tools margin-bottom--lg">
  <a className="button button--outline button--primary" href="/user-guide/apps/ansible">Ansible</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/terraform">Terraform / OpenTofu</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/bash">Shell</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/powershell">PowerShell</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/python">Python</a>
</div>

## Aiuto e community {#help-and-community}

- **Domande:** chiedere su [Discord](https://discord.gg/5R6k7hNGcH).
- **Bug e richieste di funzionalità:** aprire una issue su [GitHub](https://github.com/semaphoreui/semaphore/issues).
- **Codice sorgente:** [github.com/semaphoreui/semaphore](https://github.com/semaphoreui/semaphore).
- **Pro ed Enterprise:** [Attivazione della licenza](/admin-guide/license).
