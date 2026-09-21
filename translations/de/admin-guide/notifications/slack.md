# Slack

Slack-Benachrichtigungen ermöglichen es Ihnen, Echtzeit-Updates zu Ihren Semaphore-Workflows direkt in Ihren Slack-Kanälen zu erhalten. Diese Integration hilft Teams, über Build-Status, Deployment-Ergebnisse und andere wichtige Ereignisse informiert zu bleiben, ohne ständig das Semaphore-Dashboard prüfen zu müssen.

Um Slack-Benachrichtigungen einzurichten, müssen Sie eine Webhook-URL erstellen, die Semaphore mit dem gewünschten Slack-Kanal verbindet. Dieser Webhook dient als sichere Kommunikationsbrücke zwischen den beiden Plattformen.

<a id="creating-slack-webhook"></a>

## Slack-Webhook erstellen

<a id="step-1-open-slack-api-settings"></a>

### Schritt 1. Slack-API-Einstellungen öffnen

1. Gehen Sie zu [https://api.slack.com/apps](https://api.slack.com/apps).
2. Klicken Sie auf **Create New App** → wählen Sie **From Scratch**.
3. Geben Sie Ihrer App einen Namen (z. B. `Semaphore Bot`) und wählen Sie Ihren **Slack-Workspace** aus.

---

<a id="step-2-enable-incoming-webhooks"></a>

### Schritt 2. Incoming Webhooks aktivieren

1. Gehen Sie in den App-Einstellungen zu **Features → Incoming Webhooks**.
2. Schalten Sie **Activate Incoming Webhooks** auf **On**.

---

<a id="step-3-create-a-webhook-url"></a>

### Schritt 3. Webhook-URL erstellen

1. Klicken Sie auf **Add New Webhook to Workspace**.
2. Wählen Sie den Kanal aus, an den Nachrichten gesendet werden sollen.
3. Klicken Sie auf **Allow**.
4. Sie sehen eine **Webhook URL** wie:

   ```
   https://hooks.slack.com/services/xxxxxxxxxxx/xxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

<a id="step-4-test-your-webhook"></a>

### Schritt 4. Webhook testen

Testen Sie mit `curl`:

```bash
curl -X POST -H 'Content-type: application/json' \
--data '{"text":"Hello from Semaphore UI 🚀"}' \
https://hooks.slack.com/services/xxxxxxxxxxx/xxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx
```

Wenn alles richtig eingerichtet ist, sehen Sie die Nachricht im ausgewählten Slack-Kanal.

<a id="semaphore-configuration"></a>

## Semaphore-Konfiguration

Sobald Sie Ihre Slack-Webhook-URL haben, können Sie Semaphore auf mehrere Arten für das Senden von Benachrichtigungen konfigurieren:

Sie können Slack-Benachrichtigungen entweder über Konfigurationsdateien oder über Umgebungsvariablen aktivieren.

<a id="method-1-configuration-file"></a>

### Methode 1: Konfigurationsdatei

Fügen Sie die folgenden Einstellungen zu Ihrer Semaphore-Konfigurationsdatei hinzu:

- `slack_alert`: Auf `true` setzen, um Slack-Benachrichtigungen zu aktivieren
- `slack_url`: Ihre Webhook-URL aus dem vorherigen Schritt

Beispiel für `config.json`:

```json
{
    "slack_alert": true,
    "slack_url": "https://hooks.slack.com/services/xxxxxxxxxxx/xxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx",
}
```

<a id="method-2-environment-variables"></a>

### Methode 2: Umgebungsvariablen

Alternativ können Sie Umgebungsvariablen verwenden, um Slack-Benachrichtigungen zu konfigurieren. Diese Methode ist besonders nützlich für containerisierte Deployments oder wenn Sie sensible Informationen getrennt von Konfigurationsdateien halten möchten.

```
SEMAPHORE_SLACK_ALERT=True
SEMAPHORE_SLACK_URL=https://hooks.slack.com/services/xxxxxxxxxxx/xxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx
```
