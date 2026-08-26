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

  // Ürün form state'leri (Çoklu fotoğraf desteği için imageList)
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [description, setDescription] = useState('')
  const [imageList, setImageList] = useState<string[]>([])

  const [evtTitle, setEvtTitle] = useState('')
  const [evtDesc, setEvtDesc] = useState('')
  const [evtDate, setEvtDate] = useState('')
  const [evtLocation, setEvtLocation] = useState('')
  const [evtBranch, setEvtBranch] = useState('KOŞU')
  const [instructorName, setInstructorName] = useState('')
  const [evtImage, setEvtImage] = useState('')

  const [editingProduct, setEditingProduct] = useState<any | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editStock, setEditStock] = useState('')
  const [editImages, setEditImages] = useState<string[]>([])

  const [editingEvent, setEditingEvent] = useState<any | null>(null)
  const [editEvtTitle, setEditEvtTitle] = useState('')
  const [editEvtBranch, setEditEvtBranch] = useState('KOŞU')
  const [editEvtLocation, setEditEvtLocation] = useState('')
  const [editEvtDate, setEditEvtDate] = useState('')
  const [editEvtInstructor, setEditEvtInstructor] = useState('')
  const [editEvtImage, setEditEvtImage] = useState('')

  useEffect(() => {
    checkAdminSession()
  }, [])

  const checkAdminSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
      if (profile && (profile.role === 'admin' || profile.role === 'captain')) {
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

  // ÇOKLU FOTOĞRAF YÜKLEME FONKSİYONU
  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'new' | 'edit') => {
    try {
      const files = e.target.files
      if (!files || files.length === 0) return

      setUploading(true)
      const uploadedUrls: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${i}.${fileExt}`

        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file)
        if (uploadError) {
          alert('Yükleme hatası: ' + uploadError.message)
          continue
        }

        const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
        if (data?.publicUrl) {
          uploadedUrls.push(data.publicUrl)
        }
      }

      if (target === 'new') {
        setImageList((prev) => [...prev, ...uploadedUrls])
      } else {
        setEditImages((prev) => [...prev, ...uploadedUrls])
      }

      alert('Fotoğraflar başarıyla yüklendi!')
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'event' | 'editev') => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file)
      if (uploadError) {
        alert('Yükleme hatası: ' + uploadError.message)
        setUploading(false)
        return
      }

      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
      if (data?.publicUrl) {
        if (type === 'event') setEvtImage(data.publicUrl)
        else if (type === 'editev') setEditEvtImage(data.publicUrl)
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
      description: evtDesc || 'Kulüp buluşması. Detaylar Instagram hesabımızda.',
      date: evtDate,
      location: evtLocation || 'İstanbul',
      branch: evtBranch,
      instructor_name: instructorName || 'Kulüp Eğitmeni',
      image_url: evtImage || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop'
    }])

    if (!error) {
      alert('Etkinlik başarıyla oluşturuldu!')
      setEvtTitle(''); setEvtDesc(''); setEvtDate(''); setEvtLocation(''); setInstructorName(''); setEvtImage('')
      fetchData()
    } else {
      alert('Hata: ' + error.message)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Bu etkinliği silmek istiyor musunuz?')) return
    await supabase.from('events').delete().eq('id', id)
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  const openEditEventModal = (evt: any) => {
    setEditingEvent(evt)
    setEditEvtTitle(evt.title || '')
    setEditEvtBranch(evt.branch || 'KOŞU')
    setEditEvtLocation(evt.location || '')
    setEditEvtDate(evt.date ? evt.date.slice(0, 16) : '')
    setEditEvtInstructor(evt.instructor_name || '')
    setEditEvtImage(evt.image_url || '')
  }

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEvent) return

    const { error } = await supabase.from('events').update({
      title: editEvtTitle,
      branch: editEvtBranch,
      location: editEvtLocation,
      date: editEvtDate,
      instructor_name: editEvtInstructor,
      image_url: editEvtImage || editingEvent.image_url
    }).eq('id', editingEvent.id)

    if (!error) {
      alert('Etkinlik güncellendi!')
      setEditingEvent(null)
      fetchData()
    } else {
      alert('Hata: ' + error.message)
    }
  }

  const handleUpdateRegistrationStatus = async (regId: string, newStatus: 'approved' | 'rejected') => {
    const { error } = await supabase.from('event_registrations').update({ status: newStatus }).eq('id', regId)
    if (!error) { 
      alert('Başvuru durumu güncellendi!'); 
      fetchData(); 
    } else {
      alert('Hata: ' + error.message);
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string, trackingNum?: string) => {
    const payload: any = { status: newStatus }
    if (trackingNum !== undefined) payload.tracking_number = trackingNum

    const { error } = await supabase.from('orders').update(payload).eq('id', orderId)
    if (!error) { 
      alert('Sipariş durumu güncellendi!'); 
      fetchData(); 
    } else {
      alert('Hata: ' + error.message);
    }
  }

  const handleRefundOrder = async (orderId: string) => {
    if (!confirm('Sipariş iptal edilsin ve iade süreci başlatılsın mı?')) return
    const { error } = await supabase.from('orders').update({ status: 'refunded' }).eq('id', orderId)
    if (!error) {
      alert('Sipariş iptal edildi ve iade süreci başlatıldı.')
      fetchData()
    } else {
      alert('İade hatası: ' + error.message)
    }
  }

  const handleDeleteRegistration = async (id: string) => {
    if (!confirm('Silinsin mi?')) return
    await supabase.from('event_registrations').delete().eq('id', id)
    setRegistrations((prev) => prev.filter((r) => r.id !== id))
  }

  const handleDeleteProfile = async (id: string) => {
    if (!confirm('Silinsin mi?')) return
    await supabase.from('profiles').delete().eq('id', id)
    setProfiles((prev) => prev.filter((p) => p.id !== id))
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !price) return
    
    const { error } = await supabase.from('products').insert([{
      title, 
      subtitle: subtitle || 'Özel Parça', 
      price: Number(price), 
      stock: Number(stock) || 50,
      description: description || 'Kaliteli teknik tekstil.', 
      category: 'tank', 
      category_label: 'ÖZEL DROP',
      image_urls: imageList.length > 0 ? imageList : ['https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop']
    }])

    if (!error) {
      alert('Ürün başarıyla eklendi!')
      setTitle(''); setSubtitle(''); setPrice(''); setStock(''); setDescription(''); setImageList([])
      fetchData()
    } else {
      alert('Hata: ' + error.message)
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
    setEditImages(prod.image_urls || [prod.image_url] || [])
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    
    await supabase.from('products').update({
      title: editTitle, 
      price: Number(editPrice), 
      stock: Number(editStock),
      image_urls: editImages
    }).eq('id', editingProduct.id)
    
    setEditingProduct(null)
    fetchData()
  }

  const exportToCSV = () => {
    const headers = ['Katılımcı Adı', 'Telefon', 'E-posta', 'Etkinlik', 'Durum']
    const rows = filteredRegistrations.map(r => [`"${r.full_name || ''}"`, `"${r.phone || ''}"`, `"${r.email || ''}"`, `"${r.events?.title || ''}"`, `"${r.status || ''}"`])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'orise_etkinlik_katilimcilari.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const isSuperAdmin = adminProfile?.role === 'admin'
  const adminBranch = adminProfile?.branch?.toUpperCase()

  const filteredEvents = isSuperAdmin ? events : events.filter(e => e.branch?.toUpperCase() === adminBranch)
  const allowedEventIds = filteredEvents.map(e => e.id)
  const filteredRegistrations = isSuperAdmin ? registrations : registrations.filter(r => allowedEventIds.includes(r.event_id))

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
            <p className="text-xs font-mono text-primary uppercase">{adminProfile?.title || adminProfile?.role} {adminBranch ? `(${adminBranch})` : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => fetchData()} className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-300 hover:border-primary cursor-pointer"><RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Yenile</button>
          <button type="button" onClick={handleLogout} className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 cursor-pointer"><LogOut className="h-3.5 w-3.5" /> Çıkış</button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-12 mb-16">
        
        {/* MAĞAZA SİPARİŞLERİ YÖNETİMİ */}
        <div className="space-y-6">
          <h2 className="text-base font-bold flex items-center gap-2"><ShoppingBag className="h-4 w-4 text-primary" /><span>Mağaza Siparişleri ({orders.length})</span></h2>
          <div className="rounded-3xl border border-white/10 bg-zinc-950 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-white/10 bg-black/60 text-zinc-500 uppercase">
                  <tr>
                    <th className="p-4">Müşteri</th>
                    <th className="p-4">Ürünler</th>
                    <th className="p-4">Teslimat</th>
                    <th className="p-4">Tutar</th>
                    <th className="p-4">Durum / Kargo Takip</th>
                    <th className="p-4 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  {orders.length === 0 ? (
                    <tr><td colSpan={6} className="p-6 text-center text-zinc-500">Henüz sipariş bulunmuyor.</td></tr>
                  ) : (
                    orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-zinc-900/40">
                        <td className="p-4">
                          <div className="font-bold text-white">{ord.customer_name}</div>
                          <div className="text-[10px] text-zinc-500">{ord.phone}</div>
                          <div className="text-[10px] text-zinc-500">{ord.address}</div>
                        </td>
                        <td className="p-4 max-w-xs">
                          {ord.items?.map((i: any, idx: number) => (
                            <div key={idx} className="text-[11px]">• {i.name} (x{i.quantity})</div>
                          ))}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${ord.delivery_type === 'shipping' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
                            {ord.delivery_type === 'shipping' ? 'Kargo' : 'Elden Teslim'}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-primary">₺{ord.total_price}</td>
                        <td className="p-4 space-y-2">
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-zinc-800 text-zinc-300">{ord.status}</span>
                          <input 
                            type="text" 
                            placeholder="Kargo Takip No" 
                            defaultValue={ord.tracking_number || ''} 
                            id={`tracking-${ord.id}`}
                            className="w-full bg-black border border-white/10 rounded px-2 py-1 text-[10px] text-white"
                          />
                        </td>
                        <td className="p-4 text-right space-y-1">
                          <div className="flex justify-end gap-1 flex-wrap">
                            <button onClick={() => handleUpdateOrderStatus(ord.id, 'approved')} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-[10px] cursor-pointer">Onayla</button>
                            <button onClick={() => {
                              const tracking = (document.getElementById(`tracking-${ord.id}`) as HTMLInputElement).value
                              handleUpdateOrderStatus(ord.id, 'shipped', tracking)
                            }} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-[10px] cursor-pointer">Kargola</button>
                            <button onClick={() => handleRefundOrder(ord.id)} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-[10px] cursor-pointer">İptal/İade</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* YENİ ETKİNLİK OLUŞTURMA */}
        {isSuperAdmin && (
          <div className="rounded-3xl border border-primary/30 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6">
            <h2 className="text-base font-bold flex items-center gap-2 text-primary"><Calendar className="h-5 w-5" /><span>Yeni Topluluk Etkinliği Oluştur</span></h2>
            <form onSubmit={handleAddEvent} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <input type="text" placeholder="Etkinlik Adı" required value={evtTitle} onChange={(e) => setEvtTitle(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              <input type="text" placeholder="Eğitmen İsmi" value={instructorName} onChange={(e) => setInstructorName(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              <select value={evtBranch} onChange={(e) => setEvtBranch(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white">
                <option value="KOŞU">KOŞU</option>
                <option value="YOGA & MOBILITY">YOGA & MOBILITY</option>
                <option value="TENİS">TENİS</option>
                <option value="VOLEYBOL">VOLEYBOL</option>
                <option value="YELKEN">YELKEN</option>
              </select>
              <input type="text" placeholder="Konum / Google Maps Linki" value={evtLocation} onChange={(e) => setEvtLocation(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              <input type="datetime-local" required value={evtDate} onChange={(e) => setEvtDate(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              
              <div className="relative flex items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-3 cursor-pointer hover:border-primary">
                <span className="text-xs text-zinc-400 truncate pointer-events-none">{uploading ? 'Yükleniyor...' : evtImage ? '✓ Afiş Yüklendi' : 'Etkinlik Afişi Seç'}</span>
                <Upload className="h-4 w-4 text-primary flex-none pointer-events-none" />
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'event')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              </div>
              <textarea rows={1} placeholder="Açıklama" value={evtDesc} onChange={(e) => setEvtDesc(e.target.value)} className="sm:col-span-2 lg:col-span-2 rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              <button type="submit" className="sm:col-span-2 lg:col-span-3 rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-lg cursor-pointer">Etkinliği Yayınla</button>
            </form>
          </div>
        )}

        {/* ÜRÜN EKLEME (ÇOKLU FOTOĞRAF DESTEKLİ) */}
        {isSuperAdmin && (
          <div className="rounded-3xl border border-primary/30 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6">
            <h2 className="text-base font-bold flex items-center gap-2 text-primary"><PlusCircle className="h-5 w-5" /><span>Mağazaya Yeni Ürün / Drop Ekle (Çoklu Fotoğraf)</span></h2>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <input type="text" placeholder="Ürün Başlığı" required value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              <input type="text" placeholder="Alt Başlık" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              <input type="number" placeholder="Fiyat (₺)" required value={price} onChange={(e) => setPrice(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              <input type="number" placeholder="Stok Adedi" required value={stock} onChange={(e) => setStock(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              
              {/* Çoklu Fotoğraf Seçim Alanı */}
              <div className="relative flex items-center justify-between rounded-xl border border-white/10 bg-black px-4 py-3 cursor-pointer hover:border-primary">
                <span className="text-xs text-zinc-400 truncate pointer-events-none">
                  {uploading ? 'Yükleniyor...' : imageList.length > 0 ? `✓ ${imageList.length} Fotoğraf Yüklendi` : 'Birden Fazla Fotoğraf Seç'}
                </span>
                <Upload className="h-4 w-4 text-primary flex-none pointer-events-none" />
                <input type="file" accept="image/*" multiple onChange={(e) => handleMultipleImageUpload(e, 'new')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
              </div>

              <textarea rows={1} placeholder="Açıklama" value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              <button type="submit" className="sm:col-span-2 lg:col-span-3 rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-lg cursor-pointer">Ürünü Mağazada Yayınla</button>
            </form>

            {/* Yüklenen Fotoğrafların Önizlemesi */}
            {imageList.length > 0 && (
              <div className="flex items-center gap-3 pt-2 overflow-x-auto">
                {imageList.map((url, idx) => (
                  <div key={idx} className="relative h-16 w-16 rounded-xl overflow-hidden border border-primary flex-none">
                    <Image src={url} alt="Önizleme" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {isSuperAdmin && (
            <div className="space-y-4">
              <h2 className="text-base font-bold flex items-center gap-2"><Layers className="h-4 w-4 text-primary" /><span>Yüklü Ürünler ({products.length})</span></h2>
              <div className="space-y-3">
                {products.map((prod) => (
                  <div key={prod.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950 p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 flex-none"><Image src={prod.image_urls?.[0] || prod.image_url || '/placeholder.svg'} alt={prod.title} fill className="object-cover" /></div>
                      <div>
                        <h4 className="font-bold text-xs text-white">{prod.title}</h4>
                        <div className="text-[10px] text-zinc-400">₺{prod.price} · Stok: {prod.stock} · {prod.image_urls?.length || 1} Fotoğraf</div>
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
          )}

          <div className="space-y-4 lg:col-span-2">
            <h2 className="text-base font-bold flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /><span>Aktif Etkinlikler ({filteredEvents.length})</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredEvents.map((evt) => (
                <div key={evt.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950 p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 flex-none"><Image src={evt.image_url || '/placeholder.svg'} alt={evt.title} fill className="object-cover" /></div>
                    <div>
                      <span className="text-[10px] font-mono text-primary uppercase">{evt.branch} {evt.instructor_name ? `• ${evt.instructor_name}` : ''}</span>
                      <h4 className="font-bold text-xs text-white">{evt.title}</h4>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditEventModal(evt)} className="p-2 bg-zinc-800 rounded-xl text-zinc-200 hover:bg-zinc-700 cursor-pointer"><Edit3 size={14} /></button>
                    {isSuperAdmin && <button onClick={() => handleDeleteEvent(evt.id)} className="p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 cursor-pointer"><Trash2 size={14} /></button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KAYITLI SİSTEM ÜYELERİ & YETKİ YÖNETİMİ */}
        {isSuperAdmin && (
          <div className="space-y-6">
            <h2 className="text-base font-bold flex items-center gap-2"><Users className="h-4 w-4 text-primary" /><span>Kayıtlı Sistem Üyeleri & Yetki Yönetimi ({profiles.length})</span></h2>
            <div className="rounded-3xl border border-white/10 bg-zinc-950 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="border-b border-white/10 bg-black/60 text-zinc-500 uppercase">
                    <tr><th className="p-4">Ad Soyad / E-posta</th><th className="p-4">Rolü</th><th className="p-4">Branşı</th><th className="p-4">Yetkiyi Güncelle</th><th className="p-4 text-right">İşlem</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-zinc-300">
                    {profiles.map((prof) => (
                      <tr key={prof.id} className="hover:bg-zinc-900/40">
                        <td className="p-4">
                          <div className="font-bold text-white">{prof.full_name || 'İsimsiz Üye'}</div>
                          <div className="text-[10px] text-zinc-500">{prof.email}</div>
                        </td>
                        <td className="p-4"><span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${prof.role === 'admin' ? 'bg-primary/20 text-primary' : prof.role === 'captain' ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-800 text-zinc-400'}`}>{prof.role || 'member'}</span></td>
                        <td className="p-4 text-primary font-bold">{prof.branch || 'ALL'}</td>
                        <td className="p-4">
                          <div className="flex gap-2 items-center">
                            <select defaultValue={prof.role || 'member'} id={`role-${prof.id}`} className="bg-black border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white">
                              <option value="member">Üye</option>
                              <option value="captain">Kaptan</option>
                              <option value="admin">Admin</option>
                            </select>
                            <select defaultValue={prof.branch || 'ALL'} id={`branch-${prof.id}`} className="bg-black border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white">
                              <option value="ALL">ALL (Tümü)</option>
                              <option value="KOŞU">KOŞU</option>
                              <option value="YOGA & MOBILITY">YOGA & MOBILITY</option>
                              <option value="TENİS">TENİS</option>
                              <option value="VOLEYBOL">VOLEYBOL</option>
                              <option value="YELKEN">YELKEN</option>
                            </select>
                            <button onClick={async () => {
                              const newRole = (document.getElementById(`role-${prof.id}`) as HTMLSelectElement).value
                              const newBranch = (document.getElementById(`branch-${prof.id}`) as HTMLSelectElement).value
                              const { error } = await supabase.from('profiles').update({ role: newRole, branch: newBranch }).eq('id', prof.id)
                              if (!error) { alert('Yetkiler güncellendi!'); fetchData() }
                            }} className="px-3 py-1.5 bg-primary text-black rounded-lg text-[11px] font-bold cursor-pointer">Kaydet</button>
                          </div>
                        </td>
                        <td className="p-4 text-right"><button onClick={() => handleDeleteProfile(prof.id)} className="p-2 text-zinc-500 hover:text-red-400 rounded-xl"><Trash2 className="h-4 w-4" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ETKİNLİK BAŞVURULARI */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2"><Users className="h-4 w-4 text-primary" /><span>Etkinlik Katılımcıları & Başvurular ({filteredRegistrations.length})</span></h2>
            <button onClick={exportToCSV} className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/20 cursor-pointer"><Download className="h-3.5 w-3.5" /> Excel'e Aktar</button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-950 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-white/10 bg-black/60 text-zinc-500 uppercase">
                  <tr><th className="p-4">Katılımcı</th><th className="p-4">İletişim</th><th className="p-4">Etkinlik</th><th className="p-4">Durum</th><th className="p-4 text-right">İşlemler</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-zinc-900/40">
                      <td className="p-4 font-bold text-white">{reg.full_name}</td>
                      <td className="p-4">{reg.phone} / {reg.email}</td>
                      <td className="p-4 text-primary">{reg.events?.title || 'Etkinlik'}</td>
                      <td className="p-4"><span className="px-2 py-0.5 rounded text-[10px] uppercase bg-zinc-800 text-zinc-300">{reg.status}</span></td>
                      <td className="p-4 text-right space-x-1">
                        {reg.status !== 'approved' && <button onClick={() => handleUpdateRegistrationStatus(reg.id, 'approved')} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-[10px]">Onayla</button>}
                        <button onClick={() => handleDeleteRegistration(reg.id)} className="p-1 text-zinc-500 hover:text-red-400"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* DÜZENLEME MODALLARI */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/20 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-bold text-base text-white">Etkinliği Düzenle</h3>
              <button onClick={() => setEditingEvent(null)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleUpdateEvent} className="space-y-4">
              <input type="text" required value={editEvtTitle} onChange={(e) => setEditEvtTitle(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              <input type="datetime-local" required value={editEvtDate} onChange={(e) => setEditEvtDate(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              <button type="submit" className="w-full rounded-full bg-primary py-3 text-xs font-bold uppercase text-black">Kaydet</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
