# Inventário

Um Inventário é um arquivo que contém uma lista de hosts nos quais o Ansible executará os plays.
Um Inventário também armazena variáveis que podem ser usadas pelos playbooks. Um Inventário pode ser armazenado em YAML, JSON ou TOML.
Mais informações sobre Inventários podem ser encontradas na [Documentação do Ansible.](https://docs.ansible.com/ansible/latest/inventory_guide/intro_inventory.html)

O Semaphore UI pode ler um Inventário de um arquivo no servidor ao qual o usuário do Semaphore tenha acesso de leitura, ou um Inventário estático que é editado pela interface web.
Cada Inventário também possui pelo menos uma credencial vinculada a ele.
A credencial de usuário é obrigatória e é o que o Ansible usa para fazer login nos hosts desse Inventário. As credenciais de sudo são usadas para elevar privilégios nesse host.
Para criar um Inventário, é necessário ter uma credencial de usuário que seja um nome de usuário com login ou um SSH configurado no Armazenamento de Chaves.
Informações sobre credenciais podem ser encontradas na seção [Armazenamento de Chaves](key-store) deste site.

## Criando um Inventário {#creating-an-inventory}
1. Clique na aba Armazenamento de Chaves e confirme que você possui uma chave do tipo login_password ou ssh
2. Clique na aba Inventário e clique em Novo Inventário
4. Dê um nome ao Inventário e selecione a credencial de usuário correta no menu suspenso. Selecione a credencial de sudo correta, se necessário
5. Selecione o tipo de Inventário
  * Se você selecionar arquivo, use o caminho absoluto do arquivo. Se esse arquivo estiver no seu repositório git, use o caminho relativo. Ex.: `inventory/linux-hosts.yaml`
  * Se você selecionar estático, cole ou digite seu Inventário no formulário
6. Clique em Criar.

## Atualizando um Inventário {#updating-an-inventory}
1. Clique na aba Inventário
2. Clique no ícone de lápis ao lado do Inventário que deseja editar
3. Faça suas alterações
4. Clique em Salvar

## Excluindo um Inventário {#deleting-an-inventory}
Antes de remover um Inventário, você deve remover todos os recursos vinculados a ele.
Se você não tem certeza de quais recursos estão sendo usados em um ambiente, siga os passos 1 e 2 abaixo. Eles mostrarão quais recursos estão sendo usados, com links para esses recursos.

1. Clique na aba Inventário
2. Clique no ícone de lixeira ao lado do Inventário
3. Clique em Sim se tiver certeza de que deseja remover o Inventário
