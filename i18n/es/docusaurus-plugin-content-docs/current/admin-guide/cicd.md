# Pipelines

Semaphore admite pipelines sencillos mediante tareas de tipo `build` y `deploy`. 

Semaphore pasa la variable `semaphore_vars` a cada playbook de Ansible que ejecuta.

Puede usarla en sus tareas de Ansible para saber qué tipo de tarea se ejecutó, qué versión debe compilarse o desplegarse, quién ejecutó la tarea, etc.

---

Ejemplo de `semaphore_vars` para tareas `build`:

```yaml
semaphore_vars:
    task_details:
        type: build
        username: user123
        message: New version of some feature
        target_version: 1.5.33
```

Ejemplo de `semaphore_vars` para tareas `deploy`:

```yaml
semaphore_vars:
    task_details:
        type: deploy
        username: user123
        message: Deploy new feature to servers
        incoming_version: 1.5.33
```

Para las plantillas de **Bash**, **PowerShell** y **Python**, Semaphore proporciona los mismos valores de `task_details` como variables de entorno:

| Campo de `task_details` | Variable de entorno | Notas |
| --- | --- | --- |
| `type` | `SEMAPHORE_TASK_DETAILS_TYPE` | `build` o `deploy` |
| `username` | `SEMAPHORE_TASK_DETAILS_USERNAME` | Usuario que inició la tarea |
| `message` | `SEMAPHORE_TASK_DETAILS_MESSAGE` | Mensaje de la tarea |
| `target_version` | `SEMAPHORE_TASK_DETAILS_TARGET_VERSION` | Presente en las tareas `build` |
| `incoming_version` | `SEMAPHORE_TASK_DETAILS_INCOMING_VERSION` | Presente en las tareas `deploy` |

Ejemplo para Bash:

```bash
echo "$SEMAPHORE_TASK_DETAILS_TYPE"
echo "$SEMAPHORE_TASK_DETAILS_TARGET_VERSION"
```

Ejemplo para PowerShell:

```powershell
$env:SEMAPHORE_TASK_DETAILS_TYPE
$env:SEMAPHORE_TASK_DETAILS_INCOMING_VERSION
```

Ejemplo para Python:

```python
import os

task_type = os.getenv("SEMAPHORE_TASK_DETAILS_TYPE")
target_version = os.getenv("SEMAPHORE_TASK_DETAILS_TARGET_VERSION")
incoming_version = os.getenv("SEMAPHORE_TASK_DETAILS_INCOMING_VERSION")
```

### Build {#build}

Este tipo de tarea se usa para crear [artefactos](https://en.wikipedia.org/wiki/Artifact\_\(software\_development\)). Cada tarea de build tiene una versión generada automáticamente. Debe usar la variable `semaphore_vars.task_details.target_version` en su playbook de Ansible para saber qué versión del artefacto debe crearse. Una vez creado el artefacto, puede usarse para el despliegue.

---

Ejemplo de rol de Ansible para `build`:

1. Obtener el código fuente de la aplicación desde GitHub
2. Compilar el código fuente
3. Empaquetar el binario generado en un tarball con el nombre `app-{{semaphore_vars.task_details.target_version}}.tar.gz`
4. Enviar `app-{{semaphore_vars.task_details.target_version}}.tar.gz` a un bucket de S3



### Deploy {#deploy}

Este tipo de tarea se usa para desplegar artefactos en los servidores de destino. Cada tarea de despliegue está asociada a una tarea de build. Debe usar la variable `semaphore_vars.task_details.incoming_version` en su playbook de Ansible para saber qué versión del artefacto debe desplegarse.

---

Ejemplo de rol de Ansible para `deploy`:

1. Descargar `app-{{semaphore_vars.task_details.incoming_version}}.tar.gz` desde un bucket de S3 a los servidores de destino
2. Desempaquetar `app-{{semaphore_vars.task_details.incoming_version}}.tar.gz` en el directorio de destino
3. Crear o actualizar los archivos de configuración
4. Reiniciar el servicio de la aplicación

