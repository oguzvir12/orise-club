'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  ShoppingBag,
  Check,
  Maximize2,
  ArrowUpDown,
  Sparkles,
  HelpCircle,
  MessageSquare,
  Ruler,
  X,
  Send,
  Mail,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ArrowDown,
  Filter,
  SlidersHorizontal,
  Compass,
  Zap
} from 'lucide-react'
import { useCart } from '@/components/cart/cart-provider'
import { supabase } from '@/lib/supabase'

const ALL_CATEGORIES_MAP: { [key: string]: string } = {
  all: 'TÜMÜ',
  sale: 'FIRSAT & İNDİRİM',
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
  const searchParam = searchParams.get('search')

  const { addItem } = useCart()

  const [products, setProducts] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default')
  
  const [selectedColorFilter, setSelectedColorFilter] = useState<string>('all')
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('all')
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false)

  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0)
  const [isAdded, setIsAdded] = useState<boolean>(false)
  const [isDescExpanded, setIsDescExpanded] = useState<boolean>(false)

  const [isSizeTableOpen, setIsSizeTableOpen] = useState(false)
  const [activeTabTable, setActiveTabTable] = useState<'erkek' | 'kadin'>('erkek')

  const [currentUser, setCurrentUser] = useState<any>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [newQuestion, setNewQuestion] = useState('')
  const [reviews, setReviews] = useState<any[]>([])
  const [newReviewComment, setNewReviewComment] = useState('')
  const [newReviewRating, setNewReviewRating] = useState('5')
  const [hasDeliveredThisProduct, setHasDeliveredThisProduct] = useState(false)

  const [cookieConsent, setCookieConsent] = useState(true)

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
    const hasConsent = localStorage.getItem('orise_cookie_consent')
    if (!hasConsent) setCookieConsent(false)
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('orise_cookie_consent', 'true')
    setCookieConsent(true)
  }

  const checkAuthAndInteractions = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) setCurrentUser(session.user)
  }

  const closeProductDetail = useCallback(() => {
    setSelectedProduct(null)
    router.push('/store', { scroll: false })
  }, [router])

  // ESC tuşu ile modalı kapatma
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeProductDetail()
        setIsSizeTableOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeProductDetail])

  useEffect(() => {
    if (productParam && products.length > 0) {
      const match = products.find((p) => p.id === productParam)
      if (match) {
        setSelectedProduct(match)
        const colors = match.colors || []
        setSelectedColor(colors[0] || '')
        setSelectedSize('')
        setActiveImageIdx(0)
        setIsDescExpanded(false)
        if (match.gender) setActiveTabTable(match.gender)
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
      const { data: ordersData } = await supabase.from('orders').select('*').eq('user_id', session.user.id).eq('status', 'Teslim Edildi')
      if (ordersData) {
        const boughtThisProduct = ordersData.some(ord => {
          const items = ord.items || []
          return items.some((item: any) => item.id?.includes(productId) || item.product_id === productId)
        })
        setHasDeliveredThisProduct(boughtThisProduct)
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
      alert('Sorunuz satıcıya iletildi ve onay bekliyor!')
      setNewQuestion('')
      fetchProductInteractions(selectedProduct.id)
    }
  }

  const handleSendReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) { alert('Yorum yapmak için giriş yapmalısınız.'); return }
    if (!hasDeliveredThisProduct) { alert('Ürünü teslim aldıktan sonra yorum yapabilirsiniz.'); return }

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
    setSelectedSize('')
    setActiveImageIdx(0)
    setIsAdded(false)
    setIsDescExpanded(false)
    if (product.gender) setActiveTabTable(product.gender)
    router.push(`/store?product=${product.id}`, { scroll: false })
    fetchProductInteractions(product.id)
  }

  const handleAddToCart = () => {
    if (!selectedProduct) return
    if (!selectedSize) {
      alert('Lütfen sepete eklemeden önce bir beden seçiniz!')
      return
    }

    const rawSizes = selectedProduct.sizes || {}
    const colorStockMap = rawSizes[selectedColor] || (typeof rawSizes.XS === 'number' ? rawSizes : {})
    const stockCount = colorStockMap[selectedSize] ?? 0

    if (stockCount <= 0) {
      alert(`Seçtiğiniz ${selectedSize} beden (${selectedColor}) stokta bulunmuyor!`)
      return
    }

    const image = selectedProduct.image_urls?.[0] || selectedProduct.image_url || '/placeholder.svg'

    addItem({
      id: `${selectedProduct.id}-${selectedColor}-${selectedSize}`,
      name: `${selectedProduct.title} (${selectedColor}) - [${selectedSize}]`,
      price: selectedProduct.price,
      image: image,
      type: 'product',
    })

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleBuyNow = () => {
    if (!selectedProduct) return
    if (!selectedSize) {
      alert('Lütfen hemen almadan önce bir beden seçiniz!')
      return
    }

    const rawSizes = selectedProduct.sizes || {}
    const colorStockMap = rawSizes[selectedColor] || (typeof rawSizes.XS === 'number' ? rawSizes : {})
    const stockCount = colorStockMap[selectedSize] ?? 0

    if (stockCount <= 0) {
      alert(`Seçtiğiniz ${selectedSize} beden (${selectedColor}) stokta bulunmuyor!`)
      return
    }

    const image = selectedProduct.image_urls?.[0] || selectedProduct.image_url || '/placeholder.svg'

    addItem({
      id: `${selectedProduct.id}-${selectedColor}-${selectedSize}`,
      name: `${selectedProduct.title} (${selectedColor}) - [${selectedSize}]`,
      price: selectedProduct.price,
      image: image,
      type: 'product',
    })

    closeProductDetail()
    router.push('/checkout')
  }

  const scrollToCollection = () => {
    const section = document.getElementById('collection')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    if (searchParam) {
      scrollToCollection()
    }
  }, [searchParam])

  const availableColors = Array.from(new Set(products.flatMap(p => p.colors || [])))
  const availableSizesList = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL']

  const availableCategories = ['all', 'sale']
  products.forEach(p => {
    if (p.category && !availableCategories.includes(p.category)) {
      availableCategories.push(p.category)
    }
  })

  let filteredProducts = products.filter((p) => {
    if (searchParam) {
      const query = searchParam.toLowerCase()
      const titleMatch = p.title?.toLowerCase().includes(query)
      const descMatch = p.description?.toLowerCase().includes(query)
      const catMatch = p.category?.toLowerCase().includes(query)
      if (!titleMatch && !descMatch && !catMatch) return false
    }

    if (activeCategory === 'sale') {
      if (!(p.compare_at_price && p.compare_at_price > p.price)) return false
    } else if (activeCategory !== 'all') {
      if (p.category !== activeCategory) return false
    }

    if (selectedColorFilter !== 'all') {
      const colors = p.colors || []
      if (!colors.includes(selectedColorFilter)) return false
    }

    if (selectedSizeFilter !== 'all') {
      const rawSizes = p.sizes || {}
      const hasSize = Object.values(rawSizes).some((colorMap: any) => {
        if (typeof colorMap === 'object' && colorMap !== null) {
          return Number(colorMap[selectedSizeFilter] || 0) > 0
        }
        return Number(rawSizes[selectedSizeFilter] || 0) > 0
      })
      if (!hasSize) return false
    }

    return true
  })

  if (sortOrder === 'asc') filteredProducts.sort((a, b) => Number(a.price) - Number(b.price))
  else if (sortOrder === 'desc') filteredProducts.sort((a, b) => Number(b.price) - Number(a.price))

  const currentProduct = selectedProduct
  const currentImages = currentProduct?.image_urls && currentProduct.image_urls.length > 0
    ? currentProduct.image_urls
    : currentProduct?.image_url ? [currentProduct.image_url] : ['/placeholder.svg']

  return (
    <div className="relative min-h-screen bg-[#111111] text-[#F5F2EC] font-sans selection:bg-[#F74A05] selection:text-white flex flex-col justify-between">
      
      <div>
        {/* ÜRÜN DETAY MODALI (Arka plana tıklayınca kapanır) */}
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 sm:p-6 backdrop-blur-xl animate-fadeIn overflow-y-auto" onClick={closeProductDetail}>
            <div className="relative w-full max-w-5xl rounded-3xl border border-white/20 bg-[#111111] p-5 sm:p-10 shadow-2xl space-y-8 text-white max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs font-mono tracking-widest text-[#F74A05] uppercase font-bold">ÜRÜN DETAYI</span>
                <button type="button" onClick={closeProductDetail} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#F74A05] hover:text-[#111111] transition-colors cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-6 space-y-4">
                  <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/15 bg-black flex items-center justify-center">
                    <Image src={currentImages[activeImageIdx]} alt={selectedProduct.title} fill priority className="object-contain p-4" />
                  </div>
                  {currentImages.length > 1 && (
                    <div className="flex items-center gap-3 overflow-x-auto pb-2">
                      {currentImages.map((img: string, idx: number) => (
                        <button key={idx} type="button" onClick={() => setActiveImageIdx(idx)} className={`relative aspect-square w-16 flex-none overflow-hidden rounded-xl border transition-all cursor-pointer ${activeImageIdx === idx ? 'border-[#F74A05] ring-2 ring-[#F74A05]/50' : 'border-white/15 opacity-60'}`}>
                          <Image src={img} alt="" fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-[#F74A05] uppercase font-bold">{selectedProduct.category_label || 'ÖZEL DROP'}</span>
                      <button type="button" onClick={() => setIsSizeTableOpen(true)} className="inline-flex items-center gap-1.5 text-xs text-[#F74A05] underline font-mono hover:text-white cursor-pointer font-bold">
                        <Ruler size={14} /> Beden Ölçü Tablosu
                      </button>
                    </div>

                    <h2 className="mt-2 font-['Vast_XXL',sans-serif] text-xl sm:text-3xl font-black tracking-tight text-white">{selectedProduct.title}</h2>
                    
                    <div className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                      <span>₺{Number(selectedProduct.price).toLocaleString('tr-TR')}</span>
                      {selectedProduct.compare_at_price && selectedProduct.compare_at_price > selectedProduct.price && (
                        <span className="text-base text-zinc-400 line-through font-mono">₺{Number(selectedProduct.compare_at_price).toLocaleString('tr-TR')}</span>
                      )}
                    </div>

                    <div className="mt-4 bg-black/40 p-4 rounded-2xl border border-white/10 space-y-2">
                      <div className={`text-xs leading-relaxed text-zinc-300 overflow-hidden transition-all duration-300 ${isDescExpanded ? 'max-h-96 overflow-y-auto pr-2' : 'max-h-20'}`} dangerouslySetInnerHTML={{ __html: selectedProduct.description }} />
                      <button 
                        type="button" 
                        onClick={() => setIsDescExpanded(!isDescExpanded)} 
                        className="text-[11px] font-mono font-bold text-[#F74A05] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                      >
                        {isDescExpanded ? <>Küçült <ChevronUp size={12} /></> : <>Devamını Oku / İncele <ChevronDown size={12} /></>}
                      </button>
                    </div>

                    {/* LÜKS GÜVEN VE KARGO ROZETLERİ */}
                    <div className="grid grid-cols-2 gap-3 py-3 my-4 border-y border-white/10 text-xs font-mono">
                      <div className="flex items-center gap-2 text-emerald-400">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
                        <span className="font-bold">Bu ürün bugün kargoda!</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-300">
                        <span>2000 TL Üzeri Ücretsiz Kargo</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-300 col-span-2">
                        <span>14 Gün İçinde Koşulsuz İade ve Değişim</span>
                      </div>
                    </div>

                    {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <div className="text-xs font-mono text-zinc-400 uppercase">Renk: <strong className="text-white">{selectedColor}</strong></div>
                        <div className="flex gap-2 flex-wrap">
                          {selectedProduct.colors.map((col: string) => (
                            <button key={col} type="button" onClick={() => { setSelectedColor(col); setSelectedSize(''); }} className={`px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${selectedColor === col ? 'border-[#F74A05] bg-[#F74A05]/20 text-[#F74A05]' : 'border-white/15 bg-black text-zinc-300'}`}>
                              {col}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 space-y-2">
                      <div className="text-xs font-mono text-zinc-400 uppercase">Beden Seçimi *Zorunlu</div>
                      <div className="grid grid-cols-4 gap-2">
                        {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'].map((s) => {
                          const rawSizes = selectedProduct.sizes || {}
                          const colorStockMap = rawSizes[selectedColor] || (typeof rawSizes.XS === 'number' ? rawSizes : {})
                          const sizeStock = colorStockMap[s] ?? 0
                          const isSizeOut = sizeStock <= 0

                          return (
                            <button 
                              key={s} 
                              type="button" 
                              disabled={isSizeOut}
                              onClick={() => setSelectedSize(s)} 
                              className={`rounded-xl py-2.5 text-xs font-bold transition-all flex flex-col items-center justify-center ${
                                isSizeOut ? 'bg-black/40 border border-white/5 text-zinc-600 line-through cursor-not-allowed' :
                                selectedSize === s ? 'border-2 border-[#F74A05] bg-[#F74A05] text-[#111111] font-black cursor-pointer shadow-lg' : 'border border-white/15 bg-black text-white hover:border-[#F74A05]/50 cursor-pointer'
                              }`}
                            >
                              <span>{s}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={handleAddToCart} className={`flex items-center justify-center gap-2 rounded-full py-3.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${isAdded ? 'bg-emerald-500 text-[#111111] font-black' : 'border border-[#F74A05] text-[#F74A05] hover:bg-[#F74A05] hover:text-[#111111]'}`}>
                        {isAdded ? <><Check className="h-4 w-4" /><span>Eklendi</span></> : <><ShoppingBag className="h-4 w-4" /><span>Sepete Ekle</span></>}
                      </button>

                      <button type="button" onClick={handleBuyNow} className="flex items-center justify-center gap-2 rounded-full bg-[#F74A05] py-3.5 text-xs font-black uppercase tracking-wider text-[#111111] hover:scale-[1.02] transition-all cursor-pointer shadow-[0_0_20px_rgba(247,74,5,0.4)]">
                        <Zap className="h-4 w-4 fill-current" /><span>Hemen Al</span>
                      </button>
                    </div>

                    {/* WHATSAPP İLE HIZLI İLETİŞİM */}
                    <a 
                      href={`https://wa.me/905070820800?text=Merhaba,%20${encodeURIComponent(selectedProduct.title)}%20ürününden%20sipariş%20vermek%20istiyorum.%20Seçtiğim%20Renk:%20${selectedColor}%20-%20Beden:%20${selectedSize || 'Belirtilmedi'}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 py-3 text-xs font-bold uppercase tracking-widest text-[#25D366] hover:bg-[#25D366]/20 transition-all cursor-pointer"
                    >
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                      <span>WhatsApp ile Bilgi Al / Sipariş Ver</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 text-white"><HelpCircle className="text-[#F74A05]" size={16} /> Soru Sor ({questions.length})</h3>
                  <form onSubmit={handleSendQuestion} className="space-y-3">
                    <textarea rows={2} value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="Ürün hakkında soru sorun..." className="w-full rounded-xl border border-white/15 bg-black/40 p-3 text-xs text-white focus:outline-none focus:border-[#F74A05] resize-none" />
                    <button type="submit" className="rounded-full bg-white/15 px-5 py-2 text-[11px] font-bold uppercase hover:bg-[#F74A05] hover:text-[#111111] transition-colors cursor-pointer text-white">Soru Gönder</button>
                  </form>
                  <div className="space-y-3 pt-2 max-h-56 overflow-y-auto">
                    {questions.map((q) => (
                      <div key={q.id} className="p-3 rounded-xl border border-white/15 bg-black/40 space-y-1.5 text-xs">
                        <p className="font-bold text-white">S: {q.question}</p>
                        {q.answer && <p className="text-[#F74A05] bg-[#F74A05]/10 p-2.5 rounded-lg"><strong>Satıcı Yanıtı:</strong> {q.answer}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 text-white"><MessageSquare className="text-[#F74A05]" size={16} /> Yorumlar ({reviews.length})</h3>
                  {hasDeliveredThisProduct ? (
                    <form onSubmit={handleSendReview} className="space-y-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                      <textarea rows={2} value={newReviewComment} onChange={(e) => setNewReviewComment(e.target.value)} placeholder="Ürünü teslim aldıktan sonra yorum yapabilirsiniz..." className="w-full rounded-xl border border-white/15 bg-black/40 p-3 text-xs text-white focus:outline-none resize-none" />
                      <button type="submit" className="rounded-full bg-emerald-500 text-[#111111] font-bold px-5 py-2 text-[11px] uppercase cursor-pointer">Yorum Yap</button>
                    </form>
                  ) : (
                    <p className="text-[11px] font-mono text-zinc-500 p-3 rounded-xl border border-white/10 bg-black/20">
                      Ürünü teslim aldıktan sonra yorum yapabilirsiniz.
                    </p>
                  )}
                  <div className="space-y-3 max-h-56 overflow-y-auto">
                    {reviews.map((r) => (
                      <div key={r.id} className="p-3 rounded-xl border border-white/15 bg-black/40 space-y-1 text-xs font-mono">
                        <span className="font-bold text-white">{r.user_name}</span>
                        <p className="text-zinc-300 font-sans">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* HERO ALANI */}
        <section className="relative pt-28 sm:pt-40 pb-16 sm:pb-28 px-4 sm:px-8 lg:px-16 select-none border-b border-white/10 overflow-hidden min-h-[70vh] sm:min-h-[85vh] flex items-end">
          <div className="absolute inset-0 z-0 overflow-hidden bg-[#111111]">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="absolute inset-0 h-full w-full object-cover object-center scale-105 brightness-95 contrast-110"
            >
              <source src="/store-hero-video.mp4" type="video/mp4" />
              Tarayıcınız video etiketini desteklemiyor.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/40 to-black/30" />
          </div>

          <div className="hidden sm:flex absolute bottom-12 right-12 z-25">
            <button 
              onClick={scrollToCollection}
              className="group relative flex items-center gap-4 rounded-full border border-white/20 bg-black/60 px-7 py-4 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-[#F74A05] hover:bg-black cursor-pointer overflow-hidden"
              title="Koleksiyonu Keşfet"
            >
              <span className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#F74A05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F74A05]/10 border border-[#F74A05]/30 text-[#F74A05] group-hover:bg-[#F74A05] group-hover:text-[#111111] transition-all duration-500 shadow-inner">
                <Compass className="h-4 w-4 animate-spin-slow" />
              </div>

              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono text-[#F74A05] font-extrabold tracking-[0.25em] uppercase">ORISE CLUB</span>
                <span className="font-['Vast_XXL',sans-serif] text-xs font-black text-white tracking-[0.15em] uppercase mt-0.5 group-hover:text-[#F74A05] transition-colors">Koleksiyonu Keşfet</span>
              </div>

              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white group-hover:translate-x-1 transition-transform duration-300">
                <ArrowDown className="h-3.5 w-3.5" />
              </div>
            </button>
          </div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <h1 className="font-['Vast_XXL',sans-serif] text-3xl sm:text-6xl lg:text-8xl font-black tracking-tight text-white uppercase leading-[1.05]" style={{ letterSpacing: '-0.02em' }}>
              BİRLİKTE <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F74A05] via-orange-400 to-amber-300">HAREKET ET.</span>
            </h1>
            <p className="text-xs sm:text-base text-zinc-300 font-sans max-w-md font-normal leading-relaxed">
              Yeni nesil teknik spor giyim, kulüp ruhu ve sokak stili bir arada. Sınırları birlikte zorlayın.
            </p>
          </div>
        </section>

        <div id="collection"></div>
        
        {/* DERİN FİLTRELEME VE SIRALAMA ÇUBUĞU */}
        <section className="border-b border-white/10 bg-[#111111]/95 sticky top-16 sm:top-24 z-30 backdrop-blur-2xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-3 sm:py-4 flex flex-col lg:flex-row items-center justify-between gap-3">
            
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto py-1">
              {searchParam && (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-[#F74A05] bg-[#F74A05]/25 px-3 py-1.5 text-xs font-mono text-white shrink-0">
                  <span>Arama: "{searchParam}"</span>
                  <Link href="/store" className="hover:text-[#F74A05] transition-colors font-bold ml-1 flex items-center bg-black/40 rounded-full px-2.5 py-0.5 text-[10px]">Temizle ✕</Link>
                </div>
              )}

              {availableCategories.map((catKey) => (
                <button 
                  key={catKey} 
                  onClick={() => setActiveCategory(catKey)} 
                  className={`rounded-full px-4 sm:px-5 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${activeCategory === catKey ? 'bg-[#F74A05] text-[#111111] font-black shadow-[0_0_20px_rgba(247,74,5,0.4)]' : 'border border-white/15 bg-black/40 text-zinc-300 hover:text-white hover:border-[#F74A05]/50'}`}
                >
                  {ALL_CATEGORIES_MAP[catKey] || catKey.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end">
              <button 
                type="button" 
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${isFilterPanelOpen || selectedColorFilter !== 'all' || selectedSizeFilter !== 'all' ? 'border-[#F74A05] bg-[#F74A05]/20 text-[#F74A05]' : 'border-white/15 bg-black/40 text-zinc-300 hover:text-white'}`}
              >
                <SlidersHorizontal size={13} />
                <span>Detaylı Filtre</span>
                {(selectedColorFilter !== 'all' || selectedSizeFilter !== 'all') && (
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#F74A05] text-[8px] font-black text-[#111111]">!</span>
                )}
              </button>

              <div className="flex items-center gap-2 shrink-0 bg-black/40 border border-white/15 rounded-full px-3.5 py-2">
                <ArrowUpDown className="h-3 w-3 text-[#F74A05]" />
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)} className="bg-transparent text-[10px] sm:text-xs font-mono text-white focus:outline-none cursor-pointer">
                  <option value="default" className="bg-[#111111]">Önerilen Sıralama</option>
                  <option value="asc" className="bg-[#111111]">Fiyat: Ucuzdan Pahalıya</option>
                  <option value="desc" className="bg-[#111111]">Fiyat: Pahalıdan Ucuza</option>
                </select>
              </div>
            </div>

          </div>

          {isFilterPanelOpen && (
            <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 pb-5 pt-2 border-t border-white/10 flex flex-wrap items-center gap-4 animate-fadeIn text-xs font-mono">
              
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 uppercase font-bold text-[11px]">Renk:</span>
                <div className="flex flex-wrap gap-1">
                  <button 
                    onClick={() => setSelectedColorFilter('all')}
                    className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer text-[11px] ${selectedColorFilter === 'all' ? 'bg-[#F74A05] text-[#111111] font-bold border-[#F74A05]' : 'bg-black/40 border-white/20 text-zinc-300'}`}
                  >
                    Tümü
                  </button>
                  {availableColors.map((col: any) => (
                    <button 
                      key={col}
                      onClick={() => setSelectedColorFilter(col)}
                      className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer text-[11px] ${selectedColorFilter === col ? 'bg-[#F74A05] text-[#111111] font-bold border-[#F74A05]' : 'bg-black/40 border-white/20 text-zinc-300'}`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-zinc-400 uppercase font-bold text-[11px]">Beden:</span>
                <div className="flex flex-wrap gap-1">
                  <button 
                    onClick={() => setSelectedSizeFilter('all')}
                    className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer text-[11px] ${selectedSizeFilter === 'all' ? 'bg-[#F74A05] text-[#111111] font-bold border-[#F74A05]' : 'bg-black/40 border-white/20 text-zinc-300'}`}
                  >
                    Tümü
                  </button>
                  {availableSizesList.map((size) => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSizeFilter(size)}
                      className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer text-[11px] ${selectedSizeFilter === size ? 'bg-[#F74A05] text-[#111111] font-bold border-[#F74A05]' : 'bg-black/40 border-white/20 text-zinc-300'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {(selectedColorFilter !== 'all' || selectedSizeFilter !== 'all') && (
                <button 
                  onClick={() => { setSelectedColorFilter('all'); setSelectedSizeFilter('all'); }} 
                  className="text-[#F74A05] underline font-bold cursor-pointer ml-auto text-[11px]"
                >
                  Filtreleri Sıfırla
                </button>
              )}

            </div>
          )}
        </section>

        {/* ÜRÜN VİTRİNİ */}
        <section className="bg-gradient-to-b from-[#111111] via-[#111111]/80 to-[#111111] py-10 sm:py-20">
          <div className="mx-auto max-w-[1600px] px-3 sm:px-8 lg:px-12">
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4 xl:gap-8">
              {filteredProducts.map((product) => {
                const productImages = product.image_urls && product.image_urls.length > 0 ? product.image_urls : [product.image_url || '/placeholder.svg']
                const totalStock = product.sizes ? Object.values(product.sizes as Record<string, any>).reduce((acc: number, curr: any) => {
                  if (typeof curr === 'object' && curr !== null) {
                    return acc + Object.values(curr).reduce((a: any, b: any) => a + Number(b || 0), 0)
                  }
                  return acc + Number(curr || 0)
                }, 0) : 0
                const isSoldOut = totalStock <= 0

                return (
                  <div 
                    key={product.id} 
                    onClick={() => openProductDetail(product)} 
                    className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 bg-black/60 p-3 sm:p-5 backdrop-blur-xl transition-all duration-500 ${isSoldOut ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:border-[#F74A05]/60 hover:bg-black cursor-pointer shadow-xl'}`}
                  >
                    <div>
                      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-black flex items-center justify-center border border-white/10">
                        {isSoldOut && (
                          <div className="absolute inset-0 z-20 bg-black/75 flex items-center justify-center">
                            <span className="rounded-xl bg-[#111111] border border-white/20 px-4 py-2 text-[10px] sm:text-xs font-black uppercase text-zinc-300">TÜKENDİ</span>
                          </div>
                        )}
                        <Image src={productImages[0]} alt={product.title} fill className="object-contain p-2 sm:p-4 transition-transform duration-700 group-hover:scale-105" />
                      </div>

                      <div className="mt-3 sm:mt-4 space-y-1">
                        <div className="text-[8px] sm:text-[9px] font-mono text-[#F74A05] uppercase font-bold tracking-widest">{product.category_label || 'ÖZEL DROP'}</div>
                        <h3 className="font-['Vast_XXL',sans-serif] text-xs sm:text-lg font-bold text-white group-hover:text-[#F74A05] transition-colors tracking-tight line-clamp-1">{product.title}</h3>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-6 flex items-center justify-between border-t border-white/10 pt-2.5 sm:pt-3">
                      <div className="text-xs sm:text-lg font-black text-white">₺{Number(product.price).toLocaleString('tr-TR')}</div>
                      <div className="inline-flex items-center gap-1 rounded-full border border-white/20 px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-bold uppercase bg-white/10 text-white group-hover:bg-[#F74A05] group-hover:text-[#111111] group-hover:border-[#F74A05] transition-all">
                        <span>İncele</span>
                        <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>

      {!cookieConsent && (
        <div className="fixed bottom-0 inset-x-0 z-50 bg-[#111111]/98 border-t border-white/20 p-4 sm:p-5 backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
          <p className="text-xs text-zinc-300 max-w-4xl font-sans">
            Deneyiminizi geliştirmek ve yasal yükümlülüklerimizi yerine getirmek amacıyla çerezler kullanmaktayız. Sitemizi kullanarak çerez politikamızı kabul etmiş olursunuz.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={acceptCookies} 
              className="rounded-full bg-[#F74A05] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-[#111111] hover:bg-orange-600 transition-all cursor-pointer font-black"
            >
              Kabul Et & Kapat
            </button>
          </div>
        </div>
      )}

      {isSizeTableOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md" onClick={() => setIsSizeTableOpen(false)}>
          <div className="relative w-full max-w-4xl rounded-3xl border border-white/20 bg-[#111111] p-6 sm:p-8 shadow-2xl space-y-6 text-white max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-black uppercase tracking-wider text-white">ÖLÇÜ TABLOSU</h3>
                <div className="flex bg-black rounded-full p-1 border border-white/15">
                  <button type="button" onClick={() => setActiveTabTable('erkek')} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase cursor-pointer ${activeTabTable === 'erkek' ? 'bg-[#F74A05] text-[#111111]' : 'text-zinc-300'}`}>Erkek Tablosu</button>
                  <button type="button" onClick={() => setActiveTabTable('kadin')} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase cursor-pointer ${activeTabTable === 'kadin' ? 'bg-[#F74A05] text-[#111111]' : 'text-zinc-300'}`}>Kadın Tablosu</button>
                </div>
              </div>
              <button type="button" onClick={() => setIsSizeTableOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#F74A05] hover:text-[#111111]"><X className="h-4 w-4" /></button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs font-mono border border-white/15">
                <thead className="bg-black text-[#F74A05]">
                  <tr>
                    <th className="p-3 border border-white/15 text-left">ÖLÇÜM YERİ / BEDEN</th>
                    <th className="p-3 border border-white/15">XS</th>
                    <th className="p-3 border border-white/15">S</th>
                    <th className="p-3 border border-white/15">M</th>
                    <th className="p-3 border border-white/15">L</th>
                    <th className="p-3 border border-white/15">XL</th>
                    <th className="p-3 border border-white/15">2XL</th>
                    <th className="p-3 border border-white/15">3XL</th>
                    {activeTabTable === 'erkek' && <th className="p-3 border border-white/15">4XL</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/15 text-zinc-300">
                  {activeTabTable === 'kadin' ? (
                    <>
                      <tr><td className="p-2.5 border border-white/15 text-left">OMUZDAN BOY</td><td>52.5</td><td>54</td><td>55.5</td><td>57</td><td>58.5</td><td>60</td><td>61.5</td></tr>
                      <tr><td className="p-2.5 border border-white/15 text-left">GÖĞÜS</td><td>48</td><td>50</td><td>52</td><td>54</td><td>56</td><td>58</td><td>60</td></tr>
                      <tr><td className="p-2.5 border border-white/15 text-left">ETEK</td><td>48</td><td>50</td><td>52</td><td>54</td><td>56</td><td>58</td><td>60</td></tr>
                      <tr><td className="p-2.5 border border-white/15 text-left">OMUZDAN OMUZA</td><td>45</td><td>47</td><td>49</td><td>51</td><td>53</td><td>55</td><td>57</td></tr>
                    </>
                  ) : (
                    <>
                      <tr><td className="p-2.5 border border-white/15 text-left">OMUZDAN ÖN BOY</td><td>68</td><td>70</td><td>72</td><td>74</td><td>76</td><td>78</td><td>80</td><td>82</td></tr>
                      <tr><td className="p-2.5 border border-white/15 text-left">OMUZDAN ARKA BOY</td><td>69</td><td>71</td><td>73</td><td>75</td><td>77</td><td>79</td><td>81</td><td>83</td></tr>
                      <tr><td className="p-2.5 border border-white/15 text-left">GÖĞÜS</td><td>54</td><td>56</td><td>58</td><td>60</td><td>62</td><td>64</td><td>66</td><td>68</td></tr>
                      <tr><td className="p-2.5 border border-white/15 text-left">OMUZDAN OMUZA</td><td>52.5</td><td>54</td><td>55.5</td><td>57</td><td>58.5</td><td>60</td><td>61.5</td><td>68</td></tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono text-center">Tüm ölçüler santimetre (cm) cinsinden verilmiştir. Model: ORISE CLUB Ölçü Standardı.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function StorePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#111111]" />}>
      <StoreContent />
    </Suspense>
  )
}
