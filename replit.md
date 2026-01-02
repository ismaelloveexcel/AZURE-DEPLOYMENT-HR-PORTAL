# Secure Renewals HR Portal

## Overview

An internal HR portal for managing employee contract renewals, onboarding passes, and employee records. The application serves non-technical HR users who need to track contract renewals, manage employee data, and generate access passes for recruitment and onboarding processes.

The system follows a standard full-stack architecture with a FastAPI backend and React frontend, designed for deployment on Replit with PostgreSQL database support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend (Python/FastAPI)

**Framework**: FastAPI with async support for high-performance API handling.

**Architecture Pattern**: Layered architecture with clear separation:
- **Routers** (`app/routers/`): Handle HTTP endpoints and request validation
- **Services** (`app/services/`): Business logic layer
- **Repositories** (`app/repositories/`): Database access layer
- **Schemas** (`app/schemas/`): Pydantic models for request/response validation

**Database**: PostgreSQL with async driver (asyncpg). Uses SQLAlchemy ORM with Alembic for migrations.

**Key Models**:
- `Employee`: User accounts with role-based access (admin, hr, viewer)
- `Renewal`: Contract renewal requests with approval workflow
- `Pass`: Recruitment/onboarding access passes
- `SystemSetting`: Feature toggles for admin configuration

**Authentication**: JWT-based authentication using employee ID and password. Initial password is DOB in DDMMYYYY format, requiring change on first login. Legacy Azure AD/SSO support exists but Employee ID + Password is the primary method.

**Security Features**:
- Role-based access control (admin, hr, viewer)
- Input sanitization via HTML escaping
- Rate limiting with slowapi
- CORS middleware configuration

### Frontend (React/TypeScript)

**Framework**: React 19 with TypeScript, built using Vite.

**Styling**: TailwindCSS v4 for utility-first CSS.

**Structure**: Single-page application with section-based navigation. Currently implements a dashboard home screen with placeholder sections for Employees, Onboarding, External Users, and Admin.

**API Communication**: Fetch-based API service layer (`src/services/api.ts`) with typed request/response handling.

### Database Schema

Four main tables with migrations managed by Alembic:
1. `employees` - User accounts and authentication
2. `renewals` - Contract renewal tracking with audit log
3. `passes` - Access pass management
4. `system_settings` - Feature toggles and configuration

### Development Setup

- Backend runs on port 5001 (uvicorn)
- Frontend runs on port 5000 (Vite dev server)
- Database migrations via `alembic upgrade head`

## External Dependencies

### Database
- **PostgreSQL**: Primary database with asyncpg driver for async operations
- Connection string configured via `DATABASE_URL` environment variable

### Python Packages (Backend)
- `fastapi`: Web framework
- `uvicorn`: ASGI server
- `sqlalchemy` + `asyncpg`: Async database ORM
- `alembic`: Database migrations
- `python-jose`: JWT token handling
- `pydantic-settings`: Configuration management
- `httpx`: HTTP client for external requests
- `slowapi`: Rate limiting

### JavaScript Packages (Frontend)
- `react` + `react-dom`: UI framework
- `vite`: Build tool and dev server
- `tailwindcss` + `postcss` + `autoprefixer`: Styling
- `typescript`: Type safety

### External Services
- No external third-party services currently integrated
- JWKS endpoint configured for potential Azure AD/SSO integration (currently using local JWT signing)

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `AUTH_SECRET_KEY`: JWT signing secret (defaults to dev key)
- `APP_ENV`: Runtime environment (development/production)