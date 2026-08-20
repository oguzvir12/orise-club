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

const PANELS = [
  {
    id: 'community',
    href: '/community',
    slogan: 'KULÜBE KATIL · RİTMİNİ BUL',
    title: 'TOPLULUK',
    subtitle: 'Tek başınalıktan çık, şehre karış. Birlikte hareket eden yeni nesil spor topluluğu.',
    cta: 'Buluşmaları Keşfet',
    meta: 'KOŞU · VOLEYBOL · TENİS · PİLATES · YELKEN',
    icon: Users,
    bgImage: '/community-hero.jpeg',
    align: 'left',
  },
  {
    id: 'store',
    href: '/store',
    slogan: 'HAREKET KULÜBÜ & STÜDYO',
    title: 'MAĞAZA',
    subtitle: 'Kulüp kültüründen ilham alan özel tasarım teknik spor ve sokak parçaları.',
    cta: 'Koleksiyonu İncele',
    meta: 'TEKNİK GİYİM · ATLETİK STİL',
    icon: ShoppingBag,
    bgImage: '/store-hero.jpeg',
    align: 'right',
  },
]

const LEGAL_DOCS: Record<string, { title: string; content: string }> = {
  kvkk: { title: 'KVKK Aydınlatma & Açık Rıza Metni', content: '...' },
  privacy: { title: 'Gizlilik ve Çerez Politikası', content: '...' },
  terms: { title: 'Mesafeli Satış ve Hizmet Sözleşmesi', content: '...' },
  refund: { title: 'İptal ve İade Koşulları', content: '...' },
}

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
      
      {/* SOL ÜST SEPET */}
      <div className="absolute top-6 left-6 z-50">
        <button
          onClick={openCart}
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/80 px-4 py-2 backdrop-blur-md transition-all hover:border-primary"
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

      {/* SAĞ ÜST GİRİŞ */}
      <div className="absolute top-6 right-6 z-50">
        {user ? (
          <button onClick={handleLogout} className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/80 px-4 py-2 text-[11px] font-mono text-zinc-300 hover:border-red-500 hover:text-red-400">
            <LogOut className="h-3.5 w-3.5" />
            Çıkış
          </button>
        ) : (
          <button onClick={() => setIsAuthOpen(true)} className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/20 transition-all">
            <User className="h-3.5 w-3.5" />
            <span>Giriş Yap / Kayıt Ol</span>
          </button>
        )}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/10 to-transparent md:block" />

      {/* Merkez Logo */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 hidden -translate-y-1/2 -translate-x-1/2 md:block">
         <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-black/85 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)]">
           <OriseMark className="h-11 w-11 text-primary" />
         </div>
      </div>

      {PANELS.map((panel) => {
        const Icon = panel.icon
        return (
          <Link key={panel.href} href={panel.href} onMouseEnter={() => setHovered(panel.id as 'community' | 'store')} onMouseLeave={() => setHovered(null)} className="group relative flex w-full flex-col items-center justify-center border-b border-white/5 p-8 text-center transition-all duration-500 md:h-full md:w-1/2 md:border-b-0 md:border-r last:border-r-0 md:p-16 pb-28">
            <div className="absolute inset-0 z-0 overflow-hidden">
              <Image src={panel.bgImage} alt={panel.title} fill priority className="object-cover opacity-20 transition-all duration-1000 group-hover:opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
            </div>
            <div className="relative z-10 flex w-full max-w-md flex-col items-center space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] text-primary backdrop-blur-md">
                <Sparkles className="h-3 w-3" />
                <span>{panel.slogan}</span>
              </div>
              <h2 className="text-4xl font-black text-white sm:text-6xl">{panel.title}</h2>
              <p className="text-sm text-zinc-300">{panel.subtitle}</p>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-zinc-900/80 px-7 py-3 text-xs font-bold uppercase text-white hover:bg-primary hover:text-black hover:scale-105 transition-all">
                <Icon className="h-4 w-4" />
                <span>{panel.cta}</span>
              </div>
            </div>
          </Link>
        )
      })}

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={() => setIsAuthOpen(false)} />
    </section>
  )
}
