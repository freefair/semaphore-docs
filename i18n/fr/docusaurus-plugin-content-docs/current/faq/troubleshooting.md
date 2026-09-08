# Dépannage

## 1. Le runner affiche l'erreur 404 {#1-runner-prints-error-404}

### Comment corriger {#how-to-fix}

[Getting 401 error code from Runner](https://github.com/semaphoreui/semaphore/discussions/1873?converting=1)

---

## 2. Problème de Gathering Facts pour localhost {#2-gathering-facts-issue-for-localhost}

Ce problème peut survenir sur une installation de Semaphore UI via [Snap](https://snapcraft.io/semaphore) ou [Docker](https://hub.docker.com/r/semaphoreui/semaphore).

```
4:10:16 PM
TASK [Gathering Facts] *********************************************************
4:10:17 PM
fatal: [localhost]: FAILED! => changed=false
```

### Pourquoi cela se produit {#why-this-happens}

Pour plus d'informations sur l'utilisation de localhost dans Ansible, lisez cet article : [Implicit 'localhost'](https://docs.ansible.com/ansible/latest/inventory/implicit_localhost.html).

Ansible tente de collecter les facts localement, mais Ansible se trouve dans un conteneur isolé aux droits limités qui ne le permet pas.

### Comment corriger {#how-to-fix-this}

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
## 3. panic: pq: SSL is not enabled on the server {#3-panic-pq-ssl-is-not-enabled-on-the-server}

Cela signifie que votre Postgres ne fonctionne pas en SSL.

### Comment corriger {#how-to-fix-this-1}

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


## 4. fatal: bad numeric config value '0' for 'GIT_TERMINAL_PROMPT': invalid unit {#4-fatal-bad-numeric-config-value-0-for-git_terminal_prompt-invalid-unit}

Cela signifie que vous essayez d'accéder via HTTPS à un dépôt qui nécessite une authentification.

### Comment corriger {#how-to-fix-this-2}

* Allez sur l'écran **Coffre de clés**.
* Créez une nouvelle clé de type `Login with password`.
* Indiquez votre identifiant pour GitHub/BitBucket/etc.
* Indiquez le mot de passe. Vous ne pouvez pas utiliser le mot de passe de votre compte GitHub/BitBucket ; vous devez utiliser un Personal Access Token (PAT) à la place. En savoir plus [ici](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).
* Après avoir créé la clé, allez sur l'écran **Dépôts**, trouvez votre dépôt et indiquez la clé.


---

## 5. Le clone ou le pull Git échoue de manière intermittente {#5-git-clone-or-pull-fails-intermittently}

Les journaux de tâche peuvent afficher des messages tels que `Git pull failed (...), retrying in 2s`, suivis soit d'un succès, soit d'un échec définitif après plusieurs tentatives.

### Pourquoi cela se produit {#why-this-happens-1}

Le serveur git était temporairement injoignable ou a renvoyé une erreur transitoire. Semaphore réessaie automatiquement les opérations de clone et de pull avant de faire échouer la tâche.

### Comment corriger {#how-to-fix-this-3}

1. **Interruptions transitoires** : elles se résolvent généralement d'elles-mêmes. Semaphore réessaie jusqu'à `git_attempts` fois (4 par défaut) avec un délai exponentiel.
2. **Échecs fréquents** : augmentez `git_attempts` dans votre configuration ou définissez `SEMAPHORE_GIT_ATTEMPTS`.
3. **Échecs immédiats et systématiques** : vérifiez l'URL du dépôt, la branche, les clés d'accès et la connectivité réseau.

Voir [Opérations Git](/admin-guide/configuration/config-file#git-operations) pour les détails de configuration.

---

## 6. unable to read LDAP response packet: unexpected EOF {#6-unable-to-read-ldap-response-packet-unexpected-eof}

Vous essayez très probablement de vous connecter au serveur LDAP avec une méthode non sécurisée, alors qu'il attend une connexion sécurisée (via TLS).

### Comment corriger {#how-to-fix-this-4}

Activez TLS dans votre fichier `config.json` :

```json
...
"ldap_needtls": true
...
```

---

## 7. LDAP Result Code 49 "Invalid Credentials" {#7-ldap-result-code-49-invalid-credentials}

Votre mot de passe ou votre `binddn` est incorrect.

### Comment corriger {#how-to-fix-this-5}

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

## 8. LDAP Result Code 32 "No Such Object" {#8-ldap-result-code-32-no-such-object}

Bientôt disponible.
