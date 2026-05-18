#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Configuration variables
RESOURCE_GROUP="creator-funnel-rg"
LOCATION="eastus"
ENVIRONMENT="creator-funnel-env"
APP_NAME="creator-funnel-app"

# 1. Create a Resource Group
echo "Creating resource group $RESOURCE_GROUP in $LOCATION..."
az group create --name "$RESOURCE_GROUP" --location "$LOCATION"

# 2. Deploy to Azure Container Apps
# This command automatically builds the Dockerfile in the current directory,
# creates an Azure Container Registry (ACR), pushes the image,
# and creates/updates the Container App.
echo "Building and deploying to Azure Container Apps..."
az containerapp up \
  --name "$APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --location "$LOCATION" \
  --environment "$ENVIRONMENT" \
  --source . \
  --ingress external \
  --target-port 3000

echo "Deployment complete!"
echo "Check the Azure Portal for your Container App's URL."
