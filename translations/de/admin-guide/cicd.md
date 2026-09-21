# CI/CD-Integration

Semaphore kann ein Schritt in einer externen Pipeline sein und selbst einfache Build- und Deploy-Pipelines ausführen.

<a id="build-and-deploy-pipelines-inside-semaphore"></a>

## Build- und Deploy-Pipelines innerhalb von Semaphore

Die Vorlagentypen **Build** und **Deploy**, die Artefakt-Versionierung und die Variable `semaphore_vars` werden im Benutzerhandbuch beschrieben: [Build- und Deploy-Vorlagen](../../../docs/user-guide/task-templates/build-deploy.md). Mehrstufige Pipelines mit Freigaben werden mit [Workflows](../../../docs/user-guide/workflows.md) erstellt.

<a id="starting-semaphore-tasks-from-an-external-ci-system"></a>

## Semaphore-Tasks aus einem externen CI-System starten

Es gibt zwei Wege, eine Task aus GitHub Actions, GitLab CI, Jenkins oder einem anderen System auszulösen:

- **Integrations**: eine Webhook-URL pro Projekt, die ein Task Template startet, wenn die Anfrage passt. Sie unterstützt GitHub-Signaturen, Tokens und HMAC und kann Felder der Anfrage als Variablen an die Task übergeben. Siehe [Integrations](../../../docs/user-guide/integrations.md).
- **REST-API**: eine Task mit einem API-Token erstellen:

```bash
curl -X POST https://semaphore.example.com/api/project/1/tasks \
  -H 'Authorization: Bearer YOUR_API_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"template_id": 5, "message": "Triggered by CI"}'
```

Die Antwort enthält die Task-ID. Rufen Sie `GET /api/project/1/tasks/{task_id}` ab, bis der `status` `success`, `error` oder `stopped` lautet. Siehe [API](../../../docs/reference/api.md) für Tokens und die integrierte Swagger-Referenz.
