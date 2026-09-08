# Introducción

Bienvenido a la Guía de administración de Semaphore UI. Esta guía ofrece información completa para instalar, configurar y mantener su instancia de Semaphore.

## ¿Qué es Semaphore UI? {#what-is-semaphore-ui}

Semaphore UI es una interfaz web moderna y de código abierto para ejecutar tareas de automatización. Está diseñada como una alternativa ligera, rápida y fácil de usar frente a plataformas de automatización más complejas.

Le permite gestionar y ejecutar de forma segura tareas para:
*   Playbooks de **Ansible**
*   Infraestructura como código con **Terraform/OpenTofu**
*   Scripts de **PowerShell** y **Shell**
*   Scripts de **Python**

## Características principales y filosofía {#core-features--philosophy}

Comprender los principios de diseño de Semaphore le ayudará a sacarle el máximo partido:

*   **Ligero y eficiente**: Semaphore está escrito en **Go** y se distribuye como un **único archivo binario**. Tiene requisitos de recursos mínimos (CPU/RAM) y no necesita dependencias externas como Kubernetes, Docker o una JVM. Esto lo hace rápido, eficiente y fácil de desplegar.
*   **Fácil de instalar y mantener**: Puede tener Semaphore en funcionamiento en cuestión de minutos. La instalación puede ser tan sencilla como descargar el binario y ejecutarlo. Su arquitectura simple hace que las actualizaciones y el mantenimiento sean directos.
*   **Despliegue flexible**: Ejecútelo como binario, como servicio de systemd o en un contenedor de Docker. Es adecuado para todo tipo de entornos, desde un homelab personal hasta entornos empresariales.
*   **Autoalojado y seguro**: Semaphore es una solución autoalojada. Todos sus datos, credenciales y registros permanecen en su propia infraestructura, lo que le otorga control total. Las credenciales siempre se almacenan cifradas en la base de datos.
*   **Integraciones potentes**: A pesar de su sencillez, Semaphore admite funciones avanzadas como autenticación LDAP/OpenID, control de acceso basado en roles (RBAC) detallado por proyecto, runners remotos para escalar la ejecución de tareas y una API REST completa para el acceso programático.

Esta guía le acompañará en la configuración y gestión de estas funciones según sus necesidades.
