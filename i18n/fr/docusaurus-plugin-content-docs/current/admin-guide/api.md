# API

## Référence de l'API {#api-reference}

Semaphore UI fournit deux formats de documentation d'API, afin que vous puissiez choisir celui qui correspond le mieux à votre façon de travailler :

* [Swagger/OpenAPI](https://semaphoreui.com/api-docs) &mdash; idéal si vous préférez une expérience interactive dans le navigateur.
* [Collection Postman officielle](https://www.postman.com/semaphoreui) &mdash; explorez et testez tous les points de terminaison dans Postman.
* **Documentation d'API Swagger intégrée** &mdash; documentation d'API interactive propulsée par Swagger UI. Vous pouvez y accéder sur votre instance.

![](/assets/swagger-link.webp)

Toutes les options incluent une documentation complète des points de terminaison disponibles, des paramètres et des exemples de réponses.

## Premiers pas avec l'API {#getting-started-with-the-api}

Pour commencer à utiliser l'API Semaphore, vous devez générer un token d'API.
Ce token doit être inclus dans l'en-tête de la requête sous la forme :

```http
Authorization: Bearer YOUR_API_TOKEN
```

### Création d'un token d'API {#creating-an-api-token}

Il existe deux façons de créer un token d'API :
- via l'interface web
- via une requête HTTP

#### Via l'interface web (depuis la version 2.14) {#through-the-web-interface-since-214}

Vous pouvez créer et gérer vos tokens d'API via l'interface web de Semaphore :

![Tokens d'API](https://www.semaphoreui.com/uploads/v2.14/tokens.webp)

#### Via une requête HTTP {#using-http-request}

Vous pouvez également vous authentifier et générer un token de session avec une requête HTTP directe.

Connectez-vous à Semaphore (le mot de passe doit être échappé, par exemple `slashy\\pass` au lieu de `slashy\pass`) :

```bash
curl -v -c /tmp/semaphore-cookie -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-d '{"auth": "YOUR_LOGIN", "password": "YOUR_PASSWORD"}' \
http://localhost:3000/api/auth/login
```

Générez un nouveau token et récupérez-le :

```bash
curl -v -b /tmp/semaphore-cookie -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
http://localhost:3000/api/user/tokens
```

La commande doit renvoyer quelque chose de similaire à :

```json
{
    "id": "YOUR_ACCESS_TOKEN",
    "created": "2025-05-21T02:35:12Z",
    "expired": false,
    "user_id": 3
}
```
---

## Utiliser le token pour effectuer des requêtes API {#using-token-to-make-api-requests}

Une fois votre token d'API obtenu, incluez-le dans l'en-tête **Authorization** pour authentifier vos requêtes.

### Lancer une tâche {#launch-a-task}

Utilisez ce token pour lancer une tâche ou toute autre opération :

```bash
curl -v -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
-d '{"template_id": 1}' \
http://localhost:3000/api/project/1/tasks
```

---

## Expirer un token d'API {#expiring-an-api-token}

Si vous n'avez plus besoin du token, vous devez le faire expirer pour garder votre compte sécurisé.

Pour révoquer (faire expirer) manuellement un token d'API, envoyez une requête DELETE au point de terminaison du token :

```bash
curl -v -XDELETE \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
http://localhost:3000/api/user/tokens/YOUR_ACCESS_TOKEN
```
