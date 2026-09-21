# Proxy reverso

Um proxy reverso fica na frente do Semaphore e termina o TLS, de modo que
navegadores e runners falam com ele por HTTPS enquanto o próprio Semaphore escuta
em HTTP simples na interface local. O Semaphore também possui
[TLS integrado](../../../../docs/admin-guide/security/network.md#tls), portanto um proxy não é
estritamente necessário. Use um quando você já operar um proxy, precisar de um
certificado gerenciado em outro lugar, quiser o Semaphore em um subcaminho ou
servir vários serviços a partir de um único host.

<a id="what-every-configuration-must-handle"></a>

## O que toda configuração precisa tratar

Qualquer que seja o proxy escolhido, três coisas precisam estar corretas, ou
partes da interface quebram de maneiras difíceis de diagnosticar:

- **Upgrade de WebSocket em `/api/ws`.** Os logs de tarefa são transmitidos por um
  WebSocket. Sem os cabeçalhos de upgrade, a janela de log permanece vazia
  enquanto a tarefa é executada.
- **Um tempo limite de leitura maior que o intervalo de ping.** O Semaphore envia
  um ping para um WebSocket ocioso a cada dois minutos, aproximadamente. Um proxy
  que fecha conexões ociosas após 60 segundos desconecta a visualização de log
  repetidamente.
- **`web_host` definido com a URL pública.** O Semaphore monta as URLs de
  redirecionamento, define a flag `Secure` do cookie e verifica a origem da
  requisição a partir desse valor. Se ele não corresponder ao que o navegador
  usou, o login falha. Consulte
  [Configuração](../../../../docs/admin-guide/configuration.md).

<a id="in-this-section"></a>

## Nesta seção

| Página | O que aborda |
|---|---|
| [nginx](../../../../docs/admin-guide/reverse-proxy/nginx.md) | Um bloco `server` com TLS, o upgrade de WebSocket e os cabeçalhos encaminhados. |
| [Apache](../../../../docs/admin-guide/reverse-proxy/apache.md) | Um virtual host usando `mod_proxy` e `mod_proxy_wstunnel`. |
| [Caddy](../../../../docs/admin-guide/reverse-proxy/caddy.md) | Um Caddyfile mínimo com certificados automáticos. |

<a id="where-to-start"></a>

## Por onde começar

Escolha o proxy que você já opera. Se não tiver preferência nem um proxy
existente, o [Caddy](../../../../docs/admin-guide/reverse-proxy/caddy.md) é o caminho mais curto:
ele obtém e renova os certificados sozinho.

Para proteção além do TLS, consulte
[Segurança de rede](../../../../docs/admin-guide/security/network.md).
