'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, CreditCard, CheckCircle2, Clock, MapPin, User, Mail, Phone } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null)
  const [myRegistrations, setMyRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserProfileAndEvents()
  }, [])

  const loadUserProfileAndEvents = async () => {
    setLoading(true)
    try {
      const localUser = localStorage.getItem('orise_logged_user')
      let email = ''
      let profileInfo = null

      if (localUser) {
        profileInfo = JSON.parse(localUser)
        email = profileInfo.email
        setUserData(profileInfo)
      } else {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          email = session.user.email || ''
          // Profil tablosundan bilgileri çekelim
          const { data: prof } = await supabase.from('profiler').select('*').eq('email', email).single()
          profileInfo = prof || { email, full_name: session.user.user_metadata?.full_name || 'Kullanıcı' }
          setUserData(profileInfo)
        }
      }

      if (email) {
        // Bu kullanıcının event_registrations tablosundaki kayıtlarını ve etkinlik detaylarını çekelim
        const { data: regs, error } = await supabase
          .from('event_registrations')
          .select(`
            id,
            status,
            is_paid,
            created_at,
            events (
              id,
              title,
              date,
              location,
              price,
              branch,
              image_url
            )
          `)
          .eq('email', email)
          .order('created_at', { ascending: false })

        if (!error && regs) {
          setMyRegistrations(regs)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handlePayTRRedirect = (eventTitle: string, price: number) => {
    // PayTR veya ödeme geçidi entegrasyon bağlantısı buraya eklenecek
    alert(`"${eventTitle}" etkinliği için ₺${price} tutarındaki ödeme ekranına (PayTR) yönlendiriliyorsunuz.`)
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black p-6 sm:p-10">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Üst Navigasyon */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link href="/community" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-300 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Topluluk & Etkinliklere Dön</span>
          </Link>
          <span className="text-xs font-mono text-primary uppercase">ORISE KULLANICI PROFİLİ</span>
        </div>

        {/* Kullanıcı Kartı */}
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-primary/20 text-primary border border-primary/40 flex items-center justify-center text-2xl font-black">
            {userData?.full_name?.[0] || 'O'}
          </div>
          <div className="space-y-1 text-center md:text-left">
            <h1 className="text-2xl font-black text-white">{userData?.full_name || userData?.name || 'Kulüp Üyesi'}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-zinc-400 pt-1">
              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-primary" /> {userData?.email || 'Belirtilmemiş'}</span>
              <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-primary" /> {userData?.phone || 'Belirtilmemiş'}</span>
            </div>
          </div>
        </div>

        {/* Katıldığım Etkinlikler Bölümü */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Katıldığım & Kayıt Olduğum Etkinlikler</span>
            </h2>
            <span className="text-xs font-mono text-zinc-500">[{myRegistrations.length} KAYIT]</span>
          </div>

          {loading ? (
            <div className="text-center py-16 text-xs font-mono text-zinc-500">Yükleniyor...</div>
          ) : myRegistrations.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-12 text-center space-y-3">
              <p className="text-sm text-zinc-400">Henüz hiçbir etkinliğe kayıt oluşturmadın.</p>
              <Link href="/community" className="inline-block rounded-full bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-black hover:scale-105 transition-transform">
                Etkinlikleri Keşfet
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {myRegistrations.map((reg) => {
                const evt = reg.events
                if (!evt) return null
                const isPaid = reg.is_paid

                return (
                  <div key={reg.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-md">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/30">{evt.branch}</span>
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                            <CheckCircle2 className="h-3 w-3" /> Ödendi / Onaylı
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                            <Clock className="h-3 w-3" /> Ödeme Bekliyor
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white pt-1">{evt.title}</h3>
                      <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 pt-1">
                        <span>📅 {new Date(evt.date).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                        <span>📍 {evt.location}</span>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto flex items-center justify-end">
                      {Number(evt.price) === 0 ? (
                        <span className="text-xs font-mono text-zinc-500">Ücretsiz Etkinlik</span>
                      ) : isPaid ? (
                        <span className="text-xs font-mono text-emerald-400 font-bold">₺{evt.price} Ödendi</span>
                      ) : (
                        <button
                          onClick={() => handlePayTRRedirect(evt.title, evt.price)}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-lg hover:scale-105 transition-transform cursor-pointer"
                        >
                          <CreditCard className="h-4 w-4" />
                          <span>₺{evt.price} Ödemeyi Tamamla</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
