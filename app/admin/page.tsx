'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Users,
  Trash2,
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
  Eye,
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

  const [selectedMember, setSelectedMember] = useState<any | null>(null)

  // Yeni Ürün Ekleme State'leri
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

  // Ürün Düzenleme State'leri
  const [editingProduct, setEditingProduct] = useState<any | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editSubtitle, setEditSubtitle] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editComparePrice, setEditComparePrice] = useState('')
  const [editColors, setEditColors] = useState('')
  const [editSizeS, setEditSizeS] = useState(0)
  const [editSizeM, setEditSizeM] = useState(0)
  const [editSizeL, setEditSizeL] = useState(0)
  const [editSizeXL, setEditSizeXL] = useState(0)
  const [editDescription, setEditDescription] = useState('')
  const [editImages, setEditImages] = useState<string[]>([])

  // Kupon State'leri
  const [couponCode, setCouponCode] = useState('')
  const [discountPct, setDiscountPct] = useState('')
  const [usageLimit, setUsageLimit] = useState('100')

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

  // Çoklu Fotoğraf Yükleme (Supabase Storage: product-images)
  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'new' | 'edit') => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    const uploadedUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36.substring(2, 7))}.${fileExt}`
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

  // Ürün Ekleme Fonksiyonu
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !price) return

    const colorArray = colorsInput.split(',').map(c => c.trim()).filter(Boolean)
    const sizesObj = { S: Number(sizeS) || 0, M: Number(sizeM) || 0, L: Number(sizeL) || 0, XL: Number(sizeXL) || 0 }
    const totalStock = Object.values(sizesObj).reduce((a: any, b: any) => a + b, 0)

    const { error } = await supabase.from('products').insert([{
      title,
      subtitle: subtitle || 'Özel Parça',
      price: Number(price),
      compare_at_price: comparePrice ? Number(comparePrice) : null,
      stock: totalStock,
      sizes: sizesObj,
      colors: colorArray,
      is_active: true,
      description: description || 'Kaliteli teknik tekstil.',
      category: 'tank',
      category_label: 'ÖZEL DROP',
      image_urls: imageList.length > 0 ? imageList : ['https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop']
    }])

    if (!error) {
      alert('Ürün başarıyla eklendi!')
      setTitle(''); setSubtitle(''); setPrice(''); setComparePrice(''); setDescription(''); setImageList([])
      fetchData()
    } else {
      alert('Hata: ' + error.message)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return
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
    setEditSizeS(prod.sizes?.S ?? 0)
    setEditSizeM(prod.sizes?.M ?? 0)
    setEditSizeL(prod.sizes?.L ?? 0)
    setEditSizeXL(prod.sizes?.XL ?? 0)
    setEditDescription(prod.description || '')
    setEditImages(prod.image_urls || (prod.image_url ? [prod.image_url] : []))
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    const colorArray = editColors.split(',').map(c => c.trim()).filter(Boolean)
    const sizesObj = { S: Number(editSizeS) || 0, M: Number(editSizeM) || 0, L: Number(editSizeL) || 0, XL: Number(editSizeXL) || 0 }
    const totalStock = Object.values(sizesObj).reduce((a: any, b: any) => a + b, 0)

    const { error } = await supabase.from('products').update({
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

    if (!error) {
      alert('Ürün başarıyla güncellendi!')
      setEditingProduct(null)
      fetchData()
    } else {
      alert('Hata: ' + error.message)
    }
  }

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponCode || !discountPct) return
    const { error } = await supabase.from('coupons').insert([{
      code: couponCode.trim().toUpperCase(),
      discount_percentage: Number(discountPct),
      usage_limit: Number(usageLimit) || 100
    }])
    if (!error) {
      alert('Kupon eklendi!')
      setCouponCode(''); setDiscountPct(''); setUsageLimit('100')
      fetchData()
    } else {
      alert('Hata: ' + error.message)
    }
  }

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Silinsin mi?')) return
    await supabase.from('coupons').delete().eq('id', id)
    setCoupons((prev) => prev.filter((c) => c.id !== id))
  }

  const role = adminProfile?.role
  const isSuperAdmin = role === 'super_admin' || role === 'admin'
  const isStoreAdmin = role === 'store_admin'

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
        
        {/* MAĞAZA SİPARİŞLERİ */}
        {(isSuperAdmin || isStoreAdmin) && (
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-base font-bold flex items-center gap-2"><ShoppingBag className="h-4 w-4 text-primary" /><span>Mağaza Siparişleri ({orders.length})</span></h2>
              <div className="rounded-3xl border border-white/10 bg-zinc-950 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="border-b border-white/10 bg-black/60 text-zinc-500 uppercase">
                      <tr>
                        <th className="p-4">Müşteri / TCKN</th>
                        <th className="p-4">Ürünler</th>
                        <th className="p-4">Adresler & Kargo</th>
                        <th className="p-4">Tutar</th>
                        <th className="p-4">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-zinc-300">
                      {orders.length === 0 ? (
                        <tr><td colSpan={5} className="p-6 text-center text-zinc-500">Sipariş bulunmuyor.</td></tr>
                      ) : (
                        orders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-zinc-900/40 align-top">
                            <td className="p-4 font-bold text-white">
                              {ord.customer_name}
                              <div className="text-[10px] text-zinc-400 font-normal">{ord.phone}</div>
                              <div className="text-[10px] text-zinc-500 font-normal">TC: {ord.tc_no || 'Belirtilmemiş'}</div>
                            </td>
                            <td className="p-4">
                              {ord.items?.map((i: any, idx: number) => (
                                <div key={idx}>• {i.name} (x{i.quantity})</div>
                              ))}
                            </td>
                            <td className="p-4 text-[11px] space-y-1">
                              <div><strong className="text-zinc-500">Teslimat:</strong> {ord.address}</div>
                              <div><strong className="text-zinc-500">Fatura:</strong> {ord.billing_address || ord.address}</div>
                              <div className="text-primary font-bold">Kargo: {ord.shipping_fee === 0 ? 'Ücretsiz (2000 TL+)' : `₺${ord.shipping_fee}`}</div>
                            </td>
                            <td className="p-4 font-bold text-primary">₺{ord.total_price}</td>
                            <td className="p-4"><span className="px-2.5 py-1 rounded-full text-[10px] bg-zinc-800 text-zinc-300">{ord.status}</span></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* İNDİRİM KUPONU YÖNETİMİ */}
            <div className="rounded-3xl border border-primary/30 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6">
              <h2 className="text-base font-bold flex items-center gap-2 text-primary"><Tag className="h-5 w-5" /><span>İndirim Kuponu Yönetimi</span></h2>
              <form onSubmit={handleAddCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <input type="text" placeholder="Kupon Kodu" required value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white uppercase" />
                <input type="number" placeholder="İndirim Yüzdesi (%)" required value={discountPct} onChange={(e) => setDiscountPct(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                <input type="number" placeholder="Kullanım Sınırı" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                <button type="submit" className="rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-lg cursor-pointer">Kuponu Aktif Et</button>
              </form>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {coupons.map((cp) => (
                  <div key={cp.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/60 p-3 text-xs">
                    <div><strong className="text-primary font-mono">{cp.code}</strong> (%{cp.discount_percentage})</div>
                    <button type="button" onClick={() => handleDeleteCoupon(cp.id)} className="text-zinc-500 hover:text-red-400"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* YENİ ÜRÜN EKLEME FORMU */}
            <div className="rounded-3xl border border-primary/30 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6">
              <h2 className="text-base font-bold flex items-center gap-2 text-primary"><PlusCircle className="h-5 w-5" /><span>Mağazaya Ürün Ekle</span></h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input type="text" placeholder="Ürün Başlığı" required value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                  <input type="text" placeholder="Alt Başlık (Örn: Özel Seri)" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                  <input type="number" placeholder="Güncel Fiyat (₺)" required value={price} onChange={(e) => setPrice(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="number" placeholder="Eski Fiyat (İndirimli göstermek için)" value={comparePrice} onChange={(e) => setComparePrice(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                  <input type="text" placeholder="Renkler (Siyah, Beyaz)" value={colorsInput} onChange={(e) => setColorsInput(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                </div>

                {/* Çoklu Fotoğraf Seçici */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-2">Ürün Fotoğrafları (Çoklu Seçim)</label>
                  <div className="relative flex items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-3 cursor-pointer hover:border-primary">
                    <span className="text-xs text-zinc-400 truncate">{uploading ? 'Yükleniyor...' : imageList.length > 0 ? `✓ ${imageList.length} Fotoğraf Yüklendi` : 'Fotoğraf Seç'}</span>
                    <Upload className="h-4 w-4 text-primary" />
                    <input type="file" accept="image/*" multiple onChange={(e) => handleMultipleImageUpload(e, 'new')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  </div>
                  {imageList.length > 0 && (
                    <div className="flex items-center gap-3 pt-3 overflow-x-auto">
                      {imageList.map((imgUrl, imgIdx) => (
                        <div key={imgIdx} className="relative h-16 w-16 rounded-xl overflow-hidden border border-white/20 flex-none group">
                          <Image src={imgUrl} alt="" fill className="object-cover" />
                          <button type="button" onClick={() => setImageList(imageList.filter((_, i) => i !== imgIdx))} className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-bold cursor-pointer">Kaldır</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div><span className="text-[10px] text-zinc-500">S Beden</span><input type="number" value={sizeS} onChange={(e) => setSizeS(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-xs text-white text-center" /></div>
                  <div><span className="text-[10px] text-zinc-500">M Beden</span><input type="number" value={sizeM} onChange={(e) => setSizeM(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-xs text-white text-center" /></div>
                  <div><span className="text-[10px] text-zinc-500">L Beden</span><input type="number" value={sizeL} onChange={(e) => setSizeL(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-xs text-white text-center" /></div>
                  <div><span className="text-[10px] text-zinc-500">XL Beden</span><input type="number" value={sizeXL} onChange={(e) => setSizeXL(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-xs text-white text-center" /></div>
                </div>

                <textarea rows={2} placeholder="Ürün Açıklaması" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white resize-none" />
                
                <button type="submit" className="w-full rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black cursor-pointer shadow-lg">Ürünü Mağazada Yayınla</button>
              </form>
            </div>

            {/* YÜKLÜ ÜRÜNLER LİSTESİ VE DÜZENLEME */}
            <div className="space-y-4">
              <h2 className="text-base font-bold flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /><span>Yüklü Ürünler ({products.length})</span></h2>
              <div className="space-y-3">
                {products.map((prod) => (
                  <div key={prod.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950 p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-black border border-white/10 flex-none">
                        <Image src={prod.image_urls?.[0] || prod.image_url || '/placeholder.svg'} alt="" fill className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-white">{prod.title}</h4>
                        <div className="text-[10px] text-zinc-400 font-mono">₺{prod.price} | S({prod.sizes?.S ?? 0}) M({prod.sizes?.M ?? 0}) L({prod.sizes?.L ?? 0}) XL({prod.sizes?.XL ?? 0})</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => openEditModal(prod)} className="p-2.5 bg-zinc-800 rounded-xl text-zinc-200 hover:text-white cursor-pointer" title="Düzenle"><Edit3 size={14} /></button>
                      <button type="button" onClick={() => handleDeleteProduct(prod.id)} className="p-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 cursor-pointer" title="Sil"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ÜRÜN DÜZENLEME MODALI (FOTOĞRAF EKLEME / ÇIKARMA & STOK GÜNCELLEME) */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md" onClick={() => setEditingProduct(null)}>
          <div className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-bold text-base text-white">Ürünü, Fotoğrafları ve Stokları Düzenle</h3>
              <button type="button" onClick={() => setEditingProduct(null)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary hover:text-black"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Ürün Başlığı</label>
                <input type="text" required value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Fiyat (₺)</label>
                  <input type="number" required value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Eski Fiyat</label>
                  <input type="number" value={editComparePrice} onChange={(e) => setEditComparePrice(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Renkler</label>
                <input type="text" value={editColors} onChange={(e) => setEditColors(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              </div>

              {/* Fotoğraf Ekleme / Kaldırma Yönetimi */}
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-2">Ürün Fotoğrafları Yönetimi</label>
                <div className="relative flex items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-3 cursor-pointer hover:border-primary">
                  <span className="text-xs text-zinc-400 truncate pointer-events-none">{uploading ? 'Yükleniyor...' : 'Yeni Fotoğraf Ekle (Çoklu)'}</span>
                  <Upload className="h-4 w-4 text-primary" />
                  <input type="file" accept="image/*" multiple onChange={(e) => handleMultipleImageUpload(e, 'edit')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                </div>
                {editImages.length > 0 && (
                  <div className="flex items-center gap-3 pt-3 overflow-x-auto">
                    {editImages.map((imgUrl, imgIdx) => (
                      <div key={imgIdx} className="relative h-16 w-16 rounded-xl overflow-hidden border border-white/20 flex-none group">
                        <Image src={imgUrl} alt="" fill className="object-cover" />
                        <button type="button" onClick={() => setEditImages(editImages.filter((_, i) => i !== imgIdx))} className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-bold cursor-pointer">Kaldır</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-400">Beden Stokları</label>
                <div className="grid grid-cols-4 gap-2">
                  <div><span className="text-[9px] text-zinc-500">S</span><input type="number" value={editSizeS} onChange={(e) => setEditSizeS(Number(e.target.value))} className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-xs text-white text-center" /></div>
                  <div><span className="text-[9px] text-zinc-500">M</span><input type="number" value={editSizeM} onChange={(e) => setEditSizeM(Number(e.target.value))} className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-xs text-white text-center" /></div>
                  <div><span className="text-[9px] text-zinc-500">L</span><input type="number" value={editSizeL} onChange={(e) => setEditSizeL(Number(e.target.value))} className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-xs text-white text-center" /></div>
                  <div><span className="text-[9px] text-zinc-500">XL</span><input type="number" value={editSizeXL} onChange={(e) => setEditSizeXL(Number(e.target.value))} className="w-full rounded-xl border border-white/10 bg-black px-3 py-2 text-xs text-white text-center" /></div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Açıklama</label>
                <textarea rows={3} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white resize-none" />
              </div>

              <button type="submit" className="w-full rounded-full bg-primary py-3.5 text-xs font-bold uppercase text-black cursor-pointer shadow-lg">Değişiklikleri Kaydet</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
