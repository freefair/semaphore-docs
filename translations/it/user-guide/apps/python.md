# Python

Semaphore può eseguire direttamente script Python. Per farlo, creare un template di attività **Python**.

<a id="creating-a-python-template"></a>

## Creazione di un template Python

1. Andare nella sezione **Template di attività** e fare clic sul pulsante **Nuovo template**.
2. Selezionare **Python** come tipo di app.
3. Configurare il template:

| Campo | Descrizione |
|---|---|
| **Nome** | Un nome descrittivo per il template |
| **Repository** | Repository contenente lo script `.py` |
| **Playbook / Script** | Percorso relativo dello script, ad es. `scripts/deploy.py` |
| **Gruppi di variabili** | Gruppi di variabili i cui valori vengono iniettati come variabili d'ambiente |

4. Fare clic su **Crea**.
5. Fare clic su **Esegui** per eseguire il template.

<a id="passing-variables-to-scripts"></a>

## Passaggio di variabili agli script

Le variabili dei **Gruppi di variabili** selezionati vengono iniettate come variabili d'ambiente. È possibile accedervi in Python con `os.environ`:

```python
import os

target = os.environ.get("TARGET_HOST")
print(f"Deploying to {target}")
```

<a id="python-version-and-dependencies"></a>

## Versione di Python e dipendenze

Semaphore utilizza il binario `python3` presente nel `PATH` dell'ambiente di esecuzione.

- **Installazione da binario/pacchetto**: assicurarsi che sull'host sia installato il `python3` corretto.
- **Docker**: usare un'immagine personalizzata con la versione di Python richiesta.
- **Docker (pacchetti aggiuntivi)**: montare un file `requirements.txt` in `/etc/semaphore/requirements.txt` nel container del server o del runner. Semaphore lo installa nell'ambiente virtuale Python incluso a ogni avvio del container. Vedere [Installazione di dipendenze Python aggiuntive](../../../../docs/admin-guide/installation/docker.md#installing-additional-python-dependencies).

<a id="notes"></a>

## Note

- Gli script vengono eseguiti in modo non interattivo.
- Il codice di uscita `0` indica successo; qualsiasi codice di uscita diverso da zero contrassegna l'attività come fallita.
