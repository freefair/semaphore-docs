# Slack

Les notifications Slack vous permettent de recevoir des mises à jour en temps réel sur vos workflows Semaphore directement dans vos canaux Slack. Cette intégration aide les équipes à rester informées des statuts de build, des résultats de déploiement et d'autres événements importants sans avoir à consulter constamment le tableau de bord Semaphore.

Pour configurer les notifications Slack, vous devez créer une URL de webhook qui relie Semaphore au canal Slack de votre choix. Ce webhook sert de passerelle de communication sécurisée entre les deux plateformes.

<a id="creating-slack-webhook"></a>

## Créer un webhook Slack

<a id="step-1-open-slack-api-settings"></a>

### Étape 1. Ouvrir les paramètres de l'API Slack

1. Rendez-vous sur [https://api.slack.com/apps](https://api.slack.com/apps).
2. Cliquez sur **Créer une application** → choisissez **À partir de zéro**.
3. Donnez un nom à votre application (par ex. `Semaphore Bot`) et sélectionnez votre **espace de travail Slack**.

---

<a id="step-2-enable-incoming-webhooks"></a>

### Étape 2. Activer les webhooks entrants

1. Dans les paramètres de l'application, allez dans **Fonctionnalités → Webhooks entrants**.
2. Basculez **Activer les webhooks entrants** → **Activé**.

---

<a id="step-3-create-a-webhook-url"></a>

### Étape 3. Créer une URL de webhook

1. Cliquez sur **Ajouter un nouveau webhook à l'espace de travail**.
2. Sélectionnez le canal dans lequel les messages doivent être envoyés.
3. Cliquez sur **Autoriser**.
4. Vous verrez une **URL de webhook** de la forme :

   ```
   https://hooks.slack.com/services/xxxxxxxxxxx/xxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

<a id="step-4-test-your-webhook"></a>

### Étape 4. Tester votre webhook

Utilisez `curl` pour tester :

```bash
curl -X POST -H 'Content-type: application/json' \
--data '{"text":"Hello from Semaphore UI 🚀"}' \
https://hooks.slack.com/services/xxxxxxxxxxx/xxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx
```

Si tout est correctement configuré, vous verrez le message dans le canal Slack sélectionné.

<a id="semaphore-configuration"></a>

## Configuration de Semaphore

Une fois que vous disposez de votre URL de webhook Slack, vous pouvez configurer Semaphore pour envoyer des notifications de plusieurs façons :

Vous pouvez activer les notifications Slack à l'aide de fichiers de configuration ou de variables d'environnement.

<a id="method-1-configuration-file"></a>

### Méthode 1 : fichier de configuration

Ajoutez les paramètres suivants à votre fichier de configuration Semaphore :

- `slack_alert` : définissez-le à `true` pour activer les notifications Slack
- `slack_url` : votre URL de webhook obtenue à l'étape précédente

Exemple de `config.json` :

```json
{
    "slack_alert": true,
    "slack_url": "https://hooks.slack.com/services/xxxxxxxxxxx/xxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx",
}
```

<a id="method-2-environment-variables"></a>

### Méthode 2 : variables d'environnement

Vous pouvez également utiliser des variables d'environnement pour configurer les notifications Slack. Cette méthode est particulièrement utile pour les déploiements conteneurisés ou lorsque vous souhaitez séparer les informations sensibles des fichiers de configuration.

```
SEMAPHORE_SLACK_ALERT=True
SEMAPHORE_SLACK_URL=https://hooks.slack.com/services/xxxxxxxxxxx/xxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx
```
