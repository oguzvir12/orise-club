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
import { InstagramIcon } from '@/components/icons/instagram-icon'

const STORE_INSTAGRAM = 'https://www.instagram.com/orisestore/'

// Sadeleştirilmiş ve Birbirinden Ayrılmış Net Kategoriler
const CATEGORIES = [
  { id: 'all', label: 'TÜMÜ' },
  { id: 'tank', label: 'KOŞU ATLETİ' },
  { id: 'sweatshirt', label: 'SWEATSHIRT' },
  { id: 'socks', label: 'PERFORMANS ÇORAP' },
  { id: 'hat', label: 'ŞAPKA' },
  { id: 'bag', label: 'ÇANTA' },
  { id: 'equipment', label: 'TERMOS & MATARA' },
]

// Çoklu Fotoğraf ve Renk Desteğine Sahip Ürün Kataloğu
interface Product {
  id: string
  title: string
  category: string
  categoryLabel: string
  price: number
  description: string
  images: string[] // [Ön Görsel, Arka Görsel, Detay]
  colors: { name: string; hex: string }[]
}

const STORE_PRODUCTS: Product[] = [
  {
    id: 'pro-tank-black',
    title: 'ORISE Pro Koşu Atleti',
    category: 'tank',
    categoryLabel: 'KOŞU ATLETİ',
    price: 950,
    description: 'Ultra hafif nefes alabilir mikro file kumaş (120 GSM). Sırt havalandırma paneli.',
    images: [
      'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=800&auto=format&fit=crop', // Ön
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=800&auto=format&fit=crop', // Arka
    ],
    colors: [
      { name: 'Siyah', hex: '#18181b' },
      { name: 'Kulüp Turuncusu', hex: '#f97316' },
      { name: 'Tebeşir Beyazı', hex: '#e4e4e7' },
    ],
  },
  {
    id: 'club-sweatshirt-black',
    title: 'ORISE Bisiklet Yaka Sweatshirt',
    category: 'sweatshirt',
    categoryLabel: 'SWEATSHIRT',
    price: 2490,
    description: '450 GSM ağır gramaj şardonlu pamuk. Göğüste kabartma silikon kulüp amblemi.',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=800&auto=format&fit=crop',
    ],
    colors: [
      { name: 'Mat Siyah', hex: '#09090b' },
      { name: 'Füme', hex: '#27272a' },
    ],
  },
  {
    id: 'club-cap-black',
    title: 'ORISE Atletik Kulüp Şapkası',
    category: 'hat',
    categoryLabel: 'ŞAPKA',
    price: 890,
    description: '6 panelli pamuklu dimi kumaş, ayarlanabilir metal tokalı arka kayış.',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?q=80&w=800&auto=format&fit=crop',
    ],
    colors: [
      { name: 'Siyah', hex: '#18181b' },
      { name: 'Taş Rengi', hex: '#d4d4d8' },
    ],
  },
  {
    id: 'tote-bag-black',
    title: 'ORISE Ağır Kanvas Bez Çanta',
    category: 'bag',
    categoryLabel: 'ÇANTA',
    price: 750,
    description: '16 oz yüksek dayanımlı organik kanvas kumaş. Turuncu güçlendirilmiş omuz askısı.',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?q=80&w=800&auto=format&fit=crop',
    ],
    colors: [
      { name: 'Siyah / Turuncu', hex: '#18181b' },
      { name: 'Ham Kanvas', hex: '#f5f5f4' },
    ],
  },
  {
    id: 'crew-socks-white',
    title: 'ORISE Performans Koşu Çorabı',
    category: 'socks',
    categoryLabel: 'PERFORMANS ÇORAP',
    price: 320,
    description: 'Coolmax nefes alabilir örgü dokuma. Topuk ve burun çift katman darbe emici takviye.',
    images: [
      'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582966772680-860e372bb558?q=80&w=800&auto=format&fit=crop',
    ],
    colors: [
      { name: 'Optik Beyaz', hex: '#f8fafc' },
      { name: 'Koyu Grafit', hex: '#1e293b' },
    ],
  },
  {
    id: 'steel-bottle-black',
    title: 'ORISE Çift Duvarlı Termos Matara 750ml',
    category: 'equipment',
    categoryLabel: 'TERMOS & MATARA',
    price: 1150,
    description: 'Mat siyah çift cidarlı paslanmaz çelik. 24 saat soğuk, 12 saat sıcak tutma performansı.',
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=800&auto=format&fit=crop',
    ],
    colors: [
      { name: 'Mat Siyah', hex: '#09090b' },
      { name: 'Fırçalanmış Çelik', hex: '#a1a1aa' },
    ],
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
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({})
  const [activeImageIndex, setActiveImageIndex] = useState<Record<string, number>>({})
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({})

  const handleColorChange = (productId: string, colorName: string) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: colorName }))
  }

  const handleImageSwitch = (productId: string, imgIdx: number) => {
    setActiveImageIndex((prev) => ({ ...prev, [productId]: imgIdx }))
  }

  const handleAddToCart = (id: string) => {
    setAddedItems((prev) => ({ ...prev, [id]: true }))
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [id]: false }))
    }, 1500)
  }

  const filteredProducts =
    activeCategory === 'all'
      ? STORE_PRODUCTS
      : STORE_PRODUCTS.filter((p) => p.category === activeCategory)

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

      {/* 2. SADELEŞTİRİLMİŞ AYRIK KATEGORİ SEÇİCİ & ÜRÜN IZGARASI */}
      <section className="border-b border-white/10 bg-zinc-950/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
          
          {/* Ayrık Kategori Hapları */}
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

          {/* Ürün Kartları Grid'i */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => {
              const currentImgIdx = activeImageIndex[product.id] || 0
              const selectedColor = selectedColors[product.id] || product.colors[0]?.name
              const isAdded = addedItems[product.id]

              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 p-5 backdrop-blur-md transition-all duration-500 hover:border-primary/50 hover:bg-zinc-900/70"
                >
                  <div>
                    {/* Önlü / Arkalı Fotoğraf Galerisi Alanı */}
                    <div
                      className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-950 cursor-pointer"
                      onMouseEnter={() => product.images.length > 1 && handleImageSwitch(product.id, 1)}
                      onMouseLeave={() => handleImageSwitch(product.id, 0)}
                    >
                      <Image
                        src={product.images[currentImgIdx] || product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      <div className="absolute top-3 left-3 rounded-full border border-primary/40 bg-black/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary backdrop-blur-md">
                        LIMITED DROP
                      </div>

                      {/* Çoklu Fotoğraf / Açı Geçiş Noktaları (Ön / Arka) */}
                      {product.images.length > 1 && (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 backdrop-blur-md border border-white/10">
                          {product.images.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleImageSwitch(product.id, idx)
                              }}
                              className={`h-1.5 rounded-full transition-all ${
                                currentImgIdx === idx ? 'w-4 bg-primary' : 'w-1.5 bg-zinc-500'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Renk Seçim Paleti */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {product.colors.map((color) => (
                          <button
                            key={color.name}
                            type="button"
                            title={color.name}
                            onClick={() => handleColorChange(product.id, color.name)}
                            className={`relative h-4 w-4 rounded-full border transition-all ${
                              selectedColor === color.name
                                ? 'scale-125 border-primary ring-2 ring-primary/40'
                                : 'border-white/20 hover:scale-110'
                            }`}
                            style={{ backgroundColor: color.hex }}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                        {selectedColor}
                      </span>
                    </div>

                    {/* Ürün Detayları */}
                    <div className="mt-3 space-y-1">
                      <div className="text-[10px] font-mono text-primary uppercase tracking-widest">
                        {product.categoryLabel}
                      </div>
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
