# API

## Riferimento API {#api-reference}

Semaphore UI fornisce due formati di documentazione API, così da poter scegliere quello più adatto al proprio flusso di lavoro:

* [Swagger/OpenAPI](https://semaphoreui.com/api-docs) &mdash; ideale se si preferisce un'esperienza interattiva nel browser.
* [Collezione Postman ufficiale](https://www.postman.com/semaphoreui) &mdash; per esplorare e testare tutti gli endpoint in Postman.
* **Documentazione API Swagger integrata** &mdash; documentazione API interattiva basata su Swagger UI. È accessibile direttamente sulla propria istanza.

![](/assets/swagger-link.webp)

Tutte le opzioni includono la documentazione completa degli endpoint disponibili, dei parametri e di esempi di risposta.

## Primi passi con l'API {#getting-started-with-the-api}

Per iniziare a usare l'API di Semaphore è necessario generare un token API.
Questo token deve essere incluso nell'header della richiesta come:

```http
Authorization: Bearer YOUR_API_TOKEN
```

### Creazione di un token API {#creating-an-api-token}

Esistono due modi per creare un token API:
- Tramite l'interfaccia web
- Tramite una richiesta HTTP

#### Tramite l'interfaccia web (dalla 2.14) {#through-the-web-interface-since-214}

È possibile creare e gestire i propri token API dall'interfaccia web di Semaphore:

![Token API](https://www.semaphoreui.com/uploads/v2.14/tokens.webp)

#### Tramite una richiesta HTTP {#using-http-request}

È anche possibile autenticarsi e generare un token di sessione con una richiesta HTTP diretta.

Effettuare il login a Semaphore (la password deve essere sottoposta a escape, ad esempio `slashy\\pass` invece di `slashy\pass`):

```bash
curl -v -c /tmp/semaphore-cookie -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-d '{"auth": "YOUR_LOGIN", "password": "YOUR_PASSWORD"}' \
http://localhost:3000/api/auth/login
```

Generare un nuovo token e ottenerlo:

```bash
curl -v -b /tmp/semaphore-cookie -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
http://localhost:3000/api/user/tokens
```

Il comando dovrebbe restituire qualcosa di simile a:

```json
{
    "id": "YOUR_ACCESS_TOKEN",
    "created": "2025-05-21T02:35:12Z",
    "expired": false,
    "user_id": 3
}
```
---

## Uso del token per le richieste API {#using-token-to-make-api-requests}

Una volta ottenuto il token API, includerlo nell'header **Authorization** per autenticare le richieste.

### Avviare un task {#launch-a-task}

Usare questo token per avviare un task o per qualsiasi altra operazione:

```bash
curl -v -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
-d '{"template_id": 1}' \
http://localhost:3000/api/project/1/tasks
```

---

## Scadenza di un token API {#expiring-an-api-token}

Se il token non è più necessario, è consigliabile farlo scadere per mantenere sicuro il proprio account.

Per revocare manualmente (far scadere) un token API, inviare una richiesta DELETE all'endpoint del token:

```bash
curl -v -XDELETE \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
http://localhost:3000/api/user/tokens/YOUR_ACCESS_TOKEN
```
