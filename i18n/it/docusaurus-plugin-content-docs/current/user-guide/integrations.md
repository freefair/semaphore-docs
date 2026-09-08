# Integrazioni

Le integrazioni consentono di stabilire un'interazione tra Semaphore e servizi esterni, come GitHub e GitLab.

![](/assets/integrations_1.jpg)

Tramite un'integrazione è possibile avviare un modello specifico chiamando un endpoint speciale (alias), per il quale è possibile configurare uno dei seguenti metodi di autenticazione:
* Webhook GitHub
* Token
* HMAC
* Nessuna autenticazione

L'alias rappresenta un URL nel seguente formato: `/api/integrations/<random_string>`. Supporta richieste `GET` e `POST`.

## Matcher {#matchers}

Con i matcher è possibile definire i parametri della richiesta in ingresso. Quando questi parametri corrispondono, il modello viene invocato.

## Estrattori di valori {#value-extractors}

Con un estrattore è possibile estrarre i dati necessari dalla richiesta in ingresso e passarli al task come variabili d'ambiente. Affinché le variabili estratte vengano passate al
task, è necessario creare un ambiente con le chiavi corrispondenti. Assicurarsi che le chiavi dell'ambiente corrispondano alle variabili definite nell'estrattore, in modo che il task possa ricevere
e utilizzare le variabili d'ambiente corrette.

## Parametri del task {#task-parameters}

Le integrazioni possono avviare task con parametri. Utilizzare gli estrattori di valori per costruire un payload JSON per i parametri del task e configurare il modello affinché accetti i valori richiesti all'avvio.

## Note su alias e matcher {#notes-on-aliases-and-matchers}

Per le integrazioni configurate con un endpoint alias, i matcher non vengono utilizzati. Preferire l'autenticazione token/HMAC secondo necessità e passare i parametri tramite gli estrattori.

