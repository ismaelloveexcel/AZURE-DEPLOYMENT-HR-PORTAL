from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import get_settings

settings = get_settings()

# Convert standard postgres URL to asyncpg format, or use SQLite for local development
db_url = settings.database_url

# Track database type for later configuration
is_sqlite = False

# Support SQLite for easy local development (no PostgreSQL required)
if db_url.startswith("sqlite://"):
    # Convert to async SQLite format
    db_url = db_url.replace("sqlite://", "sqlite+aiosqlite://", 1)
    is_sqlite = True
elif db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
elif db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+asyncpg://", 1)

# Remove sslmode parameter (not supported by asyncpg directly)
if "?sslmode=" in db_url:
    db_url = db_url.split("?sslmode=")[0]
elif "&sslmode=" in db_url:
    db_url = db_url.replace("&sslmode=disable", "").replace("&sslmode=require", "")

# Configure engine with appropriate settings
connect_args = {}
if is_sqlite:
    # SQLite-specific settings for async
    connect_args = {"check_same_thread": False}

engine = create_async_engine(db_url, echo=False, future=True, connect_args=connect_args)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def get_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
