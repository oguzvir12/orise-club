import { cn } from '@/lib/utils'

export function OriseMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={cn('h-6 w-6', className)}
    >
      {/* Ana Çember (Sol alttaki diyagonal kesik efekti maskelenmiş veya stroke-dasharray ile hassas ayarlanmış hali) */}
      <circle
        cx="50"
        cy="50"
        r="38"
        stroke="currentColor"
        strokeWidth="11"
        strokeLinecap="butt"
        strokeDasharray="210 28"
        transform="rotate(130 50 50)"
      />
      {/* Merkez Noktası */}
      <circle cx="50" cy="50" r="11" fill="currentColor" />
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
