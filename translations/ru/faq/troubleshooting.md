# Устранение неполадок

<a id="runner-prints-error-404"></a>

## Runner выдаёт ошибку 404

<a id="how-to-fix"></a>

### Как исправить

[Getting 401 error code from Runner](https://github.com/semaphoreui/semaphore/discussions/1873?converting=1)

---

<a id="gathering-facts-issue-for-localhost"></a>

## Проблема Gathering Facts для localhost

Проблема может возникать в Semaphore UI, установленном через [Snap](https://snapcraft.io/semaphore) или [Docker](https://hub.docker.com/r/semaphoreui/semaphore).

```
4:10:16 PM
TASK [Gathering Facts] *********************************************************
4:10:17 PM
fatal: [localhost]: FAILED! => changed=false
```

<a id="why-this-happens"></a>

### Почему это происходит

Подробнее об использовании localhost в Ansible читайте в статье [Implicit 'localhost'](https://docs.ansible.com/ansible/latest/inventory/implicit_localhost.html).

Ansible пытается собрать факты локально, но Ansible находится в ограниченном изолированном контейнере, который этого не позволяет.

<a id="how-to-fix-this"></a>

### Как это исправить

Есть два способа:

1. Отключить сбор фактов:

```yaml
- hosts: localhost
  gather_facts: False
  roles:
    - ...
```

2. Явно задать тип подключения **ssh**:
```
[localhost]
127.0.0.1 ansible_connection=ssh ansible_ssh_user=your_localhost_user
```
---
<a id="panic-pq-ssl-is-not-enabled-on-the-server"></a>

## panic: pq: SSL is not enabled on the server

Это означает, что ваш Postgres не работает по SSL.

<a id="how-to-fix-this-1"></a>

### Как это исправить

Добавьте параметр `sslmode=disable` в файл конфигурации:

```json
	"postgres": {
		"host": "localhost",
		"user": "postgres",
		"pass": "pwd",
		"name": "semaphore",
		"options": {
			"sslmode": "disable"
		}
	},
```
---
<a id="fatal-bad-numeric-config-value-0-for-git_terminal_prompt-invalid-unit"></a>

## fatal: bad numeric config value '0' for 'GIT_TERMINAL_PROMPT': invalid unit

Это означает, что вы пытаетесь получить доступ по HTTPS к репозиторию, который требует аутентификации.

<a id="how-to-fix-this-2"></a>

### Как это исправить

* Перейдите на экран **Хранилище ключей**.
* Создайте новый ключ типа `Login with password`.
* Укажите ваш логин для GitHub/BitBucket и т. д.
* Укажите пароль. Для GitHub/BitBucket нельзя использовать пароль от учётной записи — вместо него следует использовать Personal Access Token (PAT). Подробнее [здесь](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).
* После создания ключа перейдите на экран **Репозитории**, найдите ваш репозиторий и укажите ключ.

---

<a id="git-clone-or-pull-fails-intermittently"></a>

## Git clone или pull периодически завершается ошибкой

В логах задач могут появляться сообщения вроде `Git pull failed (...), retrying in 2s`, за которыми следует либо успех, либо окончательная ошибка после нескольких попыток.

<a id="why-this-happens-1"></a>

### Почему это происходит

Git-сервер (GitHub, GitLab, Bitbucket или self-hosted экземпляр) был временно недоступен, вернул временную HTTP-ошибку, либо в сети между Semaphore и сервером произошёл кратковременный сбой. Semaphore автоматически повторяет операции clone и pull, прежде чем пометить задачу как неудачную.

<a id="how-to-fix-this-3"></a>

### Как это исправить

1. **Временные сбои**: обычно проходят сами. Semaphore повторяет попытки до `git_attempts` раз (по умолчанию 4) с экспоненциальной задержкой между попытками.
2. **Частые сбои**: увеличьте количество попыток в конфигурации:

```json
{
  "git_attempts": 8
}
```

Или через переменную окружения:

```bash
export SEMAPHORE_GIT_ATTEMPTS=8
```

3. **Немедленные, постоянные сбои**: повторные попытки не помогут. Проверьте URL репозитория, имя ветки, ключи доступа и сетевую доступность с сервера Semaphore или хоста runner’а.

Подробнее о `git_client` и `git_attempts` см. в разделе [Операции Git](../../../docs/admin-guide/configuration/config-file.md#git-operations).

---

<a id="bash-script-output-is-missing-or-incomplete"></a>

## Вывод Bash-скрипта отсутствует или неполный

Bash-задача завершается успешно, но в логе почти нет вывода от `echo`, `printf` или других команд — особенно когда скрипт завершается быстро.

<a id="why-this-happens-2"></a>

### Почему это происходит

Semaphore перехватывает stdout и stderr shell-команд во время их выполнения. Очень короткие скрипты могут завершиться раньше, чем будет прочитан весь буферизованный вывод, поэтому последние строки могут не попасть в лог задачи.

<a id="how-to-fix-this-4"></a>

### Как это исправить

1. **Обновитесь**: свежие версии Semaphore дочитывают вывод процесса, прежде чем пометить задачу завершённой. Обновите сервер и runner’ы, если вы используете старый релиз.
2. **Сбрасывайте буфер вывода в скрипте**, когда нужна гарантированная доставка:

```bash
#!/bin/bash
echo "Starting deploy"
echo "Done" >&2
```

Для критически важной диагностики записывайте данные в файл внутри рабочей области репозитория и выводите его через `cat` в конце скрипта.
3. **Избегайте тихого раннего выхода**: используйте `set -euo pipefail` и явные сообщения об ошибках, чтобы сбои были видны даже при скудном выводе.

---

<a id="unable-to-read-ldap-response-packet-unexpected-eof"></a>

## unable to read LDAP response packet: unexpected EOF

Скорее всего, вы пытаетесь подключиться к серверу LDAP небезопасным способом, тогда как он ожидает защищённое соединение (через TLS).

<a id="how-to-fix-this-5"></a>

### Как это исправить

Включите TLS в файле `config.json`:

```json
...
"ldap_needtls": true
...
```

---

<a id="ldap-result-code-49-invalid-credentials"></a>

## LDAP Result Code 49 "Invalid Credentials"

У вас неверный пароль или `binddn`.

<a id="how-to-fix-this-6"></a>

### Как это исправить

Используйте утилиту `ldapwhoami` и проверьте, работает ли ваш binddn:

```bash
ldapwhoami\
  -H ldap://ldap.com:389\
  -D "CN=/your/ldap_binddn/value/in/config/file"\
  -x\
  -W
```

Она интерактивно запросит пароль и должна вернуть код **0** и вывести указанный **DN**.

Также вы можете прочитать следующие статьи:
* [ldapsearch: Invalid credentials (49)](https://serverfault.com/q/771549/443463)
* [https://github.com/semaphoreui/semaphore/issues/906](https://github.com/semaphoreui/semaphore/issues/906)

---

<a id="ldap-result-code-32-no-such-object"></a>

## LDAP Result Code 32 "No Such Object"

В каталоге нет записи с тем distinguished name, который запросил Semaphore. Почти
всегда причина — неверный `ldap_searchdn`, реже — неверный `ldap_binddn`.

<a id="how-to-fix-this-7"></a>

### Как это исправить

Проверьте, что база поиска существует, используя те же учётные данные, что и Semaphore:

```bash
ldapsearch\
  -H ldap://ldap.example.com:389\
  -D "CN=/your/ldap_binddn/value/in/config/file"\
  -b "/your/ldap_searchdn/value/in/config/file"\
  -x\
  -W\
  -s base
```

- Код результата **32** от этой команды означает, что самой базы не существует.
  Исправьте `ldap_searchdn` в `config.json`; обычная причина — опечатка в
  компоненте, например `OU=Users` вместо фактического `OU=People`.
- Код результата **0** означает, что с базой всё в порядке, а проблема в
  `ldap_searchfilter`: он не находит ни одной записи ниже этой базы.

Значение каждой опции см. в разделе [LDAP и AD](../../../docs/admin-guide/authentication/ldap.md).
