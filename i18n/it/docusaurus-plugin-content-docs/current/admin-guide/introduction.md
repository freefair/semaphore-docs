# Introduzione

Benvenuti nella Guida all'amministrazione di Semaphore UI. Questa guida fornisce informazioni complete per installare, configurare e manutenere la propria istanza di Semaphore.

## Che cos'è Semaphore UI? {#what-is-semaphore-ui}

Semaphore UI è un'interfaccia web moderna e open source per l'esecuzione di attività di automazione. È progettata per essere un'alternativa leggera, veloce e facile da usare alle piattaforme di automazione più complesse.

Consente di gestire ed eseguire in modo sicuro task per:
*   Playbook **Ansible**
*   Infrastructure as code con **Terraform/OpenTofu**
*   Script **PowerShell** e **Shell**
*   Script **Python**

## Funzionalità principali e filosofia {#core-features--philosophy}

Comprendere i principi di progettazione di Semaphore aiuta a sfruttarlo al meglio:

*   **Leggero e performante**: Semaphore è scritto in **Go** e distribuito come **singolo file binario**. Ha requisiti di risorse minimi (CPU/RAM) e non richiede dipendenze esterne come Kubernetes, Docker o una JVM. Questo lo rende veloce, efficiente e facile da distribuire.
*   **Semplice da installare e manutenere**: Semaphore può essere operativo in pochi minuti. L'installazione può ridursi al download del binario e alla sua esecuzione. L'architettura semplice rende immediati aggiornamenti e manutenzione.
*   **Distribuzione flessibile**: Può essere eseguito come binario, come servizio systemd o in un container Docker. È adatto a qualsiasi contesto, dall'homelab personale agli ambienti enterprise.
*   **Self-hosted e sicuro**: Semaphore è una soluzione self-hosted. Tutti i dati, le credenziali e i log rimangono sulla propria infrastruttura, garantendo il pieno controllo. Le credenziali sono sempre cifrate nel database.
*   **Integrazioni potenti**: Pur essendo semplice, Semaphore supporta funzionalità avanzate come l'autenticazione LDAP/OpenID, un controllo degli accessi basato sui ruoli (RBAC) dettagliato per ogni progetto, runner remoti per scalare l'esecuzione dei task e un'API REST completa per l'accesso programmatico.

Questa guida illustra come configurare e gestire queste funzionalità in base alle proprie esigenze.
