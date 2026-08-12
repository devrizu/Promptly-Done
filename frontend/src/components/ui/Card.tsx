import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  hover?: boolean
  className?: string
  onClick?: () => void
}

export function Card({ children, hover = false, className = '', onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      className={`bg-surface border border-graphite-200 rounded-card p-6 ${
        hover ? 'transition-shadow duration-150 hover:shadow-card-hover cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </motion.div>
  )
}
