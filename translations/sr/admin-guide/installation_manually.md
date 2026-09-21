# Ručna instalacija Semaphore-a

----

**Sadržaj:**

* [Servisni korisnik](../../../docs/admin-guide/installation_manually.md#service-user)
* [Python3](../../../docs/admin-guide/installation_manually.md#python3)
* [Ansible kolekcije i uloge](../../../docs/admin-guide/installation_manually.md#ansible-collections--roles)
* [Reverzni proksi](../../../docs/admin-guide/installation_manually.md#reverse-proxy)
* [Systemd servis](../../../docs/admin-guide/installation_manually.md#extended-systemd-service)
* [Rešavanje problema](../../../docs/admin-guide/installation_manually.md#troubleshooting)

----

Ova dokumentacija detaljno opisuje kako da podesite Semaphore kada koristite sledeće metode instalacije:

* [Menadžer paketa](../../../docs/admin-guide/installation/package-manager.md)
* [Binarna datoteka](../../../docs/admin-guide/installation/binary-file.md)

Softverski paket Semaphore je samo deo celokupnog sistema potrebnog za uspešno pokretanje Ansible-a pomoću njega.

Python3 i Ansible izvršno okruženje su takođe veoma važni!

NAPOMENA: Postoje [gotove Ansible Galaxy uloge](https://galaxy.ansible.com/search?deprecated=false&keywords=ansible%20semaphore&order_by=-relevance&page=1) koje obavljaju ovu logiku podešavanja umesto vas ili se mogu koristiti kao osnovni šablon za vašu sopstvenu Ansible ulogu!

----

<a id="service-user"></a>

## Servisni korisnik

Semaphore ne mora da se pokreće kao korisnik `root` - i ne bi trebalo.

**Prednosti** korišćenja servisnog korisnika:
* Ima sopstvenu korisničku konfiguraciju
* Ima sopstveno okruženje
* Procesi se lako identifikuju
* Veća bezbednost sistema

Sistemskog korisnika možete kreirati ručno pomoću `adduser` ili pomoću modula [ansible.builtin.user](https://docs.ansible.com/ansible/latest/collections/ansible/builtin/user_module.html).

U ovoj dokumentaciji pretpostavljamo:
* kreirani servisni korisnik se zove `semaphore`
* podešena mu je ljuska `/bin/bash`
* njegov home direktorijum je `/home/semaphore`

<a id="troubleshooting"></a>

### Rešavanje problema

Ako Ansible izvršavanje iz Semaphore-a ne uspeva - moraćete da rešavate problem u kontekstu servisnog korisnika.

Za to imate više opcija:

* Prebacite celu sesiju ljuske u kontekst korisnika:

  ```bash
  sudo su --login semaphore
  ```

* Pokrenite jednu komandu u kontekstu korisnika:

  ```bash
  sudo --login -u semaphore <command>
  ```

----

<a id="python3"></a>

## Python3

[Ansible](https://docs.ansible.com/ansible/latest/getting_started/index.html) je napisan u programskom jeziku [Python3](https://docs.python.org/3/).

Zato je njegovo čisto podešavanje neophodno da bi Ansible ispravno radio.

Prvo - uverite se da su paketi `python3` i `python3-pip` instalirani na vašem sistemu!

Potrebne Python module možete instalirati na više načina:
* Instaliranjem u kontekstu servisnog korisnika
* Instaliranjem u [virtuelno okruženje](https://virtualenv.pypa.io/en/latest/) namenjeno servisu

<a id="requirements"></a>

### Zahtevi

U oba slučaja - preporučuje se korišćenje datoteke `requirements.txt` za navođenje modula koje treba instalirati.

Pretpostavićemo da se koristi datoteka `/home/semaphore/requirements.txt`.

Evo primera njenog sadržaja:

```text
ansible
# for common jinja-filters
netaddr
jmespath
# for common modules
pywinrm
passlib
requests
docker
```

NAPOMENA: Ove zahteve bi trebalo povremeno i ažurirati!

Opcija za automatsko ažuriranje je prikazana i u primeru servisa ispod.

<a id="modules-in-user-context"></a>

### Moduli u korisničkom kontekstu

**Ručno**:

```bash
sudo --login -u semaphore python3 -m pip install --user --upgrade -r /home/semaphore/requirements.txt
```

**Pomoću Ansible-a**:

```yaml
- name: Install requirements
  ansible.builtin.pip:
    requirements: '/home/semaphore/requirements.txt'
    extra_args: '--user --upgrade'
  become_user: 'semaphore'
```

<a id="modules-in-a-virtualenv"></a>

### Moduli u virtualenv-u

Pretpostavićemo da je virtualenv kreiran u `/home/semaphore/venv`

Uverite se da je virtuelno okruženje aktivirano unutar servisa! To je takođe prikazano u primeru servisa ispod.

**Ručno**:
```bash
sudo su --login semaphore
python3 -m pip install --user virtualenv
python3 -m venv /home/semaphore/venv
# activate the context of the virtual environment
source /home/semaphore/venv/bin/activate
# verify we are using python3 from inside the venv
which python3
> /home/semaphore/venv/bin/python3
python3 -m pip install --upgrade -r /home/semaphore/requirements.txt
# disable the context to the virtual environment
deactivate
```

**Pomoću Ansible-a**:

```yaml
- name: Create virtual environment and install requirements into it
  ansible.builtin.pip:
    requirements: '/home/semaphore/requirements.txt'
    virtualenv: '/home/semaphore/venv'
    state: present  # or 'latest' to upgrade the requirements
```

<a id="troubleshooting-1"></a>

#### Rešavanje problema

Ako naiđete na probleme sa Python3 pri korišćenju virtuelnog okruženja, moraćete da uđete u njegov kontekst da biste ih rešili:

```bash
sudo su --login semaphore
source /home/semaphore/venv/bin/activate
# verify we are using python3 from inside the venv
which python3
> /home/semaphore/venv/bin/python3

# troubleshooting

deactivate
```

Ponekad se virtuelno okruženje pokvari i pri nadogradnji sistema. Ako se to desi, možete jednostavno ukloniti postojeće i kreirati ga ponovo.

----

<a id="ansible-collections--roles"></a>

## Ansible kolekcije i uloge

Možda ćete želeti da unapred instalirate Ansible module i uloge, kako ne bi morali da se instaliraju pri svakom pokretanju zadatka!

<a id="requirements-1"></a>

### Zahtevi

Preporučuje se korišćenje datoteke `requirements.yml` za navođenje modula koje treba instalirati.

Pretpostavićemo da se koristi datoteka `/home/semaphore/requirements.yml`.

Evo primera njenog sadržaja:

```yaml
---

collections:
  - 'namespace.collection'
  # for common collections:
  - 'community.general'
  - 'ansible.posix'
  - 'community.mysql'
  - 'community.crypto'

roles:
  - src: 'namespace.role'
```

Pogledajte i: [Instaliranje kolekcija](https://docs.ansible.com/ansible/latest/galaxy/user_guide.html#installing-a-collection-from-galaxy), [Instaliranje uloga](https://docs.ansible.com/ansible/latest/galaxy/user_guide.html#installing-multiple-roles-from-a-file)

NAPOMENA: Ove zahteve bi trebalo povremeno i ažurirati!

Opcija za automatsko ažuriranje je prikazana i u primeru servisa ispod.

<a id="install-in-user-context"></a>

### Instalacija u korisničkom kontekstu

**Ručno**:
```bash
sudo su --login semaphore
ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml
ansible-galaxy role install --force -r /home/semaphore/requirements.yml
```

<a id="install-when-using-a-virtualenv"></a>

### Instalacija pri korišćenju virtualenv-a

**Ručno**:
```bash
sudo su --login semaphore
source /home/semaphore/venv/bin/activate
# verify we are using python3 from inside the venv
which python3
> /home/semaphore/venv/bin/python3

ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml
ansible-galaxy role install --force -r /home/semaphore/requirements.yml

deactivate
```

----

<a id="reverse-proxy"></a>

## Reverzni proksi

Pogledajte: [Bezbednost - Šifrovana veza](../../../docs/admin-guide/security/network.md#reverse-proxy)

----

<a id="extended-systemd-service"></a>

## Prošireni Systemd servis

Evo osnovnog šablona systemd servisa.

Dodatna podešavanja dodajte pod odgovarajući `[PART]`

<a id="base"></a>

### Osnova

```ini
[Unit]
Description=Semaphore UI
Documentation=https://github.com/freefair/semaphore-docs
Wants=network-online.target
After=network-online.target
ConditionPathExists=/usr/bin/semaphore
ConditionPathExists=/etc/semaphore/config.json

[Service]
ExecStart=/usr/bin/semaphore server --config /etc/semaphore/config.json
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=10s

[Install]
WantedBy=multi-user.target
```

<a id="service-user-1"></a>

### Servisni korisnik

```ini
[Service]
User=semaphore
Group=semaphore
```

----

<a id="python-modules"></a>

### Python moduli

<a id="in-user-context"></a>

#### U korisničkom kontekstu

```ini
[Service]
# to auto-upgrade python modules at service startup
ExecStartPre=/bin/bash -c 'python3 -m pip install --upgrade --user -r /home/semaphore/requirements.txt'

# so the executables are found
Environment="PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/home/semaphore/.local/bin"
# set the correct python path. You can get the correct path with: python3 -c "import site; print(site.USER_SITE)"
Environment="PYTHONPATH=/home/semaphore/.local/lib/python3.10/site-packages"
```

<a id="in-virtualenv"></a>

#### U virtualenv-u

```ini
[Service]
# to auto-upgrade python modules at service startup
ExecStartPre=/bin/bash -c 'source /home/semaphore/venv/bin/activate \
                           && python3 -m pip install --upgrade -r /home/semaphore/requirements.txt'

# REPLACE THE EXISTING 'ExecStart'
ExecStart=/bin/bash -c 'source /home/semaphore/venv/bin/activate \
                        && /usr/bin/semaphore server --config /etc/semaphore/config.json'
```

----

<a id="ansible-collections--roles-1"></a>

### Ansible kolekcije i uloge

<a id="if-using-python3-in-user-context"></a>

#### Ako koristite Python3 u korisničkom kontekstu

```ini
[Service]
# to auto-upgrade ansible collections and roles at service startup
ExecStartPre=/bin/bash -c 'ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml'
ExecStartPre=/bin/bash -c 'ansible-galaxy role install --force -r /home/semaphore/requirements.yml'
```

<a id="if-using-python3-in-virtualenv"></a>

#### Ako koristite Python3 u virtualenv-u

```ini
# to auto-upgrade ansible collections and roles at service startup
ExecStartPre=/bin/bash -c 'source /home/semaphore/venv/bin/activate \
                           && ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml \
                           && ansible-galaxy role install --force -r /home/semaphore/requirements.yml'
```

----

<a id="other-use-cases"></a>

### Drugi slučajevi upotrebe

<a id="using-local-mariadb"></a>

#### Korišćenje lokalne MariaDB

```ini
[Unit]
Requires=mariadb.service
```

<a id="using-local-nginx"></a>

#### Korišćenje lokalnog Nginx-a

```ini
[Unit]
Wants=nginx.service
```

<a id="sending-logs-to-syslog"></a>

#### Slanje logova u syslog

```ini
[Service]
StandardOutput=journal
StandardError=journal
SyslogIdentifier=semaphore
```

<a id="full-examples"></a>

### Kompletni primeri

<a id="python-modules-in-user-context"></a>

#### Python moduli u korisničkom kontekstu

```ini
[Unit]
Description=Semaphore UI
Documentation=https://github.com/freefair/semaphore-docs
Wants=network-online.target
After=network-online.target
ConditionPathExists=/usr/bin/semaphore
ConditionPathExists=/etc/semaphore/config.json

[Service]
User=semaphore
Group=semaphore
Restart=always
RestartSec=10s
Environment="PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:~/.local/bin"

ExecStartPre=/bin/bash -c 'ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml'
ExecStartPre=/bin/bash -c 'ansible-galaxy role install --force -r /home/semaphore/requirements.yml'
ExecStartPre=/bin/bash -c 'python3 -m pip install --upgrade --user -r /home/semaphore/requirements.txt'

ExecStart=/usr/bin/semaphore server --config /etc/semaphore/config.json
ExecReload=/bin/kill -HUP $MAINPID

[Install]
WantedBy=multi-user.target
```

<a id="python-modules-in-virtualenv"></a>

#### Python moduli u virtualenv-u

```ini
[Unit]
Description=Semaphore UI
Documentation=https://github.com/freefair/semaphore-docs
Wants=network-online.target
After=network-online.target
ConditionPathExists=/usr/bin/semaphore
ConditionPathExists=/etc/semaphore/config.json

[Service]
User=semaphore
Group=semaphore
Restart=always
RestartSec=10s

ExecStartPre=/bin/bash -c 'source /home/semaphore/venv/bin/activate \
                           && python3 -m pip install --upgrade -r /home/semaphore/requirements.txt'
ExecStartPre=/bin/bash -c 'source /home/semaphore/venv/bin/activate \
                           && ansible-galaxy collection install --upgrade -r /home/semaphore/requirements.yml \
                           && ansible-galaxy role install --force -r /home/semaphore/requirements.yml'

ExecStart=/bin/bash -c 'source /home/semaphore/venv/bin/activate \
                        && /usr/bin/semaphore server --config /etc/semaphore/config.json'
ExecReload=/bin/kill -HUP $MAINPID

[Install]
WantedBy=multi-user.target
```

<a id="fixes"></a>

### Ispravke

Ako imate podešen prilagođeni sistemski jezik - možete naići na probleme koji se rešavaju ažuriranjem odgovarajućih promenljivih okruženja:

```ini
[Service]
Environment=LANG="en_US.UTF-8"
Environment=LC_ALL="en_US.UTF-8"
```

----

<a id="troubleshooting-2"></a>

## Rešavanje problema

Ako dođe do problema pri izvršavanju zadatka, možda je u pitanju problem sa okruženjem u vašem podešavanju - a ne sa samim Semaphore-om!

Prođite kroz sledeće korake da proverite da li se problem javlja i van Semaphore-a:

- Uđite u kontekst korisnika:

  ```bash
  sudo su --login semaphore
  ```

- Uđite u kontekst virtualenv-a ako ga koristite:

  ```ini
  source /home/semaphore/venv/bin/activate
  # verify we are using python3 from inside the venv
  which python3
  > /home/semaphore/venv/bin/python3

  # troubleshooting

  deactivate
  ```

- Pokrenite Ansible playbook ručno

  - Ako **ne uspe** => problem je u vašem okruženju
  - Ako **radi**:
    - Ponovo proverite svoju konfiguraciju unutar Semaphore-a
    - Možda je problem u Semaphore-u
