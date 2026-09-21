# Reverse-Proxy

Ein Reverse-Proxy sitzt vor Semaphore und terminiert TLS, sodass Browser und
Runner über HTTPS mit ihm sprechen, während Semaphore selbst über unverschlüsseltes
HTTP auf der lokalen Schnittstelle lauscht. Semaphore bringt außerdem
[integriertes TLS](../../../../docs/admin-guide/security/network.md#tls) mit, ein Proxy ist also nicht
zwingend erforderlich. Verwenden Sie einen, wenn Sie ohnehin schon einen Proxy
betreiben, ein anderswo verwaltetes Zertifikat benötigen, Semaphore unter einem
Unterpfad ausliefern möchten oder mehrere Dienste über einen Host bereitstellen.

<a id="what-every-configuration-must-handle"></a>

## Was jede Konfiguration leisten muss

Welchen Proxy Sie auch wählen: Drei Dinge müssen stimmen, sonst funktionieren Teile
der Oberfläche auf schwer zu diagnostizierende Weise nicht mehr:

- **WebSocket-Upgrade auf `/api/ws`.** Task-Protokolle werden über einen WebSocket
  gestreamt. Ohne die Upgrade-Header bleibt das Protokollfenster leer, während der
  Task läuft.
- **Ein Lese-Timeout, das länger ist als das Ping-Intervall.** Semaphore sendet
  etwa alle zwei Minuten einen Ping über einen untätigen WebSocket. Ein Proxy, der
  untätige Verbindungen nach 60 Sekunden schließt, trennt die Protokollansicht
  immer wieder.
- **`web_host` auf die öffentliche URL gesetzt.** Aus diesem Wert bildet Semaphore
  Weiterleitungs-URLs, setzt das `Secure`-Flag des Cookies und prüft den Origin der
  Anfrage. Stimmt er nicht mit dem überein, was der Browser verwendet hat, schlägt
  die Anmeldung fehl. Siehe
  [Konfiguration](../../../../docs/admin-guide/configuration.md).

<a id="in-this-section"></a>

## In diesem Bereich

| Seite | Inhalt |
|---|---|
| [nginx](../../../../docs/admin-guide/reverse-proxy/nginx.md) | Ein Server-Block mit TLS, dem WebSocket-Upgrade und weitergereichten Headern. |
| [Apache](../../../../docs/admin-guide/reverse-proxy/apache.md) | Ein virtueller Host mit `mod_proxy` und `mod_proxy_wstunnel`. |
| [Caddy](../../../../docs/admin-guide/reverse-proxy/caddy.md) | Eine minimale Caddyfile mit automatischen Zertifikaten. |

<a id="where-to-start"></a>

## Womit Sie beginnen

Wählen Sie den Proxy, den Sie bereits betreiben. Wenn Sie keine Vorliebe und keinen
vorhandenen Proxy haben, ist [Caddy](../../../../docs/admin-guide/reverse-proxy/caddy.md) der kürzeste
Weg: Caddy beschafft und erneuert Zertifikate selbstständig.

Zur Härtung über TLS hinaus siehe [Netzwerksicherheit](../../../../docs/admin-guide/security/network.md).
