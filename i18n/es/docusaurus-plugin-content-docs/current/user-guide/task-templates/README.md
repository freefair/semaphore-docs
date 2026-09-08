# Plantillas de tareas

Las plantillas definen cómo se ejecutan las tareas de Semaphore. Actualmente se admiten los siguientes tipos de tareas:

* [Ansible](/user-guide/apps/ansible)
* [Terraform/OpenTofu](/user-guide/apps/terraform)
* [Shell](/user-guide/apps/bash)
* [Powershell](/user-guide/apps/powershell)
* [Python](/user-guide/apps/python)

---

## Tareas en paralelo {#parallel-tasks}

De forma predeterminada, las tareas de una misma plantilla se ejecutan de manera secuencial. Para permitir ejecuciones concurrentes de la misma plantilla, habilite la opción "Allow parallel tasks" en la configuración de la plantilla.

## Imagen del ejecutor (runners de Docker y Kubernetes) {#executor-image-docker-and-kubernetes-runners}

Cuando un runner de proyecto utiliza el ejecutor **Docker** (Pro) o **Kubernetes** (Enterprise), cada tarea se ejecuta normalmente en la imagen de trabajo predeterminada configurada en el runner (por ejemplo, `semaphoreui/job:latest`). Puede sobrescribir esa imagen por plantilla.

1. Abra la configuración de la plantilla
2. Establezca **Imagen del ejecutor** con la referencia de la imagen de contenedor (por ejemplo, `my-registry/ansible:2.16` o `semaphoreui/job:latest`)
3. Guarde la plantilla

**Comportamiento**:
- Solo los ejecutores de runner **Docker** y **Kubernetes** respetan este campo; el ejecutor local lo ignora
- Deje el campo vacío para usar la imagen predeterminada del runner definida en `runner.executor.docker.image` o `runner.executor.k8s.image`
- Al vaciar el campo en la interfaz se elimina la sobrescritura

**Casos de uso**:
- Plantillas que necesitan una cadena de herramientas distinta (una versión anterior de Ansible, una versión específica de Terraform, paquetes adicionales del sistema operativo incorporados en una imagen personalizada)
- Imágenes aisladas para plantillas sensibles en materia de seguridad sin cambiar el valor predeterminado de todo el runner

Consulte [Configuración del runner](/admin-guide/configuration) para la configuración de la imagen predeterminada y [Runners de proyecto](/user-guide/projects/runners) para la configuración del ejecutor.
