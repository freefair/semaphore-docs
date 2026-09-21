# Workspace

![Scheda Workspaces di un Task Template](../../../../../static/assets/template-workspaces.webp)

Semaphore offre il supporto integrato per i workspace di Terraform, consentendo di gestire più ambienti e configurazioni all'interno di un singolo Project. Questa funzionalità aiuta a mantenere file di stato separati per ambienti diversi come sviluppo, staging e produzione.

<a id="features"></a>

## Funzionalità

- **Gestione dei workspace**: creare, cambiare ed eliminare i workspace direttamente dall'interfaccia di Semaphore.
- **Isolamento dello stato**: ogni workspace mantiene il proprio file di stato, evitando conflitti tra gli ambienti.
- **Variabili d'ambiente**: configurare variabili d'ambiente specifiche per ciascun workspace.
- **Selezione del workspace**: scegliere il workspace di destinazione durante l'esecuzione dei comandi Terraform.

<a id="using-workspaces-in-semaphore"></a>

## Utilizzo dei workspace in Semaphore

<a id="creating-a-workspace"></a>

### Creazione di un workspace

Nella sezione **Workspaces** del Task Template Terraform/OpenTofu a cui si desidera aggiungere un workspace, seguire questi passaggi:

1. Fare clic sul pulsante ➕.
2. Nel menu visualizzato, selezionare **New Workspace**.
3. Nella finestra di dialogo modale, inserire il nome del workspace e selezionare la chiave SSH da utilizzare per clonare i moduli.
4. Fare clic sul pulsante **Create** per aggiungere il nuovo workspace al Task Template.
5. Ora è possibile utilizzare questo workspace per eseguire i Task.

<a id="switching-workspaces"></a>

### Cambio di workspace

È possibile impostare il workspace predefinito di un Task Template Terraform/OpenTofu facendo clic sul pulsante **MAKE DEFAULT**.

<a id="workspace-specific-variables"></a>

### Variabili specifiche del workspace

Attualmente Semaphore non supporta variabili specifiche per workspace.
