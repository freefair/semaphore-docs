# Terragrunt

[Terragrunt](https://terragrunt.gruntwork.io/) est un wrapper pour Terraform et OpenTofu qui garde les configurations DRY et gère les dépendances entre modules. Semaphore l'exécute de la même façon que [Terraform/OpenTofu](../../../../docs/user-guide/apps/terraform/README.md), avec quelques différences décrites ici.

<a id="prerequisites"></a>

## Prérequis

1. Installez le binaire `terragrunt` ainsi qu'un binaire `terraform` ou `tofu` sur le serveur Semaphore ou sur le [runner](../../../../docs/admin-guide/runners.md) qui exécute les tâches.
2. Activez l'application **Terragrunt Code** : elle est désactivée par défaut. Ouvrez **Applications** depuis le menu du compte et activez l'interrupteur, voir [Applications](../../../../docs/user-guide/apps/README.md).

<a id="creating-a-terragrunt-template"></a>

## Créer un modèle Terragrunt

1. Rendez-vous dans **Modèles de tâches** et cliquez sur **Nouveau modèle**.
2. Sélectionnez **Terragrunt Code** comme application.
3. Renseignez le **Dépôt** et le sous-répertoire contenant votre fichier `terragrunt.hcl`.
4. Sélectionnez ou créez un **Espace de travail** dans le champ Inventaire. Les modèles Terragrunt utilisent des inventaires de type `terragrunt-workspace`, voir [Espaces de travail](terraform/workspaces.md).
5. Cliquez sur **Créer**, puis sur **Exécuter**.

![Modèle Terragrunt](../../../../static/assets/templates-list.webp)

<a id="running-tasks"></a>

## Exécuter des tâches

La boîte de dialogue Nouvelle tâche propose les mêmes options que pour Terraform : **Plan**, **Destroy**, **Auto Approve**, **Upgrade** et **Reconfigure**.

Semaphore appelle `terragrunt run -- <terraform arguments>` et transmet le binaire Terraform ou OpenTofu avec `--tf-path`, sauf si vous avez déjà défini `--tf-path` dans les arguments CLI du modèle. La sélection de l'espace de travail est effectuée avec `terragrunt run -- workspace select -or-create=true <name>`.

Les variables des **Groupes de variables** sélectionnés sont transmises en tant que variables d'environnement : utilisez donc le préfixe `TF_VAR_` pour les variables d'entrée. Les variables supplémentaires et les variables de questionnaire sont transmises comme arguments `-var name=value`.

<a id="notes"></a>

## Remarques

- `terragrunt` exécute automatiquement `init` avant chaque commande.
- Le backend d'état HTTP et la liste des états de l'onglet **Espaces de travail** fonctionnent comme pour Terraform, voir [Backend HTTP](../../../../docs/user-guide/apps/terraform/states.md).
- Pour utiliser `run-all` sur plusieurs modules, ajoutez les arguments dans les **CLI args** du modèle.
