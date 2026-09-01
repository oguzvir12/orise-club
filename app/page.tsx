import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, ShoppingBag, Sparkles, ShieldCheck, Calendar, Instagram, Linkedin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ORISE CLUB — Hareket Kulübü & Stüdyo Mağazası',
  description: 'Kulüp kültüründen ilham alan özel tasarım teknik spor ve sokak giyimi e-ticaret koleksiyonu.',
}

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-black text-white font-sans selection:bg-primary selection:text-black">
      {/* Arka Plan Görseli ve Maske */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/store-hero.jpeg"
          alt="Orise Store"
          fill
          priority
          className="object-cover opacity-25 grayscale contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
      </div>

      {/* Ana Hero İçeriği */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 pt-32 pb-16 text-center space-y-8 my-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/20 px-5 py-2 text-xs font-bold tracking-[0.25em] text-primary backdrop-blur-md shadow-[0_0_25px_rgba(249,115,22,0.3)]">
          <Sparkles className="h-4 w-4" />
          <span>HAREKET KULÜBÜ & STÜDYO KOLEKSİYONU</span>
        </div>

        <h1 className="text-5xl font-black tracking-tighter sm:text-7xl lg:text-8xl leading-none">
          ORISE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-300">STORE</span>
        </h1>

        <p className="mx-auto max-w-xl text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
          Şehrin enerjisinden ve kulüp kültüründen ilham alan özel seri teknik spor giyim, sokak stili ve performans parçaları.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/store"
            className="inline-flex items-center gap-3 rounded-full bg-primary px-9 py-4 text-xs font-black uppercase tracking-widest text-black shadow-[0_0_35px_rgba(249,115,22,0.5)] hover:scale-105 transition-all"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Koleksiyonu İncele</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>

          <Link
            href="/community"
            className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-zinc-900/80 px-8 py-4 text-xs font-bold uppercase tracking-widest text-zinc-200 backdrop-blur-md hover:border-primary hover:text-white transition-all"
          >
            <Calendar className="h-4 w-4 text-primary" />
            <span>Topluluk Etkinlik Takvimi</span>
          </Link>
        </div>
      </div>

      {/* Alt Bilgi Bandı: Sosyal Medya ve İyzico Güvencesi */}
      <footer className="relative z-10 w-full border-t border-white/10 bg-black/90 backdrop-blur-xl py-6 px-6 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
          
          <div className="flex items-center gap-3">
            <span className="font-bold text-white tracking-wider">ORISE CLUB</span>
            <span className="text-zinc-600">/</span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> 256-BIT SSL & İyzico Güvencesi
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/orisecommunity" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors inline-flex items-center gap-1.5 text-[11px]">
              <Instagram className="h-3.5 w-3.5 text-primary" /> @orisecommunity
            </a>
            <a href="https://www.instagram.com/orisestore" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors inline-flex items-center gap-1.5 text-[11px]">
              <Instagram className="h-3.5 w-3.5 text-primary" /> @orisestore
            </a>
            <a href="https://www.linkedin.com/company/orisecommunity" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors inline-flex items-center gap-1.5 text-[11px]">
              <Linkedin className="h-3.5 w-3.5 text-primary" /> LinkedIn
            </a>
          </div>

        </div>
      </footer>
    </main>
  )
}
