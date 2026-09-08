
# Scripts Shell/Bash

Semaphore peut exécuter des scripts shell avec `/bin/bash`. Pour cela, créez un modèle de tâche **Script Bash**.

## Créer un modèle Bash {#creating-a-bash-template}

1. Allez dans la section **Modèles de tâches** et cliquez sur le bouton **Nouveau modèle**.
2. Sélectionnez **Bash** comme type d'application.
3. Configurez le modèle :

| Champ | Description |
|---|---|
| **Nom** | Un nom descriptif pour le modèle |
| **Dépôt** | Dépôt contenant votre script shell |
| **Playbook / Script** | Chemin relatif vers le script, par exemple `scripts/deploy.sh` |
| **Groupes de variables** | Groupes de variables dont les valeurs sont injectées comme variables d'environnement |

4. Cliquez sur **Créer**.
5. Cliquez sur **Exécuter** pour lancer le modèle.

## Transmettre des variables aux scripts {#passing-variables-to-scripts}

Les variables des **Groupes de variables** sélectionnés sont injectées comme variables d'environnement. Accédez-y dans le script avec `$VARIABLE_NAME` :

```bash
#!/bin/bash
echo "Deploying to $TARGET_HOST"
```

## Remarques {#notes}

- Rendez votre script exécutable (`chmod +x`) ou assurez-vous qu'il commence par un shebang valide (`#!/bin/bash`).
- Les scripts s'exécutent de manière non interactive. Évitez les invites qui attendent une saisie de l'utilisateur.
- Le code de sortie `0` signifie succès ; tout code de sortie non nul marque la tâche comme échouée.
- Si un script très court ne produit aucune sortie dans le journal, consultez [La sortie d'un script Bash est absente ou incomplète](/admin-guide/troubleshooting#bash-script-output-is-missing-or-incomplete) dans le guide de dépannage.
- Pour exécuter des commandes sur des hôtes distants, utilisez plutôt [Ansible](./ansible).
