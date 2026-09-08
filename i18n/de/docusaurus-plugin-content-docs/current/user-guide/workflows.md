# Workflows (Pro)

Mit Workflows können Sie mehrere Aufgabenvorlagen zu einem gerichteten Graphen (DAG)
mit Verzweigungen, Genehmigungen und zeitgesteuerten Pausen verketten. Ein Workflow-Lauf
schreitet automatisch voran, sobald die einzelnen Schritte abgeschlossen sind — Sie entwerfen
den Graphen einmal im visuellen Editor und starten anschließend Läufe von der Seite „Workflows“.

:::info
Workflows sind eine Funktion von **Semaphore Pro**. Der Menüpunkt „Workflows“ erscheint nur,
wenn Ihr Abonnement diese Funktion enthält.
:::

## Überblick {#overview}

Ein Workflow besteht aus:

- **Knoten** — Schritte im Graphen (eine Vorlage ausführen, auf eine Genehmigung warten,
  für eine Verzögerung pausieren oder mit einer Notiz kommentieren).
- **Kanten** — Verbindungen zwischen Knoten, jeweils mit einer **Bedingung** versehen,
  die steuert, wann der nachgelagerte Knoten startet.

Wenn Sie einen Workflow starten, erstellt Semaphore einen **Workflow-Lauf**. Der Server
steuert den Fortschritt: Sobald Aufgaben abgeschlossen, Genehmigungen erteilt oder Verzögerungen
abgelaufen sind, werden nachgelagerte Knoten gemäß den Kantenbedingungen gestartet.

## Einen Workflow erstellen {#creating-a-workflow}

1. Öffnen Sie Ihr Projekt und wechseln Sie zu **Workflows**.
2. Klicken Sie auf **Neuer Workflow**.
3. Im grafischen Editor:
   - Ziehen Sie Knoten aus der Palette auf die Arbeitsfläche.
   - Verbinden Sie Knoten, indem Sie vom Ausgangs-Handle eines Knotens zu einem anderen ziehen.
   - Klicken Sie auf einen Knoten oder eine Kante, um dessen Eigenschaften im Seitenbereich zu bearbeiten.
4. Legen Sie einen **Namen** fest (und optional eine **Startversion** für die Versionierung der Läufe).
5. Beheben Sie alle im Bereich **Probleme** aufgeführten Probleme und klicken Sie dann auf **Speichern**.

Der Editor validiert den Graphen vor dem Speichern. Ein gültiger Workflow muss mindestens
einen Knoten, genau einen Startknoten (ohne eingehende Kanten), keine Zyklen und eine vollständige
Konfiguration auf jedem ausführbaren Knoten haben.

## Knotentypen {#node-kinds}

| Typ | Zweck |
|------|---------|
| **Aufgabe** | Führt eine Aufgabenvorlage aus. Sie können Vorlagenparameter (Inventory, Umgebung, Ansible-Limit, zusätzliche CLI-Argumente) pro Knoten über **Aufgabenparameter** überschreiben. |
| **Genehmigung** | Pausiert den Lauf, bis ein Benutzer mit entsprechender Berechtigung genehmigt oder ablehnt. Optional können ein Timeout (Sekunden) und eine Genehmigungsnachricht festgelegt werden. |
| **Verzögerung** | Wartet die konfigurierte Anzahl von Sekunden, bevor mit den nachgelagerten Knoten fortgefahren wird. Nützlich für Abkühlphasen, Wartungsfenster oder zum zeitlichen Abstand abhängiger Schritte. |
| **Notiz** | Freie Anmerkung auf der Arbeitsfläche. Notizknoten werden nicht ausgeführt und nicht über Kanten verbunden — sie dienen ausschließlich der Dokumentation. |

### Zusammenführung {#convergence}

Knoten mit mehreren eingehenden Kanten können verlangen, dass **alle** vorgelagerten Knoten
abgeschlossen sind (Standard) oder **einer beliebige** davon. Legen Sie **Zusammenführung** im Eigenschaftenbereich des Knotens fest.

### Verzögerungsknoten {#delay-nodes}

Ein Verzögerungsknoten pausiert den Workflow-Lauf für die konfigurierte Dauer (mindestens 1
Sekunde). Während des Wartens:

