# Notifiche

Semaphore comunica i risultati dei Task via chat ed email. Un canale si configura una
sola volta sul server, in `config.json` oppure tramite variabili d'ambiente, e vale
poi per tutti i Project. Quali Task producano un avviso viene deciso per singolo
Project e per singolo Task Template nell'interfaccia web.

<a id="how-delivery-works"></a>

## Come funziona il recapito

Tre impostazioni determinano se un messaggio viene inviato, e tutte e tre devono
consentirlo:

1. **Il canale è configurato sul server.** Ogni provider ha le proprie chiavi in
   `config.json`. Vedere più sotto la pagina del provider corrispondente.
2. **Il Project consente gli avvisi.** *Allow alerts for this project* nelle
   [impostazioni del Project](../../../docs/user-guide/projects/settings.md) è l'interruttore
   principale. Se è disattivato, nessun canale invia alcunché riguardo a quel
   Project.
3. **Il Task Template lo richiede.** Un Task Template sceglie se inviare un avviso in
   caso di successo, in caso di errore oppure mai, vedere
   [Task Template](../../../docs/user-guide/task-templates/README.md).

Utilizzare **Test alerts** nelle impostazioni del Project per inviare un messaggio di
prova attraverso ogni canale configurato senza eseguire un Task.

<a id="channels"></a>

## Canali

| Canale | Pagina |
|---|---|
| Email (SMTP) | [Email](../../../docs/admin-guide/notifications/email.md) |
| Telegram | [Telegram](../../../docs/admin-guide/notifications/telegram.md) |
| Slack | [Slack](../../../docs/admin-guide/notifications/slack.md) |
| Microsoft Teams | [Teams](../../../docs/admin-guide/notifications/teams.md) |
| Rocket.Chat | [Rocket.Chat](../../../docs/admin-guide/notifications/rocket.md) |
| DingTalk | [DingTalk](../../../docs/admin-guide/notifications/ding.md) |
| Gotify | [Gotify](../../../docs/admin-guide/notifications/gotify.md) |

È possibile abilitare più canali contemporaneamente; ciascuno riceve tutti gli avvisi
che superano i tre controlli descritti sopra.

<a id="per-project-overrides"></a>

## Override per Project

Telegram supporta una chat per singolo Project: impostare **Telegram Chat ID** nelle
[impostazioni del Project](../../../docs/user-guide/projects/settings.md) per instradare gli avvisi
di un Project verso una chat diversa da quella valida per l'intero server. Gli altri
canali usano la configurazione del server per tutti i Project.

<a id="where-to-start"></a>

## Da dove iniziare

Configurare prima un solo canale, attivare *Allow alerts for this project* e premere
**Test alerts**. Una volta arrivato il messaggio di prova, abilitare gli avvisi sui
Task Template che interessano.
