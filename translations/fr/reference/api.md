# API

<a id="api-reference"></a>

## Référence de l'API

Semaphore UI fournit deux formats de documentation de l'API, afin que vous puissiez choisir celui qui convient le mieux à votre flux de travail :

* [Swagger/OpenAPI](../../../docs/reference/api.md) &mdash; idéal si vous préférez une expérience interactive dans le navigateur.
* [Collection Postman officielle](https://www.postman.com/semaphoreui) &mdash; explorez et testez tous les points de terminaison dans Postman.
* **Documentation Swagger intégrée de l'API** &mdash; documentation interactive de l'API propulsée par Swagger UI. Vous pouvez y accéder depuis votre instance.

![](../../../static/assets/swagger-link.webp)

Toutes ces options incluent la documentation complète des points de terminaison disponibles, des paramètres et des exemples de réponses.

<a id="getting-started-with-the-api"></a>

## Premiers pas avec l'API

Pour commencer à utiliser l'API Semaphore, vous devez générer un jeton d'API.
Ce jeton doit être inclus dans l'en-tête de la requête sous la forme :

```http
Authorization: Bearer YOUR_API_TOKEN
```

<a id="creating-an-api-token"></a>

### Créer un jeton d'API

Il existe deux façons de créer un jeton d'API :
- Via l'interface web
- Avec une requête HTTP

<a id="through-the-web-interface-since-214"></a>

#### Via l'interface web (depuis la version 2.14)

Ouvrez le menu du compte en bas de la barre latérale et choisissez **Jetons d'API**. La page liste vos jetons ; le lien **Référence de l'API** qu'elle contient ouvre l'interface Swagger UI intégrée à votre instance.

![Jetons d'API](../../../static/assets/api-tokens.webp)

Cliquez sur **Nouveau jeton**, saisissez un nom, choisissez la date d'expiration du jeton, puis copiez la valeur affichée après la création. Voir [Votre compte](../../../docs/user-guide/account.md#api-tokens).

![Boîte de dialogue de nouveau jeton](../../../static/assets/api-token-new.webp)

<a id="using-http-request"></a>

#### Avec une requête HTTP

Vous pouvez également vous authentifier et générer un jeton de session à l'aide d'une requête HTTP directe.

Connectez-vous à Semaphore (le mot de passe doit être échappé, par exemple `slashy\\pass` au lieu de `slashy\pass`) :

```bash
curl -v -c /tmp/semaphore-cookie -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-d '{"auth": "YOUR_LOGIN", "password": "YOUR_PASSWORD"}' \
http://localhost:3000/api/auth/login
```

Générez un nouveau jeton et récupérez-le :

```bash
curl -v -b /tmp/semaphore-cookie -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
http://localhost:3000/api/user/tokens
```

La commande doit retourner quelque chose de similaire à :

```json
{
    "id": "YOUR_ACCESS_TOKEN",
    "created": "2025-05-21T02:35:12Z",
    "expired": false,
    "user_id": 3
}
```
---

<a id="using-token-to-make-api-requests"></a>

## Utiliser le jeton pour effectuer des requêtes à l'API

Une fois votre jeton d'API obtenu, incluez-le dans l'en-tête **Authorization** pour authentifier vos requêtes.

<a id="launch-a-task"></a>

### Lancer une tâche

Utilisez ce jeton pour lancer une tâche ou pour toute autre opération :

```bash
curl -v -XPOST \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
-d '{"template_id": 1}' \
http://localhost:3000/api/project/1/tasks
```

---

<a id="expiring-an-api-token"></a>

## Faire expirer un jeton d'API

Si vous n'avez plus besoin du jeton, vous devez le faire expirer afin de préserver la sécurité de votre compte.

Pour révoquer (faire expirer) manuellement un jeton d'API, envoyez une requête DELETE au point de terminaison du jeton :

```bash
curl -v -XDELETE \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
http://localhost:3000/api/user/tokens/YOUR_ACCESS_TOKEN
```
