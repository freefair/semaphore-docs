# Preduslovi

Semaphore ima malo sopstvenih strogih zahteva. Najveći deo onoga što treba da pripremite
odnosi se na automatizaciju koju će pokretati i na okruženje oko nje. Prođite kroz
ovu stranicu pre [Instalacije](../../../docs/admin-guide/installation.md) i sama instalacija
traje nekoliko minuta.

<a id="a-host"></a>

## Host

Semaphore se isporučuje kao jedna binarna datoteka i kao slika kontejnera, a radi na Linux-u,
macOS-u i Windows-u. Linux je ono na šta ciljaju paketi, Docker slike i Helm chart,
i ono što koristi većina instalacija.

Servis je lagan: to je Go proces koji opslužuje veb interfejs. Ono što zaista
troši memoriju i procesor jesu Ansible, Terraform i vaše skripte, koje se paralelno izvršavaju
na istoj mašini. Dimenzionišite host prema poslu, a ne prema Semaphore-u, i ograničite
konkurentnost podešavanjem projekta **Max number of parallel tasks** — ili premestite
izvršavanje na [runner-e](../../../docs/admin-guide/runners.md) pa njih dimenzionišite.

Predvidite trajno skladište na dva mesta: bazu podataka i direktorijum u
`tmp_path` u koji se kloniraju repozitorijumi. U Docker-u to znači volumen; kontejner
bez njega gubi podatke pri ponovnom kreiranju.

<a id="a-database"></a>

## Baza podataka

Izaberite je pre instalacije, jer kasnija promena znači migraciju podataka.

| Mehanizam | Koristite ga kada |
|---|---|
| **SQLite** | Jedan server, jedan tim. Ugrađen je, nema šta da se podešava, podrazumevan je. |
| **PostgreSQL** ili **MySQL/MariaDB** | Servis je važan za više od nekolicine ljudi, želite rezervne kopije i nadzor sa svoje postojeće platforme za baze podataka ili planirate da pokrenete više od jednog čvora. |

[Visoka dostupnost](../../../docs/admin-guide/ha.md) zahteva PostgreSQL ili MySQL uz Redis i
ne može da koristi SQLite. Ako vam je HA u planu, počnite sa PostgreSQL-om.

Kreirajte bazu podataka i korisnika sa pravima nad njom pre instalacije; Semaphore kreira
sopstvene tabele pri prvom pokretanju i pri svakoj nadogradnji.

<a id="network-access"></a>

## Mrežni pristup

| Semaphore mora da dopre do | Zbog |
|---|---|
| Vaših Git remote repozitorijuma | Kloniranja repozitorijuma na koje šabloni pokazuju. |
| Hostova i cloud API-ja koje automatizujete | Samog obavljanja posla. |
| Vašeg provajdera identiteta, ako ga koristite | Prijave preko [LDAP-a](../../../docs/admin-guide/authentication/ldap.md) ili [OpenID Connect-a](../../../docs/admin-guide/authentication/openid.md). |
| Vaših kanala za obaveštenja | E-pošte, Telegram-a, Slack-a i ostalih. |

Korisnici pristupaju veb interfejsu na portu `3000` osim ako ga promenite. Postavite
[TLS](../../../docs/admin-guide/reverse-proxy/README.md) ispred njega pre nego što se bilo ko prijavi: preko njega
putuju sesije i API tokeni.

Ako će zadatke izvršavati runner, onda je *njemu* potreban pristup Git remote repozitorijumima i
ciljnim hostovima, kao i odlazni pristup Semaphore serveru. Server se nikada
ne povezuje na runner.

<a id="automation-tooling"></a>

## Alati za automatizaciju

Šta god zadatak pokreće mora biti instalirano tamo gde se pokreće — na serveru, na
runner-u ili u slici kontejnera koju izvršilac koristi.

- Docker slike dolaze sa Ansible-om, Terraform-om, OpenTofu-om i uobičajenim
  zavisnostima. Dodatni Python paketi idu u montirani `requirements.txt`; pogledajte
  [Instaliranje dodatnih Python zavisnosti](../../../docs/admin-guide/installation/docker.md#installing-additional-python-dependencies).
- Instalacija preko paketa ili binarne datoteke daje vam samo Semaphore. Git, Python, Ansible
  i bilo koje kolekcije ili provajdere instalirajte sami; pogledajte
  [Ručnu instalaciju](../../../docs/admin-guide/installation_manually.md).

Proverite da li se vaš playbook ili konfiguracija pokreće iz shell-a na toj mašini, kao
korisnik pod kojim Semaphore radi, pre nego što od njega napravite šablon. Gotovo svaka prijava
tipa „kod mene lokalno radi” svodi se na nedostajuću kolekciju, provajder ili Python paket.

<a id="credentials-to-have-ready"></a>

## Kredencijali koje treba imati spremne

Sakupite ih pre prvog šablona, jer je inače svaki od njih zasebno zaustavljanje:

- **Deploy ključ ili token** za svaki repozitorijum koji će Semaphore klonirati.
- **SSH ključevi ili prijave** koji se koriste za pristup hostovima kojima upravljate.
- Bilo koji **cloud kredencijali** koje vaš Terraform ili moduli zahtevaju.
- **Ansible Vault lozinka**, ako su vaši playbook-ovi šifrovani.

Svi oni pripadaju [Skladištu ključeva](../../../docs/user-guide/key-store.md), a ne repozitorijumu.

<a id="decisions-to-make-first"></a>

## Odluke koje treba doneti prvo

Tri izbora su sada jeftina, a kasnije skupa:

1. **Mehanizam baze podataka**, kao što je gore opisano.
2. **URL koji će korisnici koristiti.** Postavite ga kao `web_host`. Obrnuti proksiji, OIDC redirect
   URI-ji, ciljevi webhook-ova i linkovi u obaveštenjima izvode se iz njega.
3. **`access_key_encryption`.** Generišite ga pri instalaciji, napravite mu zasebnu rezervnu kopiju
   i nikada ga nemarno ne rotirajte: svaka sačuvana tajna njime je šifrovana.

```bash
head -c32 /dev/urandom | base64
```

<a id="whats-next"></a>

## Šta sledi

- [Instalacija](../../../docs/admin-guide/installation.md) — izaberite metod i instalirajte.
- [Konfiguracija](../../../docs/admin-guide/configuration.md) — kako se opcije zadaju i šta znače.
- [Prvi koraci](../../../docs/getting-started/README.md) — od instaliranog servera do prvog zadatka.
