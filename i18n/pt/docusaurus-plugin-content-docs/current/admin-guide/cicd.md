# Pipelines

O Semaphore oferece suporte a pipelines simples usando tarefas do tipo `build` e `deploy`. 

O Semaphore passa a variável `semaphore_vars` para cada playbook Ansible que ele executa.

Você pode usá-la nas suas tarefas Ansible para saber que tipo de tarefa foi executada, qual versão deve ser compilada ou implantada, quem executou a tarefa etc.

---

Exemplo de `semaphore_vars` para tarefas `build`:

```yaml
semaphore_vars:
    task_details:
        type: build
        username: user123
        message: New version of some feature
        target_version: 1.5.33
```

Exemplo de `semaphore_vars` para tarefas `deploy`:

```yaml
semaphore_vars:
    task_details:
        type: deploy
        username: user123
        message: Deploy new feature to servers
        incoming_version: 1.5.33
```

Para modelos **Bash**, **PowerShell** e **Python**, o Semaphore fornece os mesmos valores de `task_details` como variáveis de ambiente:

| Campo de `task_details` | Variável de ambiente | Observações |
| --- | --- | --- |
| `type` | `SEMAPHORE_TASK_DETAILS_TYPE` | `build` ou `deploy` |
| `username` | `SEMAPHORE_TASK_DETAILS_USERNAME` | Usuário que iniciou a tarefa |
| `message` | `SEMAPHORE_TASK_DETAILS_MESSAGE` | Mensagem da tarefa |
| `target_version` | `SEMAPHORE_TASK_DETAILS_TARGET_VERSION` | Presente em tarefas `build` |
| `incoming_version` | `SEMAPHORE_TASK_DETAILS_INCOMING_VERSION` | Presente em tarefas `deploy` |

Exemplo para Bash:

```bash
echo "$SEMAPHORE_TASK_DETAILS_TYPE"
echo "$SEMAPHORE_TASK_DETAILS_TARGET_VERSION"
```

Exemplo para PowerShell:

```powershell
$env:SEMAPHORE_TASK_DETAILS_TYPE
$env:SEMAPHORE_TASK_DETAILS_INCOMING_VERSION
```

Exemplo para Python:

```python
import os

task_type = os.getenv("SEMAPHORE_TASK_DETAILS_TYPE")
target_version = os.getenv("SEMAPHORE_TASK_DETAILS_TARGET_VERSION")
incoming_version = os.getenv("SEMAPHORE_TASK_DETAILS_INCOMING_VERSION")
```

### Build {#build}

Esse tipo de tarefa é usado para criar [artefatos](https://en.wikipedia.org/wiki/Artifact\_\(software\_development\)). Cada tarefa de build tem uma versão gerada automaticamente. Você deve usar a variável `semaphore_vars.task_details.target_version` no seu playbook Ansible para saber qual versão do artefato deve ser criada. Depois que o artefato é criado, ele pode ser usado para a implantação.

---

Exemplo de role Ansible de `build`:

1. Obter o código-fonte do aplicativo no GitHub
2. Compilar o código-fonte
3. Empacotar o binário gerado em um tarball com o nome `app-{{semaphore_vars.task_details.target_version}}.tar.gz`
4. Enviar `app-{{semaphore_vars.task_details.target_version}}.tar.gz` para um bucket S3



### Deploy {#deploy}

Esse tipo de tarefa é usado para implantar artefatos nos servidores de destino. Cada tarefa de implantação está associada a uma tarefa de build. Você deve usar a variável `semaphore_vars.task_details.incoming_version` no seu playbook Ansible para saber qual versão do artefato deve ser implantada.

---

Exemplo de role Ansible de `deploy`:

1. Baixar `app-{{semaphore_vars.task_details.incoming_version}}.tar.gz` de um bucket S3 para os servidores de destino
2. Descompactar `app-{{semaphore_vars.task_details.incoming_version}}.tar.gz` no diretório de destino
3. Criar ou atualizar os arquivos de configuração
4. Reiniciar o serviço do aplicativo

