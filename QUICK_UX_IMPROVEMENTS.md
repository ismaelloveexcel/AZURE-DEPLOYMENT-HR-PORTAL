# Quick UX Improvements - Implementation Guide

**Target:** 80% improvement with 20% effort  
**Time Required:** 2-3 hours total  
**Impact:** High visibility, immediate user benefit

---

## 🚀 PRIORITY 1: Sidebar Navigation (45 minutes)

### Why This Matters
Currently, users must:
1. Click portal card
2. Use feature
3. Click "Back to Home"
4. Click different portal card

**This creates 4 clicks to switch contexts.**

With sidebar: **1 click to switch contexts** (75% reduction).

### Implementation

**Step 1: Create Sidebar Component** (20 minutes)

Create `/frontend/src/components/Sidebar.tsx`:

```tsx
import React from 'react'

interface SidebarProps {
  user: any
  activeSection: string
  onNavigate: (section: string) => void
  onLogout: () => void
}

const menuItems = [
  { 
    id: 'home', 
    name: 'Dashboard', 
    icon: '🏠',
    roles: ['admin', 'hr', 'viewer'] 
  },
  { 
    id: 'employees', 
    name: 'Employees', 
    icon: '👥',
    roles: ['admin', 'hr', 'viewer'] 
  },
  { 
    id: 'attendance', 
    name: 'Attendance', 
    icon: '⏰',
    roles: ['admin', 'hr', 'viewer'] 
  },
  { 
    id: 'compliance-alerts', 
    name: 'Compliance', 
    icon: '⚠️',
    roles: ['admin', 'hr'] 
  },
  { 
    id: 'recruitment', 
    name: 'Recruitment', 
    icon: '💼',
    roles: ['admin', 'hr'] 
  },
  { 
    id: 'admin', 
    name: 'Admin Panel', 
    icon: '⚙️',
    roles: ['admin'] 
  },
]

export const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  activeSection, 
  onNavigate,
  onLogout 
}) => {
  const visibleItems = menuItems.filter(item => 
    !user || item.roles.includes(user.role)
  )
  
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00A0DF] to-[#34D399] flex items-center justify-center">
            <span className="text-white font-semibold text-sm">B</span>
          </div>
          <span className="text-xl font-medium text-gray-800">Baynunah HR</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeSection === item.id
                ? 'bg-gradient-to-r from-[#00A0DF]/10 to-[#34D399]/10 text-[#00A0DF] font-medium shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm">{item.name}</span>
          </button>
        ))}
      </nav>
      
      {/* User Profile */}
      {user && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00A0DF] to-[#34D399] flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </aside>
  )
}
```

**Step 2: Update App.tsx Layout** (15 minutes)

Find the main return statement in `App.tsx` (around line 5500) and update:

```tsx
// BEFORE:
return (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    {loginModal}
    
    {/* Header */}
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
      ...
    </header>
    
    {/* Main Content */}
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
      ...
    </main>
  </div>
)

// AFTER:
return (
  <div className="flex h-screen overflow-hidden bg-gray-50">
    {loginModal}
    
    {/* Sidebar - Only show when logged in */}
    {user && (
      <Sidebar
        user={user}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
    )}
    
    {/* Main Content Area */}
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header - Only show when NOT logged in */}
      {!user && (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00A0DF] to-[#34D399] flex items-center justify-center">
                <span className="text-white font-semibold text-sm">B</span>
              </div>
              <span className="text-xl font-medium text-gray-800">Baynunah HR</span>
            </div>
          </div>
        </header>
      )}
      
      {/* Page Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Your existing content rendering logic */}
      </main>
    </div>
  </div>
)
```

**Step 3: Import Sidebar** (5 minutes)

At the top of `App.tsx`, add:

```tsx
import { Sidebar } from './components/Sidebar'
```

---

## 🎨 PRIORITY 2: Unified Button Styles (30 minutes)

### Why This Matters
Current issues:
- Custom `button.css` with hardcoded colors
- Inconsistent button appearance
- Not using Tailwind's utility-first approach

### Implementation

**Step 1: Create Button Component** (15 minutes)

Create `/frontend/src/components/Button.tsx`:

```tsx
import React from 'react'

interface ButtonProps {
  variant?: 'primary' | 'success' | 'danger' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: (e?: any) => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
  fullWidth?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  fullWidth = false,
}) => {
  const baseStyles = 'font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-md'
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#00A0DF] to-[#0085c7] hover:from-[#0085c7] hover:to-[#0070b0] text-white',
    success: 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300',
  }
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  )
}
```

**Step 2: Replace Button Usage** (15 minutes)

Find and replace in `App.tsx`:

