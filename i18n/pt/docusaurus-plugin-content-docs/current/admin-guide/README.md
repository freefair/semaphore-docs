# Guia de Administração

Bem-vindo ao Guia de Administração do Semaphore UI. Este guia fornece informações completas para instalar, configurar e manter sua instância do Semaphore.

## O que é o Semaphore UI? {#what-is-semaphore-ui}

O Semaphore UI é uma interface web moderna e de código aberto para executar tarefas de automação. Ele foi projetado para ser uma alternativa leve, rápida e fácil de usar a plataformas de automação mais complexas.

Ele permite gerenciar e executar com segurança tarefas para:
*   Playbooks **Ansible**
*   Infraestrutura como código com **Terraform/OpenTofu**
*   Scripts **PowerShell** e **Shell**
*   Scripts **Python**

## Principais recursos e filosofia {#core-features--philosophy}

Entender os princípios de design do Semaphore pode ajudar você a aproveitá-lo ao máximo:

*   **Leve e performático**: o Semaphore é escrito em **Go** e distribuído como um **único arquivo binário**. Ele tem requisitos mínimos de recursos (CPU/RAM) e não exige dependências externas como Kubernetes, Docker ou uma JVM. Isso o torna rápido, eficiente e fácil de implantar.
*   **Simples de instalar e manter**: você pode ter o Semaphore em execução em minutos. A instalação pode ser tão simples quanto baixar o binário e executá-lo. A arquitetura simples torna atualizações e manutenção diretas.
*   **Implantação flexível**: execute-o como binário, como serviço systemd ou em um contêiner Docker. Ele é adequado para tudo, desde um homelab pessoal até ambientes corporativos.
*   **Auto-hospedado e seguro**: o Semaphore é uma solução auto-hospedada. Todos os seus dados, credenciais e logs permanecem em sua própria infraestrutura, dando a você controle total. As credenciais são sempre criptografadas no banco de dados.
*   **Integrações poderosas**: apesar de simples, o Semaphore oferece recursos poderosos como autenticação LDAP/OpenID, controle de acesso baseado em funções (RBAC) detalhado por projeto, runners remotos para escalar a execução de tarefas e uma API REST completa para acesso programático.

Este guia orientará você na configuração e no gerenciamento desses recursos de acordo com suas necessidades específicas.

<!-- ## Start here

- Installation options: package manager, Docker/Compose, binary, Kubernetes (Helm), Snap (deprecated)
- Post-install configuration: config file, environment variables, interactive CLI setup
- Security essentials: reverse proxy, TLS, database and network hardening
- Authentication: LDAP and OpenID Connect providers
- Operations: CLI, runners, logs, notifications
- Maintenance: upgrading and troubleshooting -->

## Links rápidos {#quick-links}

- Instalação: [Visão geral](/admin-guide/installation)
  - [Gerenciador de pacotes](/admin-guide/installation/package-manager)
  - [Docker](/admin-guide/installation/docker)
  - [Arquivo binário](/admin-guide/installation/binary-file)
  - [Kubernetes (Helm chart)](/admin-guide/installation/k8s)
  - [Nuvem](/admin-guide/installation/cloud)
  - [Instalação manual](/admin-guide/installation_manually)
- Configuração: [Visão geral](/admin-guide/configuration)
  - [Arquivo de configuração](/admin-guide/configuration/config-file)
  - [Variáveis de ambiente](/admin-guide/configuration/env-vars)
  - [Configuração interativa](/admin-guide/configuration/cli)
- Segurança: [Visão geral](/admin-guide/security)
  - [Segurança do banco de dados](/admin-guide/security/database)
  - [Segurança de rede](/admin-guide/security/network)
  - [Configuração do NGINX](/admin-guide/reverse-proxy/nginx)
  - [Configuração do Apache](/admin-guide/reverse-proxy/apache)
  - [Kerberos](/admin-guide/security/kerberos)
- Autenticação:
  - [LDAP](/admin-guide/ldap)
  - [OpenID](/admin-guide/openid)
    - [GitHub](/admin-guide/openid/github)
    - [Google](/admin-guide/openid/google)
    - [GitLab](/admin-guide/openid/gitlab)
    - [Gitea](/admin-guide/openid/gitea)
    - [Authelia](/admin-guide/openid/authelia)
    - [Authentik](/admin-guide/openid/authentik)
    - [Keycloak](/admin-guide/openid/keycloak)
    - [Okta](/admin-guide/openid/okta)
    - [PingFederate](/admin-guide/openid/pingfederate)
    - [Azure](/admin-guide/openid/azure)
    - [Zitadel](/admin-guide/openid/zitadel)
- Operações:
  - [CLI](/admin-guide/cli)
  - [Runners](/admin-guide/runners)
  - [Logs](/admin-guide/logs)
  - [Notificações](/category/notifications)
    - [E-mail](/admin-guide/notifications/email)
    - [Telegram](/admin-guide/notifications/telegram)
    - [Slack](/admin-guide/notifications/slack)
    - [Teams](/admin-guide/notifications/teams)
    - [Rocket.Chat](/admin-guide/notifications/rocket)
    - [DingTalk](/admin-guide/notifications/ding)
    - [Gotify](/admin-guide/notifications/gotify)
- Manutenção:
  - [Atualização](/admin-guide/upgrading)
  - [Ativação de licença](/admin-guide/license)
  - [Solução de problemas](/admin-guide/troubleshooting)
