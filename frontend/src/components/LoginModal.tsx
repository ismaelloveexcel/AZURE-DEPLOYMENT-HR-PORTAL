import React, { FormEvent } from 'react'

interface LoginModalProps {
  isOpen: boolean
  isAdminLogin: boolean
  employeeId: string
  password: string
  error: string
  loading: boolean
  showPassword: boolean
  onClose: () => void
  onLogin: (e: FormEvent) => void
  onEmployeeIdChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onTogglePassword: () => void
}

/**
 * Modern Login Modal with Glass-morphism design
 * Features: Animated gradient background, glass card effect, smooth transitions
 */
export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  isAdminLogin,
  employeeId,
  password,
  error,
  loading,
  showPassword,
  onClose,
  onLogin,
  onEmployeeIdChange,
  onPasswordChange,
  onTogglePassword,
}) => {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-overlay animate-fadeIn"
      onClick={(e) => {
        // Only close if clicking the backdrop itself, not the card
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      {/* Glass Card */}
      <div className="relative w-full max-w-md glass-card rounded-2xl p-8 shadow-2xl animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-primary-400 hover:text-primary-700 transition-all duration-200 hover:rotate-90 transform"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-green to-emerald-600 shadow-lg mb-4">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <h2 className="text-2xl font-bold text-primary-800 mb-1">
            {isAdminLogin ? 'Admin Portal' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-primary-600">
            {isAdminLogin ? 'Secure administrator access' : 'Sign in to your HR account'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-start gap-2 animate-slideDown">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={onLogin} className="space-y-5">
          {/* Employee ID Field (only for regular login) */}
          {!isAdminLogin && (
            <div>
              <label 
                htmlFor="employee-id" 
                className="block text-sm font-semibold text-primary-700 mb-2"
              >
                Employee ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="employee-id"
                  name="employee_id"
                  type="text"
                  value={employeeId}
                  onChange={(e) => onEmployeeIdChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-accent-green focus:border-accent-green transition-all bg-white/50"
                  placeholder="e.g., BAYN00008"
                  required
                  autoComplete="username"
                  data-testid="employee-id-input"
                />
              </div>
            </div>
          )}

          {/* Password Field */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-semibold text-primary-700 mb-2"
            >
              {isAdminLogin ? 'Admin Password' : 'Password'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-accent-green focus:border-accent-green transition-all bg-white/50"
                placeholder={isAdminLogin ? 'Enter admin password' : 'First login: DOB as DDMMYYYY'}
                required
                autoComplete="current-password"
                data-testid="password-input"
              />
              <button
                type="button"
                onClick={onTogglePassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-500 hover:text-primary-700 transition-colors"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-accent-green to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            data-testid="sign-in-button"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-primary-50 rounded-xl border border-primary-100">
          <p className="text-xs text-primary-600 text-center leading-relaxed">
            {isAdminLogin 
              ? 'Enter the admin password to access the administrator panel.'
              : 'First-time login? Use your date of birth (DDMMYYYY) as password. You will be prompted to change it.'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
