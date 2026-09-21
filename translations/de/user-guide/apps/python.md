# Python

Semaphore kann Python-Skripte direkt ausführen. Erstellen Sie dazu ein **Python**-Task-Template.

<a id="creating-a-python-template"></a>

## Ein Python-Template erstellen

1. Öffnen Sie den Bereich **Task-Templates** und klicken Sie auf die Schaltfläche **Neues Template**.
2. Wählen Sie **Python** als App-Typ.
3. Konfigurieren Sie das Template:

| Feld | Beschreibung |
|---|---|
| **Name** | Ein aussagekräftiger Name für das Template |
| **Repository** | Repository, das Ihr `.py`-Skript enthält |
| **Playbook / Skript** | Relativer Pfad zum Skript, z. B. `scripts/deploy.py` |
| **Variablengruppen** | Variablengruppen, deren Werte als Umgebungsvariablen eingefügt werden |

4. Klicken Sie auf **Erstellen**.
5. Klicken Sie auf **Ausführen**, um das Template auszuführen.

<a id="passing-variables-to-scripts"></a>

## Variablen an Skripte übergeben

Variablen aus den ausgewählten **Variablengruppen** werden als Umgebungsvariablen eingefügt. Greifen Sie in Python mit `os.environ` darauf zu:

```python
import os

target = os.environ.get("TARGET_HOST")
print(f"Deploying to {target}")
```

<a id="python-version-and-dependencies"></a>

## Python-Version und Abhängigkeiten

Semaphore verwendet die `python3`-Binärdatei, die in der Ausführungsumgebung im `PATH` liegt.

- **Binär-/Paketinstallation**: Stellen Sie sicher, dass das richtige `python3` auf dem Host installiert ist.
- **Docker**: Verwenden Sie ein benutzerdefiniertes Image mit der erforderlichen Python-Version.
- **Docker (zusätzliche Pakete)**: Binden Sie eine `requirements.txt` unter `/etc/semaphore/requirements.txt` im Server- oder Runner-Container ein. Semaphore installiert sie bei jedem Containerstart in die mitgelieferte virtuelle Python-Umgebung. Siehe [Zusätzliche Python-Abhängigkeiten installieren](../../../../docs/admin-guide/installation/docker.md#installing-additional-python-dependencies).

<a id="notes"></a>

## Hinweise

- Skripte laufen nicht interaktiv.
- Exit-Code `0` bedeutet Erfolg; jeder Exit-Code ungleich null markiert den Task als fehlgeschlagen.
