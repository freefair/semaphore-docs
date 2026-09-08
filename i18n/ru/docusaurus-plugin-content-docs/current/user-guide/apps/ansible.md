
# Ansible

С помощью Semaphore UI вы можете запускать playbook’и Ansible. Для этого нужно создать шаблон **Ansible Playbook**.

1. Перейдите в раздел **Шаблоны задач**, нажмите **Новый шаблон**, а затем **Ansible Playbook**.

![](/assets/ansible_1.png)

2. Настройте шаблон.

Шаблон позволяет задать следующие параметры:

* Репозиторий
* Путь к файлу playbook
* Рабочий каталог (необязательно)
* Inventory
* Группы переменных
* Vault’ы
* Дополнительные аргументы CLI (tags, skip-tags, limit, уровень подробности)
* Переменные окружения

![](/assets/ansible_2.png)

## Рабочий каталог {#working-directory}

Используйте **Рабочий каталог**, чтобы запускать команды Ansible из подкаталога репозитория шаблона. Укажите путь относительно корня репозитория. Например, если `ansible.cfg` хранится в `<repository>/automation`, введите `automation`. Абсолютные пути и пути за пределами репозитория отклоняются. Если параметр не задан, Semaphore использует корень репозитория.

Рабочий каталог влияет на поведение Ansible, зависящее от текущего каталога процесса. [Порядок поиска файла конфигурации][ansible-config-search] Ansible включает `ansible.cfg` в текущем каталоге. Рабочий каталог также влияет на разрешение относительных путей в дополнительных аргументах CLI; примеры — [`--extra-vars @vars.yml`][ansible-extra-vars-file] и [`--private-key key.pem`][ansible-private-key]. Пути к playbook и файловому inventory остаются относительными к корням их репозиториев.

Изменение рабочего каталога само по себе не добавляет подкаталоги `roles/` или `collections/` этого каталога в пути поиска Ansible. [Поиск ролей относительно playbook][ansible-role-search] и [коллекции рядом с playbook][ansible-playbook-collections] по-прежнему определяются расположением playbook. Тем не менее рабочий каталог может косвенно влиять на их обнаружение, если выбранный `ansible.cfg` задаёт `roles_path` или `collections_path`.

[ansible-config-search]: https://docs.ansible.com/ansible/latest/reference_appendices/config.html#the-configuration-file
[ansible-extra-vars-file]: https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_variables.html#vars-from-a-json-or-yaml-file
[ansible-private-key]: https://docs.ansible.com/ansible/latest/cli/ansible-playbook.html#cmdoption-ansible-playbook-private-key
[ansible-role-search]: https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_reuse_roles.html#storing-and-finding-roles
[ansible-playbook-collections]: https://docs.ansible.com/ansible/latest/collections_guide/collections_installing.html#installing-collections-adjacent-to-playbooks

## Типы шаблонов {#template-types}

Шаблон ansible-playbook может быть одного из следующих типов:

* [Task](#task)
* [Build](#build)
* [Deploy](#deploy)

### Task {#task}

Просто запускает указанные playbook’и с указанными параметрами.

Если вы собираетесь запускать шаблон через API с использованием функции *limit*, обязательно включите опцию *Ansible prompts: Limit*. Иначе limit, переданный в вызове API, будет проигнорирован. Для задачи, запущенной через API, это не приведёт к интерактивному запросу — задача выполнится без участия пользователя.

### Build {#build}

Этот тип шаблона следует использовать для создания [артефактов](https://en.wikipedia.org/wiki/Artifact\_\(software\_development\)). Начальную версию артефакта можно указать в параметре шаблона. Каждый запуск увеличивает версию артефакта.

![](/assets/template_new_build_ipad1.png)

Semaphore не поддерживает артефакты «из коробки», он предоставляет только версионирование задач. Создание артефакта вы должны реализовать самостоятельно. Как это сделать, читайте в статье [CI/CD](../../admin-guide/cicd).

### Deploy {#deploy}

Этот тип шаблона следует использовать для развёртывания артефактов на целевые серверы. Каждый шаблон `deploy` связан с шаблоном `build`.


Это позволяет развернуть на серверы конкретную версию артефакта.

## Параметры шаблона {#template-options}

### Расписание {#schedule}

Вы можете настроить запуск задачи по расписанию, указав cron-расписание в настройках шаблона. Формат cron-выражений описан в [документации](https://pkg.go.dev/github.com/robfig/cron/v3#hdr-CRON\_Expression\_Format).


#### Запуск задачи при появлении нового commit’а в репозитории {#run-a-task-when-a-new-commit-is-added-to-the-repository}

Вы можете использовать cron, чтобы периодически проверять наличие новых commit’ов в репозитории и запускать задачу при их появлении.

Например, у вас есть исходный код приложения в git-репозитории. Вы можете добавить его в **Репозитории** и запускать задачу Build для новых commit’ов.


### Tags, skip-tags и limit {#tags-skip-tags-and-limit}

Шаблоны поддерживают параметры CLI Ansible:

- `--tags`
- `--skip-tags`
- `--limit`

Их можно задать в шаблоне и переопределить при создании задачи. Если вы планируете передавать эти значения через API, убедитесь, что включены соответствующие prompts.

### Параллелизм (`--forks` / `-f`) {#parallelism---forks---f}

Управляйте тем, к скольким хостам Ansible подключается параллельно, передав `--forks` или
`-f` в поле **Дополнительные аргументы CLI** шаблона. Аргументы должны быть корректным JSON —
используйте массив отдельных токенов:

```json
["--forks", "10"]
```

Краткая форма также поддерживается:

```json
["-f", "10"]
```

Если в шаблоне включена опция **Разрешить переопределение аргументов в задаче**, задача может
передать собственное значение forks во время запуска. Ansible получает аргументы и шаблона, и
задачи; побеждает последний `--forks` / `-f` в командной строке.

Если аргументы не являются корректным JSON, задача завершается с понятной ошибкой
валидации ещё до начала выполнения.

### Аутентификация {#authentication}

Аутентификация на хостах в playbook выполняется с помощью ссылок на пользователей из Хранилища ключей в inventory. Пользователь для SSH определяется необязательным полем пользователя в элементе Хранилища ключей.

### Несколько паролей Vault {#multiple-vault-passwords}

Вы можете привязать к шаблону несколько паролей Vault из Хранилища ключей. Во время выполнения Ansible попытается выполнить расшифровку с использованием предоставленных паролей.

### Уровень подробности {#verbosity-level}

Вы можете настроить уровень подробности вывода Ansible для задачи (например, `-v`, `-vvv`) в форме шаблона/задачи, чтобы упростить диагностику.
