# 🔐 Seguridad

## Introducción {#introduction}

La seguridad es una prioridad máxima en Semaphore UI. Tanto si automatiza tareas de infraestructura críticas como si gestiona el acceso del equipo a sistemas sensibles, Semaphore UI está diseñado para ofrecer operaciones robustas y seguras desde el primer momento. Esta sección describe cómo Semaphore gestiona la seguridad y qué debe tener en cuenta al desplegarlo en producción.

## Autenticación y autorización {#authentication--authorization}

Semaphore admite mecanismos de autenticación seguros y de autorización flexibles:

- **Métodos de inicio de sesión:**
  - **Usuario/contraseña**<br />Método predeterminado que utiliza credenciales almacenadas en la base de datos de Semaphore. Las contraseñas se almacenan con hash mediante un algoritmo robusto (bcrypt).

  - **LDAP**<br />Permite la integración con servicios de directorio empresariales. Admite filtrado de usuarios/grupos y conexiones seguras mediante LDAPS.

  - **OpenID Connect (OIDC)**<br />Habilita el inicio de sesión único con proveedores de identidad como Google, Azure AD o Keycloak. Admite claims personalizados y asignaciones de grupos.

- **Autenticación de dos factores (2FA)**<br />La 2FA basada en TOTP está disponible y se recomienda para todos los usuarios. Puede habilitarse por usuario y admite códigos de recuperación opcionales. Consulte las opciones de configuración `auth.totp.enabled` y `auth.totp.allow_recovery`.

- **Control de acceso basado en roles**<br />Puede asignar distintos roles a los usuarios, como Admin, Maintainer o Viewer, limitando el acceso según la responsabilidad.

- **Gestión de sesiones**<br />Las sesiones están protegidas con cookies HTTP seguras. Los mecanismos de expiración de sesión y cierre de sesión garantizan una exposición mínima.
<!-- - **Brute-Force Protection**: Login attempts are rate-limited to prevent brute-force attacks. -->

## Secretos y credenciales {#secrets--credentials}

La gestión segura de secretos es una funcionalidad esencial:

- **Almacén de claves cifrado**<br />Las credenciales y las variables secretas se cifran en reposo mediante cifrado AES.

- **Aislamiento del entorno**<br />Los secretos solo se pasan a los trabajos en tiempo de ejecución y no se exponen directamente al entorno del contenedor.

- **Claves SSH y tokens**<br />Los usuarios son responsables de cargar claves SSH y tokens válidos. Estos se cifran y solo se utilizan al ejecutar tareas.
- **Integración con HashiCorp Vault (Pro)**<br />Los secretos pueden almacenarse en una instancia externa de Vault. Elija el almacenamiento para cada secreto al crearlo o editarlo.

## Cifrado de datos {#data-encryption}

Los datos sensibles se almacenan en la base de datos de forma cifrada. Debe establecer la opción de configuración `access_key_encryption` en el archivo de configuración para habilitar el cifrado de las claves de acceso. Debe generarse con el comando:

```bash
head -c32 /dev/urandom | base64
```

## Ejecución de código/playbooks no confiables {#running-untrusted-code--playbooks}

Semaphore ejecuta playbooks y comandos definidos por el usuario, lo que puede ser arriesgado:

- **Aislamiento en contenedores**<br />Las tareas se ejecutan en contenedores Docker aislados. Estos contenedores no tienen acceso al sistema anfitrión.

- **Mínimo privilegio**<br />Los contenedores se ejecutan con permisos mínimos y pueden restringirse aún más mediante flags de Docker.

- **Ejecución en chroot**<br />Semaphore puede ejecutar tareas dentro de una jaula chroot para aislar aún más el entorno de ejecución del sistema anfitrión.

- **Usuario del proceso de la tarea**<br />Las tareas pueden ejecutarse bajo un usuario del sistema dedicado sin privilegios de root (p. ej., `semaphore`) para reducir el impacto de posibles exploits. Esto es opcional y puede configurarse según las políticas del sistema.
<!-- - **Resource Limits**: To prevent abuse, CPU and memory limits can be applied. -->

