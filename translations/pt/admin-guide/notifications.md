# Notificações

O Semaphore informa os resultados das tarefas em chats e por e-mail. Um canal é
configurado uma única vez no servidor, no `config.json` ou por variáveis de
ambiente, e então vale para todos os projetos. Quais tarefas geram um alerta é
decidido por projeto e por modelo na interface web.

<a id="how-delivery-works"></a>

## Como funciona a entrega

Três configurações decidem se uma mensagem é enviada, e todas as três precisam
permitir isso:

1. **O canal está configurado no servidor.** Cada provedor tem suas próprias
   chaves no `config.json`. Consulte a página desse provedor abaixo.
2. **O projeto permite alertas.** *Allow alerts for this project*, nas
   [configurações do projeto](../../../docs/user-guide/projects/settings.md), é a chave mestra.
   Com ela desligada, nenhum canal envia nada sobre esse projeto.
3. **O modelo solicita o alerta.** Um modelo de tarefa escolhe se alerta em caso
   de sucesso, em caso de erro ou nunca; veja
   [Modelos de Tarefa](../../../docs/user-guide/task-templates/README.md).

Use **Test alerts** nas configurações do projeto para enviar uma mensagem de teste
por todos os canais configurados sem executar uma tarefa.

<a id="channels"></a>

## Canais

| Canal | Página |
|---|---|
| E-mail (SMTP) | [E-mail](../../../docs/admin-guide/notifications/email.md) |
| Telegram | [Telegram](../../../docs/admin-guide/notifications/telegram.md) |
| Slack | [Slack](../../../docs/admin-guide/notifications/slack.md) |
| Microsoft Teams | [Teams](../../../docs/admin-guide/notifications/teams.md) |
| Rocket.Chat | [Rocket.Chat](../../../docs/admin-guide/notifications/rocket.md) |
| DingTalk | [DingTalk](../../../docs/admin-guide/notifications/ding.md) |
| Gotify | [Gotify](../../../docs/admin-guide/notifications/gotify.md) |

Vários canais podem ser habilitados ao mesmo tempo; cada um recebe todos os
alertas que passam pelas três verificações acima.

<a id="per-project-overrides"></a>

## Sobrescritas por projeto

O Telegram suporta um chat por projeto: defina **Telegram Chat ID** nas
[configurações do projeto](../../../docs/user-guide/projects/settings.md) para encaminhar os
alertas de um projeto a um chat diferente do configurado para todo o servidor. Os
demais canais usam a configuração do servidor para todos os projetos.

<a id="where-to-start"></a>

## Por onde começar

Configure um canal primeiro, ligue *Allow alerts for this project* e pressione
**Test alerts**. Assim que uma mensagem de teste chegar, habilite os alertas nos
modelos que importam.
