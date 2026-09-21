# Variáveis de survey

As variáveis de survey são campos de entrada personalizados que você pode adicionar aos templates de tarefa para coletar informações do usuário ao executar tarefas. Em vez de fixar valores nos seus playbooks ou scripts, você pode definir variáveis personalizadas que solicitam valores aos usuários em tempo de execução.

Esse recurso é útil para:
- Executar o mesmo template com parâmetros diferentes (por exemplo, valores de configuração)
- Aceitar entradas dinâmicas por chamadas de API
- Passar parâmetros personalizados em tarefas agendadas
- Acionar tarefas a partir de integrações com dados extraídos de webhooks

<a id="survey-variables-vs-prompts"></a>

## Variáveis de survey vs. Prompts

É importante entender a diferença entre variáveis de survey e prompts:

| Recurso | Variáveis de Survey | Prompts |
|---------|-----------------|---------|
| **Definição** | Campos personalizados criados por você | Opções predefinidas específicas do template |
| **Exemplos** | Nome do ambiente, número da versão, endpoint de API | Ansible: `--limit`, `--tags`<br/>Terraform: workspaces |
| **Configuração** | Adicionadas nas configurações do template com nome e tipo | Ativadas por caixas de seleção no template |
| **Passadas como** | Ansible: `--extra-vars`<br/>Terraform: `-var` | Flags de CLI integradas |

As **variáveis de survey** são campos personalizados flexíveis que você mesmo define, enquanto os **prompts** são opções integradas específicas de cada tipo de template (como as flags `--limit` ou `--tags` do Ansible).

<a id="adding-survey-variables-to-a-template"></a>

## Adicionando variáveis de survey a um template

As variáveis de survey são configuradas nas configurações do template:

1. Vá em **Templates de Tarefa** e selecione o seu template
2. Navegue até a seção **Survey Variables** nas configurações do template
3. Clique em **Add Survey Variable**
4. Configure a variável:
   - **Name**: nome da variável (usado no seu código)
   - **Title**: rótulo exibido no formulário
   - **Type**: escolha o tipo do campo
   - **Pass variable as**: variável extra (padrão) ou variável de ambiente
   - **Default value**: valor opcional pré-preenchido exibido quando o formulário da tarefa é aberto
   - **Required**: se o campo deve ser obrigatoriamente preenchido
5. Salve o template

Quando os usuários executarem uma tarefa a partir desse template, verão um formulário com as suas variáveis de survey personalizadas.

<a id="variable-types"></a>

## Tipos de variável

As variáveis de survey suportam seis tipos:

<a id="string"></a>

### String

Campo de texto para valores do tipo string.

**Casos de uso**: nomes de ambiente, nomes de branch, hostnames, caminhos de arquivo

**Exemplo**: uma variável chamada `environment` solicita que os usuários informem "production", "staging" ou "development"

<a id="integer"></a>

### Integer

Campo numérico para valores inteiros.

**Casos de uso**: números de porta, contagens de tentativas, timeouts, limites de recursos

**Exemplo**: uma variável chamada `timeout_seconds` solicita que os usuários informem "300" ou "600"

<a id="text"></a>

### Text

Área de texto de várias linhas para valores de string mais longos.

**Casos de uso**: mensagens de commit, trechos de JSON, anotações livres, configuração de várias linhas

**Exemplo**: uma variável chamada `changelog` na qual os usuários colam as notas de versão antes do deploy

<a id="enum-single-select"></a>

### Enum (seleção única)

Menu suspenso no qual o usuário escolhe exatamente uma opção de uma lista predefinida.

**Casos de uso**: tipo de ambiente, estratégia de deploy, escolhas do tipo booleano

**Exemplo**: uma variável chamada `deployment_type` com as opções: "rolling", "blue-green", "canary"

Ao criar uma variável enum, adicione cada opção com um rótulo de exibição e um valor no editor de variáveis.

<a id="select-multi-select"></a>

### Select (seleção múltipla)

Menu suspenso no qual o usuário pode escolher uma ou mais opções de uma lista predefinida. Os valores selecionados são passados como um array JSON (por exemplo, `["staging","production"]`), e não como uma única string.

**Casos de uso**: regiões de destino, feature flags, vários grupos de hosts, listas de tags

**Exemplo**: uma variável chamada `target_regions` com as opções `us-east-1`, `eu-west-1`, `ap-southeast-1`

**Restrições**:
- Os valores padrão devem ser escolhidos da lista de opções e podem incluir várias seleções
- Em templates do Bash, PowerShell e Python, faça o parse do array JSON a partir do argumento ou do valor da variável de ambiente (veja os exemplos abaixo)

