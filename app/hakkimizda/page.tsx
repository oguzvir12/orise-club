'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Sparkles, HeartHandshake, Compass, Users } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black">
      <SiteHeader />

      {/* HERO BÖLÜMÜ */}
      <section className="relative overflow-hidden border-b border-white/10 pt-36 pb-20 lg:pt-44 lg:pb-24">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/community-hero.jpeg"
            alt="Orise Club Hakkımızda"
            fill
            priority
            className="object-cover opacity-25 grayscale contrast-125 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 sm:px-10 lg:px-14 text-center space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/80 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-zinc-200 backdrop-blur-xl transition-all duration-300 hover:border-primary hover:bg-black hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-primary" />
            <span>Ana Sayfaya Dön</span>
          </Link>

          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary backdrop-blur-md shadow-[0_0_20px_rgba(249,115,22,0.2)]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>KÜLTÜR & HAREKET</span>
          </div>

          <h1 className="font-sans text-4xl font-black tracking-tighter text-white sm:text-6xl lg:text-7xl leading-[1.05]">
            Sporda Rakamlara Değil, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-300">
              Birlikte Kurulan Bağa İnanıyoruz.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
            Orise Club; şehri ve sokakları spora, harekete ve samimi dostluklara açan yeni nesil bir hareket kulübü ve performans kolektifidir.
          </p>
        </div>
      </section>

      {/* İÇERİK BÖLÜMÜ */}
      <section className="bg-gradient-to-b from-black via-zinc-950/60 to-black py-20">
        <div className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-14 space-y-20">
          
          {/* Felsefemiz / Hikayemiz */}
          <div className="space-y-6 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Yalnız Hissettiren Rutinlere Karşıyız</h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              İnsanları tek başınalığın rutininden çıkarıyor; sporu katı kurallardan ve performans baskısından arındırarak aynı frekanstaki insanlarla bağ kurmanın en keyifli yoluna dönüştürüyoruz. Koşudan yelkene, voleyboldan yogaya kadar her branşı; kahkahaların, ortak heyecanların ve gerçek samimiyetin merkezine koyuyoruz.
            </p>
          </div>

          {/* MİSYON & VİZYON KARTLARI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-8 backdrop-blur-xl space-y-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 text-primary font-bold text-sm">
                <Compass className="h-5 w-5" />
                <span>MİSYONUMUZ</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Seviyesi ve temposu ne olursa olsun, adım atan herkesin kendini ait hissettiği, birlikte güçlendiği ve her anından keyif aldığı dinamik bir sosyal ekosistem yaratmak.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-8 backdrop-blur-xl space-y-4 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 text-primary font-bold text-sm">
                <Users className="h-5 w-5" />
                <span>VİZYONUMUZ</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Geleneksel spor kulübü anlayışının ötesine geçerek; enerjisiyle şehrin sokaklarına ve sahnelerine yön veren, aktif yaşamı benimseyenlerin buluştuğu en ilham verici topluluk olmak.
              </p>
            </div>
          </div>

          {/* TEMEL İLKELERİMİZ */}
          <div className="space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono text-primary uppercase tracking-widest">KÜLTÜRÜMÜZ</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">Bizi Biz Yapan İlkeler</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-white/10 bg-black/60 p-6 space-y-2">
                <h4 className="font-bold text-sm text-primary">Birlikte Yükselmek</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Tempon veya deneyimin ne olursa olsun bu grupta kimse geride kalmaz. Herkes kendi hızında hareket eder, ekip birlikte ilerler.</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/60 p-6 space-y-2">
                <h4 className="font-bold text-sm text-primary">Performans Değil, Deneyim</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Skor tabelalarına takılmıyoruz. Bizim için asıl başarı; ter attıktan sonra içilen kahve ve paylaşılan samimi sohbetlerdir.</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/60 p-6 space-y-2">
                <h4 className="font-bold text-sm text-primary">Sınır Tanımazlık</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">Tek bir branşla sınırlı kalmıyoruz. Bir gün sahil boyunca koşuyor, diğer gün voleybol oynuyor veya yelkenle denize açılıyoruz.</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/60 p-6 space-y-2">
                <h4 className="font-bold text-sm text-primary">Gerçek Samimiyet</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">İlk defa tek başına gelen birinin bile ilk 5 dakikada yıllardır ekibin parçasıymış gibi hissettiği kapsayıcı bir ruh taşıyoruz.</p>
              </div>
            </div>
          </div>

          {/* MAĞAZA VE ÜRÜN VURGUSU */}
          <div className="rounded-3xl border border-primary/30 bg-zinc-950 p-8 sm:p-10 space-y-6 text-center shadow-2xl">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-2">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">Sokakta ve Stüdyoda Orise Stili</h3>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
              Topluluğumuzun yüksek enerjisinden ilham alarak tasarladığımız özel seri teknik spor giyim ve sokak stili drop parçalarımızla; hem antrenmanda hem günlük hayatta harekete hazır ve özgünsün. Mağazamızdaki koleksiyonları keşfederek bu stüdyo kültürünün bir parçası olabilirsin.
            </p>
            <div className="pt-2">
              <Link
                href="/store"
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-xs font-black uppercase tracking-widest text-black shadow-[0_0_25px_rgba(249,115,22,0.4)] hover:scale-105 transition-all"
              >
                Koleksiyonu İncele
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
