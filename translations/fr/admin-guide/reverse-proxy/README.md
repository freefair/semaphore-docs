# Reverse proxy

Un reverse proxy se place devant Semaphore et termine TLS : les navigateurs et les
runners lui parlent en HTTPS tandis que Semaphore lui-même écoute en HTTP simple sur
l'interface locale. Semaphore dispose aussi d'une
[prise en charge TLS intégrée](../../../../docs/admin-guide/security/network.md#tls), un proxy n'est
donc pas strictement nécessaire. Utilisez-en un si vous exploitez déjà un proxy, si
vous avez besoin d'un certificat géré ailleurs, si vous voulez servir Semaphore sur
un sous-chemin ou si vous servez plusieurs services depuis un même hôte.

<a id="what-every-configuration-must-handle"></a>

## Ce que toute configuration doit gérer

Quel que soit le proxy choisi, trois éléments doivent être corrects, sans quoi des
parties de l'interface cessent de fonctionner d'une manière difficile à
diagnostiquer :

- **La montée en WebSocket sur `/api/ws`.** Les journaux de tâche sont diffusés via
  un WebSocket. Sans les en-têtes de montée en version, la fenêtre des journaux reste
  vide pendant l'exécution de la tâche.
- **Un délai de lecture plus long que l'intervalle de ping.** Semaphore envoie un
  ping sur un WebSocket inactif environ toutes les deux minutes. Un proxy qui ferme
  les connexions inactives au bout de 60 secondes déconnecte la vue des journaux à
  répétition.
- **`web_host` défini sur l'URL publique.** Semaphore construit les URL de
  redirection, positionne l'attribut `Secure` du cookie et vérifie l'origine de la
  requête à partir de cette valeur. Si elle ne correspond pas à ce que le navigateur
  a utilisé, la connexion échoue. Voir
  [Configuration](../../../../docs/admin-guide/configuration.md).

<a id="in-this-section"></a>

## Dans cette section

| Page | Contenu |
|---|---|
| [nginx](../../../../docs/admin-guide/reverse-proxy/nginx.md) | Un bloc server avec TLS, la montée en WebSocket et les en-têtes transférés. |
| [Apache](../../../../docs/admin-guide/reverse-proxy/apache.md) | Un hôte virtuel utilisant `mod_proxy` et `mod_proxy_wstunnel`. |
| [Caddy](../../../../docs/admin-guide/reverse-proxy/caddy.md) | Un Caddyfile minimal avec certificats automatiques. |

<a id="where-to-start"></a>

## Par où commencer

Choisissez le proxy que vous exploitez déjà. Si vous n'avez ni préférence ni proxy
existant, [Caddy](../../../../docs/admin-guide/reverse-proxy/caddy.md) est le chemin le plus court : il
obtient et renouvelle les certificats tout seul.

Pour un durcissement au-delà de TLS, voir
[Sécurité réseau](../../../../docs/admin-guide/security/network.md).
