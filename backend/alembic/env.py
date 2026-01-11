import asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

from app.core.config import get_settings
from app.models import Base

settings = get_settings()
config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

db_url = settings.database_url
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
elif db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+asyncpg://", 1)

# Handle SSL for Azure PostgreSQL
# Check if SSL is required in the connection string
ssl_required = False
if "sslmode=require" in db_url or "ssl=require" in db_url:
    ssl_required = True

# Remove sslmode/ssl parameters from URL (asyncpg uses connect_args instead)
# Handle both query string formats: ?param and &param
import re
db_url = re.sub(r'[?&]sslmode=[^&]*(&|$)', lambda m: '?' if m.group(0)[0] == '?' and m.group(1) else m.group(1), db_url)
db_url = re.sub(r'[?&]ssl=[^&]*(&|$)', lambda m: '?' if m.group(0)[0] == '?' and m.group(1) else m.group(1), db_url)
# Clean up any trailing ? or &
db_url = db_url.rstrip('?&')

config.set_main_option("sqlalchemy.url", db_url)
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    # Prepare connect_args for SSL if required
    connect_args = {}
    if ssl_required:
        connect_args = {"ssl": "require"}
    
    configuration = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = db_url
    
    connectable = async_engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        connect_args=connect_args,
    )

    async def run_migrations() -> None:
        async with connectable.connect() as connection:
            await connection.run_sync(do_run_migrations)

    asyncio.run(run_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
