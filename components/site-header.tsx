'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ShoppingBag, User, LogOut, Settings, X, AtSign, Calendar, Upload, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
import { useCart } from '@/components/cart/cart-provider'
import { supabase } from '@/lib/supabase'
import AuthModal from './auth-modal'
import Image from 'next/image'

export function SiteHeader() {
  const { count, openCart } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [instagram, setInstagram] = useState('')
  const [address, setAddress] = useState('')
  const [billingAddress, setBillingAddress] = useState('')
  const [title, setTitle] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  
  const [myEvents, setMyEvents] = useState<any[]>([])
  const [myOrders, setMyOrders] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'profile' | 'events' | 'orders'>('profile')

  const fetchProfile = async (userId: string, userEmail?: string) => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()

      if (data) {
        setFullName(data.full_name || '')
        setPhone(data.phone || '')
        setInstagram(data.instagram || '')
        setAddress(data.address || data.adres || '')
        setBillingAddress(data.billing_address || '')
        setTitle(data.title || '')
        setAvatarUrl(data.avatar_url || '')
      }

      if (userEmail) {
        const { data: regData } = await supabase.from('event_registrations').select('*, events(*)').ilike('email', userEmail.trim())
        if (regData) setMyEvents(regData)

        const { data: ordData } = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false })
        if (ordData) setMyOrders(ordData)
      }
    } catch (err) {
      console.error('Profil çekme hatası:', err)
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        await fetchProfile(session.user.id, session.user.email)
      }
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email)
      } else {
        setFullName(''); setPhone(''); setInstagram(''); setAddress(''); setBillingAddress(''); setTitle(''); setAvatarUrl(''); setMyEvents([]); setMyOrders([])
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.reload()
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file || !user) return

      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file)
      if (uploadError) { alert('Yükleme hatası: ' + uploadError.message); return }

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName)
      if (data?.publicUrl) {
        setAvatarUrl(data.publicUrl)
        alert('Profil fotoğrafı yüklendi! Kaydetmeyi unutmayın.')
      }
    } catch (err: any) {
      alert('Hata: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setSuccessMsg('')

    try {
      const payload = { 
        id: user.id, email: user.email, full_name: fullName, phone: phone, instagram: instagram, address: address, billing_address: billingAddress, title: title, avatar_url: avatarUrl
      }

      const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' })
      if (error) throw error

      setSuccessMsg('Profil bilgileriniz güncellendi!')
      setTimeout(() => { setSuccessMsg(''); window.location.reload() }, 1000)
    } catch (err: any) {
      alert('Kayıt Hatası: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <header className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-300', scrolled ? 'border-b border-border bg-background/80 backdrop-blur-xl' : 'border-b border-transparent bg-transparent')}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
          <Link href="/" aria-label="ORISE CLUB Ana Sayfa"><Logo /></Link>

          <div className="flex items-center gap-3">
            <button type="button" onClick={openCart} aria-label="Sepeti aç" className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-secondary/50 text-foreground backdrop-blur-md transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:text-primary cursor-pointer">
              <ShoppingBag className="h-[18px] w-[18px]" />
              {count > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">{count}</span>}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <button onClick={() => setIsProfileOpen(true)} className="flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-xs font-mono text-zinc-300 backdrop-blur-md hover:border-primary hover:text-white transition-all cursor-pointer">
                  {avatarUrl ? (
                    <div className="relative h-5 w-5 rounded-full overflow-hidden"><Image src={avatarUrl} alt="Avatar" fill className="object-cover" /></div>
                  ) : (
                    <User className="h-3.5 w-3.5 text-primary" />
                  )}
                  <span className="truncate max-w-[120px]">{fullName || user.email}</span>
                </button>
                <button onClick={handleLogout} className="flex items-center justify-center h-10 w-10 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer" title="Çıkış Yap">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => setIsAuthOpen(true)} className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary backdrop-blur-md hover:bg-primary/25 hover:border-primary transition-all duration-300 cursor-pointer">
                <User className="h-3.5 w-3.5" />
                <span>Giriş Yap / Kayıt Ol</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {isProfileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto" onClick={() => setIsProfileOpen(false)}>
          <div className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6 text-white my-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Kulüp Profili & Takip</h3>
              </div>
              <button type="button" onClick={() => setIsProfileOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary hover:text-black transition-colors cursor-pointer"><X className="h-4 w-4" /></button>
            </div>

            <div className="flex gap-2 border-b border-white/10 pb-3 overflow-x-auto">
              <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${activeTab === 'profile' ? 'bg-primary text-black' : 'bg-white/5 text-zinc-400 hover:text-white'}`}>Profil</button>
              <button onClick={() => setActiveTab('events')} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${activeTab === 'events' ? 'bg-primary text-black' : 'bg-white/5 text-zinc-400 hover:text-white'}`}>Etkinliklerim ({myEvents.length})</button>
              <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${activeTab === 'orders' ? 'bg-primary text-black' : 'bg-white/5 text-zinc-400 hover:text-white'}`}>Siparişlerim ({myOrders.length})</button>
            </div>

            {activeTab === 'profile' ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="flex items-center gap-4 py-2">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden border border-white/20 bg-zinc-900 flex-shrink-0">
                    <Image src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'} alt="Avatar" fill className="object-cover" />
                  </div>
                  <div>
                    <label className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold text-white hover:bg-white/10 cursor-pointer">
                      <Upload className="h-3.5 w-3.5 text-primary" />
                      <span>{uploading ? 'Yükleniyor...' : 'Fotoğraf Seç'}</span>
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Ad Soyad</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Ünvan / Rol</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Telefon</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Instagram</label>
                    <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Teslimat Adresi</label>
                  <textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                </div>

                {successMsg && <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400 text-center font-mono">{successMsg}</div>}

                <button type="submit" disabled={loading} className="w-full rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-lg cursor-pointer">Değişiklikleri Kaydet</button>
              </form>
            ) : activeTab === 'events' ? (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {myEvents.length === 0 ? (
                  <div className="py-12 text-center text-zinc-500 text-xs font-mono">Katıldığınız etkinlik bulunmuyor.</div>
                ) : (
                  myEvents.map((item) => {
                    const evt = item.events
                    if (!evt) return null
                    const isApproved = item.status === 'approved'
                    return (
                      <div key={item.id} className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-primary bg-primary/10 px-2.5 py-1 rounded-full">{evt.branch}</span>
                          <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase ${isApproved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>{isApproved ? 'Onaylandı' : 'Onay Bekliyor'}</span>
                        </div>
                        <h4 className="font-bold text-sm text-white">{evt.title}</h4>
                        {isApproved && <a href="https://chat.whatsapp.com/G0tIj76Ky7BCsVUaa1laFg" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline text-[11px] block">WhatsApp Grubuna Katıl →</a>}
                      </div>
                    )
                  })
                )}
              </div>
            ) : (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {myOrders.length === 0 ? (
                  <div className="py-12 text-center text-zinc-500 text-xs font-mono">Henüz mağazadan siparişiniz yok.</div>
                ) : (
                  myOrders.map((ord) => (
                    <div key={ord.id} className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-primary bg-primary/10 px-2.5 py-1 rounded-full">₺{ord.total_price}</span>
                        <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{ord.status}</span>
                      </div>
                      <div className="space-y-1">
                        {ord.items?.map((i: any, idx: number) => (
                          <div key={idx} className="text-xs text-white">• {i.name} (x{i.quantity})</div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono text-zinc-400">
                        <span>Teslimat: {ord.delivery_type === 'shipping' ? 'Kargo' : 'Elden Teslim'}</span>
                        {ord.tracking_number && <span className="text-primary font-bold">Kargo Takip: {ord.tracking_number}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={() => window.location.reload()} />
    </>
  )
}
