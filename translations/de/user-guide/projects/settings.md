# Einstellungen

Der Tab **Settings** im Projekt-Dashboard steht den **Owners** des Projekts zur Verfügung. Er enthält die allgemeinen Projektoptionen und die destruktiven Aktionen.

![Projekteinstellungen](../../../../static/assets/project-settings-general.webp)

<a id="general"></a>

## Allgemein

| Feld | Beschreibung |
|---|---|
| **Project Name** | Anzeigename, der im Projektwechsler und in Benachrichtigungen angezeigt wird. |
| **Max number of parallel tasks** | Optional. Maximale Anzahl von Tasks dieses Projekts, die gleichzeitig laufen dürfen. Lassen Sie das Feld leer, um kein Limit zu setzen. Tasks über dem Limit bleiben mit dem Status `waiting` in der Warteschlange, bis ein Platz frei wird. |
| **Telegram Chat ID** | Optional. Sendet Benachrichtigungen für dieses Projekt an einen anderen Telegram-Chat als den global konfigurierten. Siehe [Telegram-Benachrichtigungen](../../../../docs/admin-guide/notifications/telegram.md#per-project-chat-ids). |
| **Allow alerts for this project** | Hauptschalter für Benachrichtigungen. Ist er aus, sendet kein Kanal Benachrichtigungen über Tasks dieses Projekts, selbst wenn der Kanal auf dem Server konfiguriert ist. |

**Test alerts** sendet eine Testnachricht über jeden konfigurierten [Benachrichtigungskanal](../../../../docs/admin-guide/notifications.md), sodass Sie die Serverkonfiguration überprüfen können, ohne einen Task auszuführen. **Save** übernimmt die Änderungen.

<a id="danger-zone"></a>

## Danger Zone

| Aktion | Wirkung |
|---|---|
| **Backup project** | Lädt eine JSON-Datei mit der Projektdefinition herunter: Task Templates, Inventories, Variable Groups, Schlüssel (ohne geheime Werte), Repositories, Schedules, Ansichten und Integrationen. Stellen Sie sie über **New Project → Restore project** oder mit [`semaphore projects import`](../../../../docs/reference/cli/projects.md) wieder her. |
| **Clear cache** | Löscht alle zwischengespeicherten Dateien des Projekts auf dem Server, zum Beispiel geklonte Repositories. Der nächste Task klont die Repositories erneut. Die Aktion ist nicht umkehrbar. |
| **Delete project** | Löscht das Projekt mit allen Ressourcen und dem Task-Verlauf. Es gibt kein Zurück. |

<a id="related-settings"></a>

## Verwandte Einstellungen

- Mitglieder und Rollen: [Teams](../../../../docs/user-guide/team.md)
- Dem Projekt zugeordnete Runner und Runner-Tags: [Projekt-Runner](../../../../docs/user-guide/projects/runners.md)
- Benachrichtigungskanäle werden auf dem Server konfiguriert: [Benachrichtigungen](../../../../docs/admin-guide/notifications.md)
