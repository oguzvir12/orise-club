'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ArrowUpRight, ShoppingBag, Users, Sparkles, Mail, X, ShieldCheck, User, LogOut } from 'lucide-react'
import { OriseMark } from '@/components/logo'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import AuthModal from '@/components/AuthModal'

// ... (PANELS ve LEGAL_DOCS aynı kalacak)

export function SplitHero() {
  const [hovered, setHovered] = useState<'community' | 'store' | null>(null)
  const [activeLegalModal, setActiveLegalModal] = useState<string | null>(null)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0) // Basit sepet sayacı örneği

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    
    // Sepet sayısını göstermek için (Local storage veya state'den çekilecek)
    const savedCart = localStorage.getItem('orise_cart')
    if (savedCart) setCartCount(JSON.parse(savedCart).length)
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <section className="relative flex h-full w-full flex-col overflow-hidden md:flex-row bg-black select-none font-sans">
      
      {/* SOL ÜST: SEPET ALANI */}
      <div className="absolute top-6 left-6 z-50">
        <Link href="/store/cart" className="group flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/80 px-4 py-2 backdrop-blur-md transition-all hover:border-primary">
          <ShoppingBag className="h-4 w-4 text-zinc-400 group-hover:text-primary" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-300">Sepetim</span>
          {cartCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-black">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* SAĞ ÜST: GİRİŞ / PROFİL */}
      <div className="absolute top-6 right-6 z-50">
        {user ? (
          <button onClick={handleLogout} className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-red-400">Çıkış</button>
        ) : (
          <button onClick={() => setIsAuthOpen(true)} className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/20 transition-all">
            <User className="h-3.5 w-3.5" />
            <span>Giriş Yap / Kayıt Ol</span>
          </button>
        )}
      </div>

      {/* ... (Geri kalan SplitHero içeriği aynı kalacak) ... */}
