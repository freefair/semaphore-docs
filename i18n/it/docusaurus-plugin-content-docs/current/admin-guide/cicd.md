# Pipeline

Semaphore supporta pipeline semplici tramite task di tipo `build` e `deploy`. 

Semaphore passa la variabile `semaphore_vars` a ogni playbook Ansible che esegue.

È possibile usarla nei task Ansible per sapere quale tipo di task è stato eseguito, quale versione deve essere compilata o distribuita, chi ha avviato il task e così via.

---

Esempio di `semaphore_vars` per i task `build`:

```yaml
semaphore_vars:
    task_details:
        type: build
        username: user123
        message: New version of some feature
        target_version: 1.5.33
```

Esempio di `semaphore_vars` per i task `deploy`:

```yaml
semaphore_vars:
    task_details:
        type: deploy
        username: user123
        message: Deploy new feature to servers
        incoming_version: 1.5.33
```

Per i template **Bash**, **PowerShell** e **Python**, Semaphore fornisce gli stessi valori di `task_details` come variabili d'ambiente:

| Campo di `task_details` | Variabile d'ambiente | Note |
| --- | --- | --- |
| `type` | `SEMAPHORE_TASK_DETAILS_TYPE` | `build` o `deploy` |
| `username` | `SEMAPHORE_TASK_DETAILS_USERNAME` | Utente che ha avviato il task |
| `message` | `SEMAPHORE_TASK_DETAILS_MESSAGE` | Messaggio del task |
| `target_version` | `SEMAPHORE_TASK_DETAILS_TARGET_VERSION` | Presente per i task `build` |
| `incoming_version` | `SEMAPHORE_TASK_DETAILS_INCOMING_VERSION` | Presente per i task `deploy` |

Esempio per Bash:

```bash
echo "$SEMAPHORE_TASK_DETAILS_TYPE"
echo "$SEMAPHORE_TASK_DETAILS_TARGET_VERSION"
```

Esempio per PowerShell:

```powershell
$env:SEMAPHORE_TASK_DETAILS_TYPE
$env:SEMAPHORE_TASK_DETAILS_INCOMING_VERSION
```

Esempio per Python:

```python
import os

task_type = os.getenv("SEMAPHORE_TASK_DETAILS_TYPE")
target_version = os.getenv("SEMAPHORE_TASK_DETAILS_TARGET_VERSION")
incoming_version = os.getenv("SEMAPHORE_TASK_DETAILS_INCOMING_VERSION")
```

### Build {#build}

Questo tipo di task serve a creare [artefatti](https://en.wikipedia.org/wiki/Artifact\_\(software\_development\)). Ogni task di build ha una versione generata automaticamente. Usare la variabile `semaphore_vars.task_details.target_version` nel playbook Ansible per sapere quale versione dell'artefatto deve essere creata. Una volta creato, l'artefatto può essere usato per il deploy.

---

Esempio di ruolo Ansible `build`:

1. Ottenere il codice sorgente dell'app da GitHub
2. Compilare il codice sorgente
3. Impacchettare il binario creato in un tarball chiamato `app-{{semaphore_vars.task_details.target_version}}.tar.gz`
4. Inviare `app-{{semaphore_vars.task_details.target_version}}.tar.gz` a un bucket S3



### Deploy {#deploy}

Questo tipo di task serve a distribuire gli artefatti sui server di destinazione. Ogni task di deploy è associato a un task di build. Usare la variabile `semaphore_vars.task_details.incoming_version` nel playbook Ansible per sapere quale versione dell'artefatto deve essere distribuita.

---

Esempio di ruolo Ansible `deploy`:

1. Scaricare `app-{{semaphore_vars.task_details.incoming_version}}.tar.gz` da un bucket S3 sui server di destinazione
2. Estrarre `app-{{semaphore_vars.task_details.incoming_version}}.tar.gz` nella directory di destinazione
3. Creare o aggiornare i file di configurazione
4. Riavviare il servizio dell'app

