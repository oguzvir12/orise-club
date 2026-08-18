import { Activity, Clock, Flower2, Footprints, MapPin, Sparkles } from 'lucide-react'
import type { OriseEvent, SportType } from '@/lib/events'

const SPORT_META: Record<
  SportType,
  { icon: typeof Activity; label: string }
> = {
  volleyball: { icon: Activity, label: 'Voleybol' },
  yoga: { icon: Flower2, label: 'Yoga' },
  running: { icon: Footprints, label: 'Koşu' },
}

export function EventCard({ event }: { event: OriseEvent }) {
  const meta = SPORT_META[event.sport]
  const Icon = meta.icon

  return (
    <article className="group relative flex flex-col gap-5 overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40 sm:flex-row sm:items-center sm:gap-6">
      {/* Date block */}
      <div className="flex flex-none items-center gap-4 sm:w-40 sm:flex-col sm:items-start sm:gap-1 sm:border-r sm:border-border sm:pr-6">
        <span className="font-display text-2xl font-bold text-primary">
          {event.date}
        </span>
        <span className="text-sm font-medium text-muted-foreground">
          {event.day}
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-foreground sm:ml-0 sm:mt-1">
          <Clock className="h-4 w-4 text-muted-foreground" />
          {event.time}
        </span>
      </div>

      {/* Details */}
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Icon className="h-3.5 w-3.5" />
            {meta.label}
          </span>
        </div>
        <h3 className="font-display text-lg font-semibold leading-snug text-balance">
          {event.title}
        </h3>
        <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 flex-none" />
          {event.location}
        </p>
        {event.note && (
          <p className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-foreground/90">
            <Sparkles className="mt-0.5 h-4 w-4 flex-none text-primary" />
            <span className="text-pretty">{event.note}</span>
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="flex-none">
        <button
          type="button"
          className="w-full rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-accent sm:w-auto"
        >
          Katıl / Kayıt Ol
        </button>
      </div>
    </article>
  )
}
