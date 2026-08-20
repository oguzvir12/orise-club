'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Users,
  Trash2,
  Phone,
  Mail,
  ShieldCheck,
  RefreshCw,
  Lock,
  LogOut,
  ShoppingBag,
  Package,
  Truck,
  PlusCircle,
  Plus,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

// Güçlendirilmiş Yönetici Hesapları
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

const EVENT_BRANCH_MAP: Record<string, string> = {
  'evt-cadde-run-01': 'KOŞU',
  'evt-moda-yoga-01': 'YOGA & MOBILITY',
  'evt-kalamis-tennis-01': 'TENİS',
  'evt-voleybol-01': 'VOLEYBOL',
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
  const [loading, setLoading] = useState(false)

  // Yeni Ürün Ekleme State'leri
  const [newTitle, setNewTitle] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newStock, setNewStock] = useState('')
  const [newImage, setNewImage] = useState('')

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
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRegistration = async (id: string) => {
    if (!confirm('Bu katılımcı kaydını silmek istediğinize emin misiniz?')) return
    await supabase.from('event_registrations').delete().eq('id', id)
    setRegistrations((prev) => prev.filter((r) => r.id !== id))
  }

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    setOrders((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord)))
  }

  // SÜPER ADMIN ÜRÜN EKLEME
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle || !newPrice) return

    const { error } = await supabase.from('products').insert([{
      title: newTitle,
      price: Number(newPrice),
      stock: Number(newStock) || 50,
      image_urls: newImage ? [newImage] : ['https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop'],
      category: 'tank',
      category_label: 'ÖZEL DROP'
    }])

    if (!error) {
      alert('Ürün başarıyla mağazaya eklendi!')
      setNewTitle('')
      setNewPrice('')
      setNewStock('')
      setNewImage('')
      fetchData()
    } else {
      alert('Ürün eklenirken hata oluştu.')
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Bu ürünü mağazadan silmek istediğinize emin misiniz?')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-sans">
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
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="orise_master_admin..."
                className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white placeholder-zinc-600 focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Şifre</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-xs text-white placeholder-zinc-600 focus:border-primary focus:outline-none"
              />
            </div>

            {loginError && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400 text-center">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_20px_rgba(249,115,22,0.35)] hover:scale-[1.02] transition-transform"
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

  const filteredRegistrations = registrations.filter((reg) => {
    if (currentUser?.type === 'super' || currentUser?.type === 'community_director' || currentUser?.branch === 'ALL') return true
    const eventBranch = EVENT_BRANCH_MAP[reg.event_id] || ''
    return eventBranch === currentUser?.branch
  })

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-10 font-sans">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white">ORISE Kontrol Paneli</h1>
            <p className="text-xs font-mono text-primary uppercase">
              {currentUser?.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchData}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-300 hover:border-primary hover:text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Yenile</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Çıkış</span>
          </button>
        </div>
      </div>

      {/* SÜPER ADMIN VEYA MAĞAZA YÖNETİCİSİ İÇİN ÜRÜN EKLEME & SİPARİŞ YÖNETİMİ */}
      {(currentUser?.type === 'store' || currentUser?.type === 'super') && (
        <div className="mx-auto max-w-7xl space-y-8 mb-16">
          {/* Yeni Ürün Ekleme Formu (Sadece Süper Admin) */}
          {currentUser?.type === 'super' && (
            <div className="rounded-3xl border border-primary/30 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-4">
              <h2 className="text-base font-bold flex items-center gap-2 text-primary">
                <PlusCircle className="h-5 w-5" />
                <span>Mağazaya Yeni Drop Ürünü Ekle</span>
              </h2>
              <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Ürün Adı (Örn: Pro Hoodie)"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-primary focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Fiyat (₺)"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-primary focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Stok Adedi"
                  required
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-primary focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Fotoğraf URL (Opsiyonel)"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-primary focus:outline-none"
                />
                <button
                  type="submit"
                  className="sm:col-span-4 rounded-full bg-primary py-3 text-xs font-bold uppercase tracking-wider text-black shadow-lg hover:scale-[1.01] transition-transform"
                >
                  Ürünü Mağazada Yayınla
                </button>
              </form>
            </div>
          )}

          {/* Siparişler Listesi */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-primary" />
              <span>Mağaza Siparişleri & Kargo Yönetimi ({orders.length})</span>
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-950 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-white/10 bg-black/60 text-zinc-500 uppercase">
                  <tr>
                    <th className="p-4">Sipariş Kod</th>
                    <th className="p-4">Müşteri</th>
                    <th className="p-4">Adres</th>
                    <th className="p-4">Tutar</th>
                    <th className="p-4">Durum</th>
                    <th className="p-4 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  {orders.length > 0 ? (
                    orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="p-4 font-bold text-primary">{ord.order_code}</td>
                        <td className="p-4">
                          <div className="font-bold text-white">{ord.customer_name}</div>
                          <div className="text-[11px] text-zinc-400">{ord.customer_phone}</div>
                        </td>
                        <td className="p-4 text-zinc-400 max-w-xs truncate">{ord.shipping_address}</td>
                        <td className="p-4 font-bold text-white">{ord.total_amount} ₺</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] uppercase font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            <Truck className="h-3 w-3" />
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateOrderStatus(ord.id, 'Kargolandı')}
                            className="rounded-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 text-[10px] font-bold uppercase"
                          >
                            Kargola
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateOrderStatus(ord.id, 'Teslim Edildi')}
                            className="rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 text-[10px] font-bold uppercase"
                          >
                            Teslim
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-zinc-500">Henüz sipariş yok.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TOPLULUK YÖNETİCİSİ VEYA BRANŞ KAPTANLARI ETKİNLİKLERİ GÖRÜR */}
      {(currentUser?.type === 'community' || currentUser?.type === 'community_director' || currentUser?.type === 'super') && (
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>Etkinlik Katılımcıları ({filteredRegistrations.length})</span>
            </h2>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-950 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-white/10 bg-black/60 text-zinc-500 uppercase">
                  <tr>
                    <th className="p-4">Katılımcı</th>
                    <th className="p-4">İletişim</th>
                    <th className="p-4">Branş</th>
                    <th className="p-4 text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  {filteredRegistrations.length > 0 ? (
                    filteredRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="p-4 font-bold text-white flex items-center gap-2">
                          <span>{reg.full_name}</span>
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                        </td>
                        <td className="p-4 space-y-0.5">
                          <div>{reg.phone}</div>
                          <div className="text-zinc-500">{reg.email}</div>
                        </td>
                        <td className="p-4 text-primary font-bold">
                          {EVENT_BRANCH_MAP[reg.event_id] || reg.event_id}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteRegistration(reg.id)}
                            className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-zinc-500">Bu branşta kayıt bulunmuyor.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
