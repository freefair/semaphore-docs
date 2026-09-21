# Istorija

Kartica **History** (Istorija) na kontrolnoj tabli projekta (Project) prikazuje sve zadatke (Tasks) projekta, od najnovijeg. To je podrazumevani prikaz kada otvorite projekat.

![Istorija projekta](../../../../static/assets/project-dashboard-history.webp)

<a id="columns"></a>

## Kolone

| Kolona | Sadržaj |
|---|---|
| **Task** | Broj zadatka, šablon iz kog je kreiran i commit poruka revizije repozitorijuma koja je korišćena. Ikona sa leve strane prikazuje aplikaciju (Ansible, Terraform, Bash itd.). |
| **Version** | Za [šablone za build i deploy](../task-templates/build-deploy.md): izgrađena ili isporučena verzija. Za ostale šablone samo ikona statusa. |
| **Status** | Oznaka trenutnog statusa, pogledajte [Statusi zadataka](../../../../docs/user-guide/tasks.md#task-statuses). |
| **User** | Ko je pokrenuo zadatak. Zadaci pokrenuti rasporedom (Schedule) ili integracijom (Integration) nemaju korisnika. |
| **Start** | Datum i vreme početka u vremenskoj zoni vašeg pregledača. |
| **Duration** | Koliko dugo se zadatak izvršavao. |

Lista je podeljena na stranice. Kliknite na broj zadatka ili naziv šablona da otvorite [prozor zadatka](../../../../docs/user-guide/tasks.md#task-window) sa logom, detaljima i rezimeom. Kliknite na naziv šablona u zaglavlju prozora zadatka da odete na stranicu šablona.

<a id="task-retention"></a>

## Čuvanje zadataka

Podrazumevano se svi zadaci i njihovi logovi čuvaju zauvek. Da biste ograničili istoriju po šablonu, podesite `max_tasks_per_template` u `config.json` ili promenljivu okruženja `SEMAPHORE_MAX_TASKS_PER_TEMPLATE`:

```json
{
  "max_tasks_per_template": 30
}
```

Kada se dostigne ograničenje, najstariji zadaci tog šablona se brišu zajedno sa svojim logovima. Pogledajte [Konfiguracija](../../../../docs/admin-guide/configuration.md) za potpunu listu opcija.

<a id="see-also"></a>

## Pogledajte i

- [Statistika](stats.md): zbirni rezultati zadataka po danima.
- [Aktivnost](activity.md): revizorski log promena u projektu.
