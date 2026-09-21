# Requisitos previos

Semaphore tiene pocos requisitos estrictos propios. La mayor parte de lo que hay que preparar
corresponde a la automatización que va a ejecutar y al entorno que la rodea. Repasa esta
página antes de la [Instalación](../../../docs/admin-guide/installation.md) y la instalación en sí te llevará
unos minutos.

<a id="a-host"></a>

## Un host

Semaphore se distribuye como un único binario y como imagen de contenedor, y funciona en Linux,
macOS y Windows. Linux es el objetivo de los paquetes, las imágenes de Docker y el chart de Helm,
y es lo que usan la mayoría de las instalaciones.

El servicio es ligero: es un proceso de Go que sirve una interfaz web. Lo que realmente consume
memoria y CPU es Ansible, Terraform y tus scripts, ejecutándose en paralelo en la misma máquina.
Dimensiona el host para el trabajo, no para Semaphore, y limita la concurrencia con el ajuste de
proyecto **Número máximo de tareas en paralelo** — o traslada la ejecución a
[runners](../../../docs/admin-guide/runners.md) y dimensiona esos en su lugar.

Prevé almacenamiento persistente en dos sitios: la base de datos y el directorio de `tmp_path`
donde se clonan los repositorios. En Docker eso significa un volumen; un contenedor sin él
pierde sus datos al recrearse.

<a id="a-database"></a>

## Una base de datos

Elige una antes de instalar, porque cambiarla después implica migrar datos.

| Motor | Úsalo cuando |
|---|---|
| **SQLite** | Un servidor, un equipo. Incluido, sin nada que configurar, es la opción predeterminada. |
| **PostgreSQL** o **MySQL/MariaDB** | El servicio importa a más de unas pocas personas, quieres copias de seguridad y monitorización desde tu plataforma de bases de datos existente, o piensas ejecutar más de un nodo. |

La [alta disponibilidad](../../../docs/admin-guide/ha.md) requiere PostgreSQL o MySQL más Redis, y no puede
usar SQLite. Si la HA está en tu hoja de ruta, empieza con PostgreSQL.

Crea la base de datos y un usuario con permisos sobre ella antes de instalar; Semaphore crea
sus propias tablas en el primer arranque y en cada actualización.

<a id="network-access"></a>

## Acceso de red

| Semaphore debe llegar a | Para |
|---|---|
| Tus remotos Git | Clonar los repositorios a los que apuntan las plantillas. |
| Los hosts y las APIs de nube que automatizas | Hacer el trabajo propiamente dicho. |
| Tu proveedor de identidad, si usas uno | Inicio de sesión con [LDAP](../../../docs/admin-guide/authentication/ldap.md) u [OpenID Connect](../../../docs/admin-guide/authentication/openid.md). |
| Tus canales de notificación | Correo electrónico, Telegram, Slack y los demás. |

Los usuarios acceden a la interfaz web en el puerto `3000`, salvo que lo cambies. Pon
[TLS](../../../docs/admin-guide/reverse-proxy/README.md) delante antes de que nadie inicie sesión: las sesiones y los
tokens de API viajan por ahí.

Si un runner va a ejecutar las tareas, entonces es *él* quien necesita acceso a los remotos Git
y a los hosts de destino, y necesita acceso saliente al servidor de Semaphore. El servidor nunca
se conecta a un runner.

<a id="automation-tooling"></a>

## Herramientas de automatización

Lo que ejecute una tarea debe estar instalado allí donde se ejecute — en el servidor, en el
runner o en la imagen de contenedor que use el ejecutor.

- Las imágenes de Docker incluyen Ansible, Terraform, OpenTofu y las dependencias habituales.
  Los paquetes adicionales de Python se indican en un `requirements.txt` montado; consulta
  [Instalación de dependencias adicionales de Python](../../../docs/admin-guide/installation/docker.md#installing-additional-python-dependencies).
- Una instalación por paquete o binario te da solo Semaphore. Instala tú mismo Git, Python,
  Ansible y las colecciones o providers que necesites; consulta
  [Instalación manual](../../../docs/admin-guide/installation_manually.md).

Comprueba que tu playbook o configuración se ejecuta desde una shell en esa máquina, con el
usuario con el que corre Semaphore, antes de crear una plantilla a partir de él. Casi todos los
informes de "funciona en local" se resuelven con una colección, un provider o un paquete de
Python que falta.

<a id="credentials-to-have-ready"></a>

## Credenciales que debes tener listas

Reúnelas antes de la primera plantilla, porque si no cada una será una parada aparte:

- Una **clave de despliegue o token** para cada repositorio que vaya a clonar Semaphore.
- Las **claves SSH o los inicios de sesión** que se usan para llegar a los hosts que gestionas.
- Cualquier **credencial de nube** que requieran tu Terraform o tus módulos.
- Una **contraseña de Ansible Vault**, si tus playbooks están cifrados.

Todas ellas van en el [almacén de claves](../../../docs/user-guide/key-store.md), no en el repositorio.

<a id="decisions-to-make-first"></a>

## Decisiones que tomar primero

Tres elecciones son baratas ahora y caras después:

1. **El motor de base de datos**, como se ha dicho arriba.
2. **La URL que usarán los usuarios.** Configúrala como `web_host`. Los proxies inversos, las
   URI de redirección de OIDC, los destinos de webhooks y los enlaces de las notificaciones se
   derivan de ella.
3. **`access_key_encryption`.** Genérala en el momento de la instalación, respáldala por
   separado y no la rotes a la ligera: todos los secretos almacenados están cifrados con ella.

```bash
head -c32 /dev/urandom | base64
```

<a id="whats-next"></a>

## Qué sigue

- [Instalación](../../../docs/admin-guide/installation.md) — elige un método e instala.
- [Configuración](../../../docs/admin-guide/configuration.md) — cómo se suministran las opciones y qué significan.
- [Primeros pasos](../../../docs/getting-started/README.md) — desde un servidor instalado hasta la primera tarea.
