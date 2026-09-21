# Solução de problemas

<a id="runner-prints-error-404"></a>

## O Runner exibe o erro 404

<a id="how-to-fix"></a>

### Como corrigir

[Recebendo o código de erro 401 do Runner](https://github.com/semaphoreui/semaphore/discussions/1873?converting=1)

---

<a id="gathering-facts-issue-for-localhost"></a>

## Problema de Gathering Facts para localhost

O problema pode ocorrer no Semaphore UI instalado via [Snap](https://snapcraft.io/semaphore) ou [Docker](https://hub.docker.com/r/semaphoreui/semaphore).

```
4:10:16 PM
TASK [Gathering Facts] *********************************************************
4:10:17 PM
fatal: [localhost]: FAILED! => changed=false
```

<a id="why-this-happens"></a>

### Por que isso acontece

Para mais informações sobre o uso de localhost no Ansible, leia este artigo [Implicit 'localhost'](https://docs.ansible.com/ansible/latest/inventory/implicit_localhost.html).

O Ansible tenta coletar facts localmente, mas o Ansible está em um contêiner isolado e limitado que não permite isso.

<a id="how-to-fix-this"></a>

### Como corrigir isso

Há duas formas:

1. Desativar a coleta de facts:

```yaml
- hosts: localhost
  gather_facts: False
  roles:
    - ...
```

2. Definir explicitamente o tipo de conexão como **ssh**:
```
[localhost]
127.0.0.1 ansible_connection=ssh ansible_ssh_user=your_localhost_user
```
---
<a id="panic-pq-ssl-is-not-enabled-on-the-server"></a>

## panic: pq: SSL is not enabled on the server

Isso significa que o seu Postgres não funciona por SSL.

<a id="how-to-fix-this-1"></a>

### Como corrigir isso

Adicione a opção `sslmode=disable` ao arquivo de configuração:

```json
	"postgres": {
		"host": "localhost",
		"user": "postgres",
		"pass": "pwd",
		"name": "semaphore",
		"options": {
			"sslmode": "disable"
		}
	},
```
---
<a id="fatal-bad-numeric-config-value-0-for-git_terminal_prompt-invalid-unit"></a>

## fatal: bad numeric config value '0' for 'GIT_TERMINAL_PROMPT': invalid unit

Isso significa que você está tentando acessar por HTTPS um repositório que exige autenticação.

<a id="how-to-fix-this-2"></a>

### Como corrigir isso

* Vá para a tela **Armazenamento de chaves**.
* Crie uma nova chave do tipo `Login with password`.
* Informe o seu login do GitHub/BitBucket/etc.
* Informe a senha. Você não pode usar a senha da sua conta do GitHub/BitBucket; em vez dela, use um Personal Access Token (PAT). Leia mais [aqui](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).
* Depois de criar a chave, vá para a tela **Repositórios**, localize o seu repositório e informe a chave.

---

<a id="git-clone-or-pull-fails-intermittently"></a>

## O git clone ou pull falha de forma intermitente

Os logs da tarefa podem exibir mensagens como `Git pull failed (...), retrying in 2s`, seguidas de sucesso ou de uma falha definitiva após várias tentativas.

<a id="why-this-happens-1"></a>

### Por que isso acontece

O servidor git (GitHub, GitLab, Bitbucket ou uma instância self-hosted) ficou temporariamente inacessível, retornou um erro HTTP transitório, ou a rede entre o Semaphore e o servidor teve uma interrupção breve. O Semaphore repete automaticamente as operações de clone e pull antes de marcar a tarefa como falha.

<a id="how-to-fix-this-3"></a>

### Como corrigir isso

1. **Interrupções transitórias**: geralmente se resolvem sozinhas. O Semaphore tenta novamente até `git_attempts` vezes (padrão 4), com backoff exponencial entre as tentativas.
2. **Falhas frequentes**: aumente o número de tentativas na sua configuração:

```json
{
  "git_attempts": 8
}
```

Ou com uma variável de ambiente:

```bash
export SEMAPHORE_GIT_ATTEMPTS=8
```

3. **Falhas imediatas e constantes**: as novas tentativas não vão ajudar. Verifique a URL do repositório, o nome do branch, as chaves de acesso e a conectividade de rede a partir do servidor Semaphore ou do host do runner.

Consulte [Operações Git](../../../docs/admin-guide/configuration/config-file.md#git-operations) para detalhes sobre `git_client` e `git_attempts`.

---

<a id="bash-script-output-is-missing-or-incomplete"></a>

## A saída do script Bash está ausente ou incompleta

Uma tarefa Bash termina com sucesso, mas o log mostra pouca ou nenhuma saída de `echo`, `printf` ou de outros comandos — especialmente quando o script termina rapidamente.

<a id="why-this-happens-2"></a>

### Por que isso acontece

O Semaphore captura stdout e stderr dos comandos de shell enquanto eles são executados. Scripts muito curtos podem terminar antes que toda a saída em buffer seja lida, de modo que as últimas linhas podem ser descartadas do log da tarefa.

<a id="how-to-fix-this-4"></a>

### Como corrigir isso

1. **Atualize**: as versões recentes do Semaphore esvaziam a saída do processo antes de marcar a tarefa como concluída. Atualize o servidor e os runners se você estiver em uma versão antiga.
2. **Faça flush da saída no script** quando precisar de entrega garantida:

```bash
#!/bin/bash
echo "Starting deploy"
echo "Done" >&2
```

Para diagnósticos críticos, grave em um arquivo dentro do workspace do repositório e use `cat` nele no final do script.
3. **Evite saídas silenciosas antecipadas**: use `set -euo pipefail` e mensagens de erro explícitas para que as falhas fiquem visíveis mesmo quando a saída for curta.

---

<a id="unable-to-read-ldap-response-packet-unexpected-eof"></a>

## unable to read LDAP response packet: unexpected EOF

Muito provavelmente, você está tentando se conectar ao servidor LDAP usando um método inseguro, embora ele espere uma conexão segura (via TLS).

<a id="how-to-fix-this-5"></a>

### Como corrigir isso

Habilite o TLS no seu arquivo `config.json`:

```json
...
"ldap_needtls": true
...
```

---

<a id="ldap-result-code-49-invalid-credentials"></a>

## LDAP Result Code 49 "Invalid Credentials"

Você está com a senha ou o `binddn` errados.

<a id="how-to-fix-this-6"></a>

### Como corrigir isso

Use a ferramenta `ldapwhoami` e verifique se o seu binddn funciona:

```bash
ldapwhoami\
  -H ldap://ldap.com:389\
  -D "CN=/your/ldap_binddn/value/in/config/file"\
  -x\
  -W
```

Ela pedirá a senha de forma interativa e deve retornar o código **0** e exibir o **DN** conforme especificado.

Você também pode ler os seguintes artigos:
* [ldapsearch: Invalid credentials (49)](https://serverfault.com/q/771549/443463)
* [https://github.com/semaphoreui/semaphore/issues/906](https://github.com/semaphoreui/semaphore/issues/906)

---

<a id="ldap-result-code-32-no-such-object"></a>

## LDAP Result Code 32 "No Such Object"

O diretório não tem nenhuma entrada no distinguished name sobre o qual o Semaphore
perguntou. Quase sempre é um `ldap_searchdn` errado e, com menos frequência, um `ldap_binddn` errado.

<a id="how-to-fix-this-7"></a>

### Como corrigir isso

Verifique se a base de busca existe, usando as mesmas credenciais que o Semaphore usa:

```bash
ldapsearch\
  -H ldap://ldap.example.com:389\
  -D "CN=/your/ldap_binddn/value/in/config/file"\
  -b "/your/ldap_searchdn/value/in/config/file"\
  -x\
  -W\
  -s base
```

- O código de resultado **32** deste comando significa que a própria base não existe.
  Corrija `ldap_searchdn` no `config.json`; um erro de digitação em um componente, como
  `OU=Users` em vez do `OU=People` real, é a causa mais comum.
- O código de resultado **0** significa que a base está correta e que o problema está em
  `ldap_searchfilter`: ele não corresponde a nenhuma entrada abaixo dessa base.

Consulte [LDAP e AD](../../../docs/admin-guide/authentication/ldap.md) para o significado de cada opção.
