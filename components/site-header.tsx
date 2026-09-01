'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ShoppingBag, User, LogOut, Settings, X, Upload, MessageCircle, Send, Loader2, Calendar, Sparkles, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
import { useCart } from '@/components/cart/cart-provider'
import { supabase } from '@/lib/supabase'
import AuthModal from './auth-modal'
import Image from 'next/image'

function AiChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [msg, setMsg] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!msg.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      })
      const data = await res.json()
      setResponse(data.response)
    } catch (e) {
      setResponse("Bir hata oluştu ama en kısa sürede döneceğiz!")
    } finally {
      setLoading(false)
      setMsg('')
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="fixed bottom-6 left-6 z-[90] h-14 w-14 rounded-full bg-primary text-black shadow-2xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
        aria-label="Destek Asistanı"
      >
        {isOpen ? <X /> : <MessageCircle />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-6 z-[90] w-80 h-96 bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl p-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
            <span className="text-xs font-bold text-primary uppercase">ORISE STORE DESTEK 🤖</span>
            <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white text-xs cursor-pointer">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto text-xs text-white space-y-2 p-2">
            {!response && <p className="text-zinc-500">Selam! Siparişlerin veya koleksiyon hakkında nasıl yardımcı olabilirim?</p>}
            {response && <p className="bg-zinc-900 p-3 rounded-xl leading-relaxed">{response}</p>}
          </div>
          <div className="flex gap-2 pt-2 border-t border-white/5">
            <input 
              value={msg} 
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 bg-black rounded-full px-3 py-2 text-xs text-white focus:outline-none border border-white/10" 
              placeholder="Mesaj yazın..." 
            />
            <button onClick={sendMessage} className="bg-primary p-2.5 rounded-full text-black hover:opacity-90 cursor-pointer">
              {loading ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export function SiteHeader() {
  const { count, openCart } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isCommunityDropdownOpen, setIsCommunityDropdownOpen] = useState(false)
  
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
  
  const [myOrders, setMyOrders] = useState<any[]>([])

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
        setFullName(''); setPhone(''); setInstagram(''); setAddress(''); setBillingAddress(''); setTitle(''); setAvatarUrl(''); setMyOrders([])
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
        id: user.id, 
        email: user.email, 
        full_name: fullName, 
        phone: phone, 
        instagram: instagram, 
        address: address, 
        billing_address: billingAddress, 
        title: title, 
        avatar_url: avatarUrl
      }

      const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' })
      if (error) throw error

      setSuccessMsg('Fatura ve teslimat bilgileriniz güncellendi!')
      setTimeout(() => { setSuccessMsg(''); window.location.reload() }, 1000)
    } catch (err: any) {
      alert('Kayıt Hatası: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <header className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-300', scrolled ? 'border-b border-border bg-background/90 backdrop-blur-xl' : 'border-b border-transparent bg-background/60 backdrop-blur-md')}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
          
          <div className="flex items-center gap-6">
            <Link href="/store" aria-label="ORISE STORE"><Logo /></Link>
            
            {/* Üstte Açılır Topluluk / Etkinlik Takvimi Butonu */}
            <div className="relative">
              <button 
                onClick={() => setIsCommunityDropdownOpen(!isCommunityDropdownOpen)}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-primary transition-colors cursor-pointer bg-zinc-900/80 border border-white/10 px-4 py-2 rounded-full"
              >
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>Topluluk & Etkinlikler</span>
              </button>

              {isCommunityDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-2xl border border-white/15 bg-zinc-950 p-4 shadow-2xl z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-bold text-primary uppercase">Haftalık Kulüp Takvimi</span>
                    <button onClick={() => setIsCommunityDropdownOpen(false)} className="text-zinc-400 hover:text-white text-xs">✕</button>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    Koşu, yoga, voleybol ve açık hava antrenman programlarımıza göz atın.
                  </p>
                  <Link 
                    href="/community" 
                    onClick={() => setIsCommunityDropdownOpen(false)}
                    className="block w-full text-center rounded-xl bg-primary py-2 text-[11px] font-black uppercase tracking-widest text-black hover:opacity-90"
                  >
                    Etkinlik Takvimine Git →
                  </Link>
                </div>
              )}
            </div>
          </div>

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

      {/* PROFİL & FATURA MODALI */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto" onClick={() => setIsProfileOpen(false)}>
          <div className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6 text-white my-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Müşteri & Fatura Bilgileri</h3>
              </div>
              <button type="button" onClick={() => setIsProfileOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary hover:text-black transition-colors cursor-pointer"><X className="h-4 w-4" /></button>
            </div>

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
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Telefon</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Teslimat ve Fatura Adresi</label>
                <textarea rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Mahalle, Cadde, No, İlçe / İl" className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-xs text-white" />
              </div>

              {successMsg && <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400 text-center font-mono">{successMsg}</div>}

              <button type="submit" disabled={loading} className="w-full rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-lg cursor-pointer">Bilgileri Güncelle</button>
            </form>

            <div className="border-t border-white/10 pt-4 space-y-4">
              <h4 className="text-xs font-bold text-primary uppercase">Sipariş Geçmişim ({myOrders.length})</h4>
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {myOrders.length === 0 ? (
                  <p className="text-xs text-zinc-500 font-mono">Henüz siparişiniz bulunmuyor.</p>
                ) : (
                  myOrders.map((ord) => (
                    <div key={ord.id} className="p-3 rounded-xl bg-zinc-900 border border-white/5 flex justify-between items-center text-xs">
                      <span>Sipariş #{ord.id.slice(0, 6)}</span>
                      <span className="text-primary font-bold">₺{ord.total_price}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROFESYONEL E-TİCARET FOOTER (Yasal Metinler, İletişim, Sosyal Medya ve İyzico Vitrini) */}
      <footer className="w-full border-t border-white/10 bg-black py-10 px-6 sm:px-10 lg:px-14 mt-auto">
        <div className="mx-auto max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-6 text-xs font-mono text-zinc-400">
          
          <div className="flex items-center gap-4">
            <span className="font-bold text-white tracking-wider">ORISE STORE</span>
            <span className="text-zinc-600">/</span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> 256-BIT SSL & İyzico Güvencesi
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px]">
            <div className="flex items-center gap-2.5">
              <Link href="/hakkimizda" className="text-primary font-bold hover:underline uppercase">Hakkımızda</Link>
              <span className="text-zinc-700">·</span>
              <Link href="/gizlilik" className="hover:text-primary transition-colors underline uppercase">Gizlilik Politikası</Link>
              <span className="text-zinc-700">·</span>
              <Link href="/mesafeli-satis" className="hover:text-primary transition-colors underline uppercase">Mesafeli Satış Sözleşmesi</Link>
              <span className="text-zinc-700">·</span>
              <Link href="/iade-kosullari" className="hover:text-primary transition-colors underline uppercase">İade & Değişim</Link>
            </div>
            <span className="text-zinc-700 hidden md:inline">|</span>
            <div className="flex items-center gap-3 text-zinc-300">
              <a href="mailto:store@oriseclub.com" className="hover:text-primary transition-colors">
                store@oriseclub.com
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/orisestore" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors inline-flex items-center gap-1.5 text-[11px]">
              <svg className="h-3.5 w-3.5 text-primary fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> @orisestore
            </a>
            <a href="https://www.instagram.com/orisecommunity" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors inline-flex items-center gap-1.5 text-[11px]">
              <svg className="h-3.5 w-3.5 text-primary fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> @orisecommunity
            </a>
            <a href="https://www.linkedin.com/company/orisecommunity/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors inline-flex items-center gap-1.5 text-[11px]">
              <svg className="h-3.5 w-3.5 text-primary fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> LinkedIn
            </a>
          </div>

        </div>
      </footer>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={() => window.location.reload()} />
      <AiChatButton />
    </>
  )
}
