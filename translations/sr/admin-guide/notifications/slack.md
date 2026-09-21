# Slack

Slack obaveštenja vam omogućavaju da primate ažuriranja o svojim Semaphore tokovima rada u realnom vremenu direktno u svojim Slack kanalima. Ova integracija (Integration) pomaže timovima da budu u toku sa statusima build-ova, rezultatima deploy-a i drugim važnim događajima bez potrebe da stalno proveravaju Semaphore kontrolnu tablu.

Da biste podesili Slack obaveštenja, potrebno je da kreirate webhook URL koji povezuje Semaphore sa željenim Slack kanalom. Ovaj webhook služi kao bezbedan komunikacioni most između dve platforme.

<a id="creating-slack-webhook"></a>

## Kreiranje Slack webhook-a

<a id="step-1-open-slack-api-settings"></a>

### Korak 1. Otvorite podešavanja Slack API-ja

1. Idite na [https://api.slack.com/apps](https://api.slack.com/apps).
2. Kliknite **Create New App** → izaberite **From Scratch**.
3. Dajte aplikaciji naziv (npr. `Semaphore Bot`) i izaberite svoj **Slack workspace**.

---

<a id="step-2-enable-incoming-webhooks"></a>

### Korak 2. Uključite dolazne webhook-ove

1. U podešavanjima aplikacije idite na **Features → Incoming Webhooks**.
2. Prebacite **Activate Incoming Webhooks** → **On**.

---

<a id="step-3-create-a-webhook-url"></a>

### Korak 3. Kreirajte webhook URL

1. Kliknite **Add New Webhook to Workspace**.
2. Izaberite kanal u koji treba slati poruke.
3. Kliknite **Allow**.
4. Videćete **Webhook URL** poput:

   ```
   https://hooks.slack.com/services/xxxxxxxxxxx/xxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

<a id="step-4-test-your-webhook"></a>

### Korak 4. Testirajte webhook

Za testiranje koristite `curl`:

```bash
curl -X POST -H 'Content-type: application/json' \
--data '{"text":"Hello from Semaphore UI 🚀"}' \
https://hooks.slack.com/services/xxxxxxxxxxx/xxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx
```

Ako je sve ispravno podešeno, videćete poruku u izabranom Slack kanalu.

<a id="semaphore-configuration"></a>

## Podešavanje Semaphore-a

Kada imate Slack webhook URL, Semaphore možete podesiti da šalje obaveštenja na nekoliko načina:

Slack obaveštenja možete uključiti pomoću konfiguracionih fajlova ili promenljivih okruženja.

<a id="method-1-configuration-file"></a>

### Metod 1: Konfiguracioni fajl

Dodajte sledeća podešavanja u svoj Semaphore konfiguracioni fajl:

- `slack_alert`: Postavite na `true` da biste uključili Slack obaveštenja
- `slack_url`: Vaš webhook URL iz prethodnog koraka

Primer `config.json`:

```json
{
    "slack_alert": true,
    "slack_url": "https://hooks.slack.com/services/xxxxxxxxxxx/xxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx",
}
```

<a id="method-2-environment-variables"></a>

### Metod 2: Promenljive okruženja

Alternativno, Slack obaveštenja možete podesiti pomoću promenljivih okruženja. Ovaj metod je posebno koristan za kontejnerizovane instalacije ili kada želite da osetljive podatke držite odvojeno od konfiguracionih fajlova.

```
SEMAPHORE_SLACK_ALERT=True
SEMAPHORE_SLACK_URL=https://hooks.slack.com/services/xxxxxxxxxxx/xxxxxxxxxxx/xxxxxxxxxxxxxxxxxxxxxxxx
```
