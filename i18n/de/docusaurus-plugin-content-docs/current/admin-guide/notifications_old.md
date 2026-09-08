# Benachrichtigungen

Semaphore kann Benachrichtigungen über Task- und Projektaktivitäten an gängige Kanäle senden. Konfigurieren Sie einen globalen Notifier in `config.json` und überschreiben Sie (sofern unterstützt) bestimmte Optionen pro Projekt.

Unterstützte Anbieter:

* [E-Mail](/admin-guide/notifications/email)
* [Slack](/admin-guide/notifications/slack)
* [Telegram](/admin-guide/notifications/telegram)
* [Microsoft Teams](/admin-guide/notifications/teams)
* [RocketChat](/admin-guide/notifications/rocket)
* [DingTalk](/admin-guide/notifications/ding)
* [Gotify](/admin-guide/notifications/gotify)

## Funktionsweise {#how-it-works}

- **Globale Konfiguration**: Aktivieren Sie einen Anbieter und legen Sie seine Verbindungsoptionen in der `config.json` auf dem Semaphore-Server fest. Die genauen Schlüssel finden Sie auf der jeweiligen Anbieterseite.
- **Ereignisse**: Benachrichtigungen werden bei wichtigen Ereignissen im Task-Lebenszyklus (z. B. Start, Erfolg, Fehler) gesendet und an den konfigurierten Kanal/Webhook übermittelt.
- **Überschreibungen pro Projekt**: Einige Anbieter erlauben projektspezifische Überschreibungen. Telegram unterstützt beispielsweise eine projektspezifische Chat-ID.
