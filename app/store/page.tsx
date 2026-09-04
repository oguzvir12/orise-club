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
  HelpCircle,
  MessageSquare,
  Ruler,
  X
} from 'lucide-react'
import { useCart } from '@/components/cart/cart-provider'
import { supabase } from '@/lib/supabase'

const ALL_CATEGORIES_MAP: { [key: string]: string } = {
  all: 'TÜMÜ',
  sale: '🔥 FIRSAT & İNDİRİM',
  tank: 'KOŞU ATLETİ',
  sweatshirt: 'SWEATSHIRT',
  shorts: 'ŞORT',
  leggings: 'TAYT',
  socks: 'PERFORMANS ÇORAP',
  hat: 'ŞAPKA',
  equipment: 'TERMOS & MATARA',
}

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
  const [isAdded, setIsAdded] = useState<boolean>(false)

  const [isSizeTableOpen, setIsSizeTableOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [reviews, setReviews] = useState<any[]>([])
  const [newReviewComment, setNewReviewComment] = useState('')
  const [newReviewRating, setNewReviewRating] = useState('5')
  const [hasPurchased, setHasPurchased] = useState(false)

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
    checkAuthAndInteractions()
  }, [])

  const checkAuthAndInteractions = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) setCurrentUser(session.user)
  }

  useEffect(() => {
    if (productParam && products.length > 0) {
      const match = products.find((p) => p.id === productParam)
      if (match) {
        setSelectedProduct(match)
        const colors = match.colors || []
        setSelectedColor(colors[0] || '')
        setSelectedSize('M')
        setActiveImageIdx(0)
        fetchProductInteractions(match.id)
      }
    } else {
      setSelectedProduct(null)
    }
  }, [productParam, products])

  const fetchProductInteractions = async (productId: string) => {
    const { data: qData } = await supabase.from('product_questions').select('*').eq('product_id', productId).order('created_at', { ascending: false })
    if (qData) setQuestions(qData)

    const { data: rData } = await supabase.from('product_reviews').select('*').eq('product_id', productId).order('created_at', { ascending: false })
    if (rData) setReviews(rData)

    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      const { data: ordersData } = await supabase.from('orders').select('*').eq('user_id', session.user.id)
      if (ordersData) {
        const purchased = ordersData.some(ord => {
          const isDelivered = ord.status === 'Kargolandı' || ord.status === 'Ödeme Onaylandı'
          return isDelivered
        })
        setHasPurchased(purchased)
      }
    }
  }

  const handleSendQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) { alert('Soru sormak için giriş yapmalısınız.'); return }
    if (!newQuestion.trim()) return

    const { error } = await supabase.from('product_questions').insert([{
      product_id: selectedProduct.id,
      user_id: currentUser.id,
      user_name: currentUser.user_metadata?.full_name || currentUser.email,
      question: newQuestion
    }])

    if (!error) {
      alert('Sorunuz satıcıya iletildi!')
      setNewQuestion('')
      fetchProductInteractions(selectedProduct.id)
    }
  }

  const handleSendReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) { alert('Yorum yapmak için giriş yapmalısınız.'); return }
    if (!hasPurchased) { alert('Bu ürüne yorum yapabilmek için onaylanmış bir siparişinizin olması gerekmektedir.'); return }

    const { error } = await supabase.from('product_reviews').insert([{
      product_id: selectedProduct.id,
      user_id: currentUser.id,
      user_name: currentUser.user_metadata?.full_name || currentUser.email,
      rating: Number(newReviewRating),
      comment: newReviewComment
    }])

    if (!error) {
      alert('Yorumunuz yayınlandı!')
      setNewReviewComment('')
      fetchProductInteractions(selectedProduct.id)
    }
  }

  const openProductDetail = (product: any) => {
    setSelectedProduct(product)
    const colors = product.colors || []
    setSelectedColor(colors[0] || '')
    setSelectedSize('M')
    setActiveImageIdx(0)
    setIsAdded(false)
    router.push(`/store?product=${product.id}`, { scroll: false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
    fetchProductInteractions(product.id)
  }

  const closeProductDetail = () => {
    setSelectedProduct(null)
    router.push('/store', { scroll: false })
  }

  const handleAddToCart = () => {
    if (!selectedProduct) return
    const image = selectedProduct.image_urls?.[0] || selectedProduct.image_url || '/placeholder.svg'

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

  // Dinamik Kategori Filtreleme: Yalnızca sistemde ürünü olan kategorileri listele
  const availableCategories = ['all', 'sale']
  products.forEach(p => {
    if (p.category && !availableCategories.includes(p.category)) {
      availableCategories.push(p.category)
    }
  })

  let filteredProducts = products.filter((p) => {
    if (activeCategory === 'sale') {
      return p.compare_at_price && p.compare_at_price > p.price
    }
    if (activeCategory === 'all') return true
    return p.category === activeCategory
  })

  if (sortOrder === 'asc') filteredProducts.sort((a, b) => Number(a.price) - Number(b.price))
  else if (sortOrder === 'desc') filteredProducts.sort((a, b) => Number(b.price) - Number(a.price))

  const currentProduct = selectedProduct
  const currentImages = currentProduct?.image_urls && currentProduct.image_urls.length > 0
    ? currentProduct.image_urls
    : currentProduct?.image_url ? [currentProduct.image_url] : ['/placeholder.svg']

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black flex flex-col justify-between">
      
      <div>
        <div className="bg-primary text-black py-2 px-4 text-center text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2">
          <Truck size={15} />
          <span>2000 TL ve Üzeri Alışverişlerde Kargo Ücretsiz!</span>
        </div>

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
                    <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 flex items-center justify-center">
                      <Image src={currentImages[activeImageIdx]} alt={selectedProduct.title} fill priority className="object-contain p-2 transition-transform duration-500 group-hover:scale-105" />
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
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono tracking-widest text-primary uppercase">{selectedProduct.category_label || 'ÖZEL DROP'}</span>
                        <button type="button" onClick={() => setIsSizeTableOpen(true)} className="inline-flex items-center gap-1.5 text-xs text-primary underline font-mono hover:text-white cursor-pointer">
                          <Ruler size={14} /> Beden Ölçü Tablosu
                        </button>
                      </div>

                      <h1 className="mt-2 font-sans text-3xl font-black tracking-tight text-white sm:text-4xl">{selectedProduct.title}</h1>
                      <p className="text-sm font-mono text-zinc-400 mt-1">{selectedProduct.subtitle}</p>

                      <div className="mt-6 flex items-end gap-4">
                        <div>
                          <span className="text-xs font-mono text-zinc-500 uppercase block">Kulüp Fiyatı (KDV Dahil)</span>
                          <div className="text-3xl font-black text-white flex items-center gap-3">
                            <span>₺{Number(selectedProduct.price).toLocaleString('tr-TR')}</span>
                            {selectedProduct.compare_at_price && selectedProduct.compare_at_price > selectedProduct.price && (
                              <span className="text-lg text-zinc-500 line-through font-mono">₺{Number(selectedProduct.compare_at_price).toLocaleString('tr-TR')}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* HTML Açıklama */}
                      <div 
                        className="mt-6 text-sm leading-relaxed text-zinc-300 space-y-2 bg-zinc-950/60 p-5 rounded-2xl border border-white/10 font-sans"
                        dangerouslySetInnerHTML={{ __html: selectedProduct.description }}
                      />

                      {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                        <div className="mt-6 space-y-2">
                          <div className="text-xs font-mono text-zinc-400 uppercase">Renk Seçimi: <strong className="text-white">{selectedColor}</strong></div>
                          <div className="flex gap-2">
                            {selectedProduct.colors.map((col: string) => (
                              <button key={col} type="button" onClick={() => setSelectedColor(col)} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${selectedColor === col ? 'border-primary bg-primary/20 text-primary' : 'border-white/10 bg-zinc-900 text-zinc-400'}`}>
                                {col}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Beden Seçimi */}
                      <div className="mt-6 space-y-2">
                        <div className="text-xs font-mono text-zinc-400 uppercase">Beden Seçimi</div>
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                          {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'].map((s) => {
                            const sizeStock = selectedProduct.sizes?.[s] ?? 0
                            const isSizeOut = sizeStock <= 0

                            return (
                              <button 
                                key={s} 
                                type="button" 
                                disabled={isSizeOut}
                                onClick={() => setSelectedSize(s)} 
                                className={`relative rounded-xl py-2 text-xs font-bold transition-all ${
                                  isSizeOut ? 'bg-zinc-950 border border-white/5 text-zinc-600 line-through cursor-not-allowed' :
                                  selectedSize === s ? 'border border-primary bg-primary text-black font-black cursor-pointer' : 'border border-white/10 bg-zinc-900 text-zinc-300 hover:border-white/30 cursor-pointer'
                                }`}
                              >
                                {s}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button type="button" onClick={handleAddToCart} className={`flex w-full items-center justify-center gap-3 rounded-full py-4 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${isAdded ? 'bg-emerald-500 text-black font-black' : 'bg-primary text-black hover:scale-[1.02] font-black shadow-[0_0_25px_rgba(249,115,22,0.4)]'}`}>
                        {isAdded ? <><Check className="h-4 w-4" /><span>Sepete Eklendi</span></> : <><ShoppingBag className="h-4 w-4" /><span>Siparişe Ekle — ₺{selectedProduct.price}</span></>}
                      </button>
                    </div>
                  </div>

                </div>

                {/* Soru & Yorum Bölümü */}
                <div className="mt-20 border-t border-white/10 pt-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
                  <div className="space-y-6">
                    <h3 className="text-base font-bold uppercase tracking-wider flex items-center gap-2"><HelpCircle className="text-primary" size={18} /> Soru Sor ({questions.length})</h3>
                    <form onSubmit={handleSendQuestion} className="space-y-3">
                      <textarea rows={3} value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="Ürün hakkında soru sorun..." className="w-full rounded-2xl border border-white/10 bg-zinc-950 p-4 text-xs text-white focus:outline-none resize-none" />
                      <button type="submit" className="rounded-full bg-zinc-800 px-6 py-2.5 text-xs font-bold uppercase hover:bg-primary hover:text-black cursor-pointer">Soru Gönder</button>
                    </form>
                    <div className="space-y-4 pt-4 max-h-80 overflow-y-auto">
                      {questions.map((q) => (
                        <div key={q.id} className="p-4 rounded-2xl border border-white/10 bg-zinc-950 space-y-2 text-xs">
                          <p className="font-bold text-white">S: {q.question}</p>
                          {q.answer && <p className="text-primary bg-primary/10 p-3 rounded-xl"><strong>Satıcı Yanıtı:</strong> {q.answer}</p>}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-base font-bold uppercase tracking-wider flex items-center gap-2"><MessageSquare className="text-primary" size={18} /> Yorumlar ({reviews.length})</h3>
                    {hasPurchased && (
                      <form onSubmit={handleSendReview} className="space-y-3 p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
                        <textarea rows={2} value={newReviewComment} onChange={(e) => setNewReviewComment(e.target.value)} placeholder="Deneyimleriniz..." className="w-full rounded-xl border border-white/10 bg-black p-3 text-xs text-white resize-none" />
                        <button type="submit" className="rounded-full bg-emerald-500 text-black font-bold px-6 py-2 text-xs uppercase cursor-pointer">Yorum Yap</button>
                      </form>
                    )}
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      {reviews.map((r) => (
                        <div key={r.id} className="p-4 rounded-2xl border border-white/10 bg-zinc-950 space-y-1 text-xs font-mono">
                          <span className="font-bold text-white">{r.user_name}</span>
                          <p className="text-zinc-300 font-sans">{r.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </section>
          </div>
        ) : (
          <>
            <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden flex items-end pb-16 px-6 sm:px-12 lg:px-20 select-none border-b border-white/10">
              <div className="absolute inset-0 z-0 overflow-hidden">
                <Image src="/store-hero.jpeg" alt="Orise Store" fill priority className="object-cover object-center scale-105 brightness-90 contrast-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>
              <div className="relative z-10 max-w-3xl space-y-4">
                <h1 className="font-sans text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase leading-none">
                  RİTMİNİ <br /><span className="text-primary">HİSSET</span>
                </h1>
                <p className="text-sm sm:text-base text-zinc-200 font-sans max-w-lg">Yeni nesil teknik spor giyim koleksiyonu.</p>
              </div>
            </section>

            {/* DİNAMİK KATEGORİ FİLTRE ÇUBUĞU */}
            <div id="collection"></div>
            <section className="border-b border-white/10 bg-zinc-950/90 sticky top-16 z-30 backdrop-blur-xl">
              <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14 py-4 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2">
                  {availableCategories.map((catKey) => (
                    <button 
                      key={catKey} 
                      onClick={() => setActiveCategory(catKey)} 
                      className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${activeCategory === catKey ? 'bg-primary text-black font-black' : 'border border-white/10 bg-black/60 text-zinc-400 hover:text-white'}`}
                    >
                      {ALL_CATEGORIES_MAP[catKey] || catKey.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <ArrowUpDown className="h-4 w-4 text-zinc-400" />
                  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)} className="bg-black border border-white/10 rounded-full px-4 py-2 text-xs font-mono text-white focus:outline-none cursor-pointer">
                    <option value="default">Önerilen Sıralama</option>
                    <option value="asc">Fiyat: Ucuzdan Pahalıya</option>
                    <option value="desc">Fiyat: Pahalıdan Ucuza</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-b from-black via-zinc-950/40 to-black py-16 sm:py-20">
              <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => {
                    const productImages = product.image_urls && product.image_urls.length > 0 ? product.image_urls : [product.image_url || '/placeholder.svg']
                    const hasDiscount = product.compare_at_price && product.compare_at_price > product.price
                    const totalStock = product.sizes ? Object.values(product.sizes as Record<string, number>).reduce((a: any, b: any) => a + b, 0) : (product.stock ?? 0)
                    const isSoldOut = totalStock <= 0

                    return (
                      <div 
                        key={product.id} 
                        onClick={() => openProductDetail(product)} 
                        className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 p-5 backdrop-blur-md transition-all duration-300 ${isSoldOut ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:border-primary/60 cursor-pointer shadow-xl'}`}
                      >
                        <div>
                          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-zinc-950 flex items-center justify-center">
                            {isSoldOut && (
                              <div className="absolute inset-0 z-20 bg-black/75 flex items-center justify-center">
                                <span className="rounded-xl bg-zinc-900 border border-white/20 px-6 py-2.5 text-xs font-black uppercase text-zinc-300">TÜKENDİ</span>
                              </div>
                            )}
                            <Image src={productImages[0]} alt={product.title} fill className="object-contain p-2" />
                          </div>

                          <div className="mt-5 space-y-1.5">
                            <div className="text-[10px] font-mono text-primary uppercase">{product.category_label || 'ÖZEL DROP'}</div>
                            <h3 className="font-sans text-lg font-bold text-white group-hover:text-primary transition-colors">{product.title}</h3>
                          </div>
                        </div>

                        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                          <div className="text-lg font-black text-white">₺{Number(product.price).toLocaleString('tr-TR')}</div>
                          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase bg-zinc-800 text-zinc-200 group-hover:bg-primary group-hover:text-black">
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

      {/* Beden Ölçü Tablosu Modal */}
      {isSizeTableOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md" onClick={() => setIsSizeTableOpen(false)}>
          <div className="relative w-full max-w-3xl rounded-3xl border border-white/20 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6 text-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-black uppercase text-primary tracking-wider">
                {selectedProduct?.gender === 'kadin' ? 'KADIN BEDEN TABLOSU' : 'ERKEK BEDEN TABLOSU'} Ölçü Tablosu
              </h3>
              <button type="button" onClick={() => setIsSizeTableOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary"><X className="h-4 w-4" /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs font-mono border border-white/10">
                <thead className="bg-zinc-900 text-primary">
                  <tr>
                    <th className="p-3 border border-white/10 text-left">Ölçüm Yeri / Beden</th>
                    <th className="p-3 border border-white/10">XS</th><th className="p-3 border border-white/10">S</th><th className="p-3 border border-white/10">M</th><th className="p-3 border border-white/10">L</th><th className="p-3 border border-white/10">XL</th><th className="p-3 border border-white/10">2XL</th><th className="p-3 border border-white/10">3XL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-zinc-300">
                  <tr><td className="p-2.5 border border-white/10 text-left">Omuzdan Boy</td><td>52.5</td><td>54</td><td>55.5</td><td>57</td><td>58.5</td><td>60</td><td>61.5</td></tr>
                  <tr><td className="p-2.5 border border-white/10 text-left">Göğüs</td><td>48</td><td>50</td><td>52</td><td>54</td><td>56</td><td>58</td><td>60</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
