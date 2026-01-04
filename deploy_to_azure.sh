#!/bin/bash
# Azure App Service Deployment Script
# =====================================
#
# DEPRECATED: This is a simplified legacy script.
# For full automated deployment with GitHub Actions, use the new setup script:
#
#   cd scripts
#   chmod +x azure-setup.sh
#   ./azure-setup.sh
#
# See docs/AZURE_DEPLOYMENT_GUIDE.md for complete documentation.
#
# This script uses Azure CLI. Run in Azure Cloud Shell (https://shell.azure.com)
# =====================================

set -e

# Configuration (edit these as needed)
RESOURCE_GROUP="${RESOURCE_GROUP:-secure-renewals-rg}"
APP_SERVICE_PLAN="${APP_SERVICE_PLAN:-secure-renewals-plan}"
WEBAPP_NAME="${WEBAPP_NAME:-secure-renewals-app}"
LOCATION="${LOCATION:-eastus}"
GITHUB_REPO="ismaelloveexcel/Secure-Renewals-2"
BRANCH="main"

echo "⚠️  NOTE: For automated CI/CD deployment, use scripts/azure-setup.sh instead"
echo "This script creates a basic single-app deployment."
echo ""

# 1. Create resource group
echo "Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION --output none

# 2. Create App Service plan
echo "Creating App Service plan..."
az appservice plan create \
  --name $APP_SERVICE_PLAN \
  --resource-group $RESOURCE_GROUP \
  --sku B1 \
  --is-linux \
  --output none

# 3. Create Web App (Python 3.11)
echo "Creating Web App..."
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --name $WEBAPP_NAME \
  --runtime "PYTHON|3.11" \
  --output none

# 4. Configure GitHub deployment
echo "Configuring GitHub deployment..."
az webapp deployment source config \
  --name $WEBAPP_NAME \
  --resource-group $RESOURCE_GROUP \
  --repo-url https://github.com/$GITHUB_REPO \
  --branch $BRANCH \
  --manual-integration \
  --output none

# 5. Set environment variables (edit/add as needed)
echo "Setting environment variables..."
echo "⚠️  You need to update DATABASE_URL and AUTH_SECRET_KEY manually!"
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $WEBAPP_NAME \
  --settings \
    DATABASE_URL="<your-db-url>" \
    AUTH_SECRET_KEY="<your-secret-key>" \
  --output none

# 6. Set startup command for FastAPI
echo "Setting startup command..."
az webapp config set \
  --resource-group $RESOURCE_GROUP \
  --name $WEBAPP_NAME \
  --startup-file "gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:8000" \
  --output none

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your app will be live at: https://$WEBAPP_NAME.azurewebsites.net"
echo ""
echo "Next steps:"
echo "1. Update DATABASE_URL and AUTH_SECRET_KEY in Azure Portal"
echo "2. SSH into the app and run migrations: alembic upgrade head"
echo ""
echo "For full automated deployment with CI/CD, see:"
echo "  - scripts/azure-setup.sh"
echo "  - docs/AZURE_DEPLOYMENT_GUIDE.md"
