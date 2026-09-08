# Notificaciones

Semaphore puede enviar notificaciones sobre la actividad de tareas y proyectos a los canales más populares. Configure un notificador global en `config.json` y (donde se admita) sobrescriba determinadas opciones por proyecto.

Proveedores compatibles:

* [Correo electrónico](/admin-guide/notifications/email)
* [Slack](/admin-guide/notifications/slack)
* [Telegram](/admin-guide/notifications/telegram)
* [Microsoft Teams](/admin-guide/notifications/teams)
* [RocketChat](/admin-guide/notifications/rocket)
* [DingTalk](/admin-guide/notifications/ding)
* [Gotify](/admin-guide/notifications/gotify)

## Cómo funciona {#how-it-works}

- **Configuración global**: habilite un proveedor y establezca sus opciones de conexión en `config.json` en el servidor de Semaphore. Consulte la página de cada proveedor para conocer las claves exactas.
- **Eventos**: las notificaciones se envían en los eventos clave del ciclo de vida de una tarea (p. ej., inicio, éxito, fallo) y se publican en el canal/webhook configurado.
- **Sobrescrituras por proyecto**: algunos proveedores permiten sobrescribir opciones por proyecto. Por ejemplo, Telegram admite un ID de chat específico por proyecto.



