# Secure Renewals Portal

## Overview

Secure Renewals is an internal application for managing employee contract renewals and onboarding checks. The system follows a decoupled architecture with a FastAPI backend providing REST APIs and a Vite/React frontend consuming those APIs. The application implements role-based access control through HTTP headers (admin, hr, viewer) to restrict operations based on user permissions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture (FastAPI + Python)

**Framework & Structure:**
- FastAPI with async/await patterns throughout
- Layered architecture: Routers → Services → Repositories → Models
- Pydantic for request/response validation and settings management
- SQLAlchemy ORM with async support via asyncpg driver

**Key Design Decisions:**

1. **Repository Pattern**: Data access is abstracted through repository classes (`RenewalRepository`, `RenewalAuditLogRepository`), separating database operations from business logic. This allows easier testing and potential database swaps.

2. **Service Layer**: Business logic lives in service classes that orchestrate repositories and handle domain rules (e.g., auto-approving admin-created renewals).

3. **Role-Based Security**: Uses custom header-based authentication (`X-Role` header) with a dependency injection pattern. Roles are validated via `require_role()` dependency. Note: This is a simplified auth mechanism suitable for internal tools behind proper authentication proxies.

4. **Audit Logging**: All renewal actions are logged to a separate `renewal_audit_log` table with JSON snapshots for compliance tracking.

5. **Input Sanitization**: Basic HTML escaping applied to text inputs to prevent XSS vectors.

### Frontend Architecture (React + TypeScript + Vite)

**Framework & Structure:**
- Vite for fast development builds
- React 18 with TypeScript for type safety
- TailwindCSS for styling
- Typed API service layer matching backend schemas

**Key Design Decisions:**

1. **Typed API Layer**: The `services/api.ts` module provides typed functions that match backend endpoints, ensuring frontend-backend contract alignment.

2. **Environment Configuration**: API base URL configured via `VITE_API_BASE_URL` environment variable for deployment flexibility.

3. **Role Selection**: Frontend allows role switching for demo/testing purposes, passed via headers on each API call.

### Database Design (PostgreSQL)

**Tables:**
- `renewals`: Core renewal requests with employee info, contract dates, status, and timestamps
- `renewal_audit_log`: Immutable audit trail with JSON snapshots of renewal state at each action

**Migration Strategy**: Alembic manages schema migrations with async engine support.

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, accessed via asyncpg driver
- Connection string format: `postgresql+asyncpg://user:pass@host:port/dbname`

### Python Dependencies (Backend)
- **FastAPI**: Web framework
- **Uvicorn**: ASGI server
- **SQLAlchemy**: ORM with async support
- **Alembic**: Database migrations
- **Pydantic**: Data validation and settings
- **asyncpg**: PostgreSQL async driver

### JavaScript Dependencies (Frontend)
- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **TypeScript**: Type checking

### Environment Variables

**Backend (.env):**
- `DATABASE_URL`: PostgreSQL connection string (required)
- `ALLOWED_ORIGINS`: Comma-separated list of CORS origins
- `APP_ENV`: Runtime environment (development/production)
- `LOG_LEVEL`: Logging verbosity

**Frontend (.env):**
- `VITE_API_BASE_URL`: Backend API base URL (defaults to http://localhost:8000/api)