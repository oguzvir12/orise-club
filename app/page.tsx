import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, ShoppingBag, Users, Sparkles, ShieldCheck } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'ORISE CLUB — Teknik Spor Giyim & Mağaza',
  description: 'Kulüp kültüründen ilham alan özel tasarım teknik spor ve sokak giyimi koleksiyonu.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black">
      <SiteHeader />

      {/* HERO / SATIŞ ODAKLI ANA EKRAN */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden pt-32 pb-20 px-6 sm:px-10">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/store-hero.jpeg"
            alt="ORISE Store"
            fill
            priority
            className="object-cover opacity-35 contrast-125 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Harekete İlham Veren Teknik Tasarımlar</span>
          </div>

          <h1 className="font-sans text-5xl font-black tracking-tighter text-white sm:text-7xl lg:text-8xl leading-[1.02]">
            Şehri Hisset, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-300">
              Sınırları Zorla.
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
            Kulüp kültüründen ve sokak enerjisinden ilham alan özel koleksiyon parçalarımızı keşfedin.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/store"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:scale-105 transition-all cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Koleksiyonu İncele</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <Link
              href="/community"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full border border-white/20 bg-zinc-900/80 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md hover:border-primary hover:text-primary transition-all cursor-pointer"
            >
              <Users className="h-4 w-4 text-primary" />
              <span>Topluluk & Etkinlikler</span>
            </Link>
          </div>

          {/* SOSYAL MEDYA BAĞLANTILARI */}
          <div className="pt-6 flex items-center justify-center gap-6 text-xs font-mono uppercase tracking-widest text-zinc-400">
            <span className="text-zinc-600">|</span>
            <a href="https://www.instagram.com/orisecommunity/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
            <span className="text-zinc-600">·</span>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>
            <span className="text-zinc-600">|</span>
          </div>
        </div>
      </section>

      {/* GÜVENCE BÖLÜMÜ */}
      <section className="border-t border-white/10 bg-zinc-950/60 py-12">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-black/40">
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0"><ShieldCheck className="h-6 w-6" /></div>
            <div>
              <h4 className="font-bold text-xs uppercase text-white">Güvenli Alışveriş</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">İyzico korumalı güvenli ödeme altyapısı.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-black/40">
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0"><Users className="h-6 w-6" /></div>
            <div>
              <h4 className="font-bold text-xs uppercase text-white">Spor Topluluğu</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">Haftalık koşu ve antrenman buluşmaları.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-black/40">
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0"><Sparkles className="h-6 w-6" /></div>
            <div>
              <h4 className="font-bold text-xs uppercase text-white">Özel Drop Parçalar</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">Sınırlı sayıda üretilen teknik tekstil.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
