
# Projekt-Runner (Pro)

Projekt-Runner sind eine leistungsstarke Funktion in Semaphore Pro, die die verteilte Ausführung von Aufgaben über mehrere Server ermöglicht. Mit dieser Funktion können Sie Aufgaben auf Servern ausführen, die von Ihrer Semaphore-UI-Instanz getrennt sind, und erhalten so mehr Sicherheit, Skalierbarkeit und Ressourcenverwaltung.

![](/assets/project_runners.webp)

## Überblick {#overview}

Projekt-Runner arbeiten nach einem ähnlichen Prinzip wie GitLab- oder GitHub-Actions-Runner:

- Ein Runner wird auf einem von Ihrer Semaphore UI getrennten Server bereitgestellt
- Der Runner verbindet sich über ein sicheres Token mit Ihrer Semaphore-Instanz
- Wenn Aufgaben erstellt werden, delegiert Semaphore sie an verfügbare Runner
- Die Runner führen die Aufgaben aus und melden die Ergebnisse an Semaphore zurück

## Vorteile {#benefits}

Die Verwendung von Runnern bietet mehrere wesentliche Vorteile:

1. **Mehr Sicherheit**
   - Runner können in isolierten Umgebungen oder eingeschränkten Netzwerken bereitgestellt werden
   - Sensible Vorgänge können in kontrollierten Umgebungen ausgeführt werden
   - Bessere Trennung von Zuständigkeiten zwischen UI und Ausführungsumgebungen

2. **Bessere Skalierbarkeit**
   - Verteilen Sie die Arbeitslast auf mehrere Server
   - Fügen Sie Runner je nach Bedarf hinzu oder entfernen Sie sie
   - Bessere Ressourcennutzung in Ihrer gesamten Infrastruktur

3. **Flexible Bereitstellung**
   - Stellen Sie Runner nah an Ihrer Zielinfrastruktur bereit
   - Führen Sie Aufgaben in verschiedenen Netzwerkzonen aus
   - Unterstützung verschiedener Bereitstellungsmodelle (On-Premises, Cloud, Hybrid)

## Verwendung von Projekt-Runnern {#using-project-runners}

### Voraussetzungen {#prerequisites}

Um Runner zu verwenden, benötigen Sie:

1. Eine Semaphore-Pro-Lizenz
2. Einen separaten Server zum Betrieb des Runners
3. Netzwerkverbindung zwischen dem Runner und der Semaphore UI
4. Korrekte Konfiguration sowohl auf dem Semaphore-UI- als auch auf dem Runner-Server

<!-- ### Configuration

1. **Semaphore UI Configuration**
  

2. **Runner Setup** -->


### Runner verwalten {#managing-runners}

Sie können Runner über die Semaphore UI verwalten:

1. Navigieren Sie in Ihrem Projekt zum Bereich Runner
2. Sehen Sie sich alle registrierten Runner und deren Status an
3. Fügen Sie Runner nach Bedarf hinzu oder entfernen Sie sie
4. Überwachen Sie den Zustand und die Leistung der Runner

### Sicherheitsaspekte {#security-considerations}

- Verwenden Sie für die Kommunikation zwischen Runnern und der Semaphore UI immer HTTPS
- Implementieren Sie angemessene Netzwerksicherheit zwischen Runnern und der Semaphore UI
- Ziehen Sie für sensible Vorgänge isolierte Umgebungen in Betracht

## Best Practices {#best-practices}

1. **Ressourcenplanung**
   - Dimensionieren Sie Ihre Runner passend zu Ihrer Arbeitslast
   - Überwachen Sie die Ressourcennutzung der Runner
   - Skalieren Sie Runner je nach Bedarf

2. **Netzwerkkonfiguration**
   - Stellen Sie eine korrekte Netzwerkverbindung sicher
   - Konfigurieren Sie Firewalls angemessen
   - Verwenden Sie sichere Kommunikationskanäle

3. **Wartung**
   - Aktualisieren Sie die Runner-Software regelmäßig
   - Überwachen Sie den Zustand der Runner
   - Implementieren Sie angemessenes Logging und Monitoring
   - Halten Sie eine Backup-Strategie für Runner-Ausfälle bereit

4. **Sicherheit**
   - Befolgen Sie das Prinzip der geringsten Rechte
   - Implementieren Sie angemessene Zugriffskontrollen
   - Regelmäßige Sicherheitsaudits
   - Halten Sie die Software auf dem neuesten Stand
