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
import { useCart } from '@/components/cart/cart-provider'
import { supabase } from '@/lib/supabase'

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

function StoreContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productParam = searchParams.get('product')

  const { addItem } = useCart()

  const [products, setProducts] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)

  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(0)
  const [selectedSize, setSelectedSize] = useState<string>('M')
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isAdded, setIsAdded] = useState<boolean>(false)
  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [copiedLink, setCopiedLink] = useState<boolean>(false)

  // Veritabanından Ürünleri Çekme Fonksiyonu
  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) {
      setProducts(data)
    }
  }

  // Sayfa ilk yüklendiğinde ve sekme her odaklandığında ürünleri veritabanından tazele
  useEffect(() => {
    fetchProducts()

    const handleFocus = () => {
      fetchProducts()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  useEffect(() => {
    if (productParam && products.length > 0) {
      const match = products.find((p) => p.id === productParam)
      if (match) {
        setSelectedProduct(match)
        setSelectedColorIdx(0)
        setSelectedSize('M')
        setActiveImageIdx(0)
      }
    } else {
      setSelectedProduct(null)
    }
  }, [productParam, products])

  const openProductDetail = (product: any) => {
    setSelectedProduct(product)
    setSelectedColorIdx(0)
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
    const image = selectedProduct.image_urls?.[0] || '/placeholder.svg'

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

  const handleShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2500)
    }
  }

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory)

  const currentProduct = selectedProduct
  const currentImages = currentProduct?.image_urls || ['/placeholder.svg']

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black">
      <div className="fixed top-4 left-6 z-[60] sm:left-8">
        {selectedProduct ? (
          <button
            type="button"
            onClick={closeProductDetail}
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/80 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-zinc-200 backdrop-blur-xl transition-all duration-300 hover:border-primary hover:bg-black hover:text-white"
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
                
                {/* SOL: GALERİ */}
                <div className="lg:col-span-7 space-y-4">
                  <div
                    onClick={() => setIsModalOpen(true)}
                    className="group relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 cursor-zoom-in"
                  >
                    <Image
                      src={currentImages[activeImageIdx] || currentImages[0]}
                      alt={selectedProduct.title}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
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

                    {/* Bedenler */}
                    <div className="mt-6 space-y-2">
                      <div className="text-xs font-mono text-zinc-400 uppercase">Beden Seçimi</div>
                      <div className="grid grid-cols-4 gap-2">
                        {['S', 'M', 'L', 'XL'].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSelectedSize(s)}
                            className={`rounded-xl py-3 text-xs font-bold transition-all ${
                              selectedSize === s
                                ? 'border border-primary bg-primary text-black'
                                : 'border border-white/10 bg-zinc-900 text-zinc-300'
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
                      className={`flex w-full items-center justify-center gap-3 rounded-full py-4 text-xs font-bold uppercase tracking-widest transition-all ${
                        isAdded ? 'bg-emerald-500 text-black' : 'bg-primary text-black hover:scale-[1.02]'
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
        </div>
      ) : (
        <>
          <section className="relative overflow-hidden border-b border-white/10 pt-32 pb-16 lg:pt-40 lg:pb-20">
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image src="/store-hero.jpeg" alt="ORISE Store Drop" fill priority className="object-cover opacity-20 grayscale" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                  <span>HAREKET KULÜBÜ & ATÖLYE</span>
                </div>
                <h1 className="font-sans text-4xl font-black tracking-tighter text-white sm:text-6xl lg:text-7xl">
                  Kulübe Özel <span className="text-primary">Drop</span> Koleksiyonu.
                </h1>
              </div>
            </div>
          </section>

          <section className="border-b border-white/10 bg-zinc-950/40 py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => {
                  const image = product.image_urls?.[0] || '/placeholder.svg'

                  return (
                    <div
                      key={product.id}
                      onClick={() => openProductDetail(product)}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 p-5 backdrop-blur-md transition-all hover:border-primary/60 cursor-pointer"
                    >
                      <div>
                        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-950">
                          <Image src={image} alt={product.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>

                        <div className="mt-5 space-y-1.5">
                          <div className="text-[10px] font-mono text-primary uppercase">{product.category_label || 'ÖZEL DROP'}</div>
                          <h3 className="font-sans text-lg font-bold text-white group-hover:text-primary">{product.title}</h3>
                          <p className="text-xs text-zinc-400 line-clamp-1">{product.subtitle}</p>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                        <div className="text-lg font-black text-white">₺{Number(product.price).toLocaleString('tr-TR')}</div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-zinc-800/80 px-4 py-2 text-xs font-bold uppercase text-zinc-200 group-hover:bg-primary group-hover:text-black">
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
