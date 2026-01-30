import React from 'react'

export type BadgeVariant = 
  | 'active' 
  | 'inactive' 
  | 'pending' 
  | 'expired' 
  | 'warning' 
  | 'critical'
  | 'success'
  | 'info'

interface StatusBadgeProps {
  variant: BadgeVariant
  label?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  active: 'bg-green-50 text-green-700 border-green-200',
  inactive: 'bg-gray-50 text-gray-700 border-gray-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  expired: 'bg-red-50 text-red-700 border-red-200',
  warning: 'bg-orange-50 text-orange-700 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-300',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
}

const defaultLabels: Record<BadgeVariant, string> = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
  expired: 'Expired',
  warning: 'Warning',
  critical: 'Critical',
  success: 'Success',
  info: 'Info',
}

/**
 * StatusBadge component for consistent status display
 * Supports multiple variants with predefined color schemes
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  variant, 
  label, 
  size = 'sm',
  className = '' 
}) => {
  const displayLabel = label || defaultLabels[variant]

  return (
    <span
      className={`
        inline-flex items-center justify-center
        border rounded-full font-medium
        transition-all duration-200
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {displayLabel}
    </span>
  )
}

/**
 * Helper function to get variant from employment status
 */
export const getStatusVariant = (status?: string): BadgeVariant => {
  if (!status) return 'info'
  
  const statusLower = status.toLowerCase()
  
  if (statusLower.includes('active')) return 'active'
  if (statusLower.includes('inactive') || statusLower.includes('terminated')) return 'inactive'
  if (statusLower.includes('pending') || statusLower.includes('probation')) return 'pending'
  if (statusLower.includes('expired')) return 'expired'
  if (statusLower.includes('warning')) return 'warning'
  if (statusLower.includes('critical')) return 'critical'
  
  return 'info'
}
