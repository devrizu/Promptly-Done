import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'signal' | 'ai'
  className?: string
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const base = 'inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.04em] rounded-sm font-body'
  
  const variants: Record<string, string> = {
    default: 'bg-graphite-200 text-graphite-600',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    signal: 'bg-signal-100 text-signal-600',
    ai: 'bg-ai-100 text-ai-600',
  }

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
