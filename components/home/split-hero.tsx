'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Mail,
} from 'lucide-react'
import { OriseMark } from '@/components/logo'
import { cn } from '@/lib/utils'

const PANELS = [
  {
    id: 'community',
    href: '/community',
    slogan: 'KULÜBE KATIL · RİTMİNİ BUL',
    title: 'TOPLULUK',
    subtitle:
      'Şehrin enerjisini birlikte yükselten haftalık koşu, yoga ve açık hava antrenman buluşmaları.',
    cta: 'Etkinlikleri Keşfet',
    meta: 'KOŞU · VOLEYBOL · TENİS · PİLATES · YELKEN',
    icon: Sparkles,
    bgImage: '/community-hero.jpeg',
    align: 'left',
    subText: 'Haftalık Antrenman & Atölyeler',
  },
  {
    id: 'store',
    href: '/store',
    slogan: 'HAREKET KULÜBÜ & STÜDYO',
    title: 'MAĞAZA',
    subtitle:
      'Kulüp kültüründen ilham alan özel tasarım teknik spor ve sokak giyimi e-ticaret koleksiyonu.',
    cta: 'Koleksiyonu İncele',
    meta: 'TEKNİK GİYİM · ATLETİK STİL',
    icon: ShoppingBag,
    bgImage: '/store-hero.jpeg',
    align: 'right',
    subText: 'Özel Seri Teknik Drop Parçalar',
    primary: true,
  },
]

