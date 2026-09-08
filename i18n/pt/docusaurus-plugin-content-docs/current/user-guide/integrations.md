# Integrações

As integrações permitem estabelecer a interação entre o Semaphore e serviços externos, como GitHub e GitLab.

![](/assets/integrations_1.jpg)

Usando uma integração, você pode acionar um modelo específico chamando um endpoint especial (alias), para o qual você pode configurar um dos seguintes métodos de autenticação:
* Webhooks do GitHub
* Token
* HMAC
* Sem autenticação

O alias representa uma URL no seguinte formato: `/api/integrations/<random_string>`. Suporta requisições `GET` e `POST`.

## Matchers {#matchers}

Com os matchers, você pode definir parâmetros da requisição recebida. Quando esses parâmetros correspondem, o modelo será invocado.

## Extratores de Valor {#value-extractors}

Com um extrator, você pode extrair os dados necessários da requisição recebida e passá-los para a tarefa como variáveis de ambiente. Para que as variáveis extraídas sejam passadas para a
tarefa, você deve criar um ambiente com as chaves correspondentes. Certifique-se de que as chaves do ambiente correspondam às variáveis definidas no extrator, pois isso permite que a tarefa receba
e use as variáveis de ambiente corretas.

## Parâmetros da tarefa {#task-parameters}

As integrações podem acionar tarefas com parâmetros. Use extratores de valor para construir um payload JSON para os parâmetros da tarefa e configure o modelo para aceitar valores solicitados.

## Observações sobre aliases e matchers {#notes-on-aliases-and-matchers}

Para integrações configuradas com um endpoint de alias, os matchers não são usados. Prefira a autenticação por token/HMAC conforme necessário e passe os parâmetros por meio de extratores.
