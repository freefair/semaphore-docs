
# Script Shell/Bash

Semaphore può eseguire script shell tramite `/bin/bash`. Per farlo, creare un template di attività **Bash Script**.

## Creazione di un template Bash {#creating-a-bash-template}

1. Andare nella sezione **Template di attività** e fare clic sul pulsante **Nuovo template**.
2. Selezionare **Bash** come tipo di app.
3. Configurare il template:

| Campo | Descrizione |
|---|---|
| **Nome** | Un nome descrittivo per il template |
| **Repository** | Repository contenente lo script shell |
| **Playbook / Script** | Percorso relativo dello script, ad es. `scripts/deploy.sh` |
| **Gruppi di variabili** | Gruppi di variabili i cui valori vengono iniettati come variabili d'ambiente |

4. Fare clic su **Crea**.
5. Fare clic su **Esegui** per eseguire il template.

## Passaggio di variabili agli script {#passing-variables-to-scripts}

Le variabili dei **Gruppi di variabili** selezionati vengono iniettate come variabili d'ambiente. È possibile accedervi nello script con `$VARIABLE_NAME`:

```bash
#!/bin/bash
echo "Deploying to $TARGET_HOST"
```

## Note {#notes}

- Rendere lo script eseguibile (`chmod +x`) oppure assicurarsi che inizi con uno shebang valido (`#!/bin/bash`).
- Gli script vengono eseguiti in modo non interattivo. Evitare prompt che attendono l'input dell'utente.
- Il codice di uscita `0` indica successo; qualsiasi codice di uscita diverso da zero contrassegna l'attività come fallita.
- Se uno script molto breve non produce alcun output nel log, vedere [L'output dello script Bash è mancante o incompleto](/admin-guide/troubleshooting#bash-script-output-is-missing-or-incomplete) nella guida alla risoluzione dei problemi.
- Per eseguire comandi su host remoti, usare invece [Ansible](./ansible).
