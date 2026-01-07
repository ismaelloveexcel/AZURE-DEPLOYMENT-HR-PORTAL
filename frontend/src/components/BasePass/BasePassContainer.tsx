import { ReactNode } from 'react'

export interface PassTab {
  id: string
  label: string
  icon: string
}

export interface BasePassContainerProps {
  entityColor: string
  header: ReactNode
  journey?: ReactNode
  actionRequired?: ReactNode
  children: ReactNode
  tabs: PassTab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function BasePassContainer({
  entityColor,
  header,
  journey,
  actionRequired,
  children,
  tabs,
  activeTab,
  onTabChange
}: BasePassContainerProps) {
  return (
    <div className="h-screen bg-slate-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-md h-full max-h-[580px] sm:max-h-[620px]">
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col h-full">
          {/* Entity-colored top accent bar */}
          <div className="h-1 flex-shrink-0" style={{ backgroundColor: entityColor }} />
          
          {header}
          
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 pb-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {journey}
            {actionRequired}
            {children}
          </div>

          {/* Bottom nav with shadow */}
          <div className="border-t border-slate-100 px-2 py-1.5 sm:py-2 flex-shrink-0 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
            <div className="flex">
              {tabs.map(tab => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex-1 py-2 flex flex-col items-center gap-0.5 relative transition-all duration-200 ${
                      isActive ? '' : 'text-slate-400 hover:text-slate-600'
                    }`}
                    style={isActive ? { color: entityColor } : undefined}
                  >
                    <div 
                      className={`p-1 sm:p-1.5 rounded-lg transition-all duration-200`}
                      style={isActive ? { backgroundColor: `${entityColor}15` } : undefined}
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2 : 1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                      </svg>
                    </div>
                    <span className={`text-[8px] sm:text-[9px] font-medium ${isActive ? 'font-bold' : ''}`}>{tab.label}</span>
                    {isActive && (
                      <div 
                        className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full"
                        style={{ backgroundColor: entityColor }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
