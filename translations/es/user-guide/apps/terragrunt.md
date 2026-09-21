# Terragrunt

[Terragrunt](https://terragrunt.gruntwork.io/) es un envoltorio para Terraform y OpenTofu que mantiene las configuraciones DRY y gestiona las dependencias entre módulos. Semaphore lo ejecuta igual que [Terraform/OpenTofu](../../../../docs/user-guide/apps/terraform/README.md), con algunas diferencias que se describen aquí.

<a id="prerequisites"></a>

## Requisitos previos

1. Instale el binario `terragrunt` y un binario `terraform` o `tofu` en el servidor de Semaphore o en el [runner](../../../../docs/admin-guide/runners.md) que ejecute las tareas.
2. Habilite la aplicación **Terragrunt Code**: está deshabilitada de forma predeterminada. Abra **Aplicaciones** desde el menú de la cuenta y active el interruptor; consulte [Aplicaciones](../../../../docs/user-guide/apps/README.md).

<a id="creating-a-terragrunt-template"></a>

## Crear una plantilla de Terragrunt

1. Vaya a **Plantillas de tareas** y haga clic en **Nueva plantilla**.
2. Seleccione **Terragrunt Code** como aplicación.
3. Indique el **Repositorio** y el subdirectorio que contiene su `terragrunt.hcl`.
4. Seleccione o cree un **Espacio de trabajo** en el campo Inventario. Las plantillas de Terragrunt usan inventarios de tipo `terragrunt-workspace`; consulte [Espacios de trabajo](terraform/workspaces.md).
5. Haga clic en **Crear** y luego en **Ejecutar**.

![Plantilla de Terragrunt](../../../../static/assets/templates-list.webp)

<a id="running-tasks"></a>

## Ejecutar tareas

El cuadro de diálogo Nueva tarea ofrece las mismas opciones que en Terraform: **Plan**, **Destroy**, **Auto Approve**, **Upgrade** y **Reconfigure**.

Semaphore invoca `terragrunt run -- <terraform arguments>` y pasa el binario de Terraform u OpenTofu con `--tf-path`, a menos que ya haya establecido `--tf-path` en los argumentos de la CLI de la plantilla. La selección del espacio de trabajo se realiza con `terragrunt run -- workspace select -or-create=true <name>`.

Las variables de los **Grupos de variables** seleccionados se pasan como variables de entorno, así que use el prefijo `TF_VAR_` para las variables de entrada. Las variables adicionales y las variables de encuesta se pasan como argumentos `-var name=value`.

<a id="notes"></a>

## Notas

- `terragrunt` ejecuta `init` automáticamente antes de cada comando.
- El backend de estado HTTP y la lista de estados de la pestaña **Espacios de trabajo** funcionan igual que en Terraform; consulte [Backend HTTP](../../../../docs/user-guide/apps/terraform/states.md).
- Para usar `run-all` en varios módulos, añada los argumentos en los **CLI args** de la plantilla.
