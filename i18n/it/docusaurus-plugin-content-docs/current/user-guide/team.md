# Team

In Semaphore UI, ogni progetto è associato a un **Team**. Solo i membri del team e gli amministratori possono accedere al progetto. A ogni membro del team viene assegnato uno dei quattro ruoli integrati, che determinano il livello di accesso e le azioni che può eseguire.

Nell'edizione **Enterprise**, i ruoli integrati possono essere estesi con [ruoli personalizzati](#extended-rbac-enterprise) che concedono autorizzazioni aggiuntive e granulari su template specifici.

:::tip
Per evitare di perdere l'accesso a un progetto, si consiglia di avere almeno due membri del team con il ruolo <b>Owner</b>.
:::

## Ruoli integrati {#built-in-roles}

Ogni membro del team ha esattamente uno di questi quattro ruoli:

- **Owner**
- **Manager**
- **Task Runner**
- **Guest**

Di seguito sono riportate descrizioni dettagliate di ciascun ruolo e delle relative autorizzazioni.

### Owner {#owner}

- **Autorizzazioni complete**<br />
  Gli Owner possono fare qualsiasi cosa all'interno del progetto, inclusa la gestione dei ruoli, l'aggiunta/rimozione dei membri e la configurazione di qualsiasi impostazione del progetto.

- **Più Owner**<br />
  Un progetto può avere più Owner, garantendo che ci sia più di una persona con privilegi completi.

- **Limitazioni all'auto-rimozione**<br />
  Un Owner non può rimuovere se stesso se è l'unico Owner del progetto. Questo impedisce che il progetto rimanga senza Owner.

- **Gestione degli altri Owner**<br />
  Gli Owner possono gestire (inclusa la rimozione o la modifica del ruolo) tutti i membri del team, compresi gli altri Owner.

### Manager {#manager}

- **Ampio controllo del progetto:** I Manager hanno quasi le stesse autorizzazioni degli Owner, il che consente loro di gestire la maggior parte delle attività quotidiane e l'ambiente del progetto.

- I Manager **non possono**:
  - Rimuovere il progetto.
  - Rimuovere o modificare i ruoli degli Owner.

- **Caso d'uso tipico:** Assegnare il ruolo Manager ai membri senior del team che necessitano di un accesso esteso ma non dell'autorità di eliminare il progetto o gestire gli Owner.

### Task Runner {#task-runner}

- **Esecuzione dei task:** I Task Runner possono eseguire qualsiasi task template esistente nel progetto.

- **Sola lettura per le altre risorse:** Pur potendo eseguire i task, hanno accesso in sola lettura alle altre risorse, come inventory, variabili, repository, ecc.

- **Caso d'uso tipico:** Sviluppatori o QA engineer che devono avviare e monitorare i task ma non hanno bisogno di modificare le impostazioni del progetto o gestire i membri del team.

### Guest {#guest}

- **Accesso in sola lettura:** I Guest hanno accesso in sola lettura a tutte le risorse del progetto (ad esempio visualizzazione di log, inventory, dashboard).

- **Nessuna autorizzazione di scrittura:** Non possono modificare le impostazioni, eseguire task o cambiare i ruoli.

- **Caso d'uso tipico:** Stakeholder o altri collaboratori che devono solo visualizzare lo stato e i dettagli del progetto senza apportare modifiche.

---

## RBAC esteso (Enterprise) {#extended-rbac-enterprise}

