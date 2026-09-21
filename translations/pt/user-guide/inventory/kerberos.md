# Autenticação Kerberos

O Semaphore oferece suporte à autenticação Kerberos ao executar playbooks em **hosts Windows via WinRM**.

<a id="inventory-configuration"></a>

## Configuração do inventário

```ini
[windows]
hostname

[windows:vars]
ansible_port=5985
ansible_connection=winrm
ansible_winrm_server_cert_validation=ignore
ansible_winrm_transport=ntlm
ansible_winrm_kinit_mode=managed
ansible_winrm_scheme=http
```

Certifique-se também de que:

* Um nome de usuário e uma senha sejam fornecidos (credenciais do Semaphore)
* O formato do usuário seja `domain\\username` (por exemplo, `CORP\\admin`), se necessário

A configuração principal é:

```ini
ansible_winrm_kinit_mode=managed
```

Isso instrui o Ansible a **obter automaticamente um ticket Kerberos** usando o nome de usuário/senha fornecidos, sem exigir que você execute o kinit manualmente.

<a id="example-playbook"></a>

##  Exemplo de Playbook

```yaml
- hosts: all
  gather_facts: false

  tasks:
    - win_ping:
```

Isso verifica a conectividade básica usando WinRM + Kerberos.

<a id="semaphore-ui-host-requirements"></a>

## Requisitos do host do Semaphore UI

No host do Semaphore, instale os seguintes pacotes:

```bash
sudo apt install libkrb5-dev krb5-user
```

Em seguida, edite `/etc/krb5.conf` e defina seu realm padrão (nome do domínio):

```ini
[libdefaults]
  default_realm = YOUR.DOMAIN.NAME
```

Isso deve corresponder ao seu domínio do Active Directory.

<a id="notes"></a>

## Observações

* Você não precisa executar o kinit manualmente — o Ansible cuida da obtenção do ticket quando `ansible_winrm_kinit_mode=managed` está definido.

* Funciona com o transporte NTLM padrão (não é necessário SSL se estiver usando HTTP e `cert_validation=ignore`).
