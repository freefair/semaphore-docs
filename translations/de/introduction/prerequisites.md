# Voraussetzungen

Semaphore selbst stellt kaum harte Anforderungen. Das meiste, was Sie vorbereiten müssen,
gehört zu der Automatisierung, die es ausführen wird, und zu deren Umfeld. Arbeiten Sie
diese Seite vor der [Installation](../../../docs/admin-guide/installation.md) durch, dann dauert die
Installation selbst nur Minuten.

<a id="a-host"></a>

## Ein Host

Semaphore wird als einzelne Binärdatei und als Container-Image ausgeliefert und läuft unter
Linux, macOS und Windows. Die Pakete, die Docker-Images und das Helm-Chart zielen auf
Linux, und die meisten Installationen nutzen es.

Der Dienst ist leichtgewichtig: Es ist ein Go-Prozess, der eine Weboberfläche
bereitstellt. Was tatsächlich Arbeitsspeicher und CPU verbraucht, sind Ansible, Terraform
und Ihre Skripte, die parallel auf derselben Maschine laufen. Dimensionieren Sie den Host
für die Arbeitslast, nicht für Semaphore, und begrenzen Sie die Parallelität mit der
Projekteinstellung **Max number of parallel tasks** — oder verlagern Sie die Ausführung auf
[Runner](../../../docs/admin-guide/runners.md) und dimensionieren Sie stattdessen diese.

Planen Sie an zwei Stellen persistenten Speicher ein: für die Datenbank und für das
Verzeichnis unter `tmp_path`, in das Repositories geklont werden. In Docker bedeutet das
ein Volume; ein Container ohne Volume verliert seine Daten beim Neuerstellen.

<a id="a-database"></a>

## Eine Datenbank

Wählen Sie sie vor der Installation aus, denn ein späterer Wechsel bedeutet Datenmigration.

| Engine | Wann Sie sie verwenden |
|---|---|
| **SQLite** | Ein Server, ein Team. Mitgeliefert, ohne Einrichtung, die Voreinstellung. |
| **PostgreSQL** oder **MySQL/MariaDB** | Der Dienst ist für mehr als eine Handvoll Personen wichtig, Sie möchten Sicherungen und Monitoring über Ihre vorhandene Datenbankplattform, oder Sie planen mehr als einen Knoten. |

[Hochverfügbarkeit](../../../docs/admin-guide/ha.md) erfordert PostgreSQL oder MySQL sowie Redis und kann
SQLite nicht nutzen. Wenn HA auf Ihrer Roadmap steht, beginnen Sie mit PostgreSQL.

Legen Sie die Datenbank und einen darauf berechtigten Benutzer vor der Installation an;
Semaphore erzeugt seine Tabellen beim ersten Start und bei jedem Upgrade selbst.

<a id="network-access"></a>

## Netzwerkzugriff

| Semaphore muss erreichen | Wofür |
|---|---|
| Ihre Git-Remotes | Klonen der Repositories, auf die Templates verweisen. |
| Die Hosts und Cloud-APIs, die Sie automatisieren | Die eigentliche Arbeit. |
| Ihren Identity Provider, falls vorhanden | Anmeldung per [LDAP](../../../docs/admin-guide/authentication/ldap.md) oder [OpenID Connect](../../../docs/admin-guide/authentication/openid.md). |
| Ihre Benachrichtigungskanäle | E-Mail, Telegram, Slack und die übrigen. |

Benutzer erreichen die Weboberfläche auf Port `3000`, sofern Sie ihn nicht ändern. Setzen
Sie [TLS](../../../docs/admin-guide/reverse-proxy/README.md) davor, bevor sich jemand anmeldet: Sitzungen und
API-Tokens werden darüber übertragen.

Wenn ein Runner die Tasks ausführt, braucht *er* den Zugriff auf Git-Remotes und Zielhosts
sowie ausgehenden Zugriff auf den Semaphore-Server. Der Server verbindet sich niemals zu
einem Runner.

<a id="automation-tooling"></a>

## Automatisierungswerkzeuge

Was ein Task ausführt, muss dort installiert sein, wo er ausgeführt wird — auf dem Server,
auf dem Runner oder im Container-Image, das der Executor verwendet.

- Die Docker-Images enthalten Ansible, Terraform, OpenTofu und die üblichen
  Abhängigkeiten. Zusätzliche Python-Pakete kommen in eine eingebundene
  `requirements.txt`, siehe
  [Zusätzliche Python-Abhängigkeiten installieren](../../../docs/admin-guide/installation/docker.md#installing-additional-python-dependencies).
- Eine Paket- oder Binärinstallation liefert Ihnen nur Semaphore. Installieren Sie Git,
  Python, Ansible sowie benötigte Collections oder Provider selbst, siehe
  [Manuelle Installation](../../../docs/admin-guide/installation_manually.md).

Prüfen Sie, dass Ihr Playbook oder Ihre Konfiguration auf dieser Maschine aus einer Shell
heraus läuft, und zwar als der Benutzer, unter dem Semaphore läuft, bevor Sie ein Template
daraus erstellen. Fast jede Meldung „lokal funktioniert es“ löst sich in einer fehlenden
Collection, einem fehlenden Provider oder einem fehlenden Python-Paket auf.

<a id="credentials-to-have-ready"></a>

## Zugangsdaten, die bereitliegen sollten

Sammeln Sie diese vor dem ersten Template, sonst wird jedes Einzelne zu einem eigenen
Zwischenstopp:

- Einen **Deploy Key oder ein Token** für jedes Repository, das Semaphore klonen wird.
- Die **SSH-Schlüssel oder Logins**, mit denen die von Ihnen verwalteten Hosts erreicht werden.
- Alle **Cloud-Zugangsdaten**, die Ihr Terraform oder Ihre Module benötigen.
- Ein **Ansible-Vault-Passwort**, falls Ihre Playbooks verschlüsselt sind.

All das gehört in den [Key Store](../../../docs/user-guide/key-store.md), nicht in das Repository.

<a id="decisions-to-make-first"></a>

## Entscheidungen, die zuerst anstehen

Drei Entscheidungen sind jetzt günstig und später teuer:

1. **Datenbank-Engine**, wie oben beschrieben.
2. **Die URL, die Benutzer verwenden werden.** Legen Sie sie als `web_host` fest. Reverse
   Proxies, OIDC-Redirect-URIs, Webhook-Ziele und Links in Benachrichtigungen leiten sich
   daraus ab.
3. **`access_key_encryption`.** Erzeugen Sie den Wert bei der Installation, sichern Sie ihn
   separat und rotieren Sie ihn niemals leichtfertig: Jedes gespeicherte Secret ist damit
   verschlüsselt.

```bash
head -c32 /dev/urandom | base64
```

<a id="whats-next"></a>

## Wie es weitergeht

- [Installation](../../../docs/admin-guide/installation.md) — eine Methode wählen und installieren.
- [Konfiguration](../../../docs/admin-guide/configuration.md) — wie Optionen übergeben werden und was sie bedeuten.
- [Erste Schritte](../../../docs/getting-started/README.md) — vom installierten Server zum ersten Task.