<a id="secret"></a>

### Secret

Campo do tipo senha, no qual o valor fica oculto.

**Casos de uso**: chaves de API, senhas, tokens, configurações sensíveis

**Exemplo**: uma variável chamada `api_token` na qual o valor digitado aparece como pontos por segurança

<a id="default-values"></a>

## Valores padrão

Você pode definir um valor padrão opcional para a maioria dos tipos de variável. Quando um usuário abre a caixa de diálogo de execução da tarefa, os campos são pré-preenchidos com esses padrões.

- **String, integer, text, secret**: um único valor padrão
- **Enum**: uma opção da lista
- **Select**: uma ou mais opções da lista

Os valores padrão são úteis para agendamentos e integrações nos quais o mesmo template é executado repetidamente com parâmetros previsíveis. Os usuários ainda podem alterar os valores antes de iniciar uma tarefa.

<a id="pass-variable-as-target"></a>

## Pass variable as (destino)

Cada variável de survey pode ser entregue de uma de duas formas:

| Configuração | Comportamento |
|---------|----------|
| **Extra variable** (padrão) | Passada da forma específica de cada aplicação: `--extra-vars` do Ansible, `-var` do Terraform ou argumentos de CLI `name=value` para aplicações shell |
| **Environment variable** | Definida como uma variável de ambiente do processo cujo nome corresponde ao nome da variável de survey |

Use **Environment variable** quando o seu script ou ferramenta lê do ambiente em vez de flags de CLI. Para variáveis do Terraform que precisam seguir a convenção `TF_VAR_`, nomeie a variável de survey como `TF_VAR_instance_type` e defina o destino como variável de ambiente.

As variáveis com destino de ambiente **não** são duplicadas em extra-vars, `-var` ou argumentos de CLI. Cada valor é entregue exatamente uma vez.

<a id="how-survey-variables-are-passed-to-tasks"></a>

## Como as variáveis de survey são passadas às tarefas

As variáveis de survey são passadas de formas diferentes dependendo do tipo do template e da configuração **Pass variable as**.

**Os valores de seleção múltipla (tipo `select`)** são arrays codificados em JSON em todos os caminhos de entrega (JSON de extra-vars, `-var`, argumentos de CLI e variáveis de ambiente). Uma seleção das opções `1` e `2` se torna `["1","2"]`, e não uma string separada por espaços.

<a id="ansible-templates"></a>

### Templates do Ansible

As variáveis de survey são passadas como variáveis extras do Ansible usando a flag `--extra-vars`.

**Exemplo**: se você definir uma variável de survey chamada `app_version`:

```yaml
---
- hosts: webservers
  tasks:
    - name: Deploy application
      command: deploy.sh {{ app_version }}
```

Ao executar a tarefa, o usuário informa "2.5.0" no formulário de survey, e o Ansible a recebe como:

```bash
ansible-playbook playbook.yml --extra-vars "app_version=2.5.0"
```

<a id="terraformopentofu-templates"></a>

### Templates do Terraform/OpenTofu

As variáveis de survey são passadas como variáveis do Terraform usando a flag `-var`.

**Exemplo**: se você definir uma variável de survey chamada `instance_count`:

```hcl
variable "instance_count" {
  type        = number
  description = "Number of instances to create"
}

resource "aws_instance" "web" {
  count         = var.instance_count
  instance_type = "t2.micro"
  # ... other configuration
}
```

Ao executar a tarefa, o usuário informa "3" no formulário de survey, e o Terraform a recebe como:

```bash
terraform apply -var="instance_count=3"
```

<a id="shellbash-templates"></a>

### Templates Shell/Bash

As variáveis de survey são passadas ao script Bash como argumentos de linha de comando:

```bash
/bin/bash your_script.sh var1=val1 var2=val2 ... varN=valN
```

Você pode usar o código a seguir dentro do script para fazer o parse dos argumentos em um array:

```bash
declare -A args
for arg in "$@"; do
  KEY="${arg%%=*}"
  VALUE="${arg#*=}"
  args["$KEY"]="$VALUE"
done

echo "ARG1: ${args[ARG1]}"
echo "ARG2: ${args[ARG2]}"
```

Para variáveis de **seleção múltipla**, o valor é uma string com um array JSON. Faça o parse com `jq` (certifique-se de que o `jq` está disponível na imagem do seu executor):

