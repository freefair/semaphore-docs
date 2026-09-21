# Ansible

Con Semaphore UI è possibile eseguire playbook Ansible. Per farlo, è necessario creare un Task Template di tipo **Ansible Playbook**.

1. Andare nella sezione **Task Templates**, fare clic su **New Template** e poi su **Ansible Playbook**.

![](../../../../static/assets/ansible_1.png)

2. Configurare il Task Template.

Il Task Template consente di specificare i seguenti parametri:

* Repository
* Percorso del file del playbook
* Directory di lavoro (facoltativa)
* Inventory
* Variable Group
* Vault
* Argomenti CLI aggiuntivi (tags, skip-tags, limit, livello di verbosità)
* Variabili d'ambiente

![](../../../../static/assets/ansible_2.png)

<a id="working-directory"></a>

## Directory di lavoro

Utilizzare **Working directory** per eseguire i comandi Ansible da una sottodirectory del Repository del Task Template. Inserire un percorso relativo alla radice del Repository. Ad esempio, se `ansible.cfg` è memorizzato in `<repository>/automation`, inserire `automation`. I percorsi assoluti e i percorsi esterni al Repository vengono rifiutati. Se omesso, Semaphore utilizza la radice del Repository.

La directory di lavoro influisce sui comportamenti di Ansible che dipendono dalla directory corrente del processo. L'[ordine di ricerca del file di configurazione][ansible-config-search] di Ansible include `ansible.cfg` nella directory corrente. La directory di lavoro influisce inoltre sulla risoluzione dei percorsi relativi negli argomenti CLI aggiuntivi; ad esempio [`--extra-vars @vars.yml`][ansible-extra-vars-file] e [`--private-key key.pem`][ansible-private-key]. I percorsi del playbook e dell'Inventory su file rimangono relativi alla radice dei rispettivi Repository.

La modifica della directory di lavoro non aggiunge di per sé le sottodirectory `roles/` o `collections/` di quella directory ai percorsi di ricerca di Ansible. L'[individuazione dei ruoli relativa al playbook][ansible-role-search] e le [collection adiacenti a un playbook][ansible-playbook-collections] continuano a basarsi sulla posizione del playbook. La directory di lavoro può comunque influire indirettamente sulla loro individuazione quando il file `ansible.cfg` selezionato configura `roles_path` o `collections_path`.

[ansible-config-search]: https://docs.ansible.com/ansible/latest/reference_appendices/config.html#the-configuration-file
[ansible-extra-vars-file]: https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_variables.html#vars-from-a-json-or-yaml-file
[ansible-private-key]: https://docs.ansible.com/ansible/latest/cli/ansible-playbook.html#cmdoption-ansible-playbook-private-key
[ansible-role-search]: https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_reuse_roles.html#storing-and-finding-roles
[ansible-playbook-collections]: https://docs.ansible.com/ansible/latest/collections_guide/collections_installing.html#installing-collections-adjacent-to-playbooks

<a id="template-types"></a>

## Tipi di Task Template

Un Task Template ansible-playbook può essere di uno dei seguenti tipi:

