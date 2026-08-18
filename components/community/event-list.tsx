'use client'

import { useState } from 'react'
import { Footprints, Activity, Flower2, Trophy, Layers } from 'lucide-react'
import type { OriseEvent, SportType } from '@/lib/events'
import { EventCard } from '@/components/community/event-card'
import { cn } from '@/lib/utils'

type FilterCategory = 'all' | SportType

const CATEGORY_TABS: { id: FilterCategory; label: string; icon: typeof Layers }[] = [
  { id: 'all', label: 'Tümü', icon: Layers },
  { id: 'running', label: 'Koşu', icon: Footprints },
  { id: 'volleyball', label: 'Voleybol', icon: Activity },
  { id: 'yoga', label: 'Yoga', icon: Flower2 },
  { id: 'tennis', label: 'Tenis', icon: Trophy },
]

export function EventList({ events }: { events: OriseEvent[] }) {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all')

  const filteredEvents =
    activeCategory === 'all'
      ? events
      : events.filter((e) => e.sport === activeCategory)

  return (
    <div className="space-y-8">
      {/* Spor Kategori Filtre Butonları */}
      <div className="flex flex-wrap items-center gap-2.5">
        {CATEGORY_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeCategory === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(249,115,22,0.35)] scale-105'
                  : 'border border-border/80 bg-secondary/70 text-muted-foreground hover:border-primary/50 hover:bg-secondary hover:text-foreground',
              )}
            >
              <Icon className={cn('h-3.5 w-3.5', isActive ? 'text-primary-foreground' : 'text-primary')} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Filtrelenmiş Etkinlik Listesi */}
      <div className="flex flex-col gap-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <div className="rounded-2xl border border-border/60 bg-card/40 p-12 text-center text-muted-foreground">
            Bu kategoride planlanmış aktif buluşma bulunmuyor.
          </div>
        )}
      </div>
    </div>
  )
}
