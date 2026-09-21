# Espaces de travail

![Onglet Espaces de travail d'un modèle](../../../../../static/assets/template-workspaces.webp)

Semaphore prend en charge nativement les espaces de travail Terraform, ce qui vous permet de gérer plusieurs environnements et configurations au sein d'un même projet. Cette fonctionnalité vous aide à conserver des fichiers d'état distincts pour différents environnements, comme le développement, la préproduction et la production.

<a id="features"></a>

## Fonctionnalités

- **Gestion des espaces de travail** : créez, changez et supprimez des espaces de travail directement depuis l'interface de Semaphore.
- **Isolation de l'état** : chaque espace de travail conserve son propre fichier d'état, ce qui évite les conflits entre environnements.
- **Variables d'environnement** : configurez des variables d'environnement propres à chaque espace de travail.
- **Sélection de l'espace de travail** : choisissez l'espace de travail cible lors de l'exécution des commandes Terraform.

<a id="using-workspaces-in-semaphore"></a>

## Utiliser les espaces de travail dans Semaphore

<a id="creating-a-workspace"></a>

### Créer un espace de travail

Dans la section **Espaces de travail** du modèle Terraform/OpenTofu auquel vous souhaitez ajouter un espace de travail, procédez comme suit :

1. Cliquez sur le bouton ➕.
2. Dans le menu qui s'affiche, sélectionnez **Nouvel espace de travail**.
3. Dans la boîte de dialogue, saisissez le nom de l'espace de travail et sélectionnez la clé SSH à utiliser pour cloner les modules.
4. Cliquez sur le bouton **Créer** pour ajouter le nouvel espace de travail au modèle.
5. Vous pouvez désormais utiliser cet espace de travail pour exécuter des tâches.

<a id="switching-workspaces"></a>

### Changer d'espace de travail

Vous pouvez définir l'espace de travail par défaut d'un modèle Terraform/OpenTofu en cliquant sur le bouton **DÉFINIR PAR DÉFAUT**.

<a id="workspace-specific-variables"></a>

### Variables propres à un espace de travail

Semaphore ne prend pas encore en charge les variables propres à un espace de travail.
