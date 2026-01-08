interface ActionRequiredProps {
  action: {
    label: string
    description?: string
    onClick: () => void
    loading?: boolean
  } | null
  entityColor?: string
}

export function ActionRequired({ action, entityColor = '#00B0F0' }: ActionRequiredProps) {
  return (
    <div className="mb-4">
      <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Next Action</p>
      
      {action ? (
        <button
          onClick={action.onClick}
          disabled={action.loading}
          className="w-full p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-all duration-200 shadow-sm flex items-center gap-3 text-left group disabled:opacity-60"
        >
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
            style={{ backgroundColor: `${entityColor}15` }}
          >
            <svg 
              className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke={entityColor}
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div className="flex-1">
            <span className="text-sm font-semibold text-slate-800 block">{action.label}</span>
            {action.description && (
              <span className="text-[11px] text-slate-400">{action.description}</span>
            )}
          </div>
          {action.loading && (
            <div className="animate-spin w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full"></div>
          )}
        </button>
      ) : (
        <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${entityColor}15` }}
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke={entityColor}
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1">
            <span className="text-sm font-semibold text-slate-800 block">You're all caught up!</span>
            <span className="text-[11px] text-slate-400">No pending actions at the moment</span>
          </div>
        </div>
      )}
    </div>
  )
}
