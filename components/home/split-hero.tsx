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
    badge: 'Aktif Kulüp Takvimi',
    badgeColor: 'bg-emerald-500',
    title: 'ORISE COMMUNITY',
    subtitle:
      'Tek başınalıktan çık, şehre karış. Birlikte hareket eden yeni nesil spor topluluğu.',
    cta: 'Kulübe Katıl',
    icon: Users,
    bgImage:
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1600&auto=format&fit=crop',
    align: 'left',
  },
  {
    id: 'store',
    href: '/store',
    badge: 'Sınırlı Üretim Drop',
    badgeColor: 'bg-primary',
    title: 'ORISE STORE',
    subtitle:
      'Kulüp kültüründen ilham alan özel tasarım spor ve sokak parçaları.',
    cta: 'Koleksiyonu İncele',
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
      {/* Büyütülmüş & Canlandırılmış Merkez Reaktör Logo */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 hidden -translate-x-1/2 -translate-y-1/2 md:block">
        {/* Arkadaki Glow / Parıltı */}
        <div
          className={cn(
            'absolute inset-0 -m-6 rounded-full bg-primary/25 blur-2xl transition-all duration-700',
            hovered ? 'scale-150 opacity-100 bg-primary/40' : 'scale-100 opacity-60',
          )}
        />

        <div
          className={cn(
            'relative flex h-20 w-20 items-center justify-center rounded-full border bg-background/95 backdrop-blur-xl transition-all duration-500 lg:h-24 lg:w-24 shadow-2xl',
            hovered === 'community'
              ? 'border-primary -translate-x-2 shadow-[-20px_0_50px_rgba(249,115,22,0.5)]'
              : hovered === 'store'
                ? 'border-primary translate-x-2 shadow-[20px_0_50px_rgba(249,115,22,0.5)]'
                : 'border-border/80 shadow-[0_0_35px_rgba(249,115,22,0.2)]',
          )}
        >
          <OriseMark
            className={cn(
              'h-10 w-10 transition-transform duration-500 lg:h-12 lg:w-12 text-primary',
              hovered === 'community' && '-rotate-12 scale-110',
              hovered === 'store' && 'rotate-12 scale-110',
            )}
          />
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
              'group relative flex w-full flex-col justify-center border-b border-border/40 p-8 transition-all duration-500 last:border-b-0 md:h-full md:w-1/2 md:border-b-0 md:border-r md:last:border-r-0',
              panel.align === 'left'
                ? 'md:p-14 md:pr-24 lg:p-24 lg:pr-32'
                : 'md:p-14 md:pl-24 lg:p-24 lg:pl-32',
            )}
          >
            {/* Sinematik & Canlı Arka Plan */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src={panel.bgImage}
                alt={panel.title}
                fill
                priority
                className={cn(
                  'object-cover grayscale contrast-125 transition-all duration-700 ease-out',
                  isHovered
                    ? 'scale-110 opacity-45 grayscale-0 contrast-110'
                    : 'scale-100 opacity-20',
                  isOtherHovered && 'opacity-10 blur-[1px]',
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
            </div>

            {/* Ambient Dinamik Glow */}
            <div
              className={cn(
                'pointer-events-none absolute inset-0 z-0 transition-opacity duration-700',
                isHovered ? 'opacity-100' : 'opacity-0',
              )}
            >
              <div
                className={cn(
                  'absolute h-[500px] w-[500px] rounded-full bg-primary/20 blur-[140px]',
                  panel.align === 'left'
                    ? '-left-24 top-1/2 -translate-y-1/2'
                    : '-right-24 top-1/2 -translate-y-1/2',
                )}
              />
            </div>

            {/* İçerik */}
            <div className="relative z-10 max-w-xl space-y-6">
              {/* Rozet */}
              <div>
                <div className="inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-secondary/80 px-4 py-1.5 text-xs font-semibold text-foreground backdrop-blur-md transition-all duration-300 group-hover:border-primary/60 group-hover:bg-secondary">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  <span className="opacity-30">|</span>
                  <span className={cn('h-2 w-2 rounded-full animate-pulse', panel.badgeColor)} />
                  <span>{panel.badge}</span>
                </div>
              </div>

              {/* Başlık */}
              <h2 className="font-display text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl text-foreground group-hover:text-white transition-colors duration-300">
                {panel.title}
              </h2>

              {/* Açıklama */}
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base group-hover:text-foreground/90 transition-colors duration-300">
                {panel.subtitle}
              </p>

              {/* Aksiyon Butonu */}
              <div className="pt-2">
                <div className="inline-flex items-center gap-3 rounded-full border border-border/80 bg-card/60 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-foreground backdrop-blur-md transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] group-hover:scale-105">
                  <span>{panel.cta}</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </section>
  )
}
