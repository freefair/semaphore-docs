
# Scripts de Shell/Bash

Semaphore puede ejecutar scripts de shell usando `/bin/bash`. Para ello, cree una plantilla de tarea **Bash Script**.

## Creación de una plantilla Bash {#creating-a-bash-template}

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
5. Haga clic en **Ejecutar** para ejecutar la plantilla.

## Paso de variables a los scripts {#passing-variables-to-scripts}

Las variables de los **Grupos de variables** seleccionados se inyectan como variables de entorno. Acceda a ellas en el script con `$VARIABLE_NAME`:

```bash
#!/bin/bash
echo "Deploying to $TARGET_HOST"
```

## Notas {#notes}

- Haga que su script sea ejecutable (`chmod +x`) o asegúrese de que comience con un shebang válido (`#!/bin/bash`).
- Los scripts se ejecutan de forma no interactiva. Evite los prompts que esperan la entrada del usuario.
- El código de salida `0` significa éxito; cualquier código de salida distinto de cero marca la tarea como fallida.
- Si un script muy corto no produce salida en el registro, consulte [La salida del script Bash falta o está incompleta](/admin-guide/troubleshooting#bash-script-output-is-missing-or-incomplete) en la guía de solución de problemas.
- Para ejecutar comandos en hosts remotos, use [Ansible](./ansible) en su lugar.
