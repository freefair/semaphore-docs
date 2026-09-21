# Inventar

![Lista inventara](../../../static/assets/inventory-list.webp)

Inventar (Inventory) je fajl koji sadrži listu hostova na kojima će Ansible izvršavati play-ove.
Inventar takođe čuva promenljive koje playbook-ovi mogu koristiti. Inventar može biti sačuvan u YAML, JSON ili TOML formatu.
Više informacija o inventarima možete naći u [Ansible dokumentaciji.](https://docs.ansible.com/ansible/latest/inventory_guide/intro_inventory.html)

Semaphore UI može da čita inventar iz fajla na serveru za koji Semaphore korisnik ima pravo čitanja, ili statički inventar koji se uređuje preko veb interfejsa.
Svaki inventar takođe ima bar jedan pristupni podatak vezan za sebe.
Korisnički pristupni podatak je obavezan i Ansible ga koristi za prijavljivanje na hostove tog inventara. Sudo pristupni podaci koriste se za podizanje privilegija na tom hostu.
Da biste kreirali inventar, potrebno je da u skladištu ključeva (Key Store) postoji korisnički pristupni podatak koji je ili korisničko ime sa lozinkom, ili podešen SSH.
Informacije o pristupnim podacima možete naći u odeljku [Skladište ključeva](../../../docs/user-guide/key-store.md) na ovom sajtu.

<a id="inventory-types"></a>

## Tipovi inventara

| Tip | Opis |
|---|---|
| `static` | Inventar u INI formatu koji se uređuje u veb interfejsu. |
| `static-yaml` | Inventar u YAML formatu koji se uređuje u veb interfejsu. Koristite ga za plugin inventare kao što su [NetBox](inventory/netbox-dynamic-inventory.md) ili [Consul](inventory/consul-dynamic-inventory.md). |
| `file` | Putanja do fajla inventara. Relativna putanja pokazuje u repozitorijum (Repository) šablona, a apsolutna putanja na fajl na serveru. Opciono izaberite zaseban **Repozitorijum inventara** (Inventory repository) ako se fajl nalazi u drugom Git repozitorijumu. |
| `terraform-workspace`, `tofu-workspace`, `terragrunt-workspace` | Nije Ansible inventar: radni prostor za [Terraform/OpenTofu](apps/terraform/workspaces.md) i [Terragrunt](apps/terragrunt.md) šablone. |

<a id="creating-an-inventory"></a>

## Kreiranje inventara

1. Kliknite na karticu Skladište ključeva (Key Store) i proverite da li imate ključ tipa login_password ili ssh
2. Kliknite na karticu Inventar (Inventory) i kliknite Novi inventar (New Inventory)
3. Dajte naziv inventaru i izaberite odgovarajući korisnički pristupni podatak iz padajuće liste. Po potrebi izaberite odgovarajući sudo pristupni podatak
4. Izaberite tip inventara
  * Ako izaberete file, koristite apsolutnu putanju do fajla. Ako se fajl nalazi u vašem git repozitorijumu, koristite relativnu putanju. Npr. `inventory/linux-hosts.yaml`
  * Ako izaberete static ili static-yaml, nalepite ili unesite svoj inventar u formular
5. Kliknite Kreiraj (Create).

<a id="updating-an-inventory"></a>

## Ažuriranje inventara

1. Kliknite na karticu Inventar (Inventory)
2. Kliknite na ikonu olovke pored inventara koji želite da izmenite
3. Unesite izmene
4. Kliknite Sačuvaj (Save)

<a id="deleting-an-inventory"></a>

## Brisanje inventara

Pre nego što uklonite inventar, morate ukloniti sve resurse koji su vezani za njega.
Ako niste sigurni koji resursi koriste okruženje, pratite korake 1 i 2 ispod. Prikazaće vam se koji resursi se koriste, sa linkovima ka tim resursima.

1. Kliknite na karticu Inventar (Inventory)
2. Kliknite na ikonu kante za otpatke pored inventara
3. Kliknite Da (Yes) ako ste sigurni da želite da uklonite inventar
