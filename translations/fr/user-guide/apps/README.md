# Applications

Une application est l'outil qu'exécute un modèle de tâche. Semaphore est livré avec sept applications intégrées ; les administrateurs peuvent les activer, les désactiver et enregistrer les leurs.

| Application | ID | Ce qu'exécute un modèle | Guide |
|---|---|---|---|
| Ansible Playbook | `ansible` | `ansible-playbook` avec l'inventaire sélectionné | [Ansible](ansible.md) |
| Terraform Code | `terraform` | `terraform` dans le sous-répertoire et l'espace de travail sélectionnés | [Terraform/OpenTofu](../../../../docs/user-guide/apps/terraform/README.md) |
| OpenTofu Code | `tofu` | `tofu`, avec les mêmes options que Terraform | [Terraform/OpenTofu](../../../../docs/user-guide/apps/terraform/README.md) |
| Terragrunt Code | `terragrunt` | `terragrunt` encapsulant Terraform ou OpenTofu | [Terragrunt](terragrunt.md) |
| Bash Script | `bash` | un script shell avec `/bin/bash` | [Shell](bash.md) |
| PowerShell Script | `powershell` | un script `.ps1` avec `pwsh` | [PowerShell](powershell.md) |
| Python Script | `python` | un script `.py` avec `python3` | [Python](python.md) |

L'outil lui-même doit être installé sur la machine qui exécute les tâches : le serveur Semaphore ou le [runner](../../../../docs/admin-guide/runners.md). L'image Docker officielle contient Ansible, Terraform, OpenTofu, Bash et Python.

<a id="managing-applications"></a>

## Gérer les applications

Les administrateurs ouvrent **Applications** depuis le menu du compte, en bas de la barre latérale.

![Page Applications](../../../../static/assets/apps-list.webp)

L'interrupteur présent sur chaque ligne active ou désactive l'application. Une application désactivée n'est plus proposée dans le formulaire de modèle ; les modèles existants continuent de fonctionner. Seules les applications activées apparaissent lors de la création d'un modèle : désactivez donc les outils qui ne sont pas installés sur votre serveur.

Cliquez sur une application pour modifier son titre, son icône, le chemin de son binaire et sa priorité (l'ordre dans le formulaire de modèle).

<a id="custom-applications"></a>

## Applications personnalisées

**Nouvelle application** permet d'enregistrer n'importe quel outil en ligne de commande comme application :

| Champ | Description |
|---|---|
| **ID** | Identifiant court utilisé dans l'API et dans les modèles, par exemple `pulumi`. |
| **Icône** | Icône affichée à côté du nom. |
| **Nom** | Titre affiché dans le formulaire de modèle. |
| **Chemin** | Chemin de l'exécutable sur le serveur ou le runner. |
| **Priorité** | Position dans la liste des applications. |
| **Actif** | Indique si l'application est proposée dans les modèles. |

Un modèle d'application personnalisée exécute l'exécutable en lui passant en argument le fichier de script issu du dépôt et reçoit les groupes de variables sous forme de variables d'environnement, de la même façon que les modèles [Bash](bash.md).

Les applications peuvent également être prédéfinies dans la configuration du serveur, voir la section `apps` dans [Configuration](../../../../docs/admin-guide/configuration.md).
