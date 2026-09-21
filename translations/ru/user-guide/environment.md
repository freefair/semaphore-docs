# Группы переменных

![Список групп переменных](../../../static/assets/variable-groups-list.webp)

Раздел Variable Groups в Semaphore — это место для хранения дополнительных переменных для инвентаря; они должны храниться в формате JSON.

Всем шаблонам задач требуется заданная группа переменных, даже если она пустая.

<a id="create-a-variable-group"></a>

## Создание группы переменных

1. Откройте вкладку Variable Group.
2. Нажмите кнопку New Variable Group.
3. Задайте имя группы переменных и введите или вставьте корректные переменные в формате JSON. Если нужна пустая группа переменных, введите ```{}```.

<a id="updating-a-variable-group"></a>

## Изменение группы переменных

1. Откройте вкладку Variable Groups.
2. Нажмите значок карандаша.
3. Внесите изменения и нажмите save.

<a id="deleting-the-variable-group"></a>

## Удаление группы переменных

Прежде чем удалить группу переменных, необходимо удалить все связанные с ней ресурсы.
Если вы не уверены, какие ресурсы используют группу переменных, выполните шаги 1 и 2 ниже. Вам будет показано, какие ресурсы используются, со ссылками на них.

1. Откройте группу переменных.
2. Нажмите значок корзины рядом с группой переменных.
3. Нажмите Yes, если вы уверены, что хотите удалить группу переменных.

<a id="using-variable-groups---terraformopentofu"></a>

## Использование групп переменных — Terraform/OpenTofu

Чтобы использовать в шаблоне terraform сохранённую переменную или секрет из группы переменных, к имени необходимо добавить префикс `TF_VAR_` — только тогда скрипт terraform их увидит.

**Пример**
Передача ключа API Hetzner Cloud в playbook OpenTofu/Terraform.

1. Откройте Variable Group
2. Нажмите `New Group`
3. Перейдите на вкладку `Secrets`
4. Добавьте `TF_VAR_hcloud_token` и введите свой `secret` в скрытое поле
5. Нажмите Save

Наш секрет `TF_VAR_hcloud_token` будет доступен как `var.hcloud_token` в
hetzner.tf
```
terraform {
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.45"
    }
  }
}

# Declare the variable
variable "hcloud_token" {
  type        = string
  description = "Hetzner Cloud API token"
  sensitive   = true  # This prevents the token from being displayed in logs
}

provider "hcloud" {
  token = var.hcloud_token
}

# Create a new server running debian
resource "hcloud_server" "webserver" {
  name        = "webserver"
  image       = "ubuntu-24.04"
  server_type = "cpx11"
  location    = "ash"
  ssh_keys = [ "mysshkey" ]
  public_net {
    ipv4_enabled = true
    ipv6_enabled = true
  }
}
```
