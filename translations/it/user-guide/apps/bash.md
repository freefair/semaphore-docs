# Script shell/Bash

Semaphore può eseguire script shell tramite `/bin/bash`. Per farlo, creare un Task Template di tipo **Bash Script**.

<a id="creating-a-bash-template"></a>

## Creazione di un Task Template Bash

1. Andare nella sezione **Task Templates** e fare clic sul pulsante **New Template**.
2. Selezionare **Bash** come tipo di App.
3. Configurare il Task Template:

| Campo | Descrizione |
|---|---|
| **Name** | Un nome descrittivo per il Task Template |
| **Repository** | Il Repository che contiene lo script shell |
| **Playbook / Script** | Percorso relativo dello script, ad esempio `scripts/deploy.sh` |
| **Variable Groups** | I Variable Group i cui valori vengono iniettati come variabili d'ambiente |

4. Fare clic su **Create**.
5. Fare clic su **Run** per eseguire il Task Template. La finestra di dialogo New Task per un Task Template di script contiene solo il messaggio facoltativo, oltre alle variabili di survey e ai prompt se il Task Template li definisce.

![Finestra di dialogo New Task per un Task Template Bash](../../../../static/assets/task-new-bash.webp)

<a id="passing-variables-to-scripts"></a>

## Passaggio delle variabili agli script

Le variabili dei **Variable Group** selezionati vengono iniettate come variabili d'ambiente. Nello script è possibile accedervi con `$VARIABLE_NAME`:

```bash
#!/bin/bash
echo "Deploying to $TARGET_HOST"
```

<a id="notes"></a>

## Note

- Rendere lo script eseguibile (`chmod +x`) oppure assicurarsi che inizi con uno shebang valido (`#!/bin/bash`).
- Gli script vengono eseguiti in modo non interattivo. Evitare richieste che attendono l'input dell'utente.
- Il codice di uscita `0` indica il successo; qualsiasi codice di uscita diverso da zero segna il Task come fallito.
- Se uno script molto breve non produce alcun output nel log, vedere [L'output dello script Bash è mancante o incompleto](../../../../docs/faq/troubleshooting.md#bash-script-output-is-missing-or-incomplete) nella guida alla risoluzione dei problemi.
- Per eseguire comandi su host remoti, utilizzare invece [Ansible](ansible.md).
