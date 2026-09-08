# 🔐 Sicherheit

## Einführung {#introduction}

Sicherheit hat in Semaphore UI höchste Priorität. Ob Sie kritische Infrastrukturaufgaben automatisieren oder den Teamzugriff auf sensible Systeme verwalten – Semaphore UI ist darauf ausgelegt, von Haus aus einen robusten und sicheren Betrieb zu bieten. Dieser Abschnitt beschreibt, wie Semaphore mit Sicherheit umgeht und was Sie beim Einsatz in der Produktion beachten sollten.

## Authentifizierung & Autorisierung {#authentication--authorization}

Semaphore unterstützt sichere Authentifizierung und flexible Autorisierungsmechanismen:

- **Anmeldemethoden:**
  - **Benutzername/Passwort**<br />Standardmethode mit Anmeldedaten, die in der Semaphore-Datenbank gespeichert sind. Passwörter werden mit einem starken Algorithmus (bcrypt) gehasht.

  - **LDAP**<br />Ermöglicht die Integration mit Unternehmensverzeichnisdiensten. Unterstützt Benutzer-/Gruppenfilterung und sichere Verbindungen über LDAPS.

  - **OpenID Connect (OIDC)**<br />Ermöglicht Single Sign-on mit Identitätsanbietern wie Google, Azure AD oder Keycloak. Unterstützt benutzerdefinierte Claims und Gruppenzuordnungen.

- **Zwei-Faktor-Authentifizierung (2FA)**<br />TOTP-basierte 2FA ist verfügbar und wird für alle Benutzer empfohlen. Sie kann pro Benutzer aktiviert werden und unterstützt optionale Wiederherstellungscodes. Siehe die Konfigurationsoptionen `auth.totp.enabled` und `auth.totp.allow_recovery`.

- **Rollenbasierte Zugriffskontrolle**<br />Sie können Benutzern unterschiedliche Rollen wie Admin, Maintainer oder Viewer zuweisen und so den Zugriff entsprechend der Verantwortung einschränken.

- **Sitzungsverwaltung**<br />Sitzungen werden durch sichere HTTP-Cookies geschützt. Sitzungsablauf und Abmeldemechanismen sorgen für eine minimale Angriffsfläche.
<!-- - **Brute-Force Protection**: Login attempts are rate-limited to prevent brute-force attacks. -->

## Geheimnisse & Anmeldedaten {#secrets--credentials}

Die sichere Verwaltung von Geheimnissen ist eine Kernfunktion:

- **Verschlüsselter Schlüsselspeicher**<br />Anmeldedaten und geheime Variablen werden im Ruhezustand mit AES-Verschlüsselung verschlüsselt.

- **Umgebungsisolation**<br />Geheimnisse werden Jobs nur zur Laufzeit übergeben und nicht direkt in der Container-Umgebung offengelegt.

- **SSH-Schlüssel und Token**<br />Benutzer sind dafür verantwortlich, gültige SSH-Schlüssel und Token hochzuladen. Diese werden verschlüsselt und nur beim Ausführen von Tasks verwendet.
- **HashiCorp-Vault-Integration (Pro)**<br />Geheimnisse können in einer externen Vault-Instanz gespeichert werden. Wählen Sie den Speicherort pro Geheimnis beim Erstellen oder Bearbeiten eines Geheimnisses.

## Datenverschlüsselung {#data-encryption}

Sensible Daten werden in verschlüsselter Form in der Datenbank gespeichert. Sie sollten die Konfigurationsoption `access_key_encryption` in der Konfigurationsdatei setzen, um die Verschlüsselung der Access Keys zu aktivieren. Der Schlüssel muss mit folgendem Befehl generiert werden:

```bash
head -c32 /dev/urandom | base64
```

## Ausführen von nicht vertrauenswürdigem Code / Playbooks {#running-untrusted-code--playbooks}

Semaphore führt benutzerdefinierte Playbooks und Befehle aus, was riskant sein kann:

- **Container-Isolation**<br />Tasks werden in isolierten Docker-Containern ausgeführt. Diese Container haben keinen Zugriff auf das Hostsystem.

- **Minimale Rechte**<br />Container laufen mit minimalen Berechtigungen und können über Docker-Flags weiter eingeschränkt werden.

- **Chroot-Ausführung**<br />Semaphore kann Tasks in einem Chroot-Jail ausführen, um die Ausführungsumgebung weiter vom Hostsystem zu isolieren.

- **Prozessbenutzer für Tasks**<br />Tasks können unter einem dedizierten Systembenutzer ohne Root-Rechte (z. B. `semaphore`) ausgeführt werden, um die Auswirkungen potenzieller Exploits zu verringern. Dies ist optional und kann entsprechend den Systemrichtlinien konfiguriert werden.
<!-- - **Resource Limits**: To prevent abuse, CPU and memory limits can be applied. -->

## Sichere Bereitstellung {#secure-deployment}

Um sicherzustellen, dass Semaphore sicher bereitgestellt wird:

- **HTTPS verwenden**<br />
    Semaphore unterstützt HTTPS sowohl über die **integrierte TLS-Unterstützung** als auch über einen **Reverse-Proxy wie Nginx**. Es wird dringend empfohlen, HTTPS in der Produktion zu aktivieren.

    Um die integrierte HTTPS-Unterstützung zu aktivieren, fügen Sie folgenden Block zur **config.json** hinzu:
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

- **Hinter einer Firewall betreiben**<br />Beschränken Sie den Zugriff auf Semaphore UI und die Datenbank auf vertrauenswürdige IP-Adressen.

- **Datenbanksicherheit**<br />Verwenden Sie starke Passwörter und beschränken Sie den Datenbankzugriff ausschließlich auf Semaphore.

## Updates & Patch-Management {#updates--patch-management}

Sicherheitsupdates werden regelmäßig veröffentlicht:

- **Aktuell bleiben**<br />Verwenden Sie immer die neueste stabile Version.

- **Changelog**<br />Prüfen Sie die Änderungen auf GitHub, bevor Sie aktualisieren.

- **Automatische Updates**<br />Wenn Sie Docker verwenden, ziehen Sie Automatisierungs-Pipelines für regelmäßige Updates in Betracht.

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

## Melden von Schwachstellen {#reporting-vulnerabilities}

Sie haben eine Schwachstelle gefunden? Helfen Sie uns, Semaphore sicher zu halten:

- **Verantwortungsvolle Offenlegung**<br />Bitte senden Sie uns eine E-Mail an `security@semaphoreui.com`.
 
### Zielfristen für die Behebung von Schwachstellen {#vulnerability-resolution-targets}

Wir streben an, gemeldete Schwachstellen innerhalb der folgenden Zeitfenster zu beheben:

- Kritisch: innerhalb von 30 Tagen
- Hoch: innerhalb von 60 Tagen
- Mittel: innerhalb von 90 Tagen
- Niedrig: nach bestem Bemühen, in der Regel innerhalb von 180 Tagen

Für aktiv ausgenutzte Probleme, die die neuesten stabilen Versionen betreffen, können außerplanmäßige Patches veröffentlicht werden.

### Werkzeuge für die Codesicherheit {#code-security-tooling}

Wir verwenden CodeQL, Codacy, Snyk und Renovate, um den Code und die Abhängigkeiten zu analysieren und Abhängigkeitsupdates zu automatisieren.
- **Keine öffentlichen Exploits**<br />Veröffentlichen Sie Schwachstellen nicht, bevor sie gepatcht sind.

- **Danksagungen**<br />Sicherheitsforscher können auf Wunsch in den Versionshinweisen genannt werden.

