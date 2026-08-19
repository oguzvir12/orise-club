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
  Star,
  Flame,
} from 'lucide-react'
import { InstagramIcon } from '@/components/icons/instagram-icon'

const STORE_INSTAGRAM = 'https://www.instagram.com/orisestore/'

const CATEGORIES = [
  { id: 'all', label: 'TÜMÜ' },
  { id: 'tank', label: 'KOŞU ATLETİ' },
  { id: 'sweatshirt', label: 'SWEATSHIRT' },
  { id: 'socks', label: 'PERFORMANS ÇORAP' },
  { id: 'hat', label: 'ŞAPKA' },
  { id: 'bag', label: 'ÇANTA' },
  { id: 'equipment', label: 'TERMOS & MATARA' },
]

export interface ProductItem {
  id: string
  slug: string
  title: string
  subtitle: string
  category: string
  categoryLabel: string
  price: number
  stock: number // Toplam Stok
  soldCount: number // Satılan Adet
  rating: number
  reviewsCount: number
  coverImage: string
  colorsCount: number
}

export const PRODUCTS_CATALOG: ProductItem[] = [
  {
    id: 'pro-tank-01',
    slug: 'pro-tank-01',
    title: 'ORISE Pro Koşu Atleti',
    subtitle: 'Ultralight Race-Day Mesh Edition',
    category: 'tank',
    categoryLabel: 'KOŞU ATLETİ',
    price: 950,
    stock: 50,
    soldCount: 42, // Kalan 8 (Kritik Stok Uyarısı)
    rating: 4.9,
    reviewsCount: 128,
    coverImage: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=800&auto=format&fit=crop',
    colorsCount: 3,
  },
  {
    id: 'club-sweatshirt-01',
    slug: 'club-sweatshirt-01',
    title: 'ORISE Bisiklet Yaka Sweatshirt',
    subtitle: '450 GSM Heavyweight Cotton',
    category: 'sweatshirt',
    categoryLabel: 'SWEATSHIRT',
    price: 2490,
    stock: 30,
    soldCount: 18,
    rating: 5.0,
    reviewsCount: 45,
    coverImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
    colorsCount: 2,
  },
  {
    id: 'club-cap-01',
    slug: 'club-cap-01',
    title: 'ORISE Atletik Kulüp Şapkası',
    subtitle: '6-Panel Unstructured Twill',
    category: 'hat',
    categoryLabel: 'ŞAPKA',
    price: 890,
    stock: 40,
    soldCount: 40, // TÜKENDİ DEMOSU
    rating: 4.8,
    reviewsCount: 62,
    coverImage: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop',
    colorsCount: 2,
  },
  {
    id: 'crew-socks-01',
    slug: 'crew-socks-01',
    title: 'ORISE Performans Koşu Çorabı',
    subtitle: 'Coolmax Cushion Arch Support',
    category: 'socks',
    categoryLabel: 'PERFORMANS ÇORAP',
    price: 320,
    stock: 100,
    soldCount: 35,
    rating: 4.9,
    reviewsCount: 89,
    coverImage: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=800&auto=format&fit=crop',
    colorsCount: 2,
  },
  {
    id: 'tote-bag-01',
    slug: 'tote-bag-01',
    title: 'ORISE Ağır Kanvas Bez Çanta',
    subtitle: '16 oz Organic Heavy Canvas',
    category: 'bag',
    categoryLabel: 'ÇANTA',
    price: 750,
    stock: 60,
    soldCount: 24,
    rating: 4.7,
    reviewsCount: 31,
    coverImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop',
    colorsCount: 2,
  },
  {
    id: 'steel-bottle-01',
    slug: 'steel-bottle-01',
    title: 'ORISE Çift Duvarlı Matara 750ml',
    subtitle: 'Vacuum Insulated Stainless Steel',
    category: 'equipment',
    categoryLabel: 'TERMOS & MATARA',
    price: 1150,
    stock: 45,
    soldCount: 20,
    rating: 4.9,
    reviewsCount: 54,
    coverImage: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop',
    colorsCount: 2,
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
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filteredProducts =
    activeCategory === 'all'
      ? PRODUCTS_CATALOG
      : PRODUCTS_CATALOG.filter((p) => p.category === activeCategory)

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
      <section className="relative overflow-hidden border-b border-white/10 pt-32 pb-16 lg:pt-40 lg:pb-20">
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
                Sınırlı sayıda üretilen teknik spor tekstili. Ürüne tıklayarak renk, beden ve laboratuvar detaylarını incele.
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

      {/* 2. ÜRÜN VİTRİNİ & TIKLANABİLİR KARTLAR */}
      <section className="border-b border-white/10 bg-zinc-950/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
          
          {/* Ayrık Kategori Filtresi */}
          <div className="mb-12 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    activeCategory === cat.id
                      ? 'bg-primary text-black shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-105'
                      : 'border border-white/10 bg-zinc-900/60 text-zinc-400 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-zinc-500 uppercase">
              [{filteredProducts.length} PARÇA]
            </span>
          </div>

          {/* Ürün Listesi Grid'i */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => {
              const remainingStock = product.stock - product.soldCount
              const isSoldOut = remainingStock <= 0
              const isLowStock = remainingStock > 0 && remainingStock <= 10

              return (
                <Link
                  key={product.id}
                  href={`/store/${product.slug}`}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 p-5 backdrop-blur-md transition-all duration-500 hover:border-primary/60 hover:bg-zinc-900/80 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]"
                >
                  <div>
                    {/* Görsel */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-950">
                      <Image
                        src={product.coverImage}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Rozetler */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        <span className="rounded-full border border-primary/40 bg-black/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary backdrop-blur-md">
                          DROP 01
                        </span>

                        {isSoldOut && (
                          <span className="rounded-full bg-red-500/90 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
                            TÜKENDİ
                          </span>
                        )}

                        {isLowStock && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black backdrop-blur-md">
                            <Flame className="h-3 w-3" /> Son {remainingStock} Adet
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-mono text-zinc-300 backdrop-blur-md border border-white/10">
                        {product.colorsCount} Renk Opsiyonu
                      </div>
                    </div>

                    {/* Başlık & Puan */}
                    <div className="mt-5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-primary uppercase tracking-widest">
                          {product.categoryLabel}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
                          <Star className="h-3 w-3 fill-amber-400" />
                          <span>{product.rating}</span>
                          <span className="text-zinc-500">({product.reviewsCount})</span>
                        </div>
                      </div>

                      <h3 className="font-sans text-lg font-bold text-white tracking-tight group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-1">{product.subtitle}</p>
                    </div>
                  </div>

                  {/* Fiyat & İncele Butonu */}
                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                    <div>
                      <div className="text-[10px] font-mono uppercase text-zinc-500">Fiyat</div>
                      <div className="text-lg font-black text-white">
                        ₺{product.price.toLocaleString('tr-TR')}
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-zinc-800/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-200 backdrop-blur-md transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-black">
                      <span>İncele</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. KALİTE PRENSİPLERİ */}
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

      {/* 4. INSTAGRAM HUB */}
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
