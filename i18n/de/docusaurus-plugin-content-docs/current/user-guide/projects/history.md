
# Verlauf

Die Seite Verlauf in Semaphore bietet eine umfassende Übersicht über alle Aufgabenausführungen in Ihrem Projekt. Mit dieser Funktion können Sie den Ausführungsverlauf Ihrer Aufgaben verfolgen und analysieren und erhalten wertvolle Einblicke in Ihre Automatisierungs-Workflows.

![](/assets/project_history.webp)

## Überblick {#overview}

Die Seite Verlauf zeigt eine chronologische Liste aller Aufgabenausführungen an, darunter:

- Verwendete Aufgabenvorlagen
- Ausführungsstatus (erfolgreich, fehlgeschlagen, in Bearbeitung)
- Start- und Endzeiten
- Dauer
- Benutzer, der die Aufgabe gestartet hat
- Aufgabenausgabe und Protokolle

## Aufgabenverlauf anzeigen {#viewing-task-history}

### Zugriff auf den Verlauf {#accessing-history}

1. Navigieren Sie in Semaphore zu Ihrem Projekt
2. Klicken Sie auf den Tab "Verlauf"
3. Sehen Sie sich die Liste aller Aufgabenausführungen an

## Aufgabendetails {#task-details}

Ein Klick auf eine beliebige Aufgabe in der Verlaufsliste öffnet eine Detailansicht mit:

1. **Aufgabeninformationen**
   - Aufgaben-ID
   - Verwendete Vorlage
   - Start- und Endzeiten
   - Dauer
   - Status
   - Benutzer, der die Aufgabe ausgeführt hat

2. **Ausführungsdetails**
   - Vollständige Aufgabenausgabe
   - Fehlermeldungen (falls vorhanden)
   - Verwendete Umgebungsvariablen
   - Inventory-Informationen
   - Repository-Details

3. **Aufgabenprotokolle**
   - Protokollanzeige in Echtzeit
   - Option zum Herunterladen des Protokolls
   - Suchfunktion im Protokoll
   - Hervorhebung von Fehlern

### Statistiken {#statistics}

Das Projekt bietet eine Statistikseite, die die Aufgabenergebnisse über einen ausgewählten Zeitraum zusammenfasst, mit Filterung nach Benutzer.

## Aufgabenverwaltung {#task-management}

### Verfügbare Aktionen {#actions-available}

In der Verlaufsansicht können Sie:

- Auf vollständige Aufgabenprotokolle zugreifen
- Die Aufgabenausgabe herunterladen
- In Protokollen suchen

## Aufbewahrung von Aufgaben {#task-retention}

In Semaphore können Sie konfigurieren, wie lange der Aufgabenverlauf aufbewahrt wird:

1. **Standardverhalten**
   - Alle Aufgaben werden in der Datenbank gespeichert
   - Standardmäßig keine automatische Löschung

2. **Aufbewahrung konfigurieren**
   - Maximale Anzahl von Aufgaben pro Vorlage festlegen
   - Konfiguration über Umgebungsvariable:
     ```bash
     SEMAPHORE_MAX_TASKS_PER_TEMPLATE=30
     ```
   - Oder über config.json:
     ```json
     {
       "max_tasks_per_template": 30
     }
     ```

3. **Aufbewahrungsregeln**
   - Wenn das Limit erreicht ist, werden die ältesten Aufgaben automatisch gelöscht
   - Die Löschung erfolgt pro Vorlage
   - Aufgabenprotokolle werden zusammen mit den Aufgabendatensätzen entfernt
