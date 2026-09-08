# Notifiche

Semaphore può inviare notifiche sull'attività delle attività e dei progetti ai canali più diffusi. Configurare un notificatore globale in `config.json` e (dove supportato) sovrascrivere alcune opzioni per progetto.

Provider supportati:

* [Email](/admin-guide/notifications/email)
* [Slack](/admin-guide/notifications/slack)
* [Telegram](/admin-guide/notifications/telegram)
* [Microsoft Teams](/admin-guide/notifications/teams)
* [RocketChat](/admin-guide/notifications/rocket)
* [DingTalk](/admin-guide/notifications/ding)
* [Gotify](/admin-guide/notifications/gotify)

## Come funziona {#how-it-works}

- **Configurazione globale**: abilitare un provider e impostare le relative opzioni di connessione in `config.json` sul server Semaphore. Consultare la pagina di ciascun provider per le chiavi esatte.
- **Eventi**: le notifiche vengono inviate in corrispondenza degli eventi principali del ciclo di vita delle attività (ad es. avvio, successo, fallimento) e pubblicate sul canale/webhook configurato.
- **Override per progetto**: alcuni provider consentono override per progetto. Ad esempio, Telegram supporta un ID chat specifico per progetto.


