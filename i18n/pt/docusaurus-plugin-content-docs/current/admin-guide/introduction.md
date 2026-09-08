# Introdução

Bem-vindo ao Guia de Administração do Semaphore UI. Este guia fornece informações completas para instalar, configurar e manter a sua instância do Semaphore.

## O que é o Semaphore UI? {#what-is-semaphore-ui}

O Semaphore UI é uma interface web moderna e de código aberto para executar tarefas de automação. Ele foi projetado para ser uma alternativa leve, rápida e fácil de usar a plataformas de automação mais complexas.

Ele permite gerenciar e executar tarefas com segurança para:
*   Playbooks do **Ansible**
*   Infraestrutura como código com **Terraform/OpenTofu**
*   Scripts **PowerShell** e **Shell**
*   Scripts **Python**

## Principais recursos e filosofia {#core-features--philosophy}

Entender os princípios de design do Semaphore pode ajudar você a aproveitá-lo ao máximo:

*   **Leve e performático**: O Semaphore é escrito em **Go** e distribuído como um **único arquivo binário**. Ele tem requisitos mínimos de recursos (CPU/RAM) e não exige dependências externas como Kubernetes, Docker ou uma JVM. Isso o torna rápido, eficiente e fácil de implantar.
*   **Simples de instalar e manter**: Você pode ter o Semaphore em execução em minutos. A instalação pode ser tão simples quanto baixar o binário e executá-lo. A arquitetura simples torna as atualizações e a manutenção diretas.
*   **Implantação flexível**: Execute-o como binário, como serviço do systemd ou em um contêiner Docker. Ele é adequado para tudo, desde um homelab pessoal até ambientes corporativos.
*   **Auto-hospedado e seguro**: O Semaphore é uma solução auto-hospedada. Todos os seus dados, credenciais e logs permanecem na sua própria infraestrutura, dando a você controle total. As credenciais são sempre criptografadas no banco de dados.
*   **Integrações poderosas**: Apesar de simples, o Semaphore oferece suporte a recursos poderosos como autenticação LDAP/OpenID, controle de acesso baseado em funções (RBAC) detalhado por projeto, runners remotos para escalar a execução de tarefas e uma API REST completa para acesso programático.

Este guia mostrará como configurar e gerenciar esses recursos de acordo com as suas necessidades específicas.
