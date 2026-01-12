#!/bin/bash
# Azure App Service startup script for HR Portal
set -e

echo "=== HR Portal Azure Startup ==="
cd /home/site/wwwroot/backend

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt --quiet

# Initialize database tables (create if not exist)
echo "Initializing database..."
python -c "
import asyncio
from app.database import engine
from app.models import Base

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print('Database tables created successfully')

asyncio.run(init_db())
" || echo "Database init skipped (may already exist)"

# Start the application
echo "Starting uvicorn server on port 8000..."
exec python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