```tsx
// BEFORE:
<button type="submit" disabled={loading} className="btn-submit w-full">
  {loading ? 'Signing in...' : 'Sign In'}
</button>

// AFTER:
<Button type="submit" disabled={loading} variant="primary" fullWidth>
  {loading ? 'Signing in...' : 'Sign In'}
</Button>
```

Import at the top:
```tsx
import { Button } from './components/Button'
```

---

## 🔍 PRIORITY 3: Employee Search (45 minutes)

### Why This Matters
- No way to quickly find employees
- Manual scanning through long lists
- Poor user experience for large datasets

### Implementation

**Step 1: Add Search State** (5 minutes)

In `App.tsx`, add near other state declarations:

```tsx
const [employeeSearchQuery, setEmployeeSearchQuery] = useState('')
```

**Step 2: Add Search Input** (10 minutes)

In the employees section (around line 1850), add before the table:

```tsx
{/* Search Bar */}
<div className="mb-6">
  <div className="relative">
    <svg 
      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      type="text"
      value={employeeSearchQuery}
      onChange={(e) => setEmployeeSearchQuery(e.target.value)}
      placeholder="Search by name, ID, or department..."
      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
    />
    {employeeSearchQuery && (
      <button
        onClick={() => setEmployeeSearchQuery('')}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
  
  {/* Results count */}
  {employeeSearchQuery && (
    <p className="mt-2 text-sm text-gray-600">
      Found {filteredEmployees.length} of {employees.length} employees
    </p>
  )}
</div>
```

**Step 3: Add Filter Logic** (10 minutes)

Before the table mapping, add:

```tsx
const filteredEmployees = employees.filter(emp => {
  if (!employeeSearchQuery) return true
  
  const query = employeeSearchQuery.toLowerCase()
  return (
    emp.name.toLowerCase().includes(query) ||
    emp.employee_id.toLowerCase().includes(query) ||
    emp.department?.toLowerCase().includes(query) ||
    emp.job_title?.toLowerCase().includes(query)
  )
})
```

**Step 4: Update Table** (10 minutes)

Change the table mapping from:

```tsx
{employees.map(emp => (
  // ...
))}
```

To:

```tsx
{filteredEmployees.map(emp => (
  // ...
))}
```

**Step 5: Add Empty State** (10 minutes)

Update the empty state check:

```tsx
{loading ? (
  <div className="p-8 text-center text-gray-500">Loading employees...</div>
) : filteredEmployees.length === 0 ? (
  <div className="p-8 text-center">
    {employeeSearchQuery ? (
      <>
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p className="text-gray-500 mb-2">No employees found matching "{employeeSearchQuery}"</p>
        <button
          onClick={() => setEmployeeSearchQuery('')}
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
        >
          Clear search
        </button>
      </>
    ) : (
      <>
        <p className="text-gray-500 mb-4">No employees found</p>
        <p className="text-sm text-gray-400">Add employees via CSV import or the admin panel</p>
      </>
    )}
  </div>
) : (
  // table content
)}
```

---

## 📱 PRIORITY 4: Mobile-Responsive Tables (30 minutes)

### Why This Matters
- Tables overflow on mobile devices
- Horizontal scrolling = poor UX
- Touch targets too small

### Implementation

**Step 1: Add Mobile Card View** (20 minutes)

Replace the table with responsive layout:

```tsx
{/* Desktop Table - Hidden on mobile */}
<div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
  <table className="w-full">
    {/* Your existing table code */}
  </table>
</div>

{/* Mobile Card View - Hidden on desktop */}
<div className="md:hidden space-y-3">
  {filteredEmployees.map(emp => (
    <div
      key={emp.id}
      onClick={() => (user?.role === 'admin' || user?.role === 'hr') && openEmployeeModal(emp)}
      className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
    >
      {/* Employee Info */}
      <div className="flex items-center gap-4 mb-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00A0DF] to-[#34D399] flex items-center justify-center flex-shrink-0">
          <span className="text-white font-medium">
            {emp.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 truncate">{emp.name}</div>
          <div className="text-sm text-gray-500">{emp.employee_id}</div>
        </div>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      
      {/* Details */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-gray-500">Department:</span>
          <span className="ml-1 text-gray-900">{emp.department || '-'}</span>
        </div>
        <div>
          <span className="text-gray-500">Job Title:</span>
          <span className="ml-1 text-gray-900">{emp.job_title || '-'}</span>
        </div>
      </div>
      
      {/* Status Badge */}
      <div className="mt-3">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          emp.employment_status === 'Active' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-700'
        }`}>
          {emp.employment_status || (emp.is_active ? 'Active' : 'Inactive')}
        </span>
      </div>
    </div>
  ))}
