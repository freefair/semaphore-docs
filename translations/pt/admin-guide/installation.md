# Instalação

Você pode instalar o Semaphore de várias maneiras, dependendo do seu sistema operacional, ambiente e preferências.

<a id="in-this-section"></a>

## Nesta seção

| Método | Quando usar |
|---|---|
| [Gerenciador de pacotes](../../../docs/admin-guide/installation/package-manager.md) | Você quer um pacote nativo para sua distribuição Linux. |
| [Docker](../../../docs/admin-guide/installation/docker.md) | Você quer executar o Semaphore em um contêiner com Docker ou Docker Compose. |
| [Nuvem](../../../docs/admin-guide/installation/cloud.md) | Você está implantando em uma plataforma de nuvem e precisa de orientações sobre serviços gerenciados e infraestrutura. |
| [Arquivo binário](../../../docs/admin-guide/installation/binary-file.md) | Você quer instalar um binário pré-compilado e gerenciar o processo por conta própria. |
| [Kubernetes (Helm chart)](../../../docs/admin-guide/installation/k8s.md) | Você já usa Kubernetes e quer gerenciar a implantação com Helm. |

<a id="installing-additional-python-packages"></a>

## Instalando pacotes Python adicionais

Alguns módulos e roles do Ansible precisam de pacotes Python adicionais para funcionar. Para instalar pacotes Python adicionais, crie um arquivo `requirements.txt` e monte-o no diretório `/etc/semaphore` do contêiner. Por exemplo, você pode adicionar as seguintes linhas ao seu arquivo `docker-compose.yml`:

```yaml
volumes:
  - /path/to/requirements.txt:/etc/semaphore/requirements.txt
```

Os pacotes especificados no arquivo de requirements serão instalados no ambiente virtual do Ansible incluído na imagem toda vez que o contêiner iniciar. A mesma montagem funciona para a imagem `semaphoreui/runner`. Consulte [Instalando dependências Python adicionais](../../../docs/admin-guide/installation/docker.md#installing-additional-python-dependencies) para mais detalhes e uma alternativa com imagem personalizada.

Para mais informações sobre arquivos de requirements do Python, consulte a [referência do formato de arquivo de requirements do Pip](https://pip.pypa.io/en/stable/reference/requirements-file-format/)

<a id="where-to-start"></a>

## Por onde começar

Comece pelo guia do seu ambiente de implantação. Para uma instalação binária, siga as instruções do serviço para manter o Semaphore em execução. Para configurar o usuário do serviço, as dependências Python e o systemd, use o guia de instalação manual.

* [Executar como serviço](../../../docs/admin-guide/installation/binary-file.md#run-as-a-service)
* [Instalação manual](../../../docs/admin-guide/installation_manually.md)
