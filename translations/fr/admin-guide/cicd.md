# Intégration CI/CD

Semaphore peut constituer une étape dans un pipeline externe, et il peut exécuter ses propres pipelines simples de build et de déploiement.

<a id="build-and-deploy-pipelines-inside-semaphore"></a>

## Pipelines de build et de déploiement dans Semaphore

Les types de modèle **Build** et **Deploy**, le versionnement des artefacts et la variable `semaphore_vars` sont décrits dans le guide de l'utilisateur : [Modèles de build et de déploiement](../../../docs/user-guide/task-templates/build-deploy.md). Les pipelines multi-étapes avec approbations se construisent avec les [Workflows](../../../docs/user-guide/workflows.md).

<a id="starting-semaphore-tasks-from-an-external-ci-system"></a>

## Démarrer des tâches Semaphore depuis un système de CI externe

Il existe deux façons de déclencher une tâche depuis GitHub Actions, GitLab CI, Jenkins ou tout autre système :

- **Intégrations** : une URL de webhook par projet qui démarre un modèle lorsque la requête correspond. Elle prend en charge les signatures GitHub, les jetons et HMAC, et peut transmettre des champs de la requête à la tâche sous forme de variables. Voir [Intégrations](../../../docs/user-guide/integrations.md).
- **API REST** : créez une tâche avec un jeton d'API :

```bash
curl -X POST https://semaphore.example.com/api/project/1/tasks \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"template_id": 5, "message": "Triggered by CI"}'
```

La réponse contient l'identifiant de la tâche. Interrogez `GET /api/project/1/tasks/{task_id}` jusqu'à ce que le `status` soit `success`, `error` ou `stopped`. Voir [API](../../../docs/reference/api.md) pour les jetons et la référence Swagger intégrée.
