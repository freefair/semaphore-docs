# Aplicaciones

Una aplicación es la herramienta que ejecuta una plantilla de tarea. Semaphore incluye siete aplicaciones integradas; los administradores pueden activarlas y desactivarlas, así como registrar las suyas propias.

| Aplicación | ID | Qué ejecuta una plantilla | Guía |
|---|---|---|---|
| Ansible Playbook | `ansible` | `ansible-playbook` con el inventario seleccionado | [Ansible](ansible.md) |
| Terraform Code | `terraform` | `terraform` en el subdirectorio y el espacio de trabajo seleccionados | [Terraform/OpenTofu](../../../../docs/user-guide/apps/terraform/README.md) |
| OpenTofu Code | `tofu` | `tofu`, con las mismas opciones que Terraform | [Terraform/OpenTofu](../../../../docs/user-guide/apps/terraform/README.md) |
| Terragrunt Code | `terragrunt` | `terragrunt` envolviendo Terraform u OpenTofu | [Terragrunt](terragrunt.md) |
| Bash Script | `bash` | un script de shell con `/bin/bash` | [Shell](bash.md) |
| PowerShell Script | `powershell` | un script `.ps1` con `pwsh` | [PowerShell](powershell.md) |
| Python Script | `python` | un script `.py` con `python3` | [Python](python.md) |

La herramienta en sí debe estar instalada en la máquina que ejecuta las tareas: el servidor de Semaphore o el [runner](../../../../docs/admin-guide/runners.md). La imagen oficial de Docker contiene Ansible, Terraform, OpenTofu, Bash y Python.

<a id="managing-applications"></a>

## Gestionar aplicaciones

Los administradores abren **Aplicaciones** desde el menú de la cuenta, en la parte inferior de la barra lateral.

![Página de aplicaciones](../../../../static/assets/apps-list.webp)

El interruptor de cada fila habilita o deshabilita la aplicación. Una aplicación deshabilitada no se ofrece en el formulario de la plantilla, aunque las plantillas existentes siguen funcionando. Solo las aplicaciones habilitadas aparecen al crear una plantilla, así que deshabilite las herramientas que no estén instaladas en su servidor.

Haga clic en una aplicación para cambiar su título, su icono, la ruta del binario y su prioridad (el orden en el formulario de la plantilla).

<a id="custom-applications"></a>

## Aplicaciones personalizadas

**Nueva aplicación** registra cualquier herramienta de línea de comandos como una aplicación:

| Campo | Descripción |
|---|---|
| **ID** | Identificador corto usado en la API y en las plantillas, por ejemplo `pulumi`. |
| **Icono** | Icono que se muestra junto al nombre. |
| **Nombre** | Título que se muestra en el formulario de la plantilla. |
| **Ruta** | Ruta al ejecutable en el servidor o en el runner. |
| **Prioridad** | Posición en la lista de aplicaciones. |
| **Activa** | Si la aplicación se ofrece en las plantillas. |

Una plantilla de una aplicación personalizada ejecuta el ejecutable pasándole como argumento el archivo de script del repositorio y recibe los grupos de variables como variables de entorno, igual que las plantillas de [Bash](bash.md).

Las aplicaciones también pueden predefinirse en la configuración del servidor, consulte la sección `apps` en [Configuración](../../../../docs/admin-guide/configuration.md).
