'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ShoppingBag, User, LogOut, MessageCircle, Send, Loader2 } from 'lucide-react'
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
      <header className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-300', scrolled ? 'border-b border-border bg-background/90 backdrop-blur-xl' : 'border-b border-transparent bg-background/80 backdrop-blur-md')}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">
          
          <div className="flex items-center gap-6">
            <Link href="/store" aria-label="ORISE STORE"><Logo /></Link>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={openCart} aria-label="Sepeti aç" className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-secondary/50 text-foreground backdrop-blur-md transition-all duration-300 hover:border-primary hover:bg-primary/10 hover:text-primary cursor-pointer">
              <ShoppingBag className="h-[18px] w-[18px]" />
              {count > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">{count}</span>}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {/* Modal açmak yerine direkt profesyonel /profile sayfasına yönlendirir */}
                <Link href="/profile" className="flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-xs font-mono text-zinc-300 backdrop-blur-md hover:border-primary hover:text-white transition-all cursor-pointer">
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
              <button type="button" onClick={() => setIsAuthOpen(true)} className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary backdrop-blur-md hover:bg-primary/25 hover:border-primary transition-all duration-300 cursor-pointer">
                <User className="h-3.5 w-3.5" />
                <span>Giriş Yap / Kayıt Ol</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={() => window.location.reload()} />
      <AiChatButton />
    </>
  )
}
