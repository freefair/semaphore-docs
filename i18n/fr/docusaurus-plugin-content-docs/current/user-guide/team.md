# Équipes

Dans Semaphore UI, chaque projet est associé à une **équipe**. Seuls les membres de l'équipe et les administrateurs peuvent accéder au projet. Chaque membre de l'équipe se voit attribuer l'un des quatre rôles intégrés, qui déterminent son niveau d'accès et les actions qu'il peut effectuer.

Dans l'édition **Enterprise**, les rôles intégrés peuvent être étendus avec des [rôles personnalisés](#extended-rbac-enterprise) qui accordent des permissions supplémentaires et granulaires sur des modèles spécifiques.

:::tip
Pour éviter de perdre l'accès à un projet, il est recommandé d'avoir au moins deux membres de l'équipe avec le rôle <b>Propriétaire</b>.
:::

## Rôles intégrés {#built-in-roles}

Chaque membre de l'équipe possède exactement l'un de ces quatre rôles :

- **Propriétaire** (Owner)
- **Gestionnaire** (Manager)
- **Exécutant de tâches** (Task Runner)
- **Invité** (Guest)

Vous trouverez ci-dessous une description détaillée de chaque rôle et de ses permissions.

### Propriétaire {#owner}

- **Permissions complètes**<br />
  Les propriétaires peuvent tout faire dans le projet, y compris gérer les rôles, ajouter/retirer des membres et configurer tous les paramètres du projet.

- **Plusieurs propriétaires**<br />
  Un projet peut avoir plusieurs propriétaires, ce qui garantit que plus d'une personne dispose de tous les privilèges.

- **Restrictions sur l'auto-retrait**<br />
  Un propriétaire ne peut pas se retirer lui-même s'il est le seul propriétaire du projet. Cela évite que le projet se retrouve sans propriétaire.

- **Gestion des autres propriétaires**<br />
  Les propriétaires peuvent gérer (y compris retirer ou changer le rôle de) tous les membres de l'équipe, y compris les autres propriétaires.

### Gestionnaire {#manager}

- **Contrôle étendu du projet :** les gestionnaires disposent presque des mêmes permissions que les propriétaires, ce qui leur permet de gérer la plupart des tâches quotidiennes et l'environnement du projet.

- Les gestionnaires **ne peuvent pas** :
  - Supprimer le projet.
  - Retirer les propriétaires ou changer leur rôle.

- **Cas d'usage typique :** attribuez le rôle de gestionnaire aux membres expérimentés de l'équipe qui ont besoin d'un accès étendu, sans avoir l'autorité de supprimer le projet ou de gérer les propriétaires.

### Exécutant de tâches {#task-runner}

- **Exécuter des tâches :** les exécutants de tâches peuvent exécuter n'importe quel modèle de tâche existant dans le projet.

- **Lecture seule pour les autres ressources :** s'ils peuvent exécuter des tâches, ils n'ont qu'un accès en lecture seule aux autres ressources telles que l'inventaire, les variables, les dépôts, etc.

- **Cas d'usage typique :** développeurs ou ingénieurs QA qui doivent déclencher et surveiller des tâches, mais n'ont pas besoin de modifier les paramètres du projet ni de gérer les membres de l'équipe.

### Invité {#guest}

- **Accès en lecture seule :** les invités ont un accès en lecture seule à toutes les ressources du projet (par exemple consultation des journaux, des inventaires, des tableaux de bord).

- **Aucune permission d'écriture :** ils ne peuvent ni modifier les paramètres, ni exécuter des tâches, ni changer les rôles.

- **Cas d'usage typique :** parties prenantes ou autres collaborateurs qui ont uniquement besoin de consulter l'état et les détails du projet sans effectuer de modifications.

---

## RBAC étendu (Enterprise) {#extended-rbac-enterprise}

:::info
Le RBAC étendu est disponible dans l'édition **Semaphore Enterprise**, à partir de [Semaphore v2.17](https://semaphoreui.com/releases/semaphore-v2_17).
:::

