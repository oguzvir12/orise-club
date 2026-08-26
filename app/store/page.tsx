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
  ShoppingBag,
  Check,
  X,
  Maximize2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useCart } from '@/components/cart/cart-provider'
import { supabase } from '@/lib/supabase'

const CATEGORIES = [
  { id: 'all', label: 'TÜMÜ' },
  { id: 'tank', label: 'KOŞU ATLETİ' },
  { id: 'sweatshirt', label: 'SWEATSHIRT' },
  { id: 'socks', label: 'PERFORMANS ÇORAP' },
  { id: 'hat', label: 'ŞAPKA' },
  { id: 'bag', label: 'ÇANTA' },
  { id: 'equipment', label: 'TERMOS & MATARA' },
]

function StoreContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productParam = searchParams.get('product')

  const { addItem } = useCart()

  const [products, setProducts] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)

  const [selectedSize, setSelectedSize] = useState<string>('M')
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false)
  const [isAdded, setIsAdded] = useState<boolean>(false)

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) {
      setProducts(data)
    }
  }

  useEffect(() => {
    fetchProducts()
    const handleFocus = () => fetchProducts()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  useEffect(() => {
    if (productParam && products.length > 0) {
      const match = products.find((p) => p.id === productParam)
      if (match) {
        setSelectedProduct(match)
        setSelectedSize('M')
        setActiveImageIdx(0)
      }
    } else {
      setSelectedProduct(null)
    }
  }, [productParam, products])

  const openProductDetail = (product: any) => {
    setSelectedProduct(product)
    setSelectedSize('M')
    setActiveImageIdx(0)
    setIsAdded(false)
    router.push(`/store?product=${product.id}`, { scroll: false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeProductDetail = () => {
    setSelectedProduct(null)
    router.push('/store', { scroll: false })
  }

  const handleAddToCart = () => {
    if (!selectedProduct) return
    const image = selectedProduct.image_urls?.[0] || selectedProduct.image_url || '/placeholder.svg'

    addItem({
      id: `${selectedProduct.id}-${selectedSize}`,
      name: `${selectedProduct.title} (${selectedSize})`,
      price: selectedProduct.price,
      image: image,
      type: 'product',
    })

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory)

  const currentProduct = selectedProduct
  const currentImages = currentProduct?.image_urls && currentProduct.image_urls.length > 0
    ? currentProduct.image_urls
    : currentProduct?.image_url
      ? [currentProduct.image_url]
      : ['/placeholder.svg']

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black">
      <div className="fixed top-4 left-6 z-[60] sm:left-8">
        {selectedProduct ? (
          <button
            type="button"
            onClick={closeProductDetail}
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/80 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-zinc-200 backdrop-blur-xl transition-all duration-300 hover:border-primary hover:bg-black hover:text-white cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-primary transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Tüm Koleksiyon</span>
          </button>
        ) : (
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/80 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-zinc-200 backdrop-blur-xl transition-all duration-300 hover:border-primary hover:bg-black hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-primary transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Ana Sayfa</span>
          </Link>
        )}
      </div>

      {selectedProduct ? (
        <div>
          <section className="pt-28 pb-20 sm:pt-36 sm:pb-24 border-b border-white/10">
            <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
                
                {/* SOL: ÜRÜN GÖRSELLERİ VE BÜYÜTME (LIGHTBOX) ALANI */}
                <div className="lg:col-span-7 space-y-4">
                  <div
                    onClick={() => setIsLightboxOpen(true)}
                    className="group relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 flex items-center justify-center cursor-zoom-in"
                  >
                    <Image
                      src={currentImages[activeImageIdx] || currentImages[0]}
                      alt={selectedProduct.title}
                      fill
                      priority
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="inline-flex items-center gap-2 rounded-full bg-black/80 border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md shadow-2xl">
                        <Maximize2 className="h-4 w-4 text-primary" />
                        <span>Fotoğrafı Büyüt / İncele</span>
                      </span>
                    </div>
                  </div>

                  {currentImages.length > 1 && (
                    <div className="flex items-center gap-3 overflow-x-auto pb-2">
                      {currentImages.map((img: string, idx: number) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveImageIdx(idx)}
                          className={`relative aspect-square w-20 flex-none overflow-hidden rounded-xl border transition-all cursor-pointer ${
                            activeImageIdx === idx ? 'border-primary ring-2 ring-primary/50' : 'border-white/10 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <Image src={img} alt={`Önizleme ${idx + 1}`} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* SAĞ: DETAYLAR */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
                  <div>
                    <span className="text-xs font-mono tracking-widest text-primary uppercase">
                      {selectedProduct.category_label || 'ÖZEL DROP'}
                    </span>

                    <h1 className="mt-2 font-sans text-3xl font-black tracking-tight text-white sm:text-4xl">
                      {selectedProduct.title}
                    </h1>
                    <p className="text-sm font-mono text-zinc-400 mt-1">{selectedProduct.subtitle}</p>

                    <div className="mt-6 flex items-end justify-between">
                      <div>
                        <span className="text-xs font-mono text-zinc-500 uppercase">Kulüp Satış Fiyatı</span>
                        <div className="text-3xl font-black text-white">₺{Number(selectedProduct.price).toLocaleString('tr-TR')}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block">Stok Durumu</span>
                        <span className="text-xs font-mono font-bold text-primary">
                          {selectedProduct.stock} Adet Kaldı
                        </span>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-zinc-300">{selectedProduct.description}</p>

                    {/* Beden Seçimi */}
                    <div className="mt-6 space-y-2">
                      <div className="text-xs font-mono text-zinc-400 uppercase">Beden Seçimi</div>
                      <div className="grid grid-cols-4 gap-2">
                        {['S', 'M', 'L', 'XL'].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSelectedSize(s)}
                            className={`rounded-xl py-3 text-xs font-bold transition-all cursor-pointer ${
                              selectedSize === s
                                ? 'border border-primary bg-primary text-black font-black'
                                : 'border border-white/10 bg-zinc-900 text-zinc-300 hover:border-white/30'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`flex w-full items-center justify-center gap-3 rounded-full py-4 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                        isAdded ? 'bg-emerald-500 text-black font-black' : 'bg-primary text-black hover:scale-[1.02] font-black shadow-[0_0_25px_rgba(249,115,22,0.4)]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Sepete Eklendi</span>
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

          {/* TAM EKRAN BÜYÜTME (LIGHTBOX) MODALİ */}
          {isLightboxOpen && (
            <div
              className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-4 backdrop-blur-2xl"
              onClick={() => setIsLightboxOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary hover:text-black transition-colors cursor-pointer z-30"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="relative h-[90vh] w-[90vw] max-w-6xl flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <Image
                  src={currentImages[activeImageIdx]}
                  alt="Ürün Detay Büyük Görsel"
                  fill
                  className="object-contain"
                />

                {currentImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveImageIdx((prev) => (prev === 0 ? currentImages.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-black/80 border border-white/20 text-white hover:border-primary hover:bg-primary hover:text-black transition-all cursor-pointer shadow-2xl"
                    >
                      <ChevronLeft className="h-7 w-7" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveImageIdx((prev) => (prev === currentImages.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-black/80 border border-white/20 text-white hover:border-primary hover:bg-primary hover:text-black transition-all cursor-pointer shadow-2xl"
                    >
                      <ChevronRight className="h-7 w-7" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <section className="relative overflow-hidden border-b border-white/10 pt-32 pb-16 lg:pt-40 lg:pb-20">
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image src="/store-hero.jpeg" alt="ORISE Store Drop" fill priority className="object-cover opacity-25 grayscale contrast-125" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                  <span>HAREKET KULÜBÜ & STÜDYO</span>
                </div>
                <h1 className="font-sans text-4xl font-black tracking-tighter text-white sm:text-6xl lg:text-7xl">
                  Kulübe Özel <span className="text-primary">Drop</span> Koleksiyonu.
                </h1>
              </div>
            </div>
          </section>

          {/* KATEGORİ FİLTRELERİ */}
          <section className="border-b border-white/10 bg-zinc-950/80 sticky top-16 z-40 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14 py-4">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-primary text-black font-black shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                        : 'border border-white/10 bg-black/60 text-zinc-400 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-b from-black via-zinc-950/40 to-black py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => {
                  const productImages = product.image_urls && product.image_urls.length > 0
                    ? product.image_urls
                    : product.image_url
                      ? [product.image_url]
                      : ['/placeholder.svg']

                  return (
                    <div
                      key={product.id}
                      onClick={() => openProductDetail(product)}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 p-5 backdrop-blur-md transition-all hover:border-primary/60 cursor-pointer"
                    >
                      <div>
                        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-950 flex items-center justify-center">
                          <Image src={productImages[0]} alt={product.title} fill className="object-contain p-2 transition-transform duration-700 group-hover:scale-105" />
                        </div>

                        <div className="mt-5 space-y-1.5">
                          <div className="text-[10px] font-mono text-primary uppercase">{product.category_label || 'ÖZEL DROP'}</div>
                          <h3 className="font-sans text-lg font-bold text-white group-hover:text-primary">{product.title}</h3>
                          <p className="text-xs text-zinc-400 line-clamp-1">{product.subtitle}</p>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                        <div className="text-lg font-black text-white">₺{Number(product.price).toLocaleString('tr-TR')}</div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-zinc-800/80 px-4 py-2 text-xs font-bold uppercase text-zinc-200 group-hover:bg-primary group-hover:text-black group-hover:font-black transition-all">
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
