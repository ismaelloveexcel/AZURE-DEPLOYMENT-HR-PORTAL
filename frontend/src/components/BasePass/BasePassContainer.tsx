import { ReactNode } from 'react'

export interface PassTab {
  id: string
  label: string
  icon: string
}

export interface BasePassContainerProps {
  entityColor: string
  entityName?: string
  passType: 'candidate' | 'manager'
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
  entityName,
  passType,
  header,
  journey,
  actionRequired,
  children,
  tabs,
  activeTab,
  onTabChange
}: BasePassContainerProps) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-md h-full min-h-[600px] max-h-[700px] sm:max-h-[750px]">
        <div className="bg-white border border-slate-200 shadow-xl rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col h-full">
          {/* Entity-colored header bar */}
          <div 
            className="px-4 py-3 flex items-center justify-between flex-shrink-0"
            style={{ backgroundColor: entityColor }}
          >
            <span className="text-white font-bold text-sm tracking-wide">baynunah.</span>
            <div className="flex items-center gap-3">
              <button className="text-white/80 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </button>
              <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                ACTIVE
              </span>
            </div>
          </div>
          
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
                  </button>
                )
              })}
            </div>
          </div>

          {/* Entity footer */}
          {entityName && (
            <div 
              className="px-4 py-2 text-center flex-shrink-0 border-t border-slate-100"
              style={{ backgroundColor: `${entityColor}08` }}
            >
              <span className="text-[10px] text-slate-500 font-medium">
                Recruitment: <span style={{ color: entityColor }} className="font-semibold">{entityName}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
