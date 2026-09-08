# Modèles de tâches

Les modèles définissent la manière d'exécuter les tâches Semaphore. Les types de tâches suivants sont actuellement pris en charge :

* [Ansible](/user-guide/apps/ansible)
* [Terraform/OpenTofu](/user-guide/apps/terraform)
* [Shell](/user-guide/apps/bash)
* [Powershell](/user-guide/apps/powershell)
* [Python](/user-guide/apps/python)

---

## Tâches parallèles {#parallel-tasks}

Par défaut, les tâches issues d'un même modèle s'exécutent séquentiellement. Pour autoriser des exécutions simultanées d'un même modèle, activez l'option « Autoriser les tâches parallèles » dans les paramètres du modèle.

## Image d'exécuteur (runners Docker et Kubernetes) {#executor-image-docker-and-kubernetes-runners}

Lorsqu'un runner de projet utilise l'exécuteur **Docker** (Pro) ou **Kubernetes** (Enterprise), chaque tâche s'exécute normalement dans l'image de job par défaut configurée sur le runner (par exemple `semaphoreui/job:latest`). Vous pouvez remplacer cette image pour chaque modèle.

1. Ouvrez les paramètres du modèle
2. Définissez **Image d'exécuteur** sur la référence de l'image de conteneur (par exemple `my-registry/ansible:2.16` ou `semaphoreui/job:latest`)
3. Enregistrez le modèle

**Comportement** :
- Seuls les exécuteurs de runner **Docker** et **Kubernetes** prennent en compte ce champ ; l'exécuteur local l'ignore
- Laissez le champ vide pour utiliser l'image par défaut du runner définie dans `runner.executor.docker.image` ou `runner.executor.k8s.image`
- Effacer le champ dans l'interface supprime la surcharge

**Cas d'usage** :
- Modèles nécessitant une chaîne d'outils différente (Ansible plus ancien, version spécifique de Terraform, paquets système supplémentaires intégrés dans une image personnalisée)
- Images isolées pour les modèles sensibles en matière de sécurité, sans modifier la valeur par défaut du runner

Consultez [Configuration du runner](/admin-guide/configuration) pour les paramètres d'image par défaut et [Runners de projet](/user-guide/projects/runners) pour la configuration de l'exécuteur.
