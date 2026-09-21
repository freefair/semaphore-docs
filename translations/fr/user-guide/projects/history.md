# Historique

L'onglet **Historique** du tableau de bord du projet liste toutes les tâches du projet, de la plus récente à la plus ancienne. C'est la vue par défaut lorsque vous ouvrez un projet.

![Historique du projet](../../../../static/assets/project-dashboard-history.webp)

<a id="columns"></a>

## Colonnes

| Colonne | Contenu |
|---|---|
| **Tâche** | Numéro de la tâche, modèle à partir duquel elle a été créée et message du commit de la révision du dépôt utilisée. Une icône à gauche indique l'application (Ansible, Terraform, Bash, etc.). |
| **Version** | Pour les [modèles de build et de déploiement](../task-templates/build-deploy.md) : la version construite ou déployée. Pour les autres modèles, seulement une icône de statut. |
| **Statut** | Badge du statut actuel, voir [Statuts des tâches](../../../../docs/user-guide/tasks.md#task-statuses). |
| **Utilisateur** | Qui a démarré la tâche. Les tâches démarrées par une planification ou une intégration n'ont pas d'utilisateur. |
| **Début** | Date et heure de début dans le fuseau horaire de votre navigateur. |
| **Durée** | Durée d'exécution de la tâche. |

La liste est paginée. Cliquez sur le numéro de la tâche ou sur le nom du modèle pour ouvrir la [fenêtre de la tâche](../../../../docs/user-guide/tasks.md#task-window) avec le journal, les détails et le résumé. Cliquez sur le nom du modèle dans l'en-tête de la fenêtre de la tâche pour accéder à la page du modèle.

<a id="task-retention"></a>

## Conservation des tâches

Par défaut, toutes les tâches et leurs journaux sont conservés indéfiniment. Pour limiter l'historique par modèle, définissez `max_tasks_per_template` dans `config.json` ou la variable d'environnement `SEMAPHORE_MAX_TASKS_PER_TEMPLATE` :

```json
{
  "max_tasks_per_template": 30
}
```

Lorsque la limite est atteinte, les tâches les plus anciennes de ce modèle sont supprimées avec leurs journaux. Consultez [Configuration](../../../../docs/admin-guide/configuration.md) pour la liste complète des options.

<a id="see-also"></a>

## Voir aussi

- [Statistiques](stats.md) : résultats des tâches agrégés par jour.
- [Activité](activity.md) : journal d'audit des modifications apportées au projet.
