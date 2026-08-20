'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft, RefreshCw, LogOut, ShoppingBag, PlusCircle, Layers, Edit3, Trash2, Calendar, Users, Filter, Truck, CheckCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

// Admin rollerin detaylı tanımı
const ADMIN_USERS: Record<string, { pass: string; branch: string; title: string; type: 'community' | 'store' | 'super' | 'community_director' }> = {
  orise_master_admin: { pass: 'Orise#2026_SecureKey!99', branch: 'ALL', title: 'Süper Admin (Tüm Yetkiler)', type: 'super' },
  community_director: { pass: 'Director#Community_2026!', branch: 'ALL', title: 'Genel Topluluk Yöneticisi', type: 'community_director' },
  store_manager_tr: { pass: 'Store#Shipping_7721*', branch: 'STORE', title: 'Mağaza & Kargo Yöneticisi', type: 'store' },
}

export default function SuperAdminPanel() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [data, setData] = useState({ products: [], events: [], orders: [], registrations: [] })
  const [filter, setFilter] = useState('') // Filtreleme metni

  useEffect(() => {
    const saved = localStorage.getItem('orise_admin_user')
    if (saved && ADMIN_USERS[saved]) {
      setIsLoggedIn(true); setCurrentUser(ADMIN_USERS[saved]); fetchData()
    }
  }, [])

  const fetchData = async () => {
    const [p, e, o, r] = await Promise.all([
      supabase.from('products').select('*'),
      supabase.from('events').select('*'),
      supabase.from('orders').select('*'),
      supabase.from('event_registrations').select('*')
    ])
    setData({ products: p.data || [], events: e.data || [], orders: o.data || [], registrations: r.data || [] })
  }

  // Filtrelenmiş Veriler
  const filteredOrders = data.orders.filter(o => o.customer_name?.toLowerCase().includes(filter.toLowerCase()))
  const filteredRegs = data.registrations.filter(r => r.full_name?.toLowerCase().includes(filter.toLowerCase()))

  if (!isLoggedIn) return <div>Giriş Yapılmadı...</div>

  return (
    <div className="fixed inset-0 z-50 bg-black text-white p-10 overflow-y-auto">
      {/* HEADER */}
      <header className="flex justify-between border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="text-2xl font-black">ORISE YÖNETİM MERKEZİ</h1>
          <p className="text-primary text-xs">{currentUser?.title}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full text-xs font-bold hover:bg-zinc-800"><RefreshCw size={14}/> Yenile</button>
          <button onClick={() => {localStorage.clear(); window.location.reload()}} className="px-4 py-2 bg-red-900/20 text-red-500 rounded-full text-xs font-bold"><LogOut size={14}/></button>
        </div>
      </header>

      {/* ARAMA VE FİLTRE */}
      <div className="mb-8">
        <input 
          placeholder="İsim veya sipariş ara..." 
          className="w-full bg-zinc-900 p-4 rounded-xl border border-white/10 text-xs"
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* MAĞAZA VE ETKİNLİK YÖNETİMİ */}
        <section className="space-y-8">
          <div className="bg-zinc-950 p-6 rounded-3xl border border-primary/20">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary"><ShoppingBag /> Ürün & Stok Yönetimi</h2>
            <div className="space-y-2">
              {data.products.map(p => (
                <div key={p.id} className="flex justify-between bg-black p-3 rounded-xl border border-white/5 text-xs">
                  <span>{p.title} - <span className="text-zinc-500">{p.stock} adet</span></span>
                  <div className="flex gap-2">
                    <button onClick={() => alert('Düzenleme aktif!')} className="text-blue-400"><Edit3 size={14}/></button>
                    <button onClick={() => supabase.from('products').delete().eq('id', p.id).then(fetchData)} className="text-red-400"><Trash2 size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SİPARİŞLER VE KATILIMCILAR */}
        <section className="space-y-8">
          <div className="bg-zinc-950 p-6 rounded-3xl border border-white/10">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary"><Users /> Tüm Katılımcılar & Siparişler</h2>
            <div className="space-y-4">
              {filteredRegs.map(r => (
                <div key={r.id} className="bg-black p-4 rounded-xl border border-white/5 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold">{r.full_name}</p>
                    <p className="text-zinc-500">{r.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] ${r.status === 'confirmed' ? 'bg-green-900/20 text-green-500' : 'bg-amber-900/20 text-amber-500'}`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
