
# Workspace

Semaphore offre il supporto integrato per i workspace di Terraform, consentendo di gestire più ambienti e configurazioni all'interno di un singolo progetto. Questa funzionalità aiuta a mantenere file di stato separati per ambienti diversi, come sviluppo, staging e produzione.

## Funzionalità {#features}

- **Gestione dei workspace**: creare, cambiare ed eliminare workspace direttamente dall'interfaccia di Semaphore.
- **Isolamento dello stato**: ogni workspace mantiene il proprio file di stato, evitando conflitti tra ambienti.
- **Variabili d'ambiente**: configurare variabili d'ambiente specifiche per workspace.
- **Selezione del workspace**: scegliere il workspace di destinazione durante l'esecuzione dei comandi Terraform.

## Utilizzo dei workspace in Semaphore {#using-workspaces-in-semaphore}

### Creazione di un workspace {#creating-a-workspace}

Nella sezione **Workspace** del modello Terraform/OpenTofu a cui si desidera aggiungere un workspace, procedere come segue:

1. Fare clic sul pulsante ➕.  
2. Nel menu che appare, selezionare **Nuovo workspace**.  
3. Nella finestra di dialogo, inserire il nome del workspace e selezionare la chiave SSH da utilizzare per clonare i moduli.  
4. Fare clic sul pulsante **Crea** per aggiungere il nuovo workspace al modello.  
5. Ora è possibile utilizzare questo workspace per eseguire i task.


### Cambio di workspace {#switching-workspaces}

È possibile impostare il workspace predefinito per un modello Terraform/OpenTofu facendo clic sul pulsante **IMPOSTA COME PREDEFINITO**.


### Variabili specifiche per workspace {#workspace-specific-variables}

Semaphore attualmente non supporta variabili specifiche per workspace.
