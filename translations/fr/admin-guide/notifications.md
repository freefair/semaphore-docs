# Notifications

Semaphore signale les résultats des tâches dans les messageries et par e-mail. Un
canal est configuré une fois sur le serveur, dans `config.json` ou via des variables
d'environnement, puis s'applique à tous les projets. Les tâches qui produisent une
alerte sont décidées par projet et par modèle dans l'interface web.

<a id="how-delivery-works"></a>

## Comment fonctionne la distribution

Trois paramètres décident de l'envoi d'un message, et tous les trois doivent
l'autoriser :

1. **Le canal est configuré sur le serveur.** Chaque fournisseur a ses propres clés
   dans `config.json`. Voir la page de ce fournisseur ci-dessous.
2. **Le projet autorise les alertes.** *Allow alerts for this project* dans les
   [paramètres du projet](../../../docs/user-guide/projects/settings.md) est l'interrupteur
   principal. S'il est désactivé, aucun canal n'envoie quoi que ce soit à propos de
   ce projet.
3. **Le modèle le demande.** Un modèle de tâche choisit d'alerter en cas de succès,
   en cas d'erreur ou pas du tout, voir
   [Modèles de tâches](../../../docs/user-guide/task-templates/README.md).

Utilisez **Test alerts** dans les paramètres du projet pour envoyer un message de
test via chaque canal configuré sans exécuter de tâche.

<a id="channels"></a>

## Canaux

| Canal | Page |
|---|---|
| E-mail (SMTP) | [E-mail](../../../docs/admin-guide/notifications/email.md) |
| Telegram | [Telegram](../../../docs/admin-guide/notifications/telegram.md) |
| Slack | [Slack](../../../docs/admin-guide/notifications/slack.md) |
| Microsoft Teams | [Teams](../../../docs/admin-guide/notifications/teams.md) |
| Rocket.Chat | [Rocket.Chat](../../../docs/admin-guide/notifications/rocket.md) |
| DingTalk | [DingTalk](../../../docs/admin-guide/notifications/ding.md) |
| Gotify | [Gotify](../../../docs/admin-guide/notifications/gotify.md) |

Plusieurs canaux peuvent être activés en même temps ; chacun reçoit toutes les
alertes qui passent les trois vérifications ci-dessus.

<a id="per-project-overrides"></a>

## Remplacements par projet

Telegram prend en charge un chat par projet : définissez **Telegram Chat ID** dans
les [paramètres du projet](../../../docs/user-guide/projects/settings.md) pour router les alertes
d'un projet vers un chat différent de celui défini pour l'ensemble du serveur. Les
autres canaux utilisent la configuration du serveur pour tous les projets.

<a id="where-to-start"></a>

## Par où commencer

Configurez d'abord un canal, activez *Allow alerts for this project*, puis appuyez
sur **Test alerts**. Une fois qu'un message de test est arrivé, activez les alertes
sur les modèles qui comptent.
