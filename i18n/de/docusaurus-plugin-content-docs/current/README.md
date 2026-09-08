---
title: Semaphore UI Dokumentation
sidebar_label: Startseite
hide_table_of_contents: true
---

# Semaphore UI Dokumentation

Semaphore UI ist eine selbst gehostete Weboberfläche und API zum Ausführen von **Ansible**-, **Terraform/OpenTofu**-, **Shell**-, **PowerShell**- und **Python**-Automatisierung. Es bietet Ihrem Team einen zentralen Ort, um Playbooks und Skripte auszuführen, Zugangsdaten verschlüsselt zu speichern, Jobs zu planen und nachzuvollziehen, wer wann was ausgeführt hat.

Es wird als einzelne Go-Binärdatei oder als Docker-Image ausgeliefert, läuft unter Linux, macOS und Windows und speichert Daten in SQLite, MySQL oder PostgreSQL.

:::tip[Schnellstart]

Starten Sie Semaphore mit SQLite mit einem einzigen Befehl, öffnen Sie dann [http://localhost:3000](http://localhost:3000) und melden Sie sich als `admin` / `changeme` an.

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

Für den Produktionsbetrieb finden Sie unter [Installation](/admin-guide/installation) Anleitungen für Docker Compose, Pakete, Kubernetes und Binärdateien. Folgen Sie anschließend [Erste Schritte](/getting-started), um Ihre erste Aufgabe auszuführen.

:::

<div className="row home-cards">
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Installieren und konfigurieren</h3></div>
      <div className="card__body">
        <p>Bringen Sie einen Server zum Laufen und verbinden Sie ihn mit Ihrer Datenbank, Ihrem Identity Provider und Ihrem Netzwerk.</p>
        <ul>
          <li><a href="/admin-guide/installation">Installation</a></li>
          <li><a href="/admin-guide/configuration">Konfiguration</a></li>
          <li><a href="/category/reverse-proxy">Reverse-Proxy und TLS</a></li>
          <li><a href="/admin-guide/ldap">LDAP</a> und <a href="/admin-guide/openid">OpenID Connect</a></li>
          <li><a href="/admin-guide/security">Sicherheitshärtung</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Automatisierung ausführen</h3></div>
      <div className="card__body">
        <p>Organisieren Sie die Arbeit in Projekten, verbinden Sie Repositories und Zugangsdaten und führen Sie Aufgaben bei Bedarf oder nach Zeitplan aus.</p>
        <ul>
          <li><a href="/getting-started">Erste Schritte: erste Aufgabe in sechs Schritten</a></li>
          <li><a href="/user-guide/projects">Projekte</a> und <a href="/user-guide/team">Teams</a></li>
          <li><a href="/user-guide/task-templates">Aufgabenvorlagen</a> und <a href="/user-guide/tasks">Aufgaben</a></li>
          <li><a href="/user-guide/key-store">Schlüsselspeicher</a>, <a href="/user-guide/inventory">Inventory</a>, <a href="/user-guide/environment">Variablengruppen</a></li>
          <li><a href="/user-guide/schedules">Zeitpläne</a> und <a href="/user-guide/workflows">Workflows</a> (Pro)</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Skalierter Betrieb</h3></div>
      <div className="card__body">
        <p>Verteilen Sie die Ausführung, betreiben Sie den Dienst redundant und halten Sie ihn beobachtbar und aktuell.</p>
        <ul>
          <li><a href="/admin-guide/runners">Runner</a></li>
          <li><a href="/admin-guide/ha">Hochverfügbarkeit</a></li>
          <li><a href="/admin-guide/upgrading">Aktualisierung</a></li>
          <li><a href="/admin-guide/logs">Logs</a> und <a href="/admin-guide/metrics">Metriken</a></li>
          <li><a href="/category/notifications">Benachrichtigungen</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Referenz</h3></div>
      <div className="card__body">
        <p>Genaue Optionen und Endpunkte, wenn Sie bereits wissen, wonach Sie suchen.</p>
        <ul>
          <li><a href="/admin-guide/configuration/config-file">Konfigurationsdatei</a> und <a href="/admin-guide/configuration/env-vars">Umgebungsvariablen</a></li>
          <li><a href="/admin-guide/api">REST-API</a></li>
          <li><a href="/admin-guide/cli">CLI</a></li>
          <li><a href="/admin-guide/cicd">CI/CD-Integration</a></li>
          <li><a href="/faq/troubleshooting">FAQ zur Fehlerbehebung</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Anleitungen nach Werkzeug {#guides-by-tool}

<div className="home-tools margin-bottom--lg">
  <a className="button button--outline button--primary" href="/user-guide/apps/ansible">Ansible</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/terraform">Terraform / OpenTofu</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/bash">Shell</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/powershell">PowerShell</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/python">Python</a>
</div>

## Hilfe und Community {#help-and-community}

- **Fragen:** stellen Sie auf [Discord](https://discord.gg/5R6k7hNGcH).
- **Fehler und Funktionswünsche:** erstellen Sie ein Issue auf [GitHub](https://github.com/semaphoreui/semaphore/issues).
- **Quellcode:** [github.com/semaphoreui/semaphore](https://github.com/semaphoreui/semaphore).
- **Pro und Enterprise:** [Lizenzaktivierung](/admin-guide/license).
