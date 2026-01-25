import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '../types'

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Load non-sensitive user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('hr_portal_user')
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser) as {
          id: string
          name: string
          role: string
        }
        // Reconstruct a User-compatible object without sensitive fields
        setUser({
          id: parsed.id,
          employee_id: '', // employee_id is not persisted
          name: parsed.name,
          role: parsed.role,
          token: '', // token is not persisted
        } as User)
      } catch (e) {
        localStorage.removeItem('hr_portal_user')
      }
    }
  }, [])

  const login = (loggedInUser: User) => {
    setUser(loggedInUser)
    // Persist only non-sensitive fields to localStorage
    const { id, name, role } = loggedInUser
    localStorage.setItem(
      'hr_portal_user',
      JSON.stringify({ id, name, role })
    )
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('hr_portal_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}
