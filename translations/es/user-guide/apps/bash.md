# Scripts de shell/Bash

Semaphore puede ejecutar scripts de shell mediante `/bin/bash`. Para ello, cree una plantilla de tareas de tipo **Bash Script**.

<a id="creating-a-bash-template"></a>

## Crear una plantilla de Bash

1. Vaya a la sección **Plantillas de tareas** y haga clic en el botón **Nueva plantilla**.
2. Seleccione **Bash** como tipo de aplicación.
3. Configure la plantilla:

| Campo | Descripción |
|---|---|
| **Nombre** | Un nombre descriptivo para la plantilla |
| **Repositorio** | Repositorio que contiene su script de shell |
| **Playbook / Script** | Ruta relativa al script, p. ej. `scripts/deploy.sh` |
| **Grupos de variables** | Grupos de variables cuyos valores se inyectan como variables de entorno |

4. Haga clic en **Crear**.
5. Haga clic en **Ejecutar** para ejecutar la plantilla. El cuadro de diálogo Nueva tarea de una plantilla de script solo incluye el mensaje opcional, además de las variables de encuesta y las solicitudes si la plantilla las define.

![Cuadro de diálogo Nueva tarea de una plantilla de Bash](../../../../static/assets/task-new-bash.webp)

<a id="passing-variables-to-scripts"></a>

## Pasar variables a los scripts

Las variables de los **Grupos de variables** seleccionados se inyectan como variables de entorno. Acceda a ellas en el script con `$VARIABLE_NAME`:

```bash
#!/bin/bash
echo "Deploying to $TARGET_HOST"
```

<a id="notes"></a>

## Notas

- Haga que su script sea ejecutable (`chmod +x`) o asegúrese de que empiece con un shebang válido (`#!/bin/bash`).
- Los scripts se ejecutan de forma no interactiva. Evite solicitudes que esperen la intervención del usuario.
- El código de salida `0` significa éxito; cualquier código de salida distinto de cero marca la tarea como fallida.
- Si un script muy corto no produce ninguna salida en el registro, consulte [Falta la salida del script de Bash o está incompleta](../../../../docs/faq/troubleshooting.md#bash-script-output-is-missing-or-incomplete) en la guía de resolución de problemas.
- Para ejecutar comandos en hosts remotos, use [Ansible](ansible.md) en su lugar.
