'use client'

import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  ShoppingBag,
  Check,
  Maximize2,
  Flame,
  ArrowUpDown,
  Sparkles,
  Truck,
} from 'lucide-react'
import { useCart } from '@/components/cart/cart-provider'
import { supabase } from '@/lib/supabase'

const CATEGORIES = [
  { id: 'all', label: 'TÜMÜ' },
  { id: 'sale', label: '🔥 FIRSAT & İNDİRİM' },
  { id: 'tank', label: 'KOŞU ATLETİ' },
  { id: 'sweatshirt', label: 'SWEATSHIRT' },
  { id: 'socks', label: 'PERFORMANS ÇORAP' },
  { id: 'hat', label: 'ŞAPKA' },
  { id: 'equipment', label: 'TERMOS & MATARA' },
]

function StoreContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productParam = searchParams.get('product')

  const { addItem } = useCart()

  const [products, setProducts] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default')
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)

  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('M')
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0)
  const [hoveredImageIdx, setHoveredImageIdx] = useState<{ [key: string]: number }>({})
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false)
  const [isAdded, setIsAdded] = useState<boolean>(false)

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .or('is_active.eq.true,is_active.is.null')
      .order('created_at', { ascending: false })

    if (data) setProducts(data)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (productParam && products.length > 0) {
      const match = products.find((p) => p.id === productParam)
      if (match) {
        setSelectedProduct(match)
        const colors = match.colors || []
        setSelectedColor(colors[0] || '')
        setSelectedSize('M')
        setActiveImageIdx(0)
      }
    } else {
      setSelectedProduct(null)
    }
  }, [productParam, products])

  const openProductDetail = (product: any) => {
    const totalStock = product.sizes ? Object.values(product.sizes as Record<string, number>).reduce((a: any, b: any) => a + b, 0) : (product.stock ?? 0)
    if (totalStock <= 0) return 

    setSelectedProduct(product)
    const colors = product.colors || []
    setSelectedColor(colors[0] || '')
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

    const sizes = selectedProduct.sizes || { S: 10, M: 10, L: 10, XL: 10 }
    if (sizes[selectedSize] <= 0) {
      alert(`Üzgünüz, seçtiğiniz ${selectedSize} beden tükenmiştir!`)
      return
    }

    addItem({
      id: `${selectedProduct.id}-${selectedColor}-${selectedSize}`,
      name: `${selectedProduct.title} ${selectedColor ? `(${selectedColor})` : ''} - [${selectedSize}]`,
      price: selectedProduct.price,
      image: image,
      type: 'product',
    })

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  let filteredProducts = products.filter((p) => {
    if (activeCategory === 'sale') {
      return p.compare_at_price && p.compare_at_price > p.price
    }
    if (activeCategory === 'all') return true
    return p.category === activeCategory
  })

  if (sortOrder === 'asc') {
    filteredProducts.sort((a, b) => Number(a.price) - Number(b.price))
  } else if (sortOrder === 'desc') {
    filteredProducts.sort((a, b) => Number(b.price) - Number(a.price))
  }

  const currentProduct = selectedProduct
  const currentImages = currentProduct?.image_urls && currentProduct.image_urls.length > 0
    ? currentProduct.image_urls
    : currentProduct?.image_url ? [currentProduct.image_url] : ['/placeholder.svg']

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black flex flex-col justify-between">
      
      <div>
        {/* Ücretsiz Kargo Duyuru Bandı */}
        <div className="bg-primary text-black py-2 px-4 text-center text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2">
          <Truck size={15} />
          <span>2000 TL ve Üzeri Alışverişlerde Kargo Ücretsiz!</span>
        </div>

        {/* Üst Geri Dönüş Butonu (Sadece Ürün Detayındayken Görünür) */}
        {selectedProduct && (
          <div className="absolute top-14 left-6 z-30 sm:left-8">
            <button type="button" onClick={closeProductDetail} className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/80 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-zinc-200 backdrop-blur-xl transition-all hover:border-primary cursor-pointer">
              <ArrowLeft className="h-3.5 w-3.5 text-primary" />
              <span>Tüm Koleksiyon</span>
            </button>
          </div>
        )}

        {selectedProduct ? (
          <div>
            <section className="pt-12 pb-20 sm:pt-16 sm:pb-24 border-b border-white/10">
              <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
                  
                  <div className="lg:col-span-7 space-y-4">
                    <div onClick={() => setIsLightboxOpen(true)} className="group relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 flex items-center justify-center cursor-zoom-in">
                      <Image src={currentImages[activeImageIdx]} alt={selectedProduct.title} fill priority className="object-contain p-2 transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="inline-flex items-center gap-2 rounded-full bg-black/80 border border-white/20 px-4 py-2 text-xs font-bold uppercase text-white backdrop-blur-md">
                          <Maximize2 className="h-4 w-4 text-primary" />
                          <span>Fotoğrafı Büyüt</span>
                        </span>
                      </div>
                    </div>

                    {currentImages.length > 1 && (
                      <div className="flex items-center gap-3 overflow-x-auto pb-2">
                        {currentImages.map((img: string, idx: number) => (
                          <button key={idx} type="button" onClick={() => setActiveImageIdx(idx)} className={`relative aspect-square w-20 flex-none overflow-hidden rounded-xl border transition-all cursor-pointer ${activeImageIdx === idx ? 'border-primary ring-2 ring-primary/50' : 'border-white/10 opacity-60'}`}>
                            <Image src={img} alt="" fill className="object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono tracking-widest text-primary uppercase">{selectedProduct.category_label || 'ÖZEL DROP'}</span>
                      </div>

                      <h1 className="mt-2 font-sans text-3xl font-black tracking-tight text-white sm:text-4xl">{selectedProduct.title}</h1>
                      <p className="text-sm font-mono text-zinc-400 mt-1">{selectedProduct.subtitle}</p>

                      <div className="mt-6 flex items-end gap-4">
                        <div>
                          <span className="text-xs font-mono text-zinc-500 uppercase block">Kulüp Fiyatı</span>
                          <div className="text-3xl font-black text-white flex items-center gap-3">
                            <span>₺{Number(selectedProduct.price).toLocaleString('tr-TR')}</span>
                            {selectedProduct.compare_at_price && selectedProduct.compare_at_price > selectedProduct.price && (
                              <span className="text-lg text-zinc-500 line-through font-mono">₺{Number(selectedProduct.compare_at_price).toLocaleString('tr-TR')}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-relaxed text-zinc-300">{selectedProduct.description}</p>

                      {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                        <div className="mt-6 space-y-2">
                          <div className="text-xs font-mono text-zinc-400 uppercase">Renk: <strong className="text-white">{selectedColor}</strong></div>
                          <div className="flex gap-2">
                            {selectedProduct.colors.map((col: string) => (
                              <button key={col} type="button" onClick={() => setSelectedColor(col)} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${selectedColor === col ? 'border-primary bg-primary/20 text-primary' : 'border-white/10 bg-zinc-900 text-zinc-400'}`}>
                                {col}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-6 space-y-2">
                        <div className="text-xs font-mono text-zinc-400 uppercase">Beden Seçimi & Stok Durumu</div>
                        <div className="grid grid-cols-4 gap-2">
                          {['S', 'M', 'L', 'XL'].map((s) => {
                            const sizeStock = selectedProduct.sizes?.[s] ?? 0
                            const isSizeOut = sizeStock <= 0

                            return (
                              <button 
                                key={s} 
                                type="button" 
                                disabled={isSizeOut}
                                onClick={() => setSelectedSize(s)} 
                                className={`relative rounded-xl py-3 text-xs font-bold transition-all ${
                                  isSizeOut ? 'bg-zinc-950 border border-white/5 text-zinc-600 line-through cursor-not-allowed' :
                                  selectedSize === s ? 'border border-primary bg-primary text-black font-black cursor-pointer' : 'border border-white/10 bg-zinc-900 text-zinc-300 hover:border-white/30 cursor-pointer'
                                }`}
                              >
                                {s}
                                <span className="block text-[9px] font-mono opacity-75">{isSizeOut ? 'Tükendi' : `${sizeStock} adet`}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      {(() => {
                        const totalStock = selectedProduct.sizes ? Object.values(selectedProduct.sizes as Record<string, number>).reduce((a: any, b: any) => a + b, 0) : (selectedProduct.stock ?? 0)
                        const isCompletelySoldOut = totalStock <= 0

                        return isCompletelySoldOut ? (
                          <div className="w-full rounded-full bg-zinc-900 border border-white/10 py-4 text-center text-xs font-bold uppercase tracking-widest text-zinc-500">
                            Bu Ürün Tamamen Tükendi (Sold Out)
                          </div>
                        ) : (
                          <button type="button" onClick={handleAddToCart} className={`flex w-full items-center justify-center gap-3 rounded-full py-4 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${isAdded ? 'bg-emerald-500 text-black font-black' : 'bg-primary text-black hover:scale-[1.02] font-black shadow-[0_0_25px_rgba(249,115,22,0.4)]'}`}>
                            {isAdded ? <><Check className="h-4 w-4" /><span>Sepete Eklendi</span></> : <><ShoppingBag className="h-4 w-4" /><span>Siparişe Ekle — ₺{selectedProduct.price}</span></>}
                          </button>
                        )
                      })()}
                    </div>
                  </div>

                </div>
              </div>
            </section>
          </div>
        ) : (
          <>
            {/* Nike Tarzı Büyük, Derin ve Türkçe Çarpıcı Hero (Banner) Alanı */}
            <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden flex items-end pb-16 px-6 sm:px-12 lg:px-20 select-none border-b border-white/10">
              <div className="absolute inset-0 z-0 overflow-hidden">
                <Image src="/store-hero.jpeg" alt="Orise Store" fill priority className="object-cover object-center scale-105 brightness-90 contrast-110 transition-transform duration-1000 hover:scale-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>

              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-[11px] font-mono tracking-[0.25em] text-white uppercase backdrop-blur-md">
                  <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                  <span>Bir Markadan Fazlası, Bir Kulüp</span>
                </div>

                <h1 className="font-sans text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase leading-none drop-shadow-2xl">
                  RİTMİNİ <br /><span className="text-primary">HİSSET</span>
                </h1>

                <p className="text-sm sm:text-base text-zinc-200 font-sans max-w-lg leading-relaxed drop-shadow">
                  Şehrin enerjisini ve kulüp kültürünü sokak modasına taşıyan yeni nesil teknik spor giyim koleksiyonu.
                </p>

                <div className="pt-2 flex items-center gap-4">
                  <a href="#collection" className="rounded-full bg-white text-black px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors shadow-xl">
                    Koleksiyona Git
                  </a>
                </div>
              </div>
            </section>

            {/* Kategori ve Sıralama Çubuğu */}
            <div id="collection"></div>
            <section className="border-b border-white/10 bg-zinc-950/90 sticky top-16 z-30 backdrop-blur-xl">
              <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 w-full sm:w-auto">
                  {CATEGORIES.map((cat) => (
                    <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${activeCategory === cat.id ? 'bg-primary text-black font-black shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'border border-white/10 bg-black/60 text-zinc-400 hover:text-white'}`}>
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <ArrowUpDown className="h-4 w-4 text-zinc-400" />
                  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)} className="bg-black border border-white/10 rounded-full px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary cursor-pointer">
                    <option value="default">Önerilen Sıralama</option>
                    <option value="asc">Fiyat: Ucuzdan Pahalıya</option>
                    <option value="desc">Fiyat: Pahalıdan Ucuza</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Ürün Listesi Grid */}
            <section className="bg-gradient-to-b from-black via-zinc-950/40 to-black py-16 sm:py-20">
              <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => {
                    const productImages = product.image_urls && product.image_urls.length > 0 ? product.image_urls : [product.image_url || '/placeholder.svg']
                    const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
                    
                    const totalStock = product.sizes ? Object.values(product.sizes as Record<string, number>).reduce((a: any, b: any) => a + b, 0) : (product.stock ?? 0)
                    const isSoldOut = totalStock <= 0

                    const currentHoverIdx = hoveredImageIdx[product.id] || 0

                    return (
                      <div 
                        key={product.id} 
                        onClick={() => openProductDetail(product)} 
                        onMouseEnter={() => productImages.length > 1 && setHoveredImageIdx({ ...hoveredImageIdx, [product.id]: 1 })}
                        onMouseLeave={() => setHoveredImageIdx({ ...hoveredImageIdx, [product.id]: 0 })}
                        className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 p-5 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] ${isSoldOut ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:border-primary/60 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.5)]'}`}
                      >
                        <div>
                          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-950 flex items-center justify-center">
                            {isSoldOut ? (
                              <div className="absolute inset-0 z-20 bg-black/75 flex items-center justify-center">
                                <span className="rounded-xl bg-zinc-900 border border-white/20 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-zinc-300 shadow-2xl">
                                  TÜKENDİ (SOLD OUT)
                                </span>
                              </div>
                            ) : (
                              <>
                                {hasDiscount && (
                                  <span className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-[10px] font-black uppercase text-white shadow-lg">
                                    <Flame className="h-3 w-3" /> FIRSAT
                                  </span>
                                )}
                              </>
                            )}
                            
                            <Image 
                              src={productImages[currentHoverIdx] || productImages[0]} 
                              alt={product.title} 
                              fill 
                              className="object-contain p-2 transition-transform duration-700 group-hover:scale-105" 
                            />
                          </div>

                          <div className="mt-5 space-y-1.5">
                            <div className="text-[10px] font-mono text-primary uppercase">{product.category_label || 'ÖZEL DROP'}</div>
                            <h3 className="font-sans text-lg font-bold text-white group-hover:text-primary transition-colors">{product.title}</h3>
                            <p className="text-xs text-zinc-400 line-clamp-1">{product.subtitle}</p>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                          <div className="flex items-center gap-2">
                            <div className="text-lg font-black text-white">₺{Number(product.price).toLocaleString('tr-TR')}</div>
                            {hasDiscount && (
                              <div className="text-xs text-zinc-500 line-through font-mono">₺{Number(product.compare_at_price).toLocaleString('tr-TR')}</div>
                            )}
                          </div>
                          <div className={`inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase transition-all ${isSoldOut ? 'bg-zinc-900 text-zinc-600' : 'bg-zinc-800/80 text-zinc-200 group-hover:bg-primary group-hover:text-black'}`}>
                            <span>{isSoldOut ? 'Tükendi' : 'İncele'}</span>
                            {!isSoldOut && <ArrowUpRight className="h-3.5 w-3.5" />}
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
