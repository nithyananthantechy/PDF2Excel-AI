# PDF2Excel AI AWS Deployment Guide & API Documentation

## Overview

PDF2Excel AI is a multi-tier SaaS application built using containerized FastAPI, React, and PostgreSQL. Follow this guide to build, secure, and deploy the entire solution on AWS.

---

## AWS Deployment Topology

1.  **React Frontend SPA**: Deployed to **Amazon CloudFront CDN** backed by static asset folders in **Amazon S3**.
2.  **FastAPI Backend Container**: Deployed to **AWS App Runner** or **AWS ECS Fargate** (scales dynamically).
3.  **Database Relational Instance**: Provisioned on **Amazon RDS PostgreSQL** (Multi-AZ for high durability).
4.  **Files Object Store**: Initialized via **Amazon S3** (stores uploaded scanned PDFs and generated Excel spreadsheets).
5.  **Secrets Configurations Manager**: Managed securely via **AWS Systems Manager (SSM) Parameter Store**.

---

## Part 1: Prerequisites & Infrastructure provision

### 1. Object Storage: S3 Bucket setup
Create an S3 bucket configured for secure object retention:
```bash
aws s3api create-bucket --bucket pdf2excel-storage-prod --region us-east-1
```
Apply policies blocks restricting public reads block unless via secure signed URLs.

### 2. Database Instance: Amazon RDS PostgreSQL
Provision a database cluster with encrypted connections:
```bash
aws rds create-db-instance \
    --db-instance-identifier pdf2excel-rds-prod \
    --db-instance-class db.t4g.medium \
    --engine postgres \
    --master-username superadmin \
    --master-user-password YOUR_SUPER_SECURE_PASSWORD_HERE \
    --allocated-storage 30 \
    --storage-encrypted
```

---

## Part 2: Backend Container Deployment

### 1. Build and push to AWS ECR
Create an AWS Elastic Container Registry (ECR) repository:
```bash
aws ecr create-repository --repository-name pdf2excel-backend --region us-east-1
```

Authenticate your local Docker engine and push details:
```bash
# Login
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_AWS_ACC_ID.dkr.ecr.us-east-1.amazonaws.com

# Build
docker build -t pdf2excel-backend ./backend_fastapi

# Tag
docker tag pdf2excel-backend:latest YOUR_AWS_ACC_ID.dkr.ecr.us-east-1.amazonaws.com/pdf2excel-backend:latest

# Push
docker push YOUR_AWS_ACC_ID.dkr.ecr.us-east-1.amazonaws.com/pdf2excel-backend:latest
```

### 2. AWS App Runner Instantiation
Define environment variable mappings in App Runner:
-   `DATABASE_URL`: `postgresql://superadmin:YOUR_PASSWORD@rds-endpoint:5432/pdf2excel`
-   `GEMINI_API_KEY`: Secrets ARN value
-   `JWT_SECRET_KEY`: Secrets ARN value
-   `AWS_S3_BUCKET_NAME`: `pdf2excel-storage-prod`

App Runner will deploy the container, manage health checks, and expose SSL ports.

---

## Part 3: API Reference Documentation

FastAPI automatically generates an interactive OpenAPI 3 swagger portal at `/docs`. Below is a quick-lookup checklist:

### 1. `POST /upload`
Registers and saves files to the S3 bucket queue.
-   **Content-Type**: `multipart/form-data`
-   **Payload**: `file: BinaryFile`
-   **Response**:
    ```json
    {
      "job_id": 18491,
      "file_name": "logistics_invoice.pdf",
      "status": "pending"
    }
    ```

### 2. `POST /process/{job_id}`
Triggers high-throughput Gemini Vision extraction, logical validation analysis ratios check, and openpyxl formatting saves.
-   **Response**:
    ```json
    {
      "status": "completed",
      "result_id": 9214
    }
    ```

### 3. `GET /jobs`
Returns list of jobs corresponding back with caller permissions.
-   **Response**:
    ```json
    [
      {
        "id": 18491,
        "file_name": "logistics_invoice.pdf",
        "status": "completed",
        "created_at": "2026-06-01T04:30:00"
      }
    ]
    ```

---

## Part 4: Production Checklist
- [ ] Enable Rate Limiting (FastAPI-Limiter Redis implementation).
- [ ] Setup GuardDuty for scanning nested S3 artifacts.
- [ ] Pin Gemini model version identifiers to prevent automated schema deprecation drifts.
