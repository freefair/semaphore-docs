---
title: Документация Semaphore UI
sidebar_label: Главная
hide_table_of_contents: true
---

# Документация Semaphore UI

Semaphore UI — это самостоятельно размещаемый веб-интерфейс и API для запуска автоматизации на **Ansible**, **Terraform/OpenTofu**, **Shell**, **PowerShell** и **Python**. Он даёт вашей команде единое место, где можно запускать playbook'и и скрипты, хранить учётные данные в зашифрованном виде, планировать задания и видеть, кто, что и когда запускал.

Он поставляется в виде единого бинарного файла на Go или Docker-образа, работает на Linux, macOS и Windows и хранит данные в SQLite, MySQL или PostgreSQL.

:::tip[Быстрый старт]

Запустите Semaphore с SQLite одной командой, затем откройте [http://localhost:3000](http://localhost:3000) и войдите как `admin` / `changeme`.

```bash
docker run -d -p 3000:3000 \
  -e SEMAPHORE_DB_DIALECT=sqlite \
  -e SEMAPHORE_ADMIN=admin \
  -e SEMAPHORE_ADMIN_PASSWORD=changeme \
  -e SEMAPHORE_ADMIN_NAME=Admin \
  -e SEMAPHORE_ADMIN_EMAIL=admin@localhost \
  -v semaphore-data:/var/lib/semaphore \
  semaphoreui/semaphore:latest
```

Для продуктивной среды см. раздел [Установка](/admin-guide/installation), где описаны Docker Compose, пакеты, Kubernetes и установка из бинарного файла. Затем следуйте разделу [Начало работы](/getting-started), чтобы запустить первую задачу.

:::

<div className="row home-cards">
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Установка и настройка</h3></div>
      <div className="card__body">
        <p>Запустите сервер и подключите его к базе данных, провайдеру идентификации и сети.</p>
        <ul>
          <li><a href="/admin-guide/installation">Установка</a></li>
          <li><a href="/admin-guide/configuration">Конфигурация</a></li>
          <li><a href="/category/reverse-proxy">Обратный прокси и TLS</a></li>
          <li><a href="/admin-guide/ldap">LDAP</a> и <a href="/admin-guide/openid">OpenID Connect</a></li>
          <li><a href="/admin-guide/security">Усиление безопасности</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Запуск автоматизации</h3></div>
      <div className="card__body">
        <p>Организуйте работу в проекты, подключите репозитории и учётные данные и запускайте задачи по запросу или по расписанию.</p>
        <ul>
          <li><a href="/getting-started">Начало работы: первая задача за шесть шагов</a></li>
          <li><a href="/user-guide/projects">Проекты</a> и <a href="/user-guide/team">Команды</a></li>
          <li><a href="/user-guide/task-templates">Шаблоны задач</a> и <a href="/user-guide/tasks">Задачи</a></li>
          <li><a href="/user-guide/key-store">Хранилище ключей</a>, <a href="/user-guide/inventory">Inventory</a>, <a href="/user-guide/environment">Группы переменных</a></li>
          <li><a href="/user-guide/schedules">Расписания</a> и <a href="/user-guide/workflows">Рабочие процессы</a> (Pro)</li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Эксплуатация в масштабе</h3></div>
      <div className="card__body">
        <p>Распределяйте выполнение, обеспечивайте отказоустойчивость и поддерживайте наблюдаемость и актуальность сервиса.</p>
        <ul>
          <li><a href="/admin-guide/runners">Runner'ы</a></li>
          <li><a href="/admin-guide/ha">Высокая доступность</a></li>
          <li><a href="/admin-guide/upgrading">Обновление</a></li>
          <li><a href="/admin-guide/logs">Логи</a> и <a href="/admin-guide/metrics">Метрики</a></li>
          <li><a href="/category/notifications">Уведомления</a></li>
        </ul>
      </div>
    </div>
  </div>
  <div className="col col--6 margin-bottom--lg">
    <div className="card">
      <div className="card__header"><h3>Справочник</h3></div>
      <div className="card__body">
        <p>Точные опции и эндпоинты, когда вы уже знаете, что ищете.</p>
        <ul>
          <li><a href="/admin-guide/configuration/config-file">Файл конфигурации</a> и <a href="/admin-guide/configuration/env-vars">Переменные окружения</a></li>
          <li><a href="/admin-guide/api">REST API</a></li>
          <li><a href="/admin-guide/cli">CLI</a></li>
          <li><a href="/admin-guide/cicd">Интеграция с CI/CD</a></li>
          <li><a href="/faq/troubleshooting">FAQ по устранению неполадок</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>

## Руководства по инструментам {#guides-by-tool}

<div className="home-tools margin-bottom--lg">
  <a className="button button--outline button--primary" href="/user-guide/apps/ansible">Ansible</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/terraform">Terraform / OpenTofu</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/bash">Shell</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/powershell">PowerShell</a>
  <a className="button button--outline button--primary" href="/user-guide/apps/python">Python</a>
</div>

## Помощь и сообщество {#help-and-community}

- **Вопросы:** задавайте в [Discord](https://discord.gg/5R6k7hNGcH).
- **Ошибки и запросы функций:** создайте issue на [GitHub](https://github.com/semaphoreui/semaphore/issues).
- **Исходный код:** [github.com/semaphoreui/semaphore](https://github.com/semaphoreui/semaphore).
- **Pro и Enterprise:** [Активация лицензии](/admin-guide/license).
