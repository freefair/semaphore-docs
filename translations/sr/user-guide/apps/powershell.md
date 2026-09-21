# PowerShell

Semaphore može da pokreće PowerShell skripte na Windows hostovima (ili sa Windows runner-a). Da biste to uradili, kreirajte šablon zadatka (Task Template) tipa **PowerShell**.

<a id="creating-a-powershell-template"></a>

## Kreiranje PowerShell šablona

1. Otvorite odeljak **Šabloni zadataka** (Task Templates) i kliknite na dugme **Novi šablon** (New Template).
2. Izaberite **PowerShell** kao tip aplikacije.
3. Podesite šablon:

| Polje | Opis |
|---|---|
| **Naziv** (Name) | Opisni naziv šablona |
| **Repozitorijum** (Repository) | Repozitorijum koji sadrži vašu `.ps1` skriptu |
| **Playbook / Skripta** (Playbook / Script) | Relativna putanja do skripte, npr. `scripts/deploy.ps1` |
| **Grupe promenljivih** (Variable Groups) | Grupe promenljivih čije se vrednosti ubacuju kao promenljive okruženja |

4. Kliknite **Kreiraj** (Create).
5. Kliknite **Pokreni** (Run) da biste izvršili šablon.

<a id="passing-variables-to-scripts"></a>

## Prosleđivanje promenljivih skriptama

Promenljive iz izabranih **grupa promenljivih** (Variable Groups) ubacuju se kao promenljive okruženja pre pokretanja skripte. Pristupite im u PowerShell-u pomoću `$env:VARIABLE_NAME`:

```powershell
Write-Host "Deploying to $env:TARGET_HOST"
```

<a id="running-on-windows-hosts"></a>

## Izvršavanje na Windows hostovima

PowerShell šabloni zahtevaju jedno od sledećeg:
- **Windows runner** — Semaphore runner (Runner) postavljen na Windows hostu. Pogledajte [Runner-i](../../../../docs/admin-guide/runners.md).
- Sam Semaphore server koji radi na Windows-u.

<a id="notes"></a>

## Napomene

- Skripte se izvršavaju neinteraktivno. Izbegavajte upite koji zahtevaju unos korisnika.
- Izlazni kod `0` označava uspeh; svaki izlazni kod različit od nule označava zadatak (Task) kao neuspešan.
