from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import get_settings

settings = get_settings()

# Convert standard postgres URL to asyncpg format
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

# Create engine with SSL support if required
if ssl_required:
    engine = create_async_engine(
        db_url,
        echo=False,
        future=True,
        connect_args={"ssl": "require"}
    )
else:
    engine = create_async_engine(db_url, echo=False, future=True)

AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def get_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
