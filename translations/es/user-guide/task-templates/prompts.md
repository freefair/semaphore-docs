# Prompts

Los prompts son indicadores y opciones predefinidos, específicos de cada tipo de plantilla, que puede habilitar para permitir la personalización en tiempo de ejecución. A diferencia de las [variables de encuesta](../../../../docs/user-guide/task-templates/survey-vars.md), que son campos personalizados que usted crea, los prompts son opciones integradas que se corresponden con indicadores concretos de la CLI de Ansible, Terraform y otras herramientas.

Esta característica le permite:
- Sobrescribir los valores predeterminados de la plantilla en tiempo de ejecución
- Apuntar a hosts o recursos concretos
- Controlar el comportamiento de la ejecución con indicadores de la CLI
- Pasar opciones en tiempo de ejecución mediante llamadas a la API o programaciones

<a id="prompts-vs-survey-variables"></a>

## Prompts frente a variables de encuesta

| Característica | Prompts | Variables de encuesta |
|---------|---------|-----------------|
| **Definición** | Opciones predefinidas específicas de la plantilla | Campos personalizados que usted crea |
| **Ejemplos** | Ansible: `--limit`, `--tags`<br/>Terraform: workspaces, `-destroy` | Nombre del entorno, número de versión, parámetros personalizados |
| **Configuración** | Se habilitan mediante casillas de verificación en la plantilla | Se agregan en la configuración de la plantilla con nombre y tipo |
| **Se pasan como** | Indicadores integrados de la CLI | Ansible: `--extra-vars`<br/>Terraform: `-var` |

Los **prompts** son opciones estandarizadas integradas en Semaphore para herramientas concretas, mientras que las **variables de encuesta** son campos personalizados flexibles que usted mismo define.

<a id="ansible-prompts"></a>

## Prompts de Ansible

En las plantillas de playbooks de Ansible puede habilitar prompts para las siguientes opciones de la CLI:

<a id="limit"></a>

### Limit

Habilite el prompt `--limit` para indicar a qué hosts apuntar al ejecutar el playbook.

**Equivalente en la CLI**: `ansible-playbook playbook.yml --limit webservers`

**Casos de uso**:
- Ejecutar el playbook en un subconjunto de los hosts del inventario
- Apuntar a servidores concretos para un despliegue
- Probar los cambios en un solo host antes de desplegarlos por completo

**Ejemplo**:
- Su inventario contiene 50 servidores web
- Habilite el prompt **Limit**
- Al ejecutar la tarea, indique `web-01.example.com` para apuntar únicamente a ese servidor
- O indique `webservers:&production` para apuntar a los servidores web de producción

<a id="tags"></a>

### Tags

Habilite el prompt `--tags` para ejecutar solo las tareas con determinadas etiquetas.

**Equivalente en la CLI**: `ansible-playbook playbook.yml --tags deploy,restart`

**Casos de uso**:
- Ejecutar solo determinadas partes de un playbook
- Ejecutar los pasos de despliegue sin las tareas de configuración
- Reiniciar servicios rápidamente sin ejecutar el playbook completo

**Ejemplo**:
```yaml
---
- hosts: all
  tasks:
    - name: Install packages
      apt:
        name: nginx
      tags: install

    - name: Deploy application
      copy:
        src: app.tar.gz
        dest: /opt/app/
      tags: deploy

    - name: Restart service
      service:
        name: nginx
        state: restarted
      tags: restart
```

Habilite el prompt **Tags** e introduzca `deploy,restart` para omitir el paso de instalación.

<a id="skip-tags"></a>

### Skip Tags

Habilite el prompt `--skip-tags` para omitir las tareas con determinadas etiquetas.

**Equivalente en la CLI**: `ansible-playbook playbook.yml --skip-tags testing,debug`

**Casos de uso**:
- Omitir tareas opcionales en producción
- Excluir tareas de depuración o de pruebas
- Saltarse tareas que consumen mucho tiempo cuando no son necesarias

**Ejemplo**: Con el playbook anterior, habilite **Skip Tags** e introduzca `install` para omitir la instalación de paquetes y ejecutar solo las tareas de despliegue y reinicio.

<a id="skip-galaxy-install"></a>

### Skip Galaxy install

Habilite el prompt para que el usuario pueda omitir el paso `ansible-galaxy install` de roles y colecciones al ejecutar la tarea.

