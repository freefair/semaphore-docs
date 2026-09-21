# CLI

Binarni fajl `semaphore` je istovremeno i server i kompletan administratorski alat. Pokrenite ga
bez argumenata (ili `semaphore help`) da biste izlistali sve komande:

```bash
semaphore help
```

Potpun, generisan spisak svih komanda i opcija nalazi se u
[referenci komanda](../../../../docs/reference/cli/commands.md). Većina administratorskih poslova ima
posebnu grupu komandi:

| Grupa komandi | Namena |
|---------------|--------|
| [`semaphore users`](../../../../docs/reference/cli/users.md) | Dodavanje, izmena, uklanjanje i pregled korisnika; upravljanje API tokenima i TOTP-om (2FA). |
| [`semaphore projects`](../../../../docs/reference/cli/projects.md) | Izvoz i uvoz projekata (Project) u vidu rezervnih kopija. |
| [`semaphore vaults`](../../../../docs/reference/cli/vaults.md) | Ponovno šifrovanje sačuvanih tajni i pregled upotrebe ključeva za šifrovanje. |
| [`semaphore runner`](../../../../docs/reference/cli/runners.md) | Rad u runner režimu i registracija/odjava runnera (Runner). |
| [`semaphore migrate`](../../../../docs/reference/cli/migrations.md) | Primena ili vraćanje migracija baze podataka. |

Nekoliko grupa komandi ima kraće alijase: `users`/`user`, `projects`/`project`,
`vaults`/`vault` i `server`/`service`.

> **Info**
>
> Svaka komanda koja pristupa bazi podataka (`users`, `projects`, `vaults`, `migrate`,
> `server`) pre pokretanja primenjuje sve neprimenjene migracije šeme. Napravite rezervnu
> kopiju baze podataka pre nego što pokrenete CLI novije verzije Semaphore-a nad postojećom
> bazom.

<a id="global-options"></a>

## Globalne opcije

Ove zastavice prihvata svaka komanda:

| Opcija | Opis |
|--------|------|
| `--config <path>` | Putanja do konfiguracionog fajla. |
| `--no-config` | Ne čitaj nijedan konfiguracioni fajl — koristi samo promenljive okruženja. |
| `--log-level <level>` | Nivo detaljnosti logova: `DEBUG`, `INFO`, `WARN`, `ERROR`, `FATAL` ili `PANIC`. Ako nije zadat, koristi se promenljiva okruženja `SEMAPHORE_LOG_LEVEL`. |
| `--debug-filter <spec>` | Sužava `DEBUG` izlaz na određene prostore imena, npr. `'runner,task_*'` ili `'*,-db'`. Ima efekta samo kada je nivo logovanja `DEBUG`. Ako nije zadat, koristi se `SEMAPHORE_DEBUG_FILTER`. |

<a id="how-the-configuration-file-is-found"></a>

### Kako se pronalazi konfiguracioni fajl

Kada je `--config` izostavljen, Semaphore traži fajl ovim redosledom i koristi
prvi koji postoji:

1. Putanja iz promenljive okruženja `SEMAPHORE_CONFIG_PATH`.
2. `config.json`, `config.yaml` ili `config.yml` u tekućem direktorijumu.
3. `/usr/local/etc/semaphore/config.json` (ili `.yaml` / `.yml`).
4. `/etc/semaphore/config.json` (ili `.yaml` / `.yml`).

Promenljive okruženja se primenjuju preko fajla, tako da imaju prednost nad vrednostima
iz fajla. Sa `--no-config` koriste se samo promenljive okruženja i podrazumevane vrednosti. Pogledajte
[Konfiguraciju](../../../../docs/admin-guide/configuration.md) za kompletan spisak opcija.

<a id="version"></a>

## Verzija

Ispisuje trenutnu verziju.

```bash
semaphore version
```

<a id="interactive-setup"></a>

## Interaktivno podešavanje

Koristite ovo za prvo podešavanje. Generiše tajne, vodi vas kroz
interaktivni upitnik, zapisuje konfiguracioni fajl, pokreće migracije
baze podataka i kreira prvog administratora.

```bash
semaphore setup
```

Prosledite `--config <path>` da biste izabrali gde će konfiguracioni fajl biti zapisan.
Bez toga, podešavanje pita za izlazni direktorijum (podrazumevano: tekući
direktorijum) i tamo zapisuje `config.json`.

Ako korisničko ime ili e-adresa koju unesete već postoji, podešavanje zadržava postojećeg
korisnika umesto da kreira novog.

Po završetku ispisuje komande za pokretanje servera, na primer:

```bash
./semaphore server --config /path/to/config.json
```

<a id="server-mode"></a>

## Serverski režim

Pokreće Semaphore server (veb interfejs i API). `service` je alijas za `server`.

```bash
semaphore server --config /path/to/config.json
```

Server pri pokretanju primenjuje neprimenjene migracije baze podataka i ispisuje
bazu podataka, privremenu putanju, interfejs i port koje koristi.

<a id="runner-mode"></a>

## Runner režim

Pokreće Semaphore kao izvršioca zadataka (Task). Pogledajte [Runneri](../../../../docs/reference/cli/runners.md) za
kompletan skup potkomandi (`setup`, `register`, `start`, `unregister`).

```bash
semaphore runner start --config /path/to/runner-config.json
```

<a id="database-migration"></a>

## Migracija baze podataka

Ažurira šemu baze podataka na najnovije stanje. Pogledajte
[Migracije baze podataka](../../../../docs/reference/cli/migrations.md) za primenu ili vraćanje
na određenu verziju.

```bash
semaphore migrate --config /path/to/config.json
```
