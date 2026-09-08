# 🔐 Безопасность

## Введение {#introduction}

Безопасность — один из главных приоритетов Semaphore UI. Автоматизируете ли вы критически важные задачи инфраструктуры или управляете доступом команды к чувствительным системам, Semaphore UI спроектирован так, чтобы обеспечивать надёжную и безопасную работу «из коробки». В этом разделе описано, как Semaphore обеспечивает безопасность и что следует учитывать при развёртывании его в production.

## Аутентификация и авторизация {#authentication--authorization}

Semaphore поддерживает безопасную аутентификацию и гибкие механизмы авторизации:

- **Способы входа:**
  - **Логин/пароль**<br />Способ по умолчанию: учётные данные хранятся в базе данных Semaphore. Пароли хешируются стойким алгоритмом (bcrypt).

  - **LDAP**<br />Позволяет интегрироваться с корпоративными службами каталогов. Поддерживает фильтрацию пользователей/групп и защищённые соединения через LDAPS.

  - **OpenID Connect (OIDC)**<br />Обеспечивает единый вход (SSO) через провайдеров идентификации, таких как Google, Azure AD или Keycloak. Поддерживает пользовательские claims и сопоставление групп.

- **Двухфакторная аутентификация (2FA)**<br />Доступна 2FA на основе TOTP, рекомендуется для всех пользователей. Её можно включить для каждого пользователя отдельно; поддерживаются необязательные коды восстановления. См. параметры конфигурации `auth.totp.enabled` и `auth.totp.allow_recovery`.

- **Управление доступом на основе ролей**<br />Вы можете назначать пользователям различные роли, такие как Admin, Maintainer или Viewer, ограничивая доступ в соответствии с зоной ответственности.

- **Управление сессиями**<br />Сессии защищены безопасными HTTP-cookie. Истечение срока сессии и механизмы выхода сводят риски к минимуму.
<!-- - **Brute-Force Protection**: Login attempts are rate-limited to prevent brute-force attacks. -->

## Секреты и учётные данные {#secrets--credentials}

Безопасное управление секретами — одна из ключевых возможностей:

- **Зашифрованное хранилище ключей**<br />Учётные данные и секретные переменные шифруются при хранении с помощью AES.

- **Изоляция окружения**<br />Секреты передаются заданиям только во время выполнения и не раскрываются напрямую в окружении контейнера.

- **SSH-ключи и токены**<br />Пользователи сами отвечают за загрузку корректных SSH-ключей и токенов. Они хранятся в зашифрованном виде и используются только при выполнении задач.
- **Интеграция с HashiCorp Vault (Pro)**<br />Секреты можно хранить во внешнем экземпляре Vault. Место хранения выбирается для каждого секрета отдельно при его создании или редактировании.

## Шифрование данных {#data-encryption}

Чувствительные данные хранятся в базе данных в зашифрованном виде. Чтобы включить шифрование ключей доступа (Access Keys), задайте параметр `access_key_encryption` в файле конфигурации. Его значение необходимо сгенерировать командой:

```bash
head -c32 /dev/urandom | base64
```

## Запуск недоверенного кода / playbook’ов {#running-untrusted-code--playbooks}

Semaphore выполняет определённые пользователями playbook’и и команды, что может быть рискованно:

- **Изоляция контейнеров**<br />Задачи выполняются в изолированных Docker-контейнерах. Эти контейнеры не имеют доступа к хостовой системе.

- **Минимальные привилегии**<br />Контейнеры запускаются с минимальными правами, и их можно ограничить ещё сильнее с помощью флагов Docker.

- **Выполнение в chroot**<br />Semaphore может выполнять задачи внутри chroot-окружения, чтобы дополнительно изолировать среду выполнения от хостовой системы.

