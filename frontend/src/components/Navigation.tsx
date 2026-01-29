import React from 'react';

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
}

interface NavItem {
  id: Section;
  label: string;
  icon: React.ReactNode;
  roles?: string[]; // If specified, only show for these roles
  badge?: number; // Optional badge count
}

export const Navigation: React.FC<NavigationProps> = ({ activeSection, onNavigate, userRole }) => {
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

  return (
    <nav className="bg-white border-r border-primary-200 w-64 flex-shrink-0 flex flex-col">
      <div className="p-6 border-b border-primary-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-green flex items-center justify-center">
            <span className="text-white font-semibold text-sm">B</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-primary-800">Baynunah HR</h1>
            <p className="text-xs text-primary-500">ESS Portal</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {visibleItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-accent-green text-white shadow-sm' 
                      : 'text-primary-700 hover:bg-primary-50'
                    }
                  `}
                >
                  <span className={isActive ? 'text-white' : 'text-primary-500'}>
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-accent-red text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-4 border-t border-primary-200">
        <div className="text-xs text-primary-500 text-center">
          <p>Version 1.0.0</p>
          <p className="mt-1">© 2025 Baynunah HR</p>
        </div>
      </div>
    </nav>
  );
};
