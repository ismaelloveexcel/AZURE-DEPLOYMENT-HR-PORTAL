#!/bin/bash
# ============================================
# HR Portal - Codespaces Setup Script
# ============================================
# This script runs automatically when a Codespace is created
# It installs all dependencies and configures the environment

set -e

echo ""
echo "============================================"
echo "   HR PORTAL - CODESPACES SETUP"
echo "============================================"
echo ""

# Install UV package manager
echo "[1/5] Installing UV package manager..."
pip install uv --quiet
echo "      ✓ UV installed"

# Install backend dependencies
echo "[2/5] Installing backend dependencies..."
cd /workspaces/*/backend 2>/dev/null || cd backend
uv sync --quiet
echo "      ✓ Backend dependencies installed"

# Configure backend environment
echo "[3/5] Configuring backend environment..."
if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
APP_NAME=Secure Renewals API
APP_ENV=development
API_PREFIX=/api
LOG_LEVEL=INFO
ALLOWED_ORIGINS=http://localhost:5000

# SQLite database (perfect for Codespaces - no setup needed)
DATABASE_URL=sqlite:///./hr_portal.db

# Authentication
AUTH_SECRET_KEY=codespaces-dev-secret-key-change-in-production
SESSION_TIMEOUT_HOURS=8
PASSWORD_MIN_LENGTH=8
DEV_AUTH_BYPASS=false
EOF
fi
echo "      ✓ Backend configured"

# Setup database
echo "[4/5] Setting up database..."
uv run alembic upgrade head 2>/dev/null || echo "      Note: Migrations will run on first start"
echo "      ✓ Database ready"

# Install frontend dependencies
echo "[5/5] Installing frontend dependencies..."
cd ../frontend 2>/dev/null || cd /workspaces/*/frontend
npm install --silent
echo "      ✓ Frontend dependencies installed"

echo ""
echo "============================================"
echo "   SETUP COMPLETE!"
echo "============================================"
echo ""
echo "   The application will start automatically."
echo ""
echo "   Access your private HR Portal at the URLs"
echo "   shown in the PORTS tab below."
echo ""
echo "============================================"
echo ""
