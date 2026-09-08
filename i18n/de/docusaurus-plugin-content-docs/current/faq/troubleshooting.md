# Fehlerbehebung

## 1. Runner gibt Fehler 404 aus {#1-runner-prints-error-404}

### Lösung {#how-to-fix}

[Getting 401 error code from Runner](https://github.com/semaphoreui/semaphore/discussions/1873?converting=1)

---

## 2. Problem mit Gathering Facts für localhost {#2-gathering-facts-issue-for-localhost}

Das Problem kann bei Semaphore UI auftreten, wenn es über [Snap](https://snapcraft.io/semaphore) oder [Docker](https://hub.docker.com/r/semaphoreui/semaphore) installiert wurde.

```
4:10:16 PM
TASK [Gathering Facts] *********************************************************
4:10:17 PM
fatal: [localhost]: FAILED! => changed=false
```

### Warum das passiert {#why-this-happens}

Weitere Informationen zur Verwendung von localhost in Ansible finden Sie im Artikel [Implicit 'localhost'](https://docs.ansible.com/ansible/latest/inventory/implicit_localhost.html).

Ansible versucht, Facts lokal zu sammeln, aber Ansible befindet sich in einem eingeschränkten, isolierten Container, der dies nicht erlaubt.

### Lösung {#how-to-fix-this}

Es gibt zwei Möglichkeiten:

1. Das Sammeln von Facts deaktivieren:

```yaml
- hosts: localhost
  gather_facts: False
  roles:
    - ...
```

2. Den Verbindungstyp explizit auf **ssh** setzen:
```
[localhost]
127.0.0.1 ansible_connection=ssh ansible_ssh_user=your_localhost_user
```
---
## 3. panic: pq: SSL is not enabled on the server {#3-panic-pq-ssl-is-not-enabled-on-the-server}

Das bedeutet, dass Ihr Postgres nicht über SSL arbeitet.

### Lösung {#how-to-fix-this-1}

Fügen Sie die Option `sslmode=disable` zur Konfigurationsdatei hinzu:

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

Das bedeutet, dass Sie versuchen, über HTTPS auf ein Repository zuzugreifen, das eine Authentifizierung erfordert.

### Lösung {#how-to-fix-this-2}

* Öffnen Sie die Ansicht **Schlüsselspeicher**.
* Erstellen Sie einen neuen Schlüssel vom Typ `Login with password`.
* Geben Sie Ihren Login für GitHub/BitBucket usw. an.
* Geben Sie das Passwort an. Für GitHub/BitBucket können Sie nicht Ihr Kontopasswort verwenden; stattdessen sollten Sie ein Personal Access Token (PAT) verwenden. Weitere Informationen finden Sie [hier](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).
* Öffnen Sie nach dem Erstellen des Schlüssels die Ansicht **Repositories**, suchen Sie Ihr Repository und geben Sie den Schlüssel an.


---

## 5. Git clone oder pull schlägt zeitweise fehl {#5-git-clone-or-pull-fails-intermittently}

Task-Logs können Meldungen wie `Git pull failed (...), retrying in 2s` enthalten, gefolgt entweder von einem Erfolg oder einem endgültigen Fehlschlag nach mehreren Versuchen.

### Warum das passiert {#why-this-happens-1}

Der Git-Server war vorübergehend nicht erreichbar oder hat einen vorübergehenden Fehler zurückgegeben. Semaphore wiederholt Clone- und Pull-Vorgänge automatisch, bevor der Task als fehlgeschlagen markiert wird.

### Lösung {#how-to-fix-this-3}

1. **Vorübergehende Ausfälle**: Lösen sich in der Regel von selbst. Semaphore wiederholt den Vorgang bis zu `git_attempts`-mal (Standard 4) mit exponentiellem Backoff.
2. **Häufige Fehler**: Erhöhen Sie `git_attempts` in Ihrer Konfiguration oder setzen Sie `SEMAPHORE_GIT_ATTEMPTS`.
3. **Sofortige, dauerhafte Fehler**: Prüfen Sie Repository-URL, Branch, Zugriffsschlüssel und Netzwerkverbindung.

Siehe [Git-Operationen](/admin-guide/configuration/config-file#git-operations) für Konfigurationsdetails.

---

## 6. unable to read LDAP response packet: unexpected EOF {#6-unable-to-read-ldap-response-packet-unexpected-eof}

Höchstwahrscheinlich versuchen Sie, sich über eine unsichere Methode mit dem LDAP-Server zu verbinden, obwohl dieser eine sichere Verbindung (über TLS) erwartet.

### Lösung {#how-to-fix-this-4}

Aktivieren Sie TLS in Ihrer `config.json`-Datei:

```json
...
"ldap_needtls": true
...
```

---

## 7. LDAP Result Code 49 "Invalid Credentials" {#7-ldap-result-code-49-invalid-credentials}

Sie haben ein falsches Passwort oder einen falschen `binddn`.

### Lösung {#how-to-fix-this-5}

Verwenden Sie das Tool `ldapwhoami` und prüfen Sie, ob Ihr binddn funktioniert:

```bash
ldapwhoami\
  -H ldap://ldap.com:389\
  -D "CN=/your/ldap_binddn/value/in/config/file"\
  -x\
  -W
```

Es fragt interaktiv nach dem Passwort und sollte den Code **0** zurückgeben und den angegebenen **DN** ausgeben.

Sie können auch die folgenden Artikel lesen: 
* [ldapsearch: Invalid credentials (49)](https://serverfault.com/q/771549/443463)
* [https://github.com/semaphoreui/semaphore/issues/906](https://github.com/semaphoreui/semaphore/issues/906)

---

## 8. LDAP Result Code 32 "No Such Object" {#8-ldap-result-code-32-no-such-object}

Demnächst verfügbar.
