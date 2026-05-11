# Terraform / OpenTofu Infrastructure

This folder contains the Infrastructure as Code setup for the Sustainable Materials Impact Platform.

The goal is to define Azure cloud infrastructure in a reproducible way using Terraform-compatible configuration.

## Planned Azure Infrastructure

- Azure Resource Group
- Azure Container Registry
- Azure Kubernetes Service
- Azure Database for PostgreSQL
- Azure Cache for Redis
- Managed Identity
- Kubernetes deployment configuration

## Current Scope

The current configuration defines:

- Resource group
- Azure Container Registry

More cloud resources will be added after the local Kubernetes deployment is stable and cost implications are reviewed.

## Important Cost Note

Do not run `terraform apply` unless you are ready to create Azure resources.

Some resources such as AKS, managed PostgreSQL, and Redis may consume Azure student credit.