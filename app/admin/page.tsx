'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Users,
  Trash2,
  RefreshCw,
  Lock,
  LogOut,
  PlusCircle,
  Layers,
  Edit3,
  X,
  Upload,
  Calendar,
  Download,
  ShoppingBag,
  Tag,
  ShieldAlert,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [adminProfile, setAdminProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [registrations, setRegistrations] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [profiles, setProfiles] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [coupons, setCoupons] = useState<any[]>([])

  const [couponCode, setCouponCode] = useState('')
  const [discountPct, setDiscountPct] = useState('')
  const [usageLimit, setUsageLimit] = useState('100')

  // Yeni Ürün Formu
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [price, setPrice] = useState('')
  const [comparePrice, setComparePrice] = useState('')
  const [stock, setStock] = useState('25')
  const [description, setDescription] = useState('')
  const [imageList, setImageList] = useState<string[]>([])

  // Ürün Düzenleme Modal
  const [editingProduct, setEditingProduct] = useState<any | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editSubtitle, setEditSubtitle] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editComparePrice, setEditComparePrice] = useState('')
  const [editStock, setEditStock] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editImages, setEditImages] = useState<string[]>([])

  // Etkinlik Formları
  const [evtTitle, setEvtTitle] = useState('')
  const [evtDesc, setEvtDesc] = useState('')
  const [evtDate, setEvtDate] = useState('')
  const [evtLocation, setEvtLocation] = useState('')
  const [evtBranch, setEvtBranch] = useState('KOŞU')
  const [instructorName, setInstructorName] = useState('')
  const [evtImage, setEvtImage] = useState('')
  const [editingEvent, setEditingEvent] = useState<any | null>(null)
  const [editEvtTitle, setEditEvtTitle] = useState('')
  const [editEvtBranch, setEditEvtBranch] = useState('KOŞU')
  const [editEvtLocation, setEditEvtLocation] = useState('')
  const [editEvtDate, setEditEvtDate] = useState('')
  const [editEvtInstructor, setEditEvtInstructor] = useState('')

  useEffect(() => {
    checkAdminSession()
  }, [])

  const checkAdminSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
      if (profile && ['admin', 'super_admin', 'store_admin', 'community_admin', 'captain'].includes(profile.role)) {
        setIsLoggedIn(true)
        setAdminProfile(profile)
        fetchData()
      }
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: regData } = await supabase.from('event_registrations').select('*, events(title, branch)').order('created_at', { ascending: false })
      if (regData) setRegistrations(regData)

      const { data: prodData } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      if (prodData) setProducts(prodData)

      const { data: evtData } = await supabase.from('events').select('*').order('date', { ascending: true })
      if (evtData) setEvents(evtData)

      const { data: profData } = await supabase.from('profiles').select('*').order('full_name', { ascending: true })
      if (profData) setProfiles(profData)

      const { data: ordData } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
      if (ordData) setOrders(ordData)

      const { data: cpData } = await supabase.from('coupons').select('*').order('created_at', { ascending: false })
      if (cpData) setCoupons(cpData)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    window.location.href = '/'
  }

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponCode || !discountPct) return
    await supabase.from('coupons').insert([{
      code: couponCode.trim().toUpperCase(),
      discount_percentage: Number(discountPct),
      usage_limit: Number(usageLimit) || 100
    }])
    setCouponCode(''); setDiscountPct(''); setUsageLimit('100')
    fetchData()
  }

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Silinsin mi?')) return
    await supabase.from('coupons').delete().eq('id', id)
    setCoupons((prev) => prev.filter((c) => c.id !== id))
  }

  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'new' | 'edit') => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    const uploadedUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${i}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file)
      if (!uploadError) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
        if (data?.publicUrl) uploadedUrls.push(data.publicUrl)
      }
    }

    if (target === 'new') setImageList((prev) => [...prev, ...uploadedUrls])
    else setEditImages((prev) => [...prev, ...uploadedUrls])
    setUploading(false)
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !price) return
    await supabase.from('products').insert([{
      title, subtitle: subtitle || 'Özel Parça', price: Number(price),
      compare_at_price: comparePrice ? Number(comparePrice) : null,
      stock: Number(stock) || 0, description: description || 'Kaliteli tekstil.',
      category: 'tank', category_label: 'ÖZEL DROP',
      image_urls: imageList.length > 0 ? imageList : ['https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop']
    }])
    setTitle(''); setSubtitle(''); setPrice(''); setComparePrice(''); setStock('25'); setDescription(''); setImageList([])
    fetchData()
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Silinsin mi?')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const openEditModal = (prod: any) => {
    setEditingProduct(prod)
    setEditTitle(prod.title || '')
    setEditSubtitle(prod.subtitle || '')
    setEditPrice(prod.price || '')
    setEditComparePrice(prod.compare_at_price || '')
    setEditStock(prod.stock ?? 25)
    setEditDescription(prod.description || '')
    setEditImages(prod.image_urls || (prod.image_url ? [prod.image_url] : []))
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    await supabase.from('products').update({
      title: editTitle, subtitle: editSubtitle, price: Number(editPrice),
      compare_at_price: editComparePrice ? Number(editComparePrice) : null,
      stock: Number(editStock), description: editDescription, image_urls: editImages
    }).eq('id', editingProduct.id)
    setEditingProduct(null)
    fetchData()
  }

  const role = adminProfile?.role
  const isSuperAdmin = role === 'super_admin' || role === 'admin'
  const isStoreAdmin = isSuperAdmin || role === 'store_admin'
  const isCommunityAdmin = isSuperAdmin || role === 'community_admin'
  const adminBranch = adminProfile?.branch?.toUpperCase()

  const filteredEvents = (isSuperAdmin || isCommunityAdmin) && adminBranch === 'ALL' ? events : events.filter(e => isSuperAdmin || isCommunityAdmin || e.branch?.toUpperCase() === adminBranch)

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md rounded-3xl border border-white/15 bg-zinc-950 p-8 shadow-2xl space-y-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/40"><Lock className="h-5 w-5" /></div>
          <h1 className="text-xl font-black text-white">Yönetici Girişi Gerekli</h1>
          <Link href="/" className="inline-block w-full rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black cursor-pointer">Ana Sayfaya Dön</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black text-white p-6 sm:p-10 font-sans">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-300 hover:text-white"><ArrowLeft className="h-4 w-4" /></Link>
          <div>
            <h1 className="text-xl font-black text-white">ORISE Kontrol Paneli</h1>
            <p className="text-xs font-mono text-primary uppercase">Rol: {role}</p>
          </div>
        </div>
        <button type="button" onClick={handleLogout} className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 cursor-pointer"><LogOut className="h-3.5 w-3.5" /> Çıkış</button>
      </div>

      <div className="mx-auto max-w-7xl space-y-12 mb-16">
        
        {/* ÜRÜN EKLEME (Stok ve İndirimli Fiyat Kontrollü) */}
        {isStoreAdmin && (
          <div className="rounded-3xl border border-primary/30 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6">
            <h2 className="text-base font-bold flex items-center gap-2 text-primary"><PlusCircle className="h-5 w-5" /><span>Mağazaya Ürün Ekle (Stok & Fiyat Kontrolü)</span></h2>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <input type="text" placeholder="Ürün Başlığı" required value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              <input type="number" placeholder="Güncel Fiyat (₺)" required value={price} onChange={(e) => setPrice(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              <input type="number" placeholder="Eski Fiyat (Üstü Çizili)" value={comparePrice} onChange={(e) => setComparePrice(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              <input type="number" placeholder="Stok Adedi (0 = Tükendi)" required value={stock} onChange={(e) => setStock(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              
              <div className="relative flex items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-3 cursor-pointer">
                <span className="text-xs text-zinc-400 truncate">{imageList.length > 0 ? `✓ ${imageList.length} Fotoğraf` : 'Fotoğraf Seç'}</span>
                <Upload className="h-4 w-4 text-primary" />
                <input type="file" accept="image/*" multiple onChange={(e) => handleMultipleImageUpload(e, 'new')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              </div>
              <textarea rows={1} placeholder="Açıklama" value={description} onChange={(e) => setDescription(e.target.value)} className="sm:col-span-2 lg:col-span-2 rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              <button type="submit" className="rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-lg cursor-pointer">Ürünü Yayınla</button>
            </form>
          </div>
        )}

        {/* YÜKLÜ ÜRÜNLER LİSTESİ */}
        {isStoreAdmin && (
          <div className="space-y-4">
            <h2 className="text-base font-bold flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /><span>Yüklü Ürünler ve Stok Yönetimi ({products.length})</span></h2>
            <div className="space-y-3">
              {products.map((prod) => (
                <div key={prod.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950 p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 flex-none"><Image src={prod.image_urls?.[0] || '/placeholder.svg'} alt="" fill className="object-cover" /></div>
                    <div>
                      <h4 className="font-bold text-xs text-white flex items-center gap-2">
                        {prod.title} 
                        {prod.stock <= 0 && <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[9px] uppercase font-bold">TÜKENDİ</span>}
                      </h4>
                      <div className="text-[10px] text-zinc-400">
                        ₺{prod.price} {prod.compare_at_price ? <span className="line-through text-zinc-600">₺{prod.compare_at_price}</span> : ''} · Stok: <strong className={prod.stock <= 0 ? 'text-red-400' : 'text-emerald-400'}>{prod.stock} Adet</strong>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => openEditModal(prod)} className="p-2 bg-zinc-800 rounded-xl text-zinc-200 cursor-pointer"><Edit3 size={14} /></button>
                    <button type="button" onClick={() => handleDeleteProduct(prod.id)} className="p-2 bg-red-500/10 text-red-400 rounded-xl cursor-pointer"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ÜRÜN DÜZENLEME MODALİ */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md" onClick={() => setEditingProduct(null)}>
          <div className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-bold text-base text-white">Ürünü ve Stoğu Düzenle</h3>
              <button type="button" onClick={() => setEditingProduct(null)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary"><X className="h-4 w-4" /></button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <input type="text" required value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" required value={editPrice} onChange={(e) => setEditPrice(e.target.value)} placeholder="Güncel Fiyat" className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                <input type="number" value={editComparePrice} onChange={(e) => setEditComparePrice(e.target.value)} placeholder="Eski Fiyat (Üstü Çizili)" className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-400">Stok Adedi (0 yaparsanız ürün anında sönükleşir ve tükenir)</label>
                <input type="number" required value={editStock} onChange={(e) => setEditStock(e.target.value)} placeholder="Stok Adedi" className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              </div>
              <textarea rows={3} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white resize-none" />
              <button type="submit" className="w-full rounded-full bg-primary py-3.5 text-xs font-bold uppercase text-black cursor-pointer">Değişiklikleri Kaydet</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
