# Obrnuti proksi

Obrnuti proksi stoji ispred Semaphore-a i terminira TLS, pa pregledači i runneri
komuniciraju sa njim preko HTTPS-a, dok sam Semaphore sluša običan HTTP na
lokalnom interfejsu. Semaphore ima i [ugrađeni TLS](../../../../docs/admin-guide/security/network.md#tls),
tako da proksi nije strogo neophodan. Koristite ga kada već imate proksi, kada
sertifikatom upravlja neko drugi, kada želite Semaphore na pod-putanji ili kada sa
jednog hosta servirate više servisa.

<a id="what-every-configuration-must-handle"></a>

## Šta svaka konfiguracija mora da reši

Koji god proksi izabrali, tri stvari moraju biti ispravne ili se delovi interfejsa
kvare na načine koje je teško dijagnostikovati:

- **WebSocket nadogradnja na `/api/ws`.** Logovi zadataka se prenose preko
  WebSocket-a. Bez zaglavlja za nadogradnju prozor sa logom ostaje prazan dok se
  zadatak izvršava.
- **Tajm-aut čitanja duži od intervala ping-a.** Semaphore šalje ping neaktivnom
  WebSocket-u otprilike svaka dva minuta. Proksi koji zatvara neaktivne veze posle
  60 sekundi stalno prekida prikaz loga.
- **`web_host` podešen na javni URL.** Semaphore iz ove vrednosti gradi URL-ove za
  preusmeravanje, postavlja `Secure` zastavicu kolačića i proverava poreklo
  zahteva. Ako se ne poklapa sa onim što je pregledač koristio, prijava ne uspeva.
  Pogledajte [Konfiguraciju](../../../../docs/admin-guide/configuration.md).

<a id="in-this-section"></a>

## U ovom odeljku

| Stranica | Šta obuhvata |
|---|---|
| [nginx](../../../../docs/admin-guide/reverse-proxy/nginx.md) | Blok servera sa TLS-om, WebSocket nadogradnjom i prosleđenim zaglavljima. |
| [Apache](../../../../docs/admin-guide/reverse-proxy/apache.md) | Virtuelni host koji koristi `mod_proxy` i `mod_proxy_wstunnel`. |
| [Caddy](../../../../docs/admin-guide/reverse-proxy/caddy.md) | Minimalan Caddyfile sa automatskim sertifikatima. |

<a id="where-to-start"></a>

## Odakle početi

Izaberite proksi koji već koristite. Ako nemate poseban razlog za izbor niti
postojeći proksi, [Caddy](../../../../docs/admin-guide/reverse-proxy/caddy.md) je najkraći put: sam
pribavlja i obnavlja sertifikate.

Za ojačavanje izvan TLS-a pogledajte [Bezbednost mreže](../../../../docs/admin-guide/security/network.md).
