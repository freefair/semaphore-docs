# Integraciones

Las integraciones permiten establecer la interacción entre Semaphore y servicios externos, como GitHub y GitLab.

![](/assets/integrations_1.jpg)

Mediante una integración, puede activar una plantilla concreta llamando a un endpoint especial (alias), para el cual puede configurar uno de los siguientes métodos de autenticación:
* Webhooks de GitHub
* Token
* HMAC
* Sin autenticación

El alias representa una URL con el siguiente formato: `/api/integrations/<random_string>`. Admite solicitudes `GET` y `POST`.

## Matchers {#matchers}

Con los matchers puede definir parámetros de la solicitud entrante. Cuando estos parámetros coinciden, se invoca la plantilla.

## Extractores de valores {#value-extractors}

Con un extractor puede extraer los datos necesarios de la solicitud entrante y pasarlos a la tarea como variables de entorno. Para que las variables extraídas se pasen a la
tarea, debe crear un entorno con las claves correspondientes. Asegúrese de que las claves del entorno coincidan con las variables definidas en el extractor, ya que esto permite que la tarea reciba
y use las variables de entorno correctas.

## Parámetros de la tarea {#task-parameters}

Las integraciones pueden activar tareas con parámetros. Use extractores de valores para construir una carga JSON con los parámetros de la tarea y configure la plantilla para que acepte valores solicitados.

## Notas sobre alias y matchers {#notes-on-aliases-and-matchers}

En las integraciones configuradas con un endpoint de alias, los matchers no se utilizan. Prefiera la autenticación por token/HMAC según sea necesario y pase los parámetros mediante extractores.
