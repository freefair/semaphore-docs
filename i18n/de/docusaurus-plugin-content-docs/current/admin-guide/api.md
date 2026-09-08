# API

## API-Referenz {#api-reference}

Semaphore UI stellt die API-Dokumentation in zwei Formaten bereit, sodass Sie das für Ihren Arbeitsablauf passende wählen können:

* [Swagger/OpenAPI](https://semaphoreui.com/api-docs) &mdash; ideal, wenn Sie eine interaktive, browserbasierte Oberfläche bevorzugen.
* [Offizielle Postman-Collection](https://www.postman.com/semaphoreui) &mdash; erkunden und testen Sie alle Endpunkte in Postman.
* **Integrierte Swagger-API-Dokumentation** &mdash; interaktive API-Dokumentation auf Basis von Swagger UI. Sie können sie direkt auf Ihrer Instanz aufrufen.

![](/assets/swagger-link.webp)

Alle Varianten enthalten eine vollständige Dokumentation der verfügbaren Endpunkte, Parameter und Beispielantworten.

## Erste Schritte mit der API {#getting-started-with-the-api}

Um die Semaphore-API zu verwenden, müssen Sie ein API-Token erstellen.
Dieses Token muss im Request-Header wie folgt übergeben werden:

```http
Authorization: Bearer YOUR_API_TOKEN
```

### Ein API-Token erstellen {#creating-an-api-token}

Es gibt zwei Möglichkeiten, ein API-Token zu erstellen:
- Über die Weboberfläche
- Per HTTP-Anfrage

#### Über die Weboberfläche (seit 2.14) {#through-the-web-interface-since-214}

Sie können Ihre API-Tokens über die Weboberfläche von Semaphore erstellen und verwalten:

![API-Tokens](https://www.semaphoreui.com/uploads/v2.14/tokens.webp)

#### Per HTTP-Anfrage {#using-http-request}

Sie können sich auch per direkter HTTP-Anfrage authentifizieren und ein Sitzungstoken erzeugen.

Melden Sie sich bei Semaphore an (das Passwort muss escaped werden, z. B. `slashy\\pass` statt `slashy\pass`):

```bash
curl -v -c /tmp/semaphore-cookie -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-d '{"auth": "YOUR_LOGIN", "password": "YOUR_PASSWORD"}' \
http://localhost:3000/api/auth/login
```

Erzeugen Sie ein neues Token und rufen Sie es ab:

```bash
curl -v -b /tmp/semaphore-cookie -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
http://localhost:3000/api/user/tokens
```

Der Befehl sollte eine Ausgabe ähnlich der folgenden liefern:

```json
{
    "id": "YOUR_ACCESS_TOKEN",
    "created": "2025-05-21T02:35:12Z",
    "expired": false,
    "user_id": 3
}
```
---

## Token für API-Anfragen verwenden {#using-token-to-make-api-requests}

Sobald Sie Ihr API-Token haben, übergeben Sie es im **Authorization**-Header, um Ihre Anfragen zu authentifizieren.

### Eine Aufgabe starten {#launch-a-task}

Verwenden Sie dieses Token, um eine Aufgabe zu starten oder andere Aktionen auszuführen:

```bash
curl -v -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
-d '{"template_id": 1}' \
http://localhost:3000/api/project/1/tasks
```

---

## Ein API-Token ablaufen lassen {#expiring-an-api-token}

Wenn Sie das Token nicht mehr benötigen, sollten Sie es ablaufen lassen, um Ihr Konto zu schützen.

Um ein API-Token manuell zu widerrufen (ablaufen zu lassen), senden Sie eine DELETE-Anfrage an den Token-Endpunkt:

```bash
curl -v -XDELETE \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
http://localhost:3000/api/user/tokens/YOUR_ACCESS_TOKEN
```
