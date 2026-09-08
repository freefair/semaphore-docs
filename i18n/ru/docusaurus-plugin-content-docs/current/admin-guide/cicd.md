# Pipeline'ы

Semaphore поддерживает простые pipeline'ы с использованием задач типа `build` и `deploy`. 

Semaphore передаёт переменную `semaphore_vars` в каждый запускаемый им playbook Ansible.

Вы можете использовать её в задачах Ansible, чтобы узнать, задача какого типа запущена, какую версию нужно собрать или развернуть, кто запустил задачу и т. д.

---

Пример `semaphore_vars` для задач `build`:

```yaml
semaphore_vars:
    task_details:
        type: build
        username: user123
        message: New version of some feature
        target_version: 1.5.33
```

Пример `semaphore_vars` для задач `deploy`:

```yaml
semaphore_vars:
    task_details:
        type: deploy
        username: user123
        message: Deploy new feature to servers
        incoming_version: 1.5.33
```

Для шаблонов **Bash**, **PowerShell** и **Python** Semaphore передаёт те же значения `task_details` в виде переменных окружения:

| Поле `task_details` | Переменная окружения | Примечания |
| --- | --- | --- |
| `type` | `SEMAPHORE_TASK_DETAILS_TYPE` | `build` или `deploy` |
| `username` | `SEMAPHORE_TASK_DETAILS_USERNAME` | Пользователь, запустивший задачу |
| `message` | `SEMAPHORE_TASK_DETAILS_MESSAGE` | Сообщение задачи |
| `target_version` | `SEMAPHORE_TASK_DETAILS_TARGET_VERSION` | Присутствует для задач `build` |
| `incoming_version` | `SEMAPHORE_TASK_DETAILS_INCOMING_VERSION` | Присутствует для задач `deploy` |

Пример для Bash:

```bash
echo "$SEMAPHORE_TASK_DETAILS_TYPE"
echo "$SEMAPHORE_TASK_DETAILS_TARGET_VERSION"
```

Пример для PowerShell:

```powershell
$env:SEMAPHORE_TASK_DETAILS_TYPE
$env:SEMAPHORE_TASK_DETAILS_INCOMING_VERSION
```

Пример для Python:

```python
import os

task_type = os.getenv("SEMAPHORE_TASK_DETAILS_TYPE")
target_version = os.getenv("SEMAPHORE_TASK_DETAILS_TARGET_VERSION")
incoming_version = os.getenv("SEMAPHORE_TASK_DETAILS_INCOMING_VERSION")
```

### Build {#build}

Задачи этого типа используются для создания [артефактов](https://en.wikipedia.org/wiki/Artifact\_\(software\_development\)). Каждая задача build получает автоматически сгенерированную версию. Используйте переменную `semaphore_vars.task_details.target_version` в playbook Ansible, чтобы узнать, какую версию артефакта нужно создать. После создания артефакт можно использовать для развёртывания.

---

Пример роли Ansible для `build`:

1. Получить исходный код приложения с GitHub
2. Скомпилировать исходный код
3. Упаковать собранный бинарный файл в tarball с именем `app-{{semaphore_vars.task_details.target_version}}.tar.gz`
4. Отправить `app-{{semaphore_vars.task_details.target_version}}.tar.gz` в S3-бакет



### Deploy {#deploy}

Задачи этого типа используются для развёртывания артефактов на целевые серверы. Каждая задача развёртывания связана с задачей build. Используйте переменную `semaphore_vars.task_details.incoming_version` в playbook Ansible, чтобы узнать, какую версию артефакта нужно развернуть.

---

Пример роли Ansible для `deploy`:

1. Скачать `app-{{semaphore_vars.task_details.incoming_version}}.tar.gz` из S3-бакета на целевые серверы
2. Распаковать `app-{{semaphore_vars.task_details.incoming_version}}.tar.gz` в целевой каталог
3. Создать или обновить файлы конфигурации
4. Перезапустить сервис приложения

