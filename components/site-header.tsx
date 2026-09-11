'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ShoppingBag, User, LogOut, Menu, Search, X, PackageCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
import { useCart } from '@/components/cart/cart-provider'
import { supabase } from '@/lib/supabase'
import AuthModal from './auth-modal'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export function SiteHeader() {
  const router = useRouter()
  const { count, openCart } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/store?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      {/* ÜST KAMPANYA VE DUYURU ÇUBUĞU */}
      <div className="fixed inset-x-0 top-0 z-[60] bg-[#F74A05] text-[#111111] py-2 px-4 text-center font-mono text-[11px] font-black uppercase tracking-wider">
        2000 TL ve Üzeri Alışverişlerde Kargo Ücretsiz!
      </div>

      <header className={cn('fixed inset-x-0 top-8 z-50 transition-all duration-300', scrolled ? 'border-b border-white/10 bg-[#111111]/95 shadow-2xl backdrop-blur-md top-8' : 'border-b border-transparent bg-gradient-to-b from-black/80 via-black/40 to-transparent')}>
        <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-12">

          <div className="flex items-center gap-3 z-20">
            <button 
              type="button" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden flex items-center justify-center h-10 w-10 rounded-full border border-white/20 bg-black/60 text-white hover:border-[#F74A05] transition-all cursor-pointer"
              aria-label="Menüyü aç"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            
            <nav className="hidden sm:flex items-center gap-6 font-mono text-xs uppercase tracking-widest text-zinc-300">
              <Link href="/store" className="hover:text-[#F74A05] transition-colors">Mağaza</Link>
              <Link href="/track-order" className="hover:text-[#F74A05] transition-colors flex items-center gap-1.5 text-[#F74A05] font-bold">
                <PackageCheck size={14} /> Sipariş Takibi
              </Link>
              <Link href="/community" className="hover:text-[#F74A05] transition-colors">Topluluk</Link>
              <Link href="/hakkimizda" className="hover:text-[#F74A05] transition-colors">Hakkımızda</Link>
            </nav>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 scale-[0.75] sm:scale-100 origin-center">
            <Link href="/store" aria-label="ORISE STORE" className="flex flex-col items-center">
              <Logo />
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 z-20">
            <button 
              type="button" 
              onClick={() => setIsSearchOpen(!isSearchOpen)} 
              aria-label="Ürün Ara" 
              className="relative inline-flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white transition-all hover:border-[#F74A05] hover:bg-[#F74A05]/20 hover:text-[#F74A05] cursor-pointer shrink-0"
            >
              <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>

            <button type="button" onClick={openCart} aria-label="Sepeti aç" className="relative inline-flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white transition-all hover:border-[#F74A05] hover:bg-[#F74A05]/20 hover:text-[#F74A05] cursor-pointer shrink-0">
              <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {count > 0 && <span className="absolute -right-1 -top-1 flex h-4 w-4 sm:h-5 sm:min-w-5 items-center justify-center rounded-full bg-[#F74A05] px-1 text-[9px] sm:text-[11px] font-black text-[#111111]">{count}</span>}
            </button>

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/profile" className="flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-xs font-mono text-zinc-200 hover:border-[#F74A05] hover:text-white transition-all cursor-pointer">
                  {avatarUrl ? (
                    <div className="relative h-5 w-5 rounded-full overflow-hidden"><Image src={avatarUrl} alt="Avatar" fill className="object-cover" /></div>
                  ) : (
                    <User className="h-3.5 w-3.5 text-[#F74A05]" />
                  )}
                  <span className="truncate max-w-[100px]">{fullName || user.email}</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center justify-center h-10 w-10 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer shrink-0" title="Çıkış Yap">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => setIsAuthOpen(true)} className="hidden sm:flex items-center gap-2 rounded-full border border-[#F74A05]/40 bg-[#F74A05]/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#F74A05] hover:bg-[#F74A05]/25 hover:border-[#F74A05] transition-all cursor-pointer shrink-0">
                <User className="h-3.5 w-3.5" />
                <span>Giriş Yap</span>
              </button>
            )}
          </div>
        </div>

        {isSearchOpen && (
          <div className="absolute top-16 sm:top-20 inset-x-0 bg-[#111111]/98 border-b border-white/10 p-4 sm:p-6 shadow-2xl animate-fadeIn">
            <form onSubmit={handleSearch} className="mx-auto max-w-2xl flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  type="text" 
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Mağazada ürün ara..." 
                  className="w-full rounded-full border border-white/20 bg-black/60 pl-12 pr-6 py-3.5 text-xs sm:text-sm text-white focus:border-[#F74A05] focus:outline-none"
                />
              </div>
              <button type="submit" className="rounded-full bg-[#F74A05] px-6 py-3.5 text-xs font-black uppercase text-[#111111] hover:bg-orange-600 transition-colors cursor-pointer">
                Ara
              </button>
              <button type="button" onClick={() => setIsSearchOpen(false)} className="text-zinc-400 hover:text-white p-2 cursor-pointer">
                <X size={20} />
              </button>
            </form>
          </div>
        )}

        {mobileMenuOpen && (
          <div className="sm:hidden absolute top-16 inset-x-0 bg-[#111111]/98 border-b border-white/10 p-6 space-y-4 font-mono text-xs uppercase font-bold animate-fadeIn shadow-2xl">
            <Link href="/store" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-zinc-200 hover:text-[#F74A05] border-b border-white/5">Mağaza Vitrini</Link>
            <Link href="/track-order" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-[#F74A05] border-b border-white/5 flex items-center gap-2">
              <PackageCheck size={16} /> Sipariş Takibi
            </Link>
            <Link href="/community" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-zinc-200 hover:text-[#F74A05] border-b border-white/5">Topluluk & Etkinlikler</Link>
            <Link href="/hakkimizda" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-zinc-200 hover:text-[#F74A05] border-b border-white/5">Hakkımızda</Link>
            <div className="pt-2 flex flex-col gap-3">
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-white py-2">
                    <User size={16} className="text-[#F74A05]" /> Hesabım & Siparişler
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 text-left py-2">
                    <LogOut size={16} /> Çıkış Yap
                  </button>
                </>
              ) : (
                <button onClick={() => { setMobileMenuOpen(false); setIsAuthOpen(true); }} className="w-full py-3.5 bg-[#F74A05] text-[#111111] rounded-full font-black uppercase tracking-wider">
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
