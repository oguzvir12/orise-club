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
      image_url: evtImage || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop'
    }])

    if (!error) {
      alert('Etkinlik başarıyla oluşturuldu!')
      setEvtTitle(''); setEvtDesc(''); setEvtDate(''); setEvtLocation(''); setEvtPrice('0'); setEvtImage('')
      fetchData()
    } else {
      alert('Etkinlik eklenirken hata oluştu.')
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

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    setOrders((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord)))
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !price) return
    const { error } = await supabase.from('products').insert([{
      title, subtitle: subtitle || 'Özel Parça', price: Number(price), stock: Number(stock) || 50,
      description: description || 'Kaliteli teknik tekstil.', category: 'tank', category_label: 'ÖZEL DROP',
      image_urls: imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop']
    }])
    if (!error) { setTitle(''); setSubtitle(''); setPrice(''); setStock(''); setDescription(''); setImageUrl(''); fetchData() }
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
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/40"><Lock className="h-5 w-5" /></div>
            <h1 className="text-xl font-black text-white">ORISE Yönetim Girişi</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Kullanıcı Adı" className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white focus:border-primary focus:outline-none" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifre" className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white focus:border-primary focus:outline-none" />
            {loginError && <div className="text-xs text-red-400 text-center">{loginError}</div>}
            <button type="submit" className="w-full rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black cursor-pointer">Giriş Yap</button>
          </form>
          <div className="text-center pt-2"><Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 underline">← Ana Sayfa</Link></div>
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
            <p className="text-xs font-mono text-primary uppercase">{currentUser?.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 relative z-50">
          <button type="button" onClick={fetchData} className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-300 hover:border-primary cursor-pointer"><RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /><span>Yenile</span></button>
          <button type="button" onClick={handleLogout} className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 cursor-pointer"><LogOut className="h-3.5 w-3.5" /><span>Çıkış</span></button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-12 mb-16">
        
        {/* ETKİNLİK EKLEME */}
        {currentUser?.type === 'super' && (
          <div className="rounded-3xl border border-primary/30 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6">
            <h2 className="text-base font-bold flex items-center gap-2 text-primary">
              <Calendar className="h-5 w-5" />
              <span>Yeni Topluluk Etkinliği Oluştur</span>
            </h2>
            <form onSubmit={handleAddEvent} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <input type="text" placeholder="Etkinlik Adı" required value={evtTitle} onChange={(e) => setEvtTitle(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              
              {/* Branş Seçimi */}
              <select value={evtBranch} onChange={(e) => setEvtBranch(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white focus:border-primary">
                <option value="KOŞU">KOŞU</option>
                <option value="YOGA & MOBILITY">YOGA & MOBILITY</option>
                <option value="TENİS">TENİS</option>
                <option value="VOLEYBOL">VOLEYBOL</option>
                <option value="YELKEN">YELKEN</option>
              </select>

              <input type="datetime-local" required value={evtDate} onChange={(e) => setEvtDate(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              <input type="text" placeholder="Lokasyon (Örn: Caddebostan Sahil)" value={evtLocation} onChange={(e) => setEvtLocation(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              <input type="number" placeholder="Bilet Fiyatı (0 = Ücretsiz)" required value={evtPrice} onChange={(e) => setEvtPrice(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              
              <div className="relative flex items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-3 cursor-pointer hover:border-primary">
                <span className="text-xs text-zinc-400 truncate pointer-events-none">{uploading ? 'Yükleniyor...' : evtImage ? '✓ Afiş Yüklendi' : 'Etkinlik Afişi Seç'}</span>
                <Upload className="h-4 w-4 text-primary flex-none pointer-events-none" />
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'event')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              </div>

              <textarea rows={1} placeholder="Açıklama" value={evtDesc} onChange={(e) => setEvtDesc(e.target.value)} className="sm:col-span-2 lg:col-span-3 rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />

              <button type="submit" className="sm:col-span-2 lg:col-span-3 rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-lg cursor-pointer">
                Etkinliği Yayınla
              </button>
            </form>
          </div>
        )}

        {/* AKTİF ETKİNLİKLER LİSTESİ */}
        <div className="space-y-4">
          <h2 className="text-base font-bold flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /><span>Aktif Etkinlikler ({events.length})</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((evt) => (
              <div key={evt.id} className="flex flex-col justify-between rounded-2xl border border-white/10 bg-zinc-950 p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 flex-none">
                    <Image src={evt.image_url || '/placeholder.svg'} alt={evt.title} fill className="object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-primary uppercase">{evt.branch}</span>
                    <h4 className="font-bold text-xs text-white line-clamp-1">{evt.title}</h4>
                    <div className="text-[11px] font-mono text-zinc-400">
                      {Number(evt.price) === 0 ? 'Ücretsiz Katılım' : `₺${evt.price} Ödemeli`}
                    </div>
                  </div>
                </div>
                {currentUser?.type === 'super' && (
                  <button onClick={() => handleDeleteEvent(evt.id)} className="w-full py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold cursor-pointer">
                    Etkinliği Kaldır
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* KATILIMCILAR */}
        <div className="space-y-6">
          <h2 className="text-base font-bold flex items-center gap-2"><Users className="h-4 w-4 text-primary" /><span>Etkinlik Katılımcıları ({registrations.length})</span></h2>
          <div className="rounded-3xl border border-white/10 bg-zinc-950 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-white/10 bg-black/60 text-zinc-500 uppercase">
                  <tr>
                    <th className="p-4">Katılımcı</th>
                    <th className="p-4">İletişim</th>
                    <th className="p-4">Tür</th>
                    <th className="p-4 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  {registrations.length > 0 ? (
                    registrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-zinc-900/40">
                        <td className="p-4 font-bold text-white">{reg.full_name}</td>
                        <td className="p-4">{reg.phone} / {reg.email}</td>
                        <td className="p-4 text-primary font-bold">{reg.is_paid ? 'Ücretli Bilet' : 'Ücretsiz Kayıt'}</td>
                        <td className="p-4 text-right"><button onClick={() => handleDeleteRegistration(reg.id)} className="p-2 text-zinc-500 hover:text-red-400 cursor-pointer"><Trash2 className="h-4 w-4" /></button></td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4} className="p-6 text-center text-zinc-500">Kayıt bulunmuyor.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
