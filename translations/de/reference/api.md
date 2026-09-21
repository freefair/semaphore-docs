# API

<a id="api-reference"></a>

## API-Referenz

Semaphore UI stellt zwei Formate der API-Dokumentation bereit, damit Sie dasjenige wählen können, das am besten zu Ihrem Workflow passt:

* [Swagger/OpenAPI](../../../docs/reference/api.md) &mdash; ideal, wenn Sie eine interaktive, browserbasierte Umgebung bevorzugen.
* [Offizielle Postman-Collection](https://www.postman.com/semaphoreui) &mdash; erkunden und testen Sie alle Endpunkte in Postman.
* **Integrierte Swagger-API-Dokumentation** &mdash; interaktive API-Dokumentation auf Basis von Swagger UI. Sie können sie auf Ihrer Instanz aufrufen.

![](../../../static/assets/swagger-link.webp)

Alle Optionen enthalten eine vollständige Dokumentation der verfügbaren Endpunkte, Parameter und Beispielantworten.

<a id="getting-started-with-the-api"></a>

## Erste Schritte mit der API

Um die Semaphore-API zu nutzen, müssen Sie ein API-Token erzeugen.
Dieses Token muss im Request-Header wie folgt übergeben werden:

```http
Authorization: Bearer YOUR_API_TOKEN
```

<a id="creating-an-api-token"></a>

### Ein API-Token erstellen

Es gibt zwei Wege, ein API-Token zu erstellen:
- Über die Web-Oberfläche
- Über einen HTTP-Request

<a id="through-the-web-interface-since-214"></a>

#### Über die Web-Oberfläche (seit 2.14)

Öffnen Sie das Kontomenü am unteren Ende der Seitenleiste und wählen Sie **API-Tokens**. Die Seite listet Ihre Tokens auf; der Link **API-Referenz** öffnet die in Ihrer Instanz integrierte Swagger UI.

![API-Tokens](../../../static/assets/api-tokens.webp)

Klicken Sie auf **Neues Token**, geben Sie einen Namen ein, wählen Sie den Ablaufzeitpunkt des Tokens und kopieren Sie den nach der Erstellung angezeigten Wert. Siehe [Ihr Konto](../../../docs/user-guide/account.md#api-tokens).

![Dialog für neues Token](../../../static/assets/api-token-new.webp)

<a id="using-http-request"></a>

#### Über einen HTTP-Request

Sie können sich auch über einen direkten HTTP-Request authentifizieren und ein Session-Token erzeugen.

Melden Sie sich bei Semaphore an (das Passwort muss escaped werden, also z. B. `slashy\\pass` anstelle von `slashy\pass`):

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

Der Befehl sollte etwas Ähnliches wie dies zurückgeben:

```json
{
    "id": "YOUR_ACCESS_TOKEN",
    "created": "2025-05-21T02:35:12Z",
    "expired": false,
    "user_id": 3
}
```
---

<a id="using-token-to-make-api-requests"></a>

## Token für API-Anfragen verwenden

Sobald Sie Ihr API-Token haben, übergeben Sie es im Header **Authorization**, um Ihre Anfragen zu authentifizieren.

<a id="launch-a-task"></a>

### Eine Task starten

Verwenden Sie dieses Token, um eine Task zu starten oder beliebige andere Aktionen auszuführen:

```bash
curl -v -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
-d '{"template_id": 1}' \
http://localhost:3000/api/project/1/tasks
```

---

<a id="expiring-an-api-token"></a>

## Ein API-Token ablaufen lassen

Wenn Sie das Token nicht mehr benötigen, sollten Sie es ablaufen lassen, um Ihr Konto zu schützen.

Um ein API-Token manuell zu widerrufen (ablaufen zu lassen), senden Sie eine DELETE-Anfrage an den Token-Endpunkt:

```bash
curl -v -XDELETE \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
http://localhost:3000/api/user/tokens/YOUR_ACCESS_TOKEN
```