**Casos de uso**:
- Los requisitos ya están instalados en la imagen del runner
- Ahorrar tiempo en ejecuciones repetidas cuando nada ha cambiado en `requirements.yml`

<a id="force-galaxy-install"></a>

### Force Galaxy install

Habilite el prompt para que el usuario pueda forzar `ansible-galaxy install --force` en cada archivo de requisitos, ignorando la suma de comprobación de los requisitos que Semaphore conserva entre ejecuciones.

**Equivalente en la CLI**: `ansible-galaxy role install -r requirements.yml --force`

**Casos de uso**:
- Un archivo de requisitos hace referencia a una rama en lugar de a una versión fija y necesita el último commit
- Una instalación anterior dejó roles o colecciones en un estado defectuoso
- Comprobar que un playbook funciona partiendo de un conjunto limpio de dependencias

Consulte [Requisitos de Galaxy](../apps/ansible.md#galaxy-requirements) para saber cómo funcionan los valores predeterminados a nivel de plantilla.

<a id="enabling-ansible-prompts"></a>

### Habilitar los prompts de Ansible

Para habilitar los prompts de Ansible:

1. Vaya a **Plantillas de tareas** y seleccione su plantilla de Ansible
2. Busque la sección **Ansible Prompts** en la configuración de la plantilla
3. Marque las casillas de los prompts que desee:
   - ☐ **Limit** - Habilita el indicador `--limit`
   - ☐ **Tags** - Habilita el indicador `--tags`
   - ☐ **Skip Tags** - Habilita el indicador `--skip-tags`
   - ☐ **Debug** - Habilita la selección del nivel de detalle (`-v`)
   - ☐ **Skip Galaxy install** - Permite omitir `ansible-galaxy install`
   - ☐ **Force Galaxy install** - Permite forzar `ansible-galaxy install --force`
4. Guarde la plantilla

![](../../../../static/assets/ansible_2.png)

Cuando están habilitados, estos campos aparecen en el formulario de ejecución de la tarea, en las peticiones a la API y en la configuración de las programaciones.

<a id="terraformopentofu-prompts"></a>

## Prompts de Terraform/OpenTofu

En las plantillas de Terraform y OpenTofu, Semaphore ofrece varios prompts integrados:

<a id="workspace-selection"></a>

### Selección de workspace

Seleccione el workspace de Terraform que se usará en la ejecución de la tarea.

**Equivalente en la CLI**: `terraform workspace select staging`

**Casos de uso**:
- Gestionar varios entornos (desarrollo, preproducción, producción)
- Separar los archivos de estado de configuraciones distintas
- Probar cambios de infraestructura de forma aislada

**Configuración**:
1. Cree workspaces en la pestaña **Workspaces** de la plantilla
2. El selector de workspace aparece automáticamente en el formulario de la tarea
3. Los usuarios eligen el workspace de destino al ejecutar las tareas

Consulte [Workspaces de Terraform](../../../../docs/user-guide/apps/terraform/workspaces.md) para ver la configuración detallada.

<a id="destroy-flag"></a>

### Indicador Destroy

Habilite el indicador `-destroy` para destruir la infraestructura.

**Equivalente en la CLI**: `terraform apply -destroy`

**Casos de uso**:
- Limpiar entornos de prueba temporales
- Dar de baja infraestructura
- Eliminar recursos concretos

**Importante**: Es una operación destructiva. Úsela con precaución y valore exigir una confirmación en sus workflows.

<a id="migrate-state-flag"></a>

### Indicador Migrate State

Habilite el indicador `-migrate-state` al cambiar la configuración del backend.

**Equivalente en la CLI**: `terraform init -migrate-state`

**Casos de uso**:
- Mover el estado a otro backend
- Migrar entre ubicaciones de almacenamiento
- Actualizar la configuración del backend

<a id="enabling-terraform-prompts"></a>

### Habilitar los prompts de Terraform

Los prompts de Terraform están disponibles en la configuración de la plantilla:

1. Vaya a **Plantillas de tareas** y seleccione su plantilla de Terraform
2. Configure los prompts disponibles en la configuración de la plantilla:
   - Selección de workspace (se habilita automáticamente si hay workspaces configurados)
   - Opción del indicador destroy
   - Opción de migración de estado
3. Guarde la plantilla

El formulario de la tarea muestra estas opciones al ejecutar tareas de Terraform.

<a id="bash-powershell-and-python-prompts"></a>

## Prompts de Bash, PowerShell y Python

En las plantillas de Bash, PowerShell y Python los prompts son mínimos, ya que la mayor parte de la personalización se gestiona mediante [variables de encuesta](../../../../docs/user-guide/task-templates/survey-vars.md).

Los prompts disponibles son:

- CLI args
- Branch

Estos tipos de plantilla se benefician más de las variables de encuesta personalizadas para pasar parámetros a los scripts.

<a id="using-prompts"></a>

## Usar los prompts

<a id="manual-task-execution"></a>

### Ejecución manual de tareas

Al ejecutar una tarea desde una plantilla con prompts habilitados:

1. Haga clic en **Ejecutar** en la plantilla
2. Aparece un formulario con los campos de los prompts habilitados
3. Rellene los valores de los prompts que desee usar (los campos opcionales pueden quedar vacíos)
4. Haga clic en **Ejecutar tarea**

La tarea se ejecuta con los valores de los prompts que haya indicado, pasados como indicadores de la CLI.

<a id="api-calls"></a>

### Llamadas a la API

Para pasar valores de prompts mediante la API, inclúyalos en el cuerpo de la petición:

**Ejemplo de Ansible:**

```bash
curl -XPOST \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{
    "template_id": 123,
    "limit": "webservers",
    "tags": "deploy,restart",
    "skip_tags": "testing"
  }' \
  https://your-semaphore.com/api/project/1/tasks
```

**Importante**: Los prompts deben estar habilitados en la plantilla para que se acepten sus valores. Si pasa valores de prompts por la API sin haberlos habilitado, esos valores se ignorarán.

<a id="scheduled-tasks"></a>

### Tareas programadas

Las programaciones pueden incluir valores de prompts para personalizar la ejecución automática de las tareas:

**Ejemplo**: programación con prompts de Ansible
- Programación de despliegue diario con `limit: "production"` y `tags: "deploy"`
- Programación de mantenimiento semanal con `tags: "updates,cleanup"`

Configure los valores de los prompts en los ajustes de la programación para que cada ejecución programada use las opciones indicadas.

<a id="integrations-and-webhooks"></a>

### Integraciones y webhooks

Las integraciones pueden extraer valores de los webhooks y asignarlos a los prompts:

**Ejemplo**: un webhook de GitHub desencadena un despliegue
- Extraer el nombre de la rama del webhook
- Asignarlo al prompt **Limit** para apuntar a un entorno concreto
- Desplegar únicamente en los servidores que coincidan con el entorno de la rama

Consulte [Integraciones](../integrations.md) para configurar los webhooks.

<a id="best-practices"></a>

## Buenas prácticas

<a id="enable-only-necessary-prompts"></a>

### Habilite solo los prompts necesarios

Cada prompt habilitado añade un campo al formulario de la tarea. Habilite únicamente los prompts que los usuarios vayan a necesitar realmente.

✅ **Bien**: habilitar **Limit** para los equipos de operaciones que necesitan apuntar a hosts concretos
❌ **Mal**: habilitar todos los prompts "por si acaso"

<a id="combine-with-survey-variables"></a>

### Combínelos con variables de encuesta

Use los prompts para las opciones de la CLI propias de cada herramienta y las variables de encuesta para los parámetros personalizados:

**Ejemplo de plantilla de Ansible:**
- **Prompts**: Limit (qué hosts), Tags (qué tareas)
- **Variables de encuesta**: `app_version` (qué versión), `enable_rollback` (lógica personalizada)

<a id="document-api-usage"></a>

### Documente el uso de la API

Si las plantillas se desencadenan mediante la API, documente qué prompts están disponibles y el formato que esperan:

```markdown
## API Usage

Enabled prompts:
- `limit`: Host pattern (optional)
- `tags`: Comma-separated tag list (optional)

Example:
POST /api/project/1/tasks
{
  "template_id": 123,
  "limit": "webservers:&production",
  "tags": "deploy"
}
```

<a id="use-limit-for-safe-testing"></a>

### Use Limit para probar con seguridad

Pruebe siempre primero con el prompt **Limit** los playbooks que puedan resultar destructivos:

1. Habilite el prompt **Limit** en la plantilla
2. Primera ejecución: indique `limit: "test-server-01"` para probar en un solo host
3. Compruebe que ha funcionado
4. Segunda ejecución: indique `limit: "production"` para desplegar en todos los hosts

<a id="validate-prompt-combinations"></a>

### Valide las combinaciones de prompts

Algunas combinaciones de prompts pueden no tener sentido. Añada documentación o validaciones:

- Usar `--tags deploy` junto con `--skip-tags deploy` provoca un conflicto
- Indicar a la vez un workspace y el indicador destroy exige especial precaución

<a id="common-use-cases"></a>

## Casos de uso habituales

<a id="gradual-rollout-with-limit"></a>

### Despliegue gradual con Limit

Despliegue en producción de forma gradual usando el prompt **Limit** de Ansible:

1. Ejecución 1: `limit: "web-01.example.com"` - Desplegar en un servidor
2. Vigile si surgen problemas
3. Ejecución 2: `limit: "webservers:&canary"` - Desplegar en los servidores canary
4. Valide las métricas
5. Ejecución 3: `limit: "webservers:&production"` - Despliegue completo

<a id="selective-execution-with-tags"></a>

### Ejecución selectiva con Tags

Use **Tags** para ejecutar solo determinadas partes de un playbook:

**Mañana**: `tags: "deploy"` - Desplegar la nueva versión
**Tarde**: `tags: "config"` - Actualizar la configuración
**Noche**: `tags: "restart"` - Reiniciar los servicios con la nueva configuración

<a id="environment-management-with-workspaces"></a>

### Gestión de entornos con workspaces

Use la selección de workspace de Terraform para gestionar los entornos:

- **Desarrollo**: seleccione el workspace `dev` - recursos más económicos, iteración más rápida
- **Preproducción**: seleccione el workspace `staging` - similar a producción para realizar pruebas
- **Producción**: seleccione el workspace `prod` - infraestructura de producción completa

<a id="cleanup-with-destroy"></a>

### Limpieza con Destroy

Use el destroy de Terraform para infraestructura temporal:

1. Cree el entorno de prueba: ejecute con el workspace `test-branch-123`
2. Ejecute las pruebas de integración
3. Limpie: ejecute con el indicador destroy habilitado y el workspace `test-branch-123`

<a id="troubleshooting"></a>

## Resolución de problemas

<a id="prompt-values-ignored"></a>

### Los valores de los prompts se ignoran

**Problema**: pasa valores de prompts, pero no surten efecto

**Solución**: compruebe que el prompt correspondiente está habilitado en la configuración de la plantilla. Los prompts deben habilitarse de forma explícita.

<a id="cannot-specify-limit"></a>

### No se puede indicar limit

**Problema**: el campo **Limit** no aparece en el formulario de la tarea

**Solución**:
1. Edite la plantilla
2. Busque la sección "Ansible Prompts"
3. Marque la casilla "Limit"
4. Guarde la plantilla

<a id="api-calls-fail-with-prompt-values"></a>

### Las llamadas a la API fallan con valores de prompts

**Problema**: las peticiones a la API con valores de prompts devuelven errores

**Solución**:
1. Asegúrese de que los prompts están habilitados en la plantilla
2. Revise el formato JSON del cuerpo de la petición
3. Compruebe que los nombres de los campos coinciden exactamente (`limit`, no `host_limit`)

<a id="tags-not-filtering-tasks"></a>

### Las etiquetas no filtran las tareas

**Problema**: indica etiquetas, pero se siguen ejecutando todas las tareas

**Solución**:
1. Compruebe que las tareas del playbook tienen etiquetas correctamente definidas
2. Busque errores tipográficos en los nombres de las etiquetas
3. Asegúrese de que las etiquetas están separadas por comas sin espacios: `deploy,restart` y no `deploy, restart`

<a id="related-documentation"></a>

## Documentación relacionada

- [Variables de encuesta](../../../../docs/user-guide/task-templates/survey-vars.md) - Campos personalizados para las plantillas
- [Plantillas de Ansible](../../../../docs/user-guide/apps/ansible.md) - Configuración específica de Ansible
- [Plantillas de Terraform](../../../../docs/user-guide/apps/terraform/README.md) - Configuración específica de Terraform
- [Programaciones](../../../../docs/user-guide/schedules.md) - Ejecución automática de tareas
- [Integraciones](../integrations.md) - Tareas desencadenadas por webhooks
- [Documentación de la API](../../reference/api.md) - Referencia de la API
