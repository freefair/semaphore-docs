# Python

Semaphore može direktno da pokreće Python skripte. Da biste to uradili, kreirajte šablon zadatka (Task Template) tipa **Python**.

<a id="creating-a-python-template"></a>

## Kreiranje Python šablona

1. Otvorite odeljak **Šabloni zadataka** (Task Templates) i kliknite na dugme **Novi šablon** (New Template).
2. Izaberite **Python** kao tip aplikacije.
3. Podesite šablon:

| Polje | Opis |
|---|---|
| **Naziv** (Name) | Opisni naziv šablona |
| **Repozitorijum** (Repository) | Repozitorijum koji sadrži vašu `.py` skriptu |
| **Playbook / Skripta** (Playbook / Script) | Relativna putanja do skripte, npr. `scripts/deploy.py` |
| **Grupe promenljivih** (Variable Groups) | Grupe promenljivih čije se vrednosti ubacuju kao promenljive okruženja |

4. Kliknite **Kreiraj** (Create).
5. Kliknite **Pokreni** (Run) da biste izvršili šablon.

<a id="passing-variables-to-scripts"></a>

## Prosleđivanje promenljivih skriptama

Promenljive iz izabranih **grupa promenljivih** (Variable Groups) ubacuju se kao promenljive okruženja. Pristupite im u Python-u pomoću `os.environ`:

```python
import os

target = os.environ.get("TARGET_HOST")
print(f"Deploying to {target}")
```

<a id="python-version-and-dependencies"></a>

## Verzija Python-a i zavisnosti

Semaphore koristi onaj `python3` izvršni fajl koji se nalazi na `PATH`-u u okruženju za izvršavanje.

- **Binarna/paketna instalacija**: pobrinite se da je na hostu instaliran odgovarajući `python3`.
- **Docker**: koristite prilagođeni image sa potrebnom verzijom Python-a.
- **Docker (dodatni paketi)**: montirajte `requirements.txt` na `/etc/semaphore/requirements.txt` u kontejneru servera ili runner-a. Semaphore ga instalira u priloženo Python virtuelno okruženje pri svakom pokretanju kontejnera. Pogledajte [Instaliranje dodatnih Python zavisnosti](../../../../docs/admin-guide/installation/docker.md#installing-additional-python-dependencies).

<a id="notes"></a>

## Napomene

- Skripte se izvršavaju neinteraktivno.
- Izlazni kod `0` označava uspeh; svaki izlazni kod različit od nule označava zadatak (Task) kao neuspešan.
