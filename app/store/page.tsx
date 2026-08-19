'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  Truck,
  ShoppingBag,
  Check,
} from 'lucide-react'
import { PRODUCTS } from '@/lib/products'
import { InstagramIcon } from '@/components/icons/instagram-icon'

const STORE_INSTAGRAM = 'https://www.instagram.com/orisestore/'

// Lüks Editoryal Kategori Yapısı
const CATEGORY_SECTIONS = [
  {
    id: 'tops',
    title: 'Üst Giyim',
    tagline: 'TEKNİK ATLET · SWEATSHIRT · T-SHIRT',
    matchKeywords: ['t-shirt', 'sweatshirt', 'atlet', 'top', 'üst'],
  },
  {
    id: 'bottoms-equipment',
    title: 'Alt Giyim & Ekipman',
    tagline: 'ŞORT · TAYT · ÇORAP · MATARA',
    matchKeywords: ['çorap', 'matara', 'şort', 'tayt', 'alt', 'socks', 'equipment'],
  },
  {
    id: 'accessories',
    title: 'Aksesuar & Çanta',
    tagline: 'KULÜP ŞAPKASI · BEZ ÇANTA · DETAYLAR',
    matchKeywords: ['şapka', 'çanta', 'aksesuar', 'hat', 'bag', 'accessory'],
  },
]

const FEATURES = [
  {
    icon: Sparkles,
    title: 'Sınırlı Üretim & Drop',
    desc: 'Her parça kulüp üyelerine özel sınırlı adetlerde, tekrarı olmayan koleksiyonlar halinde üretilir.',
  },
  {
    icon: ShieldCheck,
    title: 'Teknik Kumaş Standartı',
    desc: 'Yüksek gramajlı organik pamuk, nem transferli mikro fileler ve dayanıklı dikiş mimarisi.',
  },
  {
    icon: Truck,
    title: 'Hızlı & Güvenli Teslimat',
    desc: 'Tüm siparişler özel korumalı kulüp ambalajında 1-3 iş günü içerisinde kargoya teslim edilir.',
  },
]

