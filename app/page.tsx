import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, ShoppingBag, Users, Sparkles } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'ORISE CLUB — Teknik Spor Giyim & Mağaza',
  description: 'Şehrin enerjisini yükselten yeni nesil teknik spor giyim ve kulüp kültürü.',
}

export default function HomePage() {
  return (
    <div className="relative h-screen w-screen bg-black text-white font-sans selection:bg-primary selection:text-black overflow-hidden flex flex-col">
      <SiteHeader />

      {/* TAM EKRAN LÜKS HERO VİTRİNİ (KAYDIRMA GEREKTİRMEZ) */}
      <section className="relative flex-1 w-full flex items-center justify-center overflow-hidden px-6 sm:px-12">
        {/* Arka Plan Kaliteli E-Ticaret Görseli (Hatasız ve Tam Ekran) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/store-hero.jpeg"
            alt="ORISE Store Vitrin"
            fill
            priority
            className="object-cover opacity-40 scale-105 filter contrast-125 select-none pointer-events-none"
          />
          {/* Lüks gradyan gölgelendirmeler */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.18)_0,transparent_75%)]" />
        </div>

        {/* Merkezleşmiş Kaliteli İçerik */}
        <div className="relative z-10 mx-auto max-w-4xl text-center space-y-6 sm:space-y-8 my-auto">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/40 bg-primary/10 px-6 py-2 text-xs font-bold uppercase tracking-[0.3em] text-primary backdrop-blur-md shadow-[0_0_25px_rgba(249,115,22,0.3)]">
            <Sparkles className="h-4 w-4 animate-pulse text-primary" />
            <span>Yeni Sezon Teknik Koleksiyon</span>
          </div>

          <h1 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]">
            Şehri Hisset, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-200 drop-shadow-md">
              Sınırları Zorla.
            </span>
          </h1>

          <p className="mx-auto max-w-lg text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed">
            Kulüp kültüründen ve sokak enerjisinden ilham alan, performansınızı en üst düzeye taşıyan özel drop parçalar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/store"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-primary px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_35px_rgba(249,115,22,0.5)] hover:scale-105 hover:bg-orange-500 transition-all cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Koleksiyonu Keşfet</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <Link
              href="/community"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full border border-white/20 bg-zinc-900/80 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md hover:border-primary hover:text-primary transition-all cursor-pointer"
            >
              <Users className="h-4 w-4 text-primary" />
              <span>Topluluk & Etkinlikler</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
