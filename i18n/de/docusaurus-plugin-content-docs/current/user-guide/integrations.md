# Integrationen

Integrationen ermöglichen die Interaktion zwischen Semaphore und externen Diensten wie GitHub und GitLab.

![](/assets/integrations_1.jpg)

Über eine Integration können Sie eine bestimmte Vorlage auslösen, indem Sie einen speziellen Endpunkt (Alias) aufrufen, für den Sie eine der folgenden Authentifizierungsmethoden konfigurieren können:
* GitHub-Webhooks
* Token
* HMAC
* Keine Authentifizierung

Der Alias ist eine URL im folgenden Format: `/api/integrations/<random_string>`. Unterstützt werden `GET`- und `POST`-Anfragen.

## Matcher {#matchers}

Mit Matchern können Sie Parameter der eingehenden Anfrage definieren. Wenn diese Parameter übereinstimmen, wird die Vorlage aufgerufen.

## Wert-Extraktoren {#value-extractors}

Mit einem Extraktor können Sie die benötigten Daten aus der eingehenden Anfrage extrahieren und als Umgebungsvariablen an die Aufgabe übergeben. Damit die extrahierten Variablen an die
Aufgabe übergeben werden, müssen Sie eine Umgebung mit den entsprechenden Schlüsseln erstellen. Stellen Sie sicher, dass die Schlüssel der Umgebung mit den im Extraktor definierten Variablen übereinstimmen, damit die Aufgabe die richtigen
Umgebungsvariablen empfangen und verwenden kann.

## Aufgabenparameter {#task-parameters}

Integrationen können Aufgaben mit Parametern auslösen. Verwenden Sie Wert-Extraktoren, um eine JSON-Payload für die Aufgabenparameter zu erstellen, und konfigurieren Sie die Vorlage so, dass sie abgefragte Werte akzeptiert.

## Hinweise zu Aliassen und Matchern {#notes-on-aliases-and-matchers}

Bei Integrationen, die mit einem Alias-Endpunkt konfiguriert sind, werden Matcher nicht verwendet. Bevorzugen Sie bei Bedarf Token-/HMAC-Authentifizierung und übergeben Sie Parameter über Extraktoren.