- Der Lauf bleibt im Status **running**.
- Die Laufansicht zeigt einen Live-Countdown auf dem Verzögerungsknoten an.
- Über Kanten verbundene nachgelagerte Knoten werden erst gestartet, wenn die Verzögerung abgelaufen ist.

Wird der Workflow-Lauf **gestoppt**, während eine Verzögerung aktiv ist, wird die Verzögerung
abgebrochen und der Lauf endet im Status **stopped**.

### Genehmigungsknoten {#approval-nodes}

Wenn der Lauf einen Genehmigungsknoten erreicht, wechselt der Status zu **approval**, bis
jemand genehmigt oder ablehnt. Die Schaltflächen „Genehmigen“/„Ablehnen“ erscheinen in der Laufansicht.
Abgelehnte Genehmigungen lassen den Lauf gemäß den Bedingungen der verbundenen Kanten fehlschlagen.

## Kantenbedingungen {#edge-conditions}

Jede Kante hat eine Bedingung, die bestimmt, wann der nachgelagerte Knoten bereit wird:

| Bedingung | Nachgelagerter Knoten startet, wenn der vorgelagerte Knoten… |
|-----------|-------------------------------------------|
| **Bei Erfolg** | erfolgreich abgeschlossen wird (Standard). |
| **Bei Fehler** | mit einem Fehler abgeschlossen wird. |
| **Immer** | in einem beliebigen Endzustand abgeschlossen wird (Erfolg oder Fehler). |

Verwenden Sie **Bei Fehler**-Zweige für kompensierende Aktionen oder Benachrichtigungen. Verwenden Sie
**Immer**, wenn der nächste Schritt unabhängig vom Ergebnis ausgeführt werden soll.

## Ausführen und Überwachen {#running-and-monitoring}

- **Workflow ausführen** — startet einen neuen Lauf aus der Workflow-Liste.
- **Laufansicht** — Vollbild-Graph mit Live-Status auf jedem Knoten (laufend, erfolgreich,
  fehlgeschlagen, Genehmigung, Verzögerungs-Countdown).
- **Stoppen** — solange ein Lauf im Status `running` oder `approval` ist, können Benutzer mit
  `run_project_tasks` ihn stoppen. Alle aktiven Aufgaben werden gestoppt, ausstehende
  Genehmigungen werden abgelehnt und der Lauf wird als **stopped** markiert.

Laufstatus: `running`, `approval`, `success`, `failed`, `stopped`.

## Versionierung von Läufen {#run-versioning}

Legen Sie im Workflow eine **Startversion** fest (zum Beispiel `1.0.0`), um Versionsbezeichnungen
für jeden Lauf zu aktivieren. Semaphore erhöht die Version bei aufeinanderfolgenden Läufen, ähnlich
wie bei Build-Vorlagen.

## Workflow-Artefakte (set_stats) {#workflow-artifacts-set_stats}

Wenn eine Ansible-Aufgabe in einem Workflow `set_stats` verwendet, werden die Variablen als
**Workflow-Artefakte** für diesen Lauf gespeichert. Nachgelagerte Aufgabenknoten im selben Lauf
erhalten sie automatisch als zusätzliche Variablen.

:::warning
Wenn Schritte im Workflow auf **Remote-Runnern** ausgeführt werden, fließen Workflow-Artefakte noch nicht
über Remote-Runner-Schritte hinweg — sie werden nur zwischen Aufgaben weitergegeben, die lokal
auf dem Semaphore-Server ausgeführt werden. Planen Sie die Übergabe von Artefakten entsprechend oder halten Sie
Artefakte erzeugende und konsumierende Schritte auf demselben Ausführungspfad.
:::

## Berechtigungen {#permissions}

- Das Verwalten von Workflows (Erstellen, Bearbeiten, Löschen) erfordert Berechtigungen zur
  Verwaltung von Projektressourcen.
- Das Ausführen von Workflows erfordert `run_project_tasks`.
- Das Erteilen von Genehmigungen erfordert entsprechenden Projektzugriff (dieselben Benutzer, die
  Aufgaben im Projekt ausführen können).

## API {#api}

Workflow-Vorlagen und -Läufe sind unter
`/api/project/{project_id}/workflows` verfügbar. Siehe die
[API-Dokumentation](/admin-guide/api) für Anfrage- und Antwortschemata, einschließlich der
Felder von `delay`-Knoten (`delay_seconds`) und des Stopp-Endpunkts
(`POST …/runs/{run_id}/stop`).
