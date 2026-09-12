# Almacén de claves

El Almacén de claves de Semaphore se usa para guardar credenciales de acceso a repositorios remotos, de acceso a hosts remotos, credenciales sudo y contraseñas de Ansible vault.

## Tipos {#types}

### 1. SSH {#1-ssh}
Las claves SSH se usan para acceder a servidores remotos y también a repositorios remotos.

Si necesita ayuda para generar rápidamente una clave y colocarla en su host, [aquí tiene una guía rápida.](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-20-04)

En los repositorios Git que usan autenticación SSH, el repositorio Git desde el que intenta clonar debe tener asociada su clave pública a la clave privada.

A continuación encontrará enlaces a la documentación de algunos repositorios Git habituales:
* [GitHub](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
* [GitLab](https://docs.gitlab.com/ee/user/ssh.html)
* [Bitbucket](https://support.atlassian.com/bitbucket-cloud/docs/set-up-an-ssh-key/)

### 2. Inicio de sesión con contraseña {#2-login-with-password}
Inicio de sesión con contraseña es una combinación de nombre de usuario y contraseña/token de acceso que puede usarse para lo siguiente:
* Autenticarse en hosts remotos (aunque es menos seguro que usar claves SSH)
* Credenciales sudo en hosts remotos
* Autenticarse en repositorios Git remotos mediante HTTPS (aunque SSH es más seguro)
* Desbloquear vaults de Ansible

:::tip
    Este tipo de secreto puede usarse como token de acceso personal (PAT) o cadena secreta. Simplemente deje vacío el campo Login.
:::

### 3. Ninguno {#3-none}
Se usa como relleno para repositorios que no requieren autenticación, como un repositorio de código abierto en GitLab.


## Almacenamientos de secretos {#secret-storages}

Semaphore UI admite distintos almacenamientos para los secretos. Puede elegir el almacenamiento para cada secreto al crearlo o editarlo.

### Base de datos {#database}

De forma predeterminada, los secretos se guardan cifrados en la base de datos. La clave de cifrado se configura mediante la opción de configuración
`access_key_encryption` o `SEMAPHORE_ACCESS_KEY_ENCRYPTION` (debe generarse con `head -c32 /dev/urandom | base64`).

### Variable de entorno o archivo {#environment-variable-or-file}

Una clave puede leer su valor desde una variable de entorno del servidor de Semaphore o desde un archivo del servidor
(por ejemplo, una clave SSH montada en el contenedor). Las pestañas **Env** y **File** del formulario de clave seleccionan este modo.

Los archivos deben estar dentro del directorio de secretos configurado (`dirs.secrets` / `SEMAPHORE_SECRETS_PATH`, predeterminado `/tmp/semaphore`),
y las claves SSH y de Inicio de sesión con contraseña deben envolverse en un pequeño documento JSON.

[Leer más...](/user-guide/key-store/env-and-file-sources)

### HashiCorp Vault {#hashicorp-vault}

Los secretos pueden guardarse en una instancia externa de HashiCorp Vault en lugar de en la base de datos.

[Leer más...](/user-guide/key-store/hashicorp-vault)

### OpenBao {#openbao}

Los secretos pueden guardarse en una instancia externa de [OpenBao](https://openbao.org) (un fork de código abierto de HashiCorp Vault, compatible con su API).

[Leer más...](/user-guide/key-store/openbao)

### AWS Secrets Manager {#aws-secrets-manager}

![Insignia estática](https://img.shields.io/badge/enterprise-yellow)

Los secretos pueden guardarse en AWS Secrets Manager. Autentíquese con un rol IAM/perfil de instancia o con claves de acceso estáticas.

[Leer más...](/user-guide/key-store/aws-secrets-manager)

### Devolutions Server {#devolutions-server}

Los secretos pueden guardarse en una instancia externa de Devolutions Server en lugar de en la base de datos.

[Leer más...](/user-guide/key-store/devolutions-server)

## Sincronización de secretos desde almacenamientos remotos {#syncing-secrets-from-remote-storages}

Semaphore puede importar automáticamente secretos desde un gestor de secretos externo (HashiCorp Vault, OpenBao, AWS Secrets Manager, Azure Key Vault o Devolutions Server) y mantenerlos sincronizados. Las rutas de sincronización le permiten elegir qué secretos importar y cómo nombrarlos.

[Leer más...](/user-guide/key-store/secret-sync)
