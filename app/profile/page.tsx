'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ShoppingBag, Phone, CreditCard, MapPin, User, Save, Upload, Trash2, Truck, RefreshCw, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null)
  const [myOrders, setMyOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [tcNo, setTcNo] = useState('')
  const [address, setAddress] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

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
      if (!session?.user) return

      const userId = session.user.id
      let { data: prof } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()

      if (prof) {
        setUserData(prof)
        setFullName(prof.full_name || '')
        setPhone(prof.phone || '')
        setTcNo(prof.tc_no || '')
        setAddress(prof.address || '')
        setAvatarUrl(prof.avatar_url || '')
      }

      const { data: ords } = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      if (ords) setMyOrders(ords)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleReturnRequest = async (orderId: string) => {
    if (!confirm('Bu sipariş için iade talebi başlatmak istiyor musunuz?')) return
    const { error } = await supabase.from('orders').update({ status: 'İade Talep Edildi' }).eq('id', orderId)
    if (!error) {
      alert('İade talebiniz başarıyla oluşturuldu.')
      loadUserProfileAndData()
    } else {
      alert('Hata: ' + error.message)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return

    setSaving(true)
    try {
      const { error } = await supabase.from('profiles').update({
        full_name: fullName,
        phone: phone,
        tc_no: tcNo,
        address: address,
      }).eq('id', session.user.id)

      if (error) throw error
      alert('Profil bilgileriniz güncellendi!')
      loadUserProfileAndData()
    } catch (err: any) {
      alert('Hata: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs">Yükleniyor...</div>

  return (
    <div className="min-h-screen bg-black text-white font-sans p-6 sm:p-12">
      <div className="max-w-5xl mx-auto space-y-12">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link href="/store" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-300 hover:text-white cursor-pointer">
            <ArrowLeft className="h-4 w-4" /> <span>Mağazaya Dön</span>
          </Link>
          <span className="text-xs font-mono text-primary uppercase">MÜŞTERİ HESAP & SİPARİŞ MERKEZİ</span>
        </div>

        {/* PROFİL BİLGİLERİ */}
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 sm:p-8 shadow-xl space-y-6">
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-primary">Kişisel & Fatura Bilgileri</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Ad Soyad (Zorunlu)</label>
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Telefon Numarası (05...)</label>
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">TC Kimlik No (Fatura İçin 11 Haneli)</label>
                <input type="text" maxLength={11} value={tcNo} onChange={(e) => setTcNo(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Teslimat Adresi</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button type="submit" disabled={saving} className="rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase text-black cursor-pointer">
                {saving ? 'Kaydediliyor...' : 'Bilgileri Güncelle'}
              </button>
            </div>
          </form>
        </div>

        {/* SİPARİŞ GEÇMİŞİ & FATURALAR & İADE */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" /> <span>Geçmiş & Aktif Siparişlerim</span>
            </h2>
            <span className="text-xs font-mono text-zinc-500">[{myOrders.length} SİPARİŞ]</span>
          </div>

          {myOrders.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-zinc-950 p-8 text-center text-xs text-zinc-400">
              Henüz bir siparişiniz bulunmuyor.
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map((ord) => (
                <div key={ord.id} className="rounded-2xl border border-white/10 bg-zinc-950 p-6 space-y-4 font-mono">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase">Sipariş ID: #{ord.id.slice(0, 8)}</span>
                      <div className="text-xs text-primary font-bold">{new Date(ord.created_at).toLocaleString('tr-TR')}</div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold bg-primary/20 text-primary border border-primary/30">
                      {ord.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {ord.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-zinc-300">
                        <span>• {item.name} (x{item.quantity})</span>
                        <span className="text-primary font-bold">₺{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Truck className="h-4 w-4 text-primary" />
                      <span>Kargo Takip No: <strong>{ord.tracking_number || 'Henüz kargolanmadı'}</strong></span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* E-Fatura Görüntüleme Butonu */}
                      <button
                        type="button"
                        onClick={() => alert('e-Arşiv Faturanız PDF olarak hazırlanıyor... Paraşüt / Logo entegrasyonu aktif olduğunda fatura direkt indirilecektir.')}
                        className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 px-4 py-1.5 text-[11px] text-zinc-200 hover:bg-zinc-700 cursor-pointer"
                      >
                        <FileText size={13} /> Faturayı Görüntüle (PDF)
                      </button>

                      {ord.status === 'Kargolandı' && (
                        <button
                          type="button"
                          onClick={() => handleReturnRequest(ord.id)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 border border-red-500/30 px-4 py-1.5 text-[11px] text-red-400 hover:bg-red-500/20 cursor-pointer"
                        >
                          <RefreshCw className="h-3 w-3" /> İade Talebi Oluştur
                        </button>
                      )}
                    </div>
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
