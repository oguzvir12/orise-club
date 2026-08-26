import { cn } from '@/lib/utils'

export function OriseMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
      className={cn('h-6 w-6', className)}
    >
      {/* Sol altta açıklığı olan turuncu çember */}
      <path
        d="M18 4C10.268 4 4 10.268 4 18C4 23.25 6.89 27.81 11.16 30.22"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M14.5 32.5C15.65 32.83 16.81 33 18 33C25.732 33 32 26.732 32 19C32 11.268 25.732 5 18 5"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="18" cy="19" r="2.5" fill="currentColor" />
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
