# Instalacija

Semaphore možete instalirati na više načina, u zavisnosti od operativnog sistema, okruženja i vaših preferencija.

<a id="in-this-section"></a>

## U ovom odeljku

| Metod | Kada ga koristiti |
|---|---|
| [Menadžer paketa](../../../docs/admin-guide/installation/package-manager.md) | Želite izvorni paket za svoju Linux distribuciju. |
| [Docker](../../../docs/admin-guide/installation/docker.md) | Želite da pokrenete Semaphore u kontejneru koristeći Docker ili Docker Compose. |
| [Oblak](../../../docs/admin-guide/installation/cloud.md) | Postavljate Semaphore na platformu u oblaku i potrebne su vam smernice za upravljane servise i infrastrukturu. |
| [Binarni fajl](../../../docs/admin-guide/installation/binary-file.md) | Želite da instalirate unapred kompajliranu binarnu datoteku i sami upravljate procesom. |
| [Kubernetes (Helm chart)](../../../docs/admin-guide/installation/k8s.md) | Već koristite Kubernetes i želite da upravljate postavljanjem pomoću Helm-a. |

<a id="installing-additional-python-packages"></a>

## Instaliranje dodatnih Python paketa

Neki Ansible moduli i uloge zahtevaju dodatne Python pakete za rad. Da biste instalirali dodatne Python pakete, kreirajte fajl `requirements.txt` i montirajte ga u direktorijum `/etc/semaphore` u kontejneru. Na primer, u fajl `docker-compose.yml` možete dodati sledeće linije:

```yaml
volumes:
  - /path/to/requirements.txt:/etc/semaphore/requirements.txt
```

Paketi navedeni u fajlu sa zahtevima biće instalirani u priloženo Ansible virtuelno okruženje pri svakom pokretanju kontejnera. Isto montiranje radi i za imidž `semaphoreui/runner`. Pogledajte [Instaliranje dodatnih Python zavisnosti](../../../docs/admin-guide/installation/docker.md#installing-additional-python-dependencies) za detalje i alternativu sa prilagođenim imidžom.

Više informacija o Python fajlovima sa zahtevima potražite u [referenci formata Pip requirements fajla](https://pip.pypa.io/en/stable/reference/requirements-file-format/)

<a id="where-to-start"></a>

## Odakle početi

Počnite od vodiča za svoje okruženje. Za binarnu instalaciju pratite uputstva za pokretanje kao servis kako bi Semaphore nastavio da radi. Za podešavanje servisnog korisnika, Python zavisnosti i systemd-a koristite vodič za ručnu instalaciju.

* [Pokretanje kao servis](../../../docs/admin-guide/installation/binary-file.md#run-as-a-service)
* [Ručna instalacija](../../../docs/admin-guide/installation_manually.md)