Le RBAC étendu ajoute des permissions supplémentaires par-dessus les quatre rôles intégrés. Les rôles intégrés eux-mêmes restent inchangés. Si vous ne définissez aucun rôle personnalisé, chaque projet se comporte exactement comme dans l'édition communautaire.

Avec le RBAC étendu, les rôles personnalisés peuvent accorder des permissions individuelles à l'échelle du projet. Vous pouvez également accorder à un rôle des permissions sur certains modèles de tâches. Cela vous permet de donner à un membre de l'équipe l'accès aux modèles dont il a besoin sans le promouvoir à un rôle intégré supérieur.

### Rôles personnalisés {#custom-roles}

Un rôle personnalisé est un ensemble nommé de permissions qui complète le rôle de projet intégré d'un membre. Chaque membre de l'équipe conserve son rôle intégré. Les rôles personnalisés y ajoutent des permissions.

Les rôles personnalisés existent à deux niveaux :

- Les **rôles globaux** sont définis au niveau de l'instance et peuvent être utilisés dans n'importe quel projet.
- Les **rôles de projet** sont définis au sein d'un seul projet et ne sont disponibles que dans ce projet.

### Niveaux de permission {#permission-levels}

Les rôles personnalisés accordent des permissions à deux niveaux :

- Les **permissions à l'échelle du projet** étendent l'accès d'un utilisateur à l'ensemble d'un projet. Vous les choisissez lors de la création du rôle.
- Les **permissions de modèle** contrôlent les actions sur un modèle de tâche donné. Vous les choisissez dans l'onglet **Permissions** de ce modèle après avoir ajouté le rôle au modèle.

### Créer un rôle personnalisé {#create-a-custom-role}

Choisissez le niveau avant d'ouvrir le formulaire de rôle.

#### Rôle global {#global-role}

Les rôles globaux sont créés une seule fois et peuvent être attribués aux utilisateurs de n'importe quel projet. Seul un administrateur de l'instance peut créer un rôle global.

Ouvrez le menu d'administration en bas à gauche et sélectionnez **Rôles**.

Dans la liste des rôles de l'instance, sélectionnez **Nouveau rôle**.

![Ouvrez Rôles depuis le menu administrateur, puis sélectionnez Nouveau rôle](/assets/custom-roles-navigation-to-new-role-annotated-v4.png)

#### Rôle de projet {#project-role}

Les rôles de projet ne sont disponibles que dans le projet où ils ont été créés. Les propriétaires et gestionnaires du projet peuvent les créer.

1. Ouvrez le projet et accédez à **Équipe** > **Rôles**.
2. Sélectionnez **Nouveau rôle**.

L'onglet **Rôles** est vide tant qu'aucun rôle de projet n'a été créé. Il liste tous les rôles de projet et contient le bouton **Nouveau rôle**.

