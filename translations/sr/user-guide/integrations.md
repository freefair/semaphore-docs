# Integracije

Integracije (Integrations) omogućavaju uspostavljanje interakcije između Semaphore-a i spoljnih servisa, kao što su GitHub i GitLab.

![Lista integracija](../../../static/assets/integrations-list.webp)

Webhook URL projekta (Project) prikazan je iznad liste. Svaka integracija ima naziv i šablon koji pokreće; kliknite na integraciju da biste podesili njene uparivače (matchers) i ekstraktore vrednosti (value extractors).

![Detalji integracije](../../../static/assets/integration-detail.webp)

Pomoću integracije možete pokrenuti određeni šablon pozivanjem posebne krajnje tačke (alias), za koju možete podesiti jedan od sledećih načina autentifikacije:
* GitHub Webhooks
* Token
* HMAC
* Bez autentifikacije

Alias predstavlja URL u sledećem formatu: `/api/integrations/<random_string>`. Podržava `GET` i `POST` zahteve.

<a id="matchers"></a>

## Uparivači

Pomoću uparivača (Matchers) možete definisati parametre dolaznog zahteva. Kada se ti parametri poklope, šablon će biti pozvan.

<a id="value-extractors"></a>

## Ekstraktori vrednosti

Pomoću ekstraktora (Value Extractors) možete uzeti podatke iz zaglavlja ili tela zahteva (JSON polje ili string) i proslediti ih zadatku (Task). Svaka izdvojena vrednost ima **Tip promenljive** (Variable type):

* **Okruženje** (Environment): vrednost se dodaje promenljivim okruženja zadatka i zamenjuje promenljivu istog naziva iz grupe promenljivih (Variable Group).
* **Parametar zadatka** (Task parameter): vrednost postaje parametar zadatka, na primer promenljiva upitnika ili upit.

<a id="task-parameters"></a>

## Parametri zadatka

Integracije mogu pokretati zadatke sa parametrima. Koristite ekstraktore vrednosti da sastavite JSON sadržaj za parametre zadatka i podesite šablon tako da prihvata vrednosti unete na upit.

<a id="notes-on-aliases-and-matchers"></a>

## Napomene o alias-ima i uparivačima

Alias projekta (URL iznad liste integracija) dele sve integracije projekta: Semaphore proverava uparivače svake integracije i pokreće šablone čiji se uparivači poklope. Integracija može imati i sopstveni alias; zahtevi ka njemu pokreću tu integraciju bez provere uparivača. Po potrebi dajte prednost autentifikaciji tokenom/HMAC-om i prosleđujte parametre preko ekstraktora.
