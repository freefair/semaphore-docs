# HashiCorp Vault als Secret-Speicher

Semaphore UI unterstützt HashiCorp Vault als Speicher für Secrets.

![](../../../../static/assets/vault1.webp)

Sie können die folgenden Optionen angeben:
- **HashiCorp-Vault-URL** — Adresse Ihres Vault-Servers.
- **Mount** — der Mount-Pfad der Secrets-Engine.
- **Token** — Authentifizierungstoken. Das Token kann:
    - In der Datenbank gespeichert werden.
    - Über eine Umgebungsvariable bereitgestellt werden.
    - Über eine Datei bereitgestellt werden (nützlich für Vault Agent).
> **Warning**
>
> Wenn das Token aus einer **Datei** stammt, muss sich diese Datei **innerhalb** des Secrets-Verzeichnisses befinden, das Semaphore verwendet. Konfigurieren Sie dieses Verzeichnis über `dirs.secrets` oder die Umgebungsvariable `SEMAPHORE_SECRETS_PATH`. Die ältere Top-Level-Option `secrets_path` wird für ältere Konfigurationen weiterhin akzeptiert. Ist keine davon gesetzt, lautet der Standardwert `/tmp/semaphore`. Details zur Priorität finden Sie unter [Secrets-Verzeichnis](../../../../docs/admin-guide/configuration/config-file.md#secrets-directory).
>
> Beispiel eines `config.json`-Fragments:
>
> ```json
> {
> "dirs": {
> "secrets": "/root/path/for/secrets"
> }
> }
> ```

Der Speicher kann im Nur-Lese-Modus betrieben werden.

<a id="how-to-use"></a>

## Verwendung

1. Konfigurieren Sie die HashiCorp-Vault-Verbindung in den Semaphore-Einstellungen (URL, Mount-Pfad und Token).
2. Wählen Sie beim Erstellen oder Bearbeiten eines Schlüssels im Key Store **HashiCorp Vault** als Speichertyp aus.
3. Geben Sie den Secret-Pfad in Vault an, unter dem die Zugangsdaten gespeichert werden sollen.

![](../../../../static/assets/vault2.webp)

<a id="hashicorp-vault-agent"></a>

## HashiCorp Vault Agent

Anstatt das Vault-Token direkt zu speichern, können Sie [HashiCorp Vault Agent](https://developer.hashicorp.com/vault/docs/agent-and-proxy/agent) verwenden, um den Bezug und die Erneuerung des Tokens automatisch abzuwickeln.

Vault Agent läuft als Sidecar-Prozess neben Semaphore und schreibt ein gültiges Token in eine Datei auf der Festplatte. Semaphore liest das Token anschließend aus dieser Datei.

So richten Sie das ein:

1. Konfigurieren und starten Sie Vault Agent mit einer geeigneten [Auto-Auth-Methode](https://developer.hashicorp.com/vault/docs/agent-and-proxy/autoauth) (z. B. AppRole, Kubernetes, AWS IAM).
2. Weisen Sie Vault Agent an, das Token über einen `sink`-Block in eine Datei zu schreiben, zum Beispiel:

    ```hcl
    auto_auth {
    method {
        type = "approle"
        config = {
        role_id_file_path   = "/etc/vault/role-id"
        secret_id_file_path = "/etc/vault/secret-id"
        }
    }

    sink {
        type = "file"
        config = {
        path = "/etc/vault/token"
        }
    }
    }
    ```

3. Wählen Sie in Semaphore beim Konfigurieren der HashiCorp-Vault-Verbindung **Datei** als Token-Quelle aus und geben Sie den Pfad zur Token-Datei an (z. B. `/etc/vault/token`).

Dieser Ansatz vermeidet langlebige statische Tokens und überlässt Vault Agent die automatische Authentifizierung und Token-Erneuerung.

<a id="variable-groups"></a>

## Variablengruppen

HashiCorp Vault kann auch als Speicher für [Variablengruppen](../../../../docs/user-guide/environment.md) verwendet werden. Wählen Sie beim Bearbeiten einer Variablengruppe **HashiCorp Vault** als Speichertyp aus und geben Sie den Pfad des Ordners an, in dem die Secrets gespeichert werden sollen.

![](../../../../static/assets/vault3.webp)
