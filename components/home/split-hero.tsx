'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowUpRight, Users, ShoppingBag, Sparkles, Mail, X, ShieldCheck } from 'lucide-react'
import { OriseMark } from '@/components/logo'
import { cn } from '@/lib/utils'

const PANELS = [
  {
    id: 'community',
    href: '/community',
    slogan: 'KULÜBE KATIL · RİTMİNİ BUL',
    title: 'TOPLULUK',
    subtitle: 'Tek başınalıktan çık, şehre karış. Birlikte hareket eden yeni nesil spor topluluğu.',
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
    subtitle: 'Kulüp kültüründen ilham alan özel tasarım teknik spor ve sokak parçaları.',
    cta: 'Koleksiyonu İncele',
    meta: 'TEKNİK GİYİM · ATLETİK STİL',
    icon: ShoppingBag,
    bgImage: '/store-hero.jpeg',
    align: 'right',
  },
]

const LEGAL_DOCS: Record<string, { title: string; content: string }> = {
  kvkk: {
    title: 'KVKK Aydınlatma & Açık Rıza Metni',
    content: '6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca verileriniz güvenle saklanmaktadır.',
  },
  privacy: {
    title: 'Gizlilik ve Çerez Politikası',
    content: 'Kullanıcı gizliliğine önem verilir, teknik çerezler kullanılır.',
  },
  terms: {
    title: 'Mesafeli Satış ve Hizmet Sözleşmesi',
    content: 'Ürün siparişleri ve etkinlik katılımlarının şartlarını düzenler.',
  },
  refund: {
    title: 'İptal ve İade Koşulları',
    content: '14 gün içinde iade imkanı sunulur.',
  },
}

export function SplitHero() {
  const [hovered, setHovered] = useState<'community' | 'store' | null>(null)
  const [activeLegalModal, setActiveLegalModal] = useState<string | null>(null)

  return (
    <section className="relative flex h-full w-full flex-col overflow-hidden md:flex-row bg-black select-none font-sans pt-16">
      
      {/* Merkez Dikey Ayrım Çizgisi */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent md:block" />

      {/* Dinamik Merkez Çekirdek Logo */}
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
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-black/85 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] lg:h-24 lg:w-24">
          <OriseMark className="h-10 w-10 text-primary lg:h-11 lg:w-11" />
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
            className="group relative flex w-full flex-col items-center justify-center border-b border-white/5 p-8 text-center transition-all duration-500 last:border-b-0 md:h-full md:w-1/2 md:border-b-0 md:border-r md:last:border-r-0 md:p-12 lg:p-16 pb-28 md:pb-28"
          >
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image
                src={panel.bgImage}
                alt={panel.title}
                fill
                priority
                className={cn(
                  'object-cover transition-all duration-1000 ease-out',
                  isHovered ? 'scale-105 opacity-40 grayscale-0 contrast-115' : 'scale-100 opacity-20 grayscale contrast-125',
                  isOtherHovered && 'opacity-10 blur-[2px]',
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
            </div>

            <div
              className={cn(
                'pointer-events-none absolute top-1/2 -translate-y-1/2 hidden 2xl:block text-[10px] font-mono tracking-[0.35em] text-zinc-600 uppercase [writing-mode:vertical-rl] transition-colors duration-500 group-hover:text-primary/80',
                panel.align === 'left' ? 'left-8 rotate-180' : 'right-8',
              )}
            >
              {panel.meta}
            </div>

            <div className="relative z-10 flex w-full max-w-md flex-col items-center space-y-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-primary backdrop-blur-md">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span>{panel.slogan}</span>
                </div>
              </div>

              <h2 className="whitespace-nowrap font-sans text-4xl font-black tracking-tighter text-white sm:text-5xl lg:text-6xl drop-shadow-md">
                {panel.title}
              </h2>

              <p className="max-w-sm text-sm font-normal leading-relaxed text-zinc-300/90 drop-shadow">
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

      {/* FOOTER */}
      <footer className="absolute bottom-0 inset-x-0 z-40 flex flex-col sm:flex-row items-center justify-between gap-4 px-6 sm:px-10 py-3.5 bg-black/80 border-t border-white/10 backdrop-blur-xl text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-white tracking-wider">ORISE CLUB</span>
          <span className="text-zinc-600">/</span>
          <span className="text-[11px] tracking-widest text-primary uppercase">ATHLETICS & STUDIO</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
          {['kvkk', 'privacy', 'terms', 'refund'].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveLegalModal(key)}
              className="hover:text-primary transition-colors underline decoration-zinc-700 underline-offset-4 cursor-pointer uppercase"
            >
              {key === 'kvkk' ? 'KVKK' : key === 'privacy' ? 'Gizlilik' : key === 'terms' ? 'Mesafeli Satış' : 'İade Koşulları'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a href="https://www.instagram.com/orisecommunity/" target="_blank" rel="noopener noreferrer" className="hover:text-primary text-xs">Topluluk</a>
          <span>·</span>
          <a href="https://www.instagram.com/orisestore/" target="_blank" rel="noopener noreferrer" className="hover:text-primary text-xs">Mağaza</a>
        </div>
      </footer>

      {/* HUKUKİ METİN MODALİ */}
      {activeLegalModal && LEGAL_DOCS[activeLegalModal] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md" onClick={() => setActiveLegalModal(null)}>
          <div className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 space-y-4 text-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-primary font-bold text-sm uppercase flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Yasal Bilgilendirme</span>
              <button onClick={() => setActiveLegalModal(null)} className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-black cursor-pointer"><X className="h-4 w-4" /></button>
            </div>
            <h3 className="text-xl font-black">{LEGAL_DOCS[activeLegalModal].title}</h3>
            <p className="text-xs text-zinc-300">{LEGAL_DOCS[activeLegalModal].content}</p>
          </div>
        </div>
      )}
    </section>
  )
}
