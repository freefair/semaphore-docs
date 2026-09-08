
# Ansible

Con Semaphore UI è possibile eseguire playbook Ansible. Per farlo, è necessario creare un template **Ansible Playbook**.

1. Andare nella sezione **Template di attività**, fare clic su **Nuovo template** e poi su **Ansible Playbook**.

![](/assets/ansible_1.png)

2. Configurare il template.

Il template consente di specificare i seguenti parametri:

* Repository
* Percorso del file del playbook
* Directory di lavoro (facoltativa)
* Inventory
* Gruppi di variabili
* Vault
* Argomenti CLI aggiuntivi (tags, skip-tags, limit, verbosità)
* Variabili d'ambiente

![](/assets/ansible_2.png)

## Directory di lavoro {#working-directory}

Usare **Directory di lavoro** per eseguire i comandi Ansible da una sottodirectory del repository del template. Inserire un percorso relativo alla radice del repository. Ad esempio, se `ansible.cfg` si trova in `<repository>/automation`, inserire `automation`. I percorsi assoluti e i percorsi al di fuori del repository vengono rifiutati. Se omessa, Semaphore utilizza la radice del repository.

La directory di lavoro influisce sul comportamento di Ansible che dipende dalla directory corrente del processo. L'[ordine di ricerca del file di configurazione][ansible-config-search] di Ansible include `ansible.cfg` nella directory corrente. La directory di lavoro influisce anche sulla risoluzione dei percorsi relativi negli argomenti CLI aggiuntivi; alcuni esempi sono [`--extra-vars @vars.yml`][ansible-extra-vars-file] e [`--private-key key.pem`][ansible-private-key]. I percorsi del playbook e dell'inventory su file restano relativi alle radici dei rispettivi repository.

Cambiare la directory di lavoro non aggiunge di per sé la sottodirectory `roles/` o `collections/` di tale directory ai percorsi di ricerca di Ansible. La [ricerca dei ruoli relativa al playbook][ansible-role-search] e le [collection adiacenti a un playbook][ansible-playbook-collections] restano basate sulla posizione del playbook. La directory di lavoro può comunque influire indirettamente sulla loro individuazione quando l'`ansible.cfg` selezionato configura `roles_path` o `collections_path`.

[ansible-config-search]: https://docs.ansible.com/ansible/latest/reference_appendices/config.html#the-configuration-file
[ansible-extra-vars-file]: https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_variables.html#vars-from-a-json-or-yaml-file
[ansible-private-key]: https://docs.ansible.com/ansible/latest/cli/ansible-playbook.html#cmdoption-ansible-playbook-private-key
[ansible-role-search]: https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_reuse_roles.html#storing-and-finding-roles
[ansible-playbook-collections]: https://docs.ansible.com/ansible/latest/collections_guide/collections_installing.html#installing-collections-adjacent-to-playbooks

## Tipi di template {#template-types}

Un template ansible-playbook può essere di uno dei seguenti tipi:

* [Task](#task)
* [Build](#build)
* [Deploy](#deploy)

### Task {#task}

Esegue semplicemente i playbook specificati con i parametri specificati.

Se si intende avviare il template tramite una chiamata API con la funzionalità *limit*, assicurarsi di attivare l'opzione *Ansible prompts: Limit*. In caso contrario, il limit impostato nella chiamata API verrà ignorato. Per un'attività avviata tramite API questo non causerà alcun prompt interattivo: l'attività verrà eseguita senza supervisione.

### Build {#build}

Questo tipo di template va usato per creare [artefatti](https://en.wikipedia.org/wiki/Artifact\_\(software\_development\)). La versione iniziale dell'artefatto può essere specificata in un parametro del template. Ogni esecuzione incrementa la versione dell'artefatto.

![](/assets/template_new_build_ipad1.png)

Semaphore non supporta gli artefatti in modo nativo, fornisce soltanto il versionamento delle attività. La creazione dell'artefatto va implementata autonomamente. Leggere l'articolo [CI/CD](../../admin-guide/cicd) per sapere come farlo.

### Deploy {#deploy}

Questo tipo di template va usato per distribuire gli artefatti sui server di destinazione. Ogni template `deploy` è associato a un template `build`.


Questo consente di distribuire sui server una versione specifica dell'artefatto.

## Opzioni del template {#template-options}

### Pianificazione {#schedule}

È possibile configurare la pianificazione delle attività specificando una pianificazione cron nelle impostazioni del template. Il formato delle espressioni cron è descritto nella [documentazione](https://pkg.go.dev/github.com/robfig/cron/v3#hdr-CRON\_Expression\_Format).


#### Eseguire un'attività quando viene aggiunto un nuovo commit al repository {#run-a-task-when-a-new-commit-is-added-to-the-repository}

È possibile usare cron per verificare periodicamente la presenza di nuovi commit nel repository e avviare un'attività al loro arrivo.

Ad esempio, il codice sorgente dell'app si trova in un repository git. È possibile aggiungerlo a **Repository** e avviare l'attività di Build per i nuovi commit.


### Tags, skip-tags e limit {#tags-skip-tags-and-limit}

I template supportano le opzioni CLI di Ansible:

- `--tags`
- `--skip-tags`
- `--limit`

Queste possono essere impostate nel template e sovrascritte al momento della creazione di un'attività. Assicurarsi che i prompt corrispondenti siano abilitati se si prevede di passare questi valori tramite API.

### Parallelismo (`--forks` / `-f`) {#parallelism---forks---f}

È possibile controllare a quanti host Ansible si connette in parallelo passando `--forks` o
`-f` negli **Argomenti CLI aggiuntivi** del template. Gli argomenti devono essere JSON valido:
usare un array di token separati:

```json
["--forks", "10"]
```

È supportata anche la forma abbreviata:

```json
["-f", "10"]
```

Quando sul template è abilitata l'opzione **Consenti la sovrascrittura degli argomenti nell'attività**, un'attività può
fornire il proprio valore di forks al momento dell'esecuzione. Ansible riceve sia gli argomenti del template sia quelli
dell'attività; l'ultimo `--forks` / `-f` sulla riga di comando prevale.

Se gli argomenti non sono JSON valido, l'attività fallisce con un errore di validazione
descrittivo prima dell'inizio dell'esecuzione.

### Autenticazione {#authentication}

L'autenticazione per gli host nel playbook avviene tramite i riferimenti utente del Key Store presenti nell'inventory. L'utente per SSH è determinato dall'utente facoltativo dell'elemento del Key Store.

### Password di vault multiple {#multiple-vault-passwords}

È possibile associare a un template più password di Vault provenienti dal Key Store. Durante l'esecuzione, Ansible tenterà la decifratura con le password fornite.

### Livello di verbosità {#verbosity-level}

È possibile regolare la verbosità di Ansible per un'attività (ad esempio `-v`, `-vvv`) dal form del template/attività per facilitare la risoluzione dei problemi.
