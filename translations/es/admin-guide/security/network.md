# Seguridad de red

Por razones de seguridad, Semaphore **no debe usarse** a través de HTTP sin cifrar.

¿Por qué usar conexiones cifradas? Consulte: [Artículo de Cloudflare](https://www.cloudflare.com/learning/ssl/why-use-https/).

Opciones disponibles:

* [VPN](#vpn)
* [TLS](#tls)

---

<a id="vpn"></a>

## VPN

Puede usar una VPN de cliente a sitio, que termine en el servidor de Semaphore, para cifrar y proteger la conexión.

<a id="tls"></a>

## TLS

Semaphore admite SSL/TLS a partir de la versión v2.12.

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

O variables de entorno (útil para Docker):

```bash
export SEMAPHORE_TLS_ENABLED=True
export SEMAPHORE_TLS_CERT_FILE=/path/to/cert/example.com.cert
export SEMAPHORE_TLS_KEY_FILE=/path/to/key/example.com.key
```

<a id="http-to-https-redirect-listener"></a>

### Listener de redirección de HTTP a HTTPS

Para configurar el listener de redirección de HTTP a HTTPS, añada uno de los siguientes campos al bloque `tls` de `config.json`, o establezca la variable de entorno correspondiente.

Use `http_redirect_addr` para vincular el listener a una dirección IP y un puerto específicos. Use `http_redirect_port` para escuchar en todas las interfaces de red. Estas opciones son mutuamente excluyentes.

| Vincular el listener de redirección HTTP a | `config.json` (bloque `tls`) | Variable de entorno |
| --- | --- | --- |
| Una dirección IP y un puerto específicos | `"http_redirect_addr": "172.29.184.90:80"` | `SEMAPHORE_TLS_HTTP_REDIRECT_ADDR=172.29.184.90:80` |
| Todas las interfaces de red en un puerto | `"http_redirect_port": 80` | `SEMAPHORE_TLS_HTTP_REDIRECT_PORT=80` |

<a id="reverse-proxy"></a>

### Proxy inverso

Alternativamente, puede usar un proxy inverso delante de Semaphore para gestionar las conexiones seguras. Por ejemplo:

* [NGINX](../../../../docs/admin-guide/reverse-proxy/nginx.md)
* [Apache](../../../../docs/admin-guide/reverse-proxy/apache.md)
* [Caddy](../../../../docs/admin-guide/reverse-proxy/caddy.md)

<a id="self-signed-ssl-certificate"></a>

### Certificado SSL autofirmado

Puede generar su propio certificado SSL con la herramienta de línea de comandos `openssl`:

```
openssl req -x509 -newkey rsa:4096 \
    -keyout key.pem -out cert.pem \
    -sha256 -days 3650 -nodes \
    -subj "/C=US/ST=California/L=San Francisco/O=CompanyName/OU=DevOps/CN=example.com"
```

<a id="lets-encrypt-ssl-certificate"></a>

### Certificado SSL de Let's Encrypt

Puede usar [Certbot](https://certbot.eff.org/) para generar y renovar automáticamente un certificado SSL de Let's Encrypt.

Ejemplo para Apache:

```bash
sudo snap install certbot
sudo certbot --apache -n --agree-tos -d example.com -m mail@example.com
```

<a id="others"></a>

### Otros

Si desea usar cualquier otro proxy inverso, asegúrese de reenviar también las conexiones websocket en la ruta `/api/ws`.
