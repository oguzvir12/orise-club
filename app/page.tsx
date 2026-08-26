import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, ShoppingBag, Users, Sparkles, ShieldCheck, Flame, Compass } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'ORISE CLUB — Teknik Spor Giyim & Mağaza',
  description: 'Kulüp kültüründen ilham alan özel tasarım teknik spor ve sokak giyimi koleksiyonu.',
}

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black overflow-x-hidden">
      <SiteHeader />

      {/* HERO / SATIŞ ODAKLI GÖZ ALICI ANA EKRAN */}
      <section className="relative flex min-h-[88vh] items-center justify-center overflow-hidden pt-32 pb-24 px-6 sm:px-10">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/store-hero.jpeg"
            alt="ORISE Store"
            fill
            priority
            className="object-cover opacity-35 grayscale contrast-125 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.1)_0,transparent_70%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center space-y-8">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/40 bg-primary/10 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.25em] text-primary backdrop-blur-md shadow-[0_0_25px_rgba(249,115,22,0.25)]">
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span>Harekete İlham Veren Teknik Tasarımlar</span>
          </div>

          <h1 className="font-sans text-5xl font-black tracking-tighter text-white sm:text-7xl lg:text-8xl leading-[1.02]">
            Şehri Hisset, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-300 drop-shadow-sm">
              Sınırları Zorla.
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
            Kulüp kültüründen ve sokak enerjisinden ilham alan özel koleksiyon parçalarımızı keşfedin.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/store"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-primary px-9 py-4 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_35px_rgba(249,115,22,0.45)] hover:scale-105 hover:bg-orange-500 transition-all cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Koleksiyonu İncele</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <Link
              href="/community"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full border border-white/20 bg-zinc-900/80 px-9 py-4 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md hover:border-primary hover:text-primary transition-all cursor-pointer"
            >
              <Users className="h-4 w-4 text-primary" />
              <span>Toplulukla Tanış & Etkinlikler</span>
            </Link>
          </div>
        </div>
      </section>

      {/* GÜVENCE VE KALİTE VİTRİNİ (ESTETİK GRID) */}
      <section className="relative z-10 border-t border-white/10 bg-gradient-to-b from-zinc-950/80 to-black py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="group relative rounded-3xl border border-white/10 bg-zinc-900/40 p-8 backdrop-blur-xl transition-all hover:border-primary/50 hover:bg-zinc-900/80">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/30 text-primary mb-5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="font-sans text-sm font-bold uppercase text-white tracking-wider">Güvenli Alışveriş</h4>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">İyzico korumalı güvenli ödeme altyapısı.</p>
          </div>

          <div className="group relative rounded-3xl border border-white/10 bg-zinc-900/40 p-8 backdrop-blur-xl transition-all hover:border-primary/50 hover:bg-zinc-900/80">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/30 text-primary mb-5 group-hover:scale-110 transition-transform">
              <Compass className="h-6 w-6" />
            </div>
            <h4 className="font-sans text-sm font-bold uppercase text-white tracking-wider">Spor Topluluğu</h4>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">Haftalık koşu ve antrenman buluşmaları.</p>
          </div>

          <div className="group relative rounded-3xl border border-white/10 bg-zinc-900/40 p-8 backdrop-blur-xl transition-all hover:border-primary/50 hover:bg-zinc-900/80">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/30 text-primary mb-5 group-hover:scale-110 transition-transform">
              <Flame className="h-6 w-6" />
            </div>
            <h4 className="font-sans text-sm font-bold uppercase text-white tracking-wider">Özel Drop Parçalar</h4>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">Sınırlı sayıda üretilen teknik tekstil.</p>
          </div>

        </div>
      </section>
    </div>
  )
}
