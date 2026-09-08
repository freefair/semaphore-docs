
# Workspaces

Semaphore offre une prise en charge intégrée des workspaces Terraform, ce qui vous permet de gérer plusieurs environnements et configurations au sein d'un même projet. Cette fonctionnalité vous aide à conserver des fichiers d'état distincts pour différents environnements tels que le développement, la préproduction et la production.

## Fonctionnalités {#features}

- **Gestion des workspaces** : créez, changez et supprimez des workspaces directement depuis l'interface de Semaphore.
- **Isolation de l'état** : chaque workspace conserve son propre fichier d'état, ce qui évite les conflits entre environnements.
- **Variables d'environnement** : configurez des variables d'environnement propres à chaque workspace.
- **Sélection du workspace** : choisissez le workspace cible lors de l'exécution des commandes Terraform.

## Utilisation des workspaces dans Semaphore {#using-workspaces-in-semaphore}

### Création d'un workspace {#creating-a-workspace}

Dans la section **Workspaces** du modèle Terraform/OpenTofu auquel vous souhaitez ajouter un workspace, suivez ces étapes :

1. Cliquez sur le bouton ➕.  
2. Dans le menu qui s'affiche, sélectionnez **Nouveau workspace**.  
3. Dans la boîte de dialogue, saisissez le nom du workspace et sélectionnez la clé SSH à utiliser pour cloner les modules.  
4. Cliquez sur le bouton **Créer** pour ajouter le nouveau workspace au modèle.  
5. Vous pouvez maintenant utiliser ce workspace pour exécuter des tâches.


### Changement de workspace {#switching-workspaces}

Vous pouvez définir le workspace par défaut d'un modèle Terraform/OpenTofu en cliquant sur le bouton **DÉFINIR PAR DÉFAUT**.


### Variables propres à un workspace {#workspace-specific-variables}

Semaphore ne prend pas encore en charge les variables propres à un workspace.
