# Уведомления

Semaphore может отправлять уведомления о задачах и активности в проектах в популярные каналы. Настройте глобальный механизм уведомлений в `config.json` и (где это поддерживается) переопределяйте отдельные параметры для каждого проекта.

Поддерживаемые провайдеры:

* [Email](/admin-guide/notifications/email)
* [Slack](/admin-guide/notifications/slack)
* [Telegram](/admin-guide/notifications/telegram)
* [Microsoft Teams](/admin-guide/notifications/teams)
* [RocketChat](/admin-guide/notifications/rocket)
* [DingTalk](/admin-guide/notifications/ding)
* [Gotify](/admin-guide/notifications/gotify)

## Как это работает {#how-it-works}

- **Глобальная конфигурация**: включите провайдера и задайте параметры подключения в `config.json` на сервере Semaphore. Точные ключи см. на странице каждого провайдера.
- **События**: уведомления отправляются при ключевых событиях жизненного цикла задачи (например, запуск, успех, ошибка) и публикуются в настроенный канал/webhook.
- **Переопределения для проектов**: некоторые провайдеры позволяют переопределять настройки для отдельных проектов. Например, Telegram поддерживает ID чата для конкретного проекта.



