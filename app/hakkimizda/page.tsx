'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Sparkles, HeartHandshake, Compass, Users, ChevronRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#111111] text-[#F5F2EC] font-sans selection:bg-[#F74A05] selection:text-black">
      <SiteHeader />

      {/* HERO BÖLÜMÜ: Üst Düzey Lüks Spor Markası Estetiği */}
      <section className="relative overflow-hidden border-b border-white/10 pt-40 pb-24 lg:pt-52 lg:pb-32">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/community-hero.jpeg"
            alt="Orise Club Hakkımızda"
            fill
            priority
            className="object-cover opacity-30 grayscale contrast-125 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/70 to-black/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 sm:px-10 lg:px-14 text-center space-y-8">
          <Link
            href="/store"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/80 px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-zinc-300 backdrop-blur-xl transition-all duration-300 hover:border-[#F74A05] hover:bg-black hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#F74A05]" />
            <span>Mağazaya Dön</span>
          </Link>

          <div className="mx-auto inline-flex items-center gap-2.5 rounded-full border border-[#F74A05]/40 bg-[#F74A05]/10 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.3em] text-[#F74A05] backdrop-blur-md shadow-[0_0_25px_rgba(247,74,5,0.25)]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>KÜLTÜR & HAREKET</span>
          </div>

          <h1 className="font-['Vast_XXL',sans-serif] text-4xl font-black tracking-tighter text-white sm:text-6xl lg:text-7xl leading-[1.05]">
            Sporda Rakamlara Değil, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F74A05] via-orange-400 to-amber-300">
              Birlikte Kurulan Bağa İnanıyoruz.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
            Orise Club; şehri ve sokakları spora, harekete ve samimi dostluklara açan yeni nesil bir hareket kulübü ve performans kolektifidir.
          </p>
        </div>
      </section>

      {/* İÇERİK BÖLÜMÜ */}
      <section className="bg-gradient-to-b from-[#111111] via-black to-[#111111] py-24">
        <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-14 space-y-24">
          
          {/* Felsefemiz / Hikayemiz */}
          <div className="rounded-3xl border border-white/15 bg-black/60 p-8 sm:p-12 backdrop-blur-2xl space-y-6 text-center max-w-3xl mx-auto shadow-2xl">
            <span className="text-xs font-mono text-[#F74A05] uppercase tracking-[0.2em] font-bold">FELSEFEMİZ</span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-['Vast_XXL',sans-serif]">Yalnız Hissettiren Rutinlere Karşıyız</h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
              İnsanları tek başınalığın rutininden çıkarıyor; sporu katı kurallardan ve performans baskısından arındırarak aynı frekanstaki insanlarla bağ kurmanın en keyifli yoluna dönüştürüyoruz. Koşudan yelkene, voleyboldan yogaya kadar her branşı; kahkahaların, ortak heyecanların ve gerçek samimiyetin merkezine koyuyoruz.
            </p>
          </div>

          {/* MİSYON & VİZYON KARTLARI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-zinc-900/60 to-black p-8 sm:p-10 backdrop-blur-xl space-y-5 hover:border-[#F74A05]/60 transition-all shadow-xl group">
              <div className="flex items-center gap-3 text-[#F74A05] font-mono text-xs font-bold tracking-widest">
                <div className="p-2.5 rounded-2xl bg-[#F74A05]/10 border border-[#F74A05]/30 group-hover:scale-110 transition-transform">
                  <Compass className="h-5 w-5" />
                </div>
                <span>MİSYONUMUZ</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                Seviyesi ve temposu ne olursa olsun, adım atan herkesin kendini ait hissettiği, birlikte güçlendiği ve her anından keyif aldığı dinamik bir sosyal ekosistem yaratmak.
              </p>
            </div>

            <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-zinc-900/60 to-black p-8 sm:p-10 backdrop-blur-xl space-y-5 hover:border-[#F74A05]/60 transition-all shadow-xl group">
              <div className="flex items-center gap-3 text-[#F74A05] font-mono text-xs font-bold tracking-widest">
                <div className="p-2.5 rounded-2xl bg-[#F74A05]/10 border border-[#F74A05]/30 group-hover:scale-110 transition-transform">
                  <Users className="h-5 w-5" />
                </div>
                <span>VİZYONUMUZ</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                Geleneksel spor kulübü anlayışının ötesine geçerek; enerjisiyle şehrin sokaklarına ve sahnelerine yön veren, aktif yaşamı benimseyenlerin buluştuğu en ilham verici topluluk olmak.
              </p>
            </div>
          </div>

          {/* TEMEL İLKELERİMİZ */}
          <div className="space-y-12">
            <div className="text-center space-y-3">
              <span className="text-xs font-mono text-[#F74A05] uppercase tracking-[0.25em] font-bold">KÜLTÜRÜMÜZ</span>
              <h3 className="text-3xl sm:text-4xl font-black text-white font-['Vast_XXL',sans-serif]">Bizi Biz Yapan İlkeler</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-white/15 bg-black/80 p-8 space-y-3 shadow-xl hover:border-[#F74A05]/40 transition-colors">
                <h4 className="font-bold text-sm text-[#F74A05] font-mono uppercase tracking-wider">1. Birlikte Yükselmek</h4>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">Tempon veya deneyimin ne olursa olsun bu grupta kimse geride kalmaz. Herkes kendi hızında hareket eder, ekip birlikte ilerler.</p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-black/80 p-8 space-y-3 shadow-xl hover:border-[#F74A05]/40 transition-colors">
                <h4 className="font-bold text-sm text-[#F74A05] font-mono uppercase tracking-wider">2. Performans Değil, Deneyim</h4>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">Skor tabelalarına takılmıyoruz. Bizim için asıl başarı; ter attıktan sonra içilen kahve ve paylaşılan samimi sohbetlerdir.</p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-black/80 p-8 space-y-3 shadow-xl hover:border-[#F74A05]/40 transition-colors">
                <h4 className="font-bold text-sm text-[#F74A05] font-mono uppercase tracking-wider">3. Sınır Tanımazlık</h4>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">Tek bir branşla sınırlı kalmıyoruz. Bir gün sahil boyunca koşuyor, diğer gün voleybol oynuyor veya yelkenle denize açılıyoruz.</p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-black/80 p-8 space-y-3 shadow-xl hover:border-[#F74A05]/40 transition-colors">
                <h4 className="font-bold text-sm text-[#F74A05] font-mono uppercase tracking-wider">4. Gerçek Samimiyet</h4>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">İlk defa tek başına gelen birinin bile ilk 5 dakikada yıllardır ekibin parçasıymış gibi hissettiği kapsayıcı bir ruh taşıyoruz.</p>
              </div>
            </div>
          </div>

          {/* MAĞAZA VE ÜRÜN VURGUSU */}
          <div className="relative overflow-hidden rounded-3xl border border-[#F74A05]/40 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 p-10 sm:p-14 space-y-6 text-center shadow-[0_0_50px_rgba(247,74,5,0.15)]">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-[#F74A05]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-[#F74A05]/10 text-[#F74A05] border border-[#F74A05]/30 mb-2 shadow-lg">
              <HeartHandshake className="h-7 w-7" />
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-black text-white font-['Vast_XXL',sans-serif]">Sokakta ve Stüdyoda Orise Stili</h3>
            
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl mx-auto leading-relaxed font-sans">
              Topluluğumuzun yüksek enerjisinden ilham alarak tasarladığımız özel seri teknik spor giyim ve sokak stili drop parçalarımızla; hem antrenmanda hem günlük hayatta harekete hazır ve özgünsün. Mağazamızdaki koleksiyonları keşfederek bu stüdyo kültürünün bir parçası olabilirsin.
            </p>
            
            <div className="pt-4">
              <Link
                href="/store"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F74A05] px-9 py-4 text-xs font-black uppercase tracking-widest text-[#111111] shadow-[0_0_30px_rgba(247,74,5,0.4)] hover:scale-105 hover:bg-orange-600 transition-all cursor-pointer"
              >
                <span>Koleksiyonu İncele</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
