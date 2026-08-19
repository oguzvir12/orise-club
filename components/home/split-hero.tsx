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
    slogan: 'Kulübe Katıl · Ritmini Bul',
    title: 'ORISE COMMUNITY',
    subtitle:
      'Tek başınalıktan çık, şehre karış. Birlikte hareket eden yeni nesil spor topluluğu.',
    cta: 'Buluşmaları Keşfet',
    meta: 'RUN · TENNIS · PILATES · SAILING',
    icon: Users,
    bgImage: '/community-hero.jpeg',
    align: 'left',
  },
  {
    id: 'store',
    href: '/store',
    slogan: 'Hareket Kulübü & Tasarım Stüdyosu',
    title: 'ORISE STORE',
    subtitle:
      'Kulüp kültüründen ilham alan özel tasarım spor ve sokak parçaları.',
    cta: 'Koleksiyonu İncele',
    meta: 'TECHNICAL APPAREL · ATHLETIC WEAR',
    icon: ShoppingBag,
    bgImage: '/store-hero.jpeg',
    align: 'right',
  },
]

export function SplitHero() {
  const [hovered, setHovered] = useState<'community' | 'store' | null>(null)

  return (
    <section className="relative flex h-full w-full flex-col overflow-hidden md:flex-row bg-black select-none">
      {/* Merkez Dikey Ayrım Lazer Çizgisi */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-border/40 to-transparent md:block" />

      {/* Dinamik Sağa/Sola Kayan Merkez Çekirdek */}
      <div
        className={cn(
          'pointer-events-none absolute left-1/2 top-1/2 z-30 hidden -translate-y-1/2 transition-all duration-500 ease-out md:block',
          hovered === 'community'
            ? '-translate-x-[calc(50%+10px)]'
            : hovered === 'store'
              ? '-translate-x-[calc(50%-10px)]'
              : '-translate-x-1/2',
        )}
      >
        {/* Arkadaki Glow */}
        <div
          className={cn(
            'absolute inset-0 -m-6 rounded-full bg-primary/25 blur-2xl transition-all duration-500',
            hovered ? 'scale-125 opacity-100 bg-primary/40' : 'scale-100 opacity-40',
          )}
        />

        {/* Dış Pusula Halkası */}
        <div
          className={cn(
            'absolute inset-0 -m-2 rounded-full border border-primary/20 transition-all duration-500',
            hovered ? 'scale-110 border-primary/50 opacity-100' : 'scale-100 opacity-30',
          )}
        />

        {/* Ana Cam Disk */}
        <div
          className={cn(
            'relative flex h-20 w-20 items-center justify-center rounded-full border border-border/80 bg-background/95 backdrop-blur-2xl transition-all duration-500 lg:h-24 lg:w-24 shadow-[0_0_40px_rgba(0,0,0,0.9)]',
            hovered ? 'border-primary/80 scale-105 shadow-[0_0_30px_rgba(249,115,22,0.35)]' : '',
          )}
        >
          <OriseMark
            className={cn(
              'h-10 w-10 text-primary transition-transform duration-500 lg:h-11 lg:w-11',
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
              'group relative flex w-full flex-col items-center justify-center border-b border-border/30 p-8 text-center transition-all duration-500 last:border-b-0 md:h-full md:w-1/2 md:border-b-0 md:border-r md:last:border-r-0 md:p-12 lg:p-16',
            )}
          >
            {/* Arka Plan Görseli */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src={panel.bgImage}
                alt={panel.title}
                fill
                priority
                className={cn(
                  'object-cover transition-all duration-1000 ease-out',
                  isHovered
                    ? 'scale-105 opacity-40 grayscale-0 contrast-110'
                    : 'scale-100 opacity-20 grayscale contrast-125',
                  isOtherHovered && 'opacity-10 blur-[2px]',
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
            </div>

            {/* Yan Kenar Editoryal Damgası */}
            <div
              className={cn(
                'pointer-events-none absolute top-1/2 -translate-y-1/2 hidden 2xl:block text-[10px] font-mono tracking-[0.3em] text-muted-foreground/30 uppercase [writing-mode:vertical-rl] transition-colors duration-500 group-hover:text-primary/70',
                panel.align === 'left' ? 'left-8 rotate-180' : 'right-8',
              )}
            >
              {panel.meta}
            </div>

            {/* İçerik Bloğu (Her İki Panel Kendi İçinde Mükemmel Dengeli) */}
            <div className="relative z-10 flex w-full max-w-md flex-col items-center space-y-4">
              {/* Üst Manifesto Rozeti */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary backdrop-blur-md transition-all duration-300 group-hover:border-primary group-hover:bg-primary/20">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>{panel.slogan}</span>
                </div>
              </div>

              {/* Başlık */}
              <h2 className="font-sans text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground transition-all duration-300 group-hover:text-white">
                {panel.title}
              </h2>

              {/* Açıklama */}
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty transition-colors duration-300 group-hover:text-foreground/90">
                {panel.subtitle}
              </p>

              {/* Aksiyon Butonu */}
              <div className="pt-2">
                <div className="inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-secondary/80 px-7 py-3 text-xs font-bold tracking-wider uppercase text-foreground backdrop-blur-md transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] group-hover:scale-105">
                  <Icon className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" />
                  <span>{panel.cta}</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </section>
  )
}
