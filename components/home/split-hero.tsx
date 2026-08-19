'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowUpRight, ShoppingBag, Users, Sparkles } from 'lucide-react'
import { OriseMark } from '@/components/logo'
import { cn } from '@/lib/utils'

const PANELS = [
  {
    id: 'community',
    href: '/community',
    slogan: 'Kulübe Katıl, Ritmini Bul',
    title: 'ORISE COMMUNITY',
    subtitle:
      'Tek başınalıktan çık, şehre karış. Birlikte hareket eden yeni nesil spor topluluğu.',
    cta: 'Buluşmaları Keşfet',
    meta: 'RUN · TENNIS · PILATES · SAILING',
    icon: Users,
    bgImage:
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1600&auto=format&fit=crop',
    align: 'left',
  },
  {
    id: 'store',
    href: '/store',
    slogan: 'Bir Markadan Fazlası, Bir Hareket Kulübü',
    title: 'ORISE STORE',
    subtitle:
      'Kulüp kültüründen ilham alan özel tasarım spor ve sokak parçaları.',
    cta: 'Koleksiyonu İncele',
    meta: 'TECHNICAL APPAREL · ATHLETIC WEAR',
    icon: ShoppingBag,
    bgImage:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop',
    align: 'right',
  },
]

export function SplitHero() {
  const [hovered, setHovered] = useState<'community' | 'store' | null>(null)

  return (
    <section className="relative flex h-full w-full flex-col overflow-hidden md:flex-row bg-black select-none">
      {/* Merkez Dikey Ayrım Lazer Çizgisi */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-border/60 to-transparent md:block" />

      {/* Lüks Kinetik Merkez Çekirdek (Dönme/Yalpalama Yok, Kusursuz Denge) */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 hidden -translate-x-1/2 -translate-y-1/2 md:block">
        {/* Arkadaki Dinamik Işık Huzmesi */}
        <div
          className={cn(
            'absolute inset-0 -m-10 rounded-full blur-3xl transition-all duration-700 ease-out',
            hovered === 'community'
              ? '-translate-x-6 bg-primary/40 opacity-100 scale-125'
              : hovered === 'store'
                ? 'translate-x-6 bg-primary/40 opacity-100 scale-125'
                : 'bg-primary/20 opacity-60 scale-100',
          )}
        />

        {/* Dış İnce Pusula Halkası */}
        <div
          className={cn(
            'absolute inset-0 -m-2.5 rounded-full border border-primary/20 transition-all duration-700',
            hovered ? 'scale-110 border-primary/50 opacity-100' : 'scale-100 opacity-40',
          )}
        />

        {/* Ana Cam Disk */}
        <div
          className={cn(
            'relative flex h-20 w-20 items-center justify-center rounded-full border border-border/80 bg-background/95 backdrop-blur-2xl transition-all duration-500 lg:h-24 lg:w-24 shadow-[0_0_50px_rgba(0,0,0,0.9)]',
            hovered
              ? 'border-primary/80 scale-105 shadow-[0_0_35px_rgba(249,115,22,0.35)]'
              : 'hover:border-border',
          )}
        >
          <OriseMark
            className={cn(
              'h-10 w-10 text-primary transition-all duration-500 lg:h-11 lg:w-11',
              hovered ? 'scale-110 drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]' : 'scale-100',
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
              'group relative flex flex-col justify-center border-b border-border/30 p-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] last:border-b-0 md:h-full md:border-b-0 md:border-r md:last:border-r-0',
              hovered === panel.id ? 'md:w-[54%]' : hovered ? 'md:w-[46%]' : 'md:w-1/2',
              panel.align === 'left'
                ? 'md:p-14 md:pr-24 lg:p-24 lg:pr-32'
                : 'md:p-14 md:pl-24 lg:p-24 lg:pl-32',
            )}
          >
            {/* Arka Plan Sinematik Görsel */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src={panel.bgImage}
                alt={panel.title}
                fill
                priority
                className={cn(
                  'object-cover transition-all duration-1000 ease-out',
                  isHovered
                    ? 'scale-105 opacity-45 grayscale-0 contrast-110'
                    : 'scale-100 opacity-20 grayscale contrast-125',
                  isOtherHovered && 'opacity-10 blur-[2px]',
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
            </div>

            {/* Ambient Radial Işık */}
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

            {/* Yan Kenar Editoryal Damgası */}
            <div
              className={cn(
                'pointer-events-none absolute top-1/2 -translate-y-1/2 hidden xl:block text-[10px] font-mono tracking-[0.3em] text-muted-foreground/30 uppercase [writing-mode:vertical-rl] transition-colors duration-500 group-hover:text-primary/70',
                panel.align === 'left' ? 'left-6 rotate-180' : 'right-6',
              )}
            >
              {panel.meta}
            </div>

            {/* İçerik Bloğu */}
            <div className="relative z-10 max-w-lg space-y-4">
              {/* Üst Editoryal Manifesto Rozeti */}
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary backdrop-blur-md transition-all duration-300 group-hover:border-primary group-hover:bg-primary/20">
                  <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                  <span>{panel.slogan}</span>
                </div>
              </div>

              {/* Başlık */}
              <h2 className="font-display text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-white">
                {panel.title}
              </h2>

              {/* Açıklama */}
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base transition-colors duration-300 group-hover:text-foreground/90">
                {panel.subtitle}
              </p>

              {/* Aksiyon Butonu */}
              <div className="pt-4">
                <div className="inline-flex items-center gap-3 rounded-full border border-border/80 bg-secondary/80 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-foreground backdrop-blur-md transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_30px_rgba(249,115,22,0.45)] group-hover:scale-105">
                  <Icon className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" />
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
