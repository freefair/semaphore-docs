# Configurações

A aba **Configurações** do dashboard do projeto está disponível para os **Owners** do projeto. Ela contém as opções gerais do projeto e as ações destrutivas.

![Configurações do projeto](../../../../static/assets/project-settings-general.webp)

<a id="general"></a>

## Geral

| Campo | Descrição |
|---|---|
| **Nome do Projeto** | Nome de exibição mostrado no seletor de projetos e nos alertas. |
| **Número máximo de tarefas paralelas** | Opcional. Número máximo de tarefas deste projeto que podem ser executadas ao mesmo tempo. Deixe vazio para não haver limite. As tarefas acima do limite permanecem na fila com o status `waiting` até que uma vaga seja liberada. |
| **Telegram Chat ID** | Opcional. Envia os alertas deste projeto para um chat do Telegram diferente do configurado globalmente. Consulte [Notificações do Telegram](../../../../docs/admin-guide/notifications/telegram.md#per-project-chat-ids). |
| **Permitir alertas para este projeto** | Interruptor geral das notificações. Quando está desligado, nenhum canal envia alertas sobre as tarefas deste projeto, mesmo que o canal esteja configurado no servidor. |

**Testar alertas** envia uma mensagem de teste por todos os [canais de notificação](../../../../docs/admin-guide/notifications.md) configurados, para que você possa verificar a configuração do servidor sem executar uma tarefa. **Salvar** aplica as alterações.

<a id="danger-zone"></a>

## Zona de perigo

| Ação | Efeito |
|---|---|
| **Fazer backup do projeto** | Baixa um arquivo JSON com a definição do projeto: templates, inventários, grupos de variáveis, chaves (sem os valores secretos), repositórios, agendamentos, views e integrações. Restaure-o por meio de **Novo Projeto → Restaurar projeto** ou com [`semaphore projects import`](../../../../docs/reference/cli/projects.md). |
| **Limpar cache** | Exclui todos os arquivos em cache do projeto no servidor, por exemplo repositórios clonados. A próxima tarefa clona os repositórios novamente. A ação é irreversível. |
| **Excluir projeto** | Exclui o projeto com todos os seus recursos e o histórico de tarefas. Não é possível desfazer. |

<a id="related-settings"></a>

## Configurações relacionadas

- Membros e papéis: [Equipes](../../../../docs/user-guide/team.md)
- Runners vinculados ao projeto e tags de runner: [Runners do projeto](../../../../docs/user-guide/projects/runners.md)
- Os canais de notificação são configurados no servidor: [Notificações](../../../../docs/admin-guide/notifications.md)
