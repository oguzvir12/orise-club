'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowUpRight, ShoppingBag, Users, Sparkles, Mail } from 'lucide-react'
import { OriseMark } from '@/components/logo'
import { cn } from '@/lib/utils'

const PANELS = [
  {
    id: 'community',
    href: '/community',
    slogan: 'KULÜBE KATIL · RİTMİNİ BUL',
    title: 'TOPLULUK',
    subtitle:
      'Tek başınalıktan çık, şehre karış. Birlikte hareket eden yeni nesil spor topluluğu.',
    cta: 'Buluşmaları Keşfet',
    meta: 'KOŞU · VOLEYBOL · TENİS · PİLATES · YELKEN',
    icon: Users,
    bgImage: '/community-hero.jpeg',
    align: 'left',
  },
  {
    id: 'store',
    href: '/store',
    slogan: 'HAREKET KULÜBÜ & STÜDYO',
    title: 'MAĞAZA',
    subtitle:
      'Kulüp kültüründen ilham alan özel tasarım teknik spor ve sokak parçaları.',
    cta: 'Koleksiyonu İncele',
    meta: 'TEKNİK GİYİM · ATLETİK STİL',
    icon: ShoppingBag,
    bgImage: '/store-hero.jpeg',
    align: 'right',
  },
]

export function SplitHero() {
  const [hovered, setHovered] = useState<'community' | 'store' | null>(null)

  return (
    <section className="relative flex h-full w-full flex-col overflow-hidden md:flex-row bg-black select-none font-sans">
      {/* Merkez Dikey Ayrım Çizgisi */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent md:block" />

      {/* Dinamik Merkez Çekirdek */}
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
        {/* Glow */}
        <div
          className={cn(
            'absolute inset-0 -m-6 rounded-full bg-primary/25 blur-2xl transition-all duration-500',
            hovered ? 'scale-125 opacity-100 bg-primary/45' : 'scale-100 opacity-40',
          )}
        />

        {/* Pusula Çemberi */}
        <div
          className={cn(
            'absolute inset-0 -m-2 rounded-full border border-primary/25 transition-all duration-500',
            hovered ? 'scale-110 border-primary/50 opacity-100' : 'scale-100 opacity-30',
          )}
        />

        {/* Ana Cam Disk */}
        <div
          className={cn(
            'relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-black/85 backdrop-blur-2xl transition-all duration-500 lg:h-24 lg:w-24 shadow-[0_0_50px_rgba(0,0,0,0.9)]',
            hovered ? 'border-primary/80 scale-105 shadow-[0_0_35px_rgba(249,115,22,0.35)]' : '',
          )}
        >
          <OriseMark
            className={cn(
              'h-10 w-10 text-primary transition-transform duration-500 lg:h-11 lg:w-11',
              hovered ? 'scale-110 drop-shadow-[0_0_12px_rgba(249,115,22,0.7)]' : 'scale-100',
            )}
          />
        </div>
      </div>

      {/* Sol ve Sağ Paneller */}
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
            className="group relative flex w-full flex-col items-center justify-center border-b border-white/5 p-8 text-center transition-all duration-500 last:border-b-0 md:h-full md:w-1/2 md:border-b-0 md:border-r md:last:border-r-0 md:p-12 lg:p-16 pb-24 md:pb-24"
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
                    ? 'scale-105 opacity-40 grayscale-0 contrast-115'
                    : 'scale-100 opacity-20 grayscale contrast-125',
                  isOtherHovered && 'opacity-10 blur-[2px]',
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
            </div>

            {/* Yan Kenar Tipografisi */}
            <div
              className={cn(
                'pointer-events-none absolute top-1/2 -translate-y-1/2 hidden 2xl:block text-[10px] font-mono tracking-[0.35em] text-zinc-600 uppercase [writing-mode:vertical-rl] transition-colors duration-500 group-hover:text-primary/80',
                panel.align === 'left' ? 'left-8 rotate-180' : 'right-8',
              )}
            >
              {panel.meta}
            </div>

            {/* İçerik Bloğu */}
            <div className="relative z-10 flex w-full max-w-md flex-col items-center space-y-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-primary backdrop-blur-md transition-all duration-300 group-hover:border-primary group-hover:bg-primary/20">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span>{panel.slogan}</span>
                </div>
              </div>

              <h2 className="whitespace-nowrap font-sans text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl transition-all duration-300 drop-shadow-md">
                {panel.title}
              </h2>

              <p className="max-w-sm text-sm font-normal leading-relaxed text-zinc-300/90 text-pretty transition-colors duration-300 group-hover:text-white drop-shadow">
                {panel.subtitle}
              </p>

              <div className="pt-2">
                <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-zinc-900/80 px-7 py-3 text-xs font-bold tracking-wider uppercase text-zinc-100 backdrop-blur-md transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-black group-hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] group-hover:scale-105">
                  <Icon className="h-4 w-4 text-primary group-hover:text-black transition-colors" />
                  <span>{panel.cta}</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>
          </Link>
        )
      })}

      {/* BELİRGİN & ÇAĞRI ODAKLI FOOTER BAR */}
      <footer className="absolute bottom-0 inset-x-0 z-40 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 sm:px-10 py-3.5 bg-black/80 border-t border-white/10 backdrop-blur-xl text-xs font-mono text-zinc-400 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        {/* Sol: Telif & Marka Damgası */}
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-white tracking-wider">ORISE CLUB</span>
          <span className="text-zinc-600">/</span>
          <span className="text-[11px] tracking-widest text-primary uppercase">ATHLETICS & STUDIO</span>
        </div>

        {/* Sağ: Topluluğa Katıl & Mağazayı Keşfet Butonları */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Topluluğa Katıl */}
          <a
            href="https://www.instagram.com/orisecommunity/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/90 px-4 py-1.5 text-xs text-zinc-200 backdrop-blur-md transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:text-white hover:shadow-[0_0_15px_rgba(249,115,22,0.3)]"
          >
            <svg
              className="h-3.5 w-3.5 fill-current text-primary transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324Zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
            </svg>
            <span className="font-semibold text-white group-hover:text-primary">Topluluğa Katıl</span>
            <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 font-normal">(@orisecommunity)</span>
          </a>

          {/* Mağazayı Keşfet */}
          <a
            href="https://www.instagram.com/orisestore/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/90 px-4 py-1.5 text-xs text-zinc-200 backdrop-blur-md transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:text-white hover:shadow-[0_0_15px_rgba(249,115,22,0.3)]"
          >
            <ShoppingBag className="h-3.5 w-3.5 text-primary transition-transform group-hover:scale-110" />
            <span className="font-semibold text-white group-hover:text-primary">Mağazayı Keşfet</span>
            <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 font-normal">(@orisestore)</span>
          </a>

          {/* İletişim & LinkedIn */}
          <div className="flex items-center gap-2 pl-1 border-l border-white/10">
            <a
              href="mailto:oguzvir12@gmail.com"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-400 transition-colors hover:border-primary hover:text-white"
              title="E-posta İletişim"
            >
              <Mail className="h-3.5 w-3.5" />
            </a>

            <a
              href="https://linkedin.com/in/oguzhanbeydogan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-400 transition-colors hover:border-primary hover:text-white"
              title="LinkedIn"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28M7.85 18.5V10.13H5.06V18.5h2.79Z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </section>
  )
}