* [Task](#task)
* [Build](#build)
* [Deploy](#deploy)

<a id="task"></a>

### Task

Esegue semplicemente i playbook specificati con i parametri indicati.

Se si intende avviare il Task Template tramite una chiamata API utilizzando la funzionalità *limit*, assicurarsi di attivare l'opzione *Ansible prompts: Limit*. In caso contrario il valore di limit impostato nella chiamata API verrà ignorato. Per un Task avviato tramite API questo non genera alcuna richiesta interattiva: il Task viene eseguito senza supervisione.

<a id="build"></a>

### Build

Questo tipo di Task Template deve essere utilizzato per creare [artefatti](https://en.wikipedia.org/wiki/Artifact\_\(software\_development\)). La versione iniziale dell'artefatto può essere specificata in un parametro del Task Template. Ogni esecuzione incrementa la versione dell'artefatto.

![](../../../../static/assets/template_new_build_ipad1.png)

Semaphore non supporta gli artefatti in modo nativo: fornisce soltanto il versionamento dei Task. La creazione degli artefatti deve essere implementata dall'utente. Leggere l'articolo [CI/CD](../../admin-guide/cicd.md) per sapere come procedere.

<a id="deploy"></a>

### Deploy

Questo tipo di Task Template deve essere utilizzato per distribuire gli artefatti sui server di destinazione. Ogni Task Template `deploy` è associato a un Task Template `build`.

Questo consente di distribuire sui server una versione specifica dell'artefatto.

<a id="template-options"></a>

## Opzioni del Task Template

<a id="schedule"></a>

### Schedule

È possibile impostare la pianificazione dei Task specificando una pianificazione cron nelle impostazioni del Task Template. Il formato delle espressioni cron è descritto nella [documentazione](https://pkg.go.dev/github.com/robfig/cron/v3#hdr-CRON\_Expression\_Format).

<a id="run-a-task-when-a-new-commit-is-added-to-the-repository"></a>

#### Eseguire un Task quando viene aggiunto un nuovo commit al Repository

È possibile utilizzare cron per verificare periodicamente la presenza di nuovi commit nel Repository e avviare un Task al loro arrivo.

Ad esempio, si dispone del codice sorgente dell'applicazione in un repository git. È possibile aggiungerlo a **Repositories** e avviare il Task di build per i nuovi commit.

<a id="tags-skip-tags-and-limit"></a>

### Tags, skip-tags e limit

I Task Template supportano le opzioni CLI di Ansible:

- `--tags`
- `--skip-tags`
- `--limit`

Queste possono essere impostate nel Task Template e sovrascritte durante la creazione di un Task. Assicurarsi che i prompt corrispondenti siano abilitati se si intende passare questi valori tramite API.

<a id="galaxy-requirements"></a>

### Requisiti Galaxy

Prima di eseguire un playbook, Semaphore installa ruoli e collection dai file `requirements.yml` presenti nella directory del playbook, nella radice del Repository e nelle rispettive sottodirectory `roles/` e `collections/`, utilizzando `ansible-galaxy install --force`.

Per evitare di reinstallarli a ogni esecuzione, Semaphore memorizza un checksum di ciascun file dei requisiti ed esegue di nuovo l'installazione solo quando il file cambia. Due opzioni del Task Template, nella sezione espandibile **Galaxy install options** (sotto **Ansible prompts**), controllano questo comportamento:

- **Skip Galaxy install** — non eseguire affatto `ansible-galaxy`. Da utilizzare quando i requisiti sono già preinstallati nell'immagine del Runner.
- **Force Galaxy install** — eseguire sempre `ansible-galaxy install --force`, ignorando il checksum memorizzato. Da utilizzare quando un file dei requisiti punta a un riferimento mobile (ad esempio un branch invece di un tag) e si desidera l'ultima versione a ogni esecuzione.

**Skip Galaxy install** può essere esposta nel modulo di avvio del Task abilitando la casella di controllo con lo stesso nome sotto **Prompts**, in fondo alla sezione. Quando un prompt è abilitato, il valore scelto in fase di esecuzione sovrascrive il valore predefinito del Task Template.

<a id="galaxy-extra-args"></a>

#### Argomenti Galaxy aggiuntivi

**Role install args** e **Collection install args** (nella sezione espandibile **Galaxy install options** sotto **Ansible prompts**; compressa per impostazione predefinita; il contatore accanto indica quante impostazioni Galaxy sono personalizzate) aggiungono flag rispettivamente a `ansible-galaxy role install` e `ansible-galaxy collection install`. Sono configurati separatamente perché i due sottocomandi accettano flag differenti: `--pre`, ad esempio, è valido solo per le collection.

Ogni voce corrisponde a un singolo token argv; un valore può essere indicato in linea (`--timeout=60`) oppure come voce successiva (`--timeout`, `60`). Sono accettati solo i flag seguenti:

| Ambito | Flag |
|-------|-------|
| Entrambi | `-c`/`--ignore-certs`, `-f`/`--force`, `--force-with-deps`, `-i`/`--ignore-errors`, `-n`/`--no-deps`, `-s`/`--server <url>`, `--timeout <seconds>`, `-v`…`-vvvv`/`--verbose` |
| Solo ruoli | `-g`/`--keep-scm-meta` |
| Solo collection | `--pre`, `-U`/`--upgrade`, `--offline`, `--no-cache`, `--clear-response-cache`, `--disable-gpg-verify`, `--keyring <path>`, `--signature <url>`, `--required-valid-signature-count <n>`, `--ignore-signature-status-code(s) <code>` |

Qualsiasi altro flag viene rifiutato al salvataggio del Task Template. In particolare `--token`/`--api-key` non sono consentiti perché gli argomenti della riga di comando sono visibili nell'elenco dei processi: configurare invece le credenziali Galaxy tramite variabili d'ambiente (ad esempio `ANSIBLE_GALAXY_SERVER_<NAME>_TOKEN`) in un Variable Group. Il file dei requisiti (`-r`) è impostato da Semaphore e i percorsi di installazione (`-p`, `--roles-path`, `--collections-path`) non sono deliberatamente accettati, affinché un Task Template non possa scrivere al di fuori del Repository: impostare invece `roles_path`/`collections_path` in `ansible.cfg` oppure tramite `ANSIBLE_ROLES_PATH`/`ANSIBLE_COLLECTIONS_PATH`.

<a id="parallelism---forks---f"></a>

### Parallelismo (`--forks` / `-f`)

Controllare quanti host Ansible contatta in parallelo passando `--forks` oppure
`-f` negli **Extra CLI arguments** del Task Template. Gli argomenti devono essere JSON valido:
utilizzare un array di token separati:

```json
["--forks", "10"]
```

È supportata anche la forma breve:

```json
["-f", "10"]
```

Quando nel Task Template è abilitata l'opzione **Allow override arguments in task**, un Task può
fornire il proprio valore di forks in fase di esecuzione. Ansible riceve gli argomenti sia del Task Template
sia del Task; prevale l'ultimo `--forks` / `-f` presente nella riga di comando.

Se gli argomenti non sono JSON valido, il Task termina con un errore di convalida
descrittivo prima che l'esecuzione inizi.

<a id="authentication"></a>

### Autenticazione

L'autenticazione sugli host del playbook avviene utilizzando i riferimenti utente del Key Store presenti nell'Inventory. L'utente per SSH è determinato dall'utente facoltativo indicato nell'elemento del Key Store.

<a id="multiple-vault-passwords"></a>

### Più password Vault

È possibile associare a un Task Template più password Vault provenienti dal Key Store. Durante l'esecuzione, Ansible tenterà la decifratura con le password fornite.

<a id="verbosity-level"></a>

### Livello di verbosità

È possibile regolare il livello di verbosità di Ansible per un Task (ad esempio `-v`, `-vvv`) dal modulo del Task Template o del Task, per facilitare la diagnosi dei problemi.
