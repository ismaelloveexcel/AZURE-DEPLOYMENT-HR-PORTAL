#!/bin/bash
# Simple Azure App Service startup script for HR Portal

echo "=== HR Portal Azure Startup ==="
echo "Timestamp: $(date)"
echo "PORT: ${PORT}"
echo "PWD: $(pwd)"

# Navigate to app directory
cd /home/site/wwwroot || exit 1

# Start the FastAPI application directly
echo "Starting FastAPI application..."
exec python -m uvicorn app.main:app --host 0.0.0.0 --port "${PORT}"
