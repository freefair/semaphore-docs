# Rešavanje problema

<a id="runner-prints-error-404"></a>

## Runner prijavljuje grešku 404

<a id="how-to-fix"></a>

### Kako rešiti

[Runner vraća kod greške 401](https://github.com/semaphoreui/semaphore/discussions/1873?converting=1)

---

<a id="gathering-facts-issue-for-localhost"></a>

## Problem sa Gathering Facts za localhost

Problem se može pojaviti kod Semaphore UI instaliranog preko [Snap](https://snapcraft.io/semaphore) ili [Docker](https://hub.docker.com/r/semaphoreui/semaphore) paketa.

```
4:10:16 PM
TASK [Gathering Facts] *********************************************************
4:10:17 PM
fatal: [localhost]: FAILED! => changed=false
```

<a id="why-this-happens"></a>

### Zašto se ovo dešava

Više informacija o korišćenju localhost-a u Ansible-u potražite u članku [Implicit 'localhost'](https://docs.ansible.com/ansible/latest/inventory/implicit_localhost.html).

Ansible pokušava da prikupi činjenice (facts) lokalno, ali se nalazi u ograničenom izolovanom kontejneru koji to ne dozvoljava.

<a id="how-to-fix-this"></a>

### Kako ovo rešiti

Postoje dva načina:

1. Isključite prikupljanje činjenica:

```yaml
- hosts: localhost
  gather_facts: False
  roles:
    - ...
```

2. Eksplicitno podesite tip konekcije na **ssh**:
```
[localhost]
127.0.0.1 ansible_connection=ssh ansible_ssh_user=your_localhost_user
```
---
<a id="panic-pq-ssl-is-not-enabled-on-the-server"></a>

## panic: pq: SSL is not enabled on the server

Ovo znači da vaš Postgres ne radi preko SSL-a.

<a id="how-to-fix-this-1"></a>

### Kako ovo rešiti

Dodajte opciju `sslmode=disable` u konfiguracioni fajl:

```json
	"postgres": {
		"host": "localhost",
		"user": "postgres",
		"pass": "pwd",
		"name": "semaphore",
		"options": {
			"sslmode": "disable"
		}
	},
```
---
<a id="fatal-bad-numeric-config-value-0-for-git_terminal_prompt-invalid-unit"></a>

## fatal: bad numeric config value '0' for 'GIT_TERMINAL_PROMPT': invalid unit

Ovo znači da pokušavate da preko HTTPS-a pristupite repozitorijumu koji zahteva autentifikaciju.

<a id="how-to-fix-this-2"></a>

### Kako ovo rešiti

* Otvorite ekran **Skladište ključeva**.
* Kreirajte novi ključ tipa `Login with password`.
* Navedite svoje korisničko ime za GitHub/BitBucket itd.
* Navedite lozinku. Za GitHub/BitBucket ne možete koristiti lozinku naloga, već umesto nje morate koristiti Personal Access Token (PAT). Pročitajte više [ovde](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).
* Nakon kreiranja ključa otvorite ekran **Repozitorijumi**, pronađite svoj repozitorijum i navedite ključ.

---

<a id="git-clone-or-pull-fails-intermittently"></a>

## Git clone ili pull povremeno ne uspeva

U logovima zadatka mogu se pojaviti poruke poput `Git pull failed (...), retrying in 2s`, praćene uspehom ili konačnim neuspehom nakon nekoliko pokušaja.

<a id="why-this-happens-1"></a>

### Zašto se ovo dešava

Git server (GitHub, GitLab, Bitbucket ili self-hosted instanca) bio je privremeno nedostupan, vratio je prolaznu HTTP grešku, ili je mreža između Semaphore-a i servera imala kratak prekid. Semaphore automatski ponavlja operacije clone i pull pre nego što zadatak označi kao neuspešan.

<a id="how-to-fix-this-3"></a>

### Kako ovo rešiti

1. **Prolazni ispadi**: obično se rešavaju sami. Semaphore ponavlja pokušaj do `git_attempts` puta (podrazumevano 4), sa eksponencijalnim odlaganjem između pokušaja.
2. **Česti neuspesi**: povećajte broj pokušaja u konfiguraciji:

```json
{
  "git_attempts": 8
}
```

Ili pomoću promenljive okruženja:

```bash
export SEMAPHORE_GIT_ATTEMPTS=8
```

3. **Trenutni, dosledni neuspesi**: ponovni pokušaji neće pomoći. Proverite URL repozitorijuma, ime grane, pristupne ključeve i mrežnu povezanost sa Semaphore servera ili sa hosta na kom radi runner.

Detalje o `git_client` i `git_attempts` potražite u odeljku [Git operacije](../../../docs/admin-guide/configuration/config-file.md#git-operations).

---

<a id="bash-script-output-is-missing-or-incomplete"></a>

## Ispis Bash skripte nedostaje ili je nepotpun

Bash zadatak se uspešno završava, ali log prikazuje malo ili nimalo ispisa iz `echo`, `printf` ili drugih komandi — naročito kada se skripta brzo završi.

<a id="why-this-happens-2"></a>

### Zašto se ovo dešava

Semaphore hvata stdout i stderr shell komandi dok se one izvršavaju. Veoma kratke skripte mogu da se završe pre nego što se pročita sav baferovani ispis, pa poslednje linije mogu da izostanu iz loga zadatka.

<a id="how-to-fix-this-4"></a>

### Kako ovo rešiti

1. **Nadogradite**: novije verzije Semaphore-a do kraja pročitaju ispis procesa pre nego što zadatak označe kao završen. Ažurirajte server i runner-e ako koristite stariju verziju.
2. **Ispraznite bafer ispisa u skripti** kada vam je potrebna zagarantovana isporuka:

```bash
#!/bin/bash
echo "Starting deploy"
echo "Done" >&2
```

Za kritičnu dijagnostiku upisujte podatke u fajl unutar radnog prostora repozitorijuma i ispišite ga komandom `cat` na kraju skripte.
3. **Izbegavajte tihi rani izlazak**: koristite `set -euo pipefail` i eksplicitne poruke o greškama kako bi neuspesi bili vidljivi i kada je ispis kratak.

---

<a id="unable-to-read-ldap-response-packet-unexpected-eof"></a>

## unable to read LDAP response packet: unexpected EOF

Najverovatnije pokušavate da se povežete na LDAP server nebezbednom metodom, iako on očekuje bezbednu vezu (preko TLS-a).

<a id="how-to-fix-this-5"></a>

### Kako ovo rešiti

Uključite TLS u fajlu `config.json`:

```json
...
"ldap_needtls": true
...
```

---

<a id="ldap-result-code-49-invalid-credentials"></a>

## LDAP Result Code 49 "Invalid Credentials"

Imate pogrešnu lozinku ili `binddn`.

<a id="how-to-fix-this-6"></a>

### Kako ovo rešiti

Upotrebite alat `ldapwhoami` i proverite da li vaš binddn radi:

```bash
ldapwhoami\
  -H ldap://ldap.com:389\
  -D "CN=/your/ldap_binddn/value/in/config/file"\
  -x\
  -W
```

Alat će interaktivno zatražiti lozinku i trebalo bi da vrati kod **0** i ispiše **DN** kako je naveden.

Možete pročitati i sledeće članke:
* [ldapsearch: Invalid credentials (49)](https://serverfault.com/q/771549/443463)
* [https://github.com/semaphoreui/semaphore/issues/906](https://github.com/semaphoreui/semaphore/issues/906)

---

<a id="ldap-result-code-32-no-such-object"></a>

## LDAP Result Code 32 "No Such Object"

Direktorijum nema unos pod distinguished name-om o kom je Semaphore pitao. Gotovo uvek
je u pitanju pogrešan `ldap_searchdn`, ređe pogrešan `ldap_binddn`.

<a id="how-to-fix-this-7"></a>

### Kako ovo rešiti

Proverite da li osnova pretrage postoji, koristeći iste akreditive koje koristi i Semaphore:

```bash
ldapsearch\
  -H ldap://ldap.example.com:389\
  -D "CN=/your/ldap_binddn/value/in/config/file"\
  -b "/your/ldap_searchdn/value/in/config/file"\
  -x\
  -W\
  -s base
```

- Kod rezultata **32** kod ove komande znači da sama osnova ne postoji.
  Ispravite `ldap_searchdn` u fajlu `config.json`; uobičajen uzrok je greška u kucanju
  nekog dela, na primer `OU=Users` umesto stvarnog `OU=People`.
- Kod rezultata **0** znači da je osnova ispravna i da je problem u
  `ldap_searchfilter`: on ne pronalazi nijedan unos ispod te osnove.

Značenje svake opcije potražite u odeljku [LDAP i AD](../../../docs/admin-guide/authentication/ldap.md).
