# Ansible

С помощью Semaphore UI вы можете запускать playbook’и Ansible. Для этого нужно создать шаблон **Ansible Playbook**.

1. Перейдите в раздел **Task Templates**, нажмите **New Template**, а затем **Ansible Playbook**.

![](../../../../static/assets/ansible_1.png)

2. Настройте шаблон.

Шаблон позволяет задать следующие параметры:

* Репозиторий
* Путь к файлу playbook
* Рабочий каталог (необязательно)
* Инвентарь
* Группы переменных
* Vault’ы
* Дополнительные аргументы CLI (tags, skip-tags, limit, уровень подробности)
* Переменные окружения

![](../../../../static/assets/ansible_2.png)

<a id="working-directory"></a>

## Рабочий каталог

Используйте **Working directory**, чтобы запускать команды Ansible из подкаталога репозитория шаблона. Укажите путь относительно корня репозитория. Например, если `ansible.cfg` хранится в `<repository>/automation`, введите `automation`. Абсолютные пути и пути за пределами репозитория отклоняются. Если параметр не задан, Semaphore использует корень репозитория.

Рабочий каталог влияет на поведение Ansible, зависящее от текущего каталога процесса. [Порядок поиска файла конфигурации][ansible-config-search] Ansible включает `ansible.cfg` в текущем каталоге. Рабочий каталог также влияет на разрешение относительных путей в дополнительных аргументах CLI; примеры — [`--extra-vars @vars.yml`][ansible-extra-vars-file] и [`--private-key key.pem`][ansible-private-key]. Пути к playbook и файловому инвентарю остаются относительными к корням их репозиториев.

Изменение рабочего каталога само по себе не добавляет подкаталоги `roles/` или `collections/` этого каталога в пути поиска Ansible. [Поиск ролей относительно playbook][ansible-role-search] и [коллекции рядом с playbook][ansible-playbook-collections] по-прежнему определяются расположением playbook. Тем не менее рабочий каталог может косвенно влиять на их обнаружение, если выбранный `ansible.cfg` задаёт `roles_path` или `collections_path`.

[ansible-config-search]: https://docs.ansible.com/ansible/latest/reference_appendices/config.html#the-configuration-file
[ansible-extra-vars-file]: https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_variables.html#vars-from-a-json-or-yaml-file
[ansible-private-key]: https://docs.ansible.com/ansible/latest/cli/ansible-playbook.html#cmdoption-ansible-playbook-private-key
[ansible-role-search]: https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_reuse_roles.html#storing-and-finding-roles
[ansible-playbook-collections]: https://docs.ansible.com/ansible/latest/collections_guide/collections_installing.html#installing-collections-adjacent-to-playbooks

<a id="template-types"></a>

## Типы шаблонов

Шаблон ansible-playbook может быть одного из следующих типов:

