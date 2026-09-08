# Task-Templates

Templates legen fest, wie Semaphore-Tasks ausgeführt werden. Derzeit werden die folgenden Task-Typen unterstützt:

* [Ansible](/user-guide/apps/ansible)
* [Terraform/OpenTofu](/user-guide/apps/terraform)
* [Shell](/user-guide/apps/bash)
* [Powershell](/user-guide/apps/powershell)
* [Python](/user-guide/apps/python)

---

## Parallele Tasks {#parallel-tasks}

Standardmäßig werden Tasks desselben Templates nacheinander ausgeführt. Um gleichzeitige Läufe desselben Templates zu erlauben, aktivieren Sie in den Template-Einstellungen die Option „Parallele Tasks erlauben“.

## Executor-Image (Docker- und Kubernetes-Runner) {#executor-image-docker-and-kubernetes-runners}

Wenn ein Projekt-Runner den **Docker**- (Pro) oder **Kubernetes**-Executor (Enterprise) verwendet, läuft jeder Task normalerweise im auf dem Runner konfigurierten Standard-Job-Image (zum Beispiel `semaphoreui/job:latest`). Sie können dieses Image pro Template überschreiben.

1. Öffnen Sie die Template-Einstellungen
2. Setzen Sie **Executor-Image** auf die Referenz des Container-Images (zum Beispiel `my-registry/ansible:2.16` oder `semaphoreui/job:latest`)
3. Speichern Sie das Template

**Verhalten**:
- Nur die **Docker**- und **Kubernetes**-Runner-Executoren berücksichtigen dieses Feld; der lokale Executor ignoriert es
- Lassen Sie das Feld leer, um das Standard-Image des Runners aus `runner.executor.docker.image` oder `runner.executor.k8s.image` zu verwenden
- Das Leeren des Feldes in der Oberfläche entfernt die Überschreibung

**Anwendungsfälle**:
- Templates, die eine andere Toolchain benötigen (älteres Ansible, eine bestimmte Terraform-Version, zusätzliche OS-Pakete in einem eigenen Image)
- Isolierte Images für sicherheitskritische Templates, ohne den Runner-weiten Standard zu ändern

Siehe [Runner-Konfiguration](/admin-guide/configuration) für die Standard-Image-Einstellungen und [Projekt-Runner](/user-guide/projects/runners) für die Einrichtung des Executors.
