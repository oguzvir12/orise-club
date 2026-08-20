'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { User, LogOut, Settings, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export function SplitHero() {
  const [user, setUser] = useState<any>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        const { data } = await supabase
          .from('profiler')
          .select('*')
          .eq('email', session.user.email)
          .single()
        
        if (data) {
          setFullName(data.full_name || '')
          setPhone(data.phone || '')
          setAddress(data.adres || '')
        }
      }
    }
    checkUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.reload()
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setSuccessMsg('')

    try {
      const { error } = await supabase
        .from('profiler')
        .update({
          full_name: fullName,
          phone: phone,
          adres: address,
        })
        .eq('email', user.email)

      if (error) throw error

      setSuccessMsg('Profil bilgileriniz güncellendi!')
      setTimeout(() => {
        setIsProfileOpen(false)
        setSuccessMsg('')
      }, 2000)
    } catch (err: any) {
      alert('Hata: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white font-sans">
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-2">
          <span className="font-black tracking-widest text-sm text-white">ORISE CLUB</span>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-xs font-mono text-zinc-300 backdrop-blur-md hover:border-primary hover:text-white transition-all cursor-pointer"
              >
                <User className="h-3.5 w-3.5 text-primary" />
                <span className="truncate max-w-[150px]">{fullName || user.email}</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-mono text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">ÇIKIŞ</span>
              </button>
            </div>
          ) : (
            <Link
              href="/community"
              className="rounded-full border border-white/20 bg-black/60 px-5 py-2 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md hover:border-primary hover:bg-primary hover:text-black transition-all"
            >
              Giriş Yap / Üye Ol
            </Link>
          )}
        </div>
      </header>

      <div className="grid h-full w-full grid-cols-1 md:grid-cols-2 pt-20 md:pt-0">
        <div className="relative flex flex-col items-center justify-center p-8 text-center bg-zinc-950/60 border-r border-white/10 group overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-30 transition-transform duration-700 group-hover:scale-105">
            <Image
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop"
              alt="Topluluk"
              fill
              className="object-cover grayscale"
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>

          <div className="relative z-10 space-y-4 max-w-md">
            <span className="text-[10px] font-mono text-primary uppercase tracking-[0.3em]">KULÜBE KATIL · RİTMİNİ BUL</span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter">TOPLULUK</h1>
            <p className="text-xs sm:text-sm text-zinc-300">
              Tek başınalıktan çık, şehre karış. Birlikte hareket eden yeni nesil spor topluluğu.
            </p>
            <div className="pt-4">
              <Link
                href="/community"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_25px_rgba(249,115,22,0.4)] hover:scale-105 transition-transform"
              >
                <span>Buluşmaları Keşfet</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-center p-8 text-center bg-zinc-950/60 group overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-30 transition-transform duration-700 group-hover:scale-105">
            <Image
              src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop"
              alt="Mağaza"
              fill
              className="object-cover grayscale"
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>

          <div className="relative z-10 space-y-4 max-w-md">
            <span className="text-[10px] font-mono text-primary uppercase tracking-[0.3em]">HAREKET KULÜBÜ & STÜDYO</span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter">MAĞAZA</h1>
            <p className="text-xs sm:text-sm text-zinc-300">
              Kulüp kültüründen ilham alan özel tasarım teknik spor ve sokak parçaları.
            </p>
            <div className="pt-4">
              <Link
                href="/store"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/80 px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white hover:border-primary hover:bg-primary hover:text-black transition-all"
              >
                <span>Koleksiyonu İncele</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {isProfileOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={() => setIsProfileOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">Profili Düzenle</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary hover:text-black transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
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

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">İkamet / Teslimat Adresi</label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Adres detayları..."
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
                className="w-full rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-lg hover:scale-[1.02] transition-transform cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
