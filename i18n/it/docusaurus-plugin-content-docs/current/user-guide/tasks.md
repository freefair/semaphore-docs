# Task

Un task è un'istanza di esecuzione di un playbook Ansible. È possibile creare il task da un [Task Template](task-templates/) facendo clic sul pulsante Run/Build/Deploy del template desiderato.

![](/assets/image6.png)

Il tipo di task **Deploy** consente di specificare la versione della build associata al task. Per impostazione predefinita è l'ultima versione della build.

![](/assets/task_deploy1.png)

Mentre il task è in esecuzione, o una volta terminato, è possibile vedere lo stato del task e il log di esecuzione.

![](/assets/image7.png)

### Visualizzazione del log grezzo {#raw-log-view}

È possibile aprire il log grezzo non elaborato del task dalla finestra del log tramite l'azione RAW LOG.

## Conservazione dei log dei task {#tasks-log-retention}
Si noterà che i log delle esecuzioni precedenti dei task sono disponibili nel task template o nella dashboard.

Tuttavia, per impostazione predefinita, la conservazione dei log è illimitata.

È possibile configurarla tramite il parametro `max_tasks_per_template` in `config.json` o la variabile d'ambiente `SEMAPHORE_MAX_TASKS_PER_TEMPLATE`.

