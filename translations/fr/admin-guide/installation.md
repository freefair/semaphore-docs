# Installation

Vous pouvez installer Semaphore de plusieurs manières, selon votre système d'exploitation, votre environnement et vos préférences .

<a id="in-this-section"></a>

## Dans cette section

| Méthode | Quand l’utiliser |
|---|---|
| [Gestionnaire de paquets](../../../docs/admin-guide/installation/package-manager.md) | Vous voulez un paquet natif pour votre distribution Linux. |
| [Docker](../../../docs/admin-guide/installation/docker.md) | Vous voulez exécuter Semaphore dans un conteneur avec Docker ou Docker Compose. |
| [Cloud](../../../docs/admin-guide/installation/cloud.md) | Vous déployez sur une plateforme cloud et cherchez des conseils sur les services gérés et l’infrastructure. |
| [Fichier binaire](../../../docs/admin-guide/installation/binary-file.md) | Vous voulez installer un binaire précompilé et gérer vous-même le processus. |
| [Kubernetes (chart Helm)](../../../docs/admin-guide/installation/k8s.md) | Vous utilisez déjà Kubernetes et voulez gérer le déploiement avec Helm. |

<a id="installing-additional-python-packages"></a>

## Installation de paquets Python supplémentaires

Certains modules et rôles Ansible nécessitent des paquets Python supplémentaires pour fonctionner. Pour installer des paquets Python supplémentaires, créez un fichier `requirements.txt` et montez-le dans le répertoire `/etc/semaphore` du conteneur. Par exemple, vous pouvez ajouter les lignes suivantes à votre fichier `docker-compose.yml` :

```yaml
volumes:
  - /path/to/requirements.txt:/etc/semaphore/requirements.txt
```

Les paquets indiqués dans le fichier requirements sont installés dans l'environnement virtuel Ansible embarqué à chaque démarrage du conteneur. Le même montage fonctionne pour l'image `semaphoreui/runner`. Consultez [Installation de dépendances Python supplémentaires](../../../docs/admin-guide/installation/docker.md#installing-additional-python-dependencies) pour plus de détails et une alternative basée sur une image personnalisée.

Pour plus d'informations sur les fichiers requirements de Python, consultez la [référence du format des fichiers requirements de pip](https://pip.pypa.io/en/stable/reference/requirements-file-format/)

<a id="where-to-start"></a>

## Par où commencer

Commencez par le guide adapté à votre environnement de déploiement. Pour une installation binaire, suivez les instructions du service afin de maintenir Semaphore en cours d’exécution. Pour configurer l’utilisateur du service, les dépendances Python et systemd, utilisez le guide d’installation manuelle.

* [Exécuter en tant que service](../../../docs/admin-guide/installation/binary-file.md#run-as-a-service)
* [Installation manuelle](../../../docs/admin-guide/installation_manually.md)
