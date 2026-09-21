# Primeiros passos

O Semaphore UI oferece uma interface web e uma API para executar automações repetíveis com Ansible, Terraform/OpenTofu, Bash, PowerShell e Python. Ele reúne automações armazenadas no Git, credenciais, variáveis, agendamentos, workflows e ambientes de execução, preservando o status e o log de cada execução.

Este guia usa Ansible no primeiro exemplo prático. Use um playbook do seu repositório ou reproduza o exemplo das capturas de tela com o repositório público [`semaphoreui/semaphore-demo`](https://github.com/semaphoreui/semaphore-demo).

  [Video walkthrough](https://www.youtube-nocookie.com/embed/LVKwud2Wno4)

## 1. Instale o Semaphore

Escolha o método de instalação conforme o ambiente em que o Semaphore será executado. O pacote nativo está selecionado por padrão.

### Pacote nativo

Para Debian ou Ubuntu em `amd64`:

```bash
wget https://github.com/semaphoreui/semaphore/releases/download/v2.19.12/semaphore_2.19.12_linux_amd64.deb
sudo apt install ./semaphore_2.19.12_linux_amd64.deb
```

Para RHEL, Fedora, Rocky Linux, AlmaLinux ou CentOS Stream em `amd64`:

```bash
curl -LO https://github.com/semaphoreui/semaphore/releases/download/v2.19.12/semaphore_2.19.12_linux_amd64.rpm
sudo dnf install ./semaphore_2.19.12_linux_amd64.rpm
```

Configure o banco de dados e o primeiro administrador, depois inicie o Semaphore com a configuração gerada:

```bash
semaphore setup --config ./config.json
semaphore server --config ./config.json
```

Para uma avaliação local, escolha SQLite, aceite ou defina os caminhos do banco de dados e dos playbooks, informe a URL pública e crie o primeiro administrador quando solicitado.

### Docker Compose

Crie `compose.yaml`:

```yaml
services:
  semaphore:
    image: ghcr.io/freefair/semaphore-ex:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - semaphore-data:/var/lib/semaphore
    environment:
      SEMAPHORE_DB_DIALECT: sqlite
      SEMAPHORE_DB_PATH: /var/lib/semaphore
      SEMAPHORE_ADMIN: admin
      SEMAPHORE_ADMIN_NAME: Admin
      SEMAPHORE_ADMIN_EMAIL: admin@localhost
      SEMAPHORE_ADMIN_PASSWORD: ${SEMAPHORE_ADMIN_PASSWORD}
      SEMAPHORE_ACCESS_KEY_ENCRYPTION: ${SEMAPHORE_ACCESS_KEY_ENCRYPTION}

volumes:
  semaphore-data:
```

Gere uma chave de criptografia e coloque-a, junto com uma senha forte de administrador, em um arquivo `.env` ao lado de `compose.yaml`:

```bash
head -c32 /dev/urandom | base64
```

```dotenv
SEMAPHORE_ADMIN_PASSWORD=replace-with-a-long-password
SEMAPHORE_ACCESS_KEY_ENCRYPTION=paste-the-generated-key-here
```

Mantenha `.env` fora do controle de versão e inicie o contêiner:

```bash
docker compose up -d
docker compose logs -f semaphore
```

### Arquivo binário

Baixe o arquivo correspondente ao seu sistema operacional e à arquitetura da CPU em [GitHub Releases](https://github.com/semaphoreui/semaphore/releases). Exemplo para Linux `amd64`:

```bash
curl -LO https://github.com/semaphoreui/semaphore/releases/download/v2.19.12/semaphore_2.19.12_linux_amd64.tar.gz
tar -xzf semaphore_2.19.12_linux_amd64.tar.gz
./semaphore setup --config ./config.json
./semaphore server --config ./config.json
```

Para uma avaliação local, escolha SQLite, aceite ou defina os caminhos do banco de dados e dos playbooks, informe a URL pública e crie o primeiro administrador quando solicitado.

Escolha um arquivo `darwin` para macOS ou um `.zip` para Windows. O tutorial Ansible apresentado adiante ainda exige um ambiente Linux, macOS, WSL, um contêiner ou um runner Linux com Ansible instalado.

### Kubernetes com Helm

Adicione o chart oficial e examine os valores padrão antes da instalação:

```bash
helm repo add semaphoreui https://semaphoreui.github.io/charts
helm repo update
helm show chart semaphoreui/semaphore
helm show values semaphoreui/semaphore > values.yaml

helm upgrade --install semaphore semaphoreui/semaphore \
  --namespace semaphore \
  --create-namespace \
  --values values.yaml
```

O campo `appVersion` do chart identifica a versão do Semaphore. Antes do uso em produção, configure em `values.yaml` o armazenamento persistente, o banco de dados, as credenciais de administrador, a chave de criptografia das chaves de acesso e ingress/TLS.

Para uma configuração guiada, use a [página oficial de instalação do Semaphore](../../../docs/admin-guide/configuration/config-file.md) para selecionar a versão, gerar a configuração e obter os comandos de download ou execução correspondentes.

<details>
<summary>Não sabe qual método de instalação escolher?</summary>

| Método de instalação | Quando escolher | Guia detalhado |
| --- | --- | --- |
| **Pacote nativo** | Um servidor Linux compatível | [Instalação pelo gerenciador de pacotes](../../../docs/admin-guide/installation/package-manager.md) |
| **Docker Compose** | Uma configuração isolada rápida ou um host de contêineres | [Instalação com Docker](../../../docs/admin-guide/installation/docker.md) |
| **Arquivo binário** | macOS, Windows, FreeBSD ou Linux sem um pacote adequado | [Instalação do binário](../../../docs/admin-guide/installation/binary-file.md) |
| **Kubernetes com Helm** | Um cluster Kubernetes existente | [Instalação no Kubernetes](../../../docs/admin-guide/installation/k8s.md) |

Os guias detalhados cobrem bancos de dados de produção, serviços, segredos, armazenamento, ingress e atualizações.

</details>

Para este tutorial Ansible, `git --version` e `ansible-playbook --version` devem funcionar no servidor Semaphore ou no runner. Se algum comando estiver indisponível, instale [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) e [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) antes de continuar.

> **Instalação em produção**
>
> Antes de usar o Semaphore em produção, consulte [Configuração](../../../docs/admin-guide/configuration.md), [Segurança](../../../docs/admin-guide/security.md), [Runners](../../../docs/admin-guide/runners.md), [Alta disponibilidade](../../../docs/admin-guide/ha.md) e [Atualização](../../../docs/admin-guide/upgrading.md).

## 2. Entre no sistema

1. Abra o Semaphore no navegador. Uma instalação local normalmente usa [http://localhost:3000](http://localhost:3000).
2. Informe o login e a senha de administrador definidos por `semaphore setup` ou pelas variáveis de administrador do Docker.
3. Selecione **Sign In**.

![Tela de login do Semaphore](../../../static/assets/getting-started/sign-in.jpg)

Use a conta de administrador na configuração inicial, pois ela pode criar projetos e usuários. Usuários comuns entram pela mesma página depois que um administrador cria suas contas e concede acesso ao projeto. Consulte [Gerenciamento de usuários](../../../docs/user-guide/admin/users.md).

## 3. Crie um projeto

Depois de entrar em uma instância vazia do Semaphore, a página **New Project** abre automaticamente. Se já houver projetos, abra o seletor de projetos e escolha **New Project...**. Preencha o formulário:

| Campo | O que informar |
| --- | --- |
| **Project Name** | Um nome reconhecível para o espaço de trabalho, por exemplo `Production infrastructure` ou o nome da sua aplicação. |
| **Max number of parallel tasks** | Opcional. Limita tarefas simultâneas neste projeto; deixe vazio para usar o limite do servidor. |
| **Telegram Chat ID** | Opcional. Usado quando há notificações do Telegram configuradas para o projeto. |
| **Allow alerts for this project** | Opcional. Ativa as notificações configuradas do projeto. |
Selecione **Create**.

Não selecione **Create Demo Project**: essa opção adiciona recursos de exemplo, enquanto este guia cria um projeto vazio. Ao criar outros projetos depois, a mesma opção aparece como o interruptor **Demo** na caixa de diálogo New Project.

![Formulário New Project vazio com todos os campos disponíveis](../../../static/assets/getting-started/new-project-empty.jpg)

O novo projeto contém as seções **Task Templates**, **Workflows**, **Schedule**, **Inventory**, **Variable Groups**, **Key Store** e **Repositories**. Consulte [Projetos](../../../docs/user-guide/projects.md) para configurações do projeto, acesso da equipe, atividade e histórico.

<details>
<summary>Veja esta etapa</summary>

![Criação do primeiro projeto em uma instância vazia do Semaphore](../../../static/assets/getting-started/create-first-project.gif)

</details>

## 4. Entenda os conceitos fundamentais

O novo projeto abre em um Dashboard vazio. A barra lateral é a navegação principal do projeto:

![Interface de um projeto Semaphore vazio antes de adicionar recursos e tarefas](../../../static/assets/getting-started/after-sign-in.jpg)

- **Dashboard** mostra histórico de execuções, estatísticas, atividade e configurações do projeto.
- **Task Templates**, **Workflows** e **Schedule** definem o que será executado e quando.
- **Repositories**, **Inventory**, **Variable Groups** e **Key Store** fornecem código, destinos, variáveis e credenciais.
- **Integrations**, **Team** e **Runners** conectam sistemas externos, usuários e hosts de execução.

O diagrama mostra como esses recursos produzem uma execução:

  ![Como recursos e gatilhos do Semaphore geram uma execução de tarefa](../../../static/assets/getting-started/core-concepts.svg)

Uma ação na interface, uma solicitação API ou um agendamento pode iniciar diretamente um **Task Template** ou um **Workflow** que usa modelos de tarefas. O Semaphore cria uma execução, exibida como **Task** na interface, e a envia ao servidor Semaphore ou a um runner remoto elegível. Para Ansible, esse host executa `ansible-playbook`; o Inventory lista os sistemas gerenciados pelo Ansible.

| Conceito | Função |
| --- | --- |
| [**Project**](../../../docs/user-guide/projects.md) | Um espaço de trabalho isolado com recursos de automação, permissões e histórico de execuções. |
| [**Repository**](../../../docs/user-guide/repositories.md) | Aponta para a branch ou tag Git que contém os arquivos de automação usados por uma tarefa. |
| [**Key Store**](../../../docs/user-guide/key-store.md) | Armazena chaves SSH, credenciais, tokens e senhas do Ansible Vault reutilizáveis fora do Git e das entradas das tarefas. |
| [**Inventory**](../../../docs/user-guide/inventory.md) | Informa ao Ansible quais hosts e grupos gerenciar e quais credenciais usar. |
| [**Variable Group**](../../../docs/user-guide/environment.md) | Armazena variáveis Ansible, variáveis de ambiente e segredos reutilizáveis para um ou mais modelos. |
| [**Task Template**](../../../docs/user-guide/task-templates/README.md) | Salva o que executar: tipo de automação, arquivo, repositório, inventário, variáveis, parâmetros solicitados e opções de execução. |
| [**Task (task run)**](../../../docs/user-guide/tasks.md) | Uma execução com suas próprias entradas, status, marcas de tempo, log, detalhes e resultado. |
| **Workflow** | Conecta modelos de tarefas em um fluxo de várias etapas com ramificações de sucesso, falha, aprovação e notas. |
| [**Schedule**](../../../docs/user-guide/schedules.md) | Inicia um modelo de tarefa ou workflow uma vez ou repetidamente por uma expressão cron. |
| [**Runner**](../../../docs/admin-guide/runners.md) | Executa tarefas da fila fora do servidor Semaphore principal, por exemplo em outra rede ou zona de segurança. |

## 5. Conecte o repositório

Um Repository conecta o Semaphore à automação armazenada no Git; o Semaphore não armazena o playbook em si. Conecte seu repositório ou use os valores da demonstração pública abaixo para reproduzir exatamente o exemplo. As [Integrações](../../../docs/user-guide/integrations.md) são uma função separada para iniciar automações a partir do GitHub, GitLab ou de outras fontes de webhook.

1. Abra **Repositories** e selecione **New Repository**.
2. Informe nome, URL, branch e credenciais do repositório. Para a demonstração pública, use:

   | Campo | Valor |
   | --- | --- |
   | **Name** | `Demo` |
   | **URL or path** | `https://github.com/semaphoreui/semaphore-demo.git` |
   | **Branch / Tag** | `main` |
   | **Access Key** | `None`, pois este repositório é público |

3. Selecione **Create**.

![Formulário de repositório preenchido com o repositório público de demonstração do Semaphore](../../../static/assets/getting-started/repository-settings.jpg)

O repositório deve aparecer na lista. O Semaphore o clona ou atualiza no host de execução quando uma tarefa começa, não quando você cria o registro Repository. A captura mostra os valores de demonstração deste guia.

![Repositório Demo conectado na lista de repositórios do projeto](../../../static/assets/getting-started/connected-repository.jpg)

Para um repositório privado, selecione credenciais adequadas do Key Store em vez de `None`. Consulte [Repositórios](../../../docs/user-guide/repositories.md) para caminhos locais, HTTPS, SSH, branches, credenciais e arquivos de dependências.

## 6. Adicione uma chave SSH para um host remoto gerenciado

Essas credenciais SSH permitem que o Ansible se conecte do servidor Semaphore ou do runner a um host remoto no Inventory. Se você segue a demonstração `localhost`, não precisa de uma chave SSH; continue na etapa 7.

A demonstração usa `localhost` com `ansible_connection=local`, portanto não abre uma conexão SSH. Quando seu playbook gerenciar um host remoto, adicione a chave dele:

1. Adicione a parte pública da chave a `~/.ssh/authorized_keys` no host gerenciado.
2. Abra **Key Store** e selecione **New Key**.
3. Informe um nome reconhecível, por exemplo `Production hosts`, mantenha **Local** selecionado e escolha **SSH Key**.
4. Informe a conta que o Ansible deve usar no host, por exemplo `ubuntu` ou `ec2-user`.
5. Cole a chave privada completa, incluindo as linhas `BEGIN` e `END`, e adicione a frase secreta quando necessário.
6. Selecione **Create**. Na próxima etapa, escolha essa chave em **Inventory → User Credentials**.

![Formulário New SSH Key para a conta usada nos hosts gerenciados](../../../static/assets/getting-started/add-managed-host-ssh-key.jpg)

A captura contém um valor ilustrativo, não um segredo válido. Nunca publique uma chave privada na documentação, em capturas, argumentos de tarefas ou no controle de versão.

O Semaphore pode armazenar segredos localmente ou integrar armazenamentos externos como [HashiCorp Vault](../../../docs/user-guide/key-store/hashicorp-vault.md) e [Devolutions Server](../../../docs/user-guide/key-store/devolutions-server.md). Consulte [Armazenamento de chaves](../../../docs/user-guide/key-store.md) para todos os tipos de credenciais e opções de armazenamento compatíveis.

## 7. Crie o inventário Ansible

Toda tarefa Ansible precisa de um inventário. Para a primeira execução local, adicione ao repositório um arquivo como `inventory.ini`:

```ini
[local]
localhost ansible_connection=local
```

Aqui, `localhost` significa o host de execução, ou seja, o servidor Semaphore, o contêiner ou o runner, não necessariamente o computador com o navegador aberto. `ansible_connection=local` instrui o Ansible a não usar SSH. O repositório de demonstração usa o arquivo equivalente `invs/prod/hosts` com um grupo chamado `site`.

Se você criou `inventory.ini` no seu repositório, faça commit e push para a branch conectada ao Semaphore antes de continuar.

1. Abra **Inventory** e selecione **New Inventory → Ansible Inventory**.
2. Informe valores correspondentes ao seu inventário. Por exemplo:

   | Campo | Valor |
   | --- | --- |
   | **Name** | `Local` (`Prod` na demonstração) |
   | **User Credentials** | `None` para `localhost`; use as credenciais SSH do host para um inventário remoto |
   | **Type** | `File` |
   | **Path to Inventory file** | `inventory.ini` (`invs/prod/hosts` na demonstração) |

3. Deixe **Runner tag**, **Sudo Credentials** e **Repository** vazios e selecione **Create**.

![Inventário Ansible baseado em arquivo com os valores do repositório de demonstração](../../../static/assets/getting-started/ansible-inventory-settings.jpg)

Deixar **Repository** vazio faz o Semaphore resolver o caminho relativo do inventário a partir do repositório escolhido no modelo de tarefa. Selecione um repositório aqui apenas quando o inventário estiver em outro lugar. Para um host remoto, use a chave SSH da etapa 6 como **User Credentials**.

Consulte [Inventário](../../../docs/user-guide/inventory.md) para inventários estáticos, baseados em arquivos e dinâmicos.

## 8. Adicione um grupo de variáveis (opcional)

Um **Variable Group** é um conjunto reutilizável de valores que pode ser associado a um ou mais modelos de tarefas. Use **Extra variables** para variáveis Ansible, **Environment variables** para valores exportados ao processo e **Secrets** para valores sensíveis que devem ser criptografados e mascarados. Isso mantém a configuração específica do ambiente fora do playbook e evita repetir os mesmos valores em cada modelo.

A primeira tarefa funciona sem um grupo de variáveis. Como exemplo, crie um que defina `ansible_python_interpreter=auto_silent`; o Ansible continuará detectando Python automaticamente, mas não exibirá o aviso informativo de descoberta.

1. Abra **Variable Groups** e selecione **New Group**.
2. Defina **Group Name** com um nome descritivo, por exemplo `Ansible defaults`.
3. Em **Variables → Extra variables**, mantenha **Table** selecionado e escolha **+**.
4. Informe:

   | Nome | Tipo | Valor |
   | --- | --- | --- |
   | `ansible_python_interpreter` | `String` | `auto_silent` |

5. Selecione **Save**.

![Grupo de variáveis configurado no editor de tabela](../../../static/assets/getting-started/variable-group-table.jpg)

Consulte [Grupos de variáveis](../../../docs/user-guide/environment.md) para regras de precedência e opções de armazenamento de segredos.

## 9. Crie o modelo de tarefa Ansible

### Revise o playbook no Git

Se o repositório conectado já contém um playbook Ansible, use-o. Caso contrário, adicione um pequeno exemplo como `get-started.yml`:

```yaml
- name: Verify Semaphore setup
  hosts: all
  gather_facts: false
  tasks:
    - name: Check the Ansible connection
      ansible.builtin.ping:
```

Se você segue a demonstração, use o [`ping.yml`](https://github.com/semaphoreui/semaphore-demo/blob/main/ping.yml) dela. Ele usa o grupo `site` do inventário de demonstração e executa a role `ping` incluída.

A demonstração baixa essa role de um submódulo Git e envia uma solicitação ICMP a the demo's configured public target, portanto o host de execução precisa acessar o GitHub e permitir ICMP de saída. Se ICMP estiver bloqueado, use o exemplo local `get-started.yml`.

![ping.yml no repositório GitHub conectado](../../../static/assets/getting-started/demo-playbook-github.jpg)

A captura mostra o playbook no repositório público de demonstração. Manter a automação no Git permite revisar alterações e faz o Semaphore registrar o commit exato usado em cada execução.

Se você criou `get-started.yml` no seu repositório, faça commit e push para a branch conectada ao Semaphore antes de continuar.

### Configure o modelo

1. Abra **Task Templates** e selecione **New template → Applications**.
2. Ative **Ansible Playbook**, depois volte a **Task Templates**.
3. Selecione **New template → Ansible Playbook**.
4. Mantenha a aba **Task** selecionada. **Build** e **Deploy** são tipos de modelos CI/CD com versões e não são necessários nesta execução independente.
5. Configure o modelo com valores correspondentes aos seus arquivos. Por exemplo:

   | Campo | Valor | Importância |
   | --- | --- | --- |
   | **Name** | `Run first playbook` | Identifica o modelo reutilizável e seu histórico de tarefas. |
   | **Repository** | Seu repositório (`Demo` no exemplo) | Fornece o playbook e os arquivos relacionados. |
   | **Path to playbook file** | `get-started.yml` (`ping.yml` na demonstração) | Resolvido a partir da raiz do repositório. |
   | **Inventory** | `Local` (`Prod` na demonstração) | Fornece o destino local para a primeira execução. |
   | **Variable Groups** | `Ansible defaults`, se criado | Adiciona a configuração Ansible reutilizável opcional. |
   | **Runner tag** | Deixe vazio | Usa execução local ou o runner padrão, conforme a configuração do servidor. |

6. Em **Ansible options**, ative **Skip Galaxy install** para o pequeno playbook acima ou a demonstração pública: nenhum precisa de dependências Galaxy nesta tarefa. Deixe a opção desativada se o seu repositório exigir roles ou collections de um arquivo `requirements.yml`.
7. Selecione **Create**.

![Modelo de tarefa Ansible com repositório, inventário e grupo de variáveis](../../../static/assets/getting-started/ansible-task-template-settings.jpg)

<details>
<summary>Veja esta etapa</summary>

![Ativação do Ansible e criação do primeiro modelo de tarefa Ansible](../../../static/assets/getting-started/create-ansible-template.gif)

</details>

Outros campos úteis:

- **Vaults** seleciona senhas do Key Store para conteúdo Ansible criptografado.
- **Limit**, **Tags** e **Skip tags** restringem o que o playbook executa.
- **Prompts** permitem que um usuário, agendamento ou solicitação API substitua valores habilitados em uma execução específica.
- **Runner tag** controla onde a tarefa é executada; não seleciona um destino Ansible.

Consulte [Modelos Ansible](../../../docs/user-guide/apps/ansible.md) e [Modelos de tarefas](../../../docs/user-guide/task-templates/README.md) para todos os campos e opções de execução.

## 10. Execute o modelo e inspecione a tarefa

1. Abra o modelo de tarefa criado e selecione **Run**.
2. Adicione uma mensagem opcional, como `First Semaphore run`.
3. Deixe **Dry Run** e **Diff** desativados e selecione **Run**.

![Caixa de diálogo New Task sem opções adicionais para o playbook Ansible](../../../static/assets/getting-started/run-ansible-task-clean.jpg)

O Semaphore coloca a tarefa na fila, prepara o repositório, aplica o inventário e o grupo de variáveis opcional e executa o playbook selecionado. O status passa por **Waiting** e **Running** antes de terminar como **Success** ou **Failed**.

### Log

**Log** contém a saída real dos comandos. Leia o `PLAY RECAP` final, não apenas o indicador verde de status.

![Log de tarefa Ansible bem-sucedida com saída de ping e PLAY RECAP](../../../static/assets/getting-started/ansible-task-log-variable-group.jpg)

Os contadores exatos dependem do playbook. Uma primeira execução bem-sucedida deve terminar com `unreachable=0` e `failed=0` para `localhost`. Se o log da demonstração mostrar `changed=1`, a etapa de ping via shell foi executada e relatou uma alteração; não é um erro.

### Detalhes e resumo

| Aba | O que verificar |
| --- | --- |
| **Log** | Fases da execução em tempo real, saída dos módulos, erros e `PLAY RECAP` final. |
| **Details** | Tipo de modelo, commit Git, mensagem da execução, autor, marcas de tempo e duração. |
| **Summary** | Resultados e erros Ansible por host após a conclusão, quando o resumo de tarefas está disponível. |

![Detalhes da tarefa com modelo, commit e informações de tempo](../../../static/assets/getting-started/ansible-task-details.jpg)

![Resumo da tarefa com contagens de hosts OK e Not OK](../../../static/assets/getting-started/ansible-task-summary.jpg)

Se **Summary** não estiver disponível, verifique a execução em **Log**; `PLAY RECAP` continua sendo o resultado Ansible de referência.

<details>
<summary>Veja a execução e o resultado</summary>

![Execução da tarefa Ansible e inspeção do log e dos detalhes](../../../static/assets/getting-started/run-and-inspect-task.gif)

</details>

### Encontre execuções anteriores

Feche a janela da tarefa para voltar à aba **Tasks** do modelo. Cada execução tem número de tarefa, status, usuário, horário de início, duração e log preservado próprios. **Dashboard → History** mostra execuções de todos os modelos do projeto. Consulte [Tarefas](../../../docs/user-guide/tasks.md) e [Histórico do projeto](../../../docs/user-guide/projects/history.md) para mais detalhes.

![Histórico de um modelo Ansible com execuções bem-sucedidas](../../../static/assets/getting-started/ansible-template-history.jpg)

Se a tarefa falhar, use a última linha significativa do log para escolher a próxima verificação:

- Um erro de clonagem aponta para a URL do repositório, a branch, a Access Key ou o acesso de rede a partir do host de execução.
- `ansible-playbook: command not found` significa que falta Ansible no servidor Semaphore ou no runner selecionado.
- `UNREACHABLE` aponta para endereçamento do inventário, credenciais do host, conectividade SSH ou verificação da chave do host.
- Uma etapa Ansible com falha normalmente mostra o nome da tarefa, o host e o erro do módulo logo acima de `PLAY RECAP`.

## 11. Execute a tarefa por agendamento

Após uma execução bem-sucedida pela interface, você pode executar a tarefa automaticamente. Por exemplo, a expressão cron `0 3 * * *` a inicia diariamente às 03:00 no fuso horário mostrado pelo Semaphore.

1. Abra **Schedule** e selecione **New Schedule → Cron**.
2. Informe um nome descritivo, por exemplo `Nightly playbook`.
3. Selecione o modelo de tarefa que deseja executar.
4. Mantenha **Show cron format** ativado e informe uma expressão cron, por exemplo `0 3 * * *`.
5. Mantenha **Enabled** selecionado e escolha **Save**.

![Agendamento cron para executar a tarefa de exemplo diariamente às 03:00](../../../static/assets/getting-started/create-cron-schedule.jpg)

O Semaphore mostra o fuso horário configurado e calcula a próxima execução antes de salvar. Uma execução agendada usa os mesmos repositório, inventário, grupos de variáveis e configurações de execução do modelo. Se o modelo expõe parâmetros solicitados, o agendamento pode fornecer seus valores. Consulte [Agendamentos](../../../docs/user-guide/schedules.md) para sintaxe cron, configuração de fuso horário, execuções únicas e parâmetros agendados.

Depois de salvar, verifique se o agendamento está **Enabled** e se **Next run** mostra o horário esperado. Tarefas agendadas aparecem na aba **Tasks** do modelo e em **Dashboard → History**.

## O que experimentar depois

Quando a primeira tarefa Ansible terminar com sucesso:

- Adicione credenciais privadas adequadas no [Armazenamento de chaves](../../../docs/user-guide/key-store.md) se o repositório exigir autenticação.
- Crie um **Workflow** quando vários modelos precisarem de caminhos ordenados de sucesso, falha, aprovação ou notas.
- Use [Integrações](../../../docs/user-guide/integrations.md) para gatilhos webhook autenticados do GitHub, GitLab ou de outros sistemas.
- Use a [API](../../../docs/reference/api.md) para gerenciar recursos e iniciar modelos programaticamente.
- Adicione um [runner remoto](../../../docs/admin-guide/runners.md) se a execução precisar ocorrer em outra rede, sistema operacional ou zona de segurança.

Para produção, exponha o Semaphore por HTTPS, faça backup conjunto do banco de dados e do segredo de criptografia das chaves de acesso, configure autenticação centralizada e consulte [Segurança](../../../docs/admin-guide/security.md), [Logs](../../../docs/admin-guide/logs.md) e [Atualização](../../../docs/admin-guide/upgrading.md).
