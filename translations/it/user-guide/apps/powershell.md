# PowerShell

Semaphore può eseguire script PowerShell su host Windows (o da un runner Windows). Per farlo, creare un template di attività **PowerShell**.

<a id="creating-a-powershell-template"></a>

## Creazione di un template PowerShell

1. Andare nella sezione **Template di attività** e fare clic sul pulsante **Nuovo template**.
2. Selezionare **PowerShell** come tipo di app.
3. Configurare il template:

| Campo | Descrizione |
|---|---|
| **Nome** | Un nome descrittivo per il template |
| **Repository** | Repository contenente lo script `.ps1` |
| **Playbook / Script** | Percorso relativo dello script, ad es. `scripts/deploy.ps1` |
| **Gruppi di variabili** | Gruppi di variabili i cui valori vengono iniettati come variabili d'ambiente |

4. Fare clic su **Crea**.
5. Fare clic su **Esegui** per eseguire il template.

<a id="passing-variables-to-scripts"></a>

## Passaggio di variabili agli script

Le variabili dei **Gruppi di variabili** selezionati vengono iniettate come variabili d'ambiente prima dell'esecuzione dello script. È possibile accedervi in PowerShell con `$env:VARIABLE_NAME`:

```powershell
Write-Host "Deploying to $env:TARGET_HOST"
```

<a id="running-on-windows-hosts"></a>

## Esecuzione su host Windows

I template PowerShell richiedono una delle seguenti condizioni:
- Un **runner Windows**: un runner Semaphore distribuito su un host Windows. Vedere [Runner](../../../../docs/admin-guide/runners.md).
- Il server Semaphore stesso in esecuzione su Windows.

<a id="notes"></a>

## Note

- Gli script vengono eseguiti in modo non interattivo. Evitare prompt che richiedono l'input dell'utente.
- Il codice di uscita `0` indica successo; qualsiasi codice di uscita diverso da zero contrassegna l'attività come fallita.
