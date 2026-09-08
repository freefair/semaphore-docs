# Группы переменных

Раздел «Группы переменных» в Semaphore — это место для хранения дополнительных переменных для инвентаря; они должны храниться в формате JSON.

Для всех шаблонов задач требуется указать группу переменных, даже если она пустая. 

## Создание группы переменных {#create-a-variable-group}
1. Откройте вкладку «Группы переменных».
2. Нажмите кнопку «Новая группа переменных».
3. Задайте имя группы переменных и введите или вставьте переменные в виде корректного JSON. Если вам нужна просто пустая группа переменных, введите ```{}```.

## Обновление группы переменных {#updating-a-variable-group}
1. Откройте вкладку «Группы переменных».
2. Нажмите значок карандаша.
3. Внесите изменения и нажмите «Сохранить».

## Удаление группы переменных {#deleting-the-variable-group}
Перед удалением группы переменных необходимо удалить все привязанные к ней ресурсы.
Если вы не уверены, какие ресурсы используют группу переменных, выполните шаги 1 и 2 ниже. Вы увидите список используемых ресурсов со ссылками на них.

1. Нажмите на группу переменных.
2. Нажмите значок корзины рядом с группой переменных.
3. Нажмите «Да», если вы уверены, что хотите удалить группу переменных.

## Использование групп переменных — Terraform/OpenTofu {#using-variable-groups---terraformopentofu}
Если вы хотите использовать переменную или секрет из сохранённой группы переменных в шаблоне Terraform, к имени нужно добавить префикс `TF_VAR_`, чтобы Terraform-скрипт мог его использовать. 

**Пример**
Передача API-ключа Hetzner Cloud в playbook OpenTofu/Terraform. 

1. Нажмите «Группы переменных»
2. Нажмите `New Group`
3. Откройте вкладку `Secrets`
4. Добавьте `TF_VAR_hcloud_token` и введите ваш `secret` в скрытое поле
5. Нажмите «Сохранить»

Мы будем обращаться к нашему секрету `TF_VAR_hcloud_token` как `var.hcloud_token` в 
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
