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
if "?sslmode=" in db_url:
    db_url = db_url.split("?sslmode=")[0]
elif "&sslmode=" in db_url:
    db_url = db_url.replace("&sslmode=disable", "").replace("&sslmode=require", "")
if "?ssl=" in db_url:
    db_url = db_url.split("?ssl=")[0]
elif "&ssl=" in db_url:
    db_url = db_url.replace("&ssl=disable", "").replace("&ssl=require", "")

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
