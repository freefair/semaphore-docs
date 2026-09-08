
# Runner di progetto (Pro)

I runner di progetto sono una potente funzionalità di Semaphore Pro che consente l'esecuzione distribuita dei task su più server. Questa funzionalità permette di eseguire i task su server separati dall'istanza di Semaphore UI, offrendo maggiore sicurezza, scalabilità e gestione delle risorse.

![](/assets/project_runners.webp)

## Panoramica {#overview}

I runner di progetto funzionano secondo un principio simile ai runner di GitLab o GitHub Actions:

- Un runner viene installato su un server separato da Semaphore UI
- Il runner si connette all'istanza di Semaphore utilizzando un token sicuro
- Quando vengono creati dei task, Semaphore li delega ai runner disponibili
- I runner eseguono i task e riportano i risultati a Semaphore

## Vantaggi {#benefits}

L'utilizzo dei runner offre diversi vantaggi chiave:

1. **Maggiore sicurezza**
   - I runner possono essere installati in ambienti isolati o in reti con accesso limitato
   - Le operazioni sensibili possono essere eseguite in ambienti controllati
   - Migliore separazione delle responsabilità tra interfaccia e ambienti di esecuzione

2. **Scalabilità migliorata**
   - Distribuzione del carico di lavoro su più server
   - Aggiunta o rimozione di runner in base alla domanda
   - Migliore utilizzo delle risorse nell'infrastruttura

3. **Distribuzione flessibile**
   - Installazione dei runner vicino all'infrastruttura di destinazione
   - Esecuzione dei task in zone di rete diverse
   - Supporto per vari modelli di distribuzione (on-premises, cloud, ibrido)

## Utilizzo dei runner di progetto {#using-project-runners}

### Prerequisiti {#prerequisites}

Per utilizzare i runner sono necessari:

1. Una licenza Semaphore Pro
2. Un server separato su cui eseguire il runner
3. Connettività di rete tra il runner e Semaphore UI
4. Una configurazione corretta sia sul server di Semaphore UI sia su quello del runner

<!-- ### Configuration

1. **Semaphore UI Configuration**
  

2. **Runner Setup** -->


### Gestione dei runner {#managing-runners}

È possibile gestire i runner tramite Semaphore UI:

1. Accedere alla sezione Runner del progetto
2. Visualizzare tutti i runner registrati e il loro stato
3. Aggiungere o rimuovere runner secondo necessità
4. Monitorare lo stato di salute e le prestazioni dei runner

### Considerazioni sulla sicurezza {#security-considerations}

- Utilizzare sempre HTTPS per la comunicazione tra i runner e Semaphore UI
- Implementare un'adeguata sicurezza di rete tra i runner e Semaphore UI
- Valutare l'utilizzo di ambienti isolati per le operazioni sensibili

## Best practice {#best-practices}

1. **Pianificazione delle risorse**
   - Dimensionare i runner in modo adeguato al carico di lavoro
   - Monitorare l'utilizzo delle risorse dei runner
   - Scalare i runner in base alla domanda

2. **Configurazione di rete**
   - Garantire una connettività di rete adeguata
   - Configurare i firewall in modo appropriato
   - Utilizzare canali di comunicazione sicuri

3. **Manutenzione**
   - Aggiornare regolarmente il software dei runner
   - Monitorare lo stato di salute dei runner
   - Implementare logging e monitoraggio adeguati
   - Prevedere una strategia di backup in caso di guasto dei runner

4. **Sicurezza**
   - Seguire il principio del privilegio minimo
   - Implementare controlli di accesso adeguati
   - Eseguire audit di sicurezza periodici
   - Mantenere il software aggiornato
