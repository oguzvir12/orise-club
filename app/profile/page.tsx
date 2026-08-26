'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, ShoppingBag, CheckCircle2, Clock, Mail, Phone, Truck, RotateCcw, PackageCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null)
  const [myRegistrations, setMyRegistrations] = useState<any[]>([])
  const [myOrders, setMyOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refundReason, setRefundReason] = useState<{ [key: string]: string }>({})
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/')
      } else {
        loadUserProfileAndData()
      }
    }
    checkAuth()
  }, [router])

  const loadUserProfileAndData = async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user?.email) return

      const email = session.user.email
      
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .ilike('email', email)
        .single()
      
      setUserData(prof || { email, full_name: session.user.user_metadata?.full_name || 'Kulüp Üyesi' })

      const { data: regs } = await supabase
        .from('event_registrations')
        .select('id, status, is_paid, created_at, events (id, title, date, location, price, branch, image_url)')
        .ilike('email', email.trim())
        .order('created_at', { ascending: false })

      if (regs) setMyRegistrations(regs)

      const { data: ords } = await supabase
        .from('orders')
        .select('*')
        .ilike('email', email.trim())
        .order('created_at', { ascending: false })

      if (ords) setMyOrders(ords)

    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Müşterinin "Paketi Teslim Aldım" Onayı
  const handleConfirmDelivery = async (orderId: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'delivered' })
      .eq('id', orderId)

    if (!error) {
      alert('Teslimat onaylandı! 7 günlük iade süreniz başladı.')
      loadUserProfileAndData()
    } else {
      alert('Hata: ' + error.message)
    }
  }

  // Müşterinin İade Talebi Oluşturması (Teslim Edildikten Sonra 7 Gün İçinde)
  const handleRequestRefund = async (orderId: string, deliveredAt: string) => {
    const reason = refundReason[orderId]
    if (!reason || reason.trim() === '') {
      alert('Lütfen iade talebi için bir sebep belirtin.')
      return
    }

    // 7 gün kontrolü
    if (deliveredAt) {
      const deliveryDate = new Date(deliveredAt)
      const now = new Date()
      const diffDays = (now.getTime() - deliveryDate.getTime()) / (1000 * 3600 * 24)
      if (diffDays > 7) {
        alert('Ürünün teslim tarihinden itibaren 7 günlük iade süresi dolmuştur.')
        return
      }
    }

    const { error } = await supabase
      .from('orders')
      .update({ status: 'refund_requested', refund_reason: reason })
      .eq('id', orderId)

    if (!error) {
      alert('İade talebiniz başarıyla oluşturuldu. En kısa sürede incelenecektir.')
      loadUserProfileAndData()
    } else {
      alert('Hata: ' + error.message)
    }
  }

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs">Yükleniyor...</div>

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-12">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            <span>Ana Sayfaya Dön</span>
          </Link>
          <span className="text-xs font-mono text-primary uppercase">ORISE KULLANICI PROFİLİ</span>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-primary/20 text-primary border border-primary/40 flex items-center justify-center text-2xl font-black">
            {userData?.full_name?.[0] || 'O'}
          </div>
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-2xl font-black text-white">{userData?.full_name || 'Kulüp Üyesi'}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-zinc-400 pt-1">
              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-primary" /> {userData?.email}</span>
              <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-primary" /> {userData?.phone || 'Telefon belirtilmemiş'}</span>
            </div>
          </div>
        </div>

        {/* MAĞAZA SİPARİŞLERİ VE TESLİMAT / İADE YÖNETİMİ */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <span>Mağaza Siparişlerim & Kargo Takibi</span>
            </h2>
            <span className="text-xs font-mono text-zinc-500">[{myOrders.length} SİPARİŞ]</span>
          </div>

          {myOrders.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-8 text-center text-xs text-zinc-400">
              Henüz bir mağaza siparişiniz bulunmuyor.
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map((ord) => (
                <div key={ord.id} className="rounded-2xl border border-white/10 bg-zinc-950 p-6 space-y-4 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">Sipariş ID: {ord.id.slice(0, 8)}...</span>
                      <div className="text-xs font-mono text-zinc-400">{new Date(ord.created_at).toLocaleDateString('tr-TR')}</div>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold ${
                        ord.status === 'shipped' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        ord.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        ord.status === 'approved' || ord.status === 'paid' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        ord.status === 'refund_requested' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        ord.status === 'refunded' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        'bg-zinc-800 text-zinc-400'
                      }`}>
                        {ord.status === 'shipped' ? 'Kargoda' :
                         ord.status === 'delivered' ? 'Teslim Edildi' :
                         ord.status === 'approved' || ord.status === 'paid' ? 'Hazırlanıyor' :
                         ord.status === 'refund_requested' ? 'İade Talebi İnceleniyor' :
                         ord.status === 'refunded' ? 'İade Edildi' : 'Ödeme Bekliyor'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {ord.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-xs text-zinc-300 font-mono">
                        <span>• {item.name} (x{item.quantity})</span>
                        <span className="text-primary font-bold">₺{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {ord.tracking_number && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-blue-500/10 border border-blue-500/20 p-3.5 text-xs font-mono text-blue-300">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 shrink-0 text-primary" />
                        <span>Kargo Takip No: <strong className="text-white">{ord.tracking_number}</strong></span>
                      </div>

                      {/* Kargodaysa Müşterinin "Teslim Aldım" Butonu */}
                      {ord.status === 'shipped' && (
                        <button
                          type="button"
                          onClick={() => handleConfirmDelivery(ord.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-black cursor-pointer hover:bg-orange-500 transition-colors"
                        >
                          <PackageCheck className="h-3.5 w-3.5" />
                          <span>Paketi Teslim Aldım</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* İade Talebi Alanı (Sadece Teslim Edildikten Sonra 7 Gün İçinde) */}
                  {ord.status === 'delivered' && (
                    <div className="pt-3 border-t border-white/5 space-y-2">
                      <span className="text-[10px] font-mono uppercase text-zinc-400 block">7 Günlük İade / Değişim Süresi İçerisindesiniz</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="İade sebebi (Örn: Beden uymadı)"
                          value={refundReason[ord.id] || ''}
                          onChange={(e) => setRefundReason({ ...refundReason, [ord.id]: e.target.value })}
                          className="flex-1 bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-primary focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRequestRefund(ord.id, ord.updated_at)}
                          className="flex items-center gap-1.5 rounded-xl bg-red-500/20 border border-red-500/30 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/30 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>İade Talep Et</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-white/5 text-xs font-mono">
                    <span className="text-zinc-400 uppercase">Teslimat: {ord.delivery_type === 'shipping' ? 'Kargo' : 'Elden Teslim'}</span>
                    <span className="text-sm font-black text-primary">Toplam: ₺{ord.total_price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
