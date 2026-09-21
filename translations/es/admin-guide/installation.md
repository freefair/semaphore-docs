# Instalación

Puede instalar Semaphore de varias formas, según su sistema operativo, su entorno y sus preferencias.

<a id="in-this-section"></a>

## En esta sección

| Método | Cuándo usarlo |
|---|---|
| [Gestor de paquetes](../../../docs/admin-guide/installation/package-manager.md) | Quieres un paquete nativo para tu distribución de Linux. |
| [Docker](../../../docs/admin-guide/installation/docker.md) | Quieres ejecutar Semaphore en un contenedor con Docker o Docker Compose. |
| [Nube](../../../docs/admin-guide/installation/cloud.md) | Vas a desplegar en una plataforma en la nube y necesitas orientación sobre servicios gestionados e infraestructura. |
| [Archivo binario](../../../docs/admin-guide/installation/binary-file.md) | Quieres instalar un binario precompilado y gestionar el proceso por tu cuenta. |
| [Kubernetes (chart de Helm)](../../../docs/admin-guide/installation/k8s.md) | Ya usas Kubernetes y quieres gestionar el despliegue con Helm. |

<a id="installing-additional-python-packages"></a>

## Instalación de paquetes de Python adicionales

Algunos módulos y roles de Ansible necesitan paquetes de Python adicionales para ejecutarse. Para instalar paquetes de Python adicionales, cree un archivo `requirements.txt` y móntelo en el directorio `/etc/semaphore` del contenedor. Por ejemplo, podría añadir las siguientes líneas a su archivo `docker-compose.yml`:

```yaml
volumes:
  - /path/to/requirements.txt:/etc/semaphore/requirements.txt
```

Los paquetes especificados en el archivo de requisitos se instalarán en el entorno virtual de Ansible incluido cada vez que se inicie el contenedor. El mismo montaje funciona para la imagen `semaphoreui/runner`. Consulte [Instalación de dependencias de Python adicionales](../../../docs/admin-guide/installation/docker.md#installing-additional-python-dependencies) para obtener más detalles y una alternativa basada en una imagen personalizada.

Para obtener más información sobre los archivos de requisitos de Python, consulte la [referencia del formato de archivo de requisitos de pip](https://pip.pypa.io/en/stable/reference/requirements-file-format/)

<a id="where-to-start"></a>

## Por dónde empezar

Empieza por la guía de tu entorno de despliegue. Si instalas un binario, sigue las instrucciones del servicio para mantener Semaphore en ejecución. Para configurar el usuario del servicio, las dependencias de Python y systemd, usa la guía de instalación manual.

* [Ejecutar como servicio](../../../docs/admin-guide/installation/binary-file.md#run-as-a-service)
* [Instalación manual](../../../docs/admin-guide/installation_manually.md)
