'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ShoppingBag, Phone, Truck, RotateCcw, PackageCheck, CreditCard, MapPin, User, Save, Upload, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null)
  const [myRegistrations, setMyRegistrations] = useState<any[]>([])
  const [myOrders, setMyOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [refundReason, setRefundReason] = useState<{ [key: string]: string }>({})
  
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
      if (!session?.user?.email) return

      const email = session.user.email
      
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle()
      
      if (prof) {
        setUserData(prof)
        setFullName(prof.full_name || '')
        setPhone(prof.phone || '')
        setTcNo(prof.tc_no || '')
        setAddress(prof.address || '')
        setAvatarUrl(prof.avatar_url || '')
      } else {
        const defaultProfile = { email, full_name: session.user.user_metadata?.full_name || 'Kulüp Üyesi' }
        setUserData(defaultProfile)
        setFullName(defaultProfile.full_name)
      }

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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      setUploadingAvatar(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      const fileName = `avatar-${session.user.id}-${Date.now()}.${file.name.split('.').pop()}`
      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file)
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
      if (data?.publicUrl) {
        await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', session.user.id)
        setAvatarUrl(data.publicUrl)
        alert('Profil fotoğrafınız güncellendi!')
        loadUserProfileAndData()
      }
    } catch (err: any) {
      alert('Fotoğraf yüklenemedi: ' + err.message)
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleRemoveAvatar = async () => {
    if (!confirm('Profil fotoğrafınızı kaldırmak istiyor musunuz?')) return
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      await supabase.from('profiles').update({ avatar_url: null }).eq('id', session.user.id)
      setAvatarUrl('')
      alert('Profil fotoğrafı kaldırıldı.')
      loadUserProfileAndData()
    } catch (err: any) {
      alert('Hata: ' + err.message)
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
      alert('Profil bilgileriniz başarıyla güncellendi!')
      loadUserProfileAndData()
    } catch (err: any) {
      alert('Güncelleme hatası: ' + err.message)
    } finally {
      setSaving(false)
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
          <span className="text-xs font-mono text-primary uppercase">ORISE CLUB KULLANICI PROFİLİ</span>
        </div>

        {/* KULLANICI BİLGİLERİ VE AVATAR YÖNETİMİ */}
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-primary/50 bg-zinc-900 flex items-center justify-center text-xl font-black shrink-0">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                ) : (
                  <span className="text-primary">{userData?.full_name?.[0]?.toUpperCase() || 'O'}</span>
                )}
              </div>
              <div className="space-y-1">
                <h1 className="text-xl font-black text-white">{userData?.full_name || 'Kulüp Üyesi'}</h1>
                <p className="text-xs font-mono text-zinc-400">{userData?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 border border-white/15 px-4 py-2 text-xs font-bold text-zinc-200 hover:border-primary cursor-pointer transition-all">
                <Upload className="h-3.5 w-3.5 text-primary" />
                <span>{uploadingAvatar ? 'Yükleniyor...' : 'Fotoğraf Değiştir'}</span>
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
              {avatarUrl && (
                <button type="button" onClick={handleRemoveAvatar} className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 cursor-pointer" title="Fotoğrafı Kaldır">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-primary">Fatura & Teslimat Bilgileri (İyzico Uyumlu)</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Ad Soyad</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white focus:border-primary focus:outline-none pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Telefon Numarası</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white focus:border-primary focus:outline-none pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">TC Kimlik No (Fatura İçin)</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    maxLength={11}
                    value={tcNo}
                    onChange={(e) => setTcNo(e.target.value)}
                    placeholder="11 Haneli TCKN"
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white focus:border-primary focus:outline-none pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Teslimat Adresi</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Mahalle, Cadde, No, İlçe/İl"
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white focus:border-primary focus:outline-none pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-black hover:scale-105 transition-transform cursor-pointer disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Kaydediliyor...' : 'Bilgileri Güncelle'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* MAĞAZA SİPARİŞLERİ */}
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
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {ord.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {ord.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-xs text-zinc-300 font-mono">
                        <span>• {item.name} (x{item.quantity})</span>
                        <span className="text-primary font-bold">₺{item.price * item.quantity}</span>
                      </div>
                    ))}
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
