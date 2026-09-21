# Podešavanja

Kartica **Settings** (Podešavanja) na kontrolnoj tabli projekta (Project) dostupna je vlasnicima projekta (**Owners**). Sadrži opšte opcije projekta i destruktivne radnje.

![Podešavanja projekta](../../../../static/assets/project-settings-general.webp)

<a id="general"></a>

## Opšte

| Polje | Opis |
|---|---|
| **Project Name** | Prikazni naziv koji se vidi u biraču projekata i u upozorenjima. |
| **Max number of parallel tasks** | Opciono. Maksimalan broj zadataka (Tasks) ovog projekta koji mogu da se izvršavaju istovremeno. Ostavite prazno za neograničeno. Zadaci iznad ograničenja ostaju u redu sa statusom `waiting` dok se ne oslobodi mesto. |
| **Telegram Chat ID** | Opciono. Šalje upozorenja za ovaj projekat u drugi Telegram chat umesto u onaj koji je globalno konfigurisan. Pogledajte [Telegram obaveštenja](../../../../docs/admin-guide/notifications/telegram.md#per-project-chat-ids). |
| **Allow alerts for this project** | Glavni prekidač za obaveštenja. Kada je isključen, nijedan kanal ne šalje upozorenja o zadacima ovog projekta, čak i ako je kanal konfigurisan na serveru. |

**Test alerts** šalje testnu poruku kroz svaki konfigurisani [kanal za obaveštenja](../../../../docs/admin-guide/notifications.md), tako da možete proveriti konfiguraciju servera bez pokretanja zadatka. **Save** primenjuje izmene.

<a id="danger-zone"></a>

## Opasna zona

| Radnja | Efekat |
|---|---|
| **Backup project** | Preuzima JSON datoteku sa definicijom projekta: šablonima, inventarima, grupama promenljivih, ključevima (bez tajnih vrednosti), repozitorijumima, rasporedima, prikazima i integracijama. Vratite je preko **New Project → Restore project** ili pomoću [`semaphore projects import`](../../../../docs/reference/cli/projects.md). |
| **Clear cache** | Briše sve keširane datoteke projekta na serveru, na primer klonirane repozitorijume. Sledeći zadatak ponovo klonira repozitorijume. Radnja je nepovratna. |
| **Delete project** | Briše projekat sa svim njegovim resursima i istorijom zadataka. Nema opoziva. |

<a id="related-settings"></a>

## Povezana podešavanja

- Članovi i uloge: [Timovi](../../../../docs/user-guide/team.md)
- Runneri priključeni projektu i oznake runnera: [Runneri projekta](../../../../docs/user-guide/projects/runners.md)
- Kanali za obaveštenja se konfigurišu na serveru: [Obaveštenja](../../../../docs/admin-guide/notifications.md)
