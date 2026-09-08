# API

## Справочник по API {#api-reference}

Semaphore UI предоставляет документацию API в двух форматах, чтобы вы могли выбрать тот, который лучше подходит для вашего рабочего процесса:

* [Swagger/OpenAPI](https://semaphoreui.com/api-docs) &mdash; идеально, если вы предпочитаете интерактивную работу в браузере.
* [Официальная коллекция Postman](https://www.postman.com/semaphoreui) &mdash; изучайте и тестируйте все эндпоинты в Postman.
* **Встроенная документация API на Swagger** &mdash; интерактивная документация API на базе Swagger UI. Она доступна прямо на вашем экземпляре.

![](/assets/swagger-link.webp)

Все варианты содержат полную документацию по доступным эндпоинтам, параметрам и примерам ответов.

## Начало работы с API {#getting-started-with-the-api}

Чтобы начать использовать API Semaphore, необходимо сгенерировать API-токен.
Этот токен нужно передавать в заголовке запроса в следующем виде:

```http
Authorization: Bearer YOUR_API_TOKEN
```

### Создание API-токена {#creating-an-api-token}

Создать API-токен можно двумя способами:
- Через веб-интерфейс
- С помощью HTTP-запроса

#### Через веб-интерфейс (начиная с 2.14) {#through-the-web-interface-since-214}

Вы можете создавать свои API-токены и управлять ими через веб-интерфейс Semaphore:

![API-токены](https://www.semaphoreui.com/uploads/v2.14/tokens.webp)

#### С помощью HTTP-запроса {#using-http-request}

Вы также можете пройти аутентификацию и сгенерировать токен сессии прямым HTTP-запросом.

Войдите в Semaphore (пароль нужно экранировать, например `slashy\\pass` вместо `slashy\pass`):

```bash
curl -v -c /tmp/semaphore-cookie -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-d '{"auth": "YOUR_LOGIN", "password": "YOUR_PASSWORD"}' \
http://localhost:3000/api/auth/login
```

Сгенерируйте новый токен и получите его:

```bash
curl -v -b /tmp/semaphore-cookie -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
http://localhost:3000/api/user/tokens
```

Команда должна вернуть что-то похожее на:

```json
{
    "id": "YOUR_ACCESS_TOKEN",
    "created": "2025-05-21T02:35:12Z",
    "expired": false,
    "user_id": 3
}
```
---

## Использование токена для запросов к API {#using-token-to-make-api-requests}

Получив API-токен, передавайте его в заголовке **Authorization** для аутентификации запросов.

### Запуск задачи {#launch-a-task}

Используйте этот токен для запуска задачи или любых других действий:

```bash
curl -v -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
-d '{"template_id": 1}' \
http://localhost:3000/api/project/1/tasks
```

---

## Отзыв API-токена {#expiring-an-api-token}

Если токен больше не нужен, его следует отозвать, чтобы обезопасить вашу учётную запись.

Чтобы вручную отозвать (сделать просроченным) API-токен, отправьте DELETE-запрос на эндпоинт токена:

```bash
curl -v -XDELETE \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
http://localhost:3000/api/user/tokens/YOUR_ACCESS_TOKEN
```
