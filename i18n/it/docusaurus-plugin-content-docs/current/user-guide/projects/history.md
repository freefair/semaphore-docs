
# Cronologia

La schermata Cronologia di Semaphore offre una visione completa di tutte le esecuzioni dei task all'interno del progetto. Questa funzionalità consente di tracciare e analizzare la cronologia di esecuzione dei task, fornendo informazioni preziose sui flussi di automazione.

![](/assets/project_history.webp)

## Panoramica {#overview}

La pagina Cronologia mostra un elenco cronologico di tutte le esecuzioni dei task, tra cui:

- Modelli di task utilizzati
- Stato dell'esecuzione (successo, errore, in corso)
- Orari di inizio e fine
- Durata
- Utente che ha avviato il task
- Output e log del task

## Visualizzazione della cronologia dei task {#viewing-task-history}

### Accesso alla cronologia {#accessing-history}

1. Accedere al progetto in Semaphore
2. Fare clic sulla scheda "Cronologia"
3. Visualizzare l'elenco di tutte le esecuzioni dei task

## Dettagli del task {#task-details}

Facendo clic su un task nell'elenco della cronologia si apre una vista dettagliata che mostra:

1. **Informazioni sul task**
   - ID del task
   - Modello utilizzato
   - Orari di inizio e fine
   - Durata
   - Stato
   - Utente che ha eseguito il task

2. **Dettagli dell'esecuzione**
   - Output completo del task
   - Messaggi di errore (se presenti)
   - Variabili d'ambiente utilizzate
   - Informazioni sull'inventory
   - Dettagli del repository

3. **Log del task**
   - Visualizzazione dei log in tempo reale
   - Opzione di download dei log
   - Funzionalità di ricerca nei log
   - Evidenziazione degli errori

### Statistiche {#statistics}

Il progetto fornisce una pagina di statistiche che riepiloga gli esiti dei task in un intervallo di tempo selezionato, con filtro per utente.

## Gestione dei task {#task-management}

### Azioni disponibili {#actions-available}

Dalla vista cronologia è possibile:

- Accedere ai log completi del task
- Scaricare l'output del task
- Cercare all'interno dei log

## Conservazione dei task {#task-retention}

Semaphore consente di configurare per quanto tempo conservare la cronologia dei task:

1. **Comportamento predefinito**
   - Tutti i task vengono archiviati nel database
   - Nessuna eliminazione automatica per impostazione predefinita

2. **Configurazione della conservazione**
   - Impostare il numero massimo di task per modello
   - Configurare tramite variabile d'ambiente:
     ```bash
     SEMAPHORE_MAX_TASKS_PER_TEMPLATE=30
     ```
   - Oppure tramite config.json:
     ```json
     {
       "max_tasks_per_template": 30
     }
     ```

3. **Regole di conservazione**
   - Al raggiungimento del limite, i task più vecchi vengono eliminati automaticamente
   - L'eliminazione avviene per modello
   - I log dei task vengono rimossi insieme ai record dei task

