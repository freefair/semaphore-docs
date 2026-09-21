# CI/CD integracija

Semaphore može biti korak u spoljnom pipeline-u, a može i da pokreće sopstvene jednostavne pipeline-ove za build i deploy.

<a id="build-and-deploy-pipelines-inside-semaphore"></a>

## Build i deploy pipeline-ovi unutar Semaphore-a

Tipovi šablona zadatka (Task Template) **Build** i **Deploy**, verzionisanje artefakata i promenljiva `semaphore_vars` opisani su u vodiču za korisnike: [Build i deploy šabloni](../../../docs/user-guide/task-templates/build-deploy.md). Višekoračni pipeline-ovi sa odobrenjima prave se pomoću [tokova rada (Workflows)](../../../docs/user-guide/workflows.md).

<a id="starting-semaphore-tasks-from-an-external-ci-system"></a>

## Pokretanje Semaphore zadataka iz spoljnog CI sistema

Postoje dva načina da pokrenete zadatak (Task) iz GitHub Actions, GitLab CI, Jenkins-a ili bilo kog drugog sistema:

- **Integracije** (Integrations): webhook URL po projektu (Project) koji pokreće šablon kada zahtev odgovara pravilu. Podržava GitHub potpise, tokene i HMAC i može proslediti polja zahteva zadatku kao promenljive. Pogledajte [Integracije](../../../docs/user-guide/integrations.md).
- **REST API**: kreirajte zadatak pomoću API tokena:

```bash
curl -X POST https://semaphore.example.com/api/project/1/tasks \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"template_id": 5, "message": "Triggered by CI"}'
```

Odgovor sadrži ID zadatka. Proveravajte `GET /api/project/1/tasks/{task_id}` dok `status` ne postane `success`, `error` ili `stopped`. Pogledajte [API](../../../docs/reference/api.md) za tokene i ugrađenu Swagger referencu.