![](https://www.semaphoreui.com/uploads/v2.17/roles1.webp)

### Configurer un rôle personnalisé {#configure-a-custom-role}

Les deux chemins ouvrent le même formulaire de rôle. Configurez le rôle en fonction de l'accès dont votre membre d'équipe a besoin.

![Boîte de dialogue Nouveau rôle avec les champs et les cases à cocher des permissions](/assets/custom-roles-global-role-form.jpg)

| Champ | Description |
| --- | --- |
| **Nom** | Libellé lisible du rôle. |
| **Slug** | Identifiant technique unique utilisé pour référencer le rôle. Utilisez des lettres minuscules, des chiffres, des tirets bas ou des tirets, par exemple `release_operator`. |
| **Permissions** | Les permissions à l'échelle du projet accordées par le rôle. |

#### Permissions à l'échelle du projet {#project-wide-permissions}

Ne choisissez que les permissions à l'échelle du projet dont le rôle a besoin :

| Permission | Description |
| --- | --- |
| **Peut exécuter les tâches du projet** | Exécuter les tâches du projet. |
| **Peut mettre à jour le projet** | Modifier les informations de base du projet dans **Tableau de bord** > **Paramètres**. |
| **Peut gérer les ressources du projet** | Gérer les ressources du projet, telles que les modèles de tâches, les dépôts, l'inventaire, les environnements, les entrées du magasin de clés, les planifications, les intégrations et les runners. Il s'agit d'un accès à l'échelle du projet. Il ne peut pas être limité à des ressources individuelles autres que les modèles. |
| **Peut gérer les utilisateurs du projet** | Gérer les membres du projet et l'attribution des rôles. |

Les permissions à l'échelle du projet ne peuvent pas être limitées à un inventaire, un dépôt, un environnement ou une entrée du magasin de clés en particulier. Les modèles de tâches sont le seul type de ressource prenant en charge l'attribution granulaire de rôles.

:::tip Accès limité aux modèles
Pour créer un rôle granulaire qui n'ajoute l'accès qu'à certains modèles de tâches, laissez toutes les permissions à l'échelle du projet décochées. Le rôle n'ajoute alors aucune permission à l'échelle du projet. Ajoutez-le aux modèles requis et choisissez-y uniquement les actions dont ce rôle a besoin.
:::

Sélectionnez **Enregistrer** lorsque la configuration du rôle est prête.

### Configurer l'accès à des modèles de tâches spécifiques {#configure-access-to-specific-task-templates}

Les permissions de modèle ajoutent un accès sur certains modèles de tâches. L'exemple ci-dessous utilise un rôle personnalisé sans permission à l'échelle du projet. Cette configuration de moindre privilège est utile lorsqu'un membre de l'équipe n'a besoin que de certaines actions sur des modèles. Vous pouvez également ajouter des permissions de modèle à un rôle qui accorde déjà un accès à l'échelle du projet.

**Ouvrir le modèle requis**

1. Ouvrez **Modèles de tâches** et sélectionnez le modèle cible.
2. Ouvrez l'onglet **Permissions**.

L'onglet **Permissions** liste les rôles déjà ajoutés au modèle.

![](https://www.semaphoreui.com/uploads/v2.17/roles2.webp)

**Ajouter le rôle et accorder des permissions de modèle**

1. Sélectionnez **Ajouter un rôle** et choisissez le rôle personnalisé à ajouter à ce modèle.
2. Sélectionnez uniquement les permissions de modèle dont le rôle a besoin, telles que **Peut exécuter les tâches** ou **Peut mettre à jour le modèle**.

Cet exemple utilise un rôle créé précédemment sans permission à l'échelle du projet. Vous pouvez choisir n'importe quel rôle personnalisé disponible dans le projet.

![Boîte de dialogue des permissions de modèle avec les contrôles requis mis en évidence](/assets/custom-roles-template-permissions-annotated.png)

Pour accorder au même rôle l'accès à d'autres modèles, répétez ces étapes pour chaque modèle.

:::note Accès existant au projet
Les permissions de modèle sont cumulatives. Elles ajoutent un accès sans remplacer ni réduire l'accès issu du rôle intégré de l'utilisateur ou d'autres rôles personnalisés. Si un utilisateur peut déjà exécuter ou mettre à jour tous les modèles de tâches, l'ajout d'un rôle spécifique à un modèle ne restreint pas cet accès.
:::

### Attribuer un rôle personnalisé dans un projet {#assign-a-custom-role-in-a-project}

Après avoir créé et configuré un rôle global ou de projet, attribuez-le au membre de l'équipe concerné :

1. Ouvrez le projet et accédez à **Équipe**.
2. Dépliez **Rôles** à côté de l'utilisateur concerné.
3. Sélectionnez le rôle personnalisé.

### Non pris en charge actuellement {#not-currently-supported}

- **Mappage des groupes LDAP / OIDC.** Les rôles personnalisés sont attribués par utilisateur. Le mappage de groupes d'annuaires externes vers des rôles personnalisés n'est pas pris en charge.
- **Permissions granulaires pour les ressources autres que les modèles.** Seuls les modèles peuvent aujourd'hui être régis par des rôles personnalisés au niveau de la ressource individuelle.

---

## Gestion des membres de l'équipe {#managing-team-members}

- **Inviter de nouveaux membres :** les **propriétaires** et les **gestionnaires** peuvent inviter de nouveaux utilisateurs à rejoindre l'équipe et leur attribuer un rôle initial.

- **Changer les rôles :** les propriétaires peuvent toujours changer le rôle de n'importe quel membre de l'équipe. Les gestionnaires peuvent changer le rôle des **exécutants de tâches** et des **invités**, mais **pas** celui des autres gestionnaires ou des propriétaires.

- **Retirer des membres :** les propriétaires et les gestionnaires peuvent retirer les membres de l'équipe ayant un rôle inférieur.
  - Un propriétaire peut retirer n'importe qui (y compris d'autres propriétaires), mais ne peut pas se retirer lui-même s'il est le seul propriétaire.
  - Un gestionnaire peut retirer les **exécutants de tâches** et les **invités**, mais **pas** les autres gestionnaires ou les propriétaires.

---

## Bonnes pratiques {#best-practices}

1. **Maintenez une redondance :** attribuez le rôle **Propriétaire** à au moins deux personnes pour garantir un accès continu et éviter un point de défaillance unique.
2. **Appliquez le principe du moindre privilège :**
   - Donnez aux membres de l'équipe le rôle minimal nécessaire à leurs tâches.
   - Utilisez les rôles **Exécutant de tâches** ou **Invité** pour ceux qui n'ont besoin que de permissions limitées.
   - Sur l'édition Enterprise, préférez les [rôles personnalisés](#extended-rbac-enterprise) pour accorder l'accès à des modèles spécifiques plutôt que d'élever le rôle intégré d'un membre.
3. **Passez régulièrement en revue les membres :**
   - À mesure que la structure de l'équipe évolue, réévaluez les rôles.
   - Révoquez l'accès ou rétrogradez le rôle des utilisateurs qui n'ont plus besoin de privilèges élevés.
4. **Utilisez les gestionnaires pour l'administration quotidienne :**
   - Réservez le rôle Propriétaire à un groupe restreint disposant de l'autorité ultime.
   - Déléguez les tâches courantes de gestion du projet aux gestionnaires afin de réduire le risque de modifications majeures accidentelles ou de suppressions de projet.

---

## Questions fréquentes {#frequently-asked-questions}

### 1. Un propriétaire peut-il retirer un autre propriétaire ? {#1-can-an-owner-remove-another-owner}
Oui, un propriétaire peut retirer ou changer le rôle de tout autre propriétaire, sauf s'il est le seul propriétaire restant du projet.

### 2. Qui peut supprimer le projet ? {#2-who-can-delete-the-project}
Seuls les **propriétaires** peuvent supprimer un projet.

### 3. Les gestionnaires peuvent-ils ajouter ou retirer d'autres gestionnaires ? {#3-can-managers-add-or-remove-other-managers}
Non. Les gestionnaires ne peuvent ajouter ou retirer que des utilisateurs ayant le rôle **Exécutant de tâches** ou **Invité**. Pour gérer les propriétaires ou d'autres gestionnaires, vous devez être propriétaire.

### 4. Que se passe-t-il si je retire tous les propriétaires par accident ? {#4-what-happens-if-i-remove-all-owners-by-accident}
Semaphore UI empêche le retrait d'un propriétaire si cela laisserait le projet sans aucun propriétaire. Il doit y avoir au moins un propriétaire à tout moment.

### 5. Les invités peuvent-ils exécuter des tâches ? {#5-can-guests-run-tasks}
Non. Les invités disposent d'un accès en lecture seule et ne peuvent ni déclencher ni gérer des tâches. Dans l'édition Enterprise, vous pouvez accorder à un invité la permission d'exécuter certains modèles via un [rôle personnalisé](#extended-rbac-enterprise).

### 6. Les rôles personnalisés remplacent-ils les rôles intégrés ? {#6-do-custom-roles-replace-the-built-in-roles}
Non. Les rôles personnalisés étendent les rôles intégrés avec des permissions supplémentaires au niveau du projet et des modèles. Chaque membre de l'équipe possède toujours exactement un rôle intégré.

### 7. Le RBAC étendu est-il disponible dans l'édition communautaire ? {#7-is-extended-rbac-available-in-the-community-edition}
Non. Le RBAC étendu nécessite un abonnement **Semaphore Enterprise**.

