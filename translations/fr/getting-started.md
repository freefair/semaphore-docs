# Premiers pas

Cette page vous guide depuis une installation fraîche jusqu'à votre première tâche réussie. Chaque étape renvoie vers la page contenant les détails.

<a id="from-zero-to-first-task"></a>

## De zéro à la première tâche

1. **Installez Semaphore** avec la méthode de votre choix : [Installation](../../docs/admin-guide/installation.md).
2. **Connectez-vous** avec l'utilisateur administrateur créé lors de l'installation, ou via les variables `SEMAPHORE_ADMIN_*` sous Docker.
3. **Créez un projet.** Un projet isole les équipes, les infrastructures ou les applications les unes des autres : [Projets](../../docs/user-guide/projects.md).
4. **Connectez ce dont votre automatisation a besoin :**
   - Le code source contenant les playbooks, modules ou scripts : [Dépôts](../../docs/user-guide/repositories.md).
   - Les clés SSH, tokens et mots de passe : [Coffre de clés](../../docs/user-guide/key-store.md).
   - Les hôtes cibles et les paramètres de connexion : [Inventaire](../../docs/user-guide/inventory.md).
   - Les variables réutilisables : [Groupes de variables](../../docs/user-guide/environment.md).
5. **Créez un modèle de tâche et exécutez-le.** Choisissez le guide correspondant à votre outil : [Ansible](../../docs/user-guide/apps/ansible.md), [Terraform/OpenTofu](../../docs/user-guide/apps/terraform/README.md), [Shell](../../docs/user-guide/apps/bash.md), [PowerShell](../../docs/user-guide/apps/powershell.md) ou [Python](../../docs/user-guide/apps/python.md). Puis exécutez-le et suivez son déroulement : [Tâches](../../docs/user-guide/tasks.md).
6. **Automatisez et industrialisez :**
   - Exécution planifiée : [Planifications](../../docs/user-guide/schedules.md).
   - Contrôle de qui peut faire quoi : [Équipes et rôles personnalisés](../../docs/user-guide/team.md).
   - Alertes sur les résultats : [Notifications](../../docs/admin-guide/notifications.md).

<a id="key-concepts"></a>

## Concepts clés

Ces termes apparaissent partout dans l'interface.

| Terme | Signification |
|------|---------|
| **Projet** | L'unité principale de séparation. Chaque projet possède ses propres dépôts, clés, inventaires, modèles et équipe. [Projets](../../docs/user-guide/projects.md) |
| **Dépôt** | Un dépôt Git ou un chemin local où résident les playbooks, modules ou scripts. [Dépôts](../../docs/user-guide/repositories.md) |
| **Inventaire** | Hôtes, groupes et paramètres de connexion pour les exécutions de type Ansible. [Inventaire](../../docs/user-guide/inventory.md) |
| **Groupe de variables** | Variables réutilisables et configuration d'environnement, aussi appelé Environnement. [Groupes de variables](../../docs/user-guide/environment.md) |
| **Coffre de clés** | Identifiants chiffrés tels que clés SSH, tokens et mots de passe. [Coffre de clés](../../docs/user-guide/key-store.md) |
| **Modèle de tâche** | La définition d'une exécution : application, dépôt, inventaire, variables et options. [Modèles de tâches](../../docs/user-guide/task-templates/README.md) |
| **Tâche** | Une exécution unique d'un modèle, avec son journal et son statut. [Tâches](../../docs/user-guide/tasks.md) |
| **Workflow** | Un graphe de modèles avec branchements, approbations et délais. Fonctionnalité Pro. [Workflows](../../docs/user-guide/workflows.md) |
| **Runner** | L'endroit où les tâches s'exécutent : le serveur lui-même ou un runner distant. [Runners](../../docs/admin-guide/runners.md) |

<a id="next-steps"></a>

## Étapes suivantes

- Placez Semaphore derrière TLS avec un [reverse proxy](../../docs/admin-guide/reverse-proxy/README.md).
- Connectez votre fournisseur d'identité : [LDAP](../../docs/admin-guide/authentication/ldap.md) ou [OpenID Connect](../../docs/admin-guide/authentication/openid.md).
- Pilotez Semaphore depuis votre CI ou vos scripts avec l'[API](../../docs/reference/api.md) et la [CLI](../../docs/reference/cli/README.md).
