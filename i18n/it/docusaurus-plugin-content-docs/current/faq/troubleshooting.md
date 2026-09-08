# Risoluzione dei problemi

## 1. Il runner mostra l'errore 404 {#1-runner-prints-error-404}

### Come risolvere {#how-to-fix}

[Getting 401 error code from Runner](https://github.com/semaphoreui/semaphore/discussions/1873?converting=1)

---

## 2. Problema di Gathering Facts per localhost {#2-gathering-facts-issue-for-localhost}

Il problema può verificarsi su Semaphore UI installato tramite [Snap](https://snapcraft.io/semaphore) o [Docker](https://hub.docker.com/r/semaphoreui/semaphore).

```
4:10:16 PM
TASK [Gathering Facts] *********************************************************
4:10:17 PM
fatal: [localhost]: FAILED! => changed=false
```

### Perché succede {#why-this-happens}

Per maggiori informazioni sull'uso di localhost in Ansible, leggere questo articolo: [Implicit 'localhost'](https://docs.ansible.com/ansible/latest/inventory/implicit_localhost.html).

Ansible tenta di raccogliere i fact in locale, ma Ansible si trova in un container isolato e limitato che non lo consente.

### Come risolvere {#how-to-fix-this}

Esistono due modi:

1. Disabilitare la raccolta dei fact:

```yaml
- hosts: localhost
  gather_facts: False
  roles:
    - ...
```

2. Impostare esplicitamente il tipo di connessione su **ssh**:
```
[localhost]
127.0.0.1 ansible_connection=ssh ansible_ssh_user=your_localhost_user
```
---
## 3. panic: pq: SSL is not enabled on the server {#3-panic-pq-ssl-is-not-enabled-on-the-server}

Significa che il proprio Postgres non funziona tramite SSL.

### Come risolvere {#how-to-fix-this-1}

Aggiungere l'opzione `sslmode=disable` al file di configurazione:

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


## 4. fatal: bad numeric config value '0' for 'GIT_TERMINAL_PROMPT': invalid unit {#4-fatal-bad-numeric-config-value-0-for-git_terminal_prompt-invalid-unit}

Significa che si sta tentando di accedere tramite HTTPS a un repository che richiede l'autenticazione.

### Come risolvere {#how-to-fix-this-2}

* Andare nella schermata **Key Store**.
* Creare una nuova chiave di tipo `Login with password`.
* Specificare il proprio login per GitHub/BitBucket/ecc.
* Specificare la password. Per GitHub/BitBucket non è possibile usare la password dell'account: è necessario usare un Personal Access Token (PAT) al suo posto. Maggiori informazioni [qui](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).
* Dopo aver creato la chiave, andare nella schermata **Repositories**, trovare il proprio repository e specificare la chiave.


---

## 5. Il clone o il pull di Git fallisce a intermittenza {#5-git-clone-or-pull-fails-intermittently}

I log delle attività possono mostrare messaggi come `Git pull failed (...), retrying in 2s`, seguiti da un esito positivo oppure da un fallimento definitivo dopo diversi tentativi.

### Perché succede {#why-this-happens-1}

Il server git era temporaneamente irraggiungibile o ha restituito un errore transitorio. Semaphore ritenta automaticamente le operazioni di clone e pull prima di far fallire l'attività.

### Come risolvere {#how-to-fix-this-3}

1. **Interruzioni transitorie**: di solito si risolvono da sole. Semaphore ritenta fino a `git_attempts` volte (predefinito 4) con backoff esponenziale.
2. **Fallimenti frequenti**: aumentare `git_attempts` nella configurazione oppure impostare `SEMAPHORE_GIT_ATTEMPTS`.
3. **Fallimenti immediati e costanti**: controllare l'URL del repository, il branch, le chiavi di accesso e la connettività di rete.

Vedere [Operazioni Git](/admin-guide/configuration/config-file#git-operations) per i dettagli di configurazione.

---

## 6. unable to read LDAP response packet: unexpected EOF {#6-unable-to-read-ldap-response-packet-unexpected-eof}

Molto probabilmente si sta tentando di connettersi al server LDAP con un metodo non sicuro, mentre il server si aspetta una connessione sicura (tramite TLS).

### Come risolvere {#how-to-fix-this-4}

Abilitare TLS nel file `config.json`:

```json
...
"ldap_needtls": true
...
```

---

## 7. LDAP Result Code 49 "Invalid Credentials" {#7-ldap-result-code-49-invalid-credentials}

La password o il `binddn` sono errati.

### Come risolvere {#how-to-fix-this-5}

Usare lo strumento `ldapwhoami` e verificare che il proprio binddn funzioni:

```bash
ldapwhoami\
  -H ldap://ldap.com:389\
  -D "CN=/your/ldap_binddn/value/in/config/file"\
  -x\
  -W
```

Chiederà interattivamente la password e dovrebbe restituire il codice **0** e stampare il **DN** specificato.

È inoltre possibile leggere i seguenti articoli: 
* [ldapsearch: Invalid credentials (49)](https://serverfault.com/q/771549/443463)
* [https://github.com/semaphoreui/semaphore/issues/906](https://github.com/semaphoreui/semaphore/issues/906)

---

## 8. LDAP Result Code 32 "No Such Object" {#8-ldap-result-code-32-no-such-object}

Prossimamente.

