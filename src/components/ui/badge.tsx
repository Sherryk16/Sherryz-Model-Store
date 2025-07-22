// src/components/ui/badge.tsx
import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ children, className = '' }) => {
  return (
    <span
      className={`inline-block py-1 px-3 rounded-full text-xs font-semibold ${className}`}
    >
      {children}
    </span>
  )
}
