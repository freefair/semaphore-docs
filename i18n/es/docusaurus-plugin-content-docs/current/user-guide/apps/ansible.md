
# Ansible

Con Semaphore UI puede ejecutar playbooks de Ansible. Para ello, necesita crear una plantilla **Ansible Playbook**.

1. Vaya a la sección **Plantillas de tareas**, haga clic en **Nueva plantilla** y después en **Ansible Playbook**.

![](/assets/ansible_1.png)

2. Configure la plantilla.

La plantilla permite especificar los siguientes parámetros:

* Repositorio
* Ruta al archivo del playbook
* Directorio de trabajo (opcional)
* Inventario
* Grupos de variables
* Vaults
* Argumentos CLI adicionales (tags, skip-tags, limit, verbosidad)
* Variables de entorno

![](/assets/ansible_2.png)

## Directorio de trabajo {#working-directory}

Use **Directorio de trabajo** para ejecutar los comandos de Ansible desde un subdirectorio del repositorio de la plantilla. Introduzca una ruta relativa a la raíz del repositorio. Por ejemplo, si `ansible.cfg` se encuentra en `<repository>/automation`, introduzca `automation`. Las rutas absolutas y las rutas fuera del repositorio se rechazan. Si se omite, Semaphore usa la raíz del repositorio.

El directorio de trabajo afecta al comportamiento de Ansible que depende del directorio actual del proceso. El [orden de búsqueda del archivo de configuración][ansible-config-search] de Ansible incluye `ansible.cfg` en el directorio actual. El directorio de trabajo también afecta a la resolución de rutas relativas en los argumentos CLI adicionales; algunos ejemplos son [`--extra-vars @vars.yml`][ansible-extra-vars-file] y [`--private-key key.pem`][ansible-private-key]. Las rutas del playbook y del inventario en archivo siguen siendo relativas a las raíces de sus repositorios.

Cambiar el directorio de trabajo no añade por sí mismo el subdirectorio `roles/` o `collections/` de ese directorio a las rutas de búsqueda de Ansible. La [detección de roles relativa al playbook][ansible-role-search] y las [colecciones adyacentes a un playbook][ansible-playbook-collections] siguen basándose en la ubicación del playbook. El directorio de trabajo aún puede afectar indirectamente a su detección cuando el `ansible.cfg` seleccionado configura `roles_path` o `collections_path`.

[ansible-config-search]: https://docs.ansible.com/ansible/latest/reference_appendices/config.html#the-configuration-file
[ansible-extra-vars-file]: https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_variables.html#vars-from-a-json-or-yaml-file
[ansible-private-key]: https://docs.ansible.com/ansible/latest/cli/ansible-playbook.html#cmdoption-ansible-playbook-private-key
[ansible-role-search]: https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_reuse_roles.html#storing-and-finding-roles
[ansible-playbook-collections]: https://docs.ansible.com/ansible/latest/collections_guide/collections_installing.html#installing-collections-adjacent-to-playbooks

## Tipos de plantilla {#template-types}

Una plantilla de ansible-playbook puede ser de uno de los siguientes tipos:

* [Tarea](#task)
* [Build](#build)
* [Deploy](#deploy)

### Tarea {#task}

Simplemente ejecuta los playbooks especificados con los parámetros especificados.

Si tiene previsto lanzar la plantilla mediante una llamada a la API con la funcionalidad *limit*, asegúrese de activar la opción *Ansible prompts: Limit*. De lo contrario, el limit establecido en la llamada a la API se ignorará. Para la tarea lanzada desde la API, esto no provocará ningún prompt interactivo; la tarea se ejecutará de forma desatendida.

### Build {#build}

Este tipo de plantilla debe usarse para crear [artefactos](https://en.wikipedia.org/wiki/Artifact\_\(software\_development\)). La versión inicial del artefacto puede especificarse en un parámetro de la plantilla. Cada ejecución incrementa la versión del artefacto.

![](/assets/template_new_build_ipad1.png)

Semaphore no admite artefactos de forma nativa; solo proporciona el versionado de tareas. Debe implementar la creación de artefactos por su cuenta. Lea el artículo [CI/CD](../../admin-guide/cicd) para saber cómo hacerlo.

### Deploy {#deploy}

Este tipo de plantilla debe usarse para desplegar artefactos en los servidores de destino. Cada plantilla `deploy` está asociada a una plantilla `build`.


Esto le permite desplegar una versión concreta del artefacto en los servidores.

## Opciones de plantilla {#template-options}

### Programación {#schedule}

Puede configurar la programación de tareas especificando una programación cron en los ajustes de la plantilla. Puede consultar el formato de las expresiones cron en la [documentación](https://pkg.go.dev/github.com/robfig/cron/v3#hdr-CRON\_Expression\_Format).


#### Ejecutar una tarea cuando se añade un nuevo commit al repositorio {#run-a-task-when-a-new-commit-is-added-to-the-repository}

Puede usar cron para comprobar periódicamente si hay nuevos commits en el repositorio y lanzar una tarea cuando lleguen.

Por ejemplo, tiene el código fuente de la aplicación en el repositorio git. Puede añadirlo a **Repositorios** y lanzar la tarea Build para los nuevos commits.


### Tags, skip-tags y limit {#tags-skip-tags-and-limit}

Las plantillas admiten las opciones CLI de Ansible:

- `--tags`
- `--skip-tags`
- `--limit`

Estas pueden establecerse en la plantilla y sobrescribirse al crear una tarea. Asegúrese de que los prompts correspondientes estén habilitados si tiene previsto pasar estos valores a través de la API.

### Paralelismo (`--forks` / `-f`) {#parallelism---forks---f}

Controle a cuántos hosts se conecta Ansible en paralelo pasando `--forks` o
`-f` en los **Argumentos CLI adicionales** de la plantilla. Los argumentos deben ser JSON válido:
use un array de tokens separados:

```json
["--forks", "10"]
```

También se admite la forma corta:

```json
["-f", "10"]
```

Cuando **Permitir sobrescribir argumentos en la tarea** está habilitado en la plantilla, una tarea puede
proporcionar su propio valor de forks en tiempo de ejecución. Ansible recibe tanto los argumentos de la plantilla como
los de la tarea; el último `--forks` / `-f` de la línea de comandos prevalece.

Si los argumentos no son JSON válido, la tarea falla con un error de validación
descriptivo antes de que comience la ejecución.

### Autenticación {#authentication}

La autenticación de los hosts del playbook se realiza mediante las referencias de usuario del almacén de claves en el inventario. El usuario para SSH se determina mediante el usuario opcional del elemento del almacén de claves.

### Múltiples contraseñas de vault {#multiple-vault-passwords}

Puede adjuntar varias contraseñas de Vault del almacén de claves a una plantilla. Durante la ejecución, Ansible intentará descifrar usando las contraseñas proporcionadas.

### Nivel de verbosidad {#verbosity-level}

Puede ajustar la verbosidad de Ansible para una tarea (por ejemplo `-v`, `-vvv`) desde el formulario de la plantilla/tarea para facilitar la solución de problemas.
