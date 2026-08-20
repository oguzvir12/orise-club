'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ArrowUpRight, ShoppingBag, Users, Sparkles, Mail, X, ShieldCheck, User, LogOut } from 'lucide-react'
import { OriseMark } from '@/components/logo'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import AuthModal from '@/components/AuthModal'
import { useCart } from '@/components/cart/cart-provider'

// (PANELS ve LEGAL_DOCS sabitleri aynı kalacak)

export function SplitHero() {
  const [hovered, setHovered] = useState<'community' | 'store' | null>(null)
  const [activeLegalModal, setActiveLegalModal] = useState<string | null>(null)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  const { openCart, count } = useCart()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
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
      
      {/* SOL ÜST: SEPET BUTONU */}
      <div className="absolute top-6 left-6 z-50">
        <button
          type="button"
          onClick={openCart}
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/80 px-4 py-2 backdrop-blur-md transition-all hover:border-primary cursor-pointer"
        >
          <ShoppingBag className="h-4 w-4 text-zinc-400 group-hover:text-primary" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-300">Sepetim</span>
          {count > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-black">
              {count}
            </span>
          )}
        </button>
      </div>

      {/* MERKEZ ÜST: ORISE CLUB LOGOSU (Tam Ortada) */}
      <div className="absolute top-7 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="flex items-center gap-2">
          <OriseMark className="h-6 w-6 text-primary" />
          <span className="font-black tracking-widest text-sm text-white">ORISE CLUB</span>
        </div>
      </div>

      {/* SAĞ ÜST: GİRİŞ / KAYIT OL (Üzerinde rozet kalmadı) */}
      <div className="absolute top-6 right-6 z-50">
        {user ? (
          <div className="flex items-center gap-3 rounded-full border border-white/15 bg-zinc-900/90 px-4 py-2 backdrop-blur-md shadow-lg">
            <span className="text-[11px] font-mono text-zinc-300 hidden sm:inline">
              {user.email}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Çıkış</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAuthOpen(true)}
            className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary backdrop-blur-md hover:bg-primary/20 hover:border-primary transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.2)] cursor-pointer"
          >
            <User className="h-3.5 w-3.5" />
            <span>Giriş Yap / Kayıt Ol</span>
          </button>
        )}
      </div>

      {/* (Kalan paneller, footer ve modaller orijinal kodundaki gibi kalacak) */}
