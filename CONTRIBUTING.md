# Contributing to Secure Renewals HR Portal

Thank you for your interest in contributing to the Secure Renewals HR Portal! This document provides guidelines and instructions for contributors, including best practices for working with GitHub Copilot.

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [GitHub Copilot Best Practices](#github-copilot-best-practices)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.11+** - Backend runtime
- **Node.js 20+** - Frontend development
- **PostgreSQL 16** - Database
- **uv** - Python package manager (recommended) or pip
- **Git** - Version control

### Quick Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL.git
   cd AZURE-DEPLOYMENT-HR-PORTAL
   ```

2. **Set up the backend:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your database credentials
   uv sync  # or: pip install -r requirements.txt
   uv run alembic upgrade head  # Run database migrations
   ```

3. **Set up the frontend:**
   ```bash
   cd frontend
   npm install
   echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env
   ```

4. **Start the development servers:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

---

## Development Setup

### Backend Setup (FastAPI)

The backend uses FastAPI with async PostgreSQL support. The architecture follows a layered pattern:

```
backend/
├── app/
│   ├── routers/       # API endpoints (HTTP handlers)
│   ├── services/      # Business logic
│   ├── repositories/  # Database access
│   ├── models/        # SQLAlchemy models
│   ├── schemas/       # Pydantic schemas
│   ├── auth/          # Authentication logic
│   └── core/          # Configuration and utilities
└── alembic/           # Database migrations
```

**Key Commands:**

```bash
# Install dependencies
uv sync

# Run backend server
uv run uvicorn app.main:app --reload --port 8000

# Create a new migration
uv run alembic revision --autogenerate -m "description"

# Apply migrations
uv run alembic upgrade head

# Check Python syntax
find app -name '*.py' -exec python -m py_compile {} +
```

### Frontend Setup (React + TypeScript)

The frontend is a React 19 single-page application built with Vite and TypeScript:

```
frontend/
├── src/
│   ├── components/    # Reusable React components
│   ├── services/      # API client and business logic
│   ├── types/         # TypeScript type definitions
│   └── App.tsx        # Main application component
├── public/            # Static assets
└── index.html         # HTML entry point
```

**Key Commands:**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint and type-check
npm run lint

# Preview production build
npm run preview
```

### Database Setup

The application uses PostgreSQL with async operations via asyncpg driver.

**Database Connection:**

Set the `DATABASE_URL` environment variable in `backend/.env`:

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/secure_renewals
```

**Initial Setup:**

```bash
# Create database
createdb secure_renewals

# Run migrations
cd backend
uv run alembic upgrade head
```

---

## GitHub Copilot Best Practices

This repository is optimized for GitHub Copilot and Copilot Agents, with an **automated review and maintenance system** for efficient, secure development.

### 1. Repository Context Files

We maintain these key context files for Copilot:

- **`README.md`** - Project overview and quick start
- **`CONTRIBUTING.md`** - This file - setup and guidelines
- **`docs/`** - Detailed documentation for specific topics
- **`.github/copilot-instructions.md`** - Copilot coding guidelines
- **`.github/PULL_REQUEST_TEMPLATE.md`** - Comprehensive PR template

**Best Practice:** Keep these files up-to-date as the codebase evolves.

### 2. Automated Review System

Every Pull Request automatically receives:

**✅ Code Quality Checks**:
- Backend linting and syntax validation
- Frontend TypeScript checking
- Security pattern detection (SQL injection, hardcoded secrets)
- Code style compliance

**✅ UAE Compliance Verification**:
- Detects changes to compliance features (visa, EID, contracts)
- Provides compliance-specific checklist
- Ensures labor law requirements maintained

**✅ Documentation Review**:
- Checks if code changes require doc updates
- Suggests relevant documentation to update
- Reminds about non-technical user guidance

**✅ PR Size Analysis**:
- Analyzes PR composition (code, docs, config)
- Categorizes PR size (small, medium, large, very large)
- Provides specific recommendations based on category
- More lenient for documentation-heavy PRs
- Acknowledges when large PRs are necessary

**See**: [PR Size Guidelines](#pr-size-guidelines) for detailed information about optimal PR sizing.

**See**: [Copilot Agent System Guide](docs/COPILOT_AGENT_SYSTEM_GUIDE.md) for detailed information about automated reviews.

### 3. Code Organization

Our codebase follows consistent patterns that help Copilot understand context:

**Backend Patterns:**
- Routers handle HTTP requests and validation
- Services contain business logic
- Repositories handle database operations
- Schemas define request/response models

**Frontend Patterns:**
- Components are functional with TypeScript types
- API calls go through `services/api.ts`
- Types are defined in `types/` directory

**Best Practice:** Follow existing patterns when adding new features.

### 4. Using GitHub Copilot Agents

We have specialized Copilot Agents for different tasks:

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| [HR Assistant](.github/agents/hr-assistant.md) | HR workflow planning | Feature planning, HR module ideas |
| [Portal Engineer](.github/agents/portal-engineer.md) | Technical implementation | Building features, fixing bugs |
| [Code Quality Monitor](.github/agents/code-quality-monitor.md) | Security and quality | Code reviews, security scans |

**How to Use Agents:**

1. Open the appropriate agent file (`.github/agents/*.md`)
2. Ask your question or describe the task
3. Follow the agent's recommendations

**Best Practice:** Use agents before starting major features to get architectural guidance.

### 5. Pull Request Process with Automation

**Creating a PR**:
1. Create a branch with descriptive name (e.g., `feature/visa-tracking-improvements`)
2. Make your changes following project conventions
3. Push to GitHub
4. Open PR using the template (auto-populated)
5. **Automated checks will run immediately**

**Understanding Automated Feedback**:

The PR quality check workflow will post comments with:
- 🐍 **Backend Quality Results**: Python syntax, security patterns
- ⚛️ **Frontend Quality Results**: TypeScript, console statements, API keys
- 🇦🇪 **UAE Compliance Impact**: If compliance features affected
- 📚 **Documentation Reminder**: If docs need updating
- 📏 **PR Size Warning**: If PR is too large

**Your Action**: Address any ❌ red flags before requesting review.

**Traffic Light System**:
- 🟢 **Green (all checks pass)**: Ready for human review
- 🟡 **Yellow (minor warnings)**: Address if reasonable
- 🔴 **Red (critical issues)**: Must fix before merging

### 6. Deployment Monitoring

After PR is merged and deployed, **automated health checks** run:

**What's Checked**:
- Backend health endpoint (HTTP 200 response)
- Frontend accessibility
- Basic smoke tests (API docs, OpenAPI schema)
- Response time performance

**You'll receive**:
- ✅ **Success notification**: If all checks pass
- ⚠️ **Manual verification request**: For database/data integrity
- 🚨 **Critical alert with issue**: If deployment failed

**For Non-Technical Contributors**:
The system explains issues in plain language and provides step-by-step guidance for common fixes.

**See**: [Post-Deployment Health Check Workflow](.github/workflows/post-deployment-health.yml)

### 7. Monthly Maintenance

The system performs **automated monthly maintenance** including:

**Dependency Audits**:
- Scans for security vulnerabilities
- Creates issues for critical updates
- Provides prioritized action list

**System Health**:
- Identifies stale branches for cleanup
- Checks documentation currency
- Generates maintenance summary

**You'll receive**:
- Monthly maintenance summary issue
- Specific action items (security updates, cleanup tasks)
- Priority guidance (critical, high, medium, low)

**Responding to Maintenance**:
- Review monthly summary issue
- Approve Dependabot PRs for security updates quickly
- Schedule time for non-critical updates
- Follow provided testing checklist

**See**: [Automated Maintenance Workflow](.github/workflows/automated-maintenance.yml)

### 8. Writing Copilot-Friendly Code

To help Copilot assist you effectively:

**✅ DO:**
- Write clear, descriptive comments for complex logic
- Use meaningful variable and function names
- Keep functions small and focused
- Add type annotations (Python type hints, TypeScript types)
- Document API endpoints with docstrings
- Include examples in docstrings

**❌ DON'T:**
- Use cryptic abbreviations
- Create overly complex nested logic
- Leave TODO comments without context
- Mix multiple concerns in one function

**Example - Good Python code for Copilot:**

```python
async def get_renewals_expiring_soon(
    days: int = 30,
    db: AsyncSession = Depends(get_db)
) -> List[Renewal]:
    """
    Retrieve contract renewals expiring within the specified number of days.
    
    Args:
        days: Number of days to look ahead (default: 30)
        db: Database session
        
    Returns:
        List of Renewal objects expiring soon
        
    Example:
        renewals = await get_renewals_expiring_soon(days=60)
    """
    threshold_date = datetime.now() + timedelta(days=days)
    return await renewal_repository.find_expiring_before(threshold_date, db)
```

### 5. Commit Messages and Documentation

Write commits and docs that Copilot can learn from:

**Commit Message Format:**
```
<type>: <short summary>

<detailed description if needed>

Examples: fix, feat, docs, refactor, test
```

**Good Examples:**
```
feat: Add CSV import for employee bulk upload
fix: Resolve SQL injection vulnerability in search endpoint
docs: Update API documentation with authentication flow
```

### 6. Project-Specific Conventions

**Authentication:**
- Users log in with Employee ID + password
- First-time login uses DOB (DDMMYYYY) as initial password
- JWT tokens for API authentication

**Database Conventions:**
- Use async SQLAlchemy operations
- Always use parameterized queries (never string concatenation)
- Keep repository layer separate from business logic

**API Conventions:**
- RESTful endpoints under `/api` prefix
- Use Pydantic schemas for validation
- Return appropriate HTTP status codes
- Include error messages in responses

**Frontend Conventions:**
- Functional components with TypeScript
- TailwindCSS for styling
- API calls through centralized service layer

**Security Conventions:**
- Never expose API keys in frontend code
- Sanitize all user inputs (HTML escape)
- Use environment variables for secrets
- Implement rate limiting on sensitive endpoints

### 7. Testing with Copilot

When writing tests, help Copilot by:

- Naming test files `test_*.py` or `*.test.ts`
- Using descriptive test names: `test_employee_login_with_valid_credentials`
- Including setup and teardown patterns
- Adding comments explaining test scenarios

**Note:** This repository currently has minimal test infrastructure. When adding tests, follow pytest (Python) or Vitest (JavaScript) conventions.

---

## Code Style Guidelines

### Python (Backend)

- **Style Guide:** Follow PEP 8
- **Formatting:** 4 spaces for indentation
- **Line Length:** Max 100 characters
- **Type Hints:** Use type hints for all function parameters and returns
- **Docstrings:** Use Google-style docstrings

```python
async def create_employee(
    employee_data: EmployeeCreate,
    db: AsyncSession
) -> Employee:
    """
    Create a new employee record.
    
    Args:
        employee_data: Employee data for creation
        db: Database session
        
    Returns:
        Created employee object
        
    Raises:
        ValueError: If employee ID already exists
    """
    # Implementation here
```

### TypeScript (Frontend)

- **Style Guide:** Follow standard TypeScript conventions
- **Formatting:** 2 spaces for indentation
- **Line Length:** Max 100 characters
- **Types:** Define explicit types for all props and state
- **Components:** Use functional components with hooks

```typescript
interface EmployeeCardProps {
  employee: Employee;
  onEdit?: (id: string) => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ 
  employee, 
  onEdit 
}) => {
  // Component implementation
};
```

### File Naming

- **Python:** `snake_case.py` (e.g., `employee_service.py`)
- **TypeScript:** `PascalCase.tsx` for components (e.g., `EmployeeCard.tsx`)
- **TypeScript:** `camelCase.ts` for utilities (e.g., `apiClient.ts`)

---

## Testing Guidelines

### Backend Testing (Python)

When adding tests, use pytest:

```python
# tests/test_employee_service.py
import pytest
from app.services.employee_service import EmployeeService

@pytest.mark.asyncio
async def test_create_employee_success(db_session):
    """Test successful employee creation."""
    service = EmployeeService()
    employee = await service.create({
        "employee_id": "EMP001",
        "name": "John Doe",
        "department": "IT"
    }, db_session)
    
    assert employee.employee_id == "EMP001"
    assert employee.name == "John Doe"
```

### Frontend Testing (TypeScript)

When adding tests, use Vitest:

```typescript
// src/components/EmployeeCard.test.tsx
import { render, screen } from '@testing-library/react';
import { EmployeeCard } from './EmployeeCard';

describe('EmployeeCard', () => {
  it('renders employee information', () => {
    const employee = {
      id: '1',
      name: 'John Doe',
      department: 'IT'
    };
    
    render(<EmployeeCard employee={employee} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('IT')).toBeInTheDocument();
  });
});
```

### Running Tests

```bash
# Backend tests (when implemented)
cd backend
pytest

# Frontend tests (when implemented)
cd frontend
npm test
```

---

## Commit Message Guidelines

Follow the Conventional Commits specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, no logic changes)
- **refactor:** Code refactoring
- **test:** Adding or updating tests
- **chore:** Maintenance tasks (dependencies, build config)

### Examples

```
feat(auth): Add employee ID login with DOB initial password

Implement new authentication flow where employees log in with
their employee ID and date of birth on first login, then are
prompted to set a new password.

Closes #42
```

```
fix(renewals): Prevent SQL injection in search endpoint

Replace string concatenation with parameterized query to prevent
SQL injection vulnerability in renewal search functionality.
```

---

## Pull Request Process

### PR Size Guidelines

**Why PR size matters:**
- Smaller PRs get reviewed faster
- Issues are easier to identify
- Less risk of merge conflicts
- Safer to revert if needed
- Better for team learning

#### Check Your PR Size Locally

Before creating a PR, use our helper script to analyze your changes:

```bash
./scripts/check-pr-size.sh
```

This will show you:
- Total files and lines changed
- Breakdown by file type (code, docs, config)
- Size category (small, medium, large, very large)
- Specific recommendations

#### PR Size Categories

| Category | Thresholds | Status | Guidance |
|----------|-----------|--------|----------|
| **Small** | ≤15 files or ≤500 lines | 🟢 Ideal | Perfect size for quick review |
| **Medium** | ≤30 files or ≤1000 lines | 🟡 OK | Acceptable, add clear description |
| **Large** | ≤50 files or ≤2000 lines | 🟠 Caution | Consider splitting if possible |
| **Very Large** | >50 files or >2000 lines | 🔴 Warning | Should usually be split |

**Special case - Documentation-heavy PRs:** If >60% of your PR is documentation, the thresholds are more lenient since docs are easier to review.

#### When Large PRs Are Acceptable

Some changes genuinely need to be large. Large PRs are acceptable for:

✅ **Database migrations** with corresponding code changes  
✅ **Generated code** updates (lock files, builds) with minimal source changes  
✅ **Major refactoring** that must be atomic to work  
✅ **Comprehensive documentation** updates  
✅ **Security fixes** that touch many files  
✅ **Framework upgrades** requiring changes across the codebase

If your PR falls into these categories, **note it clearly in the PR description** and add extra documentation to help reviewers.

#### How to Split Large PRs

If your PR is large and doesn't fall into the exceptions above, consider these strategies:

1. **Separate by concern:**
   - Backend changes → One PR
   - Frontend changes → Another PR
   - Documentation updates → Third PR

2. **Create a feature branch:**
   - Make a `feature/big-change` branch from `main`
   - Create smaller PRs targeting the feature branch
   - Final PR merges feature branch to `main`

3. **Split by module or component:**
   - Database schema changes → First PR
   - API endpoints → Second PR
   - UI components → Third PR
   - Integration and tests → Fourth PR

4. **Use feature flags:**
   - Deploy incomplete features behind flags
   - Enable incrementally as pieces are completed
   - Each piece can be a separate PR

5. **Refactor then feature:**
   - Preparatory refactoring → One PR
   - New feature using refactored code → Second PR

#### Example: Splitting a Large PR

**❌ Bad: One 50-file PR**
```
PR #123: Implement complete leave management system
- 15 backend files (new models, endpoints, services)
- 20 frontend files (forms, components, pages)
- 10 test files
- 5 documentation files
```

**✅ Good: Four focused PRs**
```
PR #123: Add leave database models and repository
- 5 backend files (models, migrations, repositories)
- Tests for models

PR #124: Add leave management API endpoints  
- 5 backend files (routers, services, schemas)
- API integration tests
Dependencies: #123

PR #125: Add leave management UI components
- 20 frontend files (forms, components, pages)
- Component tests
Dependencies: #124

PR #126: Add leave management documentation
- 5 documentation files
- User guide updates
Dependencies: #125
```

### Before Submitting

1. **Check PR size:**
   ```bash
   ./scripts/check-pr-size.sh
   ```

2. **Test your changes:**
   ```bash
   # Backend
   cd backend
   find app -name '*.py' -exec python -m py_compile {} +
   
   # Frontend
   cd frontend
   npm run lint
   ```

3. **Review your changes:**
   ```bash
   git status
   git diff
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: Add new feature description"
   ```

### Submitting a Pull Request

1. **Push your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create PR on GitHub:**
   - Navigate to the repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

3. **PR Description should include:**
   - What changes were made
   - Why the changes were necessary
   - How to test the changes
   - Screenshots (for UI changes)
   - Related issue numbers

### PR Review Process

**Automated Review**:
1. PR is opened
2. Automated checks run immediately:
   - Backend quality check
   - Frontend quality check
   - UAE compliance check
   - Documentation check
   - PR size analysis
3. Review comments posted automatically
4. Traffic light status indicated (🟢🟡🔴)

**Human Review**:
- PRs require human review before merging
- All automated checks should pass (green checkmarks)
- Address reviewer feedback
- Keep PRs focused and reasonably sized

**Merging**:
- All CI checks must pass
- At least one approval required
- No unresolved conversations
- Branch up to date with main

**Post-Merge**:
- Deployment triggers automatically
- Health checks run after deployment
- Performance monitoring begins
- Issues created if problems detected

**See Full Guide**: [Copilot Agent System Guide](docs/COPILOT_AGENT_SYSTEM_GUIDE.md)

---

## Automated System Overview

### For Technical Contributors

The repository includes comprehensive automation:

**PR Automation** (`.github/workflows/pr-quality-check.yml`):
- Auto-labeling based on files changed
- Security pattern detection
- Compliance impact analysis
- Documentation gap detection
- Size warnings for large PRs

**Deployment Automation** (`.github/workflows/post-deployment-health.yml`):
- Health endpoint checking
- Performance monitoring
- Smoke tests
- Plain-language alerts
- Rollback guidance

**Maintenance Automation** (`.github/workflows/automated-maintenance.yml`):
- Monthly dependency audits
- Stale branch detection
- Documentation review reminders
- Maintenance summary generation

### For Non-Technical Contributors

**You don't need to manage the automation**, but you should:

✅ **Read automated PR comments** - They explain issues in simple terms
✅ **Approve Dependabot PRs** - Especially security updates
✅ **Review monthly summaries** - Take action on critical items
✅ **Follow health check guidance** - If deployment issues arise

**Resources for Non-Technical Users**:
- [Copilot Agent System Guide](docs/COPILOT_AGENT_SYSTEM_GUIDE.md) - Plain-language guide
- [HR Portal FAQ](docs/HR_PORTAL_FAQ.md) - Common questions answered
- [HR Admin Onboarding](docs/HR_ADMIN_ONBOARDING.md) - Complete onboarding checklist

---

## Troubleshooting

### Common Issues

#### Backend Issues

**Issue: Database connection error**
```
sqlalchemy.exc.OperationalError: connection refused
```

**Solution:**
1. Ensure PostgreSQL is running
2. Check `DATABASE_URL` in `.env`
3. Verify database exists: `psql -l`

---

**Issue: Import errors after adding dependencies**
```
ModuleNotFoundError: No module named 'xyz'
```

**Solution:**
```bash
cd backend
uv sync  # Reinstall all dependencies
```

---

**Issue: Alembic migration conflicts**
```
alembic.util.exc.CommandError: Multiple head revisions present
```

**Solution:**
```bash
# Check migration history
uv run alembic history

# Merge heads if needed
uv run alembic merge heads -m "Merge migrations"
```

#### Frontend Issues

**Issue: Port already in use**
```
Error: Port 5173 is already in use
```

**Solution:**
```bash
# Kill the process using the port
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 5174
```

---

**Issue: Module not found after npm install**
```
Cannot find module '@/components/Button'
```

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

**Issue: TypeScript errors in IDE**
```
Cannot find module or its corresponding type declarations
```

**Solution:**
1. Restart TypeScript server in your IDE
2. Check `tsconfig.json` paths configuration
3. Ensure all dependencies are installed

### Getting Help

If you encounter issues not covered here:

1. Check the [documentation](docs/)
2. Review existing [GitHub Issues](https://github.com/ismaelloveexcel/AZURE-DEPLOYMENT-HR-PORTAL/issues)
3. Use GitHub Copilot Agents for guidance
4. Open a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - System information (OS, Python/Node versions)

---

## Additional Resources

### Documentation

- [README.md](README.md) - Project overview
- [docs/HR_USER_GUIDE.md](docs/HR_USER_GUIDE.md) - End-user guide
- [docs/COPILOT_AGENTS.md](docs/COPILOT_AGENTS.md) - Copilot Agents guide
- [docs/SYSTEM_HEALTH_CHECK.md](docs/SYSTEM_HEALTH_CHECK.md) - System status

### External Documentation

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

### GitHub Copilot Resources

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Best practices for Copilot coding agent in your repository](https://gh.io/copilot-coding-agent-tips)

---

## License

By contributing to this project, you agree that your contributions will be licensed under the same ISC License that covers the project.

---

**Thank you for contributing to Secure Renewals HR Portal!** 🎉

If you have questions or suggestions for improving these guidelines, please open an issue or submit a PR.
