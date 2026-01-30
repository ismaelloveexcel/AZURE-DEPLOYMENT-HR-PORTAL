# PR Size Quick Reference

A quick guide to creating appropriately sized pull requests for easier review and faster merging.

## TL;DR

- ✅ **Small is better**: Aim for <15 files and <500 lines
- 🔍 **Check before pushing**: Run `./scripts/check-pr-size.sh`
- 📦 **Split large changes**: Break into logical chunks
- 📚 **Document exceptions**: Explain why a large PR is necessary

## Check Your PR Size

```bash
# Run this before creating your PR
./scripts/check-pr-size.sh

# Or check against a different branch
./scripts/check-pr-size.sh develop
```

## Size Categories

| Size | Files | Lines | Status | Action |
|------|-------|-------|--------|--------|
| Small | ≤15 | ≤500 | 🟢 | Perfect! |
| Medium | ≤30 | ≤1000 | 🟡 | OK, document well |
| Large | ≤50 | ≤2000 | 🟠 | Consider splitting |
| Very Large | >50 | >2000 | 🔴 | Should split |

## When Large PRs Are OK

Large PRs are acceptable for:
- ✅ Database migrations + code
- ✅ Generated code (lock files)
- ✅ Atomic refactoring
- ✅ Documentation updates
- ✅ Security fixes
- ✅ Framework upgrades

**Always explain in PR description if your PR is large!**

## Quick Splitting Strategies

### 1. By Layer
```
PR 1: Database models
PR 2: API endpoints
PR 3: UI components
PR 4: Tests & docs
```

### 2. By Concern
```
PR 1: Backend
PR 2: Frontend
PR 3: Documentation
```

### 3. By Feature Branch
```
Create feature/big-thing branch
├── PR 1 → feature/big-thing
├── PR 2 → feature/big-thing
├── PR 3 → feature/big-thing
└── Final PR: feature/big-thing → main
```

### 4. Refactor Then Build
```
PR 1: Preparatory refactoring
PR 2: New feature using refactored code
```

## Benefits of Small PRs

✅ **Faster reviews** - Reviewers can give feedback quickly  
✅ **Better quality** - Issues are easier to spot  
✅ **Less conflicts** - Smaller surface area for merge issues  
✅ **Easier to revert** - Can roll back specific changes  
✅ **Better learning** - Changes are easier to understand  

## Common Mistakes

❌ **Mixing concerns** - Backend + frontend + docs in one PR  
❌ **"While I'm here"** - Adding unrelated improvements  
❌ **Big bang** - Complete feature all at once  
❌ **No description** - Large PR without explaining why  

## What Automated Checks Look For

The PR quality check workflow analyzes:
- Total files and lines changed
- Code files (Python, TypeScript, JavaScript)
- Documentation files (Markdown, text)
- Configuration files (YAML, JSON)
- Documentation percentage

And provides:
- Size category assessment
- Specific recommendations
- File breakdown by type
- Clear action items

## Example: Good PR Series

**Feature**: Employee leave management system

```
PR #101: Add leave database models (5 files, 200 lines)
├── Models: LeaveRequest, LeaveBalance, LeaveType
├── Migration script
└── Repository tests

PR #102: Add leave API endpoints (8 files, 400 lines)
├── Routers: leave requests, balances, types
├── Services: business logic
├── Schemas: request/response models
└── API tests
Dependencies: #101

PR #103: Add leave UI components (12 files, 600 lines)
├── Components: LeaveRequestForm, LeaveCalendar
├── Pages: My Leaves, Team Leaves
├── Types and hooks
└── Component tests
Dependencies: #102

PR #104: Add leave documentation (4 files, 300 lines)
├── User guide: How to request leave
├── Admin guide: Managing leave requests
├── API documentation
└── Update README
Dependencies: #103
```

Total: 29 files, 1500 lines  
Split into: 4 PRs averaging 7 files and 375 lines each

## Need Help?

- 📖 Full guide: [CONTRIBUTING.md](CONTRIBUTING.md#pr-size-guidelines)
- 🤖 Automated feedback: Check PR comments after pushing
- 💬 Ask questions: Comment on your PR if you need guidance

## Remember

> "The best PR is one that can be reviewed in under 30 minutes."

A series of small, focused PRs is almost always better than one large PR!
