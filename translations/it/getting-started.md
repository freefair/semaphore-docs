# Primi passi

Questa pagina guida da un'installazione nuova alla prima attività eseguita con successo. Ogni passaggio rimanda alla pagina con i dettagli.

<a id="from-zero-to-first-task"></a>

## Da zero alla prima attività

1. **Installare Semaphore** con il metodo preferito: [Installazione](../../docs/admin-guide/installation.md).
2. **Accedere** con l'utente amministratore creato durante la configurazione, oppure tramite le variabili `SEMAPHORE_ADMIN_*` in Docker.
3. **Creare un progetto.** Un progetto isola tra loro team, infrastrutture o applicazioni: [Progetti](../../docs/user-guide/projects.md).
4. **Collegare ciò di cui l'automazione ha bisogno:**
   - Codice sorgente con playbook, moduli o script: [Repository](../../docs/user-guide/repositories.md).
   - Chiavi SSH, token e password: [Key Store](../../docs/user-guide/key-store.md).
   - Host di destinazione e impostazioni di connessione: [Inventory](../../docs/user-guide/inventory.md).
   - Variabili riutilizzabili: [Gruppi di variabili](../../docs/user-guide/environment.md).
5. **Creare un template di attività ed eseguirlo.** Scegliere la guida per il proprio strumento: [Ansible](../../docs/user-guide/apps/ansible.md), [Terraform/OpenTofu](../../docs/user-guide/apps/terraform/README.md), [Shell](../../docs/user-guide/apps/bash.md), [PowerShell](../../docs/user-guide/apps/powershell.md) o [Python](../../docs/user-guide/apps/python.md). Quindi eseguirlo e seguirne l'andamento: [Attività](../../docs/user-guide/tasks.md).
6. **Automatizzare e rendere operativo:**
   - Eseguire in base a una pianificazione: [Pianificazioni](../../docs/user-guide/schedules.md).
   - Controllare chi può fare cosa: [Team e ruoli personalizzati](../../docs/user-guide/team.md).
   - Ricevere avvisi sui risultati: [Notifiche](../../docs/admin-guide/notifications.md).

<a id="key-concepts"></a>

## Concetti chiave

Questi termini compaiono ovunque nell'interfaccia.

| Termine | Significato |
|------|---------|
| **Progetto** | L'unità principale di separazione. Ogni progetto ha i propri repository, chiavi, inventory, template e team. [Progetti](../../docs/user-guide/projects.md) |
| **Repository** | Un repository Git o un percorso locale in cui risiedono playbook, moduli o script. [Repository](../../docs/user-guide/repositories.md) |
| **Inventory** | Host, gruppi e impostazioni di connessione per le esecuzioni in stile Ansible. [Inventory](../../docs/user-guide/inventory.md) |
| **Gruppo di variabili** | Variabili riutilizzabili e configurazione dell'ambiente, chiamato anche Environment. [Gruppi di variabili](../../docs/user-guide/environment.md) |
| **Key Store** | Credenziali cifrate come chiavi SSH, token e password. [Key Store](../../docs/user-guide/key-store.md) |
| **Template di attività** | La definizione di un'esecuzione: app, repository, inventory, variabili e opzioni. [Template di attività](../../docs/user-guide/task-templates/README.md) |
| **Attività** | Una singola esecuzione di un template, con il relativo log e stato. [Attività](../../docs/user-guide/tasks.md) |
| **Workflow** | Un grafo di template con diramazioni, approvazioni e ritardi. Funzionalità Pro. [Workflow](../../docs/user-guide/workflows.md) |
| **Runner** | Dove vengono eseguite le attività: il server stesso o un runner remoto. [Runner](../../docs/admin-guide/runners.md) |

<a id="next-steps"></a>

## Passaggi successivi

- Mettere Semaphore dietro TLS con un [reverse proxy](../../docs/admin-guide/reverse-proxy/README.md).
- Collegare il proprio identity provider: [LDAP](../../docs/admin-guide/authentication/ldap.md) o [OpenID Connect](../../docs/admin-guide/authentication/openid.md).
- Pilotare Semaphore da CI o script con l'[API](../../docs/reference/api.md) e la [CLI](../../docs/reference/cli/README.md).
