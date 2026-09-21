# Dépannage

<a id="runner-prints-error-404"></a>

## Le runner affiche l'erreur 404

<a id="how-to-fix"></a>

### Comment corriger

[Getting 401 error code from Runner](https://github.com/semaphoreui/semaphore/discussions/1873?converting=1)

---

<a id="gathering-facts-issue-for-localhost"></a>

## Problème de Gathering Facts pour localhost

Ce problème peut survenir sur une installation de Semaphore UI via [Snap](https://snapcraft.io/semaphore) ou [Docker](https://hub.docker.com/r/semaphoreui/semaphore).

```
4:10:16 PM
TASK [Gathering Facts] *********************************************************
4:10:17 PM
fatal: [localhost]: FAILED! => changed=false
```

<a id="why-this-happens"></a>

### Pourquoi cela se produit

Pour plus d'informations sur l'utilisation de localhost dans Ansible, lisez cet article : [Implicit 'localhost'](https://docs.ansible.com/ansible/latest/inventory/implicit_localhost.html).

Ansible tente de collecter les facts localement, mais Ansible se trouve dans un conteneur isolé aux droits limités qui ne le permet pas.

<a id="how-to-fix-this"></a>

### Comment corriger

Il existe deux méthodes :

1. Désactiver la collecte des facts :

```yaml
- hosts: localhost
  gather_facts: False
  roles:
    - ...
```

2. Définir explicitement le type de connexion sur **ssh** :
```
[localhost]
127.0.0.1 ansible_connection=ssh ansible_ssh_user=your_localhost_user
```
---
<a id="panic-pq-ssl-is-not-enabled-on-the-server"></a>

## panic: pq: SSL is not enabled on the server

Cela signifie que votre Postgres ne fonctionne pas en SSL.

<a id="how-to-fix-this-1"></a>

### Comment corriger

Ajoutez l'option `sslmode=disable` au fichier de configuration :

```json
	"postgres": {
		"host": "localhost",
		"user": "postgres",
		"pass": "pwd",
		"name": "semaphore",
		"options": {
			"sslmode": "disable"
		}
	},
```
---
<a id="fatal-bad-numeric-config-value-0-for-git_terminal_prompt-invalid-unit"></a>

## fatal: bad numeric config value '0' for 'GIT_TERMINAL_PROMPT': invalid unit

Cela signifie que vous essayez d'accéder via HTTPS à un dépôt qui nécessite une authentification.

<a id="how-to-fix-this-2"></a>

### Comment corriger

* Allez sur l'écran **Coffre de clés**.
* Créez une nouvelle clé de type `Login with password`.
* Indiquez votre identifiant pour GitHub/BitBucket/etc.
* Indiquez le mot de passe. Vous ne pouvez pas utiliser le mot de passe de votre compte GitHub/BitBucket ; vous devez utiliser un Personal Access Token (PAT) à la place. En savoir plus [ici](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).
* Après avoir créé la clé, allez sur l'écran **Dépôts**, trouvez votre dépôt et indiquez la clé.

---

<a id="git-clone-or-pull-fails-intermittently"></a>

## Le clone ou le pull Git échoue de manière intermittente

Les journaux de tâche peuvent afficher des messages tels que `Git pull failed (...), retrying in 2s`, suivis soit d'un succès, soit d'un échec définitif après plusieurs tentatives.

<a id="why-this-happens-1"></a>

### Pourquoi cela se produit

Le serveur git (GitHub, GitLab, Bitbucket ou une instance auto-hébergée) était temporairement injoignable, a renvoyé une erreur HTTP transitoire, ou le réseau entre Semaphore et le serveur a subi une brève interruption. Semaphore réessaie automatiquement les opérations de clone et de pull avant de faire échouer la tâche.

<a id="how-to-fix-this-3"></a>

### Comment corriger

1. **Interruptions transitoires** : elles se résolvent généralement d'elles-mêmes. Semaphore réessaie jusqu'à `git_attempts` fois (4 par défaut) avec un délai exponentiel entre les tentatives.
2. **Échecs fréquents** : augmentez le nombre de tentatives dans votre configuration :

```json
{
  "git_attempts": 8
}
```

Ou avec une variable d'environnement :

```bash
export SEMAPHORE_GIT_ATTEMPTS=8
```

3. **Échecs immédiats et systématiques** : les nouvelles tentatives n'aideront pas. Vérifiez l'URL du dépôt, le nom de la branche, les clés d'accès et la connectivité réseau depuis le serveur Semaphore ou l'hôte du runner.

Voir [Opérations Git](../../../docs/admin-guide/configuration/config-file.md#git-operations) pour plus de détails sur `git_client` et `git_attempts`.

---

<a id="bash-script-output-is-missing-or-incomplete"></a>

## La sortie d'un script Bash est absente ou incomplète

Une tâche Bash se termine avec succès, mais le journal affiche peu ou pas de sortie provenant de `echo`, `printf` ou d'autres commandes — en particulier lorsque le script se termine rapidement.

<a id="why-this-happens-2"></a>

### Pourquoi cela se produit

Semaphore capture stdout et stderr des commandes shell pendant leur exécution. Les scripts très courts peuvent se terminer avant que toute la sortie mise en tampon ne soit lue, de sorte que les dernières lignes peuvent être absentes du journal de la tâche.

<a id="how-to-fix-this-4"></a>

### Comment corriger

1. **Mettre à niveau** : les versions récentes de Semaphore vident la sortie du processus avant de marquer une tâche comme terminée. Mettez à jour le serveur et les runners si vous utilisez une version plus ancienne.
2. **Vider la sortie dans le script** lorsque vous avez besoin d'une remise garantie :

```bash
#!/bin/bash
echo "Starting deploy"
echo "Done" >&2
```

Pour les diagnostics critiques, écrivez dans un fichier à l'intérieur de l'espace de travail du dépôt et faites un `cat` de celui-ci à la fin du script.
3. **Éviter les sorties prématurées silencieuses** : utilisez `set -euo pipefail` et des messages d'erreur explicites afin que les échecs restent visibles même lorsque la sortie est brève.

---

<a id="unable-to-read-ldap-response-packet-unexpected-eof"></a>

## unable to read LDAP response packet: unexpected EOF

Vous essayez très probablement de vous connecter au serveur LDAP avec une méthode non sécurisée, alors qu'il attend une connexion sécurisée (via TLS).

<a id="how-to-fix-this-5"></a>

### Comment corriger

Activez TLS dans votre fichier `config.json` :

```json
...
"ldap_needtls": true
...
```

---

<a id="ldap-result-code-49-invalid-credentials"></a>

## LDAP Result Code 49 "Invalid Credentials"

Votre mot de passe ou votre `binddn` est incorrect.

<a id="how-to-fix-this-6"></a>

### Comment corriger

Utilisez l'outil `ldapwhoami` et vérifiez que votre binddn fonctionne :

```bash
ldapwhoami\
  -H ldap://ldap.com:389\
  -D "CN=/your/ldap_binddn/value/in/config/file"\
  -x\
  -W
```

Il vous demandera le mot de passe de manière interactive et devrait renvoyer le code **0** et afficher le **DN** tel que spécifié.

Vous pouvez également lire les articles suivants :
* [ldapsearch: Invalid credentials (49)](https://serverfault.com/q/771549/443463)
* [https://github.com/semaphoreui/semaphore/issues/906](https://github.com/semaphoreui/semaphore/issues/906)

---

<a id="ldap-result-code-32-no-such-object"></a>

## LDAP Result Code 32 "No Such Object"

L'annuaire ne contient aucune entrée au nom distinctif demandé par Semaphore. Il s'agit
presque toujours d'un `ldap_searchdn` incorrect, plus rarement d'un `ldap_binddn` incorrect.

<a id="how-to-fix-this-7"></a>

### Comment corriger

Vérifiez que la base de recherche existe, en utilisant les mêmes identifiants que Semaphore :

```bash
ldapsearch\
  -H ldap://ldap.example.com:389\
  -D "CN=/your/ldap_binddn/value/in/config/file"\
  -b "/your/ldap_searchdn/value/in/config/file"\
  -x\
  -W\
  -s base
```

- Le code de résultat **32** renvoyé par cette commande signifie que la base elle-même
  n'existe pas. Corrigez `ldap_searchdn` dans `config.json` ; la cause habituelle est une
  faute de frappe dans un composant, par exemple `OU=Users` au lieu du véritable `OU=People`.
- Le code de résultat **0** signifie que la base est correcte et que le problème vient de
  `ldap_searchfilter` : il ne correspond à aucune entrée sous cette base.

Consultez [LDAP et AD](../../../docs/admin-guide/authentication/ldap.md) pour la signification de chaque option.
