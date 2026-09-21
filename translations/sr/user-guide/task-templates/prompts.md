# Upiti

Upiti (Prompts) su unapred definisane zastavice i opcije specifične za svaki tip šablona koje možete uključiti da biste omogućili prilagođavanje u vreme izvršavanja. Za razliku od [anketnih promenljivih](../../../../docs/user-guide/task-templates/survey-vars.md) (Survey Variables), koje su prilagođena polja koja sami kreirate, upiti su ugrađene opcije koje odgovaraju određenim CLI zastavicama za Ansible, Terraform i druge alate.

Ova funkcionalnost vam omogućava da:
- Zamenite podrazumevane vrednosti šablona u vreme izvršavanja
- Ciljate određene hostove ili resurse
- Kontrolišete ponašanje izvršavanja pomoću CLI zastavica
- Prosleđujete opcije izvršavanja preko API poziva ili rasporeda

<a id="prompts-vs-survey-variables"></a>

## Upiti i anketne promenljive

| Karakteristika | Upiti | Anketne promenljive |
|---------|---------|-----------------|
| **Definicija** | Unapred definisane opcije specifične za šablon | Prilagođena polja koja sami kreirate |
| **Primeri** | Ansible: `--limit`, `--tags`<br/>Terraform: workspace-ovi, `-destroy` | Naziv okruženja, broj verzije, prilagođeni parametri |
| **Podešavanje** | Uključuju se poljima za potvrdu u šablonu | Dodaju se u podešavanjima šablona sa nazivom i tipom |
| **Prosleđuju se kao** | Ugrađene CLI zastavice | Ansible: `--extra-vars`<br/>Terraform: `-var` |

**Upiti** su standardizovane opcije ugrađene u Semaphore za određene alate, dok su **anketne promenljive** fleksibilna prilagođena polja koja sami definišete.

<a id="ansible-prompts"></a>

## Ansible upiti

Za šablone Ansible playbook-a možete uključiti upite za sledeće CLI opcije:

<a id="limit"></a>

### Limit

Uključite upit `--limit` da biste naveli koje hostove treba ciljati pri pokretanju playbook-a.

**CLI ekvivalent**: `ansible-playbook playbook.yml --limit webservers`

**Slučajevi upotrebe**:
- Pokretanje playbook-a na podskupu hostova iz inventara
- Ciljanje određenih servera za isporuku
- Testiranje izmena na jednom hostu pre šireg uvođenja

**Primer**:
- Vaš inventar sadrži 50 veb servera
- Uključite upit Limit
- Pri pokretanju zadatka navedite `web-01.example.com` da biste ciljali samo taj server
- Ili navedite `webservers:&production` da biste ciljali produkcione veb servere

<a id="tags"></a>

### Tags

Uključite upit `--tags` da biste pokretali samo taskove sa određenim tagovima.

**CLI ekvivalent**: `ansible-playbook playbook.yml --tags deploy,restart`

**Slučajevi upotrebe**:
- Izvršavanje samo određenih delova playbook-a
- Pokretanje koraka isporuke bez konfiguracionih taskova
- Brzo ponovno pokretanje servisa bez izvršavanja celog playbook-a

**Primer**:
```yaml
---
- hosts: all
  tasks:
    - name: Install packages
      apt:
        name: nginx
      tags: install

    - name: Deploy application
      copy:
        src: app.tar.gz
        dest: /opt/app/
      tags: deploy

    - name: Restart service
      service:
        name: nginx
        state: restarted
      tags: restart
```

Uključite upit Tags i unesite `deploy,restart` da biste preskočili korak instalacije.

<a id="skip-tags"></a>

### Skip Tags

Uključite upit `--skip-tags` da biste preskočili taskove sa određenim tagovima.

**CLI ekvivalent**: `ansible-playbook playbook.yml --skip-tags testing,debug`

**Slučajevi upotrebe**:
- Preskakanje opcionih taskova u produkciji
- Izuzimanje taskova za debagovanje ili testiranje
- Zaobilaženje vremenski zahtevnih taskova kada nisu potrebni

**Primer**: Koristeći gornji playbook, uključite Skip Tags i unesite `install` da biste preskočili instalaciju paketa i pokrenuli samo taskove isporuke i ponovnog pokretanja.

<a id="skip-galaxy-install"></a>

### Preskoči Galaxy instalaciju

Uključite upit da biste korisniku omogućili da pri pokretanju zadatka preskoči korak `ansible-galaxy install` za uloge i kolekcije.

**Slučajevi upotrebe**:
- Zahtevi su već instalirani u image-u runner-a
- Ušteda vremena pri ponovljenim pokretanjima kada se ništa nije promenilo u `requirements.yml`

