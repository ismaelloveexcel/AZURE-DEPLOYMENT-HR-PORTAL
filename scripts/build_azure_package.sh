#!/usr/bin/env bash
# Build a full Azure deployment package (backend + frontend + DB infra definitions)
# Usage: ./scripts/build_azure_package.sh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="${ROOT_DIR}/artifacts"
PACKAGE_DIR="${OUTPUT_DIR}/azure-deployment-package"
BACKEND_ZIP="${PACKAGE_DIR}/deploy.zip"

echo "📦 Preparing Azure deployment package..."
rm -rf "${PACKAGE_DIR}"
mkdir -p "${PACKAGE_DIR}"

echo "⚛️  Building frontend..."
pushd "${ROOT_DIR}/frontend" >/dev/null
npm install --silent
npm run build
popd >/dev/null

echo "🔄 Syncing frontend build into backend/static..."
if [ ! -d "${ROOT_DIR}/frontend/dist" ] || [ -z "$(ls -A "${ROOT_DIR}/frontend/dist")" ]; then
  echo "❌ Frontend build output not found in frontend/dist"
  exit 1
fi
rm -rf "${ROOT_DIR}/backend/static"
mkdir -p "${ROOT_DIR}/backend/static"
cp -r "${ROOT_DIR}/frontend/dist/"* "${ROOT_DIR}/backend/static/"

echo "🐍 Packaging backend (includes frontend assets)..."
pushd "${ROOT_DIR}/backend" >/dev/null
if [ ! -f "azure_startup.sh" ]; then
  echo "❌ backend/azure_startup.sh missing"
  exit 1
fi
chmod +x azure_startup.sh
zip -r "${BACKEND_ZIP}" . \
  -x "*.pyc" \
  -x "*__pycache__*" \
  -x "*.git*" \
  -x "*.env*" \
  -x "*.example" \
  -x "*.md" \
  -x "*test*.py" \
  -x "*.bak" \
  -x "*.tmp"
popd >/dev/null

echo "🗂️  Adding infrastructure (Bicep) definitions..."
mkdir -p "${PACKAGE_DIR}/infra"
if [ ! -f "${ROOT_DIR}/infra/main.bicep" ] || [ ! -f "${ROOT_DIR}/infra/resources.bicep" ]; then
  echo "❌ Missing infra/main.bicep or infra/resources.bicep"
  exit 1
fi
cp "${ROOT_DIR}/infra/main.bicep" "${ROOT_DIR}/infra/resources.bicep" "${PACKAGE_DIR}/infra/"
cp "${ROOT_DIR}/azure.yaml" "${PACKAGE_DIR}/"

cat > "${PACKAGE_DIR}/README.md" <<'EOF'
# Azure Deployment Package

Contents:
- deploy.zip — Backend + built frontend ready for Azure App Service zip deploy
- infra/ — Bicep templates for App Service, Static Web App, and PostgreSQL
- azure.yaml — Azure Developer CLI manifest referencing the Bicep templates

How to use:
1) Provision infra (resource group, App Service plan, Web App, PostgreSQL) with the Bicep templates:
   az deployment sub create --location <location> --template-file infra/main.bicep --parameters postgresAdminPassword=<password> authSecretKey=<secret> databaseUrl=<database-url>
2) Deploy the application:
   az webapp deploy --resource-group <rg> --name <app-service-name> --src-path deploy.zip --type zip --restart true
3) Ensure App Service settings include DATABASE_URL, AUTH_SECRET_KEY, ALLOWED_ORIGINS, SCM_DO_BUILD_DURING_DEPLOYMENT=false, ENABLE_ORYX_BUILD=false.
EOF

echo "🗜️  Creating top-level archive..."
pushd "${OUTPUT_DIR}" >/dev/null
zip -r "azure-deployment-package.zip" "$(basename "${PACKAGE_DIR}")" >/dev/null
popd >/dev/null

echo ""
echo "✅ Package ready:"
echo " - Directory: ${PACKAGE_DIR}"
echo " - Archive:   ${OUTPUT_DIR}/azure-deployment-package.zip"
echo ""
echo "Next steps:"
echo " 1) Deploy infra with infra/main.bicep"
echo " 2) Deploy ${BACKEND_ZIP} to your App Service (az webapp deploy --type zip)"
echo " 3) Set DATABASE_URL and AUTH_SECRET_KEY in App Service settings"
