#!/bin/bash
# Azure App Service startup script for HR Portal
# CRITICAL: This script MUST end with 'exec' to keep the process running

echo "=== HR Portal Azure Startup ==="
echo "Timestamp: $(date)"
echo "PORT from Azure: ${PORT}"
echo "Working directory: $(pwd)"

# Navigate to the app directory
cd /home/site/wwwroot || { echo "ERROR: Cannot cd to /home/site/wwwroot"; exit 1; }
echo "Changed to: $(pwd)"
echo "Directory contents:"
ls -la

# Setup Python virtual environment
echo ""
echo "=== Setting up Python environment ==="

# Use system Python to create venv if needed
if [ ! -d "antenv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv antenv || python -m venv antenv
fi

# Activate virtual environment
source antenv/bin/activate
echo "Python path: $(which python)"
echo "Python version: $(python --version)"

# Install dependencies (REQUIRED since Oryx build is disabled)
echo ""
echo "=== Installing dependencies ==="
pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet
echo "Dependencies installed"

# Run database migrations (non-fatal - app can still start)
echo ""
echo "=== Running database migrations ==="
python -m alembic upgrade head || echo "WARNING: Alembic migrations skipped"

# Verify the app module can be imported
echo ""
echo "=== Verifying app module ==="
python -c "from app.main import app; print('App module imported successfully')" || {
    echo "ERROR: Cannot import app.main - check for syntax errors"
    exit 1
}

# CRITICAL: Start the application with exec
# - exec replaces this shell process with uvicorn (required for Azure)
# - 0.0.0.0 allows external connections
# - ${PORT} is assigned by Azure (usually 8000)
echo ""
echo "=== Starting FastAPI application ==="
echo "Binding to 0.0.0.0:${PORT}"
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT}"