<a id="force-galaxy-install"></a>

### Prisilna Galaxy instalacija

Uključite upit da biste korisniku omogućili da prisilno pokrene `ansible-galaxy install --force` za svaki fajl zahteva, ignorišući kontrolnu sumu zahteva koju Semaphore čuva između pokretanja.

**CLI ekvivalent**: `ansible-galaxy role install -r requirements.yml --force`

**Slučajevi upotrebe**:
- Fajl zahteva referencira granu umesto fiksne verzije i potreban vam je najnoviji commit
- Prethodna instalacija je ostavila uloge ili kolekcije u neispravnom stanju
- Provera da playbook radi sa čistim skupom zavisnosti

Pogledajte [Galaxy zahtevi](../apps/ansible.md#galaxy-requirements) da biste saznali kako rade podrazumevane vrednosti na nivou šablona.

<a id="enabling-ansible-prompts"></a>

### Uključivanje Ansible upita

Da biste uključili Ansible upite:

1. Idite na **Šablone zadataka** (Task Templates) i izaberite svoj Ansible šablon
2. Pronađite odeljak **Ansible upiti** (Ansible Prompts) u podešavanjima šablona
3. Uključite polja za potvrdu za željene upite:
   - ☐ **Limit** - Uključuje zastavicu `--limit`
   - ☐ **Tags** - Uključuje zastavicu `--tags`
   - ☐ **Skip Tags** - Uključuje zastavicu `--skip-tags`
   - ☐ **Debug** - Uključuje izbor nivoa detaljnosti (`-v`)
   - ☐ **Preskoči Galaxy instalaciju** (Skip Galaxy install) - Dozvoljava preskakanje `ansible-galaxy install`
   - ☐ **Prisilna Galaxy instalacija** (Force Galaxy install) - Dozvoljava prisilno izvršavanje `ansible-galaxy install --force`
4. Sačuvajte šablon

![](../../../../static/assets/ansible_2.png)

Kada su uključena, ova polja se pojavljuju u formi za pokretanje zadatka, API zahtevima i podešavanjima rasporeda.

<a id="terraformopentofu-prompts"></a>

## Terraform/OpenTofu upiti

Za Terraform i OpenTofu šablone Semaphore nudi nekoliko ugrađenih upita:

<a id="workspace-selection"></a>

### Izbor workspace-a

Izaberite koji Terraform workspace će se koristiti za izvršavanje zadatka.

**CLI ekvivalent**: `terraform workspace select staging`

**Slučajevi upotrebe**:
- Upravljanje više okruženja (dev, staging, production)
- Odvojeni state fajlovi za različite konfiguracije
- Izolovano testiranje izmena infrastrukture

**Podešavanje**:
1. Kreirajte workspace-ove na kartici **Workspaces** šablona
2. Birač workspace-a se automatski pojavljuje u formi zadatka
3. Korisnici biraju ciljni workspace pri pokretanju zadataka

Detaljno podešavanje potražite u odeljku [Terraform workspace-ovi](../../../../docs/user-guide/apps/terraform/workspaces.md).

<a id="destroy-flag"></a>

### Zastavica Destroy

Uključite zastavicu `-destroy` da biste uklonili infrastrukturu.

**CLI ekvivalent**: `terraform apply -destroy`

**Slučajevi upotrebe**:
- Čišćenje privremenih testnih okruženja
- Povlačenje infrastrukture iz upotrebe
- Uklanjanje određenih resursa

**Važno**: Ovo je destruktivna operacija. Koristite je oprezno i razmislite o obaveznoj potvrdi u svojim tokovima rada.

<a id="migrate-state-flag"></a>

### Zastavica Migrate State

Uključite zastavicu `-migrate-state` kada menjate konfiguraciju backend-a.

**CLI ekvivalent**: `terraform init -migrate-state`

**Slučajevi upotrebe**:
- Premeštanje state-a na drugi backend
- Migracija između lokacija skladištenja
- Ažuriranje konfiguracije backend-a

<a id="enabling-terraform-prompts"></a>

### Uključivanje Terraform upita

Terraform upiti su dostupni u podešavanjima šablona:

1. Idite na **Šablone zadataka** (Task Templates) i izaberite svoj Terraform šablon
2. Podesite dostupne upite u podešavanjima šablona:
   - Izbor workspace-a (automatski uključen ako su workspace-ovi podešeni)
   - Opcija zastavice Destroy
   - Opcija Migrate state
3. Sačuvajte šablon

Forma zadatka prikazuje ove opcije pri pokretanju Terraform zadataka.

<a id="bash-powershell-and-python-prompts"></a>

## Bash, PowerShell i Python upiti

Za Bash, PowerShell i Python šablone upiti su minimalni, jer se većina prilagođavanja obavlja preko [anketnih promenljivih](../../../../docs/user-guide/task-templates/survey-vars.md).

Dostupni upiti su:

- CLI argumenti
- Grana

Ovi tipovi šablona imaju više koristi od prilagođenih anketnih promenljivih za prosleđivanje parametara skriptama.

<a id="using-prompts"></a>

## Korišćenje upita

<a id="manual-task-execution"></a>

### Ručno izvršavanje zadatka

Pri pokretanju zadatka iz šablona sa uključenim upitima:

1. Kliknite na **Pokreni** (Run) na šablonu
2. Pojavljuje se forma sa uključenim poljima upita
3. Popunite vrednosti za upite koje želite da koristite (opciona polja mogu ostati prazna)
4. Kliknite na **Pokreni zadatak** (Run Task)

Zadatak se izvršava sa vrednostima upita koje ste naveli, prosleđenim kao CLI zastavice.

<a id="api-calls"></a>

### API pozivi

Da biste vrednosti upita prosledili preko API-ja, uključite ih u telo zahteva:

**Ansible primer:**

```bash
curl -XPOST \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -d '{
    "template_id": 123,
    "limit": "webservers",
    "tags": "deploy,restart",
    "skip_tags": "testing"
  }' \
  https://your-semaphore.com/api/project/1/tasks
```

**Važno**: Upiti moraju biti uključeni u šablonu da bi vrednosti bile prihvaćene. Ako vrednosti upita prosledite preko API-ja bez da ih uključite, te vrednosti će biti ignorisane.

<a id="scheduled-tasks"></a>

### Zakazani zadaci

Rasporedi (Schedules) mogu sadržati vrednosti upita radi prilagođavanja automatizovanog izvršavanja zadataka:

**Primer**: Raspored sa Ansible upitima
- Dnevni raspored isporuke sa `limit: "production"` i `tags: "deploy"`
- Nedeljni raspored održavanja sa `tags: "updates,cleanup"`

Podesite vrednosti upita u podešavanjima rasporeda tako da svako zakazano pokretanje koristi navedene opcije.

<a id="integrations-and-webhooks"></a>

### Integracije i webhook-ovi

Integracije (Integrations) mogu izdvajati vrednosti iz webhook-ova i mapirati ih na upite:

**Primer**: GitHub webhook pokreće isporuku
- Izdvojite naziv grane iz webhook-a
- Mapirajte ga na upit Limit da biste ciljali određeno okruženje
- Isporučite samo na servere koji odgovaraju okruženju grane

Podešavanje webhook-ova potražite u odeljku [Integracije](../integrations.md).

<a id="best-practices"></a>

## Najbolje prakse

<a id="enable-only-necessary-prompts"></a>

### Uključite samo neophodne upite

Svaki uključeni upit dodaje polje u formu zadatka. Uključite samo upite koje će korisnici zaista morati da prilagođavaju.

✅ **Dobro**: Uključite Limit za operativne timove koji moraju da ciljaju određene hostove
❌ **Loše**: Uključite sve upite „za svaki slučaj“

<a id="combine-with-survey-variables"></a>

### Kombinujte sa anketnim promenljivama

Koristite upite za CLI opcije specifične za alat, a anketne promenljive za prilagođene parametre:

**Primer Ansible šablona:**
- **Upiti**: Limit (koji hostovi), Tags (koji taskovi)
- **Anketne promenljive**: `app_version` (koja verzija), `enable_rollback` (prilagođena logika)

<a id="document-api-usage"></a>

### Dokumentujte upotrebu API-ja

Ako se šabloni pokreću preko API-ja, dokumentujte koji su upiti dostupni i njihov očekivani format:

```markdown
## API Usage

Enabled prompts:
- `limit`: Host pattern (optional)
- `tags`: Comma-separated tag list (optional)

Example:
POST /api/project/1/tasks
{
  "template_id": 123,
  "limit": "webservers:&production",
  "tags": "deploy"
}
```

<a id="use-limit-for-safe-testing"></a>

### Koristite Limit za bezbedno testiranje

Potencijalno destruktivne playbook-ove uvek prvo testirajte pomoću upita Limit:

1. Uključite upit Limit u šablonu
2. Prvo pokretanje: Navedite `limit: "test-server-01"` da biste testirali na jednom hostu
3. Proverite da je uspelo
4. Drugo pokretanje: Navedite `limit: "production"` da biste uveli izmene na sve hostove

<a id="validate-prompt-combinations"></a>

### Proveravajte kombinacije upita

Neke kombinacije upita možda nemaju smisla. Dodajte dokumentaciju ili validaciju:

- Korišćenje `--tags deploy` zajedno sa `--skip-tags deploy` je u sukobu
- Navođenje i workspace-a i zastavice destroy zahteva dodatnu opreznost

<a id="common-use-cases"></a>

## Uobičajeni slučajevi upotrebe

<a id="gradual-rollout-with-limit"></a>

### Postepeno uvođenje pomoću Limit

Postepeno isporučujte u produkciju pomoću Ansible upita Limit:

1. Pokretanje 1: `limit: "web-01.example.com"` - Isporuka na jedan server
2. Pratite da li ima problema
3. Pokretanje 2: `limit: "webservers:&canary"` - Isporuka na canary servere
4. Proverite metrike
5. Pokretanje 3: `limit: "webservers:&production"` - Potpuno uvođenje

<a id="selective-execution-with-tags"></a>

### Selektivno izvršavanje pomoću Tags

Koristite Tags da biste pokretali samo određene delove playbook-a:

**Ujutru**: `tags: "deploy"` - Isporuka nove verzije
**Popodne**: `tags: "config"` - Ažuriranje konfiguracije
**Uveče**: `tags: "restart"` - Ponovno pokretanje servisa sa novom konfiguracijom

<a id="environment-management-with-workspaces"></a>

### Upravljanje okruženjima pomoću workspace-ova

Koristite izbor Terraform workspace-a za upravljanje okruženjima:

- **Razvoj**: Izaberite workspace `dev` - jeftiniji resursi, brže iteracije
- **Staging**: Izaberite workspace `staging` - okruženje nalik produkciji za testiranje
- **Produkcija**: Izaberite workspace `prod` - puna produkciona infrastruktura

<a id="cleanup-with-destroy"></a>

### Čišćenje pomoću Destroy

Koristite Terraform destroy za privremenu infrastrukturu:

1. Kreirajte testno okruženje: Pokrenite sa workspace-om `test-branch-123`
2. Pokrenite integracione testove
3. Očistite: Pokrenite sa uključenom zastavicom destroy i workspace-om `test-branch-123`

<a id="troubleshooting"></a>

## Rešavanje problema

<a id="prompt-values-ignored"></a>

### Vrednosti upita se ignorišu

**Problem**: Prosleđujete vrednosti upita, ali nemaju efekta

**Rešenje**: Proverite da li je odgovarajući upit uključen u podešavanjima šablona. Upiti moraju biti eksplicitno uključeni.

<a id="cannot-specify-limit"></a>

### Nije moguće navesti limit

**Problem**: Polje Limit se ne pojavljuje u formi zadatka

**Rešenje**:
1. Izmenite šablon
2. Pronađite odeljak „Ansible upiti“ (Ansible Prompts)
3. Uključite polje za potvrdu „Limit“
4. Sačuvajte šablon

<a id="api-calls-fail-with-prompt-values"></a>

### API pozivi sa vrednostima upita ne uspevaju

**Problem**: API zahtevi sa vrednostima upita vraćaju greške

**Rešenje**:
1. Uverite se da su upiti uključeni u šablonu
2. Proverite JSON formatiranje u telu zahteva
3. Proverite da se nazivi polja tačno poklapaju (`limit`, a ne `host_limit`)

<a id="tags-not-filtering-tasks"></a>

### Tagovi ne filtriraju taskove

**Problem**: Navodite tagove, ali se i dalje izvršavaju svi taskovi

**Rešenje**:
1. Proverite da taskovi u playbook-u imaju pravilno definisane tagove
2. Proverite da li ima grešaka u kucanju u nazivima tagova
3. Uverite se da su tagovi razdvojeni zarezom bez razmaka: `deploy,restart`, a ne `deploy, restart`

<a id="related-documentation"></a>

## Povezana dokumentacija

- [Anketne promenljive](../../../../docs/user-guide/task-templates/survey-vars.md) - Prilagođena polja za šablone
- [Ansible šabloni](../../../../docs/user-guide/apps/ansible.md) - Podešavanja specifična za Ansible
- [Terraform šabloni](../../../../docs/user-guide/apps/terraform/README.md) - Podešavanja specifična za Terraform
- [Rasporedi](../../../../docs/user-guide/schedules.md) - Automatizovano izvršavanje zadataka
- [Integracije](../integrations.md) - Zadaci pokrenuti webhook-om
- [API dokumentacija](../../reference/api.md) - API referenca
