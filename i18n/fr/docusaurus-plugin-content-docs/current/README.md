---
title: Documentation Semaphore UI
sidebar_label: Accueil
hide_table_of_contents: true
---

# Documentation Semaphore UI

Semaphore UI est une interface web et une API auto-hébergées pour exécuter des automatisations **Ansible**, **Terraform/OpenTofu**, **Shell**, **PowerShell** et **Python**. Il offre à votre équipe un lieu unique pour exécuter des playbooks et des scripts, conserver les identifiants chiffrés, planifier des tâches et voir qui a exécuté quoi et quand.

Il est distribué sous forme d'un binaire Go unique ou d'une image Docker, fonctionne sous Linux, macOS et Windows, et stocke ses données dans SQLite, MySQL ou PostgreSQL.

:::tip[Démarrage rapide]

Lancez Semaphore avec SQLite en une seule commande, puis ouvrez [http://localhost:3000](http://localhost:3000) et connectez-vous avec `admin` / `changeme`.

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

Pour la production, consultez [Installation](/admin-guide/installation) pour les installations via Docker Compose, paquets, Kubernetes et binaire. Suivez ensuite [Premiers pas](/getting-started) pour exécuter votre première tâche.

:::

<div className="row home-cards">
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Installer et configurer</h3></div>
      <div className="card__body">
        <p>Mettez un serveur en service et connectez-le à votre base de données, votre fournisseur d'identité et votre réseau.</p>
        <ul>
          <li><a href="/admin-guide/installation">Installation</a></li>
          <li><a href="/admin-guide/configuration">Configuration</a></li>
          <li><a href="/category/reverse-proxy">Proxy inverse et TLS</a></li>
          <li><a href="/admin-guide/ldap">LDAP</a> et <a href="/admin-guide/openid">OpenID Connect</a></li>
          <li><a href="/admin-guide/security">Renforcement de la sécurité</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Exécuter des automatisations</h3></div>
      <div className="card__body">
        <p>Organisez le travail en projets, connectez des dépôts et des identifiants, et exécutez des tâches à la demande ou selon une planification.</p>
        <ul>
          <li><a href="/getting-started">Premiers pas : première tâche en six étapes</a></li>
          <li><a href="/user-guide/projects">Projets</a> et <a href="/user-guide/team">Équipes</a></li>
          <li><a href="/user-guide/task-templates">Modèles de tâches</a> et <a href="/user-guide/tasks">Tâches</a></li>
          <li><a href="/user-guide/key-store">Magasin de clés</a>, <a href="/user-guide/inventory">Inventaire</a>, <a href="/user-guide/environment">Groupes de variables</a></li>
          <li><a href="/user-guide/schedules">Planifications</a> et <a href="/user-guide/workflows">Workflows</a> (Pro)</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Exploiter à grande échelle</h3></div>
      <div className="card__body">
        <p>Distribuez l'exécution, fonctionnez en redondance et gardez le service observable et à jour.</p>
        <ul>
          <li><a href="/admin-guide/runners">Runners</a></li>
          <li><a href="/admin-guide/ha">Haute disponibilité</a></li>
          <li><a href="/admin-guide/upgrading">Mise à niveau</a></li>
          <li><a href="/admin-guide/logs">Journaux</a> et <a href="/admin-guide/metrics">Métriques</a></li>
          <li><a href="/category/notifications">Notifications</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Référence</h3></div>
      <div className="card__body">
        <p>Les options et points de terminaison exacts lorsque vous savez déjà ce que vous cherchez.</p>
        <ul>
          <li><a href="/admin-guide/configuration/config-file">Fichier de configuration</a> et <a href="/admin-guide/configuration/env-vars">Variables d'environnement</a></li>
          <li><a href="/admin-guide/api">API REST</a></li>
          <li><a href="/admin-guide/cli">CLI</a></li>
          <li><a href="/admin-guide/cicd">Intégration CI/CD</a></li>
          <li><a href="/faq/troubleshooting">FAQ de dépannage</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Guides par outil {#guides-by-tool}

<div className="home-tools margin-bottom--lg">
  <a className="button button--outline button--primary" href="/user-guide/apps/ansible">Ansible</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/terraform">Terraform / OpenTofu</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/bash">Shell</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/powershell">PowerShell</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/python">Python</a>
</div>

## Aide et communauté {#help-and-community}

- **Questions :** posez-les sur [Discord](https://discord.gg/5R6k7hNGcH).
- **Bugs et demandes de fonctionnalités :** ouvrez un ticket sur [GitHub](https://github.com/semaphoreui/semaphore/issues).
- **Code source :** [github.com/semaphoreui/semaphore](https://github.com/semaphoreui/semaphore).
- **Pro et Enterprise :** [Activation de la licence](/admin-guide/license).
