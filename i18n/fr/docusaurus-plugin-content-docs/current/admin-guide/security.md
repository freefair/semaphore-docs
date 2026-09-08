# 🔐 Sécurité

## Introduction {#introduction}

La sécurité est une priorité absolue dans Semaphore UI. Que vous automatisiez des tâches d'infrastructure critiques ou que vous gériez l'accès de votre équipe à des systèmes sensibles, Semaphore UI est conçu pour offrir un fonctionnement robuste et sécurisé dès l'installation. Cette section décrit la manière dont Semaphore gère la sécurité et les points à prendre en compte lors d'un déploiement en production.

## Authentification et autorisation {#authentication--authorization}

Semaphore prend en charge une authentification sécurisée et des mécanismes d'autorisation flexibles :

- **Méthodes de connexion :**
  - **Nom d'utilisateur/mot de passe**<br />Méthode par défaut utilisant les identifiants stockés dans la base de données de Semaphore. Les mots de passe sont hachés avec un algorithme robuste (bcrypt).

  - **LDAP**<br />Permet l'intégration avec les services d'annuaire d'entreprise. Prend en charge le filtrage des utilisateurs/groupes et les connexions sécurisées via LDAPS.

  - **OpenID Connect (OIDC)**<br />Permet l'authentification unique (SSO) avec des fournisseurs d'identité tels que Google, Azure AD ou Keycloak. Prend en charge les claims personnalisés et le mappage des groupes.

- **Authentification à deux facteurs (2FA)**<br />Une 2FA basée sur TOTP est disponible et recommandée pour tous les utilisateurs. Elle peut être activée par utilisateur et prend en charge des codes de récupération facultatifs. Voir les options de configuration `auth.totp.enabled` et `auth.totp.allow_recovery`.

- **Contrôle d'accès basé sur les rôles**<br />Vous pouvez attribuer différents rôles aux utilisateurs, tels que Admin, Maintainer ou Viewer, afin de limiter l'accès selon les responsabilités.

- **Gestion des sessions**<br />Les sessions sont protégées par des cookies HTTP sécurisés. Les mécanismes d'expiration de session et de déconnexion garantissent une exposition minimale.
<!-- - **Brute-Force Protection**: Login attempts are rate-limited to prevent brute-force attacks. -->

## Secrets et identifiants {#secrets--credentials}

La gestion sécurisée des secrets est une fonctionnalité essentielle :

- **Coffre de clés chiffré**<br />Les identifiants et les variables secrètes sont chiffrés au repos avec le chiffrement AES.

- **Isolation de l'environnement**<br />Les secrets ne sont transmis aux jobs qu'à l'exécution et ne sont pas exposés directement à l'environnement du conteneur.

- **Clés SSH et tokens**<br />Les utilisateurs sont responsables du téléversement de clés SSH et de tokens valides. Ceux-ci sont chiffrés et utilisés uniquement lors de l'exécution des tâches.
- **Intégration HashiCorp Vault (Pro)**<br />Les secrets peuvent être stockés dans une instance Vault externe. Choisissez le stockage pour chaque secret lors de sa création ou de sa modification.

## Chiffrement des données {#data-encryption}

Les données sensibles sont stockées dans la base de données sous forme chiffrée. Vous devez définir l'option de configuration `access_key_encryption` dans le fichier de configuration pour activer le chiffrement des clés d'accès. Elle doit être générée avec la commande :

```bash
head -c32 /dev/urandom | base64
```

## Exécution de code / playbooks non fiables {#running-untrusted-code--playbooks}

Semaphore exécute des playbooks et des commandes définis par les utilisateurs, ce qui peut présenter des risques :

- **Isolation par conteneur**<br />Les tâches sont exécutées dans des conteneurs Docker isolés. Ces conteneurs n'ont aucun accès au système hôte.

- **Moindre privilège**<br />Les conteneurs s'exécutent avec des permissions minimales et peuvent être restreints davantage à l'aide des options Docker.

- **Exécution en chroot**<br />Semaphore peut exécuter les tâches dans une prison chroot afin d'isoler davantage l'environnement d'exécution du système hôte.

