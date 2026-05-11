variable "resource_group_name" {
  description = "Name of the Azure resource group."
  type        = string
  default     = "rg-sustainable-materials-platform"
}

variable "location" {
  description = "Azure region for all resources."
  type        = string
  default     = "germanywestcentral"
}

variable "project_name" {
  description = "Project name used for resource naming."
  type        = string
  default     = "materialimpact"
}

variable "environment" {
  description = "Deployment environment."
  type        = string
  default     = "dev"
}