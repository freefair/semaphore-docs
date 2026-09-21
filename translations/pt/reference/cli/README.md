# CLI

O binário `semaphore` é ao mesmo tempo o servidor e uma ferramenta completa de administração. Execute-o
sem argumentos (ou `semaphore help`) para listar todos os comandos:

```bash
semaphore help
```

Para a lista exaustiva e gerada de todos os comandos e opções, consulte a
[referência de comandos](../../../../docs/reference/cli/commands.md). A maioria das tarefas
administrativas tem um grupo de comandos dedicado:

| Grupo de comandos | Finalidade |
|---------------|---------|
| [`semaphore users`](../../../../docs/reference/cli/users.md) | Adicionar, alterar, remover e inspecionar usuários; gerenciar tokens de API e TOTP (2FA). |
| [`semaphore projects`](../../../../docs/reference/cli/projects.md) | Exportar e importar projetos (backups). |
| [`semaphore vaults`](../../../../docs/reference/cli/vaults.md) | Recriptografar segredos armazenados e inspecionar o uso das chaves de criptografia. |
| [`semaphore runner`](../../../../docs/reference/cli/runners.md) | Executar em modo runner e registrar/cancelar o registro de runners. |
| [`semaphore migrate`](../../../../docs/reference/cli/migrations.md) | Aplicar ou reverter migrações do banco de dados. |

Vários grupos de comandos têm aliases mais curtos: `users`/`user`, `projects`/`project`,
`vaults`/`vault` e `server`/`service`.

> **Info**
>
> Todo comando que acessa o banco de dados (`users`, `projects`, `vaults`, `migrate`,
> `server`) aplica as migrações de esquema pendentes antes de ser executado. Faça um backup
> do banco de dados antes de executar a CLI de uma versão mais recente do Semaphore em um
> banco de dados existente.

<a id="global-options"></a>

## Opções globais

Estas flags são aceitas por todos os comandos:

| Opção | Descrição |
|--------|-------------|
| `--config <path>` | Caminho para o arquivo de configuração. |
| `--no-config` | Não lê nenhum arquivo de configuração — usa apenas variáveis de ambiente. |
| `--log-level <level>` | Nível de detalhe do log: `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL` ou `PANIC`. Se omitido, usa a variável de ambiente `SEMAPHORE_LOG_LEVEL`. |
| `--debug-filter <spec>` | Restringe a saída `DEBUG` a namespaces específicos, por exemplo `'runner,task_*'` ou `'*,-db'`. Só tem efeito quando o nível de log é `DEBUG`. Se omitido, usa `SEMAPHORE_DEBUG_FILTER`. |

<a id="how-the-configuration-file-is-found"></a>

### Como o arquivo de configuração é localizado

Quando `--config` é omitido, o Semaphore procura o arquivo nesta ordem e usa
o primeiro que existir:

1. O caminho na variável de ambiente `SEMAPHORE_CONFIG_PATH`.
2. `config.json`, `config.yaml` ou `config.yml` no diretório atual.
3. `/usr/local/etc/semaphore/config.json` (ou `.yaml` / `.yml`).
4. `/etc/semaphore/config.json` (ou `.yaml` / `.yml`).

As variáveis de ambiente são aplicadas sobre o arquivo, portanto elas sobrescrevem os
valores do arquivo. Com `--no-config`, apenas variáveis de ambiente e valores padrão são usados. Consulte
[Configuração](../../../../docs/admin-guide/configuration.md) para a lista completa de opções.

<a id="version"></a>

## Versão

Exibe a versão atual.

```bash
semaphore version
```

<a id="interactive-setup"></a>

## Configuração interativa

Use isto para a configuração inicial. Ele gera os segredos, conduz um
questionário interativo, grava o arquivo de configuração, executa as
migrações do banco de dados e cria o primeiro usuário administrador.

```bash
semaphore setup
```

Passe `--config <path>` para escolher onde o arquivo de configuração será gravado.
Sem isso, o setup pergunta um diretório de saída (padrão: o diretório
atual) e grava `config.json` nele.

Se o nome de usuário ou e-mail informado já existir, o setup mantém o usuário
existente em vez de criar um novo.

Ao concluir, ele exibe os comandos para iniciar o servidor, por exemplo:

```bash
./semaphore server --config /path/to/config.json
```

<a id="server-mode"></a>

## Modo servidor

Inicia o servidor do Semaphore (interface web e API). `service` é um alias de `server`.

```bash
semaphore server --config /path/to/config.json
```

O servidor aplica as migrações pendentes do banco de dados na inicialização e exibe o
banco de dados, o caminho temporário, a interface e a porta que está usando.

<a id="runner-mode"></a>

## Modo runner

Executa o Semaphore como um runner de tarefas. Consulte [Runners](../../../../docs/reference/cli/runners.md) para o
conjunto completo de subcomandos (`setup`, `register`, `start`, `unregister`).

```bash
semaphore runner start --config /path/to/runner-config.json
```

<a id="database-migration"></a>

## Migração do banco de dados

Atualiza o esquema do banco de dados. Consulte
[Migrações do banco de dados](../../../../docs/reference/cli/migrations.md) para aplicar ou reverter
para uma versão específica.

```bash
semaphore migrate --config /path/to/config.json
```
