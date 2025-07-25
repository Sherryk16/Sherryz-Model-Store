// src/components/ui/button.tsx
import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  onClick,
  disabled = false,
}) => {
  const baseStyle = 'transition-all font-semibold rounded-md focus:outline-none'
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }
  const variantStyles = variant === 'outline' ? 
    'border-2 border-gray-700 text-gray-700 hover:bg-gray-700 hover:text-white' : 
    'bg-black text-white hover:bg-black/80'

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
