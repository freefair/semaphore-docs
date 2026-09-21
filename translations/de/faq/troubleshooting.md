# Fehlerbehebung

<a id="runner-prints-error-404"></a>

## Runner gibt Fehler 404 aus

<a id="how-to-fix"></a>

### Lösung

[Getting 401 error code from Runner](https://github.com/semaphoreui/semaphore/discussions/1873?converting=1)

---

<a id="gathering-facts-issue-for-localhost"></a>

## Problem mit Gathering Facts für localhost

Das Problem kann bei Semaphore UI auftreten, wenn es über [Snap](https://snapcraft.io/semaphore) oder [Docker](https://hub.docker.com/r/semaphoreui/semaphore) installiert wurde.

```
4:10:16 PM
TASK [Gathering Facts] *********************************************************
4:10:17 PM
fatal: [localhost]: FAILED! => changed=false
```

<a id="why-this-happens"></a>

### Warum das passiert

Weitere Informationen zur Verwendung von localhost in Ansible finden Sie im Artikel [Implicit 'localhost'](https://docs.ansible.com/ansible/latest/inventory/implicit_localhost.html).

Ansible versucht, Facts lokal zu sammeln, aber Ansible befindet sich in einem eingeschränkten, isolierten Container, der dies nicht erlaubt.

<a id="how-to-fix-this"></a>

### Lösung

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
<a id="panic-pq-ssl-is-not-enabled-on-the-server"></a>

## panic: pq: SSL is not enabled on the server

Das bedeutet, dass Ihr Postgres nicht über SSL arbeitet.

<a id="how-to-fix-this-1"></a>

### Lösung

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
<a id="fatal-bad-numeric-config-value-0-for-git_terminal_prompt-invalid-unit"></a>

## fatal: bad numeric config value '0' for 'GIT_TERMINAL_PROMPT': invalid unit

Das bedeutet, dass Sie versuchen, über HTTPS auf ein Repository zuzugreifen, das eine Authentifizierung erfordert.

<a id="how-to-fix-this-2"></a>

### Lösung

* Öffnen Sie die Ansicht **Schlüsselspeicher**.
* Erstellen Sie einen neuen Schlüssel vom Typ `Login with password`.
* Geben Sie Ihren Login für GitHub/BitBucket usw. an.
* Geben Sie das Passwort an. Für GitHub/BitBucket können Sie nicht Ihr Kontopasswort verwenden; stattdessen sollten Sie ein Personal Access Token (PAT) verwenden. Weitere Informationen finden Sie [hier](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).
* Öffnen Sie nach dem Erstellen des Schlüssels die Ansicht **Repositories**, suchen Sie Ihr Repository und geben Sie den Schlüssel an.

---

<a id="git-clone-or-pull-fails-intermittently"></a>

## Git clone oder pull schlägt zeitweise fehl

Task-Logs können Meldungen wie `Git pull failed (...), retrying in 2s` enthalten, gefolgt entweder von einem Erfolg oder einem endgültigen Fehlschlag nach mehreren Versuchen.

<a id="why-this-happens-1"></a>

### Warum das passiert

Der Git-Server (GitHub, GitLab, Bitbucket oder eine selbst gehostete Instanz) war vorübergehend nicht erreichbar, hat einen vorübergehenden HTTP-Fehler zurückgegeben, oder das Netzwerk zwischen Semaphore und dem Server hatte einen kurzen Ausfall. Semaphore wiederholt Clone- und Pull-Vorgänge automatisch, bevor der Task als fehlgeschlagen markiert wird.

<a id="how-to-fix-this-3"></a>

### Lösung

1. **Vorübergehende Ausfälle**: Lösen sich in der Regel von selbst. Semaphore wiederholt den Vorgang bis zu `git_attempts`-mal (Standard 4) mit exponentiellem Backoff zwischen den Versuchen.
2. **Häufige Fehler**: Erhöhen Sie die Anzahl der Versuche in Ihrer Konfiguration:

```json
{
  "git_attempts": 8
}
```

Oder über eine Umgebungsvariable:

```bash
export SEMAPHORE_GIT_ATTEMPTS=8
```

3. **Sofortige, dauerhafte Fehler**: Wiederholungen helfen hier nicht. Prüfen Sie Repository-URL, Branch-Name, Zugriffsschlüssel und die Netzwerkverbindung vom Semaphore-Server bzw. Runner-Host aus.

Siehe [Git-Operationen](../../../docs/admin-guide/configuration/config-file.md#git-operations) für Details zu `git_client` und `git_attempts`.

---

<a id="bash-script-output-is-missing-or-incomplete"></a>

## Ausgabe eines Bash-Skripts fehlt oder ist unvollständig

Ein Bash-Task wird erfolgreich abgeschlossen, aber das Log zeigt wenig oder keine Ausgabe von `echo`, `printf` oder anderen Befehlen – insbesondere, wenn das Skript schnell beendet wird.

<a id="why-this-happens-2"></a>

### Warum das passiert

Semaphore erfasst stdout und stderr von Shell-Befehlen, während sie laufen. Sehr kurze Skripte können beendet sein, bevor die gesamte gepufferte Ausgabe gelesen wurde, sodass die letzten Zeilen im Task-Log fehlen können.

<a id="how-to-fix-this-4"></a>

### Lösung

1. **Aktualisieren**: Neuere Semaphore-Versionen lesen die Prozessausgabe vollständig aus, bevor ein Task als abgeschlossen markiert wird. Aktualisieren Sie Server und Runner, wenn Sie eine ältere Version verwenden.
2. **Ausgabe im Skript leeren (flush)**, wenn Sie eine garantierte Zustellung benötigen:

```bash
#!/bin/bash
echo "Starting deploy"
echo "Done" >&2
```

Für kritische Diagnosen schreiben Sie in eine Datei innerhalb des Repository-Arbeitsverzeichnisses und geben sie am Ende des Skripts mit `cat` aus.
3. **Stilles vorzeitiges Beenden vermeiden**: Verwenden Sie `set -euo pipefail` und explizite Fehlermeldungen, damit Fehler auch bei knapper Ausgabe sichtbar sind.

---

<a id="unable-to-read-ldap-response-packet-unexpected-eof"></a>

## unable to read LDAP response packet: unexpected EOF

Höchstwahrscheinlich versuchen Sie, sich über eine unsichere Methode mit dem LDAP-Server zu verbinden, obwohl dieser eine sichere Verbindung (über TLS) erwartet.

<a id="how-to-fix-this-5"></a>

### Lösung

Aktivieren Sie TLS in Ihrer `config.json`-Datei:

```json
...
"ldap_needtls": true
...
```

---

<a id="ldap-result-code-49-invalid-credentials"></a>

## LDAP Result Code 49 "Invalid Credentials"

Sie haben ein falsches Passwort oder einen falschen `binddn`.

<a id="how-to-fix-this-6"></a>

### Lösung

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

<a id="ldap-result-code-32-no-such-object"></a>

## LDAP Result Code 32 "No Such Object"

Das Verzeichnis enthält keinen Eintrag unter dem Distinguished Name, nach dem Semaphore
gefragt hat. Fast immer ist `ldap_searchdn` falsch, seltener `ldap_binddn`.

<a id="how-to-fix-this-7"></a>

### Lösung

Prüfen Sie mit denselben Zugangsdaten, die Semaphore verwendet, ob die Suchbasis existiert:

```bash
ldapsearch\
  -H ldap://ldap.example.com:389\
  -D "CN=/your/ldap_binddn/value/in/config/file"\
  -b "/your/ldap_searchdn/value/in/config/file"\
  -x\
  -W\
  -s base
```

- Ergebniscode **32** bei diesem Befehl bedeutet, dass die Basis selbst nicht existiert.
  Korrigieren Sie `ldap_searchdn` in `config.json`; die übliche Ursache ist ein Tippfehler
  in einer Komponente, etwa `OU=Users` statt des tatsächlichen `OU=People`.
- Ergebniscode **0** bedeutet, dass die Basis in Ordnung ist und das Problem in
  `ldap_searchfilter` liegt: Er trifft auf keinen Eintrag unterhalb dieser Basis zu.

Die Bedeutung der einzelnen Optionen finden Sie unter [LDAP und AD](../../../docs/admin-guide/authentication/ldap.md).
