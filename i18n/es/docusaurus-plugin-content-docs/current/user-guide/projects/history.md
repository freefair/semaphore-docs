
# Historial

La pantalla Historial de Semaphore ofrece una vista completa de todas las ejecuciones de tareas de su proyecto. Esta función le permite hacer seguimiento y analizar el historial de ejecución de sus tareas, proporcionando información valiosa sobre sus flujos de automatización.

![](/assets/project_history.webp)

## Descripción general {#overview}

La página Historial muestra una lista cronológica de todas las ejecuciones de tareas, incluidos:

- Plantillas de tareas utilizadas
- Estado de la ejecución (éxito, fallo, en curso)
- Horas de inicio y fin
- Duración
- Usuario que inició la tarea
- Salida y registros de la tarea

## Consultar el historial de tareas {#viewing-task-history}

### Acceder al historial {#accessing-history}

1. Vaya a su proyecto en Semaphore
2. Haga clic en la pestaña "Historial"
3. Consulte la lista de todas las ejecuciones de tareas

## Detalles de la tarea {#task-details}

Al hacer clic en cualquier tarea de la lista del historial se abre una vista detallada que muestra:

1. **Información de la tarea**
   - ID de la tarea
   - Plantilla utilizada
   - Horas de inicio y fin
   - Duración
   - Estado
   - Usuario que ejecutó la tarea

2. **Detalles de la ejecución**
   - Salida completa de la tarea
   - Mensajes de error (si los hay)
   - Variables de entorno utilizadas
   - Información del inventario
   - Detalles del repositorio

3. **Registros de la tarea**
   - Visualización de registros en tiempo real
   - Opción de descarga de registros
   - Búsqueda en los registros
   - Resaltado de errores

### Estadísticas {#statistics}

El proyecto ofrece una página de estadísticas que resume los resultados de las tareas en un intervalo de tiempo seleccionado, con filtrado por usuario.

## Gestión de tareas {#task-management}

### Acciones disponibles {#actions-available}

Desde la vista del historial, puede:

- Acceder a los registros completos de la tarea
- Descargar la salida de la tarea
- Buscar dentro de los registros

## Retención de tareas {#task-retention}

Semaphore le permite configurar durante cuánto tiempo se conserva el historial de tareas:

1. **Comportamiento predeterminado**
   - Todas las tareas se guardan en la base de datos
   - No hay eliminación automática de forma predeterminada

2. **Configurar la retención**
   - Establezca el número máximo de tareas por plantilla
   - Configúrelo mediante una variable de entorno:
     ```bash
     SEMAPHORE_MAX_TASKS_PER_TEMPLATE=30
     ```
   - O mediante config.json:
     ```json
     {
       "max_tasks_per_template": 30
     }
     ```

3. **Reglas de retención**
   - Cuando se alcanza el límite, las tareas más antiguas se eliminan automáticamente
   - La eliminación se realiza por plantilla
   - Los registros de la tarea se eliminan junto con los registros de la base de datos
