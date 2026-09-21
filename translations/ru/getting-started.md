# Начало работы

Эта страница проведёт вас от свежей установки до первой успешно выполненной задачи. Каждый шаг ссылается на страницу с подробностями.

<a id="from-zero-to-first-task"></a>

## От нуля до первой задачи

1. **Установите Semaphore** удобным вам способом: [Установка](../../docs/admin-guide/installation.md).
2. **Войдите** под пользователем-администратором, созданным при установке, или через переменные `SEMAPHORE_ADMIN_*` в Docker.
3. **Создайте проект.** Проект изолирует команды, инфраструктуры или приложения друг от друга: [Проекты](../../docs/user-guide/projects.md).
4. **Подключите всё, что нужно вашей автоматизации:**
   - Исходный код с playbook’ами, модулями или скриптами: [Репозитории](../../docs/user-guide/repositories.md).
   - SSH-ключи, токены и пароли: [Хранилище ключей](../../docs/user-guide/key-store.md).
   - Целевые хосты и параметры подключения: [Inventory](../../docs/user-guide/inventory.md).
   - Переиспользуемые переменные: [Группы переменных](../../docs/user-guide/environment.md).
5. **Создайте шаблон задачи и запустите его.** Выберите руководство для вашего инструмента: [Ansible](../../docs/user-guide/apps/ansible.md), [Terraform/OpenTofu](../../docs/user-guide/apps/terraform/README.md), [Shell](../../docs/user-guide/apps/bash.md), [PowerShell](../../docs/user-guide/apps/powershell.md) или [Python](../../docs/user-guide/apps/python.md). Затем запустите задачу и наблюдайте за выполнением: [Задачи](../../docs/user-guide/tasks.md).
6. **Автоматизируйте и вводите в эксплуатацию:**
   - Запуск по расписанию: [Расписания](../../docs/user-guide/schedules.md).
   - Контроль того, кто что может делать: [Команды и пользовательские роли](../../docs/user-guide/team.md).
   - Оповещения о результатах: [Уведомления](../../docs/admin-guide/notifications.md).

<a id="key-concepts"></a>

## Ключевые понятия

Эти термины встречаются повсюду в интерфейсе.

| Термин | Значение |
|------|---------|
| **Проект** | Основная единица разделения. У каждого проекта свои репозитории, ключи, inventory, шаблоны и команда. [Проекты](../../docs/user-guide/projects.md) |
| **Репозиторий** | Git-репозиторий или локальный путь, где хранятся playbook’и, модули или скрипты. [Репозитории](../../docs/user-guide/repositories.md) |
| **Inventory** | Хосты, группы и параметры подключения для запусков в стиле Ansible. [Inventory](../../docs/user-guide/inventory.md) |
| **Группа переменных** | Переиспользуемые переменные и настройки окружения; также называется Environment. [Группы переменных](../../docs/user-guide/environment.md) |
| **Хранилище ключей** | Зашифрованные учётные данные: SSH-ключи, токены и пароли. [Хранилище ключей](../../docs/user-guide/key-store.md) |
| **Шаблон задачи** | Определение запуска: приложение, репозиторий, inventory, переменные и параметры. [Шаблоны задач](../../docs/user-guide/task-templates/README.md) |
| **Задача** | Одно выполнение шаблона с его логом и статусом. [Задачи](../../docs/user-guide/tasks.md) |
| **Workflow** | Граф шаблонов с ветвлениями, согласованиями и задержками. Функция Pro. [Workflows](../../docs/user-guide/workflows.md) |
| **Runner** | Место выполнения задач: сам сервер или удалённый runner. [Runners](../../docs/admin-guide/runners.md) |

<a id="next-steps"></a>

## Дальнейшие шаги

- Разместите Semaphore за TLS с помощью [обратного прокси](../../docs/admin-guide/reverse-proxy/README.md).
- Подключите провайдера идентификации: [LDAP](../../docs/admin-guide/authentication/ldap.md) или [OpenID Connect](../../docs/admin-guide/authentication/openid.md).
- Управляйте Semaphore из CI или скриптов через [API](../../docs/reference/api.md) и [CLI](../../docs/reference/cli/README.md).
