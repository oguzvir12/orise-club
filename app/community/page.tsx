'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Calendar,
  Check,
  ShieldCheck,
  AlertCircle,
  X,
  Ticket,
  ChevronRight,
  Filter,
  User,
  LogOut,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import AuthModal from '../../../components/auth-modal'

interface EventItem {
  id: string
  title: string
  branch: string
  date: string
  location: string
  capacity: number
  price: number
  description: string
  image_url: string
}

const BRANCHES = [
  'TÜMÜ',
  'KOŞU',
  'YOGA & MOBILITY',
  'TENİS',
  'VOLEYBOL',
  'YELKEN',
]

export default function CommunityPage() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string>('TÜMÜ')
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  // Oturum ve Kullanıcı Bilgileri
  const [session, setSession] = useState<any>(null)
  const [userEmail, setUserEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [healthAccepted, setHealthAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [registrationCounts, setRegistrationCounts] = useState<Record<string, number>>({})
  const [myRegisteredEventIds, setMyRegisteredEventIds] = useState<string[]>([])

  useEffect(() => {
    fetchEvents()
    fetchRegistrations()
    checkUserSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
      if (currentSession?.user?.email) {
        setUserEmail(currentSession.user.email)
        fetchUserData(currentSession.user.email)
        fetchMyRegistrations(currentSession.user.email)
      } else {
        setUserEmail('')
        setFullName('')
        setPhone('')
        setMyRegisteredEventIds([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUserSession = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      setSession(currentSession)

      if (currentSession?.user?.email) {
        const emailVal = currentSession.user.email
        setUserEmail(emailVal)
        await fetchUserData(emailVal)
        await fetchMyRegistrations(emailVal)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchUserData = async (email: string) => {
    try {
      const { data: prof } = await supabase.from('profiles').select('*').ilike('email', email).single()
      if (prof) {
        setFullName(prof.full_name || '')
        setPhone(prof.phone || '')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchMyRegistrations = async (email: string) => {
    try {
      const { data } = await supabase
        .from('event_registrations')
        .select('event_id')
        .ilike('email', email.trim())

      if (data) {
        setMyRegisteredEventIds(data.map((r: any) => r.event_id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchEvents = async () => {
    try {
      const { data } = await supabase.from('events').select('*').order('date', { ascending: true })
      if (data) setEvents(data)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchRegistrations = async () => {
    try {
      const { data } = await supabase.from('event_registrations').select('event_id')
      if (data) {
        const counts: Record<string, number> = {}
        data.forEach((r: any) => {
          counts[r.event_id] = (counts[r.event_id] || 0) + 1
        })
        setRegistrationCounts(counts)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const openRegisterModal = (evt: EventItem) => {
    if (!userEmail) {
      setIsAuthModalOpen(true)
      return
    }

    if (myRegisteredEventIds.includes(evt.id)) {
      alert('Bu etkinliğe zaten katıldın!')
      return
    }

    setSelectedEvent(evt)
    setIsModalOpen(true)
    setSuccess(false)
    setErrorMsg('')
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEvent) return

    if (!healthAccepted) {
      setErrorMsg('Lütfen sağlık ve sorumluluk beyanını onaylayınız.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      const { data: existing } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('event_id', selectedEvent.id)
        .ilike('email', userEmail.trim())
        .maybeSingle()

      if (existing) {
        setErrorMsg('Bu etkinliğe zaten kayıt oluşturdun!')
        setLoading(false)
        return
      }

      const currentCount = registrationCounts[selectedEvent.id] || 0
      const isWaitlist = currentCount >= (selectedEvent.capacity || 30)

      const { error } = await supabase.from('event_registrations').insert([
        {
          event_id: selectedEvent.id,
          full_name: fullName.trim() || 'Kulüp Üyesi',
          phone: phone.trim() || 'Belirtilmemiş',
          email: userEmail.trim(),
          status: isWaitlist ? 'waitlist' : 'pending',
          is_paid: Number(selectedEvent.price) === 0,
        },
      ])

      if (error) throw error

      setSuccess(true)
      setHealthAccepted(false)
      fetchRegistrations()
      fetchMyRegistrations(userEmail)

      setTimeout(() => {
        setIsModalOpen(false)
        setSuccess(false)
      }, 3000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Kayıt sırasında bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents =
    selectedBranch === 'TÜMÜ'
      ? events
      : events.filter((e) => e.branch?.toUpperCase() === selectedBranch)

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-black">
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 sm:px-10 lg:px-14">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/80 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-zinc-200 backdrop-blur-xl transition-all duration-300 hover:border-primary hover:bg-black hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-primary transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Ana Sayfa</span>
        </Link>

        <div className="flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="group inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-primary backdrop-blur-xl transition-all duration-300 hover:bg-primary hover:text-black"
              >
                <User className="h-3.5 w-3.5" />
                <span>Profilim & Etkinliklerim</span>
              </Link>
              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signOut()
                  window.location.reload()
                }}
                className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-500/20 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Çıkış</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="rounded-full bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_20px_rgba(249,115,22,0.35)] hover:scale-105 transition-transform cursor-pointer"
            >
              Giriş Yap / Kayıt Ol
            </button>
          )}
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10 pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop"
            alt="ORISE Community"
            fill
            priority
            className="object-cover opacity-20 grayscale contrast-125 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary backdrop-blur-md">
              <span>HAFTALIK ANTRENMAN TAKVİMİ</span>
            </div>
            <h1 className="font-sans text-4xl font-black tracking-tighter text-white sm:text-6xl lg:text-7xl leading-[1.05]">
              Birlikte Koş,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-300">
                Şehri Hisset.
              </span>
            </h1>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-zinc-950/80 sticky top-0 z-40 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14 py-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <Filter className="h-4 w-4 text-primary shrink-0 mr-2" />
            {BRANCHES.map((branch) => (
              <button
                key={branch}
                onClick={() => setSelectedBranch(branch)}
                className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                  selectedBranch === branch
                    ? 'bg-primary text-black shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                    : 'border border-white/10 bg-black/60 text-zinc-400 hover:border-white/30 hover:text-white'
                }`}
              >
                {branch}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-zinc-950/40 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-14">
          <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="font-sans text-2xl font-black text-white">Aktif Kulüp Buluşmaları</h2>
            <span className="text-xs font-mono text-zinc-500 uppercase">
              [{filteredEvents.length} ETKİNLİK]
            </span>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((evt) => {
              const isFree = Number(evt.price) === 0
              const alreadyJoined = myRegisteredEventIds.includes(evt.id)

              return (
                <div
                  key={evt.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-md transition-all duration-500 hover:border-primary/60 hover:bg-zinc-900/80"
                >
                  <div className="space-y-4">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-zinc-950">
                      <Image
                        src={evt.image_url || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop'}
                        alt={evt.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 rounded-full border border-primary/40 bg-black/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                        {evt.branch || 'KULÜP'}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-sans text-xl font-black text-white group-hover:text-primary transition-colors">
                        {evt.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-zinc-400 line-clamp-2">
                        {evt.description}
                      </p>
                    </div>

                    <div className="space-y-2 rounded-xl bg-black/40 p-3 border border-white/5 text-xs font-mono text-zinc-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        <span>{new Date(evt.date).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ticket className="h-3.5 w-3.5 text-primary" />
                        <span>{isFree ? 'Ücretsiz Etkinlik' : `₺${evt.price} Biletli`}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    {alreadyJoined ? (
                      <div className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 py-3.5 text-xs font-bold uppercase tracking-widest text-emerald-400">
                        <Check className="h-4 w-4" />
                        <span>Zaten Katıldın</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openRegisterModal(evt)}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-transform hover:scale-[1.02] cursor-pointer"
                      >
                        <span>{isFree ? 'Hemen Katıl' : 'Kayıt Ol & Profile Gönder'}</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {isModalOpen && selectedEvent && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-xl animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-primary tracking-widest block">
                  {selectedEvent.branch} · {Number(selectedEvent.price) === 0 ? 'ÜCRETSİZ' : `₺${selectedEvent.price}`}
                </span>
                <h3 className="font-sans text-lg font-black text-white mt-0.5">
                  {selectedEvent.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary hover:text-black transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {success ? (
              <div className="py-8 text-center space-y-3 animate-fadeIn">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <Check className="h-7 w-7" />
                </div>
                <h4 className="font-sans text-xl font-bold text-white">Ön Kayıt Başarıyla Alındı!</h4>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Etkinlik profilindeki "Katıldığım Etkinlikler" sekmesine eklendi.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Ad Soyad</label>
                  <input type="text" value={fullName} readOnly className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-xs text-white opacity-75 cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Telefon</label>
                  <input type="tel" value={phone} readOnly className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-xs text-white opacity-75 cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">E-Posta</label>
                  <input type="email" value={userEmail} readOnly className="w-full rounded-xl border border-white/10 bg-black/60 px-4 py-2.5 text-xs text-white opacity-75 cursor-not-allowed" />
                </div>

                <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4 space-y-2">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox" id="healthCheck" required checked={healthAccepted}
                      onChange={(e) => setHealthAccepted(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-zinc-700 bg-black text-primary focus:ring-primary cursor-pointer"
                    />
                    <label htmlFor="healthCheck" className="text-[11px] leading-relaxed text-zinc-300">
                      Fiziksel antrenmana katılmaya engel bir sağlık problemim olmadığını beyan ederim.{' '}
                      <button type="button" onClick={() => setIsHealthModalOpen(true)} className="text-primary underline hover:text-white cursor-pointer">
                        (Sağlık Beyanını Oku)
                      </button>
                    </label>
                  </div>
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-xs text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit" disabled={loading}
                  className="w-full rounded-full bg-primary py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-[0_0_20px_rgba(249,115,22,0.35)] hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  {loading ? 'İşleniyor...' : 'Katılımı Oluştur & Profile Gönder'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {isHealthModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl" onClick={() => setIsHealthModalOpen(false)}>
          <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-zinc-950 p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-primary font-bold text-xs uppercase flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Sağlık Beyanı</span>
              <button onClick={() => setIsHealthModalOpen(false)} className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center text-white cursor-pointer"><X className="h-4 w-4" /></button>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">Kulüp etkinliklerine katılmama engel olacak bilinen bir rahatsızlığım bulunmamaktadır. Sorumluluk tarafıma aittir.</p>
            <div className="text-right">
              <button type="button" onClick={() => { setHealthAccepted(true); setIsHealthModalOpen(false) }} className="rounded-full bg-primary px-6 py-2 text-xs font-bold uppercase text-black cursor-pointer">Onayla</button>
            </div>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          checkUserSession()
        }}
      />
    </div>
  )
}
