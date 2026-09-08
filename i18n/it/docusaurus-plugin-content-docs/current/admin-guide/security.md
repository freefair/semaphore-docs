# 🔐 Sicurezza

## Introduzione {#introduction}

La sicurezza è una priorità assoluta in Semaphore UI. Che si tratti di automatizzare attività critiche sull'infrastruttura o di gestire l'accesso del team a sistemi sensibili, Semaphore UI è progettato per offrire operazioni robuste e sicure fin da subito. Questa sezione descrive come Semaphore gestisce la sicurezza e cosa considerare quando viene distribuito in produzione.

## Autenticazione e autorizzazione {#authentication--authorization}

Semaphore supporta meccanismi di autenticazione sicura e di autorizzazione flessibile:

- **Metodi di accesso:**
  - **Nome utente/password**<br />Metodo predefinito che utilizza le credenziali memorizzate nel database di Semaphore. Le password vengono sottoposte a hash con un algoritmo robusto (bcrypt).

  - **LDAP**<br />Consente l'integrazione con i servizi di directory aziendali. Supporta il filtraggio di utenti/gruppi e connessioni sicure tramite LDAPS.

  - **OpenID Connect (OIDC)**<br />Abilita il single sign-on con identity provider come Google, Azure AD o Keycloak. Supporta claim personalizzati e mappatura dei gruppi.

- **Autenticazione a due fattori (2FA)**<br />È disponibile la 2FA basata su TOTP, consigliata per tutti gli utenti. Può essere abilitata per singolo utente e supporta codici di recupero opzionali. Vedere le opzioni di configurazione `auth.totp.enabled` e `auth.totp.allow_recovery`.

- **Controllo degli accessi basato sui ruoli**<br />È possibile assegnare agli utenti ruoli diversi, come Admin, Maintainer o Viewer, limitando l'accesso in base alle responsabilità.

- **Gestione delle sessioni**<br />Le sessioni sono protette con cookie HTTP sicuri. I meccanismi di scadenza della sessione e di logout garantiscono un'esposizione minima.
<!-- - **Brute-Force Protection**: Login attempts are rate-limited to prevent brute-force attacks. -->

## Segreti e credenziali {#secrets--credentials}

La gestione sicura dei segreti è una funzionalità fondamentale:

- **Key store cifrato**<br />Le credenziali e le variabili segrete sono cifrate a riposo con la cifratura AES.

- **Isolamento dell'ambiente**<br />I segreti vengono passati ai job solo in fase di esecuzione e non sono esposti direttamente all'ambiente del container.

- **Chiavi SSH e token**<br />Gli utenti sono responsabili del caricamento di chiavi SSH e token validi. Questi vengono cifrati e utilizzati solo durante l'esecuzione delle attività.
- **Integrazione con HashiCorp Vault (Pro)**<br />I segreti possono essere memorizzati in un'istanza Vault esterna. Scegliere lo storage per ogni singolo segreto durante la creazione o la modifica.

## Cifratura dei dati {#data-encryption}

I dati sensibili sono memorizzati nel database in forma cifrata. È necessario impostare l'opzione di configurazione `access_key_encryption` nel file di configurazione per abilitare la cifratura delle Access Key. Deve essere generata con il comando:

```bash
head -c32 /dev/urandom | base64
```

## Esecuzione di codice / playbook non attendibili {#running-untrusted-code--playbooks}

Semaphore esegue playbook e comandi definiti dagli utenti, il che può comportare dei rischi:

- **Isolamento tramite container**<br />Le attività vengono eseguite in container Docker isolati. Questi container non hanno accesso al sistema host.

- **Privilegio minimo**<br />I container vengono eseguiti con permessi minimi e possono essere ulteriormente limitati tramite i flag di Docker.

- **Esecuzione in chroot**<br />Semaphore può eseguire le attività all'interno di una chroot jail per isolare ulteriormente l'ambiente di esecuzione dal sistema host.

