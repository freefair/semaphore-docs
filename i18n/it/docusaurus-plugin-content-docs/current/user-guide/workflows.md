# Workflow (Pro)

I workflow consentono di concatenare più template di task in un grafo orientato (DAG) con
diramazioni, approvazioni e pause temporizzate. Un'esecuzione di workflow avanza automaticamente
man mano che ogni passaggio termina: il grafo viene progettato una sola volta nell'editor visuale, quindi
le esecuzioni vengono avviate dalla pagina Workflow.

:::info
I workflow sono una funzionalità di **Semaphore Pro**. La voce di menu Workflow compare solo
quando la sottoscrizione li include.
:::

## Panoramica {#overview}

Un workflow è composto da:

- **Nodi** — i passaggi del grafo (esecuzione di un template, attesa di un'approvazione, pausa per un
  ritardo o annotazione con una nota).
- **Archi** — le connessioni tra i nodi, ciascuna etichettata con una **condizione** che
  controlla quando viene avviato il nodo a valle.

Quando si avvia un workflow, Semaphore crea un'**esecuzione di workflow**. Il server
governa l'avanzamento: man mano che i task vengono completati, le approvazioni vengono risolte o i ritardi scadono,
i nodi a valle vengono avviati in base alle condizioni degli archi.

## Creazione di un workflow {#creating-a-workflow}

1. Aprire il progetto e andare su **Workflow**.
2. Fare clic su **Nuovo workflow**.
3. Nell'editor grafico:
   - Trascinare i nodi dalla palette sul canvas.
   - Collegare i nodi trascinando dal punto di uscita di un nodo verso un altro nodo.
   - Fare clic su un nodo o su un arco per modificarne le proprietà nel pannello laterale.
4. Impostare un **nome** (e facoltativamente una **versione iniziale** per il versionamento delle esecuzioni).
5. Correggere eventuali problemi elencati nel pannello **Problemi**, quindi fare clic su **Salva**.

L'editor convalida il grafo prima del salvataggio. Un workflow valido deve avere almeno
un nodo, esattamente un nodo iniziale (senza archi in ingresso), nessun ciclo e una
configurazione completa su ogni nodo eseguibile.

## Tipi di nodo {#node-kinds}

| Tipo | Scopo |
|------|---------|
| **Task** | Esegue un template di task. È possibile sovrascrivere i parametri del template (inventory, ambiente, limit di Ansible, argomenti CLI aggiuntivi) per ogni nodo tramite i **parametri del task**. |
| **Approvazione** | Mette in pausa l'esecuzione finché un utente con i permessi necessari approva o rifiuta. Facoltativamente è possibile impostare un timeout (in secondi) e un messaggio di approvazione. |
| **Ritardo** | Attende un numero configurato di secondi prima di proseguire con i nodi a valle. Utile per periodi di attesa, finestre di manutenzione o per distanziare passaggi dipendenti. |
| **Nota** | Annotazione libera sul canvas. I nodi nota non vengono eseguiti e non sono collegati da archi: servono esclusivamente a scopo di documentazione. |

### Convergenza {#convergence}

I nodi con più archi in ingresso possono richiedere che **tutti** i nodi a monte terminino
(impostazione predefinita) oppure che ne termini **uno qualsiasi**. Impostare **Convergenza** nel pannello delle proprietà del nodo.

### Nodi di ritardo {#delay-nodes}

Un nodo di ritardo mette in pausa l'esecuzione del workflow per la durata configurata (minimo 1
secondo). Durante l'attesa:

- L'esecuzione rimane nello stato **running**.
- La vista dell'esecuzione mostra un conto alla rovescia in tempo reale sul nodo di ritardo.
- I nodi a valle collegati tramite archi non vengono avviati finché il ritardo non è terminato.

Se l'esecuzione del workflow viene **arrestata** mentre un ritardo è attivo, il ritardo viene
annullato e l'esecuzione termina nello stato **stopped**.

### Nodi di approvazione {#approval-nodes}

Quando l'esecuzione raggiunge un nodo di approvazione, lo stato passa ad **approval** finché
qualcuno approva o rifiuta. I controlli Approva/Rifiuta compaiono nella vista dell'esecuzione.
Le approvazioni rifiutate fanno fallire l'esecuzione in base alle condizioni degli archi collegati.

## Condizioni degli archi {#edge-conditions}

Ogni arco ha una condizione che determina quando il nodo a valle diventa pronto:

| Condizione | Il nodo a valle si avvia quando il nodo a monte… |
|-----------|-------------------------------------------|
| **In caso di successo** | Termina con successo (impostazione predefinita). |
| **In caso di errore** | Termina con un errore. |
| **Sempre** | Termina in qualsiasi stato finale (successo o errore). |

Utilizzare le diramazioni **In caso di errore** per azioni compensative o notifiche. Utilizzare
**Sempre** quando il passaggio successivo deve essere eseguito indipendentemente dall'esito.

## Esecuzione e monitoraggio {#running-and-monitoring}

- **Esegui workflow** — avvia una nuova esecuzione dall'elenco dei workflow.
- **Vista dell'esecuzione** — grafo a schermo intero con lo stato in tempo reale di ogni nodo (in esecuzione, successo,
  fallito, approvazione, conto alla rovescia del ritardo).
- **Arresta** — mentre un'esecuzione è in stato `running` o `approval`, gli utenti con il permesso
  `run_project_tasks` possono arrestarla. Tutti i task attivi vengono arrestati, le approvazioni
  in sospeso vengono rifiutate e l'esecuzione viene contrassegnata come **stopped**.

Stati dell'esecuzione: `running`, `approval`, `success`, `failed`, `stopped`.

## Versionamento delle esecuzioni {#run-versioning}

Impostare la **Versione iniziale** sul workflow (ad esempio `1.0.0`) per abilitare le etichette di
versione su ogni esecuzione. Semaphore incrementa la versione a ogni esecuzione successiva, in modo simile
ai template di build.

## Artefatti del workflow (set_stats) {#workflow-artifacts-set_stats}

Quando un task Ansible in un workflow utilizza `set_stats`, le variabili vengono archiviate come
**artefatti del workflow** per quell'esecuzione. I nodi task a valle nella stessa esecuzione
le ricevono automaticamente come variabili aggiuntive.

:::warning
Se i passaggi del workflow vengono eseguiti su **runner remoti**, gli artefatti del workflow non vengono ancora
propagati tra i passaggi eseguiti su runner remoti: vengono passati solo tra i task eseguiti
localmente sul server Semaphore. Pianificare di conseguenza il passaggio degli artefatti oppure mantenere
i passaggi che producono e consumano artefatti sullo stesso percorso di esecuzione.
:::

## Permessi {#permissions}

- La gestione dei workflow (creazione, modifica, eliminazione) richiede i permessi di gestione
  delle risorse del progetto.
- L'esecuzione dei workflow richiede `run_project_tasks`.
- La risoluzione delle approvazioni richiede un accesso adeguato al progetto (gli stessi utenti che possono eseguire
  task nel progetto).

## API {#api}

I template di workflow e le esecuzioni sono disponibili in
`/api/project/{project_id}/workflows`. Consultare la
[documentazione dell'API](/admin-guide/api) per gli schemi di richiesta e risposta, inclusi
i campi del nodo `delay` (`delay_seconds`) e l'endpoint di arresto
(`POST …/runs/{run_id}/stop`).
