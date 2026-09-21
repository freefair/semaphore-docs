# Chaves de criptografia

O Semaphore criptografa os dados mais sensíveis que armazena — os **segredos das Chaves de Acesso**
(chaves privadas SSH, pares de login/senha, strings secretas) e a **chave de assinatura
JWT** — usando AES‑256‑GCM. Esta página explica como configurar essas chaves, como
funciona a rotação e como operá-la com segurança.

> **Duas chaves, dois propósitos**
>
>
> | Chave | Protege | Ponteiro ativo |
> |-----|----------|----------------|
> | **Chave de segredos** | Segredos das Chaves de Acesso armazenados no banco de dados | `active.secret_key` |
> | **Chave de opções** | Opções criptografadas do banco de dados (a chave de assinatura JWT) | `active.option_key` |
>
> Se nenhuma chave de opções estiver configurada, as opções usam a chave de segredos como alternativa.

---

<a id="quick-start"></a>

## Início rápido

A configuração mais simples é uma única chave fornecida na configuração principal:

```yaml title="config.yml"
encryption:
  keys_file: /etc/semaphore/encryption-keys.yml
```

```yaml title="/etc/semaphore/encryption-keys.yml"
keys:
  key1: { value: "REPLACE_WITH_openssl_rand_-base64_32" }
active:
  secret_key: key1
```

Gere uma chave com:

```bash
openssl rand -base64 32
```

É isso — o Semaphore agora criptografa os segredos com `key1`. A mesma chave é usada para
a chave de assinatura JWT (as opções usam a chave de segredos como alternativa).

> **Produção**
>
> Prefira **referências `file:`** ou um **`keys_folder`** (veja abaixo) em vez de
> `value:` inline, para que o material da chave fique em um secret montado e não na configuração.

---

<a id="how-keys-are-identified"></a>

## Como as chaves são identificadas

Cada chave possui um **id de chave** derivado do próprio material da chave — uma impressão digital,
`base64url(sha256(key))[:8]`. O id (não a chave) é armazenado junto com cada
valor criptografado, então a descriptografia é uma busca direta pela chave exata que o gravou.

Isso significa que:

- **Os rótulos podem ser renomeados livremente.** `key1`, `secrets_key_primary.txt` — eles existem
  para humanos. O banco de dados nunca os armazena, apenas a impressão digital.
- **Uma chave nunca pode apontar para o lugar errado.** Altere os bytes de uma chave e ela se torna um *novo*
  id; os dados antigos continuam referenciando o id antigo.
- **Remover uma chave falha de forma explícita**, não silenciosa — um id de chave ausente é um
  erro explícito, nunca uma saída inválida.

Você nunca define ids manualmente; o Semaphore os calcula.

---

<a id="the-keys-file"></a>

## O arquivo de chaves

`encryption.keys_file` aponta para um arquivo cujo conteúdo é um **registro de chaves**
mais **ponteiros** para a chave ativa de cada propósito. Ele é interpretado como **YAML ou JSON,
independentemente da extensão do arquivo**.

Há duas formas de fornecer o registro — um mapa inline, uma pasta de arquivos ou
ambos combinados.

<a id="inline-map"></a>

### Mapa inline

```yaml
keys:
  key1: { value: "2hmxtfgK6LkJfJK9ZNZ9GUMmEwTQwHIFamijclUem48=" }   # inline (dev)
  key2: { file: /run/secrets/secret_key }                         # from a file (prod)
active:
  secret_key: key1
  option_key: key2
```

