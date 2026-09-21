# OpenBao als Secret-Speicher

Semaphore UI unterstützt [OpenBao](https://openbao.org) als Speicher für Secrets.

OpenBao ist ein Open-Source-Fork von HashiCorp Vault und API-kompatibel dazu, daher funktioniert der Speicher genau wie der [HashiCorp-Vault-Speicher](../../../../docs/user-guide/key-store/hashicorp-vault.md).

Sie können die folgenden Optionen angeben:
- **Server-URL** — Adresse Ihres OpenBao-Servers.
- **Mount** — der Mount-Pfad der KV-v2-Secrets-Engine (standardmäßig `secret`).
- **Namespace** — OpenBao-Namespace (ab v2.3), optional.
- **Token** — Authentifizierungstoken. Das Token kann:
    - In der Datenbank gespeichert werden.
    - Über eine Umgebungsvariable bereitgestellt werden.
    - Über eine Datei bereitgestellt werden.
> **Warning**
>
> Wenn das Token aus einer **Datei** stammt, muss sich diese Datei **innerhalb** des Secrets-Verzeichnisses befinden, das Semaphore verwendet. Konfigurieren Sie dieses Verzeichnis über `dirs.secrets` oder die Umgebungsvariable `SEMAPHORE_SECRETS_PATH`. Die ältere Top-Level-Option `secrets_path` wird für ältere Konfigurationen weiterhin akzeptiert. Ist keine davon gesetzt, lautet der Standardwert `/tmp/semaphore`. Details zur Priorität finden Sie unter [Secrets-Verzeichnis](../../../../docs/admin-guide/configuration/config-file.md#secrets-directory).

Der Speicher kann im Nur-Lese-Modus betrieben werden.

<a id="how-to-use"></a>

## Verwendung

1. Öffnen Sie in Ihrem Projekt **Key Store** → **Speicher** und erstellen Sie einen neuen **OpenBao**-Speicher (URL, Mount-Pfad und Token).
2. Wählen Sie beim Erstellen oder Bearbeiten eines Schlüssels im Key Store Ihren OpenBao-Speicher als Speichertyp aus.
3. Geben Sie den Secret-Pfad in OpenBao an, unter dem die Zugangsdaten gespeichert werden sollen.

<a id="syncing-secrets"></a>

## Secrets synchronisieren

In OpenBao gespeicherte Secrets können automatisch in den Key Store importiert und synchron gehalten werden, genau wie bei anderen externen Speichern. Siehe [Secrets aus entfernten Speichern synchronisieren](../../../../docs/user-guide/key-store/secret-sync.md).

<a id="variable-groups"></a>

## Variablengruppen

OpenBao kann auch als Speicher für [Variablengruppen](../../../../docs/user-guide/environment.md) verwendet werden. Wählen Sie beim Bearbeiten einer Variablengruppe Ihren OpenBao-Speicher als Speichertyp aus und geben Sie den Pfad des Ordners an, in dem die Secrets gespeichert werden sollen.
