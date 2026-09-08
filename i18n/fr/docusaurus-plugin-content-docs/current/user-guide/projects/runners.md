
# Runners de projet (Pro)

Les runners de projet sont une fonctionnalité puissante de Semaphore Pro qui permet l'exécution distribuée des tâches sur plusieurs serveurs. Cette fonctionnalité vous permet d'exécuter des tâches sur des serveurs distincts de votre instance Semaphore UI, pour une sécurité, une évolutivité et une gestion des ressources améliorées.

![](/assets/project_runners.webp)

## Vue d'ensemble {#overview}

Les runners de projet fonctionnent sur un principe similaire à celui des runners GitLab ou GitHub Actions :

- Un runner est déployé sur un serveur distinct de votre Semaphore UI
- Le runner se connecte à votre instance Semaphore à l'aide d'un token sécurisé
- Lorsque des tâches sont créées, Semaphore les délègue aux runners disponibles
- Les runners exécutent les tâches et renvoient les résultats à Semaphore

## Avantages {#benefits}

L'utilisation de runners offre plusieurs avantages clés :

1. **Sécurité renforcée**
   - Les runners peuvent être déployés dans des environnements isolés ou des réseaux restreints
   - Les opérations sensibles peuvent être exécutées dans des environnements contrôlés
   - Meilleure séparation des responsabilités entre l'interface et les environnements d'exécution

2. **Évolutivité améliorée**
   - Répartissez la charge de travail sur plusieurs serveurs
   - Ajoutez ou retirez des runners selon la demande
   - Meilleure utilisation des ressources de votre infrastructure

3. **Déploiement flexible**
   - Déployez les runners au plus près de votre infrastructure cible
   - Exécutez des tâches dans différentes zones réseau
   - Prise en charge de divers modèles de déploiement (sur site, cloud, hybride)

## Utilisation des runners de projet {#using-project-runners}

### Prérequis {#prerequisites}

Pour utiliser des runners, vous avez besoin de :

1. Une licence Semaphore Pro
2. Un serveur distinct pour exécuter le runner
3. Une connectivité réseau entre le runner et Semaphore UI
4. Une configuration adéquate sur les serveurs Semaphore UI et runner

<!-- ### Configuration

1. **Semaphore UI Configuration**
  

2. **Runner Setup** -->


### Gestion des runners {#managing-runners}

Vous pouvez gérer les runners depuis Semaphore UI :

1. Accédez à la section Runners de votre projet
2. Consultez tous les runners enregistrés et leur statut
3. Ajoutez ou retirez des runners selon les besoins
4. Surveillez l'état de santé et les performances des runners

### Considérations de sécurité {#security-considerations}

- Utilisez toujours HTTPS pour la communication entre les runners et Semaphore UI
- Mettez en place une sécurité réseau appropriée entre les runners et Semaphore UI
- Envisagez d'utiliser des environnements isolés pour les opérations sensibles

## Bonnes pratiques {#best-practices}

1. **Planification des ressources**
   - Dimensionnez vos runners en fonction de votre charge de travail
   - Surveillez l'utilisation des ressources des runners
   - Faites évoluer le nombre de runners selon la demande

2. **Configuration réseau**
   - Assurez une connectivité réseau adéquate
   - Configurez les pare-feu de manière appropriée
   - Utilisez des canaux de communication sécurisés

3. **Maintenance**
   - Mettez régulièrement à jour le logiciel des runners
   - Surveillez l'état de santé des runners
   - Mettez en place une journalisation et une supervision appropriées
   - Prévoyez une stratégie de secours en cas de défaillance d'un runner

4. **Sécurité**
   - Appliquez le principe du moindre privilège
   - Mettez en place des contrôles d'accès appropriés
   - Réalisez des audits de sécurité réguliers
   - Maintenez les logiciels à jour
