import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, ShoppingBag, Sparkles, ShieldCheck, Flame, Compass, ChevronRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'ORISE CLUB — Teknik Spor Giyim & Mağaza',
  description: 'Şehrin enerjisini yükselten yeni nesil teknik spor giyim ve kulüp kültürü.',
}

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black overflow-x-hidden">
      <SiteHeader />

      {/* SİNEMATİK VİDEO ARKAPLANLI LÜKS HERO BÖLÜMÜ */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-32 pb-20 px-6 sm:px-10 overflow-hidden">
        {/* Arka Plan Sinematik Döngü Videosu */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40 filter contrast-125 scale-105"
          >
            {/* Ücretsiz, yüksek kaliteli bir antrenman/koşu loop videosu */}
            <source src="https://assets.mixkit.co/videos/preview/mixkit-athlete-running-on-a-track-41484-large.mp4" type="video/mp4" />
          </video>
          {/* Lüks gradyan karartmalar */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.15)_0,transparent_75%)]" />
        </div>

        {/* İçerik */}
        <div className="relative z-10 mx-auto max-w-5xl text-center space-y-8">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/40 bg-primary/10 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.3em] text-primary backdrop-blur-md shadow-[0_0_25px_rgba(249,115,22,0.3)]">
            <Sparkles className="h-4 w-4 animate-pulse text-primary" />
            <span>Sınırlı Üretim Teknik Giyim Koleksiyonu</span>
          </div>

          <h1 className="font-sans text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[1.02]">
            Şehri Hisset, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-200 drop-shadow-md">
              Sınırları Zorla.
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-sm sm:text-base text-zinc-300 font-normal leading-relaxed">
            Sokak enerjisinden ve kulüp disiplininden ilham alan, performansınızı en üst düzeye taşıyan yeni nesil drop parçaları keşfedin.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/store"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-primary px-9 py-4 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_40px_rgba(249,115,22,0.5)] hover:scale-105 hover:bg-orange-500 transition-all cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Koleksiyonu Keşfet</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <Link
              href="/store"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full border border-white/20 bg-zinc-900/80 px-9 py-4 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md hover:border-primary hover:text-primary transition-all cursor-pointer"
            >
              <span>Yeni Sezon Drop</span>
              <ChevronRight className="h-4 w-4 text-primary" />
            </Link>
          </div>
        </div>
      </section>

      {/* MARKAYA DEĞER KATAN PREMIUM VİTRİN ALANI */}
      <section className="relative z-10 border-t border-white/10 bg-gradient-to-b from-zinc-950/90 to-black py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-primary">Neden ORISE?</h2>
            <h3 className="text-3xl font-black text-white tracking-tight">Performans ve Estetiğin Buluştuğu Nokta</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="group relative rounded-3xl border border-white/10 bg-zinc-900/40 p-8 backdrop-blur-xl transition-all hover:border-primary/50 hover:bg-zinc-900/80">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/30 text-primary mb-5 group-hover:scale-110 transition-transform">
                <Flame className="h-6 w-6" />
              </div>
              <h4 className="font-sans text-base font-bold text-white tracking-wide uppercase">Sınırlı Sayıda Drop</h4>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                Seri üretimden uzak, tamamen kulüp ruhuna ve özel koleksiyonlara odaklanan nadide parçalar.
              </p>
            </div>

            <div className="group relative rounded-3xl border border-white/10 bg-zinc-900/40 p-8 backdrop-blur-xl transition-all hover:border-primary/50 hover:bg-zinc-900/80">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/30 text-primary mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="font-sans text-base font-bold text-white tracking-wide uppercase">İyzico Güvencesi</h4>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                Tüm alışverişlerinizde 256-bit SSL şifrelemesiyle güvenli, hızlı ve korumalı ödeme deneyimi.
              </p>
            </div>

            <div className="group relative rounded-3xl border border-white/10 bg-zinc-900/40 p-8 backdrop-blur-xl transition-all hover:border-primary/50 hover:bg-zinc-900/80">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 border border-primary/30 text-primary mb-5 group-hover:scale-110 transition-transform">
                <Compass className="h-6 w-6" />
              </div>
              <h4 className="font-sans text-base font-bold text-white tracking-wide uppercase">Aktif Topluluk Ruhu</h4>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                Sadece bir giyim markası değil; haftalık antrenmanlar ve etkinliklerle yaşayan dinamik bir ekosistem.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
