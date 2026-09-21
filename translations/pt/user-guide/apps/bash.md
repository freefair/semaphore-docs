# Scripts Shell/Bash

O Semaphore pode executar scripts shell usando `/bin/bash`. Para isso, crie um modelo de tarefa do tipo **Bash Script**.

<a id="creating-a-bash-template"></a>

## Criando um modelo Bash

1. Vá até a seção **Modelos de Tarefa** e clique no botão **Novo Modelo**.
2. Selecione **Bash** como o tipo de app.
3. Configure o modelo:

| Campo | Descrição |
|---|---|
| **Nome** | Um nome descritivo para o modelo |
| **Repositório** | Repositório que contém o seu script shell |
| **Playbook / Script** | Caminho relativo do script, por exemplo `scripts/deploy.sh` |
| **Grupos de Variáveis** | Grupos de variáveis cujos valores são injetados como variáveis de ambiente |

4. Clique em **Criar**.
5. Clique em **Executar** para executar o modelo. A caixa de diálogo Nova Tarefa de um modelo de script tem apenas a mensagem opcional, além das variáveis de survey e dos prompts, caso o modelo os defina.

![Caixa de diálogo Nova Tarefa de um modelo Bash](../../../../static/assets/task-new-bash.webp)

<a id="passing-variables-to-scripts"></a>

## Passando variáveis para os scripts

As variáveis dos **Grupos de Variáveis** selecionados são injetadas como variáveis de ambiente. Acesse-as no script com `$VARIABLE_NAME`:

```bash
#!/bin/bash
echo "Deploying to $TARGET_HOST"
```

<a id="notes"></a>

## Observações

- Torne o seu script executável (`chmod +x`) ou garanta que ele comece com um shebang válido (`#!/bin/bash`).
- Os scripts são executados de forma não interativa. Evite prompts que aguardem entrada do usuário.
- O código de saída `0` significa sucesso; qualquer código de saída diferente de zero marca a tarefa como falha.
- Se um script muito curto não produzir saída de log, consulte [A saída do script Bash está ausente ou incompleta](../../../../docs/faq/troubleshooting.md#bash-script-output-is-missing-or-incomplete) no guia de solução de problemas.
- Para executar comandos em hosts remotos, use o [Ansible](ansible.md).
