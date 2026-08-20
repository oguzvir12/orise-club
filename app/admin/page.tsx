'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Users,
  Trash2,
  ShieldCheck,
  RefreshCw,
  Lock,
  LogOut,
  ShoppingBag,
  Truck,
  PlusCircle,
  Layers,
  Edit3,
  X,
  Upload,
  Calendar,
  MapPin,
  User,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

const ADMIN_USERS: Record<string, { pass: string; branch: string; title: string; type: 'community' | 'store' | 'super' | 'community_director' }> = {
  orise_master_admin: { pass: 'Orise#2026_SecureKey!99', branch: 'ALL', title: 'Süper Admin (Tüm Yetkiler)', type: 'super' },
  community_director: { pass: 'Director#Community_2026!', branch: 'ALL', title: 'Genel Topluluk Yöneticisi', type: 'community_director' },
  store_manager_tr: { pass: 'Store#Shipping_7721*', branch: 'STORE', title: 'Mağaza & Kargo Yöneticisi', type: 'store' },
  captain_run: { pass: 'Runners#2026_Tr*', branch: 'KOŞU', title: 'Koşu Kaptanı', type: 'community' },
  leader_yoga: { pass: 'Mobility#Yoga_2026!', branch: 'YOGA & MOBILITY', title: 'Yoga & Mobility Lideri', type: 'community' },
  lead_tennis: { pass: 'Court#Tennis_8842$', branch: 'TENİS', title: 'Tenis Sorumlusu', type: 'community' },
  skipper_sail: { pass: 'Marine#Sail_5510&', branch: 'YELKEN', title: 'Yelken Kaptanı', type: 'community' },
  captain_volley: { pass: 'Volley#Spike_2026#', branch: 'VOLEYBOL', title: 'Voleybol Kaptanı', type: 'community' },
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [registrations, setRegistrations] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Yeni Ürün State'leri
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  // Yeni Etkinlik State'leri
  const [evtTitle, setEvtTitle] = useState('')
  const [evtDesc, setEvtDesc] = useState('')
  const [evtDate, setEvtDate] = useState('')
  const [evtLocation, setEvtLocation] = useState('')
  const [evtPrice, setEvtPrice] = useState('0')
  const [evtBranch, setEvtBranch] = useState('KOŞU')
  const [instructorName, setInstructorName] = useState('')
  const [evtImage, setEvtImage] = useState('')

  // Düzenleme Modal State'leri
  const [editingProduct, setEditingProduct] = useState<any | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editStock, setEditStock] = useState('')
  const [editImage, setEditImage] = useState('')

  useEffect(() => {
    const savedAuth = localStorage.getItem('orise_admin_user')
    if (savedAuth && ADMIN_USERS[savedAuth]) {
      const user = ADMIN_USERS[savedAuth]
      setIsLoggedIn(true)
      setCurrentUser(user)
      fetchData()
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const user = ADMIN_USERS[username.trim()]
    if (user && user.pass === password) {
      setIsLoggedIn(true)
      setCurrentUser(user)
      localStorage.setItem('orise_admin_user', username.trim())
      setLoginError('')
      fetchData()
    } else {
      setLoginError('Hatalı kullanıcı adı veya şifre!')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
    localStorage.removeItem('orise_admin_user')
    window.location.href = '/admin'
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: regData } = await supabase.from('event_registrations').select('*').order('created_at', { ascending: false })
      if (regData) setRegistrations(regData)

      const { data: ordData } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
      if (ordData) setOrders(ordData)

      const { data: prodData } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      if (prodData) setProducts(prodData)

      const { data: evtData } = await supabase.from('events').select('*').order('date', { ascending: true })
      if (evtData) setEvents(evtData)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'event' | 'edit') => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file)

      if (uploadError) {
        alert('Yükleme hatası: ' + uploadError.message)
        setUploading(false)
        return
      }

      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
      
      if (data?.publicUrl) {
        if (type === 'product') setImageUrl(data.publicUrl)
        else if (type === 'event') setEvtImage(data.publicUrl)
        else if (type === 'edit') setEditImage(data.publicUrl)
        alert('Fotoğraf yüklendi!')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!evtTitle || !evtDate) return

    const { error } = await supabase.from('events').insert([{
      title: evtTitle,
      description: evtDesc || 'Kulüp buluşması ve antrenman seansı.',
      date: evtDate,
      location: evtLocation || 'İstanbul',
      price: Number(evtPrice) || 0,
      branch: evtBranch,
      instructor_name: instructorName || 'Kulüp Eğitmeni',
      image_url: evtImage || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop'
    }])

    if (!error) {
      alert('Etkinlik başarıyla oluşturuldu!')
      setEvtTitle('')
      setEvtDesc('')
      setEvtDate('')
      setEvtLocation('')
      setEvtPrice('0')
      setEvtBranch('KOŞU')
      setInstructorName('')
      setEvtImage('')
      fetchData()
    } else {
      alert('Etkinlik eklenirken hata oluştu: ' + error.message)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Bu etkinliği silmek istiyor musunuz?')) return
    await supabase.from('events').delete().eq('id', id)
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  const handleDeleteRegistration = async (id: string) => {
    if (!confirm('Bu kaydı silmek istiyor musunuz?')) return
    await supabase.from('event_registrations').delete().eq('id', id)
    setRegistrations((prev) => prev.filter((r) => r.id !== id))
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !price) return
    const { error } = await supabase.from('products').insert([{
      title, subtitle: subtitle || 'Özel Parça', price: Number(price), stock: Number(stock) || 50,
      description: description || 'Kaliteli teknik tekstil.', category: 'tank', category_label: 'ÖZEL DROP',
      image_urls: imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop']
    }])
    if (!error) {
      alert('Ürün eklendi!')
      setTitle(''); setSubtitle(''); setPrice(''); setStock(''); setDescription(''); setImageUrl('')
      fetchData()
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Silinsin mi?')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const openEditModal = (prod: any) => {
    setEditingProduct(prod)
    setEditTitle(prod.title || '')
    setEditPrice(prod.price || '')
    setEditStock(prod.stock || '')
    setEditImage(prod.image_urls?.[0] || '')
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    await supabase.from('products').update({
      title: editTitle, price: Number(editPrice), stock: Number(editStock),
      image_urls: editImage ? [editImage] : editingProduct.image_urls
    }).eq('id', editingProduct.id)
    setEditingProduct(null)
    fetchData()
  }

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 bg-black text-white flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md rounded-3xl border border-white/15 bg-zinc-950 p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/40">
              <Lock className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-black text-white">ORISE Yönetim Girişi</h1>
            <p className="text-xs text-zinc-400">Yetkili kullanıcı adı ve şifrenizle giriş yapın.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Kullanıcı Adı</label>
              <input
                type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                placeholder="orise_master_admin..."
                className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Şifre</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white focus:border-primary focus:outline-none"
              />
            </div>
            {loginError && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400 text-center">
                {loginError}
              </div>
            )}
            <button
              type="submit"
              className="w-full rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_20px_rgba(249,115,22,0.35)] hover:scale-[1.02] transition-transform cursor-pointer"
            >
              Giriş Yap
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 underline">
              ← Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black text-white p-6 sm:p-10 font-sans">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-300 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white">ORISE Kontrol Paneli</h1>
            <p className="text-xs font-mono text-primary uppercase">{currentUser?.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-50">
          <button type="button" onClick={fetchData} className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-300 hover:border-primary cursor-pointer">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Yenile</span>
          </button>
          <button type="button" onClick={handleLogout} className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 cursor-pointer">
            <LogOut className="h-3.5 w-3.5" />
            <span>Çıkış</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-12 mb-16">
        
        {/* ================= 1. YENİ ETKİNLİK OLUŞTURMA (HOCA & KONUM İLE) ================= */}
        {currentUser?.type === 'super' && (
          <div className="rounded-3xl border border-primary/30 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6">
            <h2 className="text-base font-bold flex items-center gap-2 text-primary">
              <Calendar className="h-5 w-5" />
              <span>Yeni Topluluk Etkinliği Oluştur (Hoca & Konum Seçimi)</span>
            </h2>
            <form onSubmit={handleAddEvent} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <input type="text" placeholder="Etkinlik Adı (Örn: Sunset Run)" required value={evtTitle} onChange={(e) => setEvtTitle(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              
              <input type="text" placeholder="Eğitmen / Hoca İsmi" value={instructorName} onChange={(e) => setInstructorName(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />

              <select value={evtBranch} onChange={(e) => setEvtBranch(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white focus:border-primary">
                <option value="KOŞU">KOŞU</option>
                <option value="YOGA & MOBILITY">YOGA & MOBILITY</option>
                <option value="TENİS">TENİS</option>
                <option value="VOLEYBOL">VOLEYBOL</option>
                <option value="YELKEN">YELKEN</option>
              </select>

              <input type="text" placeholder="Harita Konum Linki (Google Maps URL)" value={evtLocation} onChange={(e) => setEvtLocation(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />

              <input type="datetime-local" required value={evtDate} onChange={(e) => setEvtDate(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              
              <input type="number" placeholder="Bilet Fiyatı (0 = Ücretsiz)" required value={evtPrice} onChange={(e) => setEvtPrice(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              
              <div className="relative flex items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-3 cursor-pointer hover:border-primary">
                <span className="text-xs text-zinc-400 truncate pointer-events-none">{uploading ? 'Yükleniyor...' : evtImage ? '✓ Afiş Yüklendi' : 'Etkinlik Afişi Seç'}</span>
                <Upload className="h-4 w-4 text-primary flex-none pointer-events-none" />
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'event')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              </div>

              <textarea rows={1} placeholder="Etkinlik Açıklaması" value={evtDesc} onChange={(e) => setEvtDesc(e.target.value)} className="sm:col-span-2 lg:col-span-2 rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />

              <button type="submit" className="sm:col-span-2 lg:col-span-3 rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-lg cursor-pointer">
                Etkinliği Yayınla
              </button>
            </form>
          </div>
        )}

        {/* ================= 2. MAĞAZAYA YENİ ÜRÜN EKLEME ================= */}
        {(currentUser?.type === 'store' || currentUser?.type === 'super') && (
          <div className="rounded-3xl border border-primary/30 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6">
            <h2 className="text-base font-bold flex items-center gap-2 text-primary">
              <PlusCircle className="h-5 w-5" />
              <span>Mağazaya Yeni Ürün / Drop Ekle</span>
            </h2>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <input type="text" placeholder="Ürün Başlığı" required value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              <input type="text" placeholder="Alt Başlık" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              <input type="number" placeholder="Fiyat (₺)" required value={price} onChange={(e) => setPrice(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              <input type="number" placeholder="Stok Adedi" required value={stock} onChange={(e) => setStock(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              
              <div className="relative flex items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-3 cursor-pointer hover:border-primary">
                <span className="text-xs text-zinc-400 truncate pointer-events-none">{uploading ? 'Yükleniyor...' : imageUrl ? '✓ Ürün Görseli Yüklendi' : 'Ürün Görseli Seç'}</span>
                <Upload className="h-4 w-4 text-primary flex-none pointer-events-none" />
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'product')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              </div>

              <textarea rows={1} placeholder="Açıklama" value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              <button type="submit" className="sm:col-span-2 lg:col-span-3 rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-lg cursor-pointer">
                Ürünü Mağazada Yayınla
              </button>
            </form>
          </div>
        )}

        {/* ================= 3. LİSTELER (ÜRÜNLER VE ETKİNLİKLER) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ürünler */}
          <div className="space-y-4">
            <h2 className="text-base font-bold flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /><span>Yüklü Ürünler ({products.length})</span></h2>
            <div className="space-y-3">
              {products.map((prod) => (
                <div key={prod.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950 p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 flex-none">
                      <Image src={prod.image_urls?.[0] || '/placeholder.svg'} alt={prod.title} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">{prod.title}</h4>
                      <div className="text-[10px] text-zinc-400">₺{prod.price} · Stok: {prod.stock}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(prod)} className="p-2 bg-zinc-800 rounded-xl text-zinc-200 hover:bg-zinc-700 cursor-pointer"><Edit3 size={14} /></button>
                    <button onClick={() => handleDeleteProduct(prod.id)} className="p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 cursor-pointer"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Etkinlikler */}
          <div className="space-y-4">
            <h2 className="text-base font-bold flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /><span>Aktif Etkinlikler ({events.length})</span></h2>
            <div className="space-y-3">
              {events.map((evt) => (
                <div key={evt.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950 p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 flex-none">
                      <Image src={evt.image_url || '/placeholder.svg'} alt={evt.title} fill className="object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-primary uppercase">{evt.branch} {evt.instructor_name ? `• Eğitmen: ${evt.instructor_name}` : ''}</span>
                      <h4 className="font-bold text-xs text-white">{evt.title}</h4>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteEvent(evt.id)} className="p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 cursor-pointer"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= 4. SİPARİŞLER VE KATILIMCILAR ================= */}
        <div className="space-y-6">
          <h2 className="text-base font-bold flex items-center gap-2"><Users className="h-4 w-4 text-primary" /><span>Etkinlik Katılımcıları & Siparişler ({registrations.length + orders.length})</span></h2>
          <div className="rounded-3xl border border-white/10 bg-zinc-950 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-white/10 bg-black/60 text-zinc-500 uppercase">
                  <tr>
                    <th className="p-4">Kişi / Müşteri</th>
                    <th className="p-4">İletişim</th>
                    <th className="p-4">Kayıt Türü</th>
                    <th className="p-4 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-zinc-900/40">
                      <td className="p-4 font-bold text-white">{reg.full_name}</td>
                      <td className="p-4">{reg.phone}</td>
                      <td className="p-4 text-primary font-bold">Etkinlik Katılımı</td>
                      <td className="p-4 text-right"><button onClick={() => handleDeleteRegistration(reg.id)} className="p-2 text-zinc-500 hover:text-red-400 cursor-pointer"><Trash2 className="h-4 w-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* DÜZENLEME MODALİ */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-bold text-base text-white">Ürünü Düzenle</h3>
              <button onClick={() => setEditingProduct(null)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white cursor-pointer">
                <X className="h-4 w-4" />
              </button>
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
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Stok</label>
                  <input type="number" required value={editStock} onChange={(e) => setEditStock(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                </div>
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 rounded-full border border-white/10 bg-zinc-900 py-3 text-xs font-bold uppercase text-zinc-300 cursor-pointer">İptal</button>
                <button type="submit" className="flex-1 rounded-full bg-primary py-3 text-xs font-bold uppercase text-black cursor-pointer">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
