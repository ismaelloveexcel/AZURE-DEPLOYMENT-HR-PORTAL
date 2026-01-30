import React from 'react'

interface DashboardCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  onClick?: () => void
  isLoading?: boolean
}

const variantStyles = {
  default: {
    bg: 'from-blue-500 to-blue-600',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  success: {
    bg: 'from-green-500 to-emerald-600',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  warning: {
    bg: 'from-amber-500 to-orange-600',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  danger: {
    bg: 'from-red-500 to-rose-600',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
  },
  info: {
    bg: 'from-cyan-500 to-blue-600',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
  },
}

/**
 * Interactive Dashboard Card Component
 * Features: Hover effects, trend indicators, loading states, click actions
 */
export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  trend,
  variant = 'default',
  onClick,
  isLoading = false,
}) => {
  const styles = variantStyles[variant]
  const isClickable = !!onClick

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-primary-200 p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-primary-200 rounded-xl" />
            <div className="w-16 h-6 bg-primary-200 rounded" />
          </div>
          <div className="h-8 bg-primary-200 rounded mb-2" />
          <div className="h-4 bg-primary-100 rounded w-3/4" />
        </div>
      </div>
    )
  }

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      className={`
        bg-white rounded-xl border border-primary-200 p-6 shadow-sm
        transition-all duration-300 ease-out
        ${isClickable ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-accent-green/30' : ''}
        group
      `}
    >
      {/* Icon and Trend */}
      <div className="flex items-start justify-between mb-4">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center
          ${styles.iconBg} ${styles.iconColor}
          group-hover:scale-110 transition-transform duration-300
        `}>
          {icon}
        </div>
        
        {trend && (
          <div className={`
            flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold
            ${trend.isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
          `}>
            {trend.isPositive ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mb-2">
        <p className="text-3xl font-bold text-primary-800 group-hover:text-accent-green transition-colors">
          {value}
        </p>
      </div>

      {/* Title and Subtitle */}
      <div>
        <h3 className="text-sm font-semibold text-primary-700 mb-1">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-primary-500">
            {subtitle}
          </p>
        )}
      </div>

      {/* Click indicator */}
      {isClickable && (
        <div className="mt-4 pt-4 border-t border-primary-100 flex items-center text-xs text-accent-green font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          <span>View details</span>
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  )
}

/**
 * Skeleton loader for dashboard cards
 */
export const DashboardCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-primary-200 p-6 shadow-sm">
      <div className="animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-primary-200 rounded-xl" />
          <div className="w-16 h-6 bg-primary-200 rounded" />
        </div>
        <div className="h-8 bg-primary-200 rounded mb-2" />
        <div className="h-4 bg-primary-100 rounded w-3/4" />
      </div>
    </div>
  )
}