## Despliegue seguro {#secure-deployment}

Para garantizar que Semaphore se despliegue de forma segura:

- **Use HTTPS**<br />
    Semaphore admite HTTPS tanto mediante su **soporte TLS integrado** como a través de un **proxy inverso como Nginx**. Se recomienda encarecidamente habilitar HTTPS en producción.

    Para habilitar el soporte HTTPS integrado, añada el siguiente bloque a **config.json**:
    ```json
    {
        ...
        "tls": {
            "enabled": true,
            "cert_file": "/path/to/cert/example.com.cert",
            "key_file": "/path/to/key/example.com.key"
        }
        ...
    }
    ```

- **Ejecútelo detrás de un cortafuegos**<br />Limite el acceso a Semaphore UI y a la base de datos únicamente a IPs de confianza.

- **Seguridad de la base de datos**<br />Use contraseñas robustas y restrinja el acceso a la base de datos únicamente a Semaphore.

## Actualizaciones y gestión de parches {#updates--patch-management}

Las actualizaciones de seguridad se publican con regularidad:

- **Manténgase actualizado**<br />Use siempre la última versión estable.

- **Registro de cambios**<br />Revise los cambios en GitHub antes de actualizar.

- **Actualizaciones automáticas**<br />Si usa Docker, considere pipelines de automatización para actualizaciones periódicas.

<!-- ## Audit Logs & Monitoring

Semaphore provides basic audit logging:

- **User Activity**: Logins, failed attempts, and task executions are logged.
- **Configuration Changes**: Changes to settings, projects, and credentials are logged with timestamps.
- **Integration**: Logs can be forwarded to centralized logging systems like ELK or Prometheus exporters. -->

<!-- ## Backups & Disaster Recovery

To protect against data loss:

- **What to Back Up**: Semaphore database, configuration file, and secret storage.
- **How to Restore**: Follow the backup/restore guide in the admin docs.
- **Testing**: Periodically test restoring backups in a staging environment. -->

<!-- ## Common Vulnerabilities & Hardening Tips

- **Disable User Registration** if not needed to prevent unauthorized access.
- **Use Strong Passwords** and enforce complexity rules.
- **Limit Task Concurrency** to avoid resource exhaustion.
- **Restrict Access to Secrets** by managing team permissions carefully. -->

<!-- ## Compliance & Data Privacy

Semaphore collects minimal user data:

- **Data Handling**: Emails, IP logs, and session data are stored securely.
- **User Deletion**: Admins can delete user accounts and associated data upon request.
- **GDPR Compliance**: Self-hosted users are responsible for local compliance. -->

## Notificación de vulnerabilidades {#reporting-vulnerabilities}

¿Ha encontrado una vulnerabilidad? Ayúdenos a mantener Semaphore seguro:

- **Divulgación responsable**<br />Escríbanos a `security@semaphoreui.com`.
 
### Plazos objetivo de resolución de vulnerabilidades {#vulnerability-resolution-targets}

Nuestro objetivo es resolver las vulnerabilidades notificadas dentro de los siguientes plazos:

- Críticas: en un plazo de 30 días
- Altas: en un plazo de 60 días
- Medias: en un plazo de 90 días
- Bajas: según el mejor esfuerzo, normalmente en un plazo de 180 días

Pueden publicarse parches fuera de ciclo para problemas explotados activamente que afecten a las últimas versiones estables.

### Herramientas de seguridad del código {#code-security-tooling}

Usamos CodeQL, Codacy, Snyk y Renovate para analizar el código base y las dependencias, y para automatizar las actualizaciones de dependencias.
- **Sin exploits públicos**<br />No comparta vulnerabilidades públicamente hasta que se hayan corregido.

- **Agradecimientos**<br />Los investigadores de seguridad pueden ser mencionados en las notas de la versión si así lo desean.