export function SplitHero() {
  const [hovered, setHovered] = useState<'community' | 'store' | null>(null)

  return (
    <section className="relative flex h-full w-full flex-col overflow-hidden md:flex-row bg-black select-none font-sans">
      {/* Merkez Dikey Ayrım Lazer Çizgisi */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent md:block" />

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
        <div
          className={cn(
            'absolute inset-0 -m-6 rounded-full bg-primary/30 blur-2xl transition-all duration-500',
            hovered ? 'scale-125 opacity-100 bg-primary/50' : 'scale-100 opacity-50',
          )}
        />
        <div
          className={cn(
            'absolute inset-0 -m-2 rounded-full border border-primary/30 transition-all duration-500',
            hovered ? 'scale-110 border-primary/70 opacity-100' : 'scale-100 opacity-40',
          )}
        />
        <div
          className={cn(
            'relative flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-black/90 backdrop-blur-2xl transition-all duration-500 lg:h-24 lg:w-24 shadow-[0_0_60px_rgba(0,0,0,0.95)]',
            hovered ? 'border-primary scale-105 shadow-[0_0_40px_rgba(249,115,22,0.4)]' : '',
          )}
        >
          <OriseMark
            className={cn(
              'h-10 w-10 text-primary transition-transform duration-500 lg:h-11 lg:w-11',
              hovered ? 'scale-110 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]' : 'scale-100',
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
              "group relative flex w-full flex-col items-center justify-center border-b border-white/5 p-8 text-center transition-all duration-700 last:border-b-0 md:h-full md:border-b-0 md:border-r md:last:border-r-0 md:p-12 lg:p-16 pb-28 md:pb-28",
              panel.primary ? "md:w-[52%]" : "md:w-[48%]"
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
                    ? 'scale-105 opacity-45 grayscale-0 contrast-115'
                    : panel.primary
                      ? 'scale-100 opacity-25 grayscale contrast-125'
                      : 'scale-100 opacity-20 grayscale contrast-125',
                  isOtherHovered && 'opacity-10 blur-[3px]',
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
            </div>

            {/* Yan Kenar Editoryal Damgası */}
            <div
              className={cn(
                'pointer-events-none absolute top-1/2 -translate-y-1/2 hidden 2xl:block text-[10px] font-mono tracking-[0.35em] text-zinc-500 uppercase [writing-mode:vertical-rl] transition-colors duration-500 group-hover:text-primary',
                panel.align === 'left' ? 'left-8 rotate-180' : 'right-8',
              )}
            >
              {panel.meta}
            </div>

            {/* İçerik Bloğu */}
            <div className="relative z-10 flex w-full max-w-md flex-col items-center space-y-4">
              <div>
                <div className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] backdrop-blur-md transition-all duration-300",
                  panel.primary 
                    ? "border border-primary/50 bg-primary/20 text-primary shadow-[0_0_20px_rgba(249,115,22,0.3)]" 
                    : "border border-white/20 bg-white/5 text-zinc-300 group-hover:border-primary/40 group-hover:text-primary"
                )}>
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
                <div className={cn(
                  "inline-flex items-center gap-2.5 rounded-full px-7 py-3 text-xs font-bold tracking-wider uppercase backdrop-blur-md transition-all duration-300 group-hover:scale-105",
                  panel.primary
                    ? "border border-primary bg-primary text-black shadow-[0_0_35px_rgba(249,115,22,0.6)] font-black"
                    : "border border-white/20 bg-zinc-900/80 text-zinc-100 group-hover:border-primary group-hover:bg-primary group-hover:text-black"
                )}>
                  <Icon className={cn("h-4 w-4 transition-colors", panel.primary ? "text-black" : "text-primary group-hover:text-black")} />
                  <span>{panel.cta}</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>

              {/* Temiz, Emojisiz Editoryal Alt Etiket */}
              <div className="pt-1 text-[10px] font-mono text-zinc-500 tracking-[0.25em] uppercase">
                {panel.subText}
              </div>
            </div>
          </Link>
        )
      })}

      {/* FOOTER & İLETİŞİM / SOSYAL MEDYA / YASAL SAYFA YÖNLENDİRMELERİ */}
      <footer className="absolute bottom-0 inset-x-0 z-40 flex flex-col xl:flex-row items-center justify-between gap-3 px-6 sm:px-10 py-2.5 bg-black/95 border-t border-white/10 backdrop-blur-xl text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="font-bold text-white tracking-wider">ORISE CLUB</span>
          <span className="text-zinc-600">/</span>
          <span className="text-[10px] tracking-widest text-primary uppercase">ATHLETICS & STUDIO</span>
        </div>

        {/* Yasal Sayfa Bağlantıları ve E-postalar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-[11px]">
          <Link href="/gizlilik" className="hover:text-primary transition-colors underline decoration-zinc-700 underline-offset-4 uppercase">
            Gizlilik Politikası
          </Link>
          <span className="text-zinc-700">·</span>
          <Link href="/mesafeli-satis" className="hover:text-primary transition-colors underline decoration-zinc-700 underline-offset-4 uppercase">
            Mesafeli Satış
          </Link>
          <span className="text-zinc-700">·</span>
          <Link href="/iade-kosullari" className="hover:text-primary transition-colors underline decoration-zinc-700 underline-offset-4 uppercase">
            İptal & İade
          </Link>
          <span className="text-zinc-700">·</span>
          <a href="mailto:community@oriseclub.com" className="hover:text-primary transition-colors inline-flex items-center gap-1 text-zinc-300">
            <Mail className="h-3 w-3 text-primary" /> community@oriseclub.com
          </a>
          <span className="text-zinc-700">·</span>
          <a href="mailto:store@oriseclub.com" className="hover:text-primary transition-colors inline-flex items-center gap-1 text-zinc-300">
            <Mail className="h-3 w-3 text-primary" /> store@oriseclub.com
          </a>
        </div>

        {/* Sosyal Medya Hesapları & Güvenlik Rozetleri */}
        <div className="flex items-center gap-3 shrink-0">
          <a href="https://www.instagram.com/orisecommunity" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors inline-flex items-center gap-1 text-[11px]">
            <svg className="h-3.5 w-3.5 text-primary fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> @orisecommunity
          </a>
          <span className="text-zinc-700">·</span>
          <a href="https://www.instagram.com/orisestore" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors inline-flex items-center gap-1 text-[11px]">
            <svg className="h-3.5 w-3.5 text-primary fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> @orisestore
          </a>
          <span className="text-zinc-700">·</span>
          <a href="https://www.linkedin.com/company/orisecommunity/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors inline-flex items-center gap-1 text-[11px]">
            <svg className="h-3.5 w-3.5 text-primary fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> LinkedIn
          </a>

          <div className="hidden sm:flex items-center bg-zinc-900 border border-white/10 px-2 py-0.5 rounded ml-1">
            <Image 
              src="/images/logo_band_white.svg" 
              alt="İyzico ve Güvenli Ödeme Logoları" 
              width={75} 
              height={15} 
              className="object-contain h-3.5 w-auto"
            />
          </div>
        </div>
      </footer>
    </section>
  )
}