export default function StorePage() {
  const [activeTab, setActiveTab] = useState<string>('all')
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({})

  const handleAddToCart = (id: string) => {
    setAddedItems((prev) => ({ ...prev, [id]: true }))
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [id]: false }))
    }, 1500)
  }

  const scrollToSection = (id: string) => {
    setActiveTab(id)
    if (id === 'all') {
      window.scrollTo({ top: 400, behavior: 'smooth' })
      return
    }
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black">
      {/* Sol Üst Sabit Ana Sayfa Butonu */}
      <div className="fixed top-4 left-6 z-[60] sm:left-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/80 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-zinc-200 backdrop-blur-xl transition-all duration-300 hover:border-primary hover:bg-black hover:text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.35)]"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-primary transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Ana Sayfa</span>
        </Link>
      </div>

      {/* 1. SİNEMATİK ASİMETRİK HERO */}
      <section className="relative overflow-hidden border-b border-white/10 pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/store-hero.jpeg"
            alt="ORISE Store Drop"
            fill
            priority
            className="object-cover opacity-20 grayscale contrast-125 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                <span>HAREKET KULÜBÜ & ATÖLYE</span>
              </div>

              <h1 className="font-sans text-4xl font-black tracking-tighter text-white sm:text-6xl lg:text-7xl leading-[1.05]">
                Kulübe Özel{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-300">
                  Drop
                </span>{' '}
                Koleksiyonu.
              </h1>

              <p className="max-w-2xl text-base font-normal leading-relaxed text-zinc-300 sm:text-lg">
                Sınırlı üretim teknik tekstil ve aksesuar parçaları. Yüksek gramajlı kumaşlar,
                kulüp ruhuyla tasarlanmış detaylar — hepsi club-only.
              </p>
            </div>

            <div className="hidden lg:col-span-4 lg:flex flex-col items-end justify-end space-y-2 text-right">
              <div className="text-xs font-mono tracking-[0.3em] text-primary/80 uppercase">
                [ EDITION 01 / DROP 2026 ]
              </div>
              <div className="text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
                TECHNICAL APPAREL · ATHLETIC WEAR
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KATEGORİ ANKORLARI & ÜRÜN BÖLÜMLERİ */}
      <section className="border-b border-white/10 bg-zinc-950/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
          {/* Üst Sabit / Kayan Hızlı Filtre Çubuğu */}
          <div className="sticky top-20 z-40 mb-16 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/80 p-4 backdrop-blur-xl">
            <div className="text-xs font-bold uppercase tracking-widest text-primary hidden sm:block">
              HIZLI GEÇİŞ
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => scrollToSection('all')}
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === 'all'
                    ? 'bg-primary text-black shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                    : 'border border-white/10 bg-zinc-900/60 text-zinc-400 hover:border-white/25 hover:text-white'
                }`}
              >
                TÜMÜ
              </button>
              {CATEGORY_SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => scrollToSection(sec.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    activeTab === sec.id
                      ? 'bg-primary text-black shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                      : 'border border-white/10 bg-zinc-900/60 text-zinc-400 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {sec.title}
                </button>
              ))}
            </div>
          </div>

          {/* KATEGORİLERE GÖRE AYRILMIŞ BÖLÜMLER */}
          <div className="space-y-24">
            {CATEGORY_SECTIONS.map((section) => {
              // İlgili kategoriye ait ürünleri filtrele
              const sectionProducts = PRODUCTS.filter((p) => {
                const searchStr = `${p.category} ${p.title} ${p.description}`.toLowerCase()
                return section.matchKeywords.some((kw) => searchStr.includes(kw))
              })

              if (sectionProducts.length === 0) return null

              return (
                <div key={section.id} id={section.id} className="scroll-mt-36">
                  {/* Kategori Başlığı Çizgisi */}
                  <div className="mb-8 flex flex-col items-start justify-between gap-2 border-b border-white/10 pb-4 md:flex-row md:items-end">
                    <div>
                      <div className="text-[11px] font-mono tracking-[0.2em] text-primary uppercase">
                        {section.tagline}
                      </div>
                      <h2 className="mt-1 font-sans text-2xl font-black tracking-tight text-white sm:text-3xl">
                        {section.title}
                      </h2>
                    </div>
                    <span className="text-xs font-mono text-zinc-500 uppercase">
                      [{sectionProducts.length} PARÇA]
                    </span>
                  </div>

                  {/* Ürün Kartları */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {sectionProducts.map((product) => {
                      const isAdded = addedItems[product.id]
                      return (
                        <div
                          key={product.id}
                          className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 p-5 backdrop-blur-md transition-all duration-500 hover:border-primary/50 hover:bg-zinc-900/70"
                        >
                          <div>
                            {/* Görsel Alanı */}
                            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-950/80">
                              {product.image ? (
                                <Image
                                  src={product.image}
                                  alt={product.title}
                                  fill
                                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-zinc-700">
                                  <ShoppingBag className="h-12 w-12" />
                                </div>
                              )}
                              <div className="absolute top-3 left-3 rounded-full border border-primary/40 bg-black/70 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary backdrop-blur-md">
                                LIMITED DROP
                              </div>
                            </div>

                            {/* Ürün Detayları */}
                            <div className="mt-5 space-y-1">
                              <h3 className="font-sans text-lg font-bold text-white tracking-tight group-hover:text-primary transition-colors">
                                {product.title}
                              </h3>
                              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                                {product.description}
                              </p>
                            </div>
                          </div>

                          {/* Fiyat & Sepete Ekle */}
                          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                            <div>
                              <div className="text-[10px] font-mono uppercase text-zinc-500">Fiyat</div>
                              <div className="text-lg font-black text-white">
                                ₺{product.price.toLocaleString('tr-TR')}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddToCart(product.id)}
                              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                                isAdded
                                  ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                                  : 'bg-primary text-black shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:scale-105'
                              }`}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="h-3.5 w-3.5" />
                                  <span>Eklendi</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="h-3.5 w-3.5" />
                                  <span>Sepete Ekle</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. KALİTE & KUMAŞ PRENSİPLERİ */}
      <section className="py-24 sm:py-28 border-b border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
          <div className="grid gap-8 md:grid-cols-3">
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon
              return (
                <div
                  key={idx}
                  className="group relative flex flex-col justify-between border-l border-white/15 pl-6 transition-all duration-300 hover:border-primary"
                >
                  <div>
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-primary transition-colors group-hover:bg-primary group-hover:text-black">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-sans text-xl font-bold text-white tracking-tight group-hover:text-primary transition-colors">
                      {feat.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. INSTAGRAM HUB (@orisestore) */}
      <section className="bg-zinc-950 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
          <a
            href={STORE_INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col md:flex-row items-center justify-between gap-8 rounded-3xl border border-white/10 bg-zinc-900/40 p-8 md:p-12 backdrop-blur-md transition-all duration-500 hover:border-primary/60 hover:bg-zinc-900/80"
          >
            <div className="flex items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-black shadow-[0_0_25px_rgba(249,115,22,0.2)]">
                <InstagramIcon className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-sans text-2xl font-black text-white tracking-tight">
                  Mağaza Hesabını Takip Et
                </h3>
                <p className="text-sm font-mono text-primary uppercase tracking-wider">
                  @orisestore
                </p>
                <p className="text-xs text-zinc-400 max-w-md">
                  Yeni drop lansmanları, ürün detay çekimleri ve stok yenilemelerinden anında haberdar ol.
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_25px_rgba(249,115,22,0.35)] transition-transform duration-300 group-hover:scale-105">
              <span>Instagram'da Keşfet</span>
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </a>
        </div>
      </section>
    </div>
  )
}
