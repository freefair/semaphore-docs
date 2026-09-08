# Teams

In Semaphore UI ist jedes Projekt einem **Team** zugeordnet. Nur Teammitglieder und Administratoren können auf das Projekt zugreifen. Jedem Teammitglied wird eine von vier integrierten Rollen zugewiesen, die seine Zugriffsstufe und die ausführbaren Aktionen bestimmen.

In der **Enterprise**-Edition können die integrierten Rollen durch [benutzerdefinierte Rollen](#extended-rbac-enterprise) erweitert werden, die zusätzliche, fein abgestufte Berechtigungen für bestimmte Templates gewähren.

:::tip
Um den Zugriff auf ein Projekt nicht zu verlieren, wird empfohlen, mindestens zwei Teammitglieder mit der Rolle <b>Eigentümer</b> zu haben.
:::

## Integrierte Rollen {#built-in-roles}

Jedes Teammitglied hat genau eine dieser vier Rollen:

- **Eigentümer** (Owner)
- **Manager**
- **Task Runner**
- **Gast** (Guest)

Im Folgenden finden Sie detaillierte Beschreibungen jeder Rolle und ihrer Berechtigungen.

### Eigentümer {#owner}

- **Volle Berechtigungen**<br />
  Eigentümer können innerhalb des Projekts alles tun, einschließlich Rollen verwalten, Mitglieder hinzufügen/entfernen und beliebige Projekteinstellungen konfigurieren.

- **Mehrere Eigentümer**<br />
  Ein Projekt kann mehrere Eigentümer haben, sodass mehr als eine Person volle Rechte besitzt.

- **Einschränkungen beim Entfernen der eigenen Person**<br />
  Ein Eigentümer kann sich nicht selbst entfernen, wenn er der einzige Eigentümer des Projekts ist. Dies verhindert, dass das Projekt ohne Eigentümer zurückbleibt.

- **Verwaltung anderer Eigentümer**<br />
  Eigentümer können alle Teammitglieder verwalten (einschließlich Entfernen oder Rollenänderung), auch andere Eigentümer.

### Manager {#manager}

- **Weitreichende Projektkontrolle:** Manager haben nahezu dieselben Berechtigungen wie Eigentümer und können damit die meisten alltäglichen Aufgaben erledigen und die Projektumgebung verwalten.

- Manager **können nicht**:
  - Das Projekt entfernen.
  - Eigentümer entfernen oder deren Rollen ändern.

- **Typischer Anwendungsfall:** Weisen Sie die Rolle Manager erfahrenen Teammitgliedern zu, die umfassenden Zugriff benötigen, aber nicht die Befugnis haben müssen, das Projekt zu löschen oder Eigentümer zu verwalten.

### Task Runner {#task-runner}

- **Tasks ausführen:** Task Runner können jedes im Projekt vorhandene Task-Template ausführen.

- **Nur Lesezugriff auf andere Ressourcen:** Sie können zwar Tasks ausführen, haben aber nur Lesezugriff auf andere Ressourcen wie Inventory, Variablen, Repositories usw.

- **Typischer Anwendungsfall:** Entwickler oder QA-Ingenieure, die Tasks auslösen und überwachen müssen, aber keine Projekteinstellungen ändern oder die Teammitgliedschaft verwalten müssen.

### Gast {#guest}

- **Nur Lesezugriff:** Gäste haben Lesezugriff auf alle Projektressourcen (z. B. Anzeigen von Logs, Inventories, Dashboards).

- **Keine Schreibrechte:** Sie können keine Einstellungen ändern, keine Tasks ausführen und keine Rollen ändern.

- **Typischer Anwendungsfall:** Stakeholder oder andere Beteiligte, die nur den Projektstatus und Details einsehen müssen, ohne Änderungen vorzunehmen.

---

## Erweitertes RBAC (Enterprise) {#extended-rbac-enterprise}

:::info
Erweitertes RBAC ist in der **Semaphore Enterprise**-Edition ab [Semaphore v2.17](https://semaphoreui.com/releases/semaphore-v2_17) verfügbar.
:::

Erweitertes RBAC legt zusätzliche Berechtigungen über die vier integrierten Rollen. Die integrierten Rollen selbst bleiben unverändert. Wenn Sie keine benutzerdefinierten Rollen definieren, verhält sich jedes Projekt genau wie in der Community-Edition.

Mit erweitertem RBAC können benutzerdefinierte Rollen einzelne projektweite Berechtigungen gewähren. Sie können einer Rolle außerdem Berechtigungen für ausgewählte Task-Templates erteilen. So können Sie einem Teammitglied Zugriff auf die benötigten Templates geben, ohne es auf eine höhere integrierte Rolle hochzustufen.

### Benutzerdefinierte Rollen {#custom-roles}

Eine benutzerdefinierte Rolle ist ein benannter Satz von Berechtigungen, der die integrierte Projektrolle eines Mitglieds ergänzt. Jedes Teammitglied behält seine integrierte Rolle. Benutzerdefinierte Rollen fügen ihr Berechtigungen hinzu.

Benutzerdefinierte Rollen sind in zwei Geltungsbereichen verfügbar:

- **Globale Rollen** werden auf Instanzebene definiert und können in jedem Projekt verwendet werden.
- **Projektrollen** werden innerhalb eines einzelnen Projekts definiert und sind nur in diesem Projekt verfügbar.

### Berechtigungsebenen {#permission-levels}

Benutzerdefinierte Rollen gewähren Berechtigungen auf zwei Ebenen:

- **Projektweite Berechtigungen** erweitern den Zugriff eines Benutzers im gesamten Projekt. Sie wählen diese beim Erstellen der Rolle aus.
- **Template-Berechtigungen** steuern Aktionen für ein einzelnes Task-Template. Sie wählen diese im Tab **Berechtigungen** des jeweiligen Templates aus, nachdem Sie die Rolle zum Template hinzugefügt haben.

### Eine benutzerdefinierte Rolle erstellen {#create-a-custom-role}

Wählen Sie den Geltungsbereich, bevor Sie das Rollenformular öffnen.

#### Globale Rolle {#global-role}

Globale Rollen werden einmal erstellt und können Benutzern in jedem Projekt zugewiesen werden. Nur ein Instanzadministrator kann eine globale Rolle erstellen.

Öffnen Sie das Admin-Menü unten links und wählen Sie **Rollen**.

Wählen Sie in der instanzweiten Rollenliste **Neue Rolle**.

![Rollen über das Administratormenü öffnen, dann Neue Rolle wählen](/assets/custom-roles-navigation-to-new-role-annotated-v4.png)

#### Projektrolle {#project-role}

Projektrollen sind nur in dem Projekt verfügbar, in dem sie erstellt wurden. Projekt-Eigentümer und Manager können sie erstellen.

1. Öffnen Sie das Projekt und gehen Sie zu **Team** > **Rollen**.
2. Wählen Sie **Neue Rolle**.

Der Tab **Rollen** ist leer, bis die erste Projektrolle erstellt wurde. Er listet alle Projektrollen auf und enthält die Schaltfläche **Neue Rolle**.

![](https://www.semaphoreui.com/uploads/v2.17/roles1.webp)

### Eine benutzerdefinierte Rolle konfigurieren {#configure-a-custom-role}

Beide Wege öffnen dasselbe Rollenformular. Konfigurieren Sie die Rolle passend zum Zugriff, den Ihr Teammitglied benötigt.

![Dialog „Neue Rolle“ mit Feldern und Berechtigungs-Kontrollkästchen](/assets/custom-roles-global-role-form.jpg)

| Feld | Beschreibung |
| --- | --- |
| **Name** | Eine für Menschen lesbare Bezeichnung der Rolle. |
| **Slug** | Eine eindeutige technische Kennung, über die die Rolle referenziert wird. Verwenden Sie Kleinbuchstaben, Ziffern, Unterstriche oder Bindestriche, zum Beispiel `release_operator`. |
| **Berechtigungen** | Die projektweiten Berechtigungen, die die Rolle gewährt. |

#### Projektweite Berechtigungen {#project-wide-permissions}

Wählen Sie nur die projektweiten Berechtigungen aus, die die Rolle benötigt:

| Berechtigung | Beschreibung |
| --- | --- |
| **Darf Projekt-Tasks ausführen** | Projekt-Tasks ausführen. |
| **Darf Projekt aktualisieren** | Grundlegende Projektinformationen unter **Dashboard** > **Einstellungen** bearbeiten. |
| **Darf Projektressourcen verwalten** | Projektressourcen verwalten, etwa Task-Templates, Repositories, Inventory, Umgebungen, Key-Store-Einträge, Zeitpläne, Integrationen und Runner. Dies ist ein projektweiter Zugriff. Er kann nicht auf einzelne Nicht-Template-Ressourcen beschränkt werden. |
| **Darf Projektbenutzer verwalten** | Projektmitgliedschaft und Rollenzuweisungen verwalten. |

Projektweite Berechtigungen können nicht auf ein einzelnes Inventory, Repository, eine Umgebung oder einen Key-Store-Eintrag beschränkt werden. Task-Templates sind der einzige Ressourcentyp, der granulare Rollenzuweisungen unterstützt.

:::tip Nur Template-Zugriff
Um eine granulare Rolle zu erstellen, die nur Zugriff auf ausgewählte Task-Templates hinzufügt, lassen Sie alle projektweiten Berechtigungen deaktiviert. Die Rolle fügt dann selbst keine projektweiten Berechtigungen hinzu. Fügen Sie sie den benötigten Templates hinzu und wählen Sie dort nur die Aktionen aus, die die Rolle benötigt.
:::

Wählen Sie **Speichern**, wenn die Rollenkonfiguration fertig ist.

### Zugriff auf bestimmte Task-Templates konfigurieren {#configure-access-to-specific-task-templates}

Template-Berechtigungen fügen Zugriff auf ausgewählte Task-Templates hinzu. Das folgende Beispiel verwendet eine benutzerdefinierte Rolle ohne projektweite Berechtigungen. Diese Konfiguration nach dem Prinzip der minimalen Rechte ist nützlich, wenn ein Teammitglied nur ausgewählte Template-Aktionen benötigt. Sie können Template-Berechtigungen auch zu einer Rolle hinzufügen, die bereits projektweiten Zugriff gewährt.

**Das gewünschte Template öffnen**

1. Öffnen Sie **Task-Templates** und wählen Sie das Ziel-Template aus.
2. Öffnen Sie den Tab **Berechtigungen**.

Der Tab **Berechtigungen** listet die Rollen auf, die dem Template bereits hinzugefügt wurden.

![](https://www.semaphoreui.com/uploads/v2.17/roles2.webp)

**Die Rolle hinzufügen und Template-Berechtigungen gewähren**

1. Wählen Sie **Rolle hinzufügen** und wählen Sie die benutzerdefinierte Rolle aus, die diesem Template hinzugefügt werden soll.
2. Wählen Sie nur die Template-Berechtigungen aus, die die Rolle benötigt, etwa **Darf Tasks ausführen** oder **Darf das Template aktualisieren**.

Dieses Beispiel verwendet eine zuvor erstellte Rolle ohne projektweite Berechtigungen. Sie können jede im Projekt verfügbare benutzerdefinierte Rolle wählen.

![Dialog für Template-Berechtigungen mit hervorgehobenen Bedienelementen](/assets/custom-roles-template-permissions-annotated.png)

Um derselben Rolle Zugriff auf weitere Templates zu gewähren, wiederholen Sie diese Schritte für jedes Template.

:::note Bestehender Projektzugriff
Template-Berechtigungen sind additiv. Sie fügen Zugriff hinzu, ohne den Zugriff aus der integrierten Rolle eines Benutzers oder aus anderen benutzerdefinierten Rollen zu ersetzen oder einzuschränken. Wenn ein Benutzer bereits alle Task-Templates ausführen oder aktualisieren kann, schränkt das Hinzufügen einer Template-spezifischen Rolle diesen Zugriff nicht ein.
:::

### Eine benutzerdefinierte Rolle in einem Projekt zuweisen {#assign-a-custom-role-in-a-project}

Nachdem Sie eine globale oder Projektrolle erstellt und konfiguriert haben, weisen Sie sie dem gewünschten Teammitglied zu:

1. Öffnen Sie das Projekt und gehen Sie zu **Team**.
2. Klappen Sie **Rollen** neben dem gewünschten Benutzer auf.
3. Wählen Sie die benutzerdefinierte Rolle aus.

### Derzeit nicht unterstützt {#not-currently-supported}

- **LDAP-/OIDC-Gruppenzuordnung.** Benutzerdefinierte Rollen werden pro Benutzer zugewiesen. Die Zuordnung externer Verzeichnisgruppen zu benutzerdefinierten Rollen wird nicht unterstützt.
- **Granulare Berechtigungen für Nicht-Template-Ressourcen.** Derzeit können nur Templates auf Ebene einzelner Ressourcen über benutzerdefinierte Rollen gesteuert werden.

---

## Teammitglieder verwalten {#managing-team-members}

- **Neue Mitglieder einladen:** **Eigentümer** und **Manager** können neue Benutzer in das Team einladen und ihnen eine anfängliche Rolle zuweisen.

- **Rollen ändern:** Eigentümer können die Rollen aller Teammitglieder jederzeit ändern. Manager können die Rollen von **Task Runnern** und **Gästen** ändern, aber **nicht** die anderer Manager oder Eigentümer.

- **Mitglieder entfernen:** Eigentümer und Manager können Teammitglieder mit niedrigeren Rollen entfernen.
  - Ein Eigentümer kann jeden entfernen (auch andere Eigentümer), sich selbst jedoch nicht, wenn er der einzige Eigentümer ist.
  - Ein Manager kann **Task Runner** und **Gäste** entfernen, aber **nicht** andere Manager oder Eigentümer.

---

## Best Practices {#best-practices}

1. **Redundanz sicherstellen:** Weisen Sie die Rolle **Eigentümer** mindestens zwei Personen zu, um dauerhaften Zugriff zu gewährleisten und einen Single Point of Failure zu vermeiden.
2. **Prinzip der minimalen Rechte befolgen:**
   - Geben Sie Teammitgliedern die für ihre Aufgaben minimal erforderliche Rolle.
   - Verwenden Sie die Rollen **Task Runner** oder **Gast** für Personen, die nur eingeschränkte Berechtigungen benötigen.
   - Bevorzugen Sie in der Enterprise-Edition [benutzerdefinierte Rollen](#extended-rbac-enterprise), um Zugriff auf bestimmte Templates zu gewähren, statt die integrierte Rolle eines Mitglieds hochzustufen.
3. **Mitgliedschaft regelmäßig überprüfen:**
   - Bewerten Sie Rollen neu, wenn sich Teamstrukturen ändern.
   - Entziehen Sie den Zugriff oder stufen Sie Rollen herab für Benutzer, die keine weitreichenden Rechte mehr benötigen.
4. **Manager für die tägliche Administration einsetzen:**
   - Reservieren Sie die Rolle Eigentümer für eine kleinere Gruppe mit letzter Entscheidungsbefugnis.
   - Delegieren Sie routinemäßige Projektverwaltungsaufgaben an Manager, um das Risiko versehentlicher größerer Änderungen oder Projektlöschungen zu verringern.

---

## Häufig gestellte Fragen {#frequently-asked-questions}

### 1. Kann ein Eigentümer einen anderen Eigentümer entfernen? {#1-can-an-owner-remove-another-owner}
Ja, ein Eigentümer kann jeden anderen Eigentümer entfernen oder dessen Rolle ändern, es sei denn, er ist der einzige verbleibende Eigentümer im Projekt.

### 2. Wer kann das Projekt löschen? {#2-who-can-delete-the-project}
Nur **Eigentümer** können ein Projekt löschen.

### 3. Können Manager andere Manager hinzufügen oder entfernen? {#3-can-managers-add-or-remove-other-managers}
Nein. Manager können nur Benutzer mit den Rollen **Task Runner** oder **Gast** hinzufügen oder entfernen. Um Eigentümer oder andere Manager zu verwalten, müssen Sie Eigentümer sein.

### 4. Was passiert, wenn ich versehentlich alle Eigentümer entferne? {#4-what-happens-if-i-remove-all-owners-by-accident}
Semaphore UI verhindert das Entfernen eines Eigentümers, wenn das Projekt dadurch ohne Eigentümer zurückbliebe. Es muss jederzeit mindestens einen Eigentümer geben.

### 5. Können Gäste Tasks ausführen? {#5-can-guests-run-tasks}
Nein. Gäste haben nur Lesezugriff und können Tasks weder auslösen noch verwalten. In der Enterprise-Edition können Sie einem Gast über eine [benutzerdefinierte Rolle](#extended-rbac-enterprise) die Berechtigung erteilen, einzelne Templates auszuführen.

### 6. Ersetzen benutzerdefinierte Rollen die integrierten Rollen? {#6-do-custom-roles-replace-the-built-in-roles}
Nein. Benutzerdefinierte Rollen erweitern die integrierten Rollen um zusätzliche Berechtigungen auf Projekt- und Template-Ebene. Jedes Teammitglied hat weiterhin genau eine integrierte Rolle.

### 7. Ist erweitertes RBAC in der Community-Edition verfügbar? {#7-is-extended-rbac-available-in-the-community-edition}
Nein. Erweitertes RBAC erfordert ein **Semaphore Enterprise**-Abonnement.
