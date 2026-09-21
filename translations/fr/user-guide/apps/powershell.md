# PowerShell

Semaphore peut exécuter des scripts PowerShell sur des hôtes Windows (ou depuis un runner Windows). Pour cela, créez un modèle de tâche **PowerShell**.

<a id="creating-a-powershell-template"></a>

## Créer un modèle PowerShell

1. Allez dans la section **Modèles de tâches** et cliquez sur le bouton **Nouveau modèle**.
2. Sélectionnez **PowerShell** comme type d'application.
3. Configurez le modèle :

| Champ | Description |
|---|---|
| **Nom** | Un nom descriptif pour le modèle |
| **Dépôt** | Dépôt contenant votre script `.ps1` |
| **Playbook / Script** | Chemin relatif vers le script, par exemple `scripts/deploy.ps1` |
| **Groupes de variables** | Groupes de variables dont les valeurs sont injectées comme variables d'environnement |

4. Cliquez sur **Créer**.
5. Cliquez sur **Exécuter** pour lancer le modèle.

<a id="passing-variables-to-scripts"></a>

## Transmettre des variables aux scripts

Les variables des **Groupes de variables** sélectionnés sont injectées comme variables d'environnement avant l'exécution du script. Accédez-y dans PowerShell avec `$env:VARIABLE_NAME` :

```powershell
Write-Host "Deploying to $env:TARGET_HOST"
```

<a id="running-on-windows-hosts"></a>

## Exécution sur des hôtes Windows

Les modèles PowerShell nécessitent l'un des éléments suivants :
- Un **runner Windows** — un runner Semaphore déployé sur un hôte Windows. Voir [Runners](../../../../docs/admin-guide/runners.md).
- Le serveur Semaphore lui-même fonctionnant sous Windows.

<a id="notes"></a>

## Remarques

- Les scripts s'exécutent de manière non interactive. Évitez les invites qui nécessitent une saisie de l'utilisateur.
- Le code de sortie `0` signifie succès ; tout code de sortie non nul marque la tâche comme échouée.
