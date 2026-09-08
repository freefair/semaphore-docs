# Einführung

Willkommen beim Administrationshandbuch von Semaphore UI. Dieses Handbuch bietet umfassende Informationen zur Installation, Konfiguration und Wartung Ihrer Semaphore-Instanz.

## Was ist Semaphore UI? {#what-is-semaphore-ui}

Semaphore UI ist eine moderne Open-Source-Weboberfläche zum Ausführen von Automatisierungsaufgaben. Sie ist als leichtgewichtige, schnelle und einfach zu bedienende Alternative zu komplexeren Automatisierungsplattformen konzipiert.

Sie ermöglicht es Ihnen, Aufgaben sicher zu verwalten und auszuführen für:
*   **Ansible**-Playbooks
*   **Terraform/OpenTofu** Infrastructure as Code
*   **PowerShell**- und **Shell**-Skripte
*   **Python**-Skripte

## Kernfunktionen & Philosophie {#core-features--philosophy}

Wenn Sie die Designprinzipien von Semaphore verstehen, können Sie das Beste daraus herausholen:

*   **Leichtgewichtig und performant**: Semaphore ist in **Go** geschrieben und wird als **einzelne Binärdatei** ausgeliefert. Es hat minimale Ressourcenanforderungen (CPU/RAM) und benötigt keine externen Abhängigkeiten wie Kubernetes, Docker oder eine JVM. Das macht es schnell, effizient und einfach bereitzustellen.
*   **Einfach zu installieren und zu warten**: Sie können Semaphore in wenigen Minuten in Betrieb nehmen. Die Installation kann so einfach sein wie das Herunterladen und Starten der Binärdatei. Die einfache Architektur macht Upgrades und Wartung unkompliziert.
*   **Flexible Bereitstellung**: Führen Sie es als Binärdatei, als systemd-Dienst oder in einem Docker-Container aus. Es eignet sich für alles vom persönlichen Homelab bis hin zu Unternehmensumgebungen.
*   **Selbst gehostet und sicher**: Semaphore ist eine selbst gehostete Lösung. Alle Ihre Daten, Zugangsdaten und Logs bleiben auf Ihrer eigenen Infrastruktur, sodass Sie die volle Kontrolle behalten. Zugangsdaten werden in der Datenbank immer verschlüsselt gespeichert.
*   **Leistungsstarke Integrationen**: Trotz seiner Einfachheit unterstützt Semaphore leistungsstarke Funktionen wie LDAP-/OpenID-Authentifizierung, eine detaillierte rollenbasierte Zugriffskontrolle (RBAC) pro Projekt, Remote-Runner zur Skalierung der Task-Ausführung und eine vollständige REST-API für den programmatischen Zugriff.

Dieses Handbuch führt Sie durch die Einrichtung und Verwaltung dieser Funktionen für Ihre individuellen Anforderungen.