```bash
regions_json='["us-east-1","eu-west-1"]'
regions=$(echo "$regions_json" | jq -r '.[]')
for region in $regions; do
  echo "Deploying to $region"
done
```

<a id="powershell-templates"></a>

### Templates do PowerShell

As variáveis de survey são passadas ao script PowerShell em execução como argumentos de linha de comando:

```bash
pwsh your_script.sh var1=val1 var2=val2 ... varN=valN
```

Para fazer o parse dos argumentos, use o código a seguir no script em execução:

```powershell
$parsed = @{}

foreach ($a in $args) {
    if ($a -match "^([^=]+)=(.*)$") {
        $key = $matches[1]
        $val = $matches[2]
        $parsed[$key] = $val
    }
}

Write-Host "Parsed arguments:"

write-host $parsed['env1']
write-host $parsed.env1
```

Para variáveis de **seleção múltipla**, faça o parse do array JSON a partir do valor do argumento:

```powershell
$regions = $parsed['target_regions'] | ConvertFrom-Json
foreach ($region in $regions) {
    Write-Host "Deploying to $region"
}
```

<a id="python-templates"></a>

### Templates do Python

As variáveis de survey são passadas ao script Python em execução como argumentos de linha de comando:

```bash
python3 your_script.sh var1=val1 var2=val2 ... varN=valN
```

Para fazer o parse dos argumentos, use o código a seguir no script em execução:

```python
import sys

parsed = {}

for arg in sys.argv[1:]:
    if "=" in arg:
        key, val = arg.split("=", 1)
        parsed[key] = val

print("Parsed arguments:")
print(parsed.get("env1"))
print(parsed["env1"] if "env1" in parsed else None)
```

Para variáveis de **seleção múltipla**, faça o parse do array JSON:

```python
import json

regions = json.loads(parsed["target_regions"])
for region in regions:
    print(f"Deploying to {region}")
```

<a id="using-survey-variables"></a>

## Usando variáveis de survey

<a id="manual-task-execution"></a>

### Execução manual de tarefas

Ao executar uma tarefa a partir de um template com variáveis de survey:

1. Clique em **Run** no template
2. Um formulário aparece com todas as variáveis de survey definidas
3. Preencha os valores de cada campo
4. Clique em **Run Task**

A tarefa é executada com os valores fornecidos, passados ao playbook ou script.
<!--
<a id="api-calls"></a>

### API calls

To pass survey variable values via API:

**Example API request:**

```bash
curl -XPOST \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{
    "template_id": 123,
    "environment": {
      "app_version": "2.5.0",
      "environment": "production"
    }
  }' \
  https://your-semaphore.com/api/project/1/tasks
```

Survey variable values are passed in the `environment` object of the request payload.

**Important**: The task runs unattended when triggered via API—no interactive prompt appears. -->

<a id="scheduled-tasks"></a>

### Tarefas agendadas

Os agendamentos podem incluir valores de variáveis de survey para executar o mesmo template com parâmetros diferentes em agendamentos diferentes.

**Configuração:**

1. Adicione variáveis de survey ao seu template
2. Crie um agendamento para esse template
3. Na configuração do agendamento, defina os valores das suas variáveis de survey
4. Cada execução agendada usa esses valores predefinidos

**Exemplo de caso de uso**: executar um playbook de backup com políticas de retenção diferentes:
- Agendamento diário com `retention_days=7`
- Agendamento semanal com `retention_days=30`
- Agendamento mensal com `retention_days=365`

Consulte a documentação de [Agendamentos](../../../../docs/user-guide/schedules.md) para mais detalhes.

<a id="integrations-and-webhooks"></a>

### Integrações e webhooks

As integrações podem extrair valores de webhooks recebidos e mapeá-los para variáveis de survey.

**Configuração:**

1. Adicione variáveis de survey ao seu template
2. Crie uma integração que acione esse template
3. Configure extratores de valor para obter dados do payload do webhook
4. Mapeie os valores extraídos para as suas variáveis de survey

**Exemplo**: acionar um deploy quando uma release do GitHub é criada:
- Extraia a tag da release do payload do webhook
- Mapeie-a para uma variável de survey chamada `release_version`
- O playbook de deploy recebe o número da versão

Consulte a documentação de [Integrações](../integrations.md) para mais detalhes.

<a id="best-practices"></a>

## Boas práticas

<a id="use-descriptive-names"></a>

### Use nomes descritivos

Escolha nomes claros e descritivos para as suas variáveis de survey que indiquem a sua finalidade:
- ✅ Bom: `target_environment`, `app_version`, `backup_retention_days`
- ❌ Ruim: `env`, `ver`, `days`

