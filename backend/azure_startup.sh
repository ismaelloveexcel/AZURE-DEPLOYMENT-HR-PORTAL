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

# Try to create venv in current directory first, fallback to /tmp
VENV_DIR="./antenv"
if [ ! -d "$VENV_DIR" ]; then
    echo "Creating virtual environment in $VENV_DIR..."
    if ! python3 -m venv "$VENV_DIR" 2>/dev/null && ! python -m venv "$VENV_DIR" 2>/dev/null; then
        echo "Failed to create venv in current directory, trying /tmp..."
        VENV_DIR="/tmp/antenv"
        python3 -m venv "$VENV_DIR" || python -m venv "$VENV_DIR"
    fi
fi

# Activate virtual environment
source "$VENV_DIR/bin/activate"
echo "Python path: $(which python)"
echo "Python version: $(python --version)"

# Install dependencies (REQUIRED since Oryx build is disabled)
echo ""
echo "=== Installing dependencies ==="
pip install --upgrade pip --quiet --timeout 60
pip install -r requirements.txt --quiet --timeout 300 || {
    echo "WARNING: pip install failed, trying with --no-cache-dir"
    pip install -r requirements.txt --no-cache-dir --timeout 300 || {
        echo "ERROR: Failed to install dependencies"
        exit 1
    }
}
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
