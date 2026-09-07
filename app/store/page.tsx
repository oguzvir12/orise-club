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
  SlidersHorizontal
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
  const [hasPurchased, setHasPurchased] = useState(false)

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
      const { data: ordersData } = await supabase.from('orders').select('*').eq('user_id', session.user.id)
      if (ordersData) {
        const purchased = ordersData.some(ord => ord.status === 'Kargolandı' || ord.status === 'Teslim Edildi' || ord.status === 'Ödeme Onaylandı')
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
    setSelectedSize('')
    setActiveImageIdx(0)
    setIsAdded(false)
    setIsDescExpanded(false)
    if (product.gender) setActiveTabTable(product.gender)
    router.push(`/store?product=${product.id}`, { scroll: false })
    fetchProductInteractions(product.id)
  }

  const closeProductDetail = () => {
    setSelectedProduct(null)
    router.push('/store', { scroll: false })
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
        {/* ÜRÜN DETAY MODALI */}
        {selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 sm:p-6 backdrop-blur-xl animate-fadeIn overflow-y-auto">
            <div className="relative w-full max-w-5xl rounded-3xl border border-[#D8D6D2]/20 bg-[#111111] p-5 sm:p-10 shadow-2xl space-y-6 sm:space-y-8 text-[#FFFFFF] max-h-[92vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-[#D8D6D2]/10 pb-4">
                <span className="text-xs font-mono tracking-widest text-[#F74A05] uppercase font-bold">ÜRÜN DETAYI</span>
                <button type="button" onClick={closeProductDetail} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[#FFFFFF] hover:bg-[#F74A05] hover:text-[#111111] transition-colors cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-6 space-y-4">
                  <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-[#D8D6D2]/15 bg-[#111111] flex items-center justify-center">
                    <Image src={currentImages[activeImageIdx]} alt={selectedProduct.title} fill priority className="object-contain p-4" />
                  </div>
                  {currentImages.length > 1 && (
                    <div className="flex items-center gap-3 overflow-x-auto pb-2">
                      {currentImages.map((img: string, idx: number) => (
                        <button key={idx} type="button" onClick={() => setActiveImageIdx(idx)} className={`relative aspect-square w-16 flex-none overflow-hidden rounded-xl border transition-all cursor-pointer ${activeImageIdx === idx ? 'border-[#F74A05] ring-2 ring-[#F74A05]/50' : 'border-[#D8D6D2]/15 opacity-60'}`}>
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
                      <button type="button" onClick={() => setIsSizeTableOpen(true)} className="inline-flex items-center gap-1.5 text-xs text-[#F74A05] underline font-mono hover:text-[#FFFFFF] cursor-pointer font-bold">
                        <Ruler size={14} /> Beden Ölçü Tablosu
                      </button>
                    </div>

                    <h2 className="mt-2 font-['Vast_XXL',sans-serif] text-xl sm:text-3xl font-black tracking-tight text-[#FFFFFF]">{selectedProduct.title}</h2>
                    
                    <div className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-black text-[#FFFFFF] flex items-center gap-3">
                      <span>₺{Number(selectedProduct.price).toLocaleString('tr-TR')}</span>
                      {selectedProduct.compare_at_price && selectedProduct.compare_at_price > selectedProduct.price && (
                        <span className="text-base text-[#D8D6D2] line-through font-mono">₺{Number(selectedProduct.compare_at_price).toLocaleString('tr-TR')}</span>
                      )}
                    </div>

                    {/* Akıllı Genişletilebilir Açıklama Alanı */}
                    <div className="mt-4 bg-black/40 p-4 rounded-2xl border border-[#D8D6D2]/10 space-y-2">
                      <div className={`text-xs leading-relaxed text-[#D8D6D2] overflow-hidden transition-all duration-300 ${isDescExpanded ? 'max-h-96 overflow-y-auto pr-2' : 'max-h-20'}`} dangerouslySetInnerHTML={{ __html: selectedProduct.description }} />
                      <button 
                        type="button" 
                        onClick={() => setIsDescExpanded(!isDescExpanded)} 
                        className="text-[11px] font-mono font-bold text-[#F74A05] hover:underline flex items-center gap-1 pt-1 cursor-pointer"
                      >
                        {isDescExpanded ? <>Küçült <ChevronUp size={12} /></> : <>Devamını Oku / İncele <ChevronDown size={12} /></>}
                      </button>
                    </div>

                    {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <div className="text-xs font-mono text-[#D8D6D2] uppercase">Renk: <strong className="text-[#FFFFFF]">{selectedColor}</strong></div>
                        <div className="flex gap-2 flex-wrap">
                          {selectedProduct.colors.map((col: string) => (
                            <button key={col} type="button" onClick={() => { setSelectedColor(col); setSelectedSize(''); }} className={`px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer ${selectedColor === col ? 'border-[#F74A05] bg-[#F74A05]/20 text-[#F74A05]' : 'border-[#D8D6D2]/15 bg-[#111111] text-[#D8D6D2]'}`}>
                              {col}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 space-y-2">
                      <div className="text-xs font-mono text-[#D8D6D2] uppercase">Beden Seçimi *Zorunlu</div>
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
                              className={`rounded-xl py-2 text-xs font-bold transition-all flex flex-col items-center justify-center ${
                                isSizeOut ? 'bg-[#111111] border border-[#D8D6D2]/10 text-[#D8D6D2]/40 line-through cursor-not-allowed' :
                                selectedSize === s ? 'border-2 border-[#F74A05] bg-[#F74A05] text-[#111111] font-black cursor-pointer shadow-lg' : 'border border-[#D8D6D2]/15 bg-[#111111] text-[#F5F2EC] hover:border-[#F74A05]/50 cursor-pointer'
                              }`}
                            >
                              <span>{s}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button type="button" onClick={handleAddToCart} className={`flex w-full items-center justify-center gap-3 rounded-full py-3.5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${isAdded ? 'bg-emerald-500 text-[#111111] font-black' : 'bg-[#F74A05] text-[#111111] hover:scale-[1.02] font-black shadow-[0_0_20px_rgba(247,74,5,0.4)]'}`}>
                      {isAdded ? <><Check className="h-4 w-4" /><span>Sepete Eklendi</span></> : <><ShoppingBag className="h-4 w-4" /><span>Siparişe Ekle — ₺{selectedProduct.price}</span></>}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Hero Alanı: Web'de ve Telefonda Kargo Yazısı Kaldırıldı, Keşfet Butonu Sadece Masaüstünde Kalacak Şekilde Düzenlendi */}
        <section className="relative pt-24 sm:pt-36 pb-12 sm:pb-24 px-4 sm:px-12 lg:px-20 select-none border-b border-[#D8D6D2]/10 overflow-hidden min-h-[75vh] sm:min-h-[85vh] flex items-end">
          <div className="absolute inset-0 z-0 overflow-hidden bg-[#111111]">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="absolute inset-0 h-full w-full object-cover sm:object-cover object-center scale-100 sm:scale-105 brightness-90 contrast-110"
            >
              <source src="/store-hero-video.mp4" type="video/mp4" />
              Tarayıcınız video etiketini desteklemiyor.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/50 to-transparent" />
          </div>

          {/* KEŞFET BUTONU: Sadece Masaüstünde Görünür (Telefonda tamamen kaldırıldı) */}
          <div className="hidden sm:flex absolute bottom-10 right-16 z-25">
            <button 
              onClick={scrollToCollection}
              className="group relative flex items-center gap-3 rounded-full border-2 border-[#F74A05] bg-black/90 px-6 py-4 backdrop-blur-2xl shadow-[0_0_40px_rgba(247,74,5,0.5)] transition-all hover:scale-110 hover:bg-[#F74A05] cursor-pointer"
              title="Koleksiyonu Keşfet"
            >
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F74A05] group-hover:bg-[#111111] text-[#111111] group-hover:text-[#F74A05] transition-colors shadow-lg">
                <svg className="h-5 w-5 fill-current animate-bounce" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M2 12h20" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono text-[#F74A05] group-hover:text-[#111111] font-extrabold tracking-widest uppercase">ORISE CLUB</span>
                <span className="font-['Vast_XXL',sans-serif] text-xs font-black text-white group-hover:text-[#111111] tracking-wider uppercase">KOLEKSİYONU KEŞFET</span>
              </div>
            </button>
          </div>

          <div className="relative z-10 max-w-4xl space-y-4 sm:space-y-6 pb-4 sm:pb-0">
            <h1 className="font-['Vast_XXL',sans-serif] text-4xl sm:text-7xl lg:text-9xl font-black tracking-tighter text-[#FFFFFF] uppercase leading-[1.02] sm:leading-[0.95]" style={{ letterSpacing: '-0.03em' }}>
              BİRLİKTE <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F74A05] via-orange-400 to-amber-300">HAREKET ET.</span>
            </h1>
            <p className="text-xs sm:text-lg text-[#D8D6D2] font-sans max-w-lg font-normal leading-relaxed">
              Yeni nesil teknik spor giyim, kulüp ruhu ve sokak stili bir arada. Sınırları birlikte zorlayın.
            </p>
          </div>
        </section>

        <div id="collection"></div>
        
        {/* DERİN FİLTRELEME VE SIRALAMA ÇUBUĞU */}
        <section className="border-b border-[#D8D6D2]/10 bg-[#111111]/95 sticky top-16 sm:top-20 z-30 backdrop-blur-2xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-14 py-3 sm:py-5 flex flex-col lg:flex-row items-center justify-between gap-3">
            
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
                  className={`rounded-full px-4 sm:px-6 py-1.5 sm:py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${activeCategory === catKey ? 'bg-[#F74A05] text-[#111111] font-black shadow-[0_0_20px_rgba(247,74,5,0.4)]' : 'border border-[#D8D6D2]/15 bg-[#111111]/60 text-[#D8D6D2] hover:text-[#FFFFFF] hover:border-[#F74A05]/50'}`}
                >
                  {ALL_CATEGORIES_MAP[catKey] || catKey.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end">
              <button 
                type="button" 
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${isFilterPanelOpen || selectedColorFilter !== 'all' || selectedSizeFilter !== 'all' ? 'border-[#F74A05] bg-[#F74A05]/20 text-[#F74A05]' : 'border-[#D8D6D2]/15 bg-black/40 text-[#D8D6D2] hover:text-white'}`}
              >
                <SlidersHorizontal size={13} />
                <span>Detaylı Filtre</span>
                {(selectedColorFilter !== 'all' || selectedSizeFilter !== 'all') && (
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#F74A05] text-[8px] font-black text-[#111111]">!</span>
                )}
              </button>

              <div className="flex items-center gap-2 shrink-0 bg-black/40 border border-[#D8D6D2]/15 rounded-full px-3.5 py-2">
                <ArrowUpDown className="h-3 w-3 text-[#F74A05]" />
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as any)} className="bg-transparent text-[10px] sm:text-xs font-mono text-[#FFFFFF] focus:outline-none cursor-pointer">
                  <option value="default" className="bg-[#111111]">Önerilen Sıralama</option>
                  <option value="asc" className="bg-[#111111]">Fiyat: Ucuzdan Pahalıya</option>
                  <option value="desc" className="bg-[#111111]">Fiyat: Pahalıdan Ucuza</option>
                </select>
              </div>
            </div>

          </div>

          {/* Derin Filtreleme Açılır Panel */}
          {isFilterPanelOpen && (
            <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-14 pb-5 pt-2 border-t border-[#D8D6D2]/10 flex flex-wrap items-center gap-4 animate-fadeIn text-xs font-mono">
              
              <div className="flex items-center gap-2">
                <span className="text-[#D8D6D2] uppercase font-bold text-[11px]">Renk:</span>
                <div className="flex flex-wrap gap-1">
                  <button 
                    onClick={() => setSelectedColorFilter('all')}
                    className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer text-[11px] ${selectedColorFilter === 'all' ? 'bg-[#F74A05] text-[#111111] font-bold border-[#F74A05]' : 'bg-black/40 border-[#D8D6D2]/20 text-[#D8D6D2]'}`}
                  >
                    Tümü
                  </button>
                  {availableColors.map((col: any) => (
                    <button 
                      key={col}
                      onClick={() => setSelectedColorFilter(col)}
                      className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer text-[11px] ${selectedColorFilter === col ? 'bg-[#F74A05] text-[#111111] font-bold border-[#F74A05]' : 'bg-black/40 border-[#D8D6D2]/20 text-[#D8D6D2]'}`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#D8D6D2] uppercase font-bold text-[11px]">Beden:</span>
                <div className="flex flex-wrap gap-1">
                  <button 
                    onClick={() => setSelectedSizeFilter('all')}
                    className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer text-[11px] ${selectedSizeFilter === 'all' ? 'bg-[#F74A05] text-[#111111] font-bold border-[#F74A05]' : 'bg-black/40 border-[#D8D6D2]/20 text-[#D8D6D2]'}`}
                  >
                    Tümü
                  </button>
                  {availableSizesList.map((size) => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSizeFilter(size)}
                      className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer text-[11px] ${selectedSizeFilter === size ? 'bg-[#F74A05] text-[#111111] font-bold border-[#F74A05]' : 'bg-black/40 border-[#D8D6D2]/20 text-[#D8D6D2]'}`}
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

        {/* Ürün Vitrini (Grid) */}
        <section className="bg-gradient-to-b from-[#111111] via-[#111111]/80 to-[#111111] py-12 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-14">
            <div className="grid grid-cols-1 gap-6 sm:gap-10 sm:grid-cols-2 lg:grid-cols-3">
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
                    className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#D8D6D2]/15 bg-[#111111]/60 p-5 sm:p-6 backdrop-blur-xl transition-all duration-500 ${isSoldOut ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:border-[#F74A05]/60 hover:bg-[#111111] cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.5)]'}`}
                  >
                    <div>
                      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#111111] flex items-center justify-center border border-[#D8D6D2]/10">
                        {isSoldOut && (
                          <div className="absolute inset-0 z-20 bg-black/75 flex items-center justify-center">
                            <span className="rounded-xl bg-[#111111] border border-[#D8D6D2]/20 px-6 py-2.5 text-xs font-black uppercase text-[#D8D6D2]">TÜKENDİ</span>
                          </div>
                        )}
                        <Image src={productImages[0]} alt={product.title} fill className="object-contain p-4 transition-transform duration-700 group-hover:scale-105" />
                      </div>

                      <div className="mt-5 space-y-1.5">
                        <div className="text-[10px] font-mono text-[#F74A05] uppercase font-bold tracking-widest">{product.category_label || 'ÖZEL DROP'}</div>
                        <h3 className="font-['Vast_XXL',sans-serif] text-lg sm:text-xl font-bold text-[#FFFFFF] group-hover:text-[#F74A05] transition-colors tracking-tight">{product.title}</h3>
                      </div>
                    </div>

                    <div className="mt-6 sm:mt-8 flex items-center justify-between border-t border-[#D8D6D2]/10 pt-4">
                      <div className="text-lg sm:text-xl font-black text-[#FFFFFF]">₺{Number(product.price).toLocaleString('tr-TR')}</div>
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-[#D8D6D2]/20 px-4 py-2 text-xs font-bold uppercase bg-[#D8D6D2]/10 text-[#F5F2EC] group-hover:bg-[#F74A05] group-hover:text-[#111111] group-hover:border-[#F74A05] transition-all">
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
      </div>

      {/* Yasal Çerez (KVKK) Onay Banner'ı */}
      {!cookieConsent && (
        <div className="fixed bottom-0 inset-x-0 z-50 bg-[#111111]/98 border-t border-[#D8D6D2]/20 p-4 sm:p-5 backdrop-blur-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
          <p className="text-xs text-[#D8D6D2] max-w-4xl font-sans">
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

      {/* Beden Ölçü Tablosu Modal */}
      {isSizeTableOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md" onClick={() => setIsSizeTableOpen(false)}>
          <div className="relative w-full max-w-4xl rounded-3xl border border-[#D8D6D2]/20 bg-[#111111] p-6 sm:p-8 shadow-2xl space-y-6 text-[#FFFFFF] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#D8D6D2]/10 pb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-black uppercase tracking-wider text-[#FFFFFF]">ÖLÇÜ TABLOSU</h3>
                <div className="flex bg-[#111111] rounded-full p-1 border border-[#D8D6D2]/15">
                  <button type="button" onClick={() => setActiveTabTable('erkek')} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase cursor-pointer ${activeTabTable === 'erkek' ? 'bg-[#F74A05] text-[#111111]' : 'text-[#D8D6D2]'}`}>Erkek Tablosu</button>
                  <button type="button" onClick={() => setActiveTabTable('kadin')} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase cursor-pointer ${activeTabTable === 'kadin' ? 'bg-[#F74A05] text-[#111111]' : 'text-[#D8D6D2]'}`}>Kadın Tablosu</button>
                </div>
              </div>
              <button type="button" onClick={() => setIsSizeTableOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[#FFFFFF] hover:bg-[#F74A05] hover:text-[#111111]"><X className="h-4 w-4" /></button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs font-mono border border-[#D8D6D2]/15">
                <thead className="bg-[#111111] text-[#F74A05]">
                  <tr>
                    <th className="p-3 border border-[#D8D6D2]/15 text-left">ÖLÇÜM YERİ / BEDEN</th>
                    <th className="p-3 border border-[#D8D6D2]/15">XS</th>
                    <th className="p-3 border border-[#D8D6D2]/15">S</th>
                    <th className="p-3 border border-[#D8D6D2]/15">M</th>
                    <th className="p-3 border border-[#D8D6D2]/15">L</th>
                    <th className="p-3 border border-[#D8D6D2]/15">XL</th>
                    <th className="p-3 border border-[#D8D6D2]/15">2XL</th>
                    <th className="p-3 border border-[#D8D6D2]/15">3XL</th>
                    {activeTabTable === 'erkek' && <th className="p-3 border border-[#D8D6D2]/15">4XL</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D6D2]/15 text-[#D8D6D2]">
                  {activeTabTable === 'kadin' ? (
                    <>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">OMUZDAN BOY</td><td>52.5</td><td>54</td><td>55.5</td><td>57</td><td>58.5</td><td>60</td><td>61.5</td></tr>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">GÖĞÜS</td><td>48</td><td>50</td><td>52</td><td>54</td><td>56</td><td>58</td><td>60</td></tr>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">ETEK</td><td>48</td><td>50</td><td>52</td><td>54</td><td>56</td><td>58</td><td>60</td></tr>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">OMUZDAN OMUZA</td><td>45</td><td>47</td><td>49</td><td>51</td><td>53</td><td>55</td><td>57</td></tr>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">YAKA AÇIKLIĞI</td><td>17.5</td><td>18</td><td>18.5</td><td>19</td><td>19.5</td><td>20</td><td>20.5</td></tr>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">ÖN YAKA DÜŞÜKLÜĞÜ</td><td>8.75</td><td>9</td><td>9.25</td><td>9.5</td><td>9.75</td><td>10</td><td>10.25</td></tr>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">ARKA YAKA DÜŞÜKLÜĞÜ</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">KOLEVİ OMUZDAN DİK</td><td>24.5</td><td>25.5</td><td>26.5</td><td>27.5</td><td>28.5</td><td>29.5</td><td>30.5</td></tr>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">KOL BOYU</td><td>15.25</td><td>16</td><td>16.75</td><td>17.5</td><td>18.25</td><td>19</td><td>19.75</td></tr>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">PAZU</td><td>18.5</td><td>19.5</td><td>20.5</td><td>21.5</td><td>22.5</td><td>23.5</td><td>24.5</td></tr>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">KOL AĞZI</td><td>16.25</td><td>17</td><td>17.75</td><td>18.5</td><td>19.25</td><td>20</td><td>20.75</td></tr>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">YAKA YÜKSEKLİĞİ</td><td>1.5</td><td>1.5</td><td>1.5</td><td>1.5</td><td>1.5</td><td>1.5</td><td>1.5</td></tr>
                    </>
                  ) : (
                    <>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">OMUZDAN ÖN BOY</td><td>68</td><td>70</td><td>72</td><td>74</td><td>76</td><td>78</td><td>80</td><td>82</td></tr>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">OMUZDAN ARKA BOY</td><td>69</td><td>71</td><td>73</td><td>75</td><td>77</td><td>79</td><td>81</td><td>83</td></tr>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">GÖĞÜS</td><td>54</td><td>56</td><td>58</td><td>60</td><td>62</td><td>64</td><td>66</td><td>68</td></tr>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">ETEK</td><td>54</td><td>56</td><td>58</td><td>60</td><td>62</td><td>64</td><td>66</td><td>—</td></tr>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">OMUZDAN OMUZA</td><td>52.5</td><td>54</td><td>55.5</td><td>57</td><td>58.5</td><td>60</td><td>61.5</td><td>68</td></tr>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">YAKA AÇIKLIĞI</td><td>19</td><td>19.5</td><td>20</td><td>20.5</td><td>21</td><td>21.5</td><td>22</td><td>22.5</td></tr>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">ÖN YAKA DÜŞÜKLÜĞÜ</td><td>10.5</td><td>10.75</td><td>11</td><td>11.25</td><td>11.5</td><td>11.75</td><td>12</td><td>12.25</td></tr>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">ARKA YAKA DÜŞÜKLÜĞÜ</td><td>2.5</td><td>2.5</td><td>2.5</td><td>2.5</td><td>2.5</td><td>2.5</td><td>2.5</td><td>2.5</td></tr>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">KOLEVİ OMUZDAN DİK</td><td>29</td><td>30</td><td>31</td><td>32</td><td>33</td><td>34</td><td>35</td><td>36</td></tr>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">KOL BOYU</td><td>19.5</td><td>20.5</td><td>21.5</td><td>22.5</td><td>23.5</td><td>24.5</td><td>25.5</td><td>26.5</td></tr>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">PAZU</td><td>21.5</td><td>22</td><td>23.5</td><td>24.5</td><td>25.5</td><td>26.5</td><td>27.5</td><td>28.5</td></tr>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">KOL AĞZI</td><td>19.5</td><td>20.25</td><td>21</td><td>21.75</td><td>22.5</td><td>23.25</td><td>24</td><td>24.75</td></tr>
                      <tr><td className="p-2.5 border border-[#D8D6D2]/15 text-left">YAKA YÜKSEKLİĞİ</td><td>2.5</td><td>2.5</td><td>2.5</td><td>2.5</td><td>2.5</td><td>2.5</td><td>2.5</td><td>2.5</td></tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-[#D8D6D2]/60 font-mono text-center">Tüm ölçüler santimetre (cm) cinsinden verilmiştir. Model: ORISE CLUB Ölçü Standardı (27.08.2026).</p>
          </div>
        </div>
      )}
    </div>
  )
}