</div>
```

---

## ⚡ PRIORITY 5: Enhanced Login Modal (30 minutes)

### Why This Matters
- First impression of the app
- Confusing first-time login instructions
- Poor visual hierarchy

### Implementation

Update the login modal (around line 1097 in `App.tsx`):

```tsx
const loginModal = showLoginModal ? (
  <div className="fixed inset-0 bg-gradient-to-br from-[#00A0DF]/10 to-emerald-500/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-in fade-in zoom-in duration-200">
      {/* Close Button */}
      <button
        onClick={closeLoginModal}
        type="button"
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
        aria-label="Close login dialog"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {/* Logo & Title */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00A0DF] to-[#34D399] flex items-center justify-center">
          <span className="text-white font-bold text-2xl">B</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-500">
          Sign in to access your HR portal
        </p>
      </div>
      
      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800">Login Failed</p>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-5" data-testid="login-form">
        {!isAdminLogin && (
          <div>
            <label htmlFor="employee-id" className="block text-sm font-medium text-gray-700 mb-2">
              Employee ID
            </label>
            <input
              id="employee-id"
              name="employee_id"
              type="text"
              value={employeeId}
              onChange={e => setEmployeeId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A0DF] focus:border-[#00A0DF] transition-colors"
              placeholder="e.g., BAYN00008"
              required
              autoComplete="username"
              data-testid="employee-id-input"
            />
          </div>
        )}
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A0DF] focus:border-[#00A0DF] transition-colors"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              data-testid="password-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* First-time Login Info - More Prominent */}
        {!isAdminLogin && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-800">First time logging in?</p>
                <p className="text-sm text-blue-600 mt-1">
                  Use your date of birth in <strong>DDMMYYYY</strong> format
                  <br />
                  <span className="text-xs">(e.g., 15061990 for June 15, 1990)</span>
                </p>
              </div>
            </div>
          </div>
        )}
        
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          fullWidth
          data-testid="sign-in-button"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
    </div>
  </div>
) : null
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Before You Start
- [ ] Create a new branch: `git checkout -b ui-improvements`
- [ ] Ensure development environment is running
- [ ] Have backend running on port 8000
- [ ] Have frontend running on port 5173

### Priority 1: Sidebar (45 min)
- [ ] Create `Sidebar.tsx` component
- [ ] Update `App.tsx` layout structure
- [ ] Import Sidebar component
- [ ] Test navigation between sections
- [ ] Test logout functionality

### Priority 2: Buttons (30 min)
- [ ] Create `Button.tsx` component
- [ ] Replace login button
- [ ] Replace form submit buttons
- [ ] Test all button states (hover, active, disabled)

### Priority 3: Search (45 min)
- [ ] Add search state
- [ ] Add search input UI
- [ ] Implement filter logic
- [ ] Update table to use filtered data
- [ ] Add empty state for no results
- [ ] Test search functionality

### Priority 4: Mobile Tables (30 min)
- [ ] Add desktop table wrapper with `hidden md:block`
- [ ] Create mobile card view
- [ ] Test on mobile viewport
- [ ] Test on tablet viewport
- [ ] Verify touch targets are large enough

### Priority 5: Login Modal (30 min)
- [ ] Update modal styling
- [ ] Add better error display
- [ ] Enhance first-time login instructions
- [ ] Test error states
- [ ] Test password visibility toggle

### Testing
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on mobile (Chrome mobile)
- [ ] Test keyboard navigation
- [ ] Test with screen reader (if possible)

### Deployment
- [ ] Run linter: `npm run build` (frontend)
- [ ] Fix any linting errors
- [ ] Test production build locally
- [ ] Commit changes with descriptive message
- [ ] Push to GitHub
- [ ] Create pull request

---

## 🎯 EXPECTED RESULTS

After implementing these 5 priorities:

### User Experience Improvements
- ✅ **75% fewer clicks** to navigate between sections
- ✅ **Instant employee search** - no more manual scanning
- ✅ **Mobile-friendly** - works on phones and tablets
- ✅ **Professional appearance** - consistent with Baynunah brand
- ✅ **Better feedback** - clearer instructions and error messages

### Performance
- ✅ No performance impact (pure CSS/component changes)
- ✅ Same bundle size (minimal new code)
- ✅ Improved perceived performance (instant search)

### Maintainability
- ✅ Reusable components (Button, Sidebar)
- ✅ Consistent patterns across app
- ✅ Easier to add new features

---

## 📞 NEED HELP?

If you encounter issues during implementation:

1. **Sidebar not showing**: Check that `user` is defined and `Sidebar` is imported
2. **Buttons look wrong**: Verify `Button` component is imported
3. **Search not working**: Check `filteredEmployees` is used in table map
4. **Mobile view broken**: Verify Tailwind classes `hidden md:block` and `md:hidden`
5. **Login modal styling off**: Ensure Button component is being used

---

**Total Time:** 2-3 hours  
**Impact:** High  
**Complexity:** Low  
**Recommended:** Do all 5 priorities in one session for maximum impact
