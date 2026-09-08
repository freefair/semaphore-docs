# Introduction

Bienvenue dans le guide d'administration de Semaphore UI. Ce guide fournit des informations complètes pour installer, configurer et maintenir votre instance Semaphore.

## Qu'est-ce que Semaphore UI ? {#what-is-semaphore-ui}

Semaphore UI est une interface web moderne et open source pour l'exécution de tâches d'automatisation. Elle est conçue comme une alternative légère, rapide et facile à utiliser aux plateformes d'automatisation plus complexes.

Elle vous permet de gérer et d'exécuter en toute sécurité des tâches pour :
*   Les playbooks **Ansible**
*   L'infrastructure as code **Terraform/OpenTofu**
*   Les scripts **PowerShell** et **Shell**
*   Les scripts **Python**

## Fonctionnalités principales et philosophie {#core-features--philosophy}

Comprendre les principes de conception de Semaphore peut vous aider à en tirer le meilleur parti :

*   **Léger et performant** : Semaphore est écrit en **Go** et distribué sous la forme d'un **fichier binaire unique**. Il a des besoins en ressources (CPU/RAM) minimes et ne nécessite aucune dépendance externe telle que Kubernetes, Docker ou une JVM. Il est ainsi rapide, efficace et facile à déployer.
*   **Simple à installer et à maintenir** : vous pouvez faire fonctionner Semaphore en quelques minutes. L'installation peut se résumer à télécharger le binaire et à l'exécuter. Son architecture simple rend les mises à niveau et la maintenance aisées.
*   **Déploiement flexible** : exécutez-le sous forme de binaire, de service systemd ou dans un conteneur Docker. Il convient à tous les usages, du homelab personnel aux environnements d'entreprise.
*   **Auto-hébergé et sécurisé** : Semaphore est une solution auto-hébergée. Toutes vos données, vos identifiants et vos journaux restent sur votre propre infrastructure, ce qui vous en donne le contrôle total. Les identifiants sont toujours chiffrés dans la base de données.
*   **Intégrations puissantes** : malgré sa simplicité, Semaphore prend en charge des fonctionnalités avancées telles que l'authentification LDAP/OpenID, un contrôle d'accès basé sur les rôles (RBAC) détaillé par projet, des runners distants pour faire évoluer l'exécution des tâches, et une API REST complète pour un accès programmatique.

Ce guide vous accompagne dans la mise en place et la gestion de ces fonctionnalités selon vos besoins spécifiques.
