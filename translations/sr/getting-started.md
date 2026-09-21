# Prvi koraci

Ova stranica vas vodi od sveže instalacije do prvog uspešno izvršenog zadatka (Task). Svaki korak sadrži link ka stranici sa detaljima.

<a id="from-zero-to-first-task"></a>

## Od nule do prvog zadatka

1. **Instalirajte Semaphore** metodom koja vam odgovara: [Instalacija](../../docs/admin-guide/installation.md).
2. **Prijavite se** pomoću administratorskog korisnika koji ste kreirali tokom podešavanja ili preko promenljivih `SEMAPHORE_ADMIN_*` u Docker-u.
3. **Kreirajte projekat.** Projekat (Project) međusobno izoluje timove, infrastrukture ili aplikacije: [Projekti](../../docs/user-guide/projects.md).
4. **Povežite ono što je vašoj automatizaciji potrebno:**
   - Izvorni kod sa playbook-ovima, modulima ili skriptama: [Repozitorijumi](../../docs/user-guide/repositories.md).
   - SSH ključevi, tokeni i lozinke: [Skladište ključeva](../../docs/user-guide/key-store.md).
   - Ciljni hostovi i podešavanja konekcije: [Inventar](../../docs/user-guide/inventory.md).
   - Promenljive za ponovnu upotrebu: [Grupe promenljivih](../../docs/user-guide/environment.md).
5. **Kreirajte šablon zadatka i pokrenite ga.** Izaberite vodič za svoj alat: [Ansible](../../docs/user-guide/apps/ansible.md), [Terraform/OpenTofu](../../docs/user-guide/apps/terraform/README.md), [Shell](../../docs/user-guide/apps/bash.md), [PowerShell](../../docs/user-guide/apps/powershell.md) ili [Python](../../docs/user-guide/apps/python.md). Zatim ga pokrenite i pratite: [Zadaci](../../docs/user-guide/tasks.md).
6. **Automatizujte i uvedite u svakodnevni rad:**
   - Pokretanje po rasporedu: [Rasporedi](../../docs/user-guide/schedules.md).
   - Kontrola ko šta može da radi: [Timovi i prilagođene uloge](../../docs/user-guide/team.md).
   - Obaveštenja o rezultatima: [Obaveštenja](../../docs/admin-guide/notifications.md).

<a id="key-concepts"></a>

## Ključni pojmovi

Ovi pojmovi se pojavljuju svuda u korisničkom interfejsu.

| Pojam | Značenje |
|------|---------|
| **Projekat** (Project) | Osnovna jedinica razdvajanja. Svaki projekat ima sopstvene repozitorijume, ključeve, inventare, šablone i tim. [Projekti](../../docs/user-guide/projects.md) |
| **Repozitorijum** (Repository) | Git repozitorijum ili lokalna putanja u kojoj se nalaze playbook-ovi, moduli ili skripte. [Repozitorijumi](../../docs/user-guide/repositories.md) |
| **Inventar** (Inventory) | Hostovi, grupe i podešavanja konekcije za pokretanja u Ansible stilu. [Inventar](../../docs/user-guide/inventory.md) |
| **Grupa promenljivih** (Variable Group) | Promenljive za ponovnu upotrebu i konfiguracija okruženja, poznata i kao Environment. [Grupe promenljivih](../../docs/user-guide/environment.md) |
| **Skladište ključeva** (Key Store) | Šifrovani kredencijali kao što su SSH ključevi, tokeni i lozinke. [Skladište ključeva](../../docs/user-guide/key-store.md) |
| **Šablon zadatka** (Task Template) | Definicija pokretanja: aplikacija, repozitorijum, inventar, promenljive i opcije. [Šabloni zadataka](../../docs/user-guide/task-templates/README.md) |
| **Zadatak** (Task) | Jedno izvršavanje šablona, sa svojim logom i statusom. [Zadaci](../../docs/user-guide/tasks.md) |
| **Tok rada** (Workflow) | Graf šablona sa grananjem, odobrenjima i odlaganjima. Pro funkcionalnost. [Tokovi rada](../../docs/user-guide/workflows.md) |
| **Runner** | Mesto gde se zadaci izvršavaju: sam server ili udaljeni runner. [Runner-i](../../docs/admin-guide/runners.md) |

<a id="next-steps"></a>

## Sledeći koraci

- Postavite Semaphore iza TLS-a pomoću [obrnutog proksija](../../docs/admin-guide/reverse-proxy/README.md).
- Povežite svog provajdera identiteta: [LDAP](../../docs/admin-guide/authentication/ldap.md) ili [OpenID Connect](../../docs/admin-guide/authentication/openid.md).
- Upravljajte Semaphore-om iz CI-ja ili skripti pomoću [API-ja](../../docs/reference/api.md) i [CLI-ja](../../docs/reference/cli/README.md).