- **Utente del processo delle attività**<br />Le attività possono essere eseguite con un utente di sistema dedicato non root (ad esempio `semaphore`) per ridurre l'impatto di eventuali exploit. Questa opzione è facoltativa e può essere configurata in base alle policy di sistema.
<!-- - **Resource Limits**: To prevent abuse, CPU and memory limits can be applied. -->

## Distribuzione sicura {#secure-deployment}

Per garantire che Semaphore venga distribuito in modo sicuro:

- **Usare HTTPS**<br />
    Semaphore supporta HTTPS sia tramite il **supporto TLS integrato** sia tramite un **reverse proxy come Nginx**. Si consiglia vivamente di abilitare HTTPS in produzione.

    Per abilitare il supporto HTTPS integrato, aggiungere il seguente blocco a **config.json**:
    ```json
    {
        ...
        "tls": {
            "enabled": true,
            "cert_file": "/path/to/cert/example.com.cert",
            "key_file": "/path/to/key/example.com.key"
        }
        ...
    }
    ```

- **Eseguire dietro un firewall**<br />Limitare l'accesso a Semaphore UI e al database ai soli IP attendibili.

- **Sicurezza del database**<br />Usare password robuste e limitare l'accesso al database al solo Semaphore.

## Aggiornamenti e gestione delle patch {#updates--patch-management}

Gli aggiornamenti di sicurezza vengono pubblicati regolarmente:

- **Rimanere aggiornati**<br />Utilizzare sempre l'ultima release stabile.

- **Changelog**<br />Esaminare le modifiche su GitHub prima di aggiornare.

- **Aggiornamenti automatici**<br />Se si utilizza Docker, valutare pipeline di automazione per aggiornamenti regolari.

<!-- ## Audit Logs & Monitoring

Semaphore provides basic audit logging:

- **User Activity**: Logins, failed attempts, and task executions are logged.
- **Configuration Changes**: Changes to settings, projects, and credentials are logged with timestamps.
- **Integration**: Logs can be forwarded to centralized logging systems like ELK or Prometheus exporters. -->

<!-- ## Backups & Disaster Recovery

To protect against data loss:

- **What to Back Up**: Semaphore database, configuration file, and secret storage.
- **How to Restore**: Follow the backup/restore guide in the admin docs.
- **Testing**: Periodically test restoring backups in a staging environment. -->

<!-- ## Common Vulnerabilities & Hardening Tips

- **Disable User Registration** if not needed to prevent unauthorized access.
- **Use Strong Passwords** and enforce complexity rules.
- **Limit Task Concurrency** to avoid resource exhaustion.
- **Restrict Access to Secrets** by managing team permissions carefully. -->

<!-- ## Compliance & Data Privacy

Semaphore collects minimal user data:

- **Data Handling**: Emails, IP logs, and session data are stored securely.
- **User Deletion**: Admins can delete user accounts and associated data upon request.
- **GDPR Compliance**: Self-hosted users are responsible for local compliance. -->

## Segnalazione delle vulnerabilità {#reporting-vulnerabilities}

Avete trovato una vulnerabilità? Aiutateci a mantenere Semaphore sicuro:

- **Divulgazione responsabile**<br />Inviare un'email a `security@semaphoreui.com`.
 
### Tempi obiettivo per la risoluzione delle vulnerabilità {#vulnerability-resolution-targets}

Puntiamo a risolvere le vulnerabilità segnalate entro le seguenti finestre temporali:

- Critica: entro 30 giorni
- Alta: entro 60 giorni
- Media: entro 90 giorni
- Bassa: best effort, in genere entro 180 giorni

Per i problemi attivamente sfruttati che riguardano le ultime release stabili possono essere pubblicate patch fuori ciclo.

### Strumenti per la sicurezza del codice {#code-security-tooling}

Utilizziamo CodeQL, Codacy, Snyk e Renovate per analizzare il codice sorgente e le dipendenze e per automatizzare l'aggiornamento delle dipendenze.
- **Nessun exploit pubblico**<br />Non divulgare pubblicamente le vulnerabilità finché non sono state corrette.

- **Riconoscimenti**<br />I ricercatori di sicurezza possono essere citati nelle note di rilascio, se lo desiderano.

