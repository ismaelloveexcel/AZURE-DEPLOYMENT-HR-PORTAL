interface Stage {
  key: string
  label: string
  candidateLabel?: string
  managerLabel?: string
  icon: string
}

interface JourneyTimelineProps {
  stages: Stage[]
  currentStageIndex: number
  entityColor: string
  viewType?: 'candidate' | 'manager'
}

export function JourneyTimeline({ stages, currentStageIndex, entityColor, viewType = 'candidate' }: JourneyTimelineProps) {
  return (
    <div className="py-4 px-2">
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute top-5 left-6 right-6 h-0.5 bg-slate-200 z-0"></div>
        <div 
          className="absolute top-5 left-6 h-0.5 z-10 transition-all duration-500"
          style={{ 
            width: currentStageIndex === 0 ? '0%' : `calc(${(currentStageIndex / (stages.length - 1)) * 100}% - 24px)`,
            backgroundColor: entityColor
          }}
        ></div>
        
        <div className="relative flex justify-between">
          {stages.map((stage, index) => {
            const isCompleted = index < currentStageIndex
            const isCurrent = index === currentStageIndex
            const stageLabel = viewType === 'candidate' 
              ? (stage.candidateLabel || stage.label) 
              : (stage.managerLabel || stage.label)
            
            return (
              <div key={stage.key} className="flex flex-col items-center z-20 flex-1">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                    isCompleted
                      ? 'text-white border-transparent' 
                      : isCurrent
                      ? 'text-white border-transparent shadow-lg'
                      : 'bg-white text-slate-400 border-slate-200'
                  }`}
                  style={(isCompleted || isCurrent) ? { 
                    backgroundColor: entityColor,
                    boxShadow: isCurrent ? `0 4px 12px ${entityColor}40` : undefined
                  } : {}}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isCurrent ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={stage.icon} />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <span 
                  className={`text-[9px] mt-2 font-medium text-center leading-tight max-w-[60px] ${
                    isCurrent ? 'font-bold' : ''
                  }`}
                  style={{ color: isCurrent ? entityColor : (isCompleted ? '#475569' : '#94a3b8') }}
                >
                  {stageLabel}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
