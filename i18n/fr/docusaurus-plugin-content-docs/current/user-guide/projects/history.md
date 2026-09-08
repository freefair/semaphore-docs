
# Historique

L'écran Historique de Semaphore offre une vue complète de toutes les exécutions de tâches de votre projet. Cette fonctionnalité vous permet de suivre et d'analyser l'historique d'exécution de vos tâches, et vous fournit des informations précieuses sur vos workflows d'automatisation.

![](/assets/project_history.webp)

## Vue d'ensemble {#overview}

La page Historique affiche une liste chronologique de toutes les exécutions de tâches, avec notamment :

- Les modèles de tâches utilisés
- Le statut d'exécution (succès, échec, en cours)
- Les heures de début et de fin
- La durée
- L'utilisateur ayant lancé la tâche
- La sortie et les journaux de la tâche

## Consulter l'historique des tâches {#viewing-task-history}

### Accéder à l'historique {#accessing-history}

1. Accédez à votre projet dans Semaphore
2. Cliquez sur l'onglet « Historique »
3. Consultez la liste de toutes les exécutions de tâches

## Détails d'une tâche {#task-details}

Cliquer sur une tâche dans la liste de l'historique ouvre une vue détaillée présentant :

1. **Informations sur la tâche**
   - ID de la tâche
   - Modèle utilisé
   - Heures de début et de fin
   - Durée
   - Statut
   - Utilisateur ayant exécuté la tâche

2. **Détails de l'exécution**
   - Sortie complète de la tâche
   - Messages d'erreur (le cas échéant)
   - Variables d'environnement utilisées
   - Informations sur l'inventaire
   - Détails du dépôt

3. **Journaux de la tâche**
   - Consultation des journaux en temps réel
   - Option de téléchargement des journaux
   - Fonction de recherche dans les journaux
   - Mise en évidence des erreurs

### Statistiques {#statistics}

Le projet propose une page de statistiques résumant les résultats des tâches sur une période sélectionnée, avec filtrage par utilisateur.

## Gestion des tâches {#task-management}

### Actions disponibles {#actions-available}

Depuis la vue Historique, vous pouvez :

- Accéder aux journaux complets des tâches
- Télécharger la sortie des tâches
- Effectuer des recherches dans les journaux

## Rétention des tâches {#task-retention}

Semaphore vous permet de configurer la durée de conservation de l'historique des tâches :

1. **Comportement par défaut**
   - Toutes les tâches sont stockées dans la base de données
   - Aucune suppression automatique par défaut

2. **Configurer la rétention**
   - Définissez un nombre maximal de tâches par modèle
   - Configurez-le via une variable d'environnement :
     ```bash
     SEMAPHORE_MAX_TASKS_PER_TEMPLATE=30
     ```
   - Ou via config.json :
     ```json
     {
       "max_tasks_per_template": 30
     }
     ```

3. **Règles de rétention**
   - Lorsque la limite est atteinte, les tâches les plus anciennes sont supprimées automatiquement
   - La suppression s'effectue par modèle
   - Les journaux des tâches sont supprimés en même temps que les enregistrements des tâches
