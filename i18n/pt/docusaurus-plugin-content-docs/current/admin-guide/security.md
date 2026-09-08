# 🔐 Segurança

## Introdução {#introduction}

A segurança é uma prioridade máxima no Semaphore UI. Seja automatizando tarefas críticas de infraestrutura ou gerenciando o acesso da equipe a sistemas sensíveis, o Semaphore UI foi projetado para oferecer operações robustas e seguras desde a instalação. Esta seção descreve como o Semaphore lida com a segurança e o que você deve considerar ao implantá-lo em produção.

## Autenticação e autorização {#authentication--authorization}

O Semaphore oferece suporte a autenticação segura e a mecanismos flexíveis de autorização:

- **Métodos de login:**
  - **Usuário/senha**<br />Método padrão que usa credenciais armazenadas no banco de dados do Semaphore. As senhas são armazenadas com hash usando um algoritmo forte (bcrypt).

  - **LDAP**<br />Permite a integração com serviços de diretório corporativos. Oferece suporte a filtragem de usuários/grupos e a conexões seguras via LDAPS.

  - **OpenID Connect (OIDC)**<br />Permite o login único (SSO) com provedores de identidade como Google, Azure AD ou Keycloak. Oferece suporte a claims personalizadas e mapeamento de grupos.

- **Autenticação de dois fatores (2FA)**<br />A 2FA baseada em TOTP está disponível e é recomendada para todos os usuários. Ela pode ser habilitada por usuário e oferece suporte a códigos de recuperação opcionais. Consulte as opções de configuração `auth.totp.enabled` e `auth.totp.allow_recovery`.

- **Controle de acesso baseado em funções**<br />Você pode atribuir diferentes funções aos usuários, como Admin, Maintainer ou Viewer, limitando o acesso conforme a responsabilidade.

- **Gerenciamento de sessões**<br />As sessões são protegidas com cookies HTTP seguros. Os mecanismos de expiração de sessão e de logout garantem uma exposição mínima.
<!-- - **Brute-Force Protection**: Login attempts are rate-limited to prevent brute-force attacks. -->

## Segredos e credenciais {#secrets--credentials}

Gerenciar segredos com segurança é um recurso central:

- **Key Store criptografado**<br />Credenciais e variáveis secretas são criptografadas em repouso usando criptografia AES.

- **Isolamento de ambiente**<br />Os segredos são passados aos jobs apenas em tempo de execução e não são expostos diretamente ao ambiente do contêiner.

- **Chaves SSH e tokens**<br />Os usuários são responsáveis por enviar chaves SSH e tokens válidos. Eles são criptografados e usados apenas durante a execução das tarefas.
- **Integração com HashiCorp Vault (Pro)**<br />Os segredos podem ser armazenados em uma instância externa do Vault. Escolha o armazenamento por segredo ao criar ou editar um segredo.

## Criptografia de dados {#data-encryption}

Os dados sensíveis são armazenados no banco de dados de forma criptografada. Você deve definir a opção de configuração `access_key_encryption` no arquivo de configuração para habilitar a criptografia das Access Keys. Ela deve ser gerada pelo comando:

```bash
head -c32 /dev/urandom | base64
```

## Execução de código / playbooks não confiáveis {#running-untrusted-code--playbooks}

O Semaphore executa playbooks e comandos definidos pelo usuário, o que pode ser arriscado:

- **Isolamento em contêineres**<br />As tarefas são executadas em contêineres Docker isolados. Esses contêineres não têm acesso ao sistema host.

- **Privilégio mínimo**<br />Os contêineres são executados com permissões mínimas e podem ser restringidos ainda mais usando flags do Docker.

- **Execução em chroot**<br />O Semaphore pode executar tarefas dentro de um chroot jail para isolar ainda mais o ambiente de execução do sistema host.

