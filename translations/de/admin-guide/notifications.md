# Benachrichtigungen

Semaphore meldet Task-Ergebnisse an Chat und E-Mail. Ein Kanal wird einmal auf dem
Server konfiguriert, in `config.json` oder über Umgebungsvariablen, und gilt dann
für jedes Projekt. Welche Tasks einen Alert erzeugen, wird pro Projekt und pro
Task Template in der Weboberfläche entschieden.

<a id="how-delivery-works"></a>

## Wie die Zustellung funktioniert

Drei Einstellungen entscheiden darüber, ob eine Nachricht gesendet wird, und alle
drei müssen es erlauben:

1. **Der Kanal ist auf dem Server konfiguriert.** Jeder Anbieter hat eigene
   Schlüssel in `config.json`. Siehe die Seite des jeweiligen Anbieters weiter unten.
2. **Das Projekt erlaubt Alerts.** *Allow alerts for this project* in den
   [Projekteinstellungen](../../../docs/user-guide/projects/settings.md) ist der Hauptschalter. Ist
   er aus, sendet kein Kanal etwas zu diesem Projekt.
3. **Das Task Template fordert sie an.** Ein Task Template legt fest, ob bei Erfolg,
   bei Fehler oder gar nicht benachrichtigt wird, siehe [Task Templates](../../../docs/user-guide/task-templates/README.md).

Mit **Test alerts** in den Projekteinstellungen senden Sie eine Testnachricht über
jeden konfigurierten Kanal, ohne einen Task auszuführen.

<a id="channels"></a>

## Kanäle

| Kanal | Seite |
|---|---|
| E-Mail (SMTP) | [E-Mail](../../../docs/admin-guide/notifications/email.md) |
| Telegram | [Telegram](../../../docs/admin-guide/notifications/telegram.md) |
| Slack | [Slack](../../../docs/admin-guide/notifications/slack.md) |
| Microsoft Teams | [Teams](../../../docs/admin-guide/notifications/teams.md) |
| Rocket.Chat | [Rocket.Chat](../../../docs/admin-guide/notifications/rocket.md) |
| DingTalk | [DingTalk](../../../docs/admin-guide/notifications/ding.md) |
| Gotify | [Gotify](../../../docs/admin-guide/notifications/gotify.md) |

Mehrere Kanäle können gleichzeitig aktiv sein; jeder von ihnen erhält jeden Alert,
der die drei obigen Prüfungen besteht.

<a id="per-project-overrides"></a>

## Projektspezifische Abweichungen

Telegram unterstützt einen projektspezifischen Chat: Setzen Sie
**Telegram Chat ID** in den [Projekteinstellungen](../../../docs/user-guide/projects/settings.md),
um die Alerts eines Projekts an einen anderen Chat zu leiten als den serverweiten.
Die übrigen Kanäle verwenden für alle Projekte die Serverkonfiguration.

<a id="where-to-start"></a>

## Womit Sie beginnen

Konfigurieren Sie zuerst einen Kanal, schalten Sie *Allow alerts for this project*
ein und drücken Sie **Test alerts**. Sobald eine Testnachricht ankommt, aktivieren
Sie Alerts für die Task Templates, auf die es ankommt.
