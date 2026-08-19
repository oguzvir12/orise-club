'use client'

import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
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
  MessageSquare,
  UserCheck,
  Flame,
  AlertCircle,
  Share2,
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

interface ProductColor {
  name: string
  hex: string
  images: string[]
}

interface ProductData {
  id: string
  slug: string
  title: string
  subtitle: string
  category: string
  categoryLabel: string
  price: number
  stock: number
  soldCount: number
  description: string
  specs: { label: string; value: string }[]
  sizes: string[]
  colors: ProductColor[]
}

const PRODUCTS: ProductData[] = [
  {
    id: 'pro-tank-01',
    slug: 'pro-tank-01',
    title: 'ORISE Pro Koşu Atleti',
    subtitle: 'Ultralight Race-Day Mesh Edition',
    category: 'tank',
    categoryLabel: 'KOŞU ATLETİ',
    price: 950,
    stock: 50,
    soldCount: 42,
    description:
      'Yüksek tempolu koşularda ve sıcak hava antrenmanlarında maksimum hava sirkülasyonu sağlayan 120 GSM mikro gözenekli teknik kumaş. Lazer kesim sırt havalandırma kanalları ve sürtünmeyi önleyen dikişsiz yaka mimarisi.',
    specs: [
      { label: 'Kumaş Ağırlığı', value: '120 GSM Ultra Hafif' },
      { label: 'Nem Yönetimi', value: 'Hızlı Kuruyan Mikro File' },
      { label: 'Kalıp / Fit', value: 'Atletik Slim-Fit' },
      { label: 'Yansıtıcı Detay', value: '3M Reflektif Kulüp Logosu' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      {
        name: 'Mat Siyah',
        hex: '#18181b',
        images: [
          'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=1200&auto=format&fit=crop',
        ],
      },
      {
        name: 'Kulüp Turuncusu',
        hex: '#f97316',
        images: [
          'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
        ],
      },
      {
        name: 'Tebeşir Beyazı',
        hex: '#e4e4e7',
        images: [
          'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&auto=format&fit=crop',
        ],
      },
    ],
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
    soldCount: 12,
    description:
      '450 GSM ağır gramaj şardonlu %100 pamuk dokuma. Antrenman öncesi ve sonrası vücut ısısını koruyan dökümlü sokak kalıbı.',
    specs: [
      { label: 'Kumaş', value: '450 GSM Ağır Gramaj Pamuk' },
      { label: 'Astar', value: 'Şardonlu Sıcak Tutan İç Doku' },
      { label: 'Baskı', value: 'Yüksek Yoğunluklu Silikon Amblem' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      {
        name: 'Siyah',
        hex: '#09090b',
        images: [
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1200&auto=format&fit=crop',
        ],
      },
      {
        name: 'Füme',
        hex: '#27272a',
        images: [
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop',
        ],
      },
    ],
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
    soldCount: 40,
    description:
      '6 panelli pamuklu dimi kumaş, ter bandı takviyeli iç yapı ve ayarlanabilir mat metal tokalı arka kayış.',
    specs: [
      { label: 'Kumaş', value: '%100 Dayanıklı Pamuk Dimi' },
      { label: 'Kalıp', value: 'Standart / Ayarlanabilir' },
    ],
    sizes: ['Tek Ebat (Ayarlanabilir)'],
    colors: [
      {
        name: 'Siyah',
        hex: '#18181b',
        images: [
          'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1200&auto=format&fit=crop',
        ],
      },
      {
        name: 'Taş Rengi',
        hex: '#d4d4d8',
        images: [
          'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?q=80&w=1200&auto=format&fit=crop',
        ],
      },
    ],
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
    soldCount: 25,
    description:
      'Coolmax nefes alabilir örgü dokuma. Topuk ve burun çift katman darbe emici takviye ile ayak kemeri destek bandı.',
    specs: [
      { label: 'İplik', value: 'Coolmax + Elastan' },
      { label: 'Destek', value: 'Ayak Kemeri Kompresyon Şeridi' },
    ],
    sizes: ['36-40', '41-45'],
    colors: [
      {
        name: 'Optik Beyaz',
        hex: '#f8fafc',
        images: [
          'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=1200&auto=format&fit=crop',
        ],
      },
      {
        name: 'Koyu Grafit',
        hex: '#1e293b',
        images: [
          'https://images.unsplash.com/photo-1582966772680-860e372bb558?q=80&w=1200&auto=format&fit=crop',
        ],
      },
    ],
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
    soldCount: 15,
    description:
      '16 oz yüksek mukavemetli organik pamuk kanvas. Çapraz dikiş takviyeli geniş omuz askıları ve iç fermuarlı cep.',
    specs: [
      { label: 'Malzeme', value: '16 oz Ağır Kanvas' },
      { label: 'Hacim', value: '25 Litre Geniş İç Hacim' },
    ],
    sizes: ['Tek Boyut'],
    colors: [
      {
        name: 'Siyah',
        hex: '#18181b',
        images: [
          'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200&auto=format&fit=crop',
        ],
      },
      {
        name: 'Ham Kanvas',
        hex: '#f5f5f4',
        images: [
          'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?q=80&w=1200&auto=format&fit=crop',
        ],
      },
    ],
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
    soldCount: 10,
    description:
      'Çift cidarlı vakumlu 18/8 gıda sınıfı paslanmaz çelik. 24 saat soğuk, 12 saat sıcak tutma performansı.',
    specs: [
      { label: 'Gövde', value: '18/8 Paslanmaz Çelik' },
      { label: 'Kapasite', value: '750 ml' },
    ],
    sizes: ['750 ml'],
    colors: [
      {
        name: 'Mat Siyah',
        hex: '#09090b',
        images: [
          'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1200&auto=format&fit=crop',
        ],
      },
      {
        name: 'Adaçayı Yeşili',
        hex: '#4d5d53',
        images: [
          'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1200&auto=format&fit=crop',
        ],
      },
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

function StoreContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productParam = searchParams.get('product')

  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null)

  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isAdded, setIsAdded] = useState<boolean>(false)
  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [copiedLink, setCopiedLink] = useState<boolean>(false)

  // Kalıcı Yorum Yönetimi (Local Storage Altyapısı)
  const [productReviews, setProductReviews] = useState<Record<string, any[]>>({})
  const [newAuthor, setNewAuthor] = useState('')
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')
  const [commentSuccess, setCommentSuccess] = useState(false)

  // 1. URL'den Ürünü Çek (Doğrudan Linkleme Desteği)
  useEffect(() => {
    if (productParam) {
      const match = PRODUCTS.find((p) => p.slug === productParam || p.id === productParam)
      if (match) {
        setSelectedProduct(match)
        setSelectedColorIdx(0)
        setSelectedSize(match.sizes[0])
        setActiveImageIdx(0)
      }
    } else {
      setSelectedProduct(null)
    }
  }, [productParam])

  // 2. Yorumları Tarayıcı Hafızasından Yükle
  useEffect(() => {
    try {
      const saved = localStorage.getItem('orise_store_reviews')
      if (saved) {
        setProductReviews(JSON.parse(saved))
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const openProductDetail = (product: ProductData) => {
    setSelectedProduct(product)
    setSelectedColorIdx(0)
    setSelectedSize(product.sizes[0])
    setActiveImageIdx(0)
    setIsAdded(false)
    router.push(`/store?product=${product.slug}`, { scroll: false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeProductDetail = () => {
    setSelectedProduct(null)
    router.push('/store', { scroll: false })
  }

  const handleColorSelect = (idx: number) => {
    setSelectedColorIdx(idx)
    setActiveImageIdx(0)
  }

  const handleAddToCart = () => {
    if (!selectedProduct) return
    const remaining = selectedProduct.stock - selectedProduct.soldCount
    if (remaining <= 0) return
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    }
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct || !newAuthor.trim() || !newComment.trim()) return

    const newEntry = {
      id: Date.now(),
      author: newAuthor.trim(),
      verified: true,
      rating: newRating,
      date: 'Bugün',
      comment: newComment.trim(),
    }

    const updatedReviews = {
      ...productReviews,
      [selectedProduct.id]: [newEntry, ...(productReviews[selectedProduct.id] || [])],
    }

    setProductReviews(updatedReviews)
    localStorage.setItem('orise_store_reviews', JSON.stringify(updatedReviews))

    setNewAuthor('')
    setNewComment('')
    setCommentSuccess(true)
    setTimeout(() => setCommentSuccess(false), 3500)
  }

  const filteredProducts =
    activeCategory === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory)

  const currentProduct = selectedProduct
  const activeColor = currentProduct?.colors[selectedColorIdx] || currentProduct?.colors[0]
  const currentImages = activeColor?.images || []
  const currentReviews = currentProduct ? productReviews[currentProduct.id] || [] : []
  const remainingStock = currentProduct ? currentProduct.stock - currentProduct.soldCount : 0
  const isSoldOut = remainingStock <= 0
  const isLowStock = remainingStock > 0 && remainingStock <= 10

  const averageRating =
    currentReviews.length > 0
      ? (
          currentReviews.reduce((acc, curr) => acc + curr.rating, 0) /
          currentReviews.length
        ).toFixed(1)
      : null

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black">
      {/* Sol Üst Sabit Navigasyon Butonu */}
      <div className="fixed top-4 left-6 z-[60] sm:left-8">
        {selectedProduct ? (
          <button
            type="button"
            onClick={closeProductDetail}
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/80 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-zinc-200 backdrop-blur-xl transition-all duration-300 hover:border-primary hover:bg-black hover:text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.35)]"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-primary transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Tüm Koleksiyon</span>
          </button>
        ) : (
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/80 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-zinc-200 backdrop-blur-xl transition-all duration-300 hover:border-primary hover:bg-black hover:text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.35)]"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-primary transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Ana Sayfa</span>
          </Link>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. ÜRÜN DETAY SAYFASI (ÖZEL LINK İLE PAYLAŞILABİLİR)                       */}
      {/* ========================================================================= */}
      {selectedProduct && activeColor ? (
        <div>
          <section className="pt-28 pb-20 sm:pt-36 sm:pb-24 border-b border-white/10">
            <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
                
                {/* SOL: GALERİ */}
                <div className="lg:col-span-7 space-y-4">
                  <div
                    onClick={() => setIsModalOpen(true)}
                    className="group relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 cursor-zoom-in shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                  >
                    <Image
                      src={currentImages[activeImageIdx] || currentImages[0]}
                      alt={`${selectedProduct.title} - ${activeColor.name}`}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="rounded-full border border-primary/40 bg-black/80 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-primary backdrop-blur-md">
                        {activeColor.name} · DROP 01
                      </span>

                      {isLowStock && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black backdrop-blur-md">
                          <Flame className="h-3.5 w-3.5" /> Son {remainingStock} Adet Kaldı
                        </span>
                      )}

                      {isSoldOut && (
                        <span className="rounded-full bg-red-500 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
                          TÜKENDİ / DROP KAPANDI
                        </span>
                      )}
                    </div>

                    <div className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 border border-white/10 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all">
                      <Maximize2 className="h-4 w-4 text-primary" />
                    </div>

                    <div className="absolute bottom-4 left-4 rounded-full bg-black/70 border border-white/10 px-3 py-1 text-[10px] font-mono text-zinc-300 backdrop-blur-md">
                      FOTOĞRAFA TIKLA & BÜYÜT [{activeImageIdx + 1}/{currentImages.length}]
                    </div>
                  </div>

                  {/* Küçük Fotoğraflar */}
                  {currentImages.length > 1 && (
                    <div className="grid grid-cols-3 gap-4">
                      {currentImages.map((img, idx) => (
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
                  )}
                </div>

                {/* SAĞ: SATIN ALMA VE DETAYLAR */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono tracking-widest text-primary uppercase">
                        {selectedProduct.categoryLabel}
                      </span>
                      <div className="flex items-center gap-2">
                        {/* Link Kopyalama Butonu */}
                        <button
                          type="button"
                          onClick={handleShareLink}
                          title="Ürün Linkini Kopyala"
                          className="flex h-9 items-center gap-1.5 rounded-full border border-white/10 bg-zinc-900/60 px-3 text-xs font-mono text-zinc-300 hover:border-primary hover:text-white transition-all"
                        >
                          {copiedLink ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Kopyalandı</span>
                            </>
                          ) : (
                            <>
                              <Share2 className="h-3.5 w-3.5 text-primary" />
                              <span>Paylaş</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsLiked(!isLiked)}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <h1 className="mt-2 font-sans text-3xl font-black tracking-tight text-white sm:text-4xl">
                      {selectedProduct.title}
                    </h1>
                    <p className="text-sm font-mono text-zinc-400 mt-1">{selectedProduct.subtitle}</p>

                    {/* Değerlendirme Özeti */}
                    <div className="mt-4 flex items-center gap-3 border-y border-white/10 py-3">
                      {averageRating ? (
                        <>
                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.round(Number(averageRating))
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-zinc-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-mono text-sm font-bold text-white">{averageRating}</span>
                          <span className="text-xs text-zinc-500">·</span>
                          <a href="#reviews-section" className="text-xs font-mono text-zinc-400 underline hover:text-primary">
                            {currentReviews.length} Üye Yorumu
                          </a>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                          <Star className="h-4 w-4 text-zinc-600" />
                          <span>Henüz değerlendirilmedi —</span>
                          <a href="#reviews-section" className="text-primary underline">
                            İlk yorumu sen yaz
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Fiyat & Stok */}
                    <div className="mt-6 flex items-end justify-between">
                      <div>
                        <span className="text-xs font-mono text-zinc-500 uppercase">Kulüp Satış Fiyatı</span>
                        <div className="text-3xl font-black text-white">₺{selectedProduct.price.toLocaleString('tr-TR')}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block">Drop Kotası</span>
                        <span className="text-xs font-mono font-bold text-primary">
                          {isSoldOut ? '0 / KOTA DOLDU' : `${remainingStock} Adet Kaldı`}
                        </span>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-zinc-300">{selectedProduct.description}</p>

                    {/* Renk Seçimi (Fotoğrafı Anında Değiştirir) */}
                    <div className="mt-6 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-zinc-400 uppercase">Seçili Renk</span>
                        <span className="font-bold text-primary">{activeColor.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {selectedProduct.colors.map((c, idx) => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => handleColorSelect(idx)}
                            className={`h-8 w-8 rounded-full border transition-all ${
                              selectedColorIdx === idx
                                ? 'scale-125 border-primary ring-2 ring-primary/40 shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                                : 'border-white/20 hover:scale-110 opacity-70'
                            }`}
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Beden Seçimi */}
                    <div className="mt-6 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-zinc-400 uppercase">Beden Seçimi</span>
                        <span className="text-zinc-500 text-[11px]">Race-Fit</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {selectedProduct.sizes.map((s) => (
                          <button
                            key={s}
                            type="button"
                            disabled={isSoldOut}
                            onClick={() => setSelectedSize(s)}
                            className={`rounded-xl py-3 text-xs font-bold transition-all ${
                              selectedSize === s
                                ? 'border border-primary bg-primary text-black shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                                : 'border border-white/10 bg-zinc-900 text-zinc-300 hover:border-white/30'
                            } ${isSoldOut ? 'opacity-30 cursor-not-allowed' : ''}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Teknik Laboratuvar Verileri */}
                    <div className="mt-8 rounded-2xl border border-white/5 bg-zinc-900/40 p-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-2">
                        <Activity className="h-3.5 w-3.5" />
                        <span>Teknik Laboratuvar Verileri</span>
                      </div>
                      {selectedProduct.specs.map((sp, idx) => (
                        <div key={idx} className="flex justify-between text-xs font-mono">
                          <span className="text-zinc-500">{sp.label}</span>
                          <span className="text-zinc-200">{sp.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sepete Ekle */}
                  <div className="pt-4">
                    <button
                      type="button"
                      disabled={isSoldOut}
                      onClick={handleAddToCart}
                      className={`flex w-full items-center justify-center gap-3 rounded-full py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                        isSoldOut
                          ? 'bg-zinc-800 text-zinc-500 border border-white/10 cursor-not-allowed'
                          : isAdded
                            ? 'bg-emerald-500 text-black shadow-[0_0_25px_rgba(16,185,129,0.5)]'
                            : 'bg-primary text-black shadow-[0_0_25px_rgba(249,115,22,0.4)] hover:scale-[1.02]'
                      }`}
                    >
                      {isSoldOut ? (
                        <>
                          <AlertCircle className="h-4 w-4" />
                          <span>DROP TÜKENDİ / SATIŞA KAPALI</span>
                        </>
                      ) : isAdded ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>{selectedSize} Beden ({activeColor.name}) Eklendi</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-4 w-4" />
                          <span>Siparişe Ekle — ₺{selectedProduct.price}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* GERÇEK YORUM VE DEĞERLENDİRME BÖLÜMÜ */}
          <section id="reviews-section" className="border-b border-white/10 bg-zinc-950/60 py-20 sm:py-24">
            <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
              <div className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>KULÜP DENEYİMLERİ</span>
                  </div>
                  <h2 className="mt-2 font-sans text-3xl font-black tracking-tight text-white">
                    Üye Değerlendirmeleri
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-sm font-mono text-zinc-400">
                  <span>Ortalama Puan:</span>
                  <span className="text-xl font-bold text-primary">
                    {averageRating ? `${averageRating} / 5.0` : '—'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                {/* Form */}
                <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-zinc-900/40 p-6 md:p-8 backdrop-blur-md">
                  <h3 className="text-lg font-bold text-white mb-2">Deneyimini Paylaş</h3>
                  <p className="text-xs text-zinc-400 mb-6">
                    Ürünü kullandıktan sonra kalıp ve performans hakkındaki düşüncelerini kulüple paylaş.
                  </p>

                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                        İsim Soyisim / Rumuz
                      </label>
                      <input
                        type="text"
                        required
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        placeholder="Örn: Burak T."
                        className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Puanın</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewRating(star)}
                            className="p-1 text-amber-400 hover:scale-125 transition-transform"
                          >
                            <Star className={`h-5 w-5 ${star <= newRating ? 'fill-amber-400' : 'text-zinc-600'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Yorumun</label>
                      <textarea
                        required
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Kumaş hissi, nefes alabilirlik ve kalıp hakkında..."
                        className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-primary focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-full bg-primary py-3 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:scale-[1.02] transition-transform"
                    >
                      Değerlendirmeyi Gönder
                    </button>

                    {commentSuccess && (
                      <p className="text-center text-xs font-bold text-emerald-400 animate-fadeIn">
                        ✓ Yorumun eklendi, kaydedildi!
                      </p>
                    )}
                  </form>
                </div>

                {/* Yorum Listesi */}
                <div className="lg:col-span-7 space-y-4">
                  {currentReviews.length > 0 ? (
                    currentReviews.map((rev) => (
                      <div key={rev.id} className="rounded-2xl border border-white/10 bg-zinc-900/30 p-5 backdrop-blur-md">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{rev.author}</span>
                            {rev.verified && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/30 px-2 py-0.5 text-[9px] font-mono text-primary">
                                <UserCheck className="h-3 w-3" /> Doğrulanmış Koşucu
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-zinc-500">{rev.date}</span>
                        </div>

                        <div className="flex items-center gap-1 text-amber-400 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3.5 w-3.5 ${i < rev.rating ? 'fill-amber-400' : 'text-zinc-600'}`} />
                          ))}
                        </div>

                        <p className="text-xs leading-relaxed text-zinc-300">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="flex h-48 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-zinc-900/20 text-center">
                      <MessageSquare className="h-8 w-8 text-zinc-600 mb-2" />
                      <p className="text-xs text-zinc-400">Bu parça için henüz yorum yapılmadı.</p>
                      <p className="text-[11px] text-zinc-600">İlk deneyimini paylaşan sen ol.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* BÜYÜTME MODALI (LIGHTBOX) */}
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
                  src={currentImages[activeImageIdx] || currentImages[0]}
                  alt={selectedProduct.title}
                  fill
                  className="object-contain"
                />

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 rounded-full bg-black/80 px-4 py-2 border border-white/10 backdrop-blur-md">
                  {currentImages.map((_, idx) => (
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
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. MAĞAZA VİTRİNİ (TÜM PARÇALAR LİSTESİ)                                 */
        /* ========================================================================= */
        <>
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
                  const productStock = product.stock - product.soldCount
                  const isItemSoldOut = productStock <= 0
                  const isItemLow = productStock > 0 && productStock <= 10

                  return (
                    <div
                      key={product.id}
                      onClick={() => openProductDetail(product)}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 p-5 backdrop-blur-md transition-all duration-500 hover:border-primary/60 hover:bg-zinc-900/80 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] cursor-pointer"
                    >
                      <div>
                        {/* Görsel */}
                        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-950">
                          <Image
                            src={product.colors[0]?.images[0] || ''}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          />

                          {/* Rozetler */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                            <span className="rounded-full border border-primary/40 bg-black/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary backdrop-blur-md">
                              DROP 01
                            </span>

                            {isItemSoldOut && (
                              <span className="rounded-full bg-red-500/90 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
                                TÜKENDİ
                              </span>
                            )}

                            {isItemLow && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black backdrop-blur-md">
                                <Flame className="h-3 w-3" /> Son {productStock} Adet
                              </span>
                            )}
                          </div>

                          <div className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-mono text-zinc-300 backdrop-blur-md border border-white/10">
                            {product.colors.length} Renk
                          </div>
                        </div>

                        {/* Başlık & Kategori */}
                        <div className="mt-5 space-y-1.5">
                          <div className="text-[10px] font-mono text-primary uppercase tracking-widest">
                            {product.categoryLabel}
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
                    </div>
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
        </>
      )}
    </div>
  )
}

export default function StorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <StoreContent />
    </Suspense>
  )
}
