---
title: Documentação do Semaphore UI
sidebar_label: Início
hide_table_of_contents: true
---

# Documentação do Semaphore UI

O Semaphore UI é uma interface web e API auto-hospedada para executar automações com **Ansible**, **Terraform/OpenTofu**, **Shell**, **PowerShell** e **Python**. Ele oferece à sua equipe um único lugar para executar playbooks e scripts, manter credenciais criptografadas, agendar jobs e ver quem executou o quê e quando.

Ele é distribuído como um único binário Go ou imagem Docker, roda em Linux, macOS e Windows e armazena os dados em SQLite, MySQL ou PostgreSQL.

:::tip[Início rápido]

Execute o Semaphore com SQLite em um único comando, depois abra [http://localhost:3000](http://localhost:3000) e faça login como `admin` / `changeme`.

```bash
docker run -d -p 3000:3000 \
  -e SEMAPHORE_DB_DIALECT=sqlite \
  -e SEMAPHORE_ADMIN=admin \
  -e SEMAPHORE_ADMIN_PASSWORD=changeme \
  -e SEMAPHORE_ADMIN_NAME=Admin \
  -e SEMAPHORE_ADMIN_EMAIL=admin@localhost \
  -v semaphore-data:/var/lib/semaphore \
  semaphoreui/semaphore:latest
```

Para produção, consulte [Instalação](/admin-guide/installation) para instalações com Docker Compose, pacotes, Kubernetes e binário. Em seguida, siga [Primeiros passos](/getting-started) para executar sua primeira tarefa.

:::

<div className="row home-cards">
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Instalar e configurar</h3></div>
      <div className="card__body">
        <p>Coloque um servidor em execução e conecte-o ao seu banco de dados, provedor de identidade e rede.</p>
        <ul>
          <li><a href="/admin-guide/installation">Instalação</a></li>
          <li><a href="/admin-guide/configuration">Configuração</a></li>
          <li><a href="/category/reverse-proxy">Proxy reverso e TLS</a></li>
          <li><a href="/admin-guide/ldap">LDAP</a> e <a href="/admin-guide/openid">OpenID Connect</a></li>
          <li><a href="/admin-guide/security">Reforço de segurança</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Executar automação</h3></div>
      <div className="card__body">
        <p>Organize o trabalho em projetos, conecte repositórios e credenciais e execute tarefas sob demanda ou de forma agendada.</p>
        <ul>
          <li><a href="/getting-started">Primeiros passos: primeira tarefa em seis etapas</a></li>
          <li><a href="/user-guide/projects">Projetos</a> e <a href="/user-guide/team">Equipes</a></li>
          <li><a href="/user-guide/task-templates">Modelos de tarefa</a> e <a href="/user-guide/tasks">Tarefas</a></li>
          <li><a href="/user-guide/key-store">Armazenamento de Chaves</a>, <a href="/user-guide/inventory">Inventário</a>, <a href="/user-guide/environment">Grupos de Variáveis</a></li>
          <li><a href="/user-guide/schedules">Agendamentos</a> e <a href="/user-guide/workflows">Workflows</a> (Pro)</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Operar em escala</h3></div>
      <div className="card__body">
        <p>Distribua a execução, opere com redundância e mantenha o serviço observável e atualizado.</p>
        <ul>
          <li><a href="/admin-guide/runners">Runners</a></li>
          <li><a href="/admin-guide/ha">Alta disponibilidade</a></li>
          <li><a href="/admin-guide/upgrading">Atualização</a></li>
          <li><a href="/admin-guide/logs">Logs</a> e <a href="/admin-guide/metrics">Métricas</a></li>
          <li><a href="/category/notifications">Notificações</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Referência</h3></div>
      <div className="card__body">
        <p>Opções e endpoints exatos para quando você já sabe o que está procurando.</p>
        <ul>
          <li><a href="/admin-guide/configuration/config-file">Arquivo de configuração</a> e <a href="/admin-guide/configuration/env-vars">Variáveis de ambiente</a></li>
          <li><a href="/admin-guide/api">API REST</a></li>
          <li><a href="/admin-guide/cli">CLI</a></li>
          <li><a href="/admin-guide/cicd">Integração com CI/CD</a></li>
          <li><a href="/faq/troubleshooting">FAQ de solução de problemas</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Guias por ferramenta {#guides-by-tool}

<div className="home-tools margin-bottom--lg">
  <a className="button button--outline button--primary" href="/user-guide/apps/ansible">Ansible</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/terraform">Terraform / OpenTofu</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/bash">Shell</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/powershell">PowerShell</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/python">Python</a>
</div>

## Ajuda e comunidade {#help-and-community}

- **Perguntas:** pergunte no [Discord](https://discord.gg/5R6k7hNGcH).
- **Bugs e solicitações de recursos:** abra uma issue no [GitHub](https://github.com/semaphoreui/semaphore/issues).
- **Código-fonte:** [github.com/semaphoreui/semaphore](https://github.com/semaphoreui/semaphore).
- **Pro e Enterprise:** [Ativação de licença](/admin-guide/license).
