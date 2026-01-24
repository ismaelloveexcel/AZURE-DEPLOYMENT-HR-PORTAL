#!/bin/bash
# Simple Azure App Service startup script for HR Portal

echo "=== HR Portal Azure Startup ==="
echo "Timestamp: $(date)"
echo "PORT: ${PORT}"
echo "PWD: $(pwd)"

# Navigate to app directory
cd /home/site/wwwroot || exit 1

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "Installing Python dependencies..."
    pip install -r requirements.txt --quiet || echo "Warning: pip install failed"
fi

# Start the FastAPI application directly
echo "Starting FastAPI application..."
exec python -m uvicorn app.main:app --host 0.0.0.0 --port "${PORT}"
