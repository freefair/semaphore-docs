# Primeros pasos

Esta página le guía desde una instalación nueva hasta su primera tarea ejecutada con éxito. Cada paso enlaza a la página con los detalles.

<a id="from-zero-to-first-task"></a>

## De cero a la primera tarea

1. **Instale Semaphore** con el método que prefiera: [Instalación](../../docs/admin-guide/installation.md).
2. **Inicie sesión** con el usuario administrador que creó durante la configuración, o mediante las variables `SEMAPHORE_ADMIN_*` en Docker.
3. **Cree un proyecto.** Un proyecto aísla equipos, infraestructuras o aplicaciones entre sí: [Proyectos](../../docs/user-guide/projects.md).
4. **Conecte lo que necesita su automatización:**
   - Código fuente con playbooks, módulos o scripts: [Repositorios](../../docs/user-guide/repositories.md).
   - Claves SSH, tokens y contraseñas: [Almacén de claves](../../docs/user-guide/key-store.md).
   - Hosts de destino y ajustes de conexión: [Inventario](../../docs/user-guide/inventory.md).
   - Variables reutilizables: [Grupos de variables](../../docs/user-guide/environment.md).
5. **Cree una plantilla de tarea y ejecútela.** Elija la guía de su herramienta: [Ansible](../../docs/user-guide/apps/ansible.md), [Terraform/OpenTofu](../../docs/user-guide/apps/terraform/README.md), [Shell](../../docs/user-guide/apps/bash.md), [PowerShell](../../docs/user-guide/apps/powershell.md) o [Python](../../docs/user-guide/apps/python.md). Después, ejecútela y observe el resultado: [Tareas](../../docs/user-guide/tasks.md).
6. **Automatice y ponga en operación:**
   - Ejecute según una programación: [Programaciones](../../docs/user-guide/schedules.md).
   - Controle quién puede hacer qué: [Equipos y roles personalizados](../../docs/user-guide/team.md).
   - Reciba alertas sobre los resultados: [Notificaciones](../../docs/admin-guide/notifications.md).

<a id="key-concepts"></a>

## Conceptos clave

Estos términos aparecen por todas partes en la interfaz.

| Término | Significado |
|------|---------|
| **Proyecto** | La unidad principal de separación. Cada proyecto tiene sus propios repositorios, claves, inventarios, plantillas y equipo. [Proyectos](../../docs/user-guide/projects.md) |
| **Repositorio** | Un repositorio Git o una ruta local donde residen los playbooks, módulos o scripts. [Repositorios](../../docs/user-guide/repositories.md) |
| **Inventario** | Hosts, grupos y ajustes de conexión para ejecuciones al estilo de Ansible. [Inventario](../../docs/user-guide/inventory.md) |
| **Grupo de variables** | Variables reutilizables y configuración de entorno, también llamado Entorno. [Grupos de variables](../../docs/user-guide/environment.md) |
| **Almacén de claves** | Credenciales cifradas como claves SSH, tokens y contraseñas. [Almacén de claves](../../docs/user-guide/key-store.md) |
| **Plantilla de tarea** | La definición de una ejecución: aplicación, repositorio, inventario, variables y opciones. [Plantillas de tareas](../../docs/user-guide/task-templates/README.md) |
| **Tarea** | Una ejecución individual de una plantilla, con su registro y estado. [Tareas](../../docs/user-guide/tasks.md) |
| **Flujo de trabajo** | Un grafo de plantillas con ramificaciones, aprobaciones y retardos. Funcionalidad Pro. [Flujos de trabajo](../../docs/user-guide/workflows.md) |
| **Runner** | Dónde se ejecutan las tareas: el propio servidor o un runner remoto. [Runners](../../docs/admin-guide/runners.md) |

<a id="next-steps"></a>

## Próximos pasos

- Ponga Semaphore detrás de TLS con un [proxy inverso](../../docs/admin-guide/reverse-proxy/README.md).
- Conecte su proveedor de identidad: [LDAP](../../docs/admin-guide/authentication/ldap.md) u [OpenID Connect](../../docs/admin-guide/authentication/openid.md).
- Controle Semaphore desde CI o scripts con la [API](../../docs/reference/api.md) y la [CLI](../../docs/reference/cli/README.md).
