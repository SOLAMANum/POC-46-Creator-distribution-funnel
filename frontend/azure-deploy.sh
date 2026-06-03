#!/bin/bash
# ============================================================
# Border Crossing Trade & Logistics — Azure Deployment Script
#
# Deploys TWO separate Container Apps:
#   1. creator-funnel-backend   → FastAPI on port 5000
#   2. creator-funnel-app       → Next.js on port 3000
#
# The backend is deployed first so its public URL can be passed
# as a build arg (NEXT_PUBLIC_API_URL) when building the frontend.
#
# Prerequisites:
#   - Azure CLI installed and logged in (az login)
#   - Docker installed and running
#   - Run from the project ROOT directory (not /frontend)
#
# Usage:
#   bash frontend/azure-deploy.sh
# ============================================================

set -e  # Exit immediately on any error

# ─── Configuration ────────────────────────────────────────────
RESOURCE_GROUP="creator-funnel-rg"
LOCATION="eastus"
ENVIRONMENT="creator-funnel-env"
BACKEND_APP_NAME="creator-funnel-backend"
FRONTEND_APP_NAME="creator-funnel-app"

echo ""
echo "======================================================"
echo "  Border Crossing Analytics — Azure Deploy"
echo "======================================================"
echo "  Resource Group : $RESOURCE_GROUP"
echo "  Location       : $LOCATION"
echo "  Environment    : $ENVIRONMENT"
echo "======================================================"
echo ""

# ─── Step 1: Create Resource Group ────────────────────────────
echo "[1/5] Creating resource group '$RESOURCE_GROUP' in '$LOCATION'..."
az group create \
  --name "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --output table

# ─── Step 2: Create Container Apps Environment ────────────────
echo ""
echo "[2/5] Creating Container Apps environment '$ENVIRONMENT'..."
az containerapp env create \
  --name "$ENVIRONMENT" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --output table

# ─── Step 3: Deploy Backend (FastAPI) ─────────────────────────
echo ""
echo "[3/5] Building and deploying BACKEND (FastAPI → port 5000)..."
az containerapp up \
  --name "$BACKEND_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --environment "$ENVIRONMENT" \
  --source ./backend \
  --dockerfile "backend/Dockerfile" \
  --ingress external \
  --target-port 5000 \
  --env-vars \
    "PORT=5000" \
    "PYTHONUNBUFFERED=1" \
  --output table

# Retrieve the backend's public URL
echo ""
echo "[4/5] Retrieving backend public URL..."
BACKEND_URL=$(az containerapp show \
  --name "$BACKEND_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query "properties.configuration.ingress.fqdn" \
  --output tsv)

BACKEND_API_URL="https://${BACKEND_URL}"
echo "      ✅ Backend live at: $BACKEND_API_URL"

# ─── Step 4: Deploy Frontend (Next.js) ────────────────────────
# NEXT_PUBLIC_API_URL must be passed at BUILD TIME so Next.js
# inlines it into the static JS bundle. We use the real Azure
# backend URL obtained above.
echo ""
echo "[5/5] Building and deploying FRONTEND (Next.js → port 3000)..."
echo "      Using NEXT_PUBLIC_API_URL=$BACKEND_API_URL"
az containerapp up \
  --name "$FRONTEND_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --environment "$ENVIRONMENT" \
  --source ./frontend \
  --dockerfile "frontend/Dockerfile" \
  --build-env-vars \
    "NEXT_PUBLIC_API_URL=$BACKEND_API_URL" \
    "NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=${NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN:-}" \
  --ingress external \
  --target-port 3000 \
  --env-vars \
    "NODE_ENV=production" \
    "PORT=3000" \
  --output table

# ─── Done ─────────────────────────────────────────────────────
FRONTEND_URL=$(az containerapp show \
  --name "$FRONTEND_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query "properties.configuration.ingress.fqdn" \
  --output tsv)

echo ""
echo "======================================================"
echo "  ✅ Deployment Complete!"
echo "======================================================"
echo ""
echo "  🌐 Frontend (Dashboard):"
echo "     https://${FRONTEND_URL}"
echo ""
echo "  ⚙️  Backend (API):"
echo "     $BACKEND_API_URL/api/data"
echo "     $BACKEND_API_URL/docs"
echo ""
echo "  ℹ️  If the frontend shows no data, ensure the backend"
echo "     Container App is running and publicly accessible."
echo "======================================================"
echo ""
