import type { HTMLMotionProps } from 'framer-motion'
import { motion } from 'framer-motion'

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-body font-semibold rounded-button transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  const variants: Record<string, string> = {
    primary: 'bg-signal-600 text-white hover:bg-signal-600/90 active:bg-signal-600/80',
    secondary:
      'border border-graphite-200 text-graphite-950 bg-surface hover:bg-canvas active:bg-graphite-200/50',
    ghost: 'text-graphite-600 hover:text-graphite-950 hover:bg-canvas active:bg-graphite-200/30',
    danger: 'bg-error text-white hover:bg-error/90 active:bg-error/80',
  }

  const sizes: Record<string, string> = {
    sm: 'text-[13px] px-3 py-1.5 gap-1',
    md: 'text-sm px-4 py-2 gap-1.5',
    lg: 'text-base px-6 py-3 gap-2',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