- **Usuário do processo da tarefa**<br />As tarefas podem ser executadas sob um usuário de sistema dedicado e não root (por exemplo, `semaphore`) para reduzir o impacto de possíveis exploits. Isso é opcional e pode ser configurado conforme as políticas do sistema.
<!-- - **Resource Limits**: To prevent abuse, CPU and memory limits can be applied. -->

## Implantação segura {#secure-deployment}

Para garantir que o Semaphore seja implantado com segurança:

- **Use HTTPS**<br />
    O Semaphore oferece suporte a HTTPS tanto por meio do seu **suporte TLS integrado** quanto por meio de um **proxy reverso como o Nginx**. É altamente recomendável habilitar o HTTPS em produção.

    Para habilitar o suporte HTTPS integrado, adicione o seguinte bloco ao **config.json**:
    ```json
    {
        ...
        "tls": {
            "enabled": true,
            "cert_file": "/path/to/cert/example.com.cert",
            "key_file": "/path/to/key/example.com.key"
        }
        ...
    }
    ```

- **Execute atrás de um firewall**<br />Limite o acesso ao Semaphore UI e ao banco de dados apenas a IPs confiáveis.

- **Segurança do banco de dados**<br />Use senhas fortes e restrinja o acesso ao banco de dados apenas ao Semaphore.

## Atualizações e gerenciamento de patches {#updates--patch-management}

Atualizações de segurança são publicadas regularmente:

- **Mantenha-se atualizado**<br />Use sempre a versão estável mais recente.

- **Changelog**<br />Revise as alterações no GitHub antes de atualizar.

- **Atualizações automáticas**<br />Se estiver usando Docker, considere pipelines de automação para atualizações regulares.

<!-- ## Audit Logs & Monitoring

Semaphore provides basic audit logging:

- **User Activity**: Logins, failed attempts, and task executions are logged.
- **Configuration Changes**: Changes to settings, projects, and credentials are logged with timestamps.
- **Integration**: Logs can be forwarded to centralized logging systems like ELK or Prometheus exporters. -->

<!-- ## Backups & Disaster Recovery

To protect against data loss:

- **What to Back Up**: Semaphore database, configuration file, and secret storage.
- **How to Restore**: Follow the backup/restore guide in the admin docs.
- **Testing**: Periodically test restoring backups in a staging environment. -->

<!-- ## Common Vulnerabilities & Hardening Tips

- **Disable User Registration** if not needed to prevent unauthorized access.
- **Use Strong Passwords** and enforce complexity rules.
- **Limit Task Concurrency** to avoid resource exhaustion.
- **Restrict Access to Secrets** by managing team permissions carefully. -->

<!-- ## Compliance & Data Privacy

Semaphore collects minimal user data:

- **Data Handling**: Emails, IP logs, and session data are stored securely.
- **User Deletion**: Admins can delete user accounts and associated data upon request.
- **GDPR Compliance**: Self-hosted users are responsible for local compliance. -->

## Relato de vulnerabilidades {#reporting-vulnerabilities}

Encontrou uma vulnerabilidade? Ajude-nos a manter o Semaphore seguro:

- **Divulgação responsável**<br />Envie um e-mail para `security@semaphoreui.com`.
 
### Prazos-alvo para correção de vulnerabilidades {#vulnerability-resolution-targets}

Nosso objetivo é corrigir as vulnerabilidades relatadas dentro dos seguintes prazos-alvo:

- Crítica: em até 30 dias
- Alta: em até 60 dias
- Média: em até 90 dias
- Baixa: melhor esforço, normalmente em até 180 dias

Patches fora do ciclo podem ser lançados para problemas ativamente explorados que afetem as versões estáveis mais recentes.

### Ferramentas de segurança de código {#code-security-tooling}

Usamos CodeQL, Codacy, Snyk e Renovate para analisar a base de código e as dependências, e para automatizar as atualizações de dependências.
- **Sem exploits públicos**<br />Não divulgue vulnerabilidades publicamente até que sejam corrigidas.

- **Agradecimentos**<br />Pesquisadores de segurança podem ser mencionados nas notas de versão, se desejarem.

