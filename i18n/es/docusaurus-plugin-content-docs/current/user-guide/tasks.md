# Tareas

Una tarea es una instancia de lanzamiento de un playbook de Ansible. Puede crear la tarea desde una [plantilla de tarea](task-templates/) haciendo clic en el botón Run/Build/Deploy de la plantilla correspondiente.

![](/assets/image6.png)

El tipo de tarea **Deploy** le permite especificar una versión de la compilación asociada a la tarea. De forma predeterminada, es la versión más reciente de la compilación.

![](/assets/task_deploy1.png)

Mientras la tarea se está ejecutando, o cuando ha finalizado, puede ver el estado de la tarea y el registro de ejecución.

![](/assets/image7.png)

### Vista del registro sin procesar {#raw-log-view}

Puede abrir el registro sin procesar de la tarea desde la ventana del registro de la tarea mediante la acción RAW LOG.

## Retención de registros de tareas {#tasks-log-retention}
Observará que los registros de ejecuciones anteriores de sus tareas están disponibles en la plantilla de tareas o en el panel de control.

Sin embargo, de forma predeterminada, la retención de registros es infinita.

Puede configurarla mediante el parámetro `max_tasks_per_template` en `config.json` o la variable de entorno `SEMAPHORE_MAX_TASKS_PER_TEMPLATE`.

