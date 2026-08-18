'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowUpRight, ShoppingBag, Users } from 'lucide-react'
import { OriseMark } from '@/components/logo'
import { cn } from '@/lib/utils'

const PANELS = [
  {
    id: 'community',
    href: '/community',
    badge: 'Haftalık Etkinlikler & Koşu',
    badgeColor: 'bg-emerald-500',
    eyebrow: 'Topluluk & Hareket',
    title: 'ORISE COMMUNITY',
    subtitle:
      'Koşu, voleybol, yoga, tenis ve antrenman buluşmaları. Şehrin enerjisini birlikte yükselten kulüp hareketi.',
    cta: 'Topluluğa Katıl & Takvim',
    icon: Users,
    bgImage:
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1600&auto=format&fit=crop',
    align: 'left',
  },
  {
    id: 'store',
    href: '/store',
    badge: 'Yeni Drop — 2026 Serisi',
    badgeColor: 'bg-primary',
    eyebrow: 'Koleksiyon & Drop',
    title: 'ORISE STORE',
    subtitle:
      'Kulübe özel teknik kumaşlar, 280-450 GSM gramajlı ağır parçalar ve sınırlı sayıda drop koleksiyonları.',
    cta: 'Koleksiyonu Keşfet',
    icon: ShoppingBag,
    bgImage:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop',
    align: 'right',
  },
]

export function SplitHero() {
  const [hovered, setHovered] = useState<'community' | 'store' | null>(null)

  return (
    <section className="relative flex h-full w-full flex-col overflow-hidden md:flex-row">
      {/* Merkez Logo */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 hidden -translate-x-1/2 -translate-y-1/2 md:block">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border/80 bg-background/90 shadow-[0_0_50px_rgba(249,115,22,0.25)] backdrop-blur-md">
          <OriseMark className="h-10 w-10 text-primary" />
        </div>
      </div>

      {PANELS.map((panel) => {
        const Icon = panel.icon
        const isHovered = hovered === panel.id
        const isOtherHovered = hovered !== null && hovered !== panel.id

        return (
          <Link
            key={panel.href}
            href={panel.href}
            onMouseEnter={() => setHovered(panel.id as 'community' | 'store')}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              'group relative flex flex-col justify-center border-b border-border/40 p-8 transition-all duration-700 ease-out last:border-b-0 md:h-full md:border-b-0 md:border-r md:p-14 lg:p-20 md:last:border-r-0',
              hovered === null
                ? 'md:w-1/2'
                : isHovered
                  ? 'md:w-[56%]'
                  : 'md:w-[44%]',
            )}
          >
            {/* Sinematik Arka Plan Görseli & Gradyan Filtresi */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src={panel.bgImage}
                alt={panel.title}
                fill
                priority
                className={cn(
                  'object-cover grayscale contrast-125 transition-transform duration-1000 ease-out',
                  isHovered ? 'scale-105 opacity-30' : 'scale-100 opacity-20',
                  isOtherHovered && 'opacity-10',
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
            </div>

            {/* Ambient Glow */}
            <div className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
              <div
                className={cn(
                  'absolute h-[420px] w-[420px] rounded-full bg-primary/15 blur-[120px]',
                  panel.align === 'left'
                    ? '-left-20 top-1/2 -translate-y-1/2'
                    : '-right-20 top-1/2 -translate-y-1/2',
                )}
              />
            </div>

            {/* İçerik Kutusu */}
            <div className="relative z-10 max-w-lg">
              {/* Canlı Durum Rozeti */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/80 px-3 py-1 text-[11px] font-medium text-foreground backdrop-blur-md">
                <span className={cn('h-1.5 w-1.5 rounded-full animate-pulse', panel.badgeColor)} />
                {panel.badge}
              </div>

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-secondary/90 text-primary backdrop-blur-sm transition-all duration-500 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground md:h-14 md:w-14">
                <Icon className="h-5 w-5 md:h-6 md:w-6" />
              </div>

              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                {panel.eyebrow}
              </p>
              <h2 className="font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                {panel.title}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
                {panel.subtitle}
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-foreground transition-colors group-hover:text-primary md:mt-8">
                {panel.cta}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </Link>
        )
      })}
    </section>
  )
}
