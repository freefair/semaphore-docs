# Primeiros passos

Esta página guia você desde uma instalação nova até a sua primeira tarefa executada com sucesso. Cada passo tem um link para a página com os detalhes.

<a id="from-zero-to-first-task"></a>

## Do zero à primeira tarefa

1. **Instale o Semaphore** com o método de sua preferência: [Instalação](../../docs/admin-guide/installation.md).
2. **Faça login** com o usuário administrador que você criou durante a configuração, ou por meio das variáveis `SEMAPHORE_ADMIN_*` no Docker.
3. **Crie um projeto.** Um projeto isola equipes, infraestruturas ou aplicações umas das outras: [Projetos](../../docs/user-guide/projects.md).
4. **Conecte o que a sua automação precisa:**
   - Código-fonte com playbooks, módulos ou scripts: [Repositórios](../../docs/user-guide/repositories.md).
   - Chaves SSH, tokens e senhas: [Armazenamento de Chaves](../../docs/user-guide/key-store.md).
   - Hosts de destino e configurações de conexão: [Inventário](../../docs/user-guide/inventory.md).
   - Variáveis reutilizáveis: [Grupos de Variáveis](../../docs/user-guide/environment.md).
5. **Crie um template de tarefa e execute-o.** Escolha o guia da sua ferramenta: [Ansible](../../docs/user-guide/apps/ansible.md), [Terraform/OpenTofu](../../docs/user-guide/apps/terraform/README.md), [Shell](../../docs/user-guide/apps/bash.md), [PowerShell](../../docs/user-guide/apps/powershell.md) ou [Python](../../docs/user-guide/apps/python.md). Em seguida, execute e acompanhe: [Tarefas](../../docs/user-guide/tasks.md).
6. **Automatize e operacionalize:**
   - Execute em um agendamento: [Agendamentos](../../docs/user-guide/schedules.md).
   - Controle quem pode fazer o quê: [Equipes e papéis personalizados](../../docs/user-guide/team.md).
   - Receba alertas sobre os resultados: [Notificações](../../docs/admin-guide/notifications.md).

<a id="key-concepts"></a>

## Conceitos principais

Estes termos aparecem em toda a interface.

| Termo | Significado |
|------|---------|
| **Projeto** | A principal unidade de separação. Cada projeto tem seus próprios repositórios, chaves, inventários, templates e equipe. [Projetos](../../docs/user-guide/projects.md) |
| **Repositório** | Um repositório Git ou caminho local onde ficam os playbooks, módulos ou scripts. [Repositórios](../../docs/user-guide/repositories.md) |
| **Inventário** | Hosts, grupos e configurações de conexão para execuções no estilo Ansible. [Inventário](../../docs/user-guide/inventory.md) |
| **Grupo de Variáveis** | Variáveis reutilizáveis e configuração de ambiente, também chamado de Environment. [Grupos de Variáveis](../../docs/user-guide/environment.md) |
| **Armazenamento de Chaves** | Credenciais criptografadas, como chaves SSH, tokens e senhas. [Armazenamento de Chaves](../../docs/user-guide/key-store.md) |
| **Template de Tarefa** | A definição de uma execução: aplicativo, repositório, inventário, variáveis e opções. [Templates de Tarefa](../../docs/user-guide/task-templates/README.md) |
| **Tarefa** | Uma única execução de um template, com seu log e status. [Tarefas](../../docs/user-guide/tasks.md) |
| **Workflow** | Um grafo de templates com ramificações, aprovações e pausas. Recurso Pro. [Workflows](../../docs/user-guide/workflows.md) |
| **Runner** | Onde as tarefas são executadas: o próprio servidor ou um runner remoto. [Runners](../../docs/admin-guide/runners.md) |

<a id="next-steps"></a>

## Próximos passos

- Coloque o Semaphore atrás de TLS com um [proxy reverso](../../docs/admin-guide/reverse-proxy/README.md).
- Conecte o seu provedor de identidade: [LDAP](../../docs/admin-guide/authentication/ldap.md) ou [OpenID Connect](../../docs/admin-guide/authentication/openid.md).
- Controle o Semaphore a partir de CI ou scripts com a [API](../../docs/reference/api.md) e a [CLI](../../docs/reference/cli/README.md).
