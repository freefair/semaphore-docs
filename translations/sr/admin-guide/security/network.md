# Bezbednost mreže

Iz bezbednosnih razloga Semaphore **ne treba koristiti** preko nešifrovanog HTTP-a!

Zašto koristiti šifrovane veze? Pogledajte: [članak kompanije Cloudflare](https://www.cloudflare.com/learning/ssl/why-use-https/).

Opcije koje imate:

* [VPN](#vpn)
* [TLS](#tls)

---

<a id="vpn"></a>

## VPN

Možete koristiti Client-to-Site VPN koji se završava na Semaphore serveru da biste šifrovali i zaštitili vezu.

<a id="tls"></a>

## TLS

Semaphore podržava SSL/TLS počev od verzije v2.12.

**config.json**:
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

Ili promenljive okruženja (korisno za Docker):

```bash
export SEMAPHORE_TLS_ENABLED=True
export SEMAPHORE_TLS_CERT_FILE=/path/to/cert/example.com.cert
export SEMAPHORE_TLS_KEY_FILE=/path/to/key/example.com.key
```

<a id="http-to-https-redirect-listener"></a>

### Slušalac za preusmeravanje sa HTTP-a na HTTPS

Da biste konfigurisali slušalac za preusmeravanje sa HTTP-a na HTTPS, dodajte jedno od sledećih polja u blok `tls` u `config.json` ili postavite odgovarajuću promenljivu okruženja.

Koristite `http_redirect_addr` da biste slušalac vezali za određenu IP adresu i port. Koristite `http_redirect_port` da biste slušali na svim mrežnim interfejsima. Ove opcije se međusobno isključuju.

| Vezivanje slušaoca za HTTP preusmeravanje | `config.json` (blok `tls`) | Promenljiva okruženja |
| --- | --- | --- |
| Određena IP adresa i port | `"http_redirect_addr": "172.29.184.90:80"` | `SEMAPHORE_TLS_HTTP_REDIRECT_ADDR=172.29.184.90:80` |
| Svi mrežni interfejsi na portu | `"http_redirect_port": 80` | `SEMAPHORE_TLS_HTTP_REDIRECT_PORT=80` |

<a id="reverse-proxy"></a>

### Obrnuti proksi

Alternativno, ispred Semaphore-a možete postaviti obrnuti proksi koji će upravljati bezbednim vezama. Na primer:

* [NGINX](../../../../docs/admin-guide/reverse-proxy/nginx.md)
* [Apache](../../../../docs/admin-guide/reverse-proxy/apache.md)
* [Caddy](../../../../docs/admin-guide/reverse-proxy/caddy.md)

<a id="self-signed-ssl-certificate"></a>

### Samopotpisani SSL sertifikat

Sopstveni SSL sertifikat možete generisati pomoću CLI alata `openssl`:

```
openssl req -x509 -newkey rsa:4096 \
    -keyout key.pem -out cert.pem \
    -sha256 -days 3650 -nodes \
    -subj "/C=US/ST=California/L=San Francisco/O=CompanyName/OU=DevOps/CN=example.com"
```

<a id="lets-encrypt-ssl-certificate"></a>

### Let's Encrypt SSL sertifikat

Možete koristiti [Certbot](https://certbot.eff.org/) da generišete i automatski obnavljate Let's Encrypt SSL sertifikat.

Primer za Apache:

```bash
sudo snap install certbot
sudo certbot --apache -n --agree-tos -d example.com -m mail@example.com
```

<a id="others"></a>

### Ostalo

Ako želite da koristite bilo koji drugi obrnuti proksi - obavezno prosleđujte i websocket veze na ruti `/api/ws`!
