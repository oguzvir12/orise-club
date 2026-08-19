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
  Star,
  X,
  Maximize2,
  Activity,
  Heart,
} from 'lucide-react'
import { InstagramIcon } from '@/components/icons/instagram-icon'

const STORE_INSTAGRAM = 'https://www.instagram.com/orisestore/'

// Tek Odaklı Geliştirilen Amiral Gemisi Ürün
const HERO_PRODUCT = {
  id: 'pro-tank-01',
  title: 'ORISE Pro Koşu Atleti',
  subtitle: 'Ultralight Race-Day Mesh Edition',
  categoryLabel: 'KOŞU ATLETİ · EDİTİON 01',
  price: 950,
  rating: 4.9,
  reviewsCount: 128,
  description:
    'Yüksek tempolu koşularda ve sıcak hava antrenmanlarında maksimum hava sirkülasyonu sağlayan 120 GSM mikro gözenekli teknik kumaş. Lazer kesim sırt havalandırma kanalları ve sürtünmeyi önleyen dikişsiz yaka mimarisi.',
  specs: [
    { label: 'Kumaş Ağırlığı', value: '120 GSM Ultra Hafif' },
    { label: 'Nem Yönetimi', value: 'Hızlı Kuruyan Mikro File' },
    { label: 'Kalıp / Fit', value: 'Atletik Slim-Fit' },
    { label: 'Yansıtıcı Detay', value: '3M Reflektif Kulüp Logosu' },
  ],
  images: [
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop', // Ön
    'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=1200&auto=format&fit=crop', // Arka
    'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1200&auto=format&fit=crop', // Detay
  ],
  colors: [
    { name: 'Mat Siyah', hex: '#18181b' },
    { name: 'Kulüp Turuncusu', hex: '#f97316' },
    { name: 'Tebeşir Beyazı', hex: '#e4e4e7' },
  ],
  sizes: ['S', 'M', 'L', 'XL'],
}

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
  const [selectedColor, setSelectedColor] = useState<string>(HERO_PRODUCT.colors[0].name)
  const [selectedSize, setSelectedSize] = useState<string>('M')
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isAdded, setIsAdded] = useState<boolean>(false)
  const [isLiked, setIsLiked] = useState<boolean>(false)

  const handleAddToCart = () => {
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
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

      {/* 1. SİNEMATİK HERO */}
      <section className="relative overflow-hidden border-b border-white/10 pt-32 pb-16 lg:pt-36 lg:pb-20">
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
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8 space-y-4">
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
                Yalnızca kulüp üyelerine özel, sınırlı sayıda üretilen teknik spor tekstili.
              </p>
            </div>

            <div className="hidden lg:col-span-4 lg:flex flex-col items-end justify-end space-y-2 text-right">
              <div className="text-xs font-mono tracking-[0.3em] text-primary/80 uppercase">
                [ DROP NO: 01 / 2026 ]
              </div>
              <div className="text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
                RACE-DAY PERFORMANCE LAB
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TEK ÜRÜN EDİTORYAL VİTRİNİ & DETAYLI İNCELEME */}
      <section className="border-b border-white/10 bg-zinc-950/40 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
          
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            
            {/* SOL: ÇOKLU FOTOĞRAF GALERİSİ & BÜYÜTME */}
            <div className="lg:col-span-7 space-y-4">
              {/* Ana Büyük Görsel */}
              <div
                onClick={() => setIsModalOpen(true)}
                className="group relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 cursor-zoom-in shadow-[0_0_50px_rgba(0,0,0,0.8)]"
              >
                <Image
                  src={HERO_PRODUCT.images[activeImageIdx]}
                  alt={HERO_PRODUCT.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                <div className="absolute top-4 left-4 rounded-full border border-primary/40 bg-black/80 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-primary backdrop-blur-md">
                  LIMITED DROP · 01
                </div>

                {/* Büyüt İkonu */}
                <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 border border-white/10 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all">
                  <Maximize2 className="h-4 w-4 text-primary" />
                </div>

                <div className="absolute bottom-4 left-4 rounded-full bg-black/70 border border-white/10 px-3 py-1 text-[10px] font-mono text-zinc-300 backdrop-blur-md">
                  FOTOĞRAFA TIKLA & BÜYÜT [{activeImageIdx + 1}/3]
                </div>
              </div>

              {/* Küçük Küçük 3'lü Küçük Fotoğraflar (Ön / Arka / Detay) */}
              <div className="grid grid-cols-3 gap-4">
                {HERO_PRODUCT.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative aspect-square w-full overflow-hidden rounded-2xl border transition-all ${
                      activeImageIdx === idx
                        ? 'border-primary ring-2 ring-primary/40 scale-95'
                        : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Görsel ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* SAĞ: DETAYLAR, PUANLAR, RENKLER & SATIN ALMA */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
              <div>
                {/* Kategori & Beğeni */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono tracking-widest text-primary uppercase">
                    {HERO_PRODUCT.categoryLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsLiked(!isLiked)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>

                {/* Başlık */}
                <h2 className="mt-2 font-sans text-3xl font-black tracking-tight text-white sm:text-4xl">
                  {HERO_PRODUCT.title}
                </h2>
                <p className="text-sm font-mono text-zinc-400 mt-1">{HERO_PRODUCT.subtitle}</p>

                {/* PUANLAMA VE DEĞERLENDİRME ŞERİDİ */}
                <div className="mt-4 flex items-center gap-3 border-y border-white/10 py-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-mono text-sm font-bold text-white">
                    {HERO_PRODUCT.rating}
                  </span>
                  <span className="text-xs text-zinc-500">·</span>
                  <span className="text-xs font-mono text-zinc-400 underline cursor-pointer hover:text-primary">
                    {HERO_PRODUCT.reviewsCount} Kulüp Değerlendirmesi
                  </span>
                </div>

                {/* Fiyat */}
                <div className="mt-6">
                  <span className="text-xs font-mono text-zinc-500 uppercase">Kulüp Satış Fiyatı</span>
                  <div className="text-3xl font-black text-white">
                    ₺{HERO_PRODUCT.price.toLocaleString('tr-TR')}
                  </div>
                </div>

                {/* Açıklama */}
                <p className="mt-4 text-sm leading-relaxed text-zinc-300">
                  {HERO_PRODUCT.description}
                </p>

                {/* RENK SEÇİMİ */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400 uppercase">Seçili Renk</span>
                    <span className="font-bold text-primary">{selectedColor}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {HERO_PRODUCT.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`h-7 w-7 rounded-full border transition-all ${
                          selectedColor === c.name
                            ? 'scale-125 border-primary ring-2 ring-primary/40'
                            : 'border-white/20 hover:scale-110'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* BEDEN SEÇİMİ */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400 uppercase">Beden Seçimi</span>
                    <span className="text-zinc-500 underline cursor-pointer hover:text-white">
                      Beden Tablosu
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {HERO_PRODUCT.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`rounded-xl py-3 text-xs font-bold transition-all ${
                          selectedSize === s
                            ? 'border border-primary bg-primary text-black shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                            : 'border border-white/10 bg-zinc-900 text-zinc-300 hover:border-white/30'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TEKNİK SPESİFİKASYONLAR */}
                <div className="mt-8 rounded-2xl border border-white/5 bg-zinc-900/40 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-2">
                    <Activity className="h-3.5 w-3.5" />
                    <span>Teknik Laboratuvar Verileri</span>
                  </div>
                  {HERO_PRODUCT.specs.map((sp, idx) => (
                    <div key={idx} className="flex justify-between text-xs font-mono">
                      <span className="text-zinc-500">{sp.label}</span>
                      <span className="text-zinc-200">{sp.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SEPETE EKLEME BUTONU */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex w-full items-center justify-center gap-3 rounded-full py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                    isAdded
                      ? 'bg-emerald-500 text-black shadow-[0_0_25px_rgba(16,185,129,0.5)]'
                      : 'bg-primary text-black shadow-[0_0_25px_rgba(249,115,22,0.4)] hover:scale-[1.02]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>{selectedSize} Beden Sepete Eklendi</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      <span>Siparişe Ekle — ₺{HERO_PRODUCT.price}</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 3. BÜYÜTME MODALI (LIGHTBOX) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-2xl animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary hover:text-black transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          <div
            className="relative h-[85vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-zinc-950"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={HERO_PRODUCT.images[activeImageIdx]}
              alt={HERO_PRODUCT.title}
              fill
              className="object-contain"
            />

            {/* Modal İçi Fotoğraf Geçiş Noktaları */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 rounded-full bg-black/80 px-4 py-2 border border-white/10 backdrop-blur-md">
              {HERO_PRODUCT.images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  className={`h-2 rounded-full transition-all ${
                    activeImageIdx === idx ? 'w-8 bg-primary' : 'w-2 bg-zinc-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. KALİTE PRENSİPLERİ */}
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

      {/* 5. INSTAGRAM HUB (@orisestore) */}
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