:::info
L'RBAC esteso è disponibile nell'edizione **Semaphore Enterprise**, a partire da [Semaphore v2.17](https://semaphoreui.com/releases/semaphore-v2_17).
:::

L'RBAC esteso aggiunge autorizzazioni supplementari ai quattro ruoli integrati. I ruoli integrati stessi restano invariati. Se non si definiscono ruoli personalizzati, ogni progetto si comporta esattamente come nell'edizione community.

Con l'RBAC esteso, i ruoli personalizzati possono concedere singole autorizzazioni a livello di progetto. È inoltre possibile concedere a un ruolo autorizzazioni su task template selezionati. Questo consente di dare a un membro del team l'accesso ai template di cui ha bisogno senza promuoverlo a un ruolo integrato superiore.

### Ruoli personalizzati {#custom-roles}

Un ruolo personalizzato è un insieme di autorizzazioni con un nome che integra il ruolo di progetto integrato di un membro. Ogni membro del team mantiene il proprio ruolo integrato. I ruoli personalizzati vi aggiungono autorizzazioni.

I ruoli personalizzati sono disponibili in due ambiti:

- I **ruoli globali** sono definiti a livello di istanza e possono essere utilizzati in qualsiasi progetto.
- I **ruoli di progetto** sono definiti all'interno di un singolo progetto e sono disponibili solo in quel progetto.

### Livelli di autorizzazione {#permission-levels}

I ruoli personalizzati concedono autorizzazioni a due livelli:

- Le **autorizzazioni a livello di progetto** estendono l'accesso di un utente all'intero progetto. Si scelgono al momento della creazione del ruolo.
- Le **autorizzazioni sui template** controllano le azioni su un singolo task template. Si scelgono nella scheda **Autorizzazioni** del template, dopo aver aggiunto il ruolo al template.

### Creare un ruolo personalizzato {#create-a-custom-role}

Scegliere l'ambito prima di aprire il modulo del ruolo.

#### Ruolo globale {#global-role}

I ruoli globali vengono creati una sola volta e possono essere assegnati agli utenti in qualsiasi progetto. Solo un amministratore dell'istanza può creare un ruolo globale.

Aprire il menu di amministrazione in basso a sinistra e selezionare **Ruoli**.

Nell'elenco dei ruoli a livello di istanza, selezionare **Nuovo ruolo**.

![Aprire Ruoli dal menu dell'amministratore, quindi selezionare Nuovo ruolo](/assets/custom-roles-navigation-to-new-role-annotated-v4.png)

#### Ruolo di progetto {#project-role}

I ruoli di progetto sono disponibili solo nel progetto in cui vengono creati. Possono crearli gli Owner e i Manager del progetto.

1. Aprire il progetto e andare in **Team** > **Ruoli**.
2. Selezionare **Nuovo ruolo**.

La scheda **Ruoli** è vuota finché non viene creato il primo ruolo di progetto. Elenca tutti i ruoli di progetto e contiene il pulsante **Nuovo ruolo**.

![](https://www.semaphoreui.com/uploads/v2.17/roles1.webp)

### Configurare un ruolo personalizzato {#configure-a-custom-role}

Entrambi i percorsi aprono lo stesso modulo del ruolo. Configurare il ruolo in base all'accesso di cui il membro del team ha bisogno.

![Finestra Nuovo ruolo con campi e caselle di controllo delle autorizzazioni](/assets/custom-roles-global-role-form.jpg)

| Campo | Descrizione |
| --- | --- |
| **Nome** | Un'etichetta leggibile per il ruolo. |
| **Slug** | Un identificatore tecnico univoco utilizzato per fare riferimento al ruolo. Utilizzare lettere minuscole, numeri, trattini bassi o trattini, ad esempio `release_operator`. |
| **Autorizzazioni** | Le autorizzazioni a livello di progetto concesse dal ruolo. |

#### Autorizzazioni a livello di progetto {#project-wide-permissions}

Scegliere solo le autorizzazioni a livello di progetto di cui il ruolo ha bisogno:

| Autorizzazione | Descrizione |
| --- | --- |
| **Può eseguire i task del progetto** | Eseguire i task del progetto. |
| **Può aggiornare il progetto** | Modificare le informazioni di base del progetto in **Dashboard** > **Impostazioni**. |
| **Può gestire le risorse del progetto** | Gestire le risorse del progetto, come task template, repository, inventory, ambienti, voci del Key Store, pianificazioni, integrazioni e runner. Si tratta di un accesso a livello di progetto. Non può essere limitato a singole risorse diverse dai template. |
| **Può gestire gli utenti del progetto** | Gestire i membri del progetto e le assegnazioni dei ruoli. |

Le autorizzazioni a livello di progetto non possono essere limitate a un singolo inventory, repository, ambiente o voce del Key Store. I task template sono l'unico tipo di risorsa che supporta assegnazioni granulari dei ruoli.

:::tip Accesso limitato ai template
Per creare un ruolo granulare che aggiunga l'accesso solo a task template selezionati, lasciare deselezionate tutte le autorizzazioni a livello di progetto. Il ruolo non aggiunge così alcuna autorizzazione a livello di progetto. Aggiungerlo ai template necessari e scegliere solo le azioni di cui quel ruolo ha bisogno.
:::

Selezionare **Salva** quando la configurazione del ruolo è pronta.

### Configurare l'accesso a task template specifici {#configure-access-to-specific-task-templates}

Le autorizzazioni sui template aggiungono l'accesso a task template selezionati. L'esempio seguente utilizza un ruolo personalizzato senza autorizzazioni a livello di progetto. Questa configurazione a privilegi minimi è utile quando un membro del team ha bisogno solo di determinate azioni sui template. È inoltre possibile aggiungere autorizzazioni sui template a un ruolo che concede già l'accesso a livello di progetto.

**Aprire il template desiderato**

1. Aprire **Task Template** e selezionare il template di destinazione.
2. Aprire la scheda **Autorizzazioni**.

La scheda **Autorizzazioni** elenca i ruoli già aggiunti al template.

![](https://www.semaphoreui.com/uploads/v2.17/roles2.webp)

**Aggiungere il ruolo e concedere le autorizzazioni sul template**

1. Selezionare **Aggiungi ruolo** e scegliere il ruolo personalizzato da aggiungere a questo template.
2. Selezionare solo le autorizzazioni sul template di cui il ruolo ha bisogno, come **Può eseguire i task** o **Può aggiornare il template**.

Questo esempio utilizza un ruolo creato in precedenza senza autorizzazioni a livello di progetto. È possibile scegliere qualsiasi ruolo personalizzato disponibile nel progetto.

![Finestra delle autorizzazioni del template con i controlli necessari evidenziati](/assets/custom-roles-template-permissions-annotated.png)

Per concedere allo stesso ruolo l'accesso ad altri template, ripetere questi passaggi per ciascun template.

:::note Accesso esistente al progetto
Le autorizzazioni sui template sono additive. Aggiungono accesso senza sostituire o ridurre quello derivante dal ruolo integrato dell'utente o da altri ruoli personalizzati. Se un utente può già eseguire o aggiornare tutti i task template, l'aggiunta di un ruolo specifico per un template non restringe tale accesso.
:::

### Assegnare un ruolo personalizzato in un progetto {#assign-a-custom-role-in-a-project}

Dopo aver creato e configurato un ruolo globale o di progetto, assegnarlo al membro del team desiderato:

1. Aprire il progetto e andare in **Team**.
2. Espandere **Ruoli** accanto all'utente desiderato.
3. Selezionare il ruolo personalizzato.

### Non attualmente supportato {#not-currently-supported}

- **Mappatura dei gruppi LDAP / OIDC.** I ruoli personalizzati vengono assegnati per singolo utente. La mappatura dei gruppi di directory esterne ai ruoli personalizzati non è supportata.
- **Autorizzazioni granulari per risorse diverse dai template.** Attualmente solo i template possono essere governati dai ruoli personalizzati a livello di singola risorsa.

---

## Gestione dei membri del team {#managing-team-members}

- **Invito di nuovi membri:** Gli **Owner** e i **Manager** possono invitare nuovi utenti a far parte del team e assegnare loro un ruolo iniziale.

- **Modifica dei ruoli:** Gli Owner possono sempre modificare i ruoli di qualsiasi membro del team. I Manager possono modificare i ruoli dei **Task Runner** e dei **Guest**, ma **non** quelli di altri Manager o degli Owner.

- **Rimozione dei membri:** Gli Owner e i Manager possono rimuovere i membri del team con ruoli inferiori.
  - Un Owner può rimuovere chiunque (inclusi altri Owner), ma non può rimuovere se stesso se è l'unico Owner.
  - Un Manager può rimuovere **Task Runner** e **Guest**, ma **non** altri Manager o Owner.

---

## Buone pratiche {#best-practices}

1. **Mantenere la ridondanza:** Assegnare il ruolo **Owner** ad almeno due persone per garantire un accesso continuo ed evitare un singolo punto di guasto.
2. **Seguire il principio del privilegio minimo:**
   - Assegnare ai membri del team il ruolo minimo necessario per le loro attività.
   - Utilizzare i ruoli **Task Runner** o **Guest** per chi ha bisogno solo di autorizzazioni limitate.
   - Nell'edizione Enterprise, preferire i [ruoli personalizzati](#extended-rbac-enterprise) per concedere l'accesso a template specifici anziché elevare il ruolo integrato di un membro.
3. **Rivedere regolarmente i membri:**
   - Quando la struttura del team cambia, rivalutare i ruoli.
   - Revocare l'accesso o declassare i ruoli degli utenti che non necessitano più di privilegi elevati.
4. **Utilizzare i Manager per l'amministrazione quotidiana:**
   - Riservare il ruolo Owner a un gruppo ristretto con autorità definitiva.
   - Delegare le attività di gestione ordinaria del progetto ai Manager per ridurre il rischio di modifiche importanti accidentali o di eliminazioni del progetto.

---

## Domande frequenti {#frequently-asked-questions}

### 1. Un Owner può rimuovere un altro Owner? {#1-can-an-owner-remove-another-owner}
Sì, un Owner può rimuovere o modificare il ruolo di qualsiasi altro Owner, a meno che non sia l'unico Owner rimasto nel progetto.

### 2. Chi può eliminare il progetto? {#2-who-can-delete-the-project}
Solo gli **Owner** possono eliminare un progetto.

### 3. I Manager possono aggiungere o rimuovere altri Manager? {#3-can-managers-add-or-remove-other-managers}
No. I Manager possono solo aggiungere o rimuovere utenti con ruolo **Task Runner** o **Guest**. Per gestire gli Owner o altri Manager, è necessario essere un Owner.

### 4. Cosa succede se rimuovo per errore tutti gli Owner? {#4-what-happens-if-i-remove-all-owners-by-accident}
Semaphore UI impedisce la rimozione di un Owner se ciò lascerebbe il progetto senza alcun Owner. Deve esserci sempre almeno un Owner.

### 5. I Guest possono eseguire task? {#5-can-guests-run-tasks}
No. I Guest hanno accesso in sola lettura e non possono avviare o gestire task. Nell'edizione Enterprise è possibile concedere a un Guest l'autorizzazione a eseguire singoli template tramite un [ruolo personalizzato](#extended-rbac-enterprise).

### 6. I ruoli personalizzati sostituiscono i ruoli integrati? {#6-do-custom-roles-replace-the-built-in-roles}
No. I ruoli personalizzati estendono i ruoli integrati con autorizzazioni aggiuntive a livello di progetto e di template. Ogni membro del team ha comunque esattamente un ruolo integrato.

### 7. L'RBAC esteso è disponibile nell'edizione community? {#7-is-extended-rbac-available-in-the-community-edition}
No. L'RBAC esteso richiede un abbonamento **Semaphore Enterprise**.
