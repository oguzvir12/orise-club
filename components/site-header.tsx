'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ShoppingBag, User, LogOut, MessageCircle, Send, Loader2, X } from 'lucide-react'
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
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
      if (data) {
        setFullName(data.full_name || '')
        setAvatarUrl(data.avatar_url || '')
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
        await fetchProfile(session.user.id)
      }
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setFullName(''); setAvatarUrl('')
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.reload()
  }

  return (
    <>
      <header className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-300', scrolled ? 'border-b border-white/10 bg-black/90 backdrop-blur-2xl shadow-lg' : 'border-b border-transparent bg-black/50 backdrop-blur-md')}>
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
          
          <div className="flex items-center gap-4">
            <button 
              type="button" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden flex flex-col justify-center gap-1.5 h-10 w-10 rounded-full border border-white/15 bg-zinc-900/80 p-2.5 text-white hover:border-primary transition-all cursor-pointer"
              aria-label="Menüyü aç"
            >
              <span className="block h-0.5 w-full bg-current rounded-full" />
              <span className="block h-0.5 w-3/4 bg-current rounded-full" />
              <span className="block h-0.5 w-full bg-current rounded-full" />
            </button>

            <nav className="hidden sm:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-zinc-300 font-mono">
              <Link href="/store" className="hover:text-primary transition-colors">MAĞAZA</Link>
            </nav>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/store" aria-label="ORISE STORE" className="flex flex-col items-center">
              <Logo />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={openCart} aria-label="Sepeti aç" className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-zinc-900/80 text-white backdrop-blur-xl transition-all duration-300 hover:border-primary hover:bg-primary/20 hover:text-primary cursor-pointer">
              <ShoppingBag className="h-4 w-4" />
              {count > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-black text-black">{count}</span>}
            </button>

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/profile" className="flex items-center gap-2 rounded-full border border-white/15 bg-black/80 px-4 py-2 text-xs font-mono text-zinc-300 backdrop-blur-md hover:border-primary hover:text-white transition-all cursor-pointer">
                  {avatarUrl ? (
                    <div className="relative h-5 w-5 rounded-full overflow-hidden"><Image src={avatarUrl} alt="Avatar" fill className="object-cover" /></div>
                  ) : (
                    <User className="h-3.5 w-3.5 text-primary" />
                  )}
                  <span className="truncate max-w-[120px]">{fullName || user.email}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center justify-center h-10 w-10 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer" title="Çıkış Yap">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => setIsAuthOpen(true)} className="hidden sm:flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary backdrop-blur-md hover:bg-primary/25 hover:border-primary transition-all duration-300 cursor-pointer">
                <User className="h-3.5 w-3.5" />
                <span>Giriş Yap</span>
              </button>
            )}
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden absolute top-20 inset-x-0 bg-zinc-950/95 border-b border-white/10 backdrop-blur-2xl p-6 space-y-4 font-mono text-xs uppercase font-bold animate-fadeIn">
            <Link href="/store" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-zinc-300 hover:text-primary">Mağaza Vitrini</Link>
            <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-white">
                    <User size={14} className="text-primary" /> Hesabım & Siparişler
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 text-left">
                    <LogOut size={14} /> Çıkış Yap
                  </button>
                </>
              ) : (
                <button onClick={() => { setMobileMenuOpen(false); setIsAuthOpen(true); }} className="w-full py-3 bg-primary text-black rounded-full font-black">
                  Giriş Yap / Kayıt Ol
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={() => window.location.reload()} />
      <AiChatButton />
    </>
  )
}
