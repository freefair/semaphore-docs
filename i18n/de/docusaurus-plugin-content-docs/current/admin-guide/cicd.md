# Pipelines

Semaphore unterstützt einfache Pipelines mit `build`- und `deploy`-Aufgaben. 

Semaphore übergibt die Variable `semaphore_vars` an jedes Ansible-Playbook, das es ausführt.

Sie können sie in Ihren Ansible-Tasks verwenden, um zu ermitteln, welcher Aufgabentyp ausgeführt wurde, welche Version gebaut oder bereitgestellt werden soll, wer die Aufgabe gestartet hat usw.

---

Beispiel für `semaphore_vars` bei `build`-Aufgaben:

```yaml
semaphore_vars:
    task_details:
        type: build
        username: user123
        message: New version of some feature
        target_version: 1.5.33
```

Beispiel für `semaphore_vars` bei `deploy`-Aufgaben:

```yaml
semaphore_vars:
    task_details:
        type: deploy
        username: user123
        message: Deploy new feature to servers
        incoming_version: 1.5.33
```

Für **Bash**-, **PowerShell**- und **Python**-Vorlagen stellt Semaphore dieselben `task_details`-Werte als Umgebungsvariablen bereit:

| `task_details`-Feld | Umgebungsvariable | Hinweise |
| --- | --- | --- |
| `type` | `SEMAPHORE_TASK_DETAILS_TYPE` | `build` oder `deploy` |
| `username` | `SEMAPHORE_TASK_DETAILS_USERNAME` | Benutzer, der die Aufgabe gestartet hat |
| `message` | `SEMAPHORE_TASK_DETAILS_MESSAGE` | Aufgabennachricht |
| `target_version` | `SEMAPHORE_TASK_DETAILS_TARGET_VERSION` | Vorhanden bei `build`-Aufgaben |
| `incoming_version` | `SEMAPHORE_TASK_DETAILS_INCOMING_VERSION` | Vorhanden bei `deploy`-Aufgaben |

Beispiel für Bash:

```bash
echo "$SEMAPHORE_TASK_DETAILS_TYPE"
echo "$SEMAPHORE_TASK_DETAILS_TARGET_VERSION"
```

Beispiel für PowerShell:

```powershell
$env:SEMAPHORE_TASK_DETAILS_TYPE
$env:SEMAPHORE_TASK_DETAILS_INCOMING_VERSION
```

Beispiel für Python:

```python
import os

task_type = os.getenv("SEMAPHORE_TASK_DETAILS_TYPE")
target_version = os.getenv("SEMAPHORE_TASK_DETAILS_TARGET_VERSION")
incoming_version = os.getenv("SEMAPHORE_TASK_DETAILS_INCOMING_VERSION")
```

### Build {#build}

Dieser Aufgabentyp dient zum Erstellen von [Artefakten](https://en.wikipedia.org/wiki/Artifact\_\(software\_development\)). Jede Build-Aufgabe erhält eine automatisch generierte Version. Verwenden Sie in Ihrem Ansible-Playbook die Variable `semaphore_vars.task_details.target_version`, um zu ermitteln, welche Version des Artefakts erstellt werden soll. Nach der Erstellung kann das Artefakt für die Bereitstellung verwendet werden.

---

Beispiel für eine `build`-Ansible-Rolle:

1. App-Quellcode von GitHub abrufen
2. Quellcode kompilieren
3. Erstellte Binärdatei in ein Tarball mit dem Namen `app-{{semaphore_vars.task_details.target_version}}.tar.gz` packen
4. `app-{{semaphore_vars.task_details.target_version}}.tar.gz` in einen S3-Bucket hochladen



### Deploy {#deploy}

Dieser Aufgabentyp dient zum Bereitstellen von Artefakten auf Zielservern. Jede Deploy-Aufgabe ist mit einer Build-Aufgabe verknüpft. Verwenden Sie in Ihrem Ansible-Playbook die Variable `semaphore_vars.task_details.incoming_version`, um zu ermitteln, welche Version des Artefakts bereitgestellt werden soll.

---

Beispiel für eine `deploy`-Ansible-Rolle:

1. `app-{{semaphore_vars.task_details.incoming_version}}.tar.gz` aus einem S3-Bucket auf die Zielserver herunterladen
2. `app-{{semaphore_vars.task_details.incoming_version}}.tar.gz` in das Zielverzeichnis entpacken
3. Konfigurationsdateien erstellen oder aktualisieren
4. App-Dienst neu starten