- **Utilisateur du processus de tâche**<br />Les tâches peuvent être exécutées sous un utilisateur système dédié non root (par exemple `semaphore`) afin de réduire l'impact d'éventuelles failles. Cette option est facultative et peut être configurée selon les politiques du système.
<!-- - **Resource Limits**: To prevent abuse, CPU and memory limits can be applied. -->

## Déploiement sécurisé {#secure-deployment}

Pour garantir un déploiement sécurisé de Semaphore :

- **Utilisez HTTPS**<br />
    Semaphore prend en charge HTTPS à la fois via sa **prise en charge TLS intégrée** et via un **reverse proxy comme Nginx**. Il est fortement recommandé d'activer HTTPS en production.

    Pour activer la prise en charge HTTPS intégrée, ajoutez le bloc suivant dans **config.json** :
    ```json
    {
        ...
        "tls": {
            "enabled": true,
            "cert_file": "/path/to/cert/example.com.cert",
            "key_file": "/path/to/key/example.com.key"
        }
        ...
    }
    ```

- **Exécutez derrière un pare-feu**<br />Limitez l'accès à Semaphore UI et à la base de données aux seules adresses IP de confiance.

- **Sécurité de la base de données**<br />Utilisez des mots de passe robustes et restreignez l'accès à la base de données à Semaphore uniquement.

## Mises à jour et gestion des correctifs {#updates--patch-management}

Des mises à jour de sécurité sont publiées régulièrement :

- **Restez à jour**<br />Utilisez toujours la dernière version stable.

- **Journal des modifications**<br />Consultez les changements sur GitHub avant de mettre à jour.

- **Mises à jour automatiques**<br />Si vous utilisez Docker, envisagez des pipelines d'automatisation pour des mises à jour régulières.

<!-- ## Audit Logs & Monitoring

Semaphore provides basic audit logging:

- **User Activity**: Logins, failed attempts, and task executions are logged.
- **Configuration Changes**: Changes to settings, projects, and credentials are logged with timestamps.
- **Integration**: Logs can be forwarded to centralized logging systems like ELK or Prometheus exporters. -->

<!-- ## Backups & Disaster Recovery

To protect against data loss:

- **What to Back Up**: Semaphore database, configuration file, and secret storage.
- **How to Restore**: Follow the backup/restore guide in the admin docs.
- **Testing**: Periodically test restoring backups in a staging environment. -->

<!-- ## Common Vulnerabilities & Hardening Tips

- **Disable User Registration** if not needed to prevent unauthorized access.
- **Use Strong Passwords** and enforce complexity rules.
- **Limit Task Concurrency** to avoid resource exhaustion.
- **Restrict Access to Secrets** by managing team permissions carefully. -->

<!-- ## Compliance & Data Privacy

Semaphore collects minimal user data:

- **Data Handling**: Emails, IP logs, and session data are stored securely.
- **User Deletion**: Admins can delete user accounts and associated data upon request.
- **GDPR Compliance**: Self-hosted users are responsible for local compliance. -->

## Signalement des vulnérabilités {#reporting-vulnerabilities}

Vous avez trouvé une vulnérabilité ? Aidez-nous à garder Semaphore sécurisé :

- **Divulgation responsable**<br />Veuillez nous écrire à `security@semaphoreui.com`.
 
### Délais cibles de résolution des vulnérabilités {#vulnerability-resolution-targets}

Nous visons à corriger les vulnérabilités signalées dans les délais cibles suivants :

- Critique : sous 30 jours
- Élevée : sous 60 jours
- Moyenne : sous 90 jours
- Faible : au mieux, généralement sous 180 jours

Des correctifs hors cycle peuvent être publiés pour les problèmes activement exploités affectant les dernières versions stables.

### Outils de sécurité du code {#code-security-tooling}

Nous utilisons CodeQL, Codacy, Snyk et Renovate pour analyser le code source et les dépendances, ainsi que pour automatiser les mises à jour des dépendances.
- **Pas d'exploits publics**<br />Ne divulguez pas publiquement les vulnérabilités avant qu'elles ne soient corrigées.

- **Remerciements**<br />Les chercheurs en sécurité peuvent être remerciés dans les notes de version s'ils le souhaitent.
