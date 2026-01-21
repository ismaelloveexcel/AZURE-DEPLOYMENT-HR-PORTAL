import React from 'react'

interface ProgressItem {
  label: string
  icon?: string
  active?: boolean
  completed?: boolean
}

interface ProgressBarProps {
  items: ProgressItem[]
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ items }) => {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2">
      {items.map((item, idx) => {
        const state = item.completed ? 'bg-emerald-500 text-white' : item.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
        const connectorColor = item.completed ? 'bg-emerald-500' : 'bg-gray-200'
        return (
          <React.Fragment key={item.label}>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${state} shadow-sm whitespace-nowrap`}>
              {item.icon ? (
                <span className="w-4 h-4 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </span>
              ) : null}
              <span>{item.label}</span>
            </div>
            {idx < items.length - 1 && <div className={`h-0.5 w-8 ${connectorColor} rounded-full`} />}
          </React.Fragment>
        )
      })}
    </div>
  )
}
