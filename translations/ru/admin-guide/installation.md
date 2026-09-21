# Установка

Установить Semaphore можно несколькими способами в зависимости от вашей операционной системы, окружения и предпочтений.

<a id="in-this-section"></a>

## В этом разделе

| Способ | Когда использовать |
|---|---|
| [Менеджер пакетов](../../../docs/admin-guide/installation/package-manager.md) | Вам нужен нативный пакет для вашего дистрибутива Linux. |
| [Docker](../../../docs/admin-guide/installation/docker.md) | Вы хотите запускать Semaphore в контейнере с помощью Docker или Docker Compose. |
| [Облако](../../../docs/admin-guide/installation/cloud.md) | Вы развёртываете Semaphore на облачной платформе и ищете рекомендации по управляемым сервисам и инфраструктуре. |
| [Бинарный файл](../../../docs/admin-guide/installation/binary-file.md) | Вы хотите установить готовый бинарный файл и самостоятельно управлять процессом. |
| [Kubernetes (Helm chart)](../../../docs/admin-guide/installation/k8s.md) | Вы уже используете Kubernetes и хотите управлять развёртыванием через Helm. |

<a id="installing-additional-python-packages"></a>

## Установка дополнительных пакетов Python

Некоторым модулям и ролям Ansible для работы требуются дополнительные пакеты Python. Чтобы установить дополнительные пакеты Python, создайте файл `requirements.txt` и смонтируйте его в каталог `/etc/semaphore` контейнера. Например, можно добавить следующие строки в файл `docker-compose.yml`:

```yaml
volumes:
  - /path/to/requirements.txt:/etc/semaphore/requirements.txt
```

Пакеты, указанные в файле requirements, будут устанавливаться во встроенное виртуальное окружение Ansible при каждом запуске контейнера. То же монтирование работает и для образа `semaphoreui/runner`. Подробности и альтернативный вариант с собственным образом см. в разделе [Установка дополнительных зависимостей Python](../../../docs/admin-guide/installation/docker.md#installing-additional-python-dependencies).

Подробнее о файлах requirements для Python см. в [справочнике по формату файла requirements для pip](https://pip.pypa.io/en/stable/reference/requirements-file-format/)

<a id="where-to-start"></a>

## С чего начать

Начните с руководства для вашего окружения. При установке из бинарного файла настройте запуск в качестве службы, чтобы Semaphore продолжал работать. Настройка служебного пользователя, Python-зависимостей и systemd описана в руководстве по ручной установке.

* [Запуск в качестве службы](../../../docs/admin-guide/installation/binary-file.md#run-as-a-service)
* [Ручная установка](../../../docs/admin-guide/installation_manually.md)
