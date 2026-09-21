# Telegram

<a id="pre-requisites"></a>

### Prerequisiti

Per configurare Semaphore UI in modo che invii avvisi tramite Telegram, sono necessari alcuni passaggi preliminari sul lato Telegram.  È necessario creare un proprio bot che riceverà il webhook e conoscere l'ID della chat a cui inviare il messaggio.

<a id="bot-setup"></a>

#### Configurazione del bot

Il modo più semplice per creare un proprio bot è utilizzare @BotFather.

1. Nel client Telegram, inviare a @BotFather il messaggio `/start`.
1. Seguire le istruzioni per creare un nuovo bot e prendere nota del token di autorizzazione fornito nell'ultimo passaggio.  Nota: questo token è segreto e va trattato come tale.
1. Inviare al nuovo bot il messaggio `/start` per avviarlo, in modo che possa ricevere messaggi.

<a id="chat-id"></a>

#### ID della chat

1. Nel client Telegram, inviare un messaggio qualsiasi a @RawDataBot.
1.  Copiare il valore della chiave `id` nella mappa `chat`.

<a id="testing"></a>

#### Test

È possibile utilizzare cURL per verificare le impostazioni precedenti come segue:

```
curl -X POST https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage \
  -d chat_id=YOUR_CHAT_ID \
  -d text="Test message from curl"
```

<a id="configuration"></a>

### Configurazione

Utilizzando l'ID della chat e il token ottenuti nei passaggi precedenti, è ora possibile configurare Semaphore UI per l'invio degli avvisi Telegram come segue:

```
telegram_alert: True
telegram_chat: <chat id>
telegram_token: <token>
```

Esempio di `config.json`:

```json
{
    "telegram_alert": true,
    "telegram_token": "64********:AAG****_rM6obyR********************",
    "telegram_chat":  "",
}
```

<a id="per-project-chat-ids"></a>

### ID chat per progetto

Ogni progetto può utilizzare un ID chat univoco.  Questo permette di separare le notifiche per progetto invece di inviarle tutte alla stessa chat. Questa impostazione sovrascrive l'ID chat globale indicato sopra.
