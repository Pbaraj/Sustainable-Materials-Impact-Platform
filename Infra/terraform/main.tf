resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location

  tags = {
    project     = "Sustainable Materials Impact Platform"
    environment = var.environment
    managed_by  = "terraform"
  }
}

resource "azurerm_container_registry" "main" {
  name                = "${var.project_name}acr${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = false

  tags = {
    project     = "Sustainable Materials Impact Platform"
    environment = var.environment
    managed_by  = "terraform"
  }
}

# Planned next resources:
# - Azure Kubernetes Service
# - Azure Database for PostgreSQL Flexible Server
# - Azure Cache for Redis
# - Managed Identity
# - Kubernetes namespace and deployment configuration
#
# These are intentionally not created yet to avoid unnecessary Azure costs.