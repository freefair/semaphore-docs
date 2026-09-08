# Устранение неполадок

## 1. Runner выдаёт ошибку 404 {#1-runner-prints-error-404}

### Как исправить {#how-to-fix}

[Getting 401 error code from Runner](https://github.com/semaphoreui/semaphore/discussions/1873?converting=1)

---

## 2. Проблема Gathering Facts для localhost {#2-gathering-facts-issue-for-localhost}

Проблема может возникать в Semaphore UI, установленном через [Snap](https://snapcraft.io/semaphore) или [Docker](https://hub.docker.com/r/semaphoreui/semaphore).

```
4:10:16 PM
TASK [Gathering Facts] *********************************************************
4:10:17 PM
fatal: [localhost]: FAILED! => changed=false
```

### Почему это происходит {#why-this-happens}

Подробнее об использовании localhost в Ansible читайте в статье [Implicit 'localhost'](https://docs.ansible.com/ansible/latest/inventory/implicit_localhost.html).

Ansible пытается собрать факты локально, но Ansible находится в ограниченном изолированном контейнере, который этого не позволяет.

### Как это исправить {#how-to-fix-this}

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
## 3. panic: pq: SSL is not enabled on the server {#3-panic-pq-ssl-is-not-enabled-on-the-server}

Это означает, что ваш Postgres не работает по SSL.

### Как это исправить {#how-to-fix-this-1}

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


## 4. fatal: bad numeric config value '0' for 'GIT_TERMINAL_PROMPT': invalid unit {#4-fatal-bad-numeric-config-value-0-for-git_terminal_prompt-invalid-unit}

Это означает, что вы пытаетесь получить доступ по HTTPS к репозиторию, который требует аутентификации.

### Как это исправить {#how-to-fix-this-2}

* Перейдите на экран **Хранилище ключей**.
* Создайте новый ключ типа `Login with password`.
* Укажите ваш логин для GitHub/BitBucket и т. д.
* Укажите пароль. Для GitHub/BitBucket нельзя использовать пароль от учётной записи — вместо него следует использовать Personal Access Token (PAT). Подробнее [здесь](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).
* После создания ключа перейдите на экран **Репозитории**, найдите ваш репозиторий и укажите ключ.


---

## 5. Git clone или pull периодически завершается ошибкой {#5-git-clone-or-pull-fails-intermittently}

В логах задач могут появляться сообщения вроде `Git pull failed (...), retrying in 2s`, за которыми следует либо успех, либо окончательная ошибка после нескольких попыток.

### Почему это происходит {#why-this-happens-1}

Git-сервер был временно недоступен или вернул временную ошибку. Semaphore автоматически повторяет операции clone и pull, прежде чем пометить задачу как неудачную.

### Как это исправить {#how-to-fix-this-3}

1. **Временные сбои**: обычно проходят сами. Semaphore повторяет попытки до `git_attempts` раз (по умолчанию 4) с экспоненциальной задержкой.
2. **Частые сбои**: увеличьте `git_attempts` в конфигурации или задайте `SEMAPHORE_GIT_ATTEMPTS`.
3. **Немедленные, постоянные сбои**: проверьте URL репозитория, ветку, ключи доступа и сетевую доступность.

Подробности настройки см. в разделе [Операции Git](/admin-guide/configuration/config-file#git-operations).

---

## 6. unable to read LDAP response packet: unexpected EOF {#6-unable-to-read-ldap-response-packet-unexpected-eof}

Скорее всего, вы пытаетесь подключиться к серверу LDAP небезопасным способом, тогда как он ожидает защищённое соединение (через TLS).

### Как это исправить {#how-to-fix-this-4}

Включите TLS в файле `config.json`:

```json
...
"ldap_needtls": true
...
```

---

## 7. LDAP Result Code 49 "Invalid Credentials" {#7-ldap-result-code-49-invalid-credentials}

У вас неверный пароль или `binddn`.

### Как это исправить {#how-to-fix-this-5}

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

## 8. LDAP Result Code 32 "No Such Object" {#8-ldap-result-code-32-no-such-object}

Скоро будет.
