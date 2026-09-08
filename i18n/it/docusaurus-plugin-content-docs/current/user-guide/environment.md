# Gruppi di variabili

La sezione Gruppi di variabili di Semaphore è il luogo in cui archiviare variabili aggiuntive per un inventory; devono essere memorizzate in formato JSON.

Tutti i modelli di task richiedono che sia definito un gruppo di variabili, anche se vuoto. 

## Creare un gruppo di variabili {#create-a-variable-group}
1. Fare clic sulla scheda Gruppi di variabili.
2. Fare clic sul pulsante Nuovo gruppo di variabili.
3. Assegnare un nome al gruppo di variabili e digitare o incollare variabili JSON valide. Se serve solo un gruppo di variabili vuoto, digitare ```{}```.

## Aggiornare un gruppo di variabili {#updating-a-variable-group}
1. Fare clic sulla scheda Gruppi di variabili.
2. Fare clic sull'icona a forma di matita.
3. Apportare le modifiche e fare clic su Salva.

## Eliminare un gruppo di variabili {#deleting-the-variable-group}
Prima di rimuovere un gruppo di variabili, è necessario rimuovere tutte le risorse ad esso collegate.
Se non si è sicuri di quali risorse utilizzino un gruppo di variabili, seguire i passaggi 1 e 2 riportati di seguito. Verranno mostrate le risorse in uso, con i collegamenti a tali risorse.

1. Fare clic sul gruppo di variabili.
2. Fare clic sull'icona del cestino accanto al gruppo di variabili.
3. Fare clic su Sì se si è sicuri di voler rimuovere il gruppo di variabili.

## Utilizzo dei gruppi di variabili - Terraform/OpenTofu {#using-variable-groups---terraformopentofu}
Quando si desidera utilizzare una variabile o un segreto di un gruppo di variabili nel modello Terraform, è necessario aggiungere al nome il prefisso `TF_VAR_` affinché lo script Terraform possa utilizzarlo. 

**Esempio**
Passaggio della chiave API di Hetzner Cloud a un playbook OpenTofu/Terraform. 

1. Fare clic su Gruppi di variabili
2. Fare clic su `New Group`
3. Fare clic sulla scheda `Secrets`
4. Aggiungere `TF_VAR_hcloud_token` e inserire il proprio `secret` nel campo nascosto
5. Fare clic su Salva

Il segreto `TF_VAR_hcloud_token` verrà richiamato come `var.hcloud_token` in 
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
