# Templates de Tarefa

Os templates definem como executar as tarefas do Semaphore. Atualmente, os seguintes tipos de tarefa são suportados:

* [Ansible](/user-guide/apps/ansible)
* [Terraform/OpenTofu](/user-guide/apps/terraform)
* [Shell](/user-guide/apps/bash)
* [Powershell](/user-guide/apps/powershell)
* [Python](/user-guide/apps/python)

---

## Tarefas paralelas {#parallel-tasks}

Por padrão, as tarefas do mesmo template são executadas sequencialmente. Para permitir execuções simultâneas do mesmo template, ative a opção "Allow parallel tasks" nas configurações do template.

## Imagem do executor (runners Docker e Kubernetes) {#executor-image-docker-and-kubernetes-runners}

Quando um runner de projeto usa o executor **Docker** (Pro) ou **Kubernetes** (Enterprise), cada tarefa normalmente é executada na imagem de job padrão configurada no runner (por exemplo, `semaphoreui/job:latest`). Você pode substituir essa imagem por template.

1. Abra as configurações do template
2. Defina **Executor image** com a referência da imagem do contêiner (por exemplo, `my-registry/ansible:2.16` ou `semaphoreui/job:latest`)
3. Salve o template

**Comportamento**:
- Apenas os executores de runner **Docker** e **Kubernetes** respeitam este campo; o executor local o ignora
- Deixe o campo vazio para usar a imagem padrão do runner definida em `runner.executor.docker.image` ou `runner.executor.k8s.image`
- Limpar o campo na interface remove a substituição

**Casos de uso**:
- Templates que precisam de um conjunto de ferramentas diferente (Ansible mais antigo, uma versão específica do Terraform, pacotes extras do SO incluídos em uma imagem personalizada)
- Imagens isoladas para templates sensíveis à segurança sem alterar o padrão global do runner

Consulte [Configuração do runner](/admin-guide/configuration) para as configurações de imagem padrão e [Runners do projeto](/user-guide/projects/runners) para a configuração do executor.
