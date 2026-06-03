# ============================================================
# Border Crossing Trade & Logistics — Azure Deployment Script
# PowerShell Version
#
# Deploys TWO separate Container Apps:
#   1. creator-funnel-backend   -> FastAPI on port 5000
#   2. creator-funnel-app       -> Next.js on port 3000
#
# Prerequisites:
#   - Azure CLI installed and logged in (az login)
#   - Docker installed and running
#   - Run from the project ROOT directory:
#       cd "POC 46 Creator distribution funnel.1"
#       .\frontend\azure-deploy.ps1
# ============================================================

$ErrorActionPreference = "Stop"   # Exit on any error

# ─── Configuration ────────────────────────────────────────────
$RESOURCE_GROUP    = "creator-funnel-rg"
$LOCATION          = "eastus"
$ENVIRONMENT       = "creator-funnel-env"
$BACKEND_APP_NAME  = "creator-funnel-backend"
$FRONTEND_APP_NAME = "creator-funnel-app"

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  Border Crossing Analytics — Azure Deploy" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  Resource Group : $RESOURCE_GROUP"
Write-Host "  Location       : $LOCATION"
Write-Host "  Environment    : $ENVIRONMENT"
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# ─── Step 1: Create Resource Group ────────────────────────────
Write-Host "[1/5] Creating resource group '$RESOURCE_GROUP' in '$LOCATION'..." -ForegroundColor Yellow
az group create `
  --name $RESOURCE_GROUP `
  --location $LOCATION `
  --output table

# ─── Step 2: Create Container Apps Environment ────────────────
Write-Host ""
Write-Host "[2/5] Creating Container Apps environment '$ENVIRONMENT'..." -ForegroundColor Yellow
az containerapp env create `
  --name $ENVIRONMENT `
  --resource-group $RESOURCE_GROUP `
  --location $LOCATION `
  --output table

# ─── Step 3: Deploy Backend (FastAPI) ─────────────────────────
Write-Host ""
Write-Host "[3/5] Building and deploying BACKEND (FastAPI -> port 5000)..." -ForegroundColor Yellow
az containerapp up `
  --name $BACKEND_APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --location $LOCATION `
  --environment $ENVIRONMENT `
  --source . `
  --dockerfile "Dockerfile" `
  --build-env-vars "TARGET=backend-runner" `
  --ingress external `
  --target-port 5000 `
  --env-vars "PORT=5000" "PYTHONUNBUFFERED=1" `
  --output table

# ─── Step 4: Get Backend URL ───────────────────────────────────
Write-Host ""
Write-Host "[4/5] Retrieving backend public URL..." -ForegroundColor Yellow
$BACKEND_FQDN = az containerapp show `
  --name $BACKEND_APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --query "properties.configuration.ingress.fqdn" `
  --output tsv

$BACKEND_API_URL = "https://$BACKEND_FQDN"
Write-Host "      OK  Backend live at: $BACKEND_API_URL" -ForegroundColor Green

# ─── Step 5: Deploy Frontend (Next.js) ────────────────────────
# NEXT_PUBLIC_API_URL must be passed at BUILD TIME so Next.js
# inlines it into the static JS bundle.
Write-Host ""
Write-Host "[5/5] Building and deploying FRONTEND (Next.js -> port 3000)..." -ForegroundColor Yellow
Write-Host "      Using NEXT_PUBLIC_API_URL=$BACKEND_API_URL"
az containerapp up `
  --name $FRONTEND_APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --location $LOCATION `
  --environment $ENVIRONMENT `
  --source . `
  --dockerfile "Dockerfile" `
  --build-env-vars `
    "TARGET=frontend-runner" `
    "NEXT_PUBLIC_API_URL=$BACKEND_API_URL" `
  --ingress external `
  --target-port 3000 `
  --env-vars "NODE_ENV=production" "PORT=3000" `
  --output table

# ─── Done ─────────────────────────────────────────────────────
$FRONTEND_FQDN = az containerapp show `
  --name $FRONTEND_APP_NAME `
  --resource-group $RESOURCE_GROUP `
  --query "properties.configuration.ingress.fqdn" `
  --output tsv

Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host "  Deployment Complete!" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend (Dashboard):" -ForegroundColor Cyan
Write-Host "     https://$FRONTEND_FQDN" -ForegroundColor White
Write-Host ""
Write-Host "  Backend (API):" -ForegroundColor Cyan
Write-Host "     $BACKEND_API_URL/api/data" -ForegroundColor White
Write-Host "     $BACKEND_API_URL/docs" -ForegroundColor White
Write-Host ""
Write-Host "  If the frontend shows no data, ensure the backend"
Write-Host "  Container App is running and publicly accessible."
Write-Host "======================================================" -ForegroundColor Green
Write-Host ""
