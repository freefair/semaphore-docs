# Erste Schritte

Diese Seite führt Sie von einer frischen Installation bis zu Ihrem ersten erfolgreichen Task. Jeder Schritt verweist auf die Seite mit den Details.

<a id="from-zero-to-first-task"></a>

## Von null zum ersten Task

1. **Installieren Sie Semaphore** mit der Methode Ihrer Wahl: [Installation](../../docs/admin-guide/installation.md).
2. **Melden Sie sich an** mit dem Admin-Benutzer, den Sie bei der Einrichtung erstellt haben, oder über die `SEMAPHORE_ADMIN_*`-Variablen in Docker.
3. **Erstellen Sie ein Projekt.** Ein Projekt isoliert Teams, Infrastrukturen oder Anwendungen voneinander: [Projekte](../../docs/user-guide/projects.md).
4. **Verbinden Sie, was Ihre Automatisierung benötigt:**
   - Quellcode mit Playbooks, Modulen oder Skripten: [Repositories](../../docs/user-guide/repositories.md).
   - SSH-Schlüssel, Token und Passwörter: [Schlüsselspeicher](../../docs/user-guide/key-store.md).
   - Zielhosts und Verbindungseinstellungen: [Inventory](../../docs/user-guide/inventory.md).
   - Wiederverwendbare Variablen: [Variablengruppen](../../docs/user-guide/environment.md).
5. **Erstellen Sie ein Task-Template und führen Sie es aus.** Wählen Sie die Anleitung für Ihr Werkzeug: [Ansible](../../docs/user-guide/apps/ansible.md), [Terraform/OpenTofu](../../docs/user-guide/apps/terraform/README.md), [Shell](../../docs/user-guide/apps/bash.md), [PowerShell](../../docs/user-guide/apps/powershell.md) oder [Python](../../docs/user-guide/apps/python.md). Führen Sie es anschließend aus und beobachten Sie es: [Tasks](../../docs/user-guide/tasks.md).
6. **Automatisieren und in den Betrieb überführen:**
   - Nach Zeitplan ausführen: [Zeitpläne](../../docs/user-guide/schedules.md).
   - Steuern, wer was tun darf: [Teams und benutzerdefinierte Rollen](../../docs/user-guide/team.md).
   - Über Ergebnisse benachrichtigt werden: [Benachrichtigungen](../../docs/admin-guide/notifications.md).

<a id="key-concepts"></a>

## Grundbegriffe

Diese Begriffe tauchen überall in der Benutzeroberfläche auf.

| Begriff | Bedeutung |
|------|---------|
| **Projekt** | Die wichtigste Trenneinheit. Jedes Projekt hat seine eigenen Repositories, Schlüssel, Inventories, Templates und sein eigenes Team. [Projekte](../../docs/user-guide/projects.md) |
| **Repository** | Ein Git-Repository oder lokaler Pfad, in dem Playbooks, Module oder Skripte liegen. [Repositories](../../docs/user-guide/repositories.md) |
| **Inventory** | Hosts, Gruppen und Verbindungseinstellungen für Ansible-artige Ausführungen. [Inventory](../../docs/user-guide/inventory.md) |
| **Variablengruppe** | Wiederverwendbare Variablen und Umgebungskonfiguration, auch Environment genannt. [Variablengruppen](../../docs/user-guide/environment.md) |
| **Schlüsselspeicher** | Verschlüsselte Anmeldedaten wie SSH-Schlüssel, Token und Passwörter. [Schlüsselspeicher](../../docs/user-guide/key-store.md) |
| **Task-Template** | Die Definition einer Ausführung: App, Repository, Inventory, Variablen und Optionen. [Task-Templates](../../docs/user-guide/task-templates/README.md) |
| **Task** | Eine einzelne Ausführung eines Templates mit Log und Status. [Tasks](../../docs/user-guide/tasks.md) |
| **Workflow** | Ein Graph aus Templates mit Verzweigungen, Freigaben und Verzögerungen. Pro-Funktion. [Workflows](../../docs/user-guide/workflows.md) |
| **Runner** | Wo Tasks ausgeführt werden: der Server selbst oder ein entfernter Runner. [Runner](../../docs/admin-guide/runners.md) |

<a id="next-steps"></a>

## Nächste Schritte

- Betreiben Sie Semaphore hinter TLS mit einem [Reverse-Proxy](../../docs/admin-guide/reverse-proxy/README.md).
- Verbinden Sie Ihren Identitätsanbieter: [LDAP](../../docs/admin-guide/authentication/ldap.md) oder [OpenID Connect](../../docs/admin-guide/authentication/openid.md).
- Steuern Sie Semaphore aus CI oder Skripten über die [API](../../docs/reference/api.md) und die [CLI](../../docs/reference/cli/README.md).
