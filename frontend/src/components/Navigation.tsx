import React from 'react';
import { Avatar } from './Avatar';
import { StatusBadge } from './StatusBadge';

export type Section = 
  | 'home' 
  | 'employees' 
  | 'onboarding' 
  | 'admin' 
  | 'passes' 
  | 'recruitment' 
  | 'attendance' 
  | 'compliance-alerts'
  | 'documents'
  | 'settings';

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: Section) => void;
  userRole?: string;
  userName?: string;
  userAvatar?: string | null;
  onLogout?: () => void;
}

interface NavItem {
  id: Section;
  label: string;
  icon: React.ReactNode;
  roles?: string[]; // If specified, only show for these roles
  badge?: number; // Optional badge count
}

export const Navigation: React.FC<NavigationProps> = ({ 
  activeSection, 
  onNavigate, 
  userRole,
  userName = 'Guest User',
  userAvatar = null,
  onLogout
}) => {
  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 'compliance-alerts',
      label: 'Compliance',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      roles: ['admin', 'hr'],
    },
    {
      id: 'recruitment',
      label: 'Hiring',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'onboarding',
      label: 'Onboarding',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      roles: ['admin', 'hr'],
    },
    {
      id: 'passes',
      label: 'Passes & Requests',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'admin',
      label: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      roles: ['admin'],
    },
  ];

  // Filter nav items based on user role
  const visibleItems = navItems.filter(item => {
    if (!item.roles || !userRole) return true;
    return item.roles.includes(userRole);
  });

  // Get role display with proper formatting
  const getRoleDisplay = (role?: string): string => {
    if (!role) return 'Employee'
    return role.charAt(0).toUpperCase() + role.slice(1)
  }

  // Get role badge variant
  const getRoleBadgeVariant = (role?: string): 'warning' | 'info' | 'success' => {
    if (role === 'admin') return 'info' // Blue for admin (high privilege)
    if (role === 'hr') return 'warning' // Amber for HR (important role)
    return 'success' // Green for regular employee
  }

  return (
    <nav className="bg-white border-r border-primary-200 w-64 flex-shrink-0 flex flex-col shadow-sm">
      {/* Brand Header */}
      <div className="p-6 border-b border-primary-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-green to-emerald-600 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary-800">Baynunah HR</h1>
            <p className="text-xs text-primary-500 font-medium">ESS Portal</p>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-primary-200 bg-gradient-to-br from-primary-50 to-white">
        <div className="flex items-center gap-3 mb-2">
          <Avatar name={userName} src={userAvatar} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-primary-800 truncate">{userName}</p>
            <StatusBadge 
              variant={getRoleBadgeVariant(userRole)} 
              label={getRoleDisplay(userRole)}
              size="sm"
            />
          </div>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full mt-2 px-3 py-1.5 text-xs font-medium text-primary-600 hover:text-primary-800 hover:bg-white border border-primary-200 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {visibleItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-accent-green to-emerald-600 text-white shadow-md border-l-4 border-emerald-300' 
                      : 'text-primary-700 hover:bg-primary-50 hover:border-l-4 hover:border-accent-green/30'
                    }
                  `}
                >
                  <span className={isActive ? 'text-white' : 'text-primary-500'}>
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-primary-200 bg-primary-50">
        <div className="text-xs text-primary-500 text-center space-y-1">
          <p className="font-medium text-primary-600">Version 1.0.0</p>
          <p className="text-primary-400">© 2025 Baynunah HR</p>
        </div>
      </div>
    </nav>
  );
};
