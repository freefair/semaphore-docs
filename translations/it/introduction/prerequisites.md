# Prerequisiti

Semaphore ha pochi requisiti propri e rigidi. Gran parte di ciò che devi preparare
riguarda l'automazione che eseguirà e l'ambiente che la circonda. Affronta questa pagina
prima dell'[Installazione](../../../docs/admin-guide/installation.md) e l'installazione vera e propria
richiederà pochi minuti.

<a id="a-host"></a>

## Un host

Semaphore viene distribuito come singolo binario e come immagine container, e gira su Linux,
macOS e Windows. Linux è la piattaforma a cui puntano i pacchetti, le immagini Docker e la
chart Helm, ed è quella usata dalla maggior parte dei deployment.

Il servizio è leggero: è un processo Go che serve un'interfaccia web. Ciò che consuma
davvero memoria e CPU sono Ansible, Terraform e i tuoi script, eseguiti in parallelo sulla
stessa macchina. Dimensiona l'host per il lavoro, non per Semaphore, e limita la
concorrenza con l'impostazione di progetto **Max number of parallel tasks** — oppure sposta
l'esecuzione sui [runner](../../../docs/admin-guide/runners.md) e dimensiona quelli.

Prevedi storage persistente in due punti: il database e la directory indicata da
`tmp_path`, dove vengono clonati i repository. In Docker questo significa un volume; un
container che ne è privo perde i propri dati alla ricreazione.

<a id="a-database"></a>

## Un database

Sceglilo prima di installare, perché cambiarlo in seguito significa migrare i dati.

| Motore | Usalo quando |
|---|---|
| **SQLite** | Un server, un team. Incluso, nulla da configurare, è la scelta predefinita. |
| **PostgreSQL** o **MySQL/MariaDB** | Il servizio è importante per più di poche persone, vuoi backup e monitoraggio dalla tua piattaforma database esistente, oppure prevedi di eseguire più di un nodo. |

L'[alta disponibilità](../../../docs/admin-guide/ha.md) richiede PostgreSQL o MySQL più Redis, e non può
usare SQLite. Se l'HA è nella tua roadmap, parti da PostgreSQL.

Crea il database e un utente con i diritti su di esso prima di installare; Semaphore crea
le proprie tabelle al primo avvio e a ogni aggiornamento.

<a id="network-access"></a>

## Accesso di rete

| Semaphore deve raggiungere | Per |
|---|---|
| I tuoi remote Git | Clonare i repository a cui puntano i template. |
| Gli host e le API cloud che automatizzi | Svolgere effettivamente il lavoro. |
| Il tuo identity provider, se ne usi uno | L'accesso con [LDAP](../../../docs/admin-guide/authentication/ldap.md) o [OpenID Connect](../../../docs/admin-guide/authentication/openid.md). |
| I tuoi canali di notifica | E-mail, Telegram, Slack e gli altri. |

Gli utenti raggiungono l'interfaccia web sulla porta `3000`, se non la cambi. Metti il
[TLS](../../../docs/admin-guide/reverse-proxy/README.md) davanti a essa prima che qualcuno acceda: sessioni e
token API viaggiano su quel canale.

Se saranno i runner a eseguire i task, allora è *a loro* che serve l'accesso ai remote Git
e agli host di destinazione, e serve loro l'accesso in uscita verso il server Semaphore. Il
server non si connette mai a un runner.

<a id="automation-tooling"></a>

## Strumenti di automazione

Qualunque cosa un task esegua deve essere installata là dove viene eseguita — sul server,
sul runner o nell'immagine container usata dall'executor.

- Le immagini Docker includono Ansible, Terraform, OpenTofu e le dipendenze consuete.
  I pacchetti Python aggiuntivi vanno in un `requirements.txt` montato; vedi
  [Installare dipendenze Python aggiuntive](../../../docs/admin-guide/installation/docker.md#installing-additional-python-dependencies).
- Un'installazione da pacchetto o da binario ti dà solo Semaphore. Installa da te Git,
  Python, Ansible ed eventuali collection o provider; vedi
  [Installazione manuale](../../../docs/admin-guide/installation_manually.md).

Verifica che il tuo playbook o la tua configurazione funzioni da una shell su quella
macchina, con l'utente con cui gira Semaphore, prima di crearne un template. Quasi ogni
segnalazione del tipo "in locale funziona" si risolve in una collection, un provider o un
pacchetto Python mancante.

<a id="credentials-to-have-ready"></a>

## Credenziali da avere pronte

Raccoglile prima del primo template, perché altrimenti ciascuna diventa una sosta a sé:

- Una **deploy key o un token** per ogni repository che Semaphore clonerà.
- Le **chiavi SSH o le credenziali** usate per raggiungere gli host che gestisci.
- Eventuali **credenziali cloud** richieste dal tuo Terraform o dai tuoi moduli.
- Una **password di Ansible Vault**, se i tuoi playbook sono cifrati.

Tutte vanno nel [Key Store](../../../docs/user-guide/key-store.md), non nel repository.

<a id="decisions-to-make-first"></a>

## Decisioni da prendere subito

Tre scelte costano poco adesso e molto in seguito:

1. **Il motore del database**, come sopra.
2. **L'URL che useranno gli utenti.** Impostalo come `web_host`. Da esso derivano i reverse
   proxy, gli URI di redirect OIDC, le destinazioni dei webhook e i link nelle notifiche.
3. **`access_key_encryption`.** Generala al momento dell'installazione, fanne un backup
   separato e non ruotarla con leggerezza: ogni segreto memorizzato è cifrato con essa.

```bash
head -c32 /dev/urandom | base64
```

<a id="whats-next"></a>

## Prossimi passi

- [Installazione](../../../docs/admin-guide/installation.md) — scegli un metodo e installa.
- [Configurazione](../../../docs/admin-guide/configuration.md) — come si forniscono le opzioni e che cosa significano.
- [Primi passi](../../../docs/getting-started/README.md) — da un server installato al primo task.
