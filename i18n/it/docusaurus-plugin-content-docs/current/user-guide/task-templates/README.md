# Task Template

I template definiscono come eseguire i task di Semaphore. Attualmente sono supportati i seguenti tipi di task:

* [Ansible](/user-guide/apps/ansible)
* [Terraform/OpenTofu](/user-guide/apps/terraform)
* [Shell](/user-guide/apps/bash)
* [Powershell](/user-guide/apps/powershell)
* [Python](/user-guide/apps/python)

---

## Task paralleli {#parallel-tasks}

Per impostazione predefinita, i task dello stesso template vengono eseguiti in sequenza. Per consentire esecuzioni concorrenti dello stesso template, abilitare l'opzione "Consenti task paralleli" nelle impostazioni del template.

## Immagine dell'executor (runner Docker e Kubernetes) {#executor-image-docker-and-kubernetes-runners}

Quando un runner di progetto utilizza l'executor **Docker** (Pro) o **Kubernetes** (Enterprise), ogni task viene normalmente eseguito nell'immagine job predefinita configurata sul runner (ad esempio `semaphoreui/job:latest`). È possibile sovrascrivere questa immagine per singolo template.

1. Aprire le impostazioni del template
2. Impostare **Immagine dell'executor** sul riferimento dell'immagine del container (ad esempio `my-registry/ansible:2.16` o `semaphoreui/job:latest`)
3. Salvare il template

**Comportamento**:
- Solo gli executor dei runner **Docker** e **Kubernetes** rispettano questo campo; l'executor locale lo ignora
- Lasciare il campo vuoto per utilizzare l'immagine predefinita del runner da `runner.executor.docker.image` o `runner.executor.k8s.image`
- Svuotare il campo nell'interfaccia rimuove la sovrascrittura

**Casi d'uso**:
- Template che richiedono una toolchain diversa (una versione precedente di Ansible, una versione specifica di Terraform, pacchetti OS aggiuntivi inclusi in un'immagine personalizzata)
- Immagini isolate per template sensibili dal punto di vista della sicurezza, senza modificare l'impostazione predefinita a livello di runner

Consultare [Configurazione del runner](/admin-guide/configuration) per le impostazioni dell'immagine predefinita e [Runner di progetto](/user-guide/projects/runners) per la configurazione dell'executor.