<a id="provide-helpful-titles"></a>

### Forneça títulos úteis

O título aparece no formulário, portanto torne-o amigável ao usuário:
- Nome da variável: `db_host`
- Título: "Hostname ou endereço IP do banco de dados"

<a id="use-enum-or-select-for-known-options"></a>

### Use enum ou select para opções conhecidas

Quando os usuários devem escolher entre um conjunto limitado de opções, use enum ou select em vez de string:
- ✅ **Enum** para exatamente uma escolha: production, staging ou development
- ✅ **Select** quando várias escolhas são válidas: várias regiões ou feature flags
- ❌ Campo string com a observação "informe production ou staging"

<a id="use-environment-variable-target-deliberately"></a>

### Use o destino de variável de ambiente de forma deliberada

Prefira a entrega padrão como variável extra, a menos que o seu playbook, script ou ferramenta leia explicitamente do ambiente do processo. Nomeie as variáveis com destino de ambiente exatamente como a ferramenta de destino espera (por exemplo, `TF_VAR_region`).

<a id="mark-required-fields-appropriately"></a>

### Marque os campos obrigatórios adequadamente

Marque os campos como obrigatórios apenas se forem realmente necessários. Considere fornecer valores padrão sensatos nos seus playbooks para os campos opcionais.

<a id="validate-in-your-code"></a>

### Valide no seu código

Não presuma que os valores das variáveis de survey são sempre válidos. Adicione lógica de validação nos seus playbooks ou scripts:

```yaml
- name: Validate environment variable
  assert:
    that:
      - environment in ['production', 'staging', 'development']
    fail_msg: "Invalid environment: {{ environment }}"
```

<a id="use-secrets-for-sensitive-data"></a>

### Use secrets para dados sensíveis

Sempre use o tipo secret para valores sensíveis, como chaves de API, senhas ou tokens. Isso garante que os valores fiquem ocultos na interface e nos logs.

<a id="combine-with-variable-groups"></a>

### Combine com Grupos de Variáveis

As variáveis de survey funcionam bem em conjunto com os [Grupos de Variáveis](../environment.md):
- Use **Grupos de Variáveis** para configurações estáticas compartilhadas entre tarefas
- Use **Variáveis de survey** para valores que mudam a cada execução de tarefa

**Exemplo**:
- Grupo de Variáveis: detalhes de conexão com o banco de dados, endpoints de API
- Variáveis de survey: ambiente de deploy, número da versão, feature flags

<a id="common-use-cases"></a>

## Casos de uso comuns

<a id="environment-specific-deployments"></a>

### Deploys específicos por ambiente

Crie variáveis de survey para:
- `environment`: enum com as opções "production, staging, development"
- `app_version`: string para a versão a ser implantada
- `enable_debug`: enum com as opções "true, false"

<a id="database-operations"></a>

### Operações de banco de dados

Crie variáveis de survey para:
- `db_name`: string para o nome do banco de dados
- `backup_retention_days`: integer para a política de retenção
- `maintenance_window`: string para a janela de manutenção

<a id="infrastructure-provisioning"></a>

### Provisionamento de infraestrutura

Crie variáveis de survey para:
- `instance_count`: integer para o número de instâncias
- `instance_type`: enum com as opções "t2.micro, t2.small, t2.medium"
- `region`: enum com as regiões da AWS

<a id="cicd-pipelines"></a>

### Pipelines de CI/CD

Crie variáveis de survey para:
- `git_branch`: string para o branch a ser compilado
- `build_type`: enum com as opções "debug, release"
- `run_tests`: enum com as opções "true, false"

<a id="differences-from-variable-groups"></a>

## Diferenças em relação aos Grupos de Variáveis

| Recurso | Variáveis de Survey | Grupos de Variáveis |
|---------|-----------------|-----------------|
| **Finalidade** | Entrada em tempo de execução por tarefa | Configuração estática reutilizável |
| **Quando são definidos** | No momento da execução da tarefa | Pré-configurados no projeto |
| **Caso de uso** | Valores que mudam a cada execução | Configurações compartilhadas entre tarefas |
| **Formato** | Campos individuais tipados | Formato JSON com objetos aninhados |
| **Escopo** | Uma única execução de tarefa | Vários templates/inventories |
| **Segurança** | O tipo secret oculta valores sensíveis | Aba Secrets para dados sensíveis |

Use variáveis de survey quando precisar de flexibilidade em tempo de execução, e Grupos de Variáveis quando quiser uma configuração consistente entre várias execuções de tarefa.
