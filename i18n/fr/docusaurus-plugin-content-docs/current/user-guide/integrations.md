# Intégrations

Les intégrations permettent d'établir une interaction entre Semaphore et des services externes, tels que GitHub et GitLab.

![](/assets/integrations_1.jpg)

Grâce à une intégration, vous pouvez déclencher un modèle donné en appelant un point de terminaison spécial (alias), pour lequel vous pouvez configurer l'une des méthodes d'authentification suivantes :
* Webhooks GitHub
* Token
* HMAC
* Aucune authentification

L'alias correspond à une URL au format suivant : `/api/integrations/<random_string>`. Les requêtes `GET` et `POST` sont prises en charge.

## Matchers {#matchers}

Les matchers vous permettent de définir des paramètres de la requête entrante. Lorsque ces paramètres correspondent, le modèle est invoqué.

## Extracteurs de valeurs {#value-extractors}

Un extracteur vous permet d'extraire les données nécessaires de la requête entrante et de les transmettre à la tâche sous forme de variables d'environnement. Pour que les variables extraites soient transmises à la
tâche, vous devez créer un environnement contenant les clés correspondantes. Assurez-vous que les clés de l'environnement correspondent aux variables définies dans l'extracteur : c'est ce qui permet à la tâche de recevoir
et d'utiliser les bonnes variables d'environnement.

## Paramètres de tâche {#task-parameters}

Les intégrations peuvent déclencher des tâches avec des paramètres. Utilisez les extracteurs de valeurs pour construire une charge utile JSON destinée aux paramètres de la tâche, et configurez le modèle pour qu'il accepte des valeurs demandées à l'exécution.

## Remarques sur les alias et les matchers {#notes-on-aliases-and-matchers}

Pour les intégrations configurées avec un point de terminaison alias, les matchers ne sont pas utilisés. Privilégiez l'authentification par token ou HMAC selon les besoins et transmettez les paramètres via les extracteurs.
