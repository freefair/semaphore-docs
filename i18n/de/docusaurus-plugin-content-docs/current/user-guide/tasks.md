# Tasks

Ein Task ist eine Instanz der Ausführung eines Ansible-Playbooks. Sie können den Task aus einem [Task-Template](task-templates/) erstellen, indem Sie beim gewünschten Template auf die Schaltfläche Run/Build/Deploy klicken.

![](/assets/image6.png)

Der Task-Typ **Deploy** ermöglicht es Ihnen, eine Version des dem Task zugeordneten Builds anzugeben. Standardmäßig ist dies die neueste Build-Version.

![](/assets/task_deploy1.png)

Während der Task läuft oder nachdem er abgeschlossen ist, können Sie den Task-Status und das laufende Log einsehen.

![](/assets/image7.png)

### Rohansicht des Logs {#raw-log-view}

Sie können das unverarbeitete Roh-Log des Tasks über die Aktion RAW LOG im Task-Log-Fenster öffnen.

## Aufbewahrung von Task-Logs {#tasks-log-retention}
Sie werden feststellen, dass die Logs früherer Läufe Ihrer Tasks im Task-Template oder im Dashboard verfügbar sind.

Standardmäßig ist die Log-Aufbewahrung jedoch unbegrenzt.

Sie können dies über den Parameter `max_tasks_per_template` in `config.json` oder die Umgebungsvariable `SEMAPHORE_MAX_TASKS_PER_TEMPLATE` konfigurieren.

