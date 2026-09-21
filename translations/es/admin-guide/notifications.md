# Notificaciones

Semaphore comunica los resultados de las tareas al chat y al correo electrónico. Un
canal se configura una sola vez en el servidor, en `config.json` o mediante
variables de entorno, y a partir de ahí se aplica a todos los proyectos. Qué tareas
generan una alerta se decide por proyecto y por plantilla en la interfaz web.

<a id="how-delivery-works"></a>

## Cómo funciona la entrega

Tres ajustes deciden si se envía un mensaje, y los tres deben permitirlo:

1. **El canal está configurado en el servidor.** Cada proveedor tiene sus propias
   claves en `config.json`. Consulte más abajo la página de ese proveedor.
2. **El proyecto permite las alertas.** *Allow alerts for this project*, en los
   [ajustes del proyecto](../../../docs/user-guide/projects/settings.md), es el interruptor
   principal. Si está desactivado, ningún canal envía nada sobre ese proyecto.
3. **La plantilla las solicita.** Una plantilla de tareas elige si alertar en caso de
   éxito, en caso de error o no hacerlo nunca; consulte [Plantillas de tareas](../../../docs/user-guide/task-templates/README.md).

Use **Test alerts** en los ajustes del proyecto para enviar un mensaje de prueba por
todos los canales configurados sin ejecutar ninguna tarea.

<a id="channels"></a>

## Canales

| Canal | Página |
|---|---|
| Correo electrónico (SMTP) | [Correo electrónico](../../../docs/admin-guide/notifications/email.md) |
| Telegram | [Telegram](../../../docs/admin-guide/notifications/telegram.md) |
| Slack | [Slack](../../../docs/admin-guide/notifications/slack.md) |
| Microsoft Teams | [Teams](../../../docs/admin-guide/notifications/teams.md) |
| Rocket.Chat | [Rocket.Chat](../../../docs/admin-guide/notifications/rocket.md) |
| DingTalk | [DingTalk](../../../docs/admin-guide/notifications/ding.md) |
| Gotify | [Gotify](../../../docs/admin-guide/notifications/gotify.md) |

Pueden habilitarse varios canales a la vez; cada uno de ellos recibe todas las
alertas que superan las tres comprobaciones anteriores.

<a id="per-project-overrides"></a>

## Excepciones por proyecto

Telegram admite un chat por proyecto: defina **Telegram Chat ID** en los
[ajustes del proyecto](../../../docs/user-guide/projects/settings.md) para dirigir las alertas de un
proyecto a un chat distinto del configurado para todo el servidor. Los demás canales
usan la configuración del servidor para todos los proyectos.

<a id="where-to-start"></a>

## Por dónde empezar

Configure primero un canal, active *Allow alerts for this project* y pulse
**Test alerts**. Cuando llegue el mensaje de prueba, habilite las alertas en las
plantillas que le interesen.
