# Tâches

Une tâche est une instance de lancement d'un playbook Ansible. Vous pouvez créer la tâche à partir d'un [modèle de tâche](task-templates/) en cliquant sur le bouton Run/Build/Deploy du modèle souhaité.

![](/assets/image6.png)

Le type de tâche **Deploy** vous permet de spécifier une version du build associée à la tâche. Par défaut, il s'agit de la dernière version du build.

![](/assets/task_deploy1.png)

Lorsque la tâche est en cours d'exécution ou terminée, vous pouvez consulter son statut et le journal d'exécution.

![](/assets/image7.png)

### Affichage du journal brut {#raw-log-view}

Vous pouvez ouvrir le journal brut non traité de la tâche depuis la fenêtre de journal de la tâche via l'action RAW LOG.

## Rétention des journaux de tâches {#tasks-log-retention}
Vous remarquerez que les journaux des exécutions précédentes de vos tâches sont disponibles dans le modèle de tâche ou dans le tableau de bord.

Cependant, par défaut, la rétention des journaux est illimitée.

Vous pouvez la configurer à l'aide du paramètre `max_tasks_per_template` dans `config.json` ou de la variable d'environnement `SEMAPHORE_MAX_TASKS_PER_TEMPLATE`.

