# Installazione

È possibile installare Semaphore in diversi modi, a seconda del sistema operativo, dell'ambiente e delle preferenze.

<a id="in-this-section"></a>

## In questa sezione

| Metodo | Quando usarlo |
|---|---|
| [Gestore di pacchetti](../../../docs/admin-guide/installation/package-manager.md) | Vuoi un pacchetto nativo per la tua distribuzione Linux. |
| [Docker](../../../docs/admin-guide/installation/docker.md) | Vuoi eseguire Semaphore in un container con Docker o Docker Compose. |
| [Cloud](../../../docs/admin-guide/installation/cloud.md) | Esegui il deployment su una piattaforma cloud e cerchi indicazioni su servizi gestiti e infrastruttura. |
| [File binario](../../../docs/admin-guide/installation/binary-file.md) | Vuoi installare un binario precompilato e gestire il processo autonomamente. |
| [Kubernetes (Helm chart)](../../../docs/admin-guide/installation/k8s.md) | Usi già Kubernetes e vuoi gestire il deployment con Helm. |

<a id="installing-additional-python-packages"></a>

## Installazione di pacchetti Python aggiuntivi

Alcuni moduli e ruoli Ansible richiedono pacchetti Python aggiuntivi per funzionare. Per installare pacchetti Python aggiuntivi, creare un file `requirements.txt` e montarlo nella directory `/etc/semaphore` del container. Ad esempio, è possibile aggiungere le seguenti righe al file `docker-compose.yml`:

```yaml
volumes:
  - /path/to/requirements.txt:/etc/semaphore/requirements.txt
```

I pacchetti specificati nel file requirements verranno installati nell'ambiente virtuale Ansible incluso ogni volta che il container viene avviato. Lo stesso mount funziona per l'immagine `semaphoreui/runner`. Consultare [Installazione di dipendenze Python aggiuntive](../../../docs/admin-guide/installation/docker.md#installing-additional-python-dependencies) per i dettagli e per l'alternativa con immagine personalizzata.

Per ulteriori informazioni sui file requirements di Python, consultare il [riferimento sul formato dei file requirements di pip](https://pip.pypa.io/en/stable/reference/requirements-file-format/)

<a id="where-to-start"></a>

## Da dove iniziare

Inizia dalla guida per il tuo ambiente di deployment. Per un’installazione binaria, segui le istruzioni del servizio per mantenere Semaphore in esecuzione. Per configurare l’utente del servizio, le dipendenze Python e systemd, usa la guida all’installazione manuale.

* [Esecuzione come servizio](../../../docs/admin-guide/installation/binary-file.md#run-as-a-service)
* [Installazione manuale](../../../docs/admin-guide/installation_manually.md)
