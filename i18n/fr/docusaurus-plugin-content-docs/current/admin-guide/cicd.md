# Pipelines

Semaphore prend en charge des pipelines simples à l'aide de tâches `build` et `deploy`. 

Semaphore transmet la variable `semaphore_vars` à chaque playbook Ansible qu'il exécute.

Vous pouvez l'utiliser dans vos tâches Ansible pour connaître le type de tâche exécutée, la version à construire ou à déployer, qui a lancé la tâche, etc.

---

Exemple de `semaphore_vars` pour les tâches `build` :

```yaml
semaphore_vars:
    task_details:
        type: build
        username: user123
        message: New version of some feature
        target_version: 1.5.33
```

Exemple de `semaphore_vars` pour les tâches `deploy` :

```yaml
semaphore_vars:
    task_details:
        type: deploy
        username: user123
        message: Deploy new feature to servers
        incoming_version: 1.5.33
```

Pour les modèles **Bash**, **PowerShell** et **Python**, Semaphore fournit les mêmes valeurs `task_details` sous forme de variables d'environnement :

| Champ `task_details` | Variable d'environnement | Remarques |
| --- | --- | --- |
| `type` | `SEMAPHORE_TASK_DETAILS_TYPE` | `build` ou `deploy` |
| `username` | `SEMAPHORE_TASK_DETAILS_USERNAME` | Utilisateur ayant lancé la tâche |
| `message` | `SEMAPHORE_TASK_DETAILS_MESSAGE` | Message de la tâche |
| `target_version` | `SEMAPHORE_TASK_DETAILS_TARGET_VERSION` | Présent pour les tâches `build` |
| `incoming_version` | `SEMAPHORE_TASK_DETAILS_INCOMING_VERSION` | Présent pour les tâches `deploy` |

Exemple pour Bash :

```bash
echo "$SEMAPHORE_TASK_DETAILS_TYPE"
echo "$SEMAPHORE_TASK_DETAILS_TARGET_VERSION"
```

Exemple pour PowerShell :

```powershell
$env:SEMAPHORE_TASK_DETAILS_TYPE
$env:SEMAPHORE_TASK_DETAILS_INCOMING_VERSION
```

Exemple pour Python :

```python
import os

task_type = os.getenv("SEMAPHORE_TASK_DETAILS_TYPE")
target_version = os.getenv("SEMAPHORE_TASK_DETAILS_TARGET_VERSION")
incoming_version = os.getenv("SEMAPHORE_TASK_DETAILS_INCOMING_VERSION")
```

### Build {#build}

Ce type de tâche sert à créer des [artefacts](https://en.wikipedia.org/wiki/Artifact\_\(software\_development\)). Chaque tâche de build possède une version générée automatiquement. Vous devez utiliser la variable `semaphore_vars.task_details.target_version` dans votre playbook Ansible pour connaître la version de l'artefact à créer. Une fois l'artefact créé, il peut être utilisé pour le déploiement.

---

Exemple de rôle Ansible `build` :

1. Récupérer le code source de l'application depuis GitHub
2. Compiler le code source
3. Empaqueter le binaire créé dans une archive tar nommée `app-{{semaphore_vars.task_details.target_version}}.tar.gz`
4. Envoyer `app-{{semaphore_vars.task_details.target_version}}.tar.gz` vers un bucket S3



### Deploy {#deploy}

Ce type de tâche sert à déployer des artefacts sur les serveurs de destination. Chaque tâche de déploiement est associée à une tâche de build. Vous devez utiliser la variable `semaphore_vars.task_details.incoming_version` dans votre playbook Ansible pour connaître la version de l'artefact à déployer.

---

Exemple de rôle Ansible `deploy` :

1. Télécharger `app-{{semaphore_vars.task_details.incoming_version}}.tar.gz` depuis un bucket S3 vers les serveurs de destination
2. Décompresser `app-{{semaphore_vars.task_details.incoming_version}}.tar.gz` dans le répertoire de destination
3. Créer ou mettre à jour les fichiers de configuration
4. Redémarrer le service de l'application

