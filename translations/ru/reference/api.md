# API

<a id="api-reference"></a>

## Справочник по API

Semaphore UI предоставляет документацию API в двух форматах, чтобы вы могли выбрать наиболее подходящий для вашего рабочего процесса:

* [Swagger/OpenAPI](../../../docs/reference/api.md) &mdash; идеально, если вы предпочитаете интерактивную работу в браузере.
* [Официальная коллекция Postman](https://www.postman.com/semaphoreui) &mdash; изучайте и тестируйте все конечные точки в Postman.
* **Встроенная документация API Swagger** &mdash; интерактивная документация API на основе Swagger UI. Доступна на вашем экземпляре.

![](../../../static/assets/swagger-link.webp)

Все варианты включают полную документацию доступных конечных точек, параметров и примеры ответов.

<a id="getting-started-with-the-api"></a>

## Начало работы с API

Чтобы начать использовать API Semaphore, необходимо сгенерировать API-токен.
Этот токен должен передаваться в заголовке запроса в виде:

```http
Authorization: Bearer YOUR_API_TOKEN
```

<a id="creating-an-api-token"></a>

### Создание API-токена

Есть два способа создать API-токен:
- Через веб-интерфейс
- С помощью HTTP-запроса

<a id="through-the-web-interface-since-214"></a>

#### Через веб-интерфейс (начиная с 2.14)

Откройте меню аккаунта в нижней части боковой панели и выберите **API-токены**. На странице перечислены ваши токены; ссылка **Справочник по API** на ней открывает Swagger UI, встроенный в ваш экземпляр.

![API-токены](../../../static/assets/api-tokens.webp)

Нажмите **Новый токен**, введите имя, выберите срок действия токена и скопируйте значение, показанное после создания. См. [Ваш аккаунт](../../../docs/user-guide/account.md#api-tokens).

![Диалог создания токена](../../../static/assets/api-token-new.webp)

<a id="using-http-request"></a>

#### С помощью HTTP-запроса

Вы также можете аутентифицироваться и сгенерировать токен сеанса прямым HTTP-запросом.

Войдите в Semaphore (пароль необходимо экранировать, например `slashy\\pass` вместо `slashy\pass`):

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

<a id="using-token-to-make-api-requests"></a>

## Использование токена для запросов к API

Получив API-токен, передавайте его в заголовке **Authorization** для аутентификации запросов.

<a id="launch-a-task"></a>

### Запуск задачи

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

<a id="expiring-an-api-token"></a>

## Отзыв API-токена

Если токен больше не нужен, его следует отозвать, чтобы обеспечить безопасность аккаунта.

Чтобы вручную отозвать (сделать просроченным) API-токен, отправьте DELETE-запрос на конечную точку токена:

```bash
curl -v -XDELETE \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
http://localhost:3000/api/user/tokens/YOUR_ACCESS_TOKEN
```
