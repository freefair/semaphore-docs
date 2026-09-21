# CLI

Die Binärdatei `semaphore` ist sowohl der Server als auch ein vollständiges
Administrationswerkzeug. Führen Sie sie ohne Argumente (oder mit `semaphore help`)
aus, um alle Befehle aufzulisten:

```bash
semaphore help
```

Die vollständige, generierte Liste aller Befehle und Optionen finden Sie in der
[Befehlsreferenz](../../../../docs/reference/cli/commands.md). Für die meisten administrativen Aufgaben
gibt es eine eigene Befehlsgruppe:

| Befehlsgruppe | Zweck |
|---------------|-------|
| [`semaphore users`](../../../../docs/reference/cli/users.md) | Benutzer hinzufügen, ändern, entfernen und anzeigen; API-Tokens und TOTP (2FA) verwalten. |
| [`semaphore projects`](../../../../docs/reference/cli/projects.md) | Projekte exportieren und importieren (Backups). |
| [`semaphore vaults`](../../../../docs/reference/cli/vaults.md) | Gespeicherte Geheimnisse neu verschlüsseln und die Verwendung der Verschlüsselungsschlüssel prüfen. |
| [`semaphore runner`](../../../../docs/reference/cli/runners.md) | Im Runner-Modus laufen sowie Runner registrieren/abmelden. |
| [`semaphore migrate`](../../../../docs/reference/cli/migrations.md) | Datenbankmigrationen anwenden oder zurückrollen. |

Mehrere Befehlsgruppen haben kürzere Aliasse: `users`/`user`, `projects`/`project`,
`vaults`/`vault` und `server`/`service`.

> **Info**
>
> Jeder Befehl, der auf die Datenbank zugreift (`users`, `projects`, `vaults`, `migrate`,
> `server`), wendet vor der Ausführung alle ausstehenden Schemamigrationen an. Erstellen
> Sie ein Datenbank-Backup, bevor Sie die CLI einer neueren Semaphore-Version gegen eine
> bestehende Datenbank ausführen.

<a id="global-options"></a>

## Globale Optionen

Diese Flags werden von jedem Befehl akzeptiert:

| Option | Beschreibung |
|--------|--------------|
| `--config <path>` | Pfad zur Konfigurationsdatei. |
| `--no-config` | Keine Konfigurationsdatei lesen — nur Umgebungsvariablen verwenden. |
| `--log-level <level>` | Ausführlichkeit der Logs: `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL` oder `PANIC`. Fällt auf die Umgebungsvariable `SEMAPHORE_LOG_LEVEL` zurück. |
| `--debug-filter <spec>` | Beschränkt die `DEBUG`-Ausgabe auf bestimmte Namespaces, z. B. `'runner,task_*'` oder `'*,-db'`. Wirkt nur, wenn der Log-Level `DEBUG` ist. Fällt auf `SEMAPHORE_DEBUG_FILTER` zurück. |

<a id="how-the-configuration-file-is-found"></a>

### Wie die Konfigurationsdatei gefunden wird

Wenn `--config` weggelassen wird, sucht Semaphore die Datei in dieser Reihenfolge und
verwendet die erste, die existiert:

1. Der Pfad in der Umgebungsvariable `SEMAPHORE_CONFIG_PATH`.
2. `config.json`, `config.yaml` oder `config.yml` im aktuellen Verzeichnis.
3. `/usr/local/etc/semaphore/config.json` (oder `.yaml` / `.yml`).
4. `/etc/semaphore/config.json` (oder `.yaml` / `.yml`).

Umgebungsvariablen werden zusätzlich zur Datei angewendet und überschreiben daher
deren Werte. Mit `--no-config` werden nur Umgebungsvariablen und Standardwerte
verwendet. Die vollständige Optionsliste finden Sie unter
[Konfiguration](../../../../docs/admin-guide/configuration.md).

<a id="version"></a>

## Version

Gibt die aktuelle Version aus.

```bash
semaphore version
```

<a id="interactive-setup"></a>

## Interaktive Einrichtung

Verwenden Sie dies für die Erstkonfiguration. Der Befehl erzeugt Geheimnisse, führt
durch einen interaktiven Fragebogen, schreibt die Konfigurationsdatei, führt die
Datenbankmigrationen aus und legt den ersten Admin-Benutzer an.

```bash
semaphore setup
```

Übergeben Sie `--config <path>`, um festzulegen, wohin die Konfigurationsdatei
geschrieben wird. Ohne diese Angabe fragt das Setup nach einem Ausgabeverzeichnis
(Standard: das aktuelle Verzeichnis) und schreibt dort `config.json`.

Wenn der eingegebene Benutzername oder die E-Mail-Adresse bereits existiert, behält
das Setup den vorhandenen Benutzer bei, anstatt einen neuen anzulegen.

Nach Abschluss gibt es die Befehle zum Starten des Servers aus, zum Beispiel:

```bash
./semaphore server --config /path/to/config.json
```

<a id="server-mode"></a>

## Server-Modus

Startet den Semaphore-Server (Weboberfläche und API). `service` ist ein Alias für `server`.

```bash
semaphore server --config /path/to/config.json
```

Der Server wendet beim Start ausstehende Datenbankmigrationen an und gibt die
verwendete Datenbank, den temporären Pfad, die Schnittstelle und den Port aus.

<a id="runner-mode"></a>

## Runner-Modus

Führt Semaphore als Task-Runner aus. Unter [Runner](../../../../docs/reference/cli/runners.md) finden
Sie alle Unterbefehle (`setup`, `register`, `start`, `unregister`).

```bash
semaphore runner start --config /path/to/runner-config.json
```

<a id="database-migration"></a>

## Datenbankmigration

Bringt das Datenbankschema auf den aktuellen Stand. Unter
[Datenbankmigrationen](../../../../docs/reference/cli/migrations.md) erfahren Sie, wie Sie Migrationen
bis zu einer bestimmten Version anwenden oder zurückrollen.

```bash
semaphore migrate --config /path/to/config.json
```
