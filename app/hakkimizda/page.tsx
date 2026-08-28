'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Sparkles, ShieldCheck, Trophy, Target } from 'lucide-react'
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

        <div className="relative z-10 mx-auto max-w-5xl px-6 sm:px-10 lg:px-14">
          <div className="max-w-3xl space-y-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/80 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-zinc-200 backdrop-blur-xl transition-all duration-300 hover:border-primary hover:bg-black hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-primary" />
              <span>Ana Sayfaya Dön</span>
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-primary backdrop-blur-md shadow-[0_0_20px_rgba(249,115,22,0.2)]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>KÜLTÜR & HAREKET</span>
            </div>

            <h1 className="font-sans text-4xl font-black tracking-tighter text-white sm:text-6xl lg:text-7xl leading-[1.05]">
              Şehrin Ritminde Birlikte, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-300">
                Sınırları Birlikte Aşıyoruz.
              </span>
            </h1>

            <p className="max-w-xl text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
              Orise Club; sporun, estetiğin ve sokak kültürünün kesişim kümesinde kurulan yeni nesil bir hareket kulübü ve stüdyo kolektifidir.
            </p>
          </div>
        </div>
      </section>

      {/* İÇERİK DETAYLARI */}
      <section className="bg-gradient-to-b from-black via-zinc-950/60 to-black py-20">
        <div className="mx-auto max-w-5xl px-6 sm:px-10 lg:px-14 space-y-16">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono text-primary uppercase tracking-widest">KİME HİTAP EDİYORUZ?</span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Tek Başınalıktan Çık, Şehre Karış.</h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Koşu, yoga, voleybol, tenis ve yelken gibi branşlarda düzenlediğimiz açık hava buluşmalarıyla bireyleri bir araya getiriyor; sadece spor yapılan bir ortam değil, kalıcı bir aidiyet ve yaşam tarzı inşa ediyoruz.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-3 text-primary font-bold text-sm">
                <Target className="h-5 w-5" />
                <span>Misyonumuz</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Şehir hayatının temposunda sıkışıp kalan insanlara nefes alabilecekleri, fiziksel ve zihinsel sınırlarını güvenli bir topluluk içinde zorlayabilecekleri yüksek enerjili alanlar yaratmak.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="order-2 md:order-1 rounded-3xl border border-white/10 bg-zinc-900/40 p-6 sm:p-8 backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-3 text-primary font-bold text-sm">
                <Trophy className="h-5 w-5" />
                <span>Özel Tasarım & Drop Kültürü</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Mağazamızda sunduğumuz tüm teknik spor giyim ve sokak stili parçalar; antrenman performansını artırırken estetik çizgiden ödün vermeyen, sınırlı sayıda üretilen özel seri (drop) tasarımlardan oluşur.
              </p>
            </div>
            <div className="order-1 md:order-2 space-y-4">
              <span className="text-xs font-mono text-primary uppercase tracking-widest">STÜDYO & MAĞAZA</span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Performans ve Tasarım Bir Arada.</h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Yüksek kaliteli kumaşlar, nefes alabilen dry-fit dokular ve kulüp kültürünün minimalist estetiğiyle tasarlanan ürünlerimizle her an harekete hazırsınız.
              </p>
            </div>
          </div>

          {/* GÜVEN VE İLETİŞİM BİLGİLERİ (İyzico için kritik) */}
          <div className="rounded-3xl border border-white/15 bg-zinc-950 p-8 sm:p-10 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Kurumsal Bilgiler & Güven</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono text-zinc-300">
              <div className="space-y-1">
                <span className="text-zinc-500 block uppercase">Marka / İşletme Adı</span>
                <strong className="text-white text-sm">Orise Club Athletics & Studio</strong>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-500 block uppercase">İletişim E-Posta</span>
                <a href="mailto:community@oriseclub.com" className="text-primary hover:underline block text-sm">community@oriseclub.com / store@oriseclub.com</a>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <span className="text-zinc-500 block uppercase">Faaliyet Alanı</span>
                <p className="text-zinc-300">İnternet üzerinden perakende spor giyim, aksesuar satışı ve açık hava spor topluluğu organizasyonları.</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
