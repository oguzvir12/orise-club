'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ShoppingBag, User, LogOut, Menu, X } from 'lucide-react'
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
        <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-12">
          
          {/* Sol: Menü Butonu */}
          <div className="flex items-center z-10">
            <button 
              type="button" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden flex items-center justify-center h-9 w-9 rounded-full border border-white/15 bg-zinc-900/80 text-white hover:border-primary transition-all cursor-pointer"
              aria-label="Menüyü aç"
            >
              <Menu size={16} />
            </button>
          </div>

          {/* Orta: Logo (Telefonda esnek ve daraltılmış, masaüstünde ortalanmış) */}
          <div className="absolute left-1/2 -translate-x-1/2 scale-[0.65] sm:scale-100 origin-center">
            <Link href="/store" aria-label="ORISE STORE" className="flex flex-col items-center">
              <Logo />
            </Link>
          </div>

          {/* Sağ: Sepet ve Giriş Butonları */}
          <div className="flex items-center gap-2 sm:gap-3 z-10">
            <button type="button" onClick={openCart} aria-label="Sepeti aç" className="relative inline-flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/15 bg-zinc-900/80 text-white backdrop-blur-xl transition-all hover:border-primary hover:bg-primary/20 hover:text-primary cursor-pointer shrink-0">
              <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {count > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 sm:h-5 sm:min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[9px] sm:text-[11px] font-black text-black">{count}</span>}
            </button>

            {user ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link href="/profile" className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/80 px-2.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-mono text-zinc-300 backdrop-blur-md hover:border-primary hover:text-white transition-all cursor-pointer">
                  {avatarUrl ? (
                    <div className="relative h-4 w-4 sm:h-5 sm:w-5 rounded-full overflow-hidden"><Image src={avatarUrl} alt="Avatar" fill className="object-cover" /></div>
                  ) : (
                    <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                  )}
                  <span className="truncate max-w-[60px] sm:max-w-[120px]">{fullName || user.email}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer shrink-0" title="Çıkış Yap">
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => setIsAuthOpen(true)} className="flex items-center gap-1 sm:gap-2 rounded-full border border-primary/40 bg-primary/10 px-2.5 sm:px-5 py-1.5 sm:py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary backdrop-blur-md hover:bg-primary/25 hover:border-primary transition-all cursor-pointer shrink-0">
                <User className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                <span className="hidden xs:inline">Giriş Yap</span>
                <span className="inline xs:hidden">Giriş</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobil Açılır Menü */}
        {mobileMenuOpen && (
          <div className="sm:hidden absolute top-16 inset-x-0 bg-zinc-950/98 border-b border-white/10 backdrop-blur-2xl p-6 space-y-4 font-mono text-xs uppercase font-bold animate-fadeIn shadow-2xl">
            <Link href="/store" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-zinc-300 hover:text-primary">Mağaza Vitrini</Link>
            <Link href="/community" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-zinc-300 hover:text-primary">Topluluk & Etkinlikler</Link>
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
    </>
  )
}
