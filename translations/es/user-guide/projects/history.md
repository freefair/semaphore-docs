# Historial

La pestaña **Historial** del panel del proyecto muestra todas las tareas del proyecto, empezando por las más recientes. Es la vista predeterminada al abrir un proyecto.

![Historial del proyecto](../../../../static/assets/project-dashboard-history.webp)

<a id="columns"></a>

## Columnas

| Columna | Contenido |
|---|---|
| **Tarea** | Número de la tarea, la plantilla a partir de la cual se creó y el mensaje del commit de la revisión del repositorio que se usó. Un icono a la izquierda indica la aplicación (Ansible, Terraform, Bash, etc.). |
| **Versión** | Para las [plantillas de compilación y despliegue](../task-templates/build-deploy.md): la versión compilada o desplegada. Para las demás plantillas, solo un icono de estado. |
| **Estado** | Distintivo del estado actual; consulte [Estados de las tareas](../../../../docs/user-guide/tasks.md#task-statuses). |
| **Usuario** | Quién inició la tarea. Las tareas iniciadas por una programación o una integración no tienen usuario. |
| **Inicio** | Fecha y hora de inicio en la zona horaria de su navegador. |
| **Duración** | Cuánto tiempo se ejecutó la tarea. |

La lista está paginada. Haga clic en el número de la tarea o en el nombre de la plantilla para abrir la [ventana de la tarea](../../../../docs/user-guide/tasks.md#task-window) con el registro, los detalles y el resumen. Haga clic en el nombre de la plantilla en el encabezado de la ventana de la tarea para ir a la página de la plantilla.

<a id="task-retention"></a>

## Retención de tareas

De forma predeterminada, todas las tareas y sus registros se conservan indefinidamente. Para limitar el historial por plantilla, establezca `max_tasks_per_template` en `config.json` o la variable de entorno `SEMAPHORE_MAX_TASKS_PER_TEMPLATE`:

```json
{
  "max_tasks_per_template": 30
}
```

Cuando se alcanza el límite, las tareas más antiguas de esa plantilla se eliminan junto con sus registros. Consulte [Configuración](../../../../docs/admin-guide/configuration.md) para ver la lista completa de opciones.

<a id="see-also"></a>

## Véase también

- [Estadísticas](stats.md): resultados de las tareas agregados por día.
- [Actividad](activity.md): registro de auditoría de los cambios del proyecto.
