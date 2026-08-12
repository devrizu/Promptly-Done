import { useEffect, useRef, useState } from 'react'

/**
 * ReadingMark — the signature component from design.md §5.
 *
 * Instead of a bare number or progress ring, scores render on a
 * short horizontal scale with tick marks. A needle sits at the
 * score's position, and the number is set in Plex Mono beside it.
 *
 * Needle color tells provenance:
 * - signal-600 (teal) → platform-computed value
 * - ai-600 (violet)   → AI-layer output
 */

interface ReadingMarkProps {
  value: number
  max?: number
  label?: string
  variant?: 'signal' | 'ai'
  showTicks?: boolean
  size?: 'sm' | 'md'
}

export function ReadingMark({
  value,
  max = 100,
  label,
  variant = 'signal',
  showTicks = true,
  size = 'md',
}: ReadingMarkProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const hasAnimated = useRef(false)
  const ref = useRef<HTMLDivElement>(null)

  const needleColor = variant === 'ai' ? 'var(--color-ai-600)' : 'var(--color-signal-600)'
  const percentage = Math.min(Math.max((animatedValue / max) * 100, 0), 100)
  const isSmall = size === 'sm'

  useEffect(() => {
    if (hasAnimated.current) {
      setAnimatedValue(value)
      return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setAnimatedValue(value)
      hasAnimated.current = true
      return
    }

    // Animate when element enters viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 700
          const start = performance.now()

          function animate(now: number) {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
            setAnimatedValue(value * eased)
            if (progress < 1) requestAnimationFrame(animate)
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  const ticks = [0, 25, 50, 75, 100]

  return (
    <div ref={ref} className="flex flex-col gap-1">
      {label && (
        <span className={`font-body text-graphite-600 ${isSmall ? 'text-[11px]' : 'text-xs'}`}>
          {label}
        </span>
      )}
      <div className="flex items-center gap-3">
        {/* Scale */}
        <div className={`relative flex-1 ${isSmall ? 'h-3' : 'h-4'}`}>
          {/* Track line */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-px bg-graphite-200" />
          </div>

          {/* Tick marks */}
          {showTicks &&
            ticks.map((tick) => (
              <div
                key={tick}
                className={`absolute w-px bg-graphite-200 ${isSmall ? 'h-2' : 'h-2.5'}`}
                style={{
                  left: `${tick}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}

          {/* Needle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-[left] duration-75"
            style={{ left: `${percentage}%` }}
          >
            <div
              className={`${isSmall ? 'w-1 h-3 rounded-[1px]' : 'w-1.5 h-4 rounded-sm'}`}
              style={{ backgroundColor: needleColor }}
            />
          </div>
        </div>

        {/* Numeral */}
        <span
          className={`font-mono font-medium tabular-nums ${isSmall ? 'text-xs min-w-6' : 'text-sm min-w-8'}`}
          style={{ color: needleColor }}
        >
          {Math.round(animatedValue)}
        </span>
      </div>
    </div>
  )
}
