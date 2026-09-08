# Notifications

Semaphore peut envoyer des notifications sur l'activité des tâches et des projets vers les canaux les plus courants. Configurez un notificateur global dans `config.json` et (lorsque cela est pris en charge) remplacez certaines options par projet.

Fournisseurs pris en charge :

* [E-mail](/admin-guide/notifications/email)
* [Slack](/admin-guide/notifications/slack)
* [Telegram](/admin-guide/notifications/telegram)
* [Microsoft Teams](/admin-guide/notifications/teams)
* [RocketChat](/admin-guide/notifications/rocket)
* [DingTalk](/admin-guide/notifications/ding)
* [Gotify](/admin-guide/notifications/gotify)

## Fonctionnement {#how-it-works}

- **Configuration globale** : activez un fournisseur et définissez ses options de connexion dans `config.json` sur le serveur Semaphore. Consultez la page de chaque fournisseur pour connaître les clés exactes.
- **Événements** : les notifications sont envoyées lors des événements clés du cycle de vie des tâches (par ex. démarrage, succès, échec) et sont publiées sur le canal/webhook configuré.
- **Remplacements par projet** : certains fournisseurs autorisent des remplacements par projet. Par exemple, Telegram prend en charge un ID de chat propre à chaque projet.



