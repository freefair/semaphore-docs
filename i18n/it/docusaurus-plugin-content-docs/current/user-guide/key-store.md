# Key Store

Il Key Store di Semaphore viene utilizzato per archiviare le credenziali per l'accesso ai repository remoti, l'accesso agli host remoti, le credenziali sudo e le password di Ansible Vault.

## Tipi {#types}

### 1. SSH {#1-ssh}
Le chiavi SSH vengono utilizzate per accedere ai server remoti e ai repository remoti.

Se serve aiuto per generare rapidamente una chiave e installarla sull'host, [qui è disponibile una guida rapida.](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-20-04)

Per i repository Git che utilizzano l'autenticazione SSH, il repository Git da cui si desidera clonare deve avere la chiave pubblica associata alla chiave privata.

Di seguito i collegamenti alla documentazione di alcuni repository Git comuni:
* [GitHub](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
* [GitLab](https://docs.gitlab.com/ee/user/ssh.html)
* [Bitbucket](https://support.atlassian.com/bitbucket-cloud/docs/set-up-an-ssh-key/)

### 2. Accesso con password {#2-login-with-password}
L'accesso con password è una combinazione di nome utente e password/token di accesso che può essere utilizzata per:
* Autenticarsi sugli host remoti (sebbene sia meno sicuro rispetto alle chiavi SSH)
* Credenziali sudo sugli host remoti
* Autenticarsi sui repository Git remoti tramite HTTPS (sebbene SSH sia più sicuro)
* Sbloccare gli Ansible Vault

:::tip
    Questo tipo di segreto può essere utilizzato come Personal Access Token (PAT) o come stringa segreta. È sufficiente lasciare vuoto il campo Login.
:::

### 3. Nessuna {#3-none}
Viene utilizzata come segnaposto per i repository che non richiedono autenticazione, come un repository open source su GitLab.


## Archivi di segreti {#secret-storages}

Semaphore UI supporta diversi archivi per i segreti. È possibile scegliere l'archivio per ogni singolo segreto durante la creazione o la modifica.

### Database {#database}

Per impostazione predefinita, i segreti vengono archiviati nel database in forma cifrata. La chiave di cifratura viene configurata tramite l'opzione di configurazione
`access_key_encryption` o `SEMAPHORE_ACCESS_KEY_ENCRYPTION` (deve essere generata con `head -c32 /dev/urandom | base64`).

### Variabile d'ambiente o file {#environment-variable-or-file}

Una chiave può leggere il proprio valore da una variabile d'ambiente del server Semaphore oppure da un file sul server
(ad esempio una chiave SSH montata nel container). Le schede **Env** e **File** del modulo della chiave selezionano questa modalità.

I file devono trovarsi all'interno della directory dei segreti configurata (`dirs.secrets` / `SEMAPHORE_SECRETS_PATH`, predefinita `/tmp/semaphore`),
e le chiavi SSH e Accesso con password devono essere incapsulate in un piccolo documento JSON.

[Per saperne di più...](/user-guide/key-store/env-and-file-sources)

### HashiCorp Vault {#hashicorp-vault}

I segreti possono essere archiviati in un'istanza esterna di HashiCorp Vault anziché nel database.

[Per saperne di più...](/user-guide/key-store/hashicorp-vault)

### OpenBao {#openbao}

I segreti possono essere archiviati in un'istanza esterna di [OpenBao](https://openbao.org) (un fork open source di HashiCorp Vault, compatibile a livello di API).

[Per saperne di più...](/user-guide/key-store/openbao)

### AWS Secrets Manager {#aws-secrets-manager}

![Badge statico](https://img.shields.io/badge/enterprise-yellow)

I segreti possono essere archiviati in AWS Secrets Manager. L'autenticazione avviene tramite ruolo IAM/profilo dell'istanza oppure chiavi di accesso statiche.

[Per saperne di più...](/user-guide/key-store/aws-secrets-manager)

### Devolutions Server {#devolutions-server}

I segreti possono essere archiviati in un'istanza esterna di Devolutions Server anziché nel database.

[Per saperne di più...](/user-guide/key-store/devolutions-server)

## Sincronizzazione dei segreti da archivi remoti {#syncing-secrets-from-remote-storages}

Semaphore può importare automaticamente i segreti da un gestore di segreti esterno (HashiCorp Vault, OpenBao, AWS Secrets Manager, Azure Key Vault o Devolutions Server) e mantenerli sincronizzati. I percorsi di sincronizzazione consentono di scegliere quali segreti importare e come denominarli.

[Per saperne di più...](/user-guide/key-store/secret-sync)

