---
title: Documentación de Semaphore UI
sidebar_label: Inicio
hide_table_of_contents: true
---

# Documentación de Semaphore UI

Semaphore UI es una interfaz web y una API autoalojadas para ejecutar automatizaciones con **Ansible**, **Terraform/OpenTofu**, **Shell**, **PowerShell** y **Python**. Ofrece a su equipo un único lugar para ejecutar playbooks y scripts, mantener las credenciales cifradas, programar trabajos y ver quién ejecutó qué y cuándo.

Se distribuye como un único binario de Go o como imagen de Docker, se ejecuta en Linux, macOS y Windows, y almacena los datos en SQLite, MySQL o PostgreSQL.

:::tip[Inicio rápido]

Ejecute Semaphore con SQLite con un solo comando, luego abra [http://localhost:3000](http://localhost:3000) e inicie sesión como `admin` / `changeme`.

```bash
docker run -d -p 3000:3000 \
  -e SEMAPHORE_DB_DIALECT=sqlite \
  -e SEMAPHORE_ADMIN=admin \
  -e SEMAPHORE_ADMIN_PASSWORD=changeme \
  -e SEMAPHORE_ADMIN_NAME=Admin \
  -e SEMAPHORE_ADMIN_EMAIL=admin@localhost \
  -v semaphore-data:/var/lib/semaphore \
  semaphoreui/semaphore:latest
```

Para producción, consulte [Instalación](/admin-guide/installation) para las instalaciones con Docker Compose, paquetes, Kubernetes y binario. Después, siga [Primeros pasos](/getting-started) para ejecutar su primera tarea.

:::

<div className="row home-cards">
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Instalar y configurar</h3></div>
      <div className="card__body">
        <p>Ponga en marcha un servidor y conéctelo a su base de datos, proveedor de identidad y red.</p>
        <ul>
          <li><a href="/admin-guide/installation">Instalación</a></li>
          <li><a href="/admin-guide/configuration">Configuración</a></li>
          <li><a href="/category/reverse-proxy">Proxy inverso y TLS</a></li>
          <li><a href="/admin-guide/ldap">LDAP</a> y <a href="/admin-guide/openid">OpenID Connect</a></li>
          <li><a href="/admin-guide/security">Refuerzo de la seguridad</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Ejecutar automatizaciones</h3></div>
      <div className="card__body">
        <p>Organice el trabajo en proyectos, conecte repositorios y credenciales, y ejecute tareas bajo demanda o de forma programada.</p>
        <ul>
          <li><a href="/getting-started">Primeros pasos: la primera tarea en seis pasos</a></li>
          <li><a href="/user-guide/projects">Proyectos</a> y <a href="/user-guide/team">Equipos</a></li>
          <li><a href="/user-guide/task-templates">Plantillas de tareas</a> y <a href="/user-guide/tasks">Tareas</a></li>
          <li><a href="/user-guide/key-store">Almacén de claves</a>, <a href="/user-guide/inventory">Inventario</a>, <a href="/user-guide/environment">Grupos de variables</a></li>
          <li><a href="/user-guide/schedules">Programaciones</a> y <a href="/user-guide/workflows">Flujos de trabajo</a> (Pro)</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Operar a escala</h3></div>
      <div className="card__body">
        <p>Distribuya la ejecución, funcione con redundancia y mantenga el servicio observable y actualizado.</p>
        <ul>
          <li><a href="/admin-guide/runners">Runners</a></li>
          <li><a href="/admin-guide/ha">Alta disponibilidad</a></li>
          <li><a href="/admin-guide/upgrading">Actualización</a></li>
          <li><a href="/admin-guide/logs">Registros</a> y <a href="/admin-guide/metrics">Métricas</a></li>
          <li><a href="/category/notifications">Notificaciones</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Referencia</h3></div>
      <div className="card__body">
        <p>Opciones y endpoints exactos para cuando ya sabe lo que busca.</p>
        <ul>
          <li><a href="/admin-guide/configuration/config-file">Archivo de configuración</a> y <a href="/admin-guide/configuration/env-vars">Variables de entorno</a></li>
          <li><a href="/admin-guide/api">API REST</a></li>
          <li><a href="/admin-guide/cli">CLI</a></li>
          <li><a href="/admin-guide/cicd">Integración CI/CD</a></li>
          <li><a href="/faq/troubleshooting">Preguntas frecuentes sobre resolución de problemas</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Guías por herramienta {#guides-by-tool}

<div className="home-tools margin-bottom--lg">
  <a className="button button--outline button--primary" href="/user-guide/apps/ansible">Ansible</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/terraform">Terraform / OpenTofu</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/bash">Shell</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/powershell">PowerShell</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/python">Python</a>
</div>

## Ayuda y comunidad {#help-and-community}

- **Preguntas:** pregunte en [Discord](https://discord.gg/5R6k7hNGcH).
- **Errores y solicitudes de funcionalidades:** abra un issue en [GitHub](https://github.com/semaphoreui/semaphore/issues).
- **Código fuente:** [github.com/semaphoreui/semaphore](https://github.com/semaphoreui/semaphore).
- **Pro y Enterprise:** [Activación de licencia](/admin-guide/license).
