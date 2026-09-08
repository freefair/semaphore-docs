# Tarefas

Uma tarefa é uma instância da execução de um playbook do Ansible. Você pode criar a tarefa a partir de um [Template de Tarefa](task-templates/) clicando no botão Run/Build/Deploy do template desejado.

![](/assets/image6.png)

O tipo de tarefa **Deploy** permite especificar a versão do build associada à tarefa. Por padrão, é a versão mais recente do build.

![](/assets/task_deploy1.png)

Enquanto a tarefa está em execução, ou depois que ela termina, você pode ver o status da tarefa e o log de execução.

![](/assets/image7.png)

### Visualização do log bruto {#raw-log-view}

Você pode abrir o log bruto, sem processamento, da tarefa a partir da janela de log da tarefa por meio da ação RAW LOG.

## Retenção de logs das tarefas {#tasks-log-retention}
Você notará que os logs das execuções anteriores das suas tarefas ficam disponíveis no template de tarefa ou no painel.

No entanto, por padrão, a retenção de logs é infinita.

Você pode configurar isso usando o parâmetro `max_tasks_per_template` no `config.json` ou a variável de ambiente `SEMAPHORE_MAX_TASKS_PER_TEMPLATE`.
