
# Ansible

Avec Semaphore UI, vous pouvez exécuter des playbooks Ansible. Pour cela, vous devez créer un modèle **Playbook Ansible**.

1. Allez dans la section **Modèles de tâches**, cliquez sur **Nouveau modèle**, puis sur **Playbook Ansible**.

![](/assets/ansible_1.png)

2. Configurez le modèle.

Le modèle vous permet de spécifier les paramètres suivants :

* Dépôt
* Chemin vers le fichier de playbook
* Répertoire de travail (facultatif)
* Inventaire
* Groupes de variables
* Vaults
* Arguments CLI supplémentaires (tags, skip-tags, limit, verbosité)
* Variables d'environnement

![](/assets/ansible_2.png)

## Répertoire de travail {#working-directory}

Utilisez **Répertoire de travail** pour exécuter les commandes Ansible depuis un sous-répertoire du dépôt du modèle. Saisissez un chemin relatif à la racine du dépôt. Par exemple, si `ansible.cfg` est stocké dans `<repository>/automation`, saisissez `automation`. Les chemins absolus et les chemins en dehors du dépôt sont rejetés. S'il est omis, Semaphore utilise la racine du dépôt.

Le répertoire de travail affecte le comportement d'Ansible qui dépend du répertoire courant du processus. L'[ordre de recherche du fichier de configuration][ansible-config-search] d'Ansible inclut `ansible.cfg` dans le répertoire courant. Le répertoire de travail affecte également la résolution des chemins relatifs dans les arguments CLI supplémentaires ; par exemple [`--extra-vars @vars.yml`][ansible-extra-vars-file] et [`--private-key key.pem`][ansible-private-key]. Les chemins du playbook et de l'inventaire de type fichier restent relatifs à la racine de leur dépôt.

Modifier le répertoire de travail n'ajoute pas en soi le sous-répertoire `roles/` ou `collections/` de ce répertoire aux chemins de recherche d'Ansible. La [découverte des rôles relative au playbook][ansible-role-search] et les [collections adjacentes à un playbook][ansible-playbook-collections] restent basées sur l'emplacement du playbook. Le répertoire de travail peut néanmoins influencer indirectement leur découverte lorsque le fichier `ansible.cfg` sélectionné configure `roles_path` ou `collections_path`.

[ansible-config-search]: https://docs.ansible.com/ansible/latest/reference_appendices/config.html#the-configuration-file
[ansible-extra-vars-file]: https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_variables.html#vars-from-a-json-or-yaml-file
[ansible-private-key]: https://docs.ansible.com/ansible/latest/cli/ansible-playbook.html#cmdoption-ansible-playbook-private-key
[ansible-role-search]: https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_reuse_roles.html#storing-and-finding-roles
[ansible-playbook-collections]: https://docs.ansible.com/ansible/latest/collections_guide/collections_installing.html#installing-collections-adjacent-to-playbooks

## Types de modèles {#template-types}

Un modèle ansible-playbook peut être de l'un des types suivants :

* [Tâche](#task)
* [Build](#build)
* [Déploiement](#deploy)

### Tâche {#task}

Exécute simplement les playbooks spécifiés avec les paramètres spécifiés.

Si vous prévoyez de lancer le modèle via un appel API avec la fonctionnalité *limit*, veillez à activer l'option *Invites Ansible : Limit*. Sinon, la limite définie dans l'appel API sera ignorée. Pour une tâche déclenchée par l'API, cela ne provoquera aucune invite interactive ; la tâche s'exécutera sans intervention.

### Build {#build}

Ce type de modèle doit être utilisé pour créer des [artefacts](https://en.wikipedia.org/wiki/Artifact\_\(software\_development\)). La version de départ de l'artefact peut être spécifiée dans un paramètre du modèle. Chaque exécution incrémente la version de l'artefact.

![](/assets/template_new_build_ipad1.png)

Semaphore ne prend pas en charge les artefacts nativement ; il fournit uniquement le versionnage des tâches. Vous devez implémenter vous-même la création des artefacts. Lisez l'article [CI/CD](../../admin-guide/cicd) pour savoir comment procéder.

### Déploiement {#deploy}

Ce type de modèle doit être utilisé pour déployer des artefacts sur les serveurs de destination. Chaque modèle `deploy` est associé à un modèle `build`.


Cela vous permet de déployer une version spécifique de l'artefact sur les serveurs.

## Options du modèle {#template-options}

### Planification {#schedule}

Vous pouvez configurer la planification des tâches en spécifiant une expression cron dans les paramètres du modèle. Le format des expressions cron est décrit dans la [documentation](https://pkg.go.dev/github.com/robfig/cron/v3#hdr-CRON\_Expression\_Format).


#### Exécuter une tâche lorsqu'un nouveau commit est ajouté au dépôt {#run-a-task-when-a-new-commit-is-added-to-the-repository}

Vous pouvez utiliser cron pour vérifier périodiquement la présence de nouveaux commits dans le dépôt et déclencher une tâche à leur arrivée.

Par exemple, le code source de l'application se trouve dans le dépôt git. Vous pouvez l'ajouter aux **Dépôts** et déclencher la tâche de build pour les nouveaux commits.


### Tags, skip-tags et limit {#tags-skip-tags-and-limit}

Les modèles prennent en charge les options CLI d'Ansible :

- `--tags`
- `--skip-tags`
- `--limit`

Elles peuvent être définies dans le modèle et remplacées lors de la création d'une tâche. Assurez-vous que les invites correspondantes sont activées si vous prévoyez de transmettre ces valeurs via l'API.

### Parallélisme (`--forks` / `-f`) {#parallelism---forks---f}

Contrôlez le nombre d'hôtes auxquels Ansible se connecte en parallèle en passant `--forks` ou
`-f` dans les **Arguments CLI supplémentaires** du modèle. Les arguments doivent être du JSON valide —
utilisez un tableau de jetons séparés :

```json
["--forks", "10"]
```

La forme courte est également prise en charge :

```json
["-f", "10"]
```

Lorsque **Autoriser le remplacement des arguments dans la tâche** est activé sur le modèle, une tâche peut
fournir sa propre valeur de forks à l'exécution. Ansible reçoit à la fois les arguments du modèle et
ceux de la tâche ; le dernier `--forks` / `-f` sur la ligne de commande l'emporte.

Si les arguments ne sont pas du JSON valide, la tâche échoue avec une erreur de validation
descriptive avant le début de l'exécution.

### Authentification {#authentication}

L'authentification auprès des hôtes du playbook s'effectue à l'aide des références utilisateur du coffre de clés dans l'inventaire. L'utilisateur SSH est déterminé par l'utilisateur facultatif défini sur l'élément du coffre de clés.

### Mots de passe Vault multiples {#multiple-vault-passwords}

Vous pouvez attacher plusieurs mots de passe Vault provenant du coffre de clés à un modèle. Lors de l'exécution, Ansible tentera de déchiffrer avec les mots de passe fournis.

### Niveau de verbosité {#verbosity-level}

Vous pouvez ajuster la verbosité d'Ansible pour une tâche (par exemple `-v`, `-vvv`) depuis le formulaire du modèle/de la tâche afin de faciliter le dépannage.
