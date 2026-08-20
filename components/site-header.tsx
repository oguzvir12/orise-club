'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ShoppingBag, User, LogOut, Settings, X, AtSign, Calendar, Ticket } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
import { useCart } from '@/components/cart/cart-provider'
import { supabase } from '@/lib/supabase'
import AuthModal from './auth-modal'

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
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  
  const [myEvents, setMyEvents] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'profile' | 'events'>('profile')

  const fetchProfile = async (userId: string, userEmail?: string) => {
    try {
      let foundData = null
      const { data: p1 } = await supabase.from('profiler').select('*').eq('id', userId).maybeSingle()
      if (p1) {
        foundData = p1
      } else {
        const { data: p2 } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
        if (p2) foundData = p2
      }

      if (!foundData && userEmail) {
        const { data: p3 } = await supabase.from('profiles').select('*').ilike('email', userEmail.trim()).maybeSingle()
        if (p3) foundData = p3
      }

      if (foundData) {
        setFullName(foundData.full_name || '')
        setPhone(foundData.phone || '')
        setInstagram(foundData.instagram || '')
        setAddress(foundData.adres || foundData.address || '')
        setBillingAddress(foundData.billing_address || '')
      }

      if (userEmail) {
        const { data: regData } = await supabase
          .from('event_registrations')
          .select('*, events(*)')
          .ilike('email', userEmail.trim())
        
        if (regData) {
          setMyEvents(regData)
        }
      }
    } catch (err) {
      console.error(err)
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
        setFullName('')
        setPhone('')
        setInstagram('')
        setAddress('')
        setBillingAddress('')
        setMyEvents([])
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setFullName('')
    setPhone('')
    setInstagram('')
    setAddress('')
    setBillingAddress('')
    setMyEvents([])
    window.location.reload()
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setSuccessMsg('')

    try {
      const payload = { 
        id: user.id,
        email: user.email,
        full_name: fullName, 
        phone: phone, 
        instagram: instagram,
        adres: address,
        address: address,
        billing_address: billingAddress 
      }

      await supabase.from('profiler').upsert(payload, { onConflict: 'id' })
      await supabase.from('profiles').upsert(payload, { onConflict: 'id' })

      setSuccessMsg('Profil ve etkinlik bilgileriniz kalıcı olarak kaydedildi!')
      setTimeout(() => { 
        setSuccessMsg('')
        window.location.reload()
      }, 1000)
    } catch (err: any) {
      alert('Hata: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-border bg-background/80 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
          <Link href="/" aria-label="ORISE CLUB Ana Sayfa">
            <Logo />
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openCart}
              aria-label="Sepeti aç"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-secondary/50 text-foreground backdrop-blur-md transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:text-primary cursor-pointer"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-xs font-mono text-zinc-300 backdrop-blur-md hover:border-primary hover:text-white transition-all cursor-pointer"
                >
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span className="truncate max-w-[120px]">{fullName || user.email}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center h-10 w-10 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                  title="Çıkış Yap"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary backdrop-blur-md hover:bg-primary/20 hover:border-primary transition-all duration-300 cursor-pointer"
              >
                <User className="h-3.5 w-3.5" />
                <span>Giriş Yap / Kayıt Ol</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {isProfileOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto"
          onClick={() => setIsProfileOpen(false)}
        >
          <div
            className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6 text-white my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Kulüp Profili & Etkinliklerim</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary hover:text-black transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex gap-2 border-b border-white/10 pb-3">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'profile' ? 'bg-primary text-black' : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                Profil Bilgileri
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'events' ? 'bg-primary text-black' : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                Katıldığım Etkinlikler ({myEvents.length})
              </button>
            </div>

            {activeTab === 'profile' ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <p className="text-[11px] text-zinc-400">
                  Buraya girdiğiniz bilgiler; etkinliklere katılırken ve mağazadan alışveriş yaparken otomatik olarak kullanılacaktır.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Ad Soyad</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ad Soyad"
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Telefon Numarası</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05XX XXX XX XX"
                      className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1 flex items-center gap-1.5">
                    <AtSign className="h-3.5 w-3.5 text-primary" /> Instagram Kullanıcı Adı
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="@kullaniciadi"
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Teslimat / Etkinlik Adresi</label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Sokak, bina no, daire, ilçe/şehir..."
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Fatura Adresi / Kurumsal Bilgiler (Opsiyonel)</label>
                  <textarea
                    rows={2}
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    placeholder="Fatura unvanı, vergi no veya adres..."
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white focus:border-primary focus:outline-none"
                  />
                </div>

                {successMsg && (
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400 text-center font-mono">
                    {successMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
              </form>
            ) : (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {myEvents.length === 0 ? (
                  <div className="py-12 text-center text-zinc-500 text-xs font-mono">
                    Henüz katıldığınız bir etkinlik bulunmuyor.
                  </div>
                ) : (
                  myEvents.map((item) => {
                    const evt = item.events
                    if (!evt) return null
                    return (
                      <div key={item.id} className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase text-primary tracking-widest bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                            {evt.branch || 'KULÜP'}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase">
                            Kayıt Onaylandı
                          </span>
                        </div>
                        <h4 className="font-sans font-bold text-sm text-white">{evt.title}</h4>
                        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 pt-1">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                            <span>{new Date(evt.date).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={async () => {
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            setUser(session.user)
            await fetchProfile(session.user.id, session.user.email)
            window.location.reload()
          }
        }}
      />
    </>
  )
}
