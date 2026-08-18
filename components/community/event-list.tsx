'use client'

import { useState } from 'react'
import { Footprints, Activity, Flower2, Trophy, Layers } from 'lucide-react'
import type { OriseEvent, SportType } from '@/lib/events'
import { EventCard } from '@/components/community/event-card'
import { cn } from '@/lib/utils'

type FilterCategory = 'all' | SportType

const CATEGORIES: { id: FilterCategory; label: string; icon: typeof Layers }[] = [
  { id: 'all', label: 'Tüm Buluşmalar', icon: Layers },
  { id: 'running', label: 'Koşu', icon: Footprints },
  { id: 'volleyball', label: 'Voleybol', icon: Activity },
  { id: 'yoga', label: 'Yoga', icon: Flower2 },
  { id: 'tennis', label: 'Tenis', icon: Trophy },
]

export function EventList({ events }: { events: OriseEvent[] }) {
  const [activeTab, setActiveTab] = useState<FilterCategory>('all')

  const filteredEvents =
    activeTab === 'all'
      ? events
      : events.filter((evt) => evt.sport === activeTab)

  return (
    <div className="space-y-8">
      {/* Spor Branşı Filtre Hapları */}
      <div className="flex flex-wrap items-center gap-2.5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          const isActive = activeTab === cat.id
          const count =
            cat.id === 'all'
              ? events.length
              : events.filter((e) => e.sport === cat.id).length

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(cat.id)}
              className={cn(
                'group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-[0_0_25px_rgba(249,115,22,0.4)] scale-105'
                  : 'border border-border/80 bg-secondary/60 text-muted-foreground hover:border-primary/50 hover:bg-secondary hover:text-foreground',
              )}
            >
              <Icon className={cn('h-3.5 w-3.5', isActive ? 'text-primary-foreground' : 'text-primary')} />
              <span>{cat.label}</span>
              <span
                className={cn(
                  'ml-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold',
                  isActive
                    ? 'bg-black/30 text-white'
                    : 'bg-card text-muted-foreground group-hover:text-foreground',
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Dinamik Etkinlik Kartları */}
      <div className="flex flex-col gap-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-border/80 bg-card/30 p-12 text-center text-muted-foreground">
            Bu branşta şu anda planlanmış aktif bir buluşma bulunmuyor.
          </div>
        )}
      </div>
    </div>
  )
}
