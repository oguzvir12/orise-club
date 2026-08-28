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

  // Yeni Ürün Formu (Beden ve Renk Destekli)
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [price, setPrice] = useState('')
  const [comparePrice, setComparePrice] = useState('')
  const [colorsInput, setColorsInput] = useState('Siyah, Beyaz')
  const [sizeS, setSizeS] = useState('10')
  const [sizeM, setSizeM] = useState('15')
  const [sizeL, setSizeL] = useState('15')
  const [sizeXL, setSizeXL] = useState('10')
  const [description, setDescription] = useState('')
  const [imageList, setImageList] = useState<string[]>([])

  // Ürün Düzenleme Modal
  const [editingProduct, setEditingProduct] = useState<any | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editSubtitle, setEditSubtitle] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editComparePrice, setEditComparePrice] = useState('')
  const [editColors, setEditColors] = useState('')
  const [editSizeS, setEditSizeS] = useState('')
  const [editSizeM, setEditSizeM] = useState('')
  const [editSizeL, setEditSizeL] = useState('')
  const [editSizeXL, setEditSizeXL] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editImages, setEditImages] = useState<string[]>([])

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
      const { data: prodData } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      if (prodData) setProducts(prodData)

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

    const colorArray = colorsInput.split(',').map(c => c.trim()).filter(Boolean)
    const sizesObj = {
      S: Number(sizeS) || 0,
      M: Number(sizeM) || 0,
      L: Number(sizeL) || 0,
      XL: Number(sizeXL) || 0,
    }
    const totalStock = Object.values(sizesObj).reduce((a, b) => a + b, 0)

    await supabase.from('products').insert([{
      title,
      subtitle: subtitle || 'Özel Parça',
      price: Number(price),
      compare_at_price: comparePrice ? Number(comparePrice) : null,
      stock: totalStock,
      sizes: sizesObj,
      colors: colorArray,
      description: description || 'Kaliteli tekstil.',
      category: 'tank',
      category_label: 'ÖZEL DROP',
      image_urls: imageList.length > 0 ? imageList : ['https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop']
    }])

    setTitle(''); setSubtitle(''); setPrice(''); setComparePrice(''); setDescription(''); setImageList([])
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
    setEditColors(prod.colors ? prod.colors.join(', ') : '')
    setEditSizeS(prod.sizes?.S ?? 10)
    setEditSizeM(prod.sizes?.M ?? 15)
    setEditSizeL(prod.sizes?.L ?? 15)
    setEditSizeXL(prod.sizes?.XL ?? 10)
    setEditDescription(prod.description || '')
    setEditImages(prod.image_urls || (prod.image_url ? [prod.image_url] : []))
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    const colorArray = editColors.split(',').map(c => c.trim()).filter(Boolean)
    const sizesObj = {
      S: Number(editSizeS) || 0,
      M: Number(editSizeM) || 0,
      L: Number(editSizeL) || 0,
      XL: Number(editSizeXL) || 0,
    }
    const totalStock = Object.values(sizesObj).reduce((a, b) => a + b, 0)

    await supabase.from('products').update({
      title: editTitle,
      subtitle: editSubtitle,
      price: Number(editPrice),
      compare_at_price: editComparePrice ? Number(editComparePrice) : null,
      stock: totalStock,
      sizes: sizesObj,
      colors: colorArray,
      description: editDescription,
      image_urls: editImages
    }).eq('id', editingProduct.id)

    setEditingProduct(null)
    fetchData()
  }

  const role = adminProfile?.role
  const isSuperAdmin = role === 'super_admin' || role === 'admin'
  const isStoreAdmin = isSuperAdmin || role === 'store_admin'

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
        
        {/* ÜRÜN EKLEME (Beden ve Renk Bazlı Stok) */}
        {isStoreAdmin && (
          <div className="rounded-3xl border border-primary/30 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6">
            <h2 className="text-base font-bold flex items-center gap-2 text-primary"><PlusCircle className="h-5 w-5" /><span>Mağazaya Ürün Ekle (Beden & Renk Varyantlı Stok)</span></h2>
            
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input type="text" placeholder="Ürün Başlığı" required value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                <input type="number" placeholder="Güncel Fiyat (₺)" required value={price} onChange={(e) => setPrice(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                <input type="number" placeholder="Eski Fiyat (Üstü Çizili - Opsiyonel)" value={comparePrice} onChange={(e) => setComparePrice(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" placeholder="Renk Seçenekleri (Virgülle ayırın: Siyah, Beyaz, Gri)" value={colorsInput} onChange={(e) => setColorsInput(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                <div className="relative flex items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-3 cursor-pointer">
                  <span className="text-xs text-zinc-400 truncate">{imageList.length > 0 ? `✓ ${imageList.length} Fotoğraf Yüklendi` : 'Çoklu Fotoğraf Seç (Hover için)'}</span>
                  <Upload className="h-4 w-4 text-primary" />
                  <input type="file" accept="image/*" multiple onChange={(e) => handleMultipleImageUpload(e, 'new')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                </div>
              </div>

              {/* Beden Stokları */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-mono uppercase text-zinc-400 block">Beden Başına Stok Adetleri</label>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] text-zinc-500 block mb-1">S Beden</span>
                    <input type="number" value={sizeS} onChange={(e) => setSizeS(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-xs text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block mb-1">M Beden</span>
                    <input type="number" value={sizeM} onChange={(e) => setSizeM(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-xs text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block mb-1">L Beden</span>
                    <input type="number" value={sizeL} onChange={(e) => setSizeL(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-xs text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block mb-1">XL Beden</span>
                    <input type="number" value={sizeXL} onChange={(e) => setSizeXL(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-xs text-white" />
                  </div>
                </div>
              </div>

              <textarea rows={2} placeholder="Ürün Açıklaması" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              <button type="submit" className="w-full rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-lg cursor-pointer">Ürünü Yayınla</button>
            </form>
          </div>
        )}

        {/* YÜKLÜ ÜRÜNLER LİSTESİ */}
        {isStoreAdmin && (
          <div className="space-y-4">
            <h2 className="text-base font-bold flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /><span>Yüklü Ürünler ve Beden Stokları ({products.length})</span></h2>
            <div className="space-y-3">
              {products.map((prod) => {
                const totalStock = prod.sizes ? Object.values(prod.sizes as Record<string, number>).reduce((a: any, b: any) => a + b, 0) : (prod.stock ?? 0)

                return (
                  <div key={prod.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950 p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 flex-none"><Image src={prod.image_urls?.[0] || '/placeholder.svg'} alt="" fill className="object-cover" /></div>
                      <div>
                        <h4 className="font-bold text-xs text-white flex items-center gap-2">
                          {prod.title} 
                          {totalStock <= 0 && <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[9px] uppercase font-bold">TÜKENDİ</span>}
                        </h4>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          ₺{prod.price} | Renkler: {prod.colors?.join(', ') || 'Standart'} | Stoklar: S({prod.sizes?.S ?? 0}) M({prod.sizes?.M ?? 0}) L({prod.sizes?.L ?? 0}) XL({prod.sizes?.XL ?? 0})
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => openEditModal(prod)} className="p-2 bg-zinc-800 rounded-xl text-zinc-200 cursor-pointer"><Edit3 size={14} /></button>
                      <button type="button" onClick={() => handleDeleteProduct(prod.id)} className="p-2 bg-red-500/10 text-red-400 rounded-xl cursor-pointer"><Trash2 size={14} /></button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>

      {/* ÜRÜN DÜZENLEME MODALİ */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md" onClick={() => setEditingProduct(null)}>
          <div className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-bold text-base text-white">Ürünü ve Beden Stoklarını Düzenle</h3>
              <button type="button" onClick={() => setEditingProduct(null)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary"><X className="h-4 w-4" /></button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <input type="text" required value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" required value={editPrice} onChange={(e) => setEditPrice(e.target.value)} placeholder="Güncel Fiyat" className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                <input type="number" value={editComparePrice} onChange={(e) => setEditComparePrice(e.target.value)} placeholder="Eski Fiyat" className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              </div>
              <input type="text" value={editColors} onChange={(e) => setEditColors(e.target.value)} placeholder="Renkler (Siyah, Beyaz)" className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-400">Beden Stokları</label>
                <div className="grid grid-cols-4 gap-2">
                  <input type="number" value={editSizeS} onChange={(e) => setEditSizeS(e.target.value)} placeholder="S" className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-xs text-white text-center" />
                  <input type="number" value={editSizeM} onChange={(e) => setEditSizeM(e.target.value)} placeholder="M" className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-xs text-white text-center" />
                  <input type="number" value={editSizeL} onChange={(e) => setEditSizeL(e.target.value)} placeholder="L" className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-xs text-white text-center" />
                  <input type="number" value={editSizeXL} onChange={(e) => setEditSizeXL(e.target.value)} placeholder="XL" className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-xs text-white text-center" />
                </div>
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
