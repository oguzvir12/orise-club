import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, ShoppingBag, Sparkles, ShieldCheck, Calendar } from 'lucide-react'

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
              <svg className="h-3.5 w-3.5 text-primary fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> @orisecommunity
            </a>
            <a href="https://www.instagram.com/orisestore" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors inline-flex items-center gap-1.5 text-[11px]">
              <svg className="h-3.5 w-3.5 text-primary fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> @orisestore
            </a>
            <a href="https://www.linkedin.com/company/orisecommunity/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors inline-flex items-center gap-1.5 text-[11px]">
              <svg className="h-3.5 w-3.5 text-primary fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> LinkedIn
            </a>
          </div>

        </div>
      </footer>
    </main>
  )
}