* [Task](#task)
* [Build](#build)
* [Deploy](#deploy)

<a id="task"></a>

### Task

Просто запускает указанные playbook’и с указанными параметрами.

Если вы собираетесь запускать шаблон через API с использованием функции *limit*, обязательно включите опцию *Ansible prompts: Limit*. Иначе limit, переданный в вызове API, будет проигнорирован. Для задачи, запущенной через API, это не приведёт к интерактивному запросу — задача выполнится без участия пользователя.

<a id="build"></a>

### Build

Этот тип шаблона следует использовать для создания [артефактов](https://en.wikipedia.org/wiki/Artifact\_\(software\_development\)). Начальную версию артефакта можно указать в параметре шаблона. Каждый запуск увеличивает версию артефакта.

![](../../../../static/assets/template_new_build_ipad1.png)

Semaphore не поддерживает артефакты «из коробки», он предоставляет только версионирование задач. Создание артефакта вы должны реализовать самостоятельно. Как это сделать, читайте в статье [CI/CD](../../admin-guide/cicd.md).

<a id="deploy"></a>

### Deploy

Этот тип шаблона следует использовать для развёртывания артефактов на целевые серверы. Каждый шаблон `deploy` связан с шаблоном `build`.

Это позволяет развернуть на серверы конкретную версию артефакта.

<a id="template-options"></a>

## Параметры шаблона

<a id="schedule"></a>

### Расписание

Вы можете настроить запуск задачи по расписанию, указав cron-расписание в настройках шаблона. Формат cron-выражений описан в [документации](https://pkg.go.dev/github.com/robfig/cron/v3#hdr-CRON\_Expression\_Format).

<a id="run-a-task-when-a-new-commit-is-added-to-the-repository"></a>

#### Запуск задачи при появлении нового коммита в репозитории

Вы можете использовать cron, чтобы периодически проверять наличие новых коммитов в репозитории и запускать задачу при их появлении.

Например, у вас есть исходный код приложения в git-репозитории. Вы можете добавить его в **Repositories** и запускать задачу Build для новых коммитов.

<a id="tags-skip-tags-and-limit"></a>

### Tags, skip-tags и limit

Шаблоны поддерживают параметры CLI Ansible:

- `--tags`
- `--skip-tags`
- `--limit`

Их можно задать в шаблоне и переопределить при создании задачи. Если вы планируете передавать эти значения через API, убедитесь, что включены соответствующие подсказки.

<a id="galaxy-requirements"></a>

### Требования Galaxy

Перед запуском playbook Semaphore устанавливает роли и коллекции из файлов `requirements.yml`, найденных в каталоге playbook, в корне репозитория, а также в их подкаталогах `roles/` и `collections/`, с помощью `ansible-galaxy install --force`.

Чтобы не выполнять установку при каждом запуске, Semaphore сохраняет контрольную сумму каждого файла требований и повторяет установку только при изменении файла. Этим поведением управляют две опции шаблона в сворачиваемом разделе **Galaxy install options** (под **Ansible prompts**):

- **Skip Galaxy install** — вообще не запускать `ansible-galaxy`. Используйте эту опцию, если требования уже предустановлены в образе раннера.
- **Force Galaxy install** — всегда запускать `ansible-galaxy install --force`, игнорируя сохранённую контрольную сумму. Используйте эту опцию, если файл требований указывает на изменяющуюся цель (например, на ветку, а не на тег) и вы хотите получать последнюю версию при каждом запуске.

Опцию **Skip Galaxy install** можно вывести в форму запуска задачи, включив одноимённый флажок в разделе **Prompts** в нижней части этого блока. Если подсказка включена, значение, выбранное при запуске, переопределяет значение по умолчанию из шаблона.

<a id="galaxy-extra-args"></a>

#### Дополнительные аргументы Galaxy

Поля **Role install args** и **Collection install args** (в сворачиваемом разделе **Galaxy install options** под **Ansible prompts**; по умолчанию свёрнут, а счётчик рядом с ним показывает, сколько настроек Galaxy изменено) добавляют флаги к `ansible-galaxy role install` и `ansible-galaxy collection install` соответственно. Они настраиваются по отдельности, поскольку эти подкоманды принимают разные флаги: например, `--pre` допустим только для коллекций.

Каждая запись — это один токен argv; значение можно указать либо внутри записи (`--timeout=60`), либо следующей записью (`--timeout`, `60`). Принимаются только следующие флаги:

| Область | Флаги |
|-------|-------|
| Оба | `-c`/`--ignore-certs`, `-f`/`--force`, `--force-with-deps`, `-i`/`--ignore-errors`, `-n`/`--no-deps`, `-s`/`--server <url>`, `--timeout <seconds>`, `-v`…`-vvvv`/`--verbose` |
| Только роли | `-g`/`--keep-scm-meta` |
| Только коллекции | `--pre`, `-U`/`--upgrade`, `--offline`, `--no-cache`, `--clear-response-cache`, `--disable-gpg-verify`, `--keyring <path>`, `--signature <url>`, `--required-valid-signature-count <n>`, `--ignore-signature-status-code(s) <code>` |

Всё остальное отклоняется при сохранении шаблона. В частности, `--token`/`--api-key` не допускаются, поскольку аргументы командной строки видны в списке процессов — задавайте учётные данные Galaxy через переменные окружения (например, `ANSIBLE_GALAXY_SERVER_<NAME>_TOKEN`) в группе переменных. Файл требований (`-r`) задаёт сам Semaphore, а пути установки (`-p`, `--roles-path`, `--collections-path`) сознательно не принимаются, чтобы шаблон не мог записывать файлы за пределами репозитория — вместо этого задавайте `roles_path`/`collections_path` в `ansible.cfg` либо через `ANSIBLE_ROLES_PATH`/`ANSIBLE_COLLECTIONS_PATH`.

<a id="parallelism---forks---f"></a>

### Параллелизм (`--forks` / `-f`)

Управляйте тем, к скольким хостам Ansible подключается параллельно, передав `--forks` или
`-f` в поле **Extra CLI arguments** шаблона. Аргументы должны быть корректным JSON —
используйте массив отдельных токенов:

```json
["--forks", "10"]
```

Краткая форма также поддерживается:

```json
["-f", "10"]
```

Если в шаблоне включена опция **Allow override arguments in task**, задача может
передать собственное значение forks во время запуска. Ansible получает аргументы и шаблона, и
задачи; побеждает последний `--forks` / `-f` в командной строке.

Если аргументы не являются корректным JSON, задача завершается с понятной ошибкой
валидации ещё до начала выполнения.

<a id="authentication"></a>

### Аутентификация

Аутентификация на хостах в playbook выполняется с помощью ссылок на пользователей из хранилища ключей в инвентаре. Пользователь для SSH определяется необязательным полем пользователя в элементе хранилища ключей.

<a id="multiple-vault-passwords"></a>

### Несколько паролей Vault

Вы можете привязать к шаблону несколько паролей Vault из хранилища ключей. Во время выполнения Ansible попытается выполнить расшифровку с использованием предоставленных паролей.

<a id="verbosity-level"></a>

### Уровень подробности

Вы можете настроить уровень подробности вывода Ansible для задачи (например, `-v`, `-vvv`) в форме шаблона или задачи, чтобы упростить диагностику.