Cada entrada é um [`KeySource`](#keysource): ou `value` (base64 inline) **ou**
`file` (caminho para um arquivo que contém a chave em base64) — nunca ambos.

<a id="folder-of-key-files"></a>

### Pasta de arquivos de chave

Aponte `keys_folder` para um diretório; **cada arquivo regular é uma chave**, rotulada pelo
seu nome de arquivo. Ideal para secrets montados do Docker/Kubernetes.

```yaml
keys_folder: /run/secrets/enc-keys
active:
  secret_key_file: secrets_key_primary.txt   # filename in keys_folder (relative)
  option_key_file: options_key_primary.txt
```

```text title="/run/secrets/enc-keys/"
secrets_key_primary.txt     # one base64 key per file
secrets_key_old.txt         # retired keys stay as files
options_key_primary.txt
```

> **Compatível com Kubernetes**
>
> `keys_folder` ignora entradas com prefixo de ponto (`..data`, `..2024_*`) e segue
> links simbólicos, portanto funciona diretamente com a forma como o Kubernetes monta volumes de
> `Secret`/`ConfigMap`.

<a id="combined"></a>

### Combinado

`keys` e `keys_folder` são mesclados em um único registro; `active` pode apontar por rótulo
*ou* por nome de arquivo:

```yaml
keys:
  inline1: { value: "..." }
keys_folder: /run/secrets/enc-keys
active:
  secret_key: inline1
  option_key_file: options_key_primary.txt
```

---

<a id="rotation-zero-downtime"></a>

## Rotação (sem tempo de inatividade)

A chave ativa criptografa as **novas** gravações; todas as outras chaves do registro ainda podem
**descriptografar** os dados antigos. A rotação, portanto, consiste em: adicionar uma chave, trocar o ponteiro,
recriptografar em segundo plano e, em seguida, remover a chave antiga.

```bash
# 1. Add a new key to the registry (a file in keys_folder, or a keys: entry)
#    and point the active pointer at it:
#      active.secret_key: key2        # (or secret_key_file: ...)

# 2. Apply it without a restart — within keys_poll_interval (default 15s),
#    or immediately:
kill -HUP $(pidof semaphore)

# 3. Re-encrypt existing data to the new key:
semaphore vault rekey --config /etc/semaphore/config.yml

# 4. Confirm nothing still uses the old key:
semaphore vault check --config /etc/semaphore/config.yml

# 5. When the old key shows "0 rows", remove it from the registry.
```

Nenhuma reinicialização do processo é necessária em nenhuma etapa.

<a id="applying-changes-without-a-restart"></a>

### Aplicando alterações sem reiniciar

O Semaphore relê o arquivo de chaves (e os arquivos de chave que ele referencia) e troca as
chaves em memória de forma atômica. Dois gatilhos:

| Gatilho | Comportamento |
|---------|-----------|
| **Monitor de arquivos** | Verifica a cada `encryption.keys_poll_interval` (padrão `15s`). Defina como `"0"` para desativar. |
| **`SIGHUP`** | `kill -HUP <pid>` força um recarregamento imediato (somente Unix). |

> **Windows**
>
> O Windows não possui `SIGHUP`. Use o **poller** (o padrão) — ele funciona em todas as
> plataformas — ou reinicie o serviço.

Um recarregamento valida primeiro as novas chaves e, em caso de qualquer erro, mantém as chaves em uso
intactas.

---

<a id="cli-commands"></a>

## Comandos da CLI

<a id="vault-check"></a>

### `vault check`

Somente leitura. Informa, por id de chave, quantos segredos armazenados ela criptografa, para que você possa
ver o que está na chave ativa e o que é seguro remover.

```bash
semaphore vault check --config /etc/semaphore/config.yml
```

```text
Access keys: 12 total
  IFTi6Ipik8Q: 12 rows — active
  rcGGC2AQfKo: 0 rows — retired, SAFE TO REMOVE
JWT signing key: active:IFTi6Ipik8Q
```

Status: `active`, `retired, rekey pending`, `retired, SAFE TO REMOVE`,
`legacy (no id)` e `MISSING KEY` (uma chave referenciada está ausente — código de saída 1).

<a id="vault-rekey"></a>

### `vault rekey`

Recriptografa todos os segredos armazenados (e a chave de assinatura JWT) com a chave ativa.

```bash
semaphore vault rekey --config /etc/semaphore/config.yml

# Snapshot ciphertexts before re-encrypting, and roll back if needed:
semaphore vault rekey --backup /var/backups/vault.jsonl --config ...
semaphore vault rekey --rollback /var/backups/vault.jsonl --config ...

# Legacy: decrypt pre-existing un-prefixed data with an explicit old key:
semaphore vault rekey --old-key <base64-old-key> --config ...
```

---

<a id="backward-compatibility"></a>

## Compatibilidade com versões anteriores

A atualização é segura e **não exige migração de dados**:

- Instalações existentes que definem **`access_key_encryption`** (ou a
  variável de ambiente `SEMAPHORE_ACCESS_KEY_ENCRYPTION`) continuam funcionando sem alterações — essa
  chave simples se torna a chave de segredos ativa.
- Dados gravados por versões antigas do Semaphore (sem id de chave) continuam sendo descriptografados. Na próxima gravação,
  ou após `vault rekey`, eles são marcados novamente com um id de chave.
- **Sem nenhuma criptografia** (nenhuma chave configurada), os segredos continuam sendo armazenados como
  base64 simples e descriptografados da mesma forma.

Para migrar uma instalação antiga de chave única para um arquivo de chaves, basta incluir a chave antiga
no registro:

```yaml
keys:
  old: { value: "<the old access_key_encryption value>" }
  new: { value: "<a freshly generated key>" }
active:
  secret_key: new
```

Os dados antigos são descriptografados via `old`; execute `vault rekey` para mover tudo para `new`.

---

<a id="kubernetes--docker"></a>

## Kubernetes e Docker

Monte suas chaves como um volume `Secret` e aponte `keys_folder` para ele:

```yaml title="Pod spec (excerpt)"
volumes:
  - name: enc-keys
    secret:
      secretName: semaphore-encryption-keys
containers:
  - name: semaphore
    volumeMounts:
      - name: enc-keys
        mountPath: /run/secrets/enc-keys
        readOnly: true
```

```yaml title="encryption-keys.yml"
keys_folder: /run/secrets/enc-keys
active:
  secret_key_file: secrets_key_primary.txt
  option_key_file: options_key_primary.txt
```

Quando você atualiza o `Secret`, o Kubernetes atualiza os arquivos montados e o
poller aplica a alteração dentro de `keys_poll_interval` — sem reiniciar o pod.

---

<a id="security-best-practices"></a>

## Boas práticas de segurança

> **Proteja o arquivo de chaves**
>
> - Restrinja as permissões: `chmod 0400`, com o usuário do serviço do Semaphore como dono.
> - **Nunca faça commit de chaves reais** no controle de versão — adicione o arquivo ao `.gitignore`.
> - Faça backup dele com segurança. **Perder todas as chaves significa perder todos os dados criptografados.**
> - Prefira secrets montados (`file:` / `keys_folder`) em vez de `value:` inline, e variáveis de ambiente
>   em vez de nenhum dos dois — `value:` mantém a chave no arquivo de configuração.

---

<a id="reference"></a>

## Referência

<a id="encryption-main-config"></a>

### `encryption` (configuração principal)

| Campo | Variável de ambiente | Padrão | Descrição |
|-------|-----|---------|-------------|
| `keys_file` | `SEMAPHORE_ENCRYPTION_KEYS_FILE` | — | Caminho para o arquivo de chaves (YAML/JSON). |
| `keys_poll_interval` | `SEMAPHORE_ENCRYPTION_KEYS_POLL_INTERVAL` | `15s` | Com que frequência o arquivo de chaves é verificado. `"0"` desativa a verificação. |

<a id="legacy-flat-keys-main-config"></a>

### Chaves simples legadas (configuração principal)

| Campo | Variável de ambiente | Descrição |
|-------|-----|-------------|
| `access_key_encryption` | `SEMAPHORE_ACCESS_KEY_ENCRYPTION` | Chave de segredos única, sem rotação. Usada quando `keys_file` não está definido. |
| `option_encryption` | `SEMAPHORE_OPTION_ENCRYPTION` | Chave de opções única, sem rotação. Usa a chave de segredos como alternativa. |

<a id="keys-file"></a>

### Arquivo de chaves

| Campo | Descrição |
|-------|-------------|
| `keys` | Mapa de `rótulo → KeySource` (registro inline). |
| `keys_folder` | Diretório de arquivos de chave (um arquivo regular por chave, rotulado pelo nome do arquivo). |
| `active.secret_key` | Rótulo (em `keys`) da chave de segredos ativa. |
| `active.option_key` | Rótulo da chave de opções ativa. |
| `active.secret_key_file` | Nome do arquivo em `keys_folder` da chave de segredos ativa (relativo). |
| `active.option_key_file` | Nome do arquivo em `keys_folder` da chave de opções ativa (relativo). |

<a id="keysource"></a>

### KeySource

| Campo | Descrição |
|-------|-------------|
| `value` | Material da chave em base64 inline. |
| `file` | Caminho para um arquivo que contém a chave em base64. |

`value` e `file` são mutuamente exclusivos. As chaves devem ser base64 de **16, 24 ou 32
bytes** (AES‑128/192/256).

---

<a id="troubleshooting"></a>

## Solução de problemas

| Sintoma | Causa / correção |
|---------|-------------|
| Panic na inicialização: `encryption_keys… not found` / `invalid` | O arquivo de chaves ou um arquivo de chave referenciado está ausente/malformado, ou uma chave não é base64 válido de 16/24/32 bytes. Corrija o arquivo; a inicialização falha rapidamente de propósito. |
| `vault check` mostra `MISSING KEY <id>` (saída 1) | Os dados foram criptografados com uma chave que não está mais no registro. Adicione essa chave de volta antes que eles possam ser descriptografados. |
| `cannot decrypt access key, perhaps encryption key was changed` | Um valor legado (sem prefixo) não pode ser descriptografado por nenhuma chave configurada. Certifique-se de que a chave original esteja presente (no registro ou em `access_key_encryption`). |
| Rotação não aplicada | Verifique `keys_poll_interval` (diferente de `"0"`) e se o arquivo de chaves realmente mudou; ou envie `SIGHUP`. |
| `active.secret_key: no key labelled "…"` | O ponteiro ativo nomeia um rótulo/nome de arquivo que não está em `keys`/`keys_folder`. |
