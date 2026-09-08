# Magasin de clés

Le magasin de clés de Semaphore sert à stocker les identifiants utilisés pour accéder aux dépôts distants, se connecter aux hôtes distants, élever les privilèges (sudo) et déverrouiller les vaults Ansible.

## Types {#types}

### 1. SSH {#1-ssh}
Les clés SSH servent à accéder aux serveurs distants ainsi qu'aux dépôts distants.

Si vous avez besoin d'aide pour générer rapidement une clé et la déployer sur votre hôte, [voici un guide rapide.](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-20-04)

Pour les dépôts Git utilisant l'authentification SSH, le dépôt Git que vous tentez de cloner doit être associé à la clé publique correspondant à votre clé privée.

Voici des liens vers la documentation de quelques hébergeurs Git courants :
* [GitHub](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
* [GitLab](https://docs.gitlab.com/ee/user/ssh.html)
* [Bitbucket](https://support.atlassian.com/bitbucket-cloud/docs/set-up-an-ssh-key/)

### 2. Connexion par mot de passe {#2-login-with-password}
La connexion par mot de passe est une combinaison nom d'utilisateur et mot de passe/token d'accès qui peut servir à :
* S'authentifier auprès des hôtes distants (bien que ce soit moins sûr que les clés SSH)
* Fournir les identifiants sudo sur les hôtes distants
* S'authentifier auprès des dépôts Git distants via HTTPS (bien que SSH soit plus sûr)
* Déverrouiller les vaults Ansible

:::tip
    Ce type de secret peut être utilisé comme Personal Access Token (PAT) ou comme simple chaîne secrète. Il suffit de laisser le champ Login vide.
:::

### 3. Aucun {#3-none}
Ce type sert de valeur de remplissage pour les dépôts qui ne nécessitent pas d'authentification, comme un dépôt open source sur GitLab.


## Stockages de secrets {#secret-storages}

Semaphore UI prend en charge différents stockages pour les secrets. Vous pouvez choisir le stockage pour chaque secret lors de sa création ou de sa modification.

### Base de données {#database}

Par défaut, les secrets sont stockés sous forme chiffrée dans la base de données. La clé de chiffrement est configurée via l'option de configuration
`access_key_encryption` ou `SEMAPHORE_ACCESS_KEY_ENCRYPTION` (elle doit être générée avec `head -c32 /dev/urandom | base64`).

### HashiCorp Vault {#hashicorp-vault}

Les secrets peuvent être stockés dans une instance HashiCorp Vault externe au lieu de la base de données.

[En savoir plus...](/user-guide/key-store/hashicorp-vault)

### OpenBao {#openbao}

Les secrets peuvent être stockés dans une instance [OpenBao](https://openbao.org) externe (un fork open source de HashiCorp Vault, compatible au niveau de l'API).

[En savoir plus...](/user-guide/key-store/openbao)

### AWS Secrets Manager {#aws-secrets-manager}

![Static Badge](https://img.shields.io/badge/enterprise-yellow)

Les secrets peuvent être stockés dans AWS Secrets Manager. Authentifiez-vous avec un rôle IAM / profil d'instance ou avec des clés d'accès statiques.

[En savoir plus...](/user-guide/key-store/aws-secrets-manager)

### Devolutions Server {#devolutions-server}

Les secrets peuvent être stockés dans une instance Devolutions Server externe au lieu de la base de données.

[En savoir plus...](/user-guide/key-store/devolutions-server)

## Synchronisation des secrets depuis des stockages distants {#syncing-secrets-from-remote-storages}

Semaphore peut importer automatiquement des secrets depuis un gestionnaire de secrets externe (HashiCorp Vault, OpenBao, AWS Secrets Manager, Azure Key Vault ou Devolutions Server) et les maintenir synchronisés. Les chemins de synchronisation vous permettent de choisir quels secrets importer et comment les nommer.

[En savoir plus...](/user-guide/key-store/secret-sync)
