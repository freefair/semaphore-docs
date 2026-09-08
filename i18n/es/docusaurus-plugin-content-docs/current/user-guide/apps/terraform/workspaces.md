
# Workspaces

Semaphore ofrece compatibilidad integrada con los workspaces de Terraform, lo que le permite gestionar múltiples entornos y configuraciones dentro de un único proyecto. Esta función le ayuda a mantener archivos de estado separados para distintos entornos, como desarrollo, staging y producción.

## Características {#features}

- **Gestión de workspaces**: cree, cambie y elimine workspaces directamente desde la interfaz de Semaphore.
- **Aislamiento del estado**: cada workspace mantiene su propio archivo de estado, lo que evita conflictos entre entornos.
- **Variables de entorno**: configure variables de entorno específicas de cada workspace.
- **Selección de workspace**: elija el workspace de destino al ejecutar comandos de Terraform.

## Uso de workspaces en Semaphore {#using-workspaces-in-semaphore}

### Creación de un workspace {#creating-a-workspace}

En la sección **Workspaces** de la plantilla de Terraform/OpenTofu a la que desea añadir un workspace, siga estos pasos:

1. Haga clic en el botón ➕.  
2. En el menú que aparece, seleccione **Nuevo workspace**.  
3. En el cuadro de diálogo, introduzca el nombre del workspace y seleccione la clave SSH que se usará para clonar los módulos.  
4. Haga clic en el botón **Crear** para añadir el nuevo workspace a la plantilla.  
5. Ahora puede usar este workspace para ejecutar tareas.


### Cambio de workspace {#switching-workspaces}

Puede establecer el workspace predeterminado de una plantilla de Terraform/OpenTofu haciendo clic en el botón **ESTABLECER COMO PREDETERMINADO**.


### Variables específicas de workspace {#workspace-specific-variables}

Actualmente, Semaphore no admite variables específicas de workspace.