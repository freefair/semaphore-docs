# Slack

Le notifiche Slack permettono di ricevere aggiornamenti in tempo reale sui workflow di Semaphore direttamente nei canali Slack. Questa integrazione aiuta i team a rimanere informati sullo stato delle build, sui risultati dei deployment e su altri eventi importanti senza dover controllare continuamente la dashboard di Semaphore.

Per configurare le notifiche Slack, è necessario creare un URL webhook che colleghi Semaphore al canale Slack desiderato. Questo webhook funge da ponte di comunicazione sicuro tra le due piattaforme.

<a id="creating-slack-webhook"></a>

## Creazione del webhook Slack

<a id="step-1-open-slack-api-settings"></a>

### Passo 1. Aprire le impostazioni API di Slack

1. Andare su [https://api.slack.com/apps](https://api.slack.com/apps).
2. Fare clic su **Create New App** → scegliere **From Scratch**.
3. Assegnare un nome all'app (ad es. `Semaphore Bot`) e selezionare il proprio **workspace Slack**.

---

<a id="step-2-enable-incoming-webhooks"></a>

### Passo 2. Abilitare gli Incoming Webhooks

1. Nelle impostazioni dell'app, andare su **Features → Incoming Webhooks**.
2. Impostare **Activate Incoming Webhooks** su **On**.

---

<a id="step-3-create-a-webhook-url"></a>

### Passo 3. Creare un URL webhook

1. Fare clic su **Add New Webhook to Workspace**.
2. Selezionare il canale a cui devono essere inviati i messaggi.
3. Fare clic su **Allow**.
4. Verrà mostrato un **Webhook URL** simile a:

   ```
   https://hooks.slack.com/services/xxxxxxxxxxx/xxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

<a id="step-4-test-your-webhook"></a>

### Passo 4. Testare il webhook

Utilizzare `curl` per il test:

```bash
curl -X POST -H 'Content-type: application/json' \
--data '{"text":"Hello from Semaphore UI 🚀"}' \
https://hooks.slack.com/services/xxxxxxxxxxx/xxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx
```

Se tutto è configurato correttamente, il messaggio comparirà nel canale Slack selezionato.

<a id="semaphore-configuration"></a>

## Configurazione di Semaphore

Una volta ottenuto l'URL webhook di Slack, è possibile configurare Semaphore per l'invio delle notifiche in diversi modi:

Le notifiche Slack possono essere abilitate tramite file di configurazione o variabili d'ambiente.

<a id="method-1-configuration-file"></a>

### Metodo 1: file di configurazione

Aggiungere le seguenti impostazioni al file di configurazione di Semaphore:

- `slack_alert`: impostare a `true` per abilitare le notifiche Slack
- `slack_url`: l'URL webhook ottenuto nel passo precedente

Esempio di `config.json`:

```json
{
    "slack_alert": true,
    "slack_url": "https://hooks.slack.com/services/xxxxxxxxxxx/xxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx",
}
```

<a id="method-2-environment-variables"></a>

### Metodo 2: variabili d'ambiente

In alternativa, è possibile utilizzare le variabili d'ambiente per configurare le notifiche Slack. Questo metodo è particolarmente utile per i deployment containerizzati o quando si desidera mantenere le informazioni sensibili separate dai file di configurazione.

```
SEMAPHORE_SLACK_ALERT=True
SEMAPHORE_SLACK_URL=https://hooks.slack.com/services/xxxxxxxxxxx/xxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx
```
