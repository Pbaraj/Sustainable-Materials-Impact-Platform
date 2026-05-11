# Sustainable Materials Impact Platform

A cloud-native full-stack sustainability dashboard for estimating and comparing the embodied carbon impact of construction materials.

This project combines civil engineering, sustainability assessment, and modern software engineering. It allows users to enter material quantities, calculate simplified CO₂e impact, save assessments in PostgreSQL, cache dashboard summaries with Redis, and run the full platform using Docker Compose or local Kubernetes.

> Note: The emission factors used in this project are generic demonstration values and are not official verified EPD or ÖKOBAUDAT values.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Axios, Recharts |
| Backend | Python, FastAPI, Pydantic |
| Database | PostgreSQL |
| Cache | Redis |
| Containerization | Docker, Docker Compose |
| Orchestration | Kubernetes |
| Infrastructure as Code | Terraform / OpenTofu structure |
| Version Control | Git, GitHub |

---

## Features

- Calculate embodied carbon for construction materials.
- Compare materials such as concrete, steel, timber, brick, glass, and insulation.
- Display total CO₂e, sustainability score, and impact level.
- Show material-wise impact using charts.
- Provide traceable calculation formulas.
- Save assessment history in PostgreSQL.
- Cache dashboard summary data using Redis.
- Run the full system using Docker Compose.
- Deploy the full system to local Kubernetes.
- Include Terraform/OpenTofu infrastructure structure for future Azure deployment.

---

## Architecture

```text
React + TypeScript Frontend
        ↓
FastAPI Backend API
        ↓
PostgreSQL Database
        ↓
Redis Cache
        ↓
Docker / Kubernetes
