import { X } from 'lucide-react'

interface SkillPillProps {
  name: string
  onRemove?: () => void
  variant?: 'default' | 'ai'
  size?: 'sm' | 'md'
}

export function SkillPill({ name, onRemove, variant = 'default', size = 'md' }: SkillPillProps) {
  const colorClasses =
    variant === 'ai' ? 'bg-ai-100 text-ai-600' : 'bg-signal-100 text-signal-600'

  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-[11px] px-3 py-1'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-pill font-body font-semibold uppercase tracking-[0.04em] ${colorClasses} ${sizeClasses}`}
    >
      {name}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-0.5 hover:opacity-70 transition-opacity cursor-pointer bg-transparent border-none p-0"
          aria-label={`Remove ${name}`}
        >
          <X size={size === 'sm' ? 10 : 12} />
        </button>
      )}
    </span>
  )
}
