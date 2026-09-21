# Integracija Netbox dinamičkog inventara sa Semaphore-om

![Ansible bedž](https://img.shields.io/badge/ansible-%23000.svg?style=for-the-badge&logo=ansible&logoColor=white)
![Netbox bedž](https://img.shields.io/badge/Netbox-%23F00.svg?style=for-the-badge&logo=netbox&logoColor=white)
<!-- ![Semaphore Badge](https://img.shields.io/badge/Semaphore-%23187EBB.svg?style=for-the-badge&logo=semaphore&logoColor=white) -->

<a id="-key-features"></a>

## 🛠 Ključne mogućnosti

Ovaj repozitorijum (Repository) prikazuje upotrebu plugin-a `netbox.netbox.nb_inventory` za kreiranje dinamičkog inventara (Inventory) u Semaphore-u. Omogućava automatsku sinhronizaciju podataka iz Netbox-a, čime se pojednostavljuje upravljanje infrastrukturom i izvršavanje Ansible playbook-ova.

<a id="-setup"></a>

## 🔧 Podešavanje

<a id="requirements"></a>

### Zahtevi

- Pristup Semaphore-u
- Pristup Netbox-u sa podešenim API-jem

<a id="-netbox-setup"></a>

### 🔑 Podešavanje Netbox-a

Proverite da je vaš Netbox podešen i dostupan za API interakciju. Pribavite API token koji će se koristiti za autentifikaciju zahteva.

<a id="-configuration-in-semaphore"></a>

### 📡 Konfiguracija u Semaphore-u

1. U Semaphore-u idite na odeljak inventara.
2. Kreirajte novi inventar.
3. Unesite sledeća podešavanja za konfiguraciju plugin-a:

   ```yaml
   plugin: netbox.netbox.nb_inventory
   api_endpoint: http://your_netbox_url_here
   token: YOUR_NETBOX_API_TOKEN
   validate_certs: False
   config_context: False
   ```

   Zamenite `http://your_netbox_url_here` i `YOUR_NETBOX_API_TOKEN` stvarnim podacima iz vašeg Netbox-a.

<a id="-usage"></a>

## 🚀 Upotreba

Kada je podešeno, možete pokretati Ansible playbook-ove u Semaphore-u koristeći dinamički inventar koji automatski ažurira podatke o hostovima iz vašeg Netbox-a.

<a id="-further-documentation"></a>

## 📚 Dodatna dokumentacija

Saznajte više o plugin-u `netbox.netbox.nb_inventory` i njegovim mogućnostima u [zvaničnoj Ansible dokumentaciji](https://docs.ansible.com/ansible/latest/collections/netbox/netbox/nb_inventory_inventory.html).
