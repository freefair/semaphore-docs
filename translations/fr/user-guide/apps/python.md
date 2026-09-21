# Python

Semaphore peut exécuter directement des scripts Python. Pour cela, créez un modèle de tâche **Python**.

<a id="creating-a-python-template"></a>

## Créer un modèle Python

1. Allez dans la section **Modèles de tâches** et cliquez sur le bouton **Nouveau modèle**.
2. Sélectionnez **Python** comme type d'application.
3. Configurez le modèle :

| Champ | Description |
|---|---|
| **Nom** | Un nom descriptif pour le modèle |
| **Dépôt** | Dépôt contenant votre script `.py` |
| **Playbook / Script** | Chemin relatif vers le script, par exemple `scripts/deploy.py` |
| **Groupes de variables** | Groupes de variables dont les valeurs sont injectées comme variables d'environnement |

4. Cliquez sur **Créer**.
5. Cliquez sur **Exécuter** pour lancer le modèle.

<a id="passing-variables-to-scripts"></a>

## Transmettre des variables aux scripts

Les variables des **Groupes de variables** sélectionnés sont injectées comme variables d'environnement. Accédez-y dans Python avec `os.environ` :

```python
import os

target = os.environ.get("TARGET_HOST")
print(f"Deploying to {target}")
```

<a id="python-version-and-dependencies"></a>

## Version de Python et dépendances

Semaphore utilise le binaire `python3` présent dans le `PATH` de l'environnement d'exécution.

- **Installation binaire/paquet** : assurez-vous que le bon `python3` est installé sur l'hôte.
- **Docker** : utilisez une image personnalisée avec la version de Python requise.
- **Docker (paquets supplémentaires)** : montez un fichier `requirements.txt` à l'emplacement `/etc/semaphore/requirements.txt` dans le conteneur du serveur ou du runner. Semaphore l'installe dans l'environnement virtuel Python embarqué à chaque démarrage du conteneur. Voir [Installer des dépendances Python supplémentaires](../../../../docs/admin-guide/installation/docker.md#installing-additional-python-dependencies).

<a id="notes"></a>

## Remarques

- Les scripts s'exécutent de manière non interactive.
- Le code de sortie `0` signifie succès ; tout code de sortie non nul marque la tâche comme échouée.
