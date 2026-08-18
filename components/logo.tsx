import { cn } from '@/lib/utils'

export function OriseMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={cn('h-6 w-6', className)}
    >
      {/* Outer ring with a gap on the lower-left arc */}
      <circle
        cx="24"
        cy="24"
        r="17"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="90 17"
        transform="rotate(118 24 24)"
      />
      {/* Center dot */}
      <circle cx="24" cy="24" r="4" fill="currentColor" />
    </svg>
  )
}

export function Logo({
  className,
  showClub = true,
  markClassName,
}: {
  className?: string
  showClub?: boolean
  markClassName?: string
}) {
  return (
    <span
      className={cn(
        'font-display inline-flex items-center gap-2 text-xl font-bold tracking-[0.28em] text-foreground',
        className,
      )}
    >
      <OriseMark className={cn('h-6 w-6 text-primary', markClassName)} />
      <span className="inline-flex items-baseline gap-1">
        ORISE
        {showClub && (
          <span className="text-[0.55em] font-medium tracking-[0.35em] text-muted-foreground">
            CLUB
          </span>
        )}
      </span>
    </span>
  )
}
