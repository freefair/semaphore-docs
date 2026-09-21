# Netzwerksicherheit

Aus Sicherheitsgründen **sollte Semaphore nicht** über unverschlüsseltes HTTP verwendet werden!

Warum verschlüsselte Verbindungen verwenden? Siehe: [Artikel von Cloudflare](https://www.cloudflare.com/learning/ssl/why-use-https/).

Ihre Optionen:

* [VPN](#vpn)
* [TLS](#tls)

---

<a id="vpn"></a>

## VPN

Sie können ein Client-to-Site-VPN verwenden, das auf dem Semaphore-Server terminiert, um die Verbindung zu verschlüsseln und abzusichern.

<a id="tls"></a>

## TLS

Semaphore unterstützt SSL/TLS ab Version v2.12.

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

Oder über Umgebungsvariablen (nützlich für Docker):

```bash
export SEMAPHORE_TLS_ENABLED=True
export SEMAPHORE_TLS_CERT_FILE=/path/to/cert/example.com.cert
export SEMAPHORE_TLS_KEY_FILE=/path/to/key/example.com.key
```

<a id="http-to-https-redirect-listener"></a>

### HTTP-zu-HTTPS-Weiterleitungs-Listener

Um den HTTP-zu-HTTPS-Weiterleitungs-Listener zu konfigurieren, fügen Sie eines der folgenden Felder zum `tls`-Block in der `config.json` hinzu oder setzen Sie die entsprechende Umgebungsvariable.

Verwenden Sie `http_redirect_addr`, um den Listener an eine bestimmte IP-Adresse und einen Port zu binden. Verwenden Sie `http_redirect_port`, um auf allen Netzwerkschnittstellen zu lauschen. Diese Optionen schließen sich gegenseitig aus.

| HTTP-Weiterleitungs-Listener binden an | `config.json` (`tls`-Block) | Umgebungsvariable |
| --- | --- | --- |
| Bestimmte IP-Adresse und Port | `"http_redirect_addr": "172.29.184.90:80"` | `SEMAPHORE_TLS_HTTP_REDIRECT_ADDR=172.29.184.90:80` |
| Alle Netzwerkschnittstellen auf einem Port | `"http_redirect_port": 80` | `SEMAPHORE_TLS_HTTP_REDIRECT_PORT=80` |

<a id="reverse-proxy"></a>

### Reverse-Proxy

Alternativ können Sie einen Reverse-Proxy vor Semaphore einsetzen, der die sicheren Verbindungen übernimmt. Zum Beispiel:

* [NGINX](../../../../docs/admin-guide/reverse-proxy/nginx.md)
* [Apache](../../../../docs/admin-guide/reverse-proxy/apache.md)
* [Caddy](../../../../docs/admin-guide/reverse-proxy/caddy.md)

<a id="self-signed-ssl-certificate"></a>

### Selbstsigniertes SSL-Zertifikat

Sie können mit dem CLI-Tool `openssl` Ihr eigenes SSL-Zertifikat erzeugen:

```
openssl req -x509 -newkey rsa:4096 \
    -keyout key.pem -out cert.pem \
    -sha256 -days 3650 -nodes \
    -subj "/C=US/ST=California/L=San Francisco/O=CompanyName/OU=DevOps/CN=example.com"
```

<a id="lets-encrypt-ssl-certificate"></a>

### Let's-Encrypt-SSL-Zertifikat

Sie können [Certbot](https://certbot.eff.org/) verwenden, um ein Let's-Encrypt-SSL-Zertifikat zu erzeugen und automatisch zu erneuern.

Beispiel für Apache:

```bash
sudo snap install certbot
sudo certbot --apache -n --agree-tos -d example.com -m mail@example.com
```

<a id="others"></a>

### Sonstige

Wenn Sie einen anderen Reverse-Proxy verwenden möchten, stellen Sie sicher, dass auch WebSocket-Verbindungen auf der Route `/api/ws` weitergeleitet werden!
