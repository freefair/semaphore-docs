
# Runners de proyecto (Pro)

Los runners de proyecto son una potente función de Semaphore Pro que permite la ejecución distribuida de tareas en varios servidores. Esta función le permite ejecutar tareas en servidores distintos de su instancia de Semaphore UI, ofreciendo mayor seguridad, escalabilidad y gestión de recursos.

![](/assets/project_runners.webp)

## Descripción general {#overview}

Los runners de proyecto funcionan con un principio similar al de los runners de GitLab o GitHub Actions:

- Un runner se despliega en un servidor distinto del de su Semaphore UI
- El runner se conecta a su instancia de Semaphore mediante un token seguro
- Cuando se crean tareas, Semaphore las delega a los runners disponibles
- Los runners ejecutan las tareas y devuelven los resultados a Semaphore

## Ventajas {#benefits}

El uso de runners ofrece varias ventajas clave:

1. **Mayor seguridad**
   - Los runners pueden desplegarse en entornos aislados o redes restringidas
   - Las operaciones sensibles pueden ejecutarse en entornos controlados
   - Mejor separación de responsabilidades entre la interfaz y los entornos de ejecución

2. **Mejor escalabilidad**
   - Distribuya la carga de trabajo entre varios servidores
   - Añada o elimine runners según la demanda
   - Mejor aprovechamiento de los recursos de su infraestructura

3. **Despliegue flexible**
   - Despliegue runners cerca de su infraestructura de destino
   - Ejecute tareas en distintas zonas de red
   - Compatibilidad con varios modelos de despliegue (local, nube, híbrido)

## Uso de runners de proyecto {#using-project-runners}

### Requisitos previos {#prerequisites}

Para usar runners, necesita:

1. Una licencia de Semaphore Pro
2. Un servidor independiente para ejecutar el runner
3. Conectividad de red entre el runner y Semaphore UI
4. Una configuración adecuada tanto en el servidor de Semaphore UI como en el del runner

<!-- ### Configuration

1. **Semaphore UI Configuration**
  

2. **Runner Setup** -->


### Gestión de runners {#managing-runners}

Puede gestionar los runners desde Semaphore UI:

1. Vaya a la sección Runners de su proyecto
2. Consulte todos los runners registrados y su estado
3. Añada o elimine runners según sea necesario
4. Supervise el estado y el rendimiento de los runners

### Consideraciones de seguridad {#security-considerations}

- Use siempre HTTPS para la comunicación entre los runners y Semaphore UI
- Implemente una seguridad de red adecuada entre los runners y Semaphore UI
- Considere el uso de entornos aislados para las operaciones sensibles

## Buenas prácticas {#best-practices}

1. **Planificación de recursos**
   - Dimensione sus runners de forma adecuada a su carga de trabajo
   - Supervise el uso de recursos de los runners
   - Escale los runners según la demanda

2. **Configuración de red**
   - Asegure una conectividad de red adecuada
   - Configure los cortafuegos correctamente
   - Use canales de comunicación seguros

3. **Mantenimiento**
   - Actualice regularmente el software del runner
   - Supervise el estado de los runners
   - Implemente un registro y una supervisión adecuados
   - Disponga de una estrategia de respaldo ante fallos de los runners

4. **Seguridad**
   - Siga el principio de mínimo privilegio
   - Implemente controles de acceso adecuados
   - Realice auditorías de seguridad periódicas
   - Mantenga el software actualizado