- **Пользователь процесса задачи**<br />Задачи можно выполнять от имени выделенного системного пользователя без прав root (например, `semaphore`), чтобы снизить последствия возможных эксплойтов. Это необязательно и настраивается в соответствии с политиками системы.
<!-- - **Resource Limits**: To prevent abuse, CPU and memory limits can be applied. -->

## Безопасное развёртывание {#secure-deployment}

Чтобы развёртывание Semaphore было безопасным:

- **Используйте HTTPS**<br />
    Semaphore поддерживает HTTPS как через **встроенную поддержку TLS**, так и через **обратный прокси, например Nginx**. В production настоятельно рекомендуется включить HTTPS.

    Чтобы включить встроенную поддержку HTTPS, добавьте следующий блок в **config.json**:
    ```json
    {
        ...
        "tls": {
            "enabled": true,
            "cert_file": "/path/to/cert/example.com.cert",
            "key_file": "/path/to/key/example.com.key"
        }
        ...
    }
    ```

- **Работайте за файрволом**<br />Ограничьте доступ к Semaphore UI и базе данных только доверенными IP-адресами.

- **Безопасность базы данных**<br />Используйте стойкие пароли и разрешайте доступ к базе данных только Semaphore.

## Обновления и управление патчами {#updates--patch-management}

Обновления безопасности публикуются регулярно:

- **Обновляйтесь вовремя**<br />Всегда используйте последний стабильный релиз.

- **Список изменений**<br />Перед обновлением просматривайте изменения на GitHub.

- **Автоматические обновления**<br />Если вы используете Docker, рассмотрите возможность автоматизации регулярных обновлений с помощью pipeline’ов.

<!-- ## Audit Logs & Monitoring

Semaphore provides basic audit logging:

- **User Activity**: Logins, failed attempts, and task executions are logged.
- **Configuration Changes**: Changes to settings, projects, and credentials are logged with timestamps.
- **Integration**: Logs can be forwarded to centralized logging systems like ELK or Prometheus exporters. -->

<!-- ## Backups & Disaster Recovery

To protect against data loss:

- **What to Back Up**: Semaphore database, configuration file, and secret storage.
- **How to Restore**: Follow the backup/restore guide in the admin docs.
- **Testing**: Periodically test restoring backups in a staging environment. -->

<!-- ## Common Vulnerabilities & Hardening Tips

- **Disable User Registration** if not needed to prevent unauthorized access.
- **Use Strong Passwords** and enforce complexity rules.
- **Limit Task Concurrency** to avoid resource exhaustion.
- **Restrict Access to Secrets** by managing team permissions carefully. -->

<!-- ## Compliance & Data Privacy

Semaphore collects minimal user data:

- **Data Handling**: Emails, IP logs, and session data are stored securely.
- **User Deletion**: Admins can delete user accounts and associated data upon request.
- **GDPR Compliance**: Self-hosted users are responsible for local compliance. -->

## Сообщение об уязвимостях {#reporting-vulnerabilities}

Нашли уязвимость? Помогите нам сохранить Semaphore безопасным:

- **Ответственное раскрытие**<br />Напишите нам на `security@semaphoreui.com`.
 
### Целевые сроки устранения уязвимостей {#vulnerability-resolution-targets}

Мы стремимся устранять сообщённые уязвимости в следующие целевые сроки:

- Критические: в течение 30 дней
- Высокие: в течение 60 дней
- Средние: в течение 90 дней
- Низкие: по мере возможности, как правило в течение 180 дней

Для активно эксплуатируемых проблем, затрагивающих последние стабильные релизы, могут выпускаться внеплановые патчи.

### Инструменты анализа безопасности кода {#code-security-tooling}

Мы используем CodeQL, Codacy, Snyk и Renovate для анализа кодовой базы и зависимостей, а также для автоматизации обновления зависимостей.
- **Без публичных эксплойтов**<br />Не раскрывайте уязвимости публично до выхода исправления.

- **Благодарности**<br />Исследователи безопасности по желанию могут быть упомянуты в примечаниях к релизу.

