# 反向代理

反向代理位于 Semaphore 前面并终结 TLS，因此浏览器和运行器通过 HTTPS 与它通信，而
Semaphore 自身在本地接口上监听普通 HTTP。Semaphore 也提供[内置 TLS](../../../../docs/admin-guide/security/network.md#tls)，
所以反向代理并非必需。当你已经在运行代理、需要由别处管理证书、希望把 Semaphore 放在
子路径下，或者要用一台主机对外提供多个服务时，就使用它。

<a id="what-every-configuration-must-handle"></a>

## 每份配置都必须处理的事项

无论选择哪种代理，有三件事必须做对，否则界面的某些部分会以难以排查的方式出问题：

- **`/api/ws` 上的 WebSocket 升级。** 任务日志通过 WebSocket 流式传输。缺少升级
  请求头时，任务运行期间日志窗口会一直是空的。
- **读取超时长于 ping 间隔。** Semaphore 大约每两分钟对空闲的 WebSocket 发送一次
  ping。若代理在 60 秒后就关闭空闲连接，日志视图会反复断开。
- **把 `web_host` 设为公开 URL。** Semaphore 依据该值构建重定向 URL、设置 Cookie 的
  `Secure` 标志并校验请求来源。如果它与浏览器使用的地址不一致，登录就会失败。请参阅
  [配置](../../../../docs/admin-guide/configuration.md)。

<a id="in-this-section"></a>

## 本节内容

| 页面 | 涵盖内容 |
|---|---|
| [nginx](../../../../docs/admin-guide/reverse-proxy/nginx.md) | 包含 TLS、WebSocket 升级和转发请求头的 server 块。 |
| [Apache](../../../../docs/admin-guide/reverse-proxy/apache.md) | 使用 `mod_proxy` 和 `mod_proxy_wstunnel` 的虚拟主机。 |
| [Caddy](../../../../docs/admin-guide/reverse-proxy/caddy.md) | 带自动证书的最简 Caddyfile。 |

<a id="where-to-start"></a>

## 从哪里开始

选择你已经在运维的那种代理。如果你没有偏好，也没有现成的代理，
[Caddy](../../../../docs/admin-guide/reverse-proxy/caddy.md) 是最短的路径：它会自行获取并续期证书。

关于 TLS 之外的加固，请参阅[网络安全](../../../../docs/admin-guide/security/network.md)。
