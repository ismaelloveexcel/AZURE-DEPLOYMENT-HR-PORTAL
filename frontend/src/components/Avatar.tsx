import React, { useState, useEffect } from 'react'

interface AvatarProps {
  name: string
  src?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
}

/**
 * Avatar component with initials fallback
 * Displays user photo or generates initials from name
 * Gracefully handles image loading errors
 */
export const Avatar: React.FC<AvatarProps> = ({ 
  name, 
  src, 
  size = 'md', 
  className = '' 
}) => {
  const [imgError, setImgError] = useState(false)

  // Reset error state when src changes to allow new images to load
  useEffect(() => {
    setImgError(false)
  }, [src])

  const getInitials = (fullName: string): string => {
    const trimmed = fullName.trim()
    if (!trimmed) return 'NA'
    
    const parts = trimmed.split(' ').filter(p => p.length > 0)
    
    if (parts.length === 0) return 'NA'
    if (parts.length === 1) {
      // Single name: take first 2 characters
      return parts[0].substring(0, 2).toUpperCase()
    }
    
    // Multiple parts: first char of first and last name
    const firstInitial = parts[0][0] || ''
    const lastInitial = parts[parts.length - 1][0] || ''
    return (firstInitial + lastInitial).toUpperCase()
  }

  const initials = getInitials(name)

  // Generate a consistent color based on name with safe 32-bit integer handling
  const getColorFromName = (str: string): string => {
    const colors = [
      'bg-blue-100 text-blue-700',
      'bg-green-100 text-green-700',
      'bg-purple-100 text-purple-700',
      'bg-pink-100 text-pink-700',
      'bg-indigo-100 text-indigo-700',
      'bg-teal-100 text-teal-700',
    ]
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      // Force 32-bit integer to prevent overflow issues
      hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
    }
    return colors[Math.abs(hash) % colors.length]
  }

  const baseClasses = `rounded-full flex items-center justify-center font-semibold ${sizeClasses[size]}`

  // Show image only if src is provided and no loading error occurred
  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name || 'User avatar'}
        onError={() => setImgError(true)}
        className={`${baseClasses} object-cover border-2 border-white shadow-sm ${className}`}
      />
    )
  }

  // Fallback to initials display
  return (
    <div
      className={`${baseClasses} ${getColorFromName(name)} border-2 border-white shadow-sm ${className}`}
      title={name || 'User'}
      aria-label={`Avatar for ${name || 'user'}`}
    >
      {initials}
    </div>
  )
}
