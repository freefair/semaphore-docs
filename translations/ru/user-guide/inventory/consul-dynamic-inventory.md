# Динамический инвентарь Consul в Semaphore

![Ansible Badge](https://img.shields.io/badge/ansible-%23000.svg?style=for-the-badge&logo=ansible&logoColor=white)
![Consul Badge](https://img.shields.io/badge/Consul-%23F24C53.svg?style=for-the-badge&logo=consul&logoColor=white)

<a id="overview"></a>

## Обзор

В этом руководстве показано, как использовать [HashiCorp Consul](https://www.consul.io/) в качестве источника динамического инвентаря в Semaphore. Вместо ручного перечисления хостов Ansible будет во время выполнения запрашивать каталог Consul, чтобы определить целевые хосты.

Этот подход использует **Python-скрипт инвентаря**, закоммиченный в ваш git-репозиторий. Semaphore автоматически запускает скрипт при выполнении playbook.

<a id="prerequisites"></a>

## Предварительные требования

- Работающий кластер Consul с зарегистрированными узлами
- ACL-токен Consul с правом чтения каталога *(только если включены [ACL](https://developer.hashicorp.com/consul/docs/security/acl))*
- Python 3, установленный на хосте Semaphore (или раннере)
- Git-репозиторий для хранения playbook и скрипта инвентаря

<a id="step-1--create-the-inventory-script"></a>

## Шаг 1 — Создание скрипта инвентаря

Создайте в репозитории файл `inventory/consul_inventory.py`. Этот скрипт обращается к HTTP API Consul и возвращает информацию о хостах в формате, который ожидает Ansible.

```python
#!/usr/bin/env python3
"""
Consul dynamic inventory for Ansible.
Groups nodes by node_meta values and filters out unhealthy nodes.
"""

import json
import os
import sys
import urllib.request
import ssl

CONSUL_ADDR = os.environ.get("CONSUL_HTTP_ADDR", "https://consul.example.com")
CONSUL_TOKEN = os.environ.get("CONSUL_HTTP_TOKEN", "")

def consul_get(path):
    url = f"{CONSUL_ADDR}/v1/{path}"
    req = urllib.request.Request(url)
    if CONSUL_TOKEN:
        req.add_header("X-Consul-Token", CONSUL_TOKEN)
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, context=ctx) as resp:
        return json.loads(resp.read())

def is_healthy(node_name):
    """Return True if the node has a passing serfHealth check."""
    try:
        checks = consul_get(f"health/node/{node_name}")
        return any(
            c["CheckID"] == "serfHealth" and c["Status"] == "passing"
            for c in checks
        )
    except Exception:
        return False

def build_inventory():
    inventory = {"_meta": {"hostvars": {}}}
    all_hosts = []

    for node in consul_get("catalog/nodes"):
        name = node["Node"]

        if not is_healthy(name):
            continue

        all_hosts.append(name)
        inventory["_meta"]["hostvars"][name] = {
            "ansible_host": node["Address"],
            "ansible_user": "your_ssh_user",
            "ansible_python_interpreter": "/usr/bin/python3",
        }

    inventory["all"] = {"hosts": all_hosts}
    return inventory

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--host":
        print(json.dumps({}))
    else:
        print(json.dumps(build_inventory(), indent=2))
```

Сделайте скрипт исполняемым:

```bash
chmod +x inventory/consul_inventory.py
```

> **Tip**
>
> Вы можете доработать этот скрипт, чтобы группировать хосты по метаданным узлов Consul, тегам сервисов или дата-центрам. Приведённый выше пример — минимальная отправная точка.

<a id="step-2--set-up-your-repository"></a>

## Шаг 2 — Подготовка репозитория

Ваш репозиторий должен выглядеть так:

```
my-project/
├── inventory/
│   └── consul_inventory.py
└── playbook.yml
```

> **Note**
>
> Этот подход использует только стандартную библиотеку Python для прямого обращения к API Consul. Для работы скрипта инвентаря не требуются дополнительные коллекции Ansible.

Простой тестовый playbook (`playbook.yml`):

```yaml
- hosts: all
  gather_facts: false
  tasks:
    - name: Hello World
      ansible.builtin.debug:
        msg: "Hello from {{ inventory_hostname }}"
```

Отправьте этот репозиторий вашему git-провайдеру.

<a id="step-3--configure-semaphore"></a>

## Шаг 3 — Настройка Semaphore

<a id="add-a-variable-group"></a>

### Добавление группы переменных

Скрипт инвентаря читает адрес Consul и токен из переменных окружения. Создайте в Semaphore группу переменных, чтобы передать эти значения.

1. Откройте ваш проект и нажмите **Группы переменных**
2. Нажмите **Новая группа переменных**
3. Задайте имя (например, `consul-inventory`)
4. В разделе **Переменные окружения** добавьте:
   - `CONSUL_HTTP_ADDR` = `https://consul.example.com`
   - `CONSUL_HTTP_TOKEN` = `your-consul-acl-token` *(требуется только если в вашем кластере Consul включены [ACL](https://developer.hashicorp.com/consul/docs/security/acl))*
5. Нажмите **Создать**

> **Tip**
>
> Если в вашем кластере Consul не включены ACL, переменную `CONSUL_HTTP_TOKEN` можно не указывать. Скрипт инвентаря всё равно будет работать — он просто не будет отправлять токен аутентификации в запросах к API.

<a id="add-the-repository"></a>

### Добавление репозитория

1. Перейдите в **Репозитории** и нажмите **Новый репозиторий**
2. Введите git-URL вашего репозитория
3. Выберите ключ доступа для вашего git-провайдера
4. Нажмите **Создать**

<a id="add-the-inventory"></a>

### Добавление инвентаря

1. Перейдите в **Инвентарь** и нажмите **Новый инвентарь**
2. Задайте имя (например, `consul-dynamic-inventory`)
3. Выберите тип **File**
4. Введите путь: `inventory/consul_inventory.py`
5. Выберите SSH-ключ, который Ansible будет использовать для подключения к вашим хостам
6. Нажмите **Создать**

> **Note**
>
> Путь указывается относительно корня вашего git-репозитория. Semaphore клонирует репозиторий и передаёт этот путь в `ansible-playbook -i inventory/consul_inventory.py`.

<a id="create-a-task-template"></a>

### Создание шаблона задачи

1. Перейдите в **Шаблоны задач** и нажмите **Новый шаблон**
2. Задайте имя (например, `Consul Hello World`)
3. В поле **Playbook** укажите `playbook.yml`
4. Выберите репозиторий, инвентарь и группу переменных, созданные выше
5. Нажмите **Создать**

<a id="step-4--run-it"></a>

## Шаг 4 — Запуск

Нажмите **Запустить** в вашем шаблоне задачи. Semaphore выполнит следующее:

1. Клонирует ваш репозиторий
2. Выполнит playbook, используя ваш скрипт инвентаря Consul
3. Покажет вывод в логе задачи

Вы должны увидеть примерно такой вывод:

```
TASK [Hello World] *************************************************************
ok: [node-01] => {
    "msg": "Hello from node-01"
}
ok: [node-02] => {
    "msg": "Hello from node-02"
}
```

<a id="grouping-hosts-by-metadata"></a>

## Группировка хостов по метаданным

Consul поддерживает [метаданные узлов](https://developer.hashicorp.com/consul/docs/agent/config/config-files#node_meta) — пары «ключ-значение», привязанные к каждому узлу. Вы можете использовать их для автоматического создания групп Ansible.

Добавьте следующий код в функцию `build_inventory()` вашего скрипта после установки переменных хоста:

```python
        # Get node metadata
        node_detail = consul_get(f"catalog/node/{name}")
        meta = node_detail.get("Node", {}).get("Meta", {})

        # Group by metadata keys
        for key in ("role", "env", "os"):
            val = meta.get(key)
            if val:
                group = f"{key}_{val}"
                inventory.setdefault(group, {"hosts": []})
                inventory[group]["hosts"].append(name)
```

Так создаются группы вида `role_webserver`, `env_production` или `os_ubuntu`. Затем вы можете использовать их в своих playbook:

```yaml
- hosts: role_webserver
  tasks:
    - name: Restart nginx
      ansible.builtin.service:
        name: nginx
        state: restarted
```

<a id="further-reading"></a>

## Дополнительные материалы

- [Документация Ansible по динамическому инвентарю](https://docs.ansible.com/ansible/latest/inventory_guide/intro_dynamic_inventory.html)
- [API каталога Consul](https://developer.hashicorp.com/consul/api-docs/catalog)
- [Метаданные узлов Consul](https://developer.hashicorp.com/consul/docs/agent/config/config-files#node_meta)
