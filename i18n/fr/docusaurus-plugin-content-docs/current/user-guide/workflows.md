# Workflows (Pro)

Les workflows vous permettent d'enchaîner plusieurs modèles de tâches dans un graphe
orienté (DAG) avec des embranchements, des approbations et des pauses temporisées.
Une exécution de workflow progresse automatiquement à mesure que chaque étape se
termine — vous concevez le graphe une seule fois dans l'éditeur visuel, puis vous
lancez des exécutions depuis la page Workflows.

:::info
Les workflows sont une fonctionnalité de **Semaphore Pro**. L'entrée de menu Workflows
n'apparaît que si votre abonnement les inclut.
:::

## Vue d'ensemble {#overview}

Un workflow se compose de :

- **Nœuds** — les étapes du graphe (exécuter un modèle, attendre une approbation,
  marquer une pause ou annoter avec une note).
- **Arêtes** — les connexions entre les nœuds, chacune portant une **condition** qui
  détermine quand le nœud en aval démarre.

Lorsque vous démarrez un workflow, Semaphore crée une **exécution de workflow**. Le
serveur pilote la progression : à mesure que les tâches se terminent, que les
approbations sont résolues ou que les délais expirent, les nœuds en aval sont lancés
selon les conditions des arêtes.

## Créer un workflow {#creating-a-workflow}

1. Ouvrez votre projet et accédez à **Workflows**.
2. Cliquez sur **Nouveau workflow**.
3. Dans l'éditeur graphique :
   - Faites glisser des nœuds depuis la palette vers le canevas.
   - Connectez les nœuds en faisant glisser depuis la poignée de sortie d'un nœud vers un autre.
   - Cliquez sur un nœud ou une arête pour modifier ses propriétés dans le panneau latéral.
4. Définissez un **nom** (et éventuellement une **version de départ** pour le versionnage des exécutions).
5. Corrigez les problèmes listés dans le panneau **Problèmes**, puis cliquez sur **Enregistrer**.

L'éditeur valide le graphe avant l'enregistrement. Un workflow valide doit comporter
au moins un nœud, exactement un nœud de départ (sans arête entrante), aucun cycle, et
une configuration complète sur chaque nœud exécutable.

## Types de nœuds {#node-kinds}

| Type | Rôle |
|------|---------|
| **Tâche** | Exécute un modèle de tâche. Vous pouvez remplacer les paramètres du modèle (inventory, environnement, limit Ansible, arguments CLI supplémentaires) pour chaque nœud via les **paramètres de tâche**. |
| **Approbation** | Met l'exécution en pause jusqu'à ce qu'un utilisateur disposant des droits nécessaires l'approuve ou la rejette. Vous pouvez éventuellement définir un délai d'expiration (en secondes) et un message d'approbation. |
| **Délai** | Attend un nombre de secondes configuré avant de poursuivre vers les nœuds en aval. Utile pour les périodes de latence, les fenêtres de maintenance ou l'espacement d'étapes dépendantes. |
| **Note** | Annotation libre sur le canevas. Les nœuds de type note ne s'exécutent pas et ne sont pas reliés par des arêtes — ils servent uniquement à la documentation. |

### Convergence {#convergence}

Les nœuds ayant plusieurs arêtes entrantes peuvent exiger que **tous** les nœuds en
amont se terminent (par défaut) ou que **l'un** d'entre eux seulement se termine.
Définissez la **Convergence** dans le panneau de propriétés du nœud.

### Nœuds de délai {#delay-nodes}

Un nœud de délai met l'exécution du workflow en pause pendant la durée configurée
(minimum 1 seconde). Pendant l'attente :

- L'exécution reste dans l'état **running**.
- La vue d'exécution affiche un compte à rebours en direct sur le nœud de délai.
- Les nœuds en aval reliés par des arêtes ne démarrent pas tant que le délai n'est pas écoulé.

Si l'exécution du workflow est **arrêtée** alors qu'un délai est actif, le délai est
annulé et l'exécution se termine dans l'état **stopped**.

### Nœuds d'approbation {#approval-nodes}

Lorsque l'exécution atteint un nœud d'approbation, son état passe à **approval**
jusqu'à ce que quelqu'un l'approuve ou la rejette. Les commandes Approuver/Rejeter
apparaissent dans la vue d'exécution. Les approbations rejetées font échouer
l'exécution selon les conditions des arêtes connectées.

## Conditions des arêtes {#edge-conditions}

Chaque arête possède une condition qui détermine quand le nœud en aval devient prêt :

| Condition | Le nœud en aval démarre lorsque le nœud en amont… |
|-----------|-------------------------------------------|
| **En cas de succès** | Se termine avec succès (par défaut). |
| **En cas d'échec** | Se termine avec une erreur. |
| **Toujours** | Se termine dans n'importe quel état final (succès ou échec). |

Utilisez les branches **En cas d'échec** pour des actions de compensation ou des
notifications. Utilisez **Toujours** lorsque l'étape suivante doit s'exécuter quel que
soit le résultat.

## Exécution et suivi {#running-and-monitoring}

- **Exécuter le workflow** — démarre une nouvelle exécution depuis la liste des Workflows.
- **Vue d'exécution** — graphe en plein écran avec l'état en direct de chaque nœud (en cours,
  succès, échec, approbation, compte à rebours du délai).
- **Arrêter** — tant qu'une exécution est à l'état `running` ou `approval`, les utilisateurs
  disposant du droit `run_project_tasks` peuvent l'arrêter. Toutes les tâches actives sont
  arrêtées, les approbations en attente sont rejetées et l'exécution est marquée **stopped**.

États d'exécution : `running`, `approval`, `success`, `failed`, `stopped`.

## Versionnage des exécutions {#run-versioning}

Définissez une **Version de départ** sur le workflow (par exemple `1.0.0`) pour activer
les étiquettes de version sur chaque exécution. Semaphore incrémente la version à chaque
nouvelle exécution, de la même manière que pour les modèles de build.

## Artefacts de workflow (set_stats) {#workflow-artifacts-set_stats}

Lorsqu'une tâche Ansible d'un workflow utilise `set_stats`, les variables sont stockées
en tant qu'**artefacts de workflow** pour cette exécution. Les nœuds de tâche en aval de
la même exécution les reçoivent automatiquement comme variables supplémentaires.

:::warning
Si des étapes du workflow s'exécutent sur des **runners distants**, les artefacts de
workflow ne circulent pas encore entre les étapes exécutées sur des runners distants —
ils ne sont transmis qu'entre les tâches exécutées localement sur le serveur Semaphore.
Planifiez la transmission des artefacts en conséquence, ou conservez les étapes qui
produisent et consomment des artefacts sur le même chemin d'exécution.
:::

## Permissions {#permissions}

- La gestion des workflows (création, modification, suppression) nécessite les permissions
  de gestion des ressources du projet.
- L'exécution des workflows nécessite `run_project_tasks`.
- La résolution des approbations nécessite un accès approprié au projet (les mêmes
  utilisateurs qui peuvent exécuter des tâches dans le projet).

## API {#api}

Les modèles de workflow et les exécutions sont disponibles sous
`/api/project/{project_id}/workflows`. Consultez la
[documentation de l'API](/admin-guide/api) pour les schémas de requête et de réponse, y
compris les champs du nœud `delay` (`delay_seconds`) et le point de terminaison d'arrêt
(`POST …/runs/{run_id}/stop`).